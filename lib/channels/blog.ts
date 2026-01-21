import type { Article, Update, BaseContentFrontmatter } from "../content/types";
import { siteConfig } from "../config";

/**
 * Generate the canonical URL for content
 */
export function getContentUrl(
  slug: string,
  type: "article" | "update" | "project" | "book"
): string {
  const paths: Record<string, string> = {
    article: "articles",
    update: "updates",
    project: "projects",
    book: "books",
  };

  return `${siteConfig.url}/${paths[type]}/${slug}`;
}

/**
 * Generate SEO-friendly excerpt from content
 */
export function generateExcerpt(content: string, maxLength = 160): string {
  // Remove MDX-specific content
  const clean = content
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, "")
    // Remove inline code
    .replace(/`[^`]+`/g, "")
    // Remove images
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    // Remove links but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Remove headers
    .replace(/^#{1,6}\s+/gm, "")
    // Remove emphasis
    .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, "$1")
    // Remove blockquotes
    .replace(/^>\s+/gm, "")
    // Normalize whitespace
    .replace(/\s+/g, " ")
    .trim();

  if (clean.length <= maxLength) {
    return clean;
  }

  // Cut at last complete word before maxLength
  const truncated = clean.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  return `${truncated.slice(0, lastSpace)}...`;
}

/**
 * Generate structured data (JSON-LD) for an article
 */
export function generateArticleSchema(
  article: Article | Update,
  type: "article" | "update"
): object {
  const url = getContentUrl(article.slug, type);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.frontmatter.title,
    description: article.frontmatter.description,
    author: {
      "@type": "Person",
      name: siteConfig.author,
      url: siteConfig.url,
    },
    datePublished: article.frontmatter.date,
    url,
    publisher: {
      "@type": "Person",
      name: siteConfig.author,
      url: siteConfig.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

/**
 * Get reading time estimate for content
 */
export function getReadingTime(content: string): {
  minutes: number;
  text: string;
} {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);

  return {
    minutes,
    text: `${minutes} min read`,
  };
}

/**
 * Check if content should be displayed on the blog
 */
export function isVisibleOnBlog<T extends BaseContentFrontmatter>(
  frontmatter: T
): boolean {
  // If no channels configured, default to visible
  if (!frontmatter.channels) {
    return frontmatter.published;
  }

  // Check explicit blog channel config
  if (frontmatter.channels.blog) {
    return frontmatter.channels.blog.enabled && frontmatter.published;
  }

  // Default to visible if published
  return frontmatter.published;
}

/**
 * Format content type for display
 */
export function formatContentType(type: string): string {
  return type
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
