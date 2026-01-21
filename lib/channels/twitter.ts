import crypto from "crypto";
import type { BaseContentFrontmatter, Article } from "../content/types";

const TWITTER_CHAR_LIMIT = 280;
const THREAD_BUFFER = 20; // Buffer for thread continuation text

/**
 * Split content into Twitter-friendly segments for a thread
 */
export function contentToThread(
  content: string,
  frontmatter: BaseContentFrontmatter
): string[] {
  // Clean MDX content - remove code blocks, links, etc.
  const cleanContent = cleanMDXForTwitter(content);

  // Start with title/intro tweet
  const introTweet = generateIntroTweet(frontmatter);
  const segments: string[] = [introTweet];

  // Split remaining content into segments
  const paragraphs = cleanContent
    .split(/\n\n+/)
    .filter((p) => p.trim().length > 0);

  let currentSegment = "";

  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim();

    // If adding this paragraph would exceed limit, save current and start new
    if (
      currentSegment.length + trimmed.length + 2 >
      TWITTER_CHAR_LIMIT - THREAD_BUFFER
    ) {
      if (currentSegment) {
        segments.push(currentSegment.trim());
      }
      // If paragraph itself is too long, split it
      if (trimmed.length > TWITTER_CHAR_LIMIT - THREAD_BUFFER) {
        const splitParagraph = splitLongText(
          trimmed,
          TWITTER_CHAR_LIMIT - THREAD_BUFFER
        );
        segments.push(...splitParagraph);
        currentSegment = "";
      } else {
        currentSegment = trimmed;
      }
    } else {
      currentSegment = currentSegment
        ? `${currentSegment}\n\n${trimmed}`
        : trimmed;
    }
  }

  // Don't forget the last segment
  if (currentSegment) {
    segments.push(currentSegment.trim());
  }

  return segments;
}

/**
 * Clean MDX content for Twitter
 */
function cleanMDXForTwitter(content: string): string {
  return (
    content
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, "[code]")
      // Convert inline code to plain text
      .replace(/`([^`]+)`/g, "$1")
      // Convert links to just text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      // Remove images
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, "")
      // Remove headers markdown
      .replace(/^#{1,6}\s+/gm, "")
      // Remove bold/italic markers
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/__([^_]+)__/g, "$1")
      .replace(/_([^_]+)_/g, "$1")
      // Remove blockquotes
      .replace(/^>\s+/gm, "")
      // Remove list markers
      .replace(/^[-*+]\s+/gm, "• ")
      .replace(/^\d+\.\s+/gm, "")
      // Clean up extra whitespace
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}

/**
 * Generate intro tweet from frontmatter
 */
function generateIntroTweet(frontmatter: BaseContentFrontmatter): string {
  const title = frontmatter.title;
  const tags = frontmatter.tags.slice(0, 3).map((t) => `#${t}`);

  let tweet = `🧵 ${title}`;

  if (frontmatter.description) {
    const desc = frontmatter.description;
    if (tweet.length + desc.length + 4 <= TWITTER_CHAR_LIMIT - 30) {
      tweet += `\n\n${desc}`;
    }
  }

  // Add hashtags if space allows
  const tagString = tags.join(" ");
  if (tweet.length + tagString.length + 2 <= TWITTER_CHAR_LIMIT) {
    tweet += `\n\n${tagString}`;
  }

  return tweet;
}

/**
 * Split long text into segments that fit Twitter's limit
 */
function splitLongText(text: string, maxLength: number): string[] {
  const segments: string[] = [];
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

  let current = "";

  for (const sentence of sentences) {
    if (current.length + sentence.length > maxLength) {
      if (current) segments.push(current.trim());
      current = sentence.trim();
    } else {
      current += sentence;
    }
  }

  if (current) segments.push(current.trim());

  return segments;
}

/**
 * Generate a share tweet for an article/update
 */
