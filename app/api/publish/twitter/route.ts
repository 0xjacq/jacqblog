import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  contentToThread,
  postThread,
  getTwitterCredentials,
} from "@/lib/channels/twitter";
import { getContentBySlug } from "@/lib/content/loader";
import type {
  ContentCategory,
  BaseContentFrontmatter,
} from "@/lib/content/types";

interface PublishRequest {
  slug: string;
  category: ContentCategory;
  format?: "single" | "thread";
}

export async function POST(request: NextRequest) {
  try {
    const body: PublishRequest = await request.json();
    const { slug, category, format = "thread" } = body;

    // Validate credentials
    const credentials = getTwitterCredentials();
    if (!credentials) {
      return NextResponse.json(
        { error: "Twitter credentials not configured" },
        { status: 500 }
      );
    }

    // Get the content
    const content = getContentBySlug<BaseContentFrontmatter>(category, slug);
    if (!content) {
      return NextResponse.json(
        { error: `Content not found: ${category}/${slug}` },
        { status: 404 }
      );
    }

    // Check if Twitter is enabled for this content
    if (!content.frontmatter.channels?.twitter?.enabled) {
      return NextResponse.json(
        { error: "Twitter channel not enabled for this content" },
        { status: 400 }
      );
    }

    // Check if already published
    if (content.frontmatter.channels.twitter.tweetId) {
      return NextResponse.json(
        {
          error: "Already published to Twitter",
          tweetId: content.frontmatter.channels.twitter.tweetId,
        },
        { status: 400 }
      );
    }

    // Convert content to thread segments
    const segments = contentToThread(content.content, content.frontmatter);

    // Limit to reasonable thread length
    const maxSegments = format === "single" ? 1 : 10;
    const truncatedSegments = segments.slice(0, maxSegments);

    // Post to Twitter
    const results = await postThread(truncatedSegments, credentials);
    const firstTweetId = results[0]?.id;

    if (!firstTweetId) {
      return NextResponse.json(
        { error: "Failed to post to Twitter" },
        { status: 500 }
      );
    }

    // Update the frontmatter with tweet ID
    await updateFrontmatterWithTweetId(category, slug, firstTweetId);

    return NextResponse.json({
      success: true,
      tweetId: firstTweetId,
      tweetCount: results.length,
      tweets: results.map((r) => ({
        id: r.id,
        url: `https://twitter.com/i/web/status/${r.id}`,
      })),
    });
  } catch (error) {
    console.error("Twitter publish error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * Update the MDX file's frontmatter with the tweet ID
 */
async function updateFrontmatterWithTweetId(
  category: ContentCategory,
  slug: string,
  tweetId: string
): Promise<void> {
  const categoryDirs: Record<ContentCategory, string> = {
    article: "articles",
    project: "projects",
    book: "books",
    music: "music",
    biohacking: "biohacking",
    security: "security",
    idea: "ideas",
  };

  const filePath = path.join(
    process.cwd(),
    "content",
    categoryDirs[category],
    `${slug}.mdx`
  );

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data: frontmatter, content } = matter(fileContent);

  // Update the Twitter channel config
  if (!frontmatter.channels) {
    frontmatter.channels = {};
  }
  if (!frontmatter.channels.twitter) {
    frontmatter.channels.twitter = { enabled: true };
  }

  frontmatter.channels.twitter.tweetId = tweetId;
  frontmatter.channels.twitter.publishedAt = new Date().toISOString();

  // Reconstruct the file
  const updatedContent = matter.stringify(content, frontmatter);
  fs.writeFileSync(filePath, updatedContent, "utf-8");
}

/**
 * GET endpoint to check Twitter config status
 */
export async function GET() {
  const credentials = getTwitterCredentials();

  return NextResponse.json({
    configured: !!credentials,
    hasApiKey: !!process.env.TWITTER_API_KEY,
    hasApiSecret: !!process.env.TWITTER_API_SECRET,
    hasAccessToken: !!process.env.TWITTER_ACCESS_TOKEN,
    hasAccessSecret: !!process.env.TWITTER_ACCESS_SECRET,
  });
}
