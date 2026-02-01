import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type {
  ContentCategory,
  ContentFilters,
  Content,
  BaseContentFrontmatter,
  Channel,
} from "./types";

const contentDirectory = path.join(process.cwd(), "content");

// Map category to directory name
const categoryDirs: Record<ContentCategory, string> = {
  article: "articles",
  project: "projects",
  book: "books",
  music: "music",
  biohacking: "biohacking",
  security: "security",
  idea: "ideas",
  finance: "finance",
};

function getMDXFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs.readdirSync(dir).filter((file) => file.endsWith(".mdx"));
}

function readMDXFile<T>(filePath: string): { frontmatter: T; content: string } {
  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(rawContent);
  return {
    frontmatter: data as T,
    content,
  };
}

// Check if content should be visible on a specific channel
function isVisibleOnChannel<T extends BaseContentFrontmatter>(
  frontmatter: T,
  channel?: Channel
): boolean {
  // If no channel filter, check general published status
  if (!channel) {
    return true;
  }

  // If content has channel config, check if enabled for that channel
  if (frontmatter.channels?.[channel]) {
    return frontmatter.channels[channel]?.enabled ?? false;
  }

  // Fallback: if no channel config, consider it visible on blog by default
  if (channel === "blog") {
    return true;
  }

  return false;
}

// Generic content loader
export function getContent<T extends BaseContentFrontmatter>(
  category: ContentCategory,
  filters?: ContentFilters
): Content<T>[] {
  const dir = path.join(contentDirectory, categoryDirs[category]);
  const files = getMDXFiles(dir);

  const contents = files.map((file) => {
    const slug = file.replace(".mdx", "");
    const filePath = path.join(dir, file);
    const { frontmatter, content } = readMDXFile<T>(filePath);
    const stats = readingTime(content);

    return {
      slug,
      frontmatter,
      content,
      readingTime: stats.text,
      category,
    };
  });

  // Apply filters
  let filtered = contents;

  // Filter by published status
  if (filters?.published !== undefined) {
    filtered = filtered.filter(
      (item) => item.frontmatter.published === filters.published
    );
  }

  // Filter by channel visibility
  if (filters?.channel) {
    filtered = filtered.filter((item) =>
      isVisibleOnChannel(item.frontmatter, filters.channel)
    );
  }

  // Filter by content type
  if (filters?.contentType) {
    filtered = filtered.filter(
      (item) => item.frontmatter.contentType === filters.contentType
    );
  }

  // Sort by date (newest first)
  return filtered.sort((a, b) => {
    const dateA = new Date(a.frontmatter.date).getTime();
    const dateB = new Date(b.frontmatter.date).getTime();
    return dateB - dateA;
  });
}

// Get single content by slug
export function getContentBySlug<T extends BaseContentFrontmatter>(
  category: ContentCategory,
  slug: string
): Content<T> | undefined {
  const dir = path.join(contentDirectory, categoryDirs[category]);
  const filePath = path.join(dir, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return undefined;
  }

  const { frontmatter, content } = readMDXFile<T>(filePath);
  const stats = readingTime(content);

  return {
    slug,
    frontmatter,
    content,
    readingTime: stats.text,
  };
}

// Get all content across categories (for unified feeds)
export function getAllContent<T extends BaseContentFrontmatter>(
  categories: ContentCategory[],
  filters?: ContentFilters
): Content<T>[] {
  const allContent: Content<T>[] = [];

  for (const category of categories) {
    const content = getContent<T>(category, filters);
    allContent.push(...content);
  }

  // Sort combined content by date
  return allContent.sort((a, b) => {
    const dateA = new Date(a.frontmatter.date).getTime();
    const dateB = new Date(b.frontmatter.date).getTime();
    return dateB - dateA;
  });
}

// Get all unique tags across a category
export function getTagsForCategory(category: ContentCategory): string[] {
  const content = getContent<BaseContentFrontmatter>(category, {
    published: true,
  });
  const tags = new Set<string>();

  content.forEach((item) => {
    item.frontmatter.tags?.forEach((tag) => tags.add(tag));
  });

  return Array.from(tags).sort();
}

// Helper to get channels where content is published
export function getPublishedChannels<T extends BaseContentFrontmatter>(
  frontmatter: T
): Channel[] {
  const channels: Channel[] = [];

  if (frontmatter.channels?.blog?.enabled) {
    channels.push("blog");
  }
  if (frontmatter.channels?.twitter?.enabled) {
    channels.push("twitter");
  }

  // If no channels configured, default to blog
  if (channels.length === 0 && frontmatter.published) {
    channels.push("blog");
  }

  return channels;
}