export function generateShareTweet(
  article: Article,
  baseUrl: string
): string {
  const url = `${baseUrl}/articles/${article.slug}`;
  const title = article.frontmatter.title;
  const tags = article.frontmatter.tags
    .slice(0, 2)
    .map((t) => `#${t.replace(/\s+/g, "")}`)
    .join(" ");

  // Calculate available space for title
  const urlLength = 23; // Twitter shortens URLs to ~23 chars
  const tagsLength = tags.length + 2;
  const available = TWITTER_CHAR_LIMIT - urlLength - tagsLength - 10;

  let tweet = title.length > available ? `${title.slice(0, available - 3)}...` : title;

  if (tags) {
    tweet += `\n\n${tags}`;
  }

  tweet += `\n\n${url}`;

  return tweet;
}

/**
 * Twitter API client
 * Uses OAuth 1.0a User Context
 */
export interface TwitterCredentials {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessSecret: string;
}

export interface TweetResult {
  id: string;
  text: string;
}

/**
 * Post a single tweet
 */
export async function postTweet(
  text: string,
  credentials: TwitterCredentials,
  replyToId?: string
): Promise<TweetResult> {
  const endpoint = "https://api.twitter.com/2/tweets";

  const body: { text: string; reply?: { in_reply_to_tweet_id: string } } = {
    text,
  };

  if (replyToId) {
    body.reply = { in_reply_to_tweet_id: replyToId };
  }

  // Generate OAuth 1.0a signature
  const authHeader = generateOAuthHeader(
    "POST",
    endpoint,
    credentials
  );

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Twitter API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return {
    id: data.data.id,
    text: data.data.text,
  };
}

/**
 * Post a thread (multiple tweets as replies)
 */
export async function postThread(
  segments: string[],
  credentials: TwitterCredentials
): Promise<TweetResult[]> {
  const results: TweetResult[] = [];
  let previousId: string | undefined;

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    // Add thread counter for longer threads
    const text =
      segments.length > 3
        ? `${segment}\n\n(${i + 1}/${segments.length})`
        : segment;

    const result = await postTweet(text, credentials, previousId);
    results.push(result);
    previousId = result.id;

    // Rate limiting: wait between tweets
    if (i < segments.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return results;
}

/**
 * Generate OAuth 1.0a Authorization header
 * Simplified implementation - in production, use a library like oauth-1.0a
 */
function generateOAuthHeader(
  method: string,
  url: string,
  credentials: TwitterCredentials
): string {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomBytes(16).toString("hex");

  const params: Record<string, string> = {
    oauth_consumer_key: credentials.apiKey,
    oauth_nonce: nonce,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: timestamp,
    oauth_token: credentials.accessToken,
    oauth_version: "1.0",
  };

  // Create signature base string
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join("&");

  const signatureBase = [
    method.toUpperCase(),
    encodeURIComponent(url),
    encodeURIComponent(sortedParams),
  ].join("&");

  // Create signing key
  const signingKey = `${encodeURIComponent(credentials.apiSecret)}&${encodeURIComponent(credentials.accessSecret)}`;

  // Generate signature
  const signature = crypto
    .createHmac("sha1", signingKey)
    .update(signatureBase)
    .digest("base64");

  params.oauth_signature = signature;

  // Build header
  const headerParams = Object.keys(params)
    .sort()
    .map((key) => `${encodeURIComponent(key)}="${encodeURIComponent(params[key])}"`)
    .join(", ");

  return `OAuth ${headerParams}`;
}

/**
 * Get Twitter credentials from environment
 */
export function getTwitterCredentials(): TwitterCredentials | null {
  const apiKey = process.env.TWITTER_API_KEY;
  const apiSecret = process.env.TWITTER_API_SECRET;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN;
  const accessSecret = process.env.TWITTER_ACCESS_SECRET;

  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    return null;
  }

  return {
    apiKey,
    apiSecret,
    accessToken,
    accessSecret,
  };
}
