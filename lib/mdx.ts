import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  getContent,
  getContentBySlug,
  getTagsForCategory,
} from "./content/loader";
import type {
  ArticleFrontmatter,
  UpdateFrontmatter,
  Article,
  Update,
  Channel,
  BaseContentFrontmatter,
} from "./content/types";

// Re-export types for backward compatibility
export type {
  ArticleFrontmatter,
  Article,
  UpdateFrontmatter,
  Update,
} from "./content/types";

const contentDirectory = path.join(process.cwd(), "content");

// ============================================
// Project and Book types (kept for compatibility)
// ============================================

export interface ProjectFrontmatter {
  title: string;
  description: string;
  url?: string;
  github?: string;
  tags: string[];
  featured: boolean;
}

export interface Project {
  slug: string;
  frontmatter: ProjectFrontmatter;
  content: string;
}

export interface BookFrontmatter {
  title: string;
  author: string;
  rating: number;
  dateRead?: string;
  cover?: string;
}

export interface Book {
  slug: string;
  frontmatter: BookFrontmatter;
  content: string;
}

// ============================================
// Helper functions
// ============================================

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

// ============================================
// Articles (using new loader with backward compatibility)
// ============================================

export function getArticles(): Article[] {
  return getContent<ArticleFrontmatter>("article", {
    channel: "blog",
    published: true,
  }) as Article[];
}

export function getArticle(slug: string): Article | undefined {
  const article = getContentBySlug<ArticleFrontmatter>("article", slug);
  if (!article || !article.frontmatter.published) {
    return undefined;
  }
  return article as Article;
}

// ============================================
// Updates (new)
// ============================================

export function getUpdates(channel?: Channel): Update[] {
  return getContent<UpdateFrontmatter>("update", {
    channel,
    published: true,
  }) as Update[];
}

export function getUpdate(slug: string): Update | undefined {
  const update = getContentBySlug<UpdateFrontmatter>("update", slug);
  if (!update || !update.frontmatter.published) {
    return undefined;
  }
  return update as Update;
}

// ============================================
// Projects (keeping original implementation for full compatibility)
// ============================================

export function getProjects(): Project[] {
  const projectsDir = path.join(contentDirectory, "projects");
  const files = getMDXFiles(projectsDir);

  const projects = files.map((file) => {
    const slug = file.replace(".mdx", "");
    const filePath = path.join(projectsDir, file);
    const { frontmatter, content } = readMDXFile<ProjectFrontmatter>(filePath);

    return {
      slug,
      frontmatter,
      content,
    };
  });

  return projects.sort((a, b) => {
    if (a.frontmatter.featured && !b.frontmatter.featured) return -1;
    if (!a.frontmatter.featured && b.frontmatter.featured) return 1;
    return 0;
  });
}

export function getProject(slug: string): Project | undefined {
  const projects = getProjects();
  return projects.find((project) => project.slug === slug);
}

// ============================================
// Books (keeping original implementation for full compatibility)
// ============================================

export function getBooks(): Book[] {
  const booksDir = path.join(contentDirectory, "books");
  const files = getMDXFiles(booksDir);

  const books = files.map((file) => {
    const slug = file.replace(".mdx", "");
    const filePath = path.join(booksDir, file);
    const { frontmatter, content } = readMDXFile<BookFrontmatter>(filePath);

    return {
      slug,
      frontmatter,
      content,
    };
  });

  return books.sort((a, b) => {
    // Sort by rating (highest first), then alphabetically by title
    if (b.frontmatter.rating !== a.frontmatter.rating) {
      return b.frontmatter.rating - a.frontmatter.rating;
    }
    return a.frontmatter.title.localeCompare(b.frontmatter.title);
  });
}

export function getBook(slug: string): Book | undefined {
  const books = getBooks();
  return books.find((book) => book.slug === slug);
}

// ============================================
// Tags
// ============================================

export function getAllTags(): string[] {
  return getTagsForCategory("article");
}

export function getUpdateTags(): string[] {
  return getTagsForCategory("update");
}

// ============================================
// Thematic Categories (Music, Biohacking, Security)
// ============================================

export interface ThematicContent {
  slug: string;
  frontmatter: BaseContentFrontmatter;
  content: string;
  readingTime?: string;
}

export function getMusicContent(): ThematicContent[] {
  return getContent<BaseContentFrontmatter>("music", {
    channel: "blog",
    published: true,
  });
}

export function getMusicPost(slug: string): ThematicContent | undefined {
  const post = getContentBySlug<BaseContentFrontmatter>("music", slug);
  if (!post || !post.frontmatter.published) {
    return undefined;
  }
  return post;
}

export function getBiohackingContent(): ThematicContent[] {
  return getContent<BaseContentFrontmatter>("biohacking", {
    channel: "blog",
    published: true,
  });
}

export function getBiohackingPost(slug: string): ThematicContent | undefined {
  const post = getContentBySlug<BaseContentFrontmatter>("biohacking", slug);
  if (!post || !post.frontmatter.published) {
    return undefined;
  }
  return post;
}

export function getSecurityContent(): ThematicContent[] {
  return getContent<BaseContentFrontmatter>("security", {
    channel: "blog",
    published: true,
  });
}

export function getSecurityPost(slug: string): ThematicContent | undefined {
  const post = getContentBySlug<BaseContentFrontmatter>("security", slug);
  if (!post || !post.frontmatter.published) {
    return undefined;
  }
  return post;
}

export function getIdeasContent(): ThematicContent[] {
  return getContent<BaseContentFrontmatter>("idea", {
    channel: "blog",
    published: true,
  });
}

export function getIdeasPost(slug: string): ThematicContent | undefined {
  const post = getContentBySlug<BaseContentFrontmatter>("idea", slug);
  if (!post || !post.frontmatter.published) {
    return undefined;
  }
  return post;
}
