// Channel types
export type Channel = "blog" | "twitter";
export type ContentCategory = "ai" | "project" | "book" | "music" | "biohacking" | "security" | "idea" | "finance";
export type ContentType =
  | "tutorial"
  | "deep-dive"
  | "case-study"
  | "announcement"
  | "build-in-public"
  | "quick-tip"
  | "project-showcase";

// Channel configurations
export interface ChannelConfig {
  enabled: boolean;
  publishedAt?: string;
}

export interface BlogChannelConfig extends ChannelConfig {
  format?: "full" | "micro";
}

export interface TwitterChannelConfig extends ChannelConfig {
  tweetId?: string;
  format?: "single" | "thread";
  customText?: string;
}

export interface ChannelsConfig {
  blog?: BlogChannelConfig;
  twitter?: TwitterChannelConfig;
}

// Base frontmatter with channel support
export interface BaseContentFrontmatter {
  title: string;
  date: string;
  description: string;
  contentType?: ContentType;
  tags: string[];
  published: boolean;
  channels?: ChannelsConfig;
}

// Article-specific frontmatter
export type ArticleFrontmatter = BaseContentFrontmatter;

// Project frontmatter (different structure)
export interface ProjectFrontmatter {
  title: string;
  description: string;
  url?: string;
  github?: string;
  tags: string[];
  featured: boolean;
  contentType?: ContentType;
  channels?: ChannelsConfig;
}

// Book frontmatter (different structure)
export interface BookFrontmatter {
  title: string;
  author: string;
  rating: number;
  dateRead: string;
  cover?: string;
  channels?: ChannelsConfig;
}

// Generic content wrapper
export interface Content<T> {
  slug: string;
  frontmatter: T;
  content: string;
  readingTime?: string;
  category?: ContentCategory;
}

// Content type aliases
export type Article = Content<ArticleFrontmatter> & { readingTime: string };
export type Project = Content<ProjectFrontmatter>;
export type Book = Content<BookFrontmatter>;

// Filter options for content queries
export interface ContentFilters {
  channel?: Channel;
  published?: boolean;
  contentType?: ContentType;
}

// Content type labels for display
export const contentTypeLabels: Record<ContentType, string> = {
  "tutorial": "Tutorial",
  "deep-dive": "Deep Dive",
  "case-study": "Case Study",
  "announcement": "Announcement",
  "build-in-public": "Build in Public",
  "quick-tip": "Quick Tip",
  "project-showcase": "Project Showcase",
};

// Channel labels for display
export const channelLabels: Record<Channel, string> = {
  blog: "Blog",
  twitter: "Twitter",
};
