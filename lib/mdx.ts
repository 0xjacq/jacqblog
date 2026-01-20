import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const contentDirectory = path.join(process.cwd(), "content");

export interface ArticleFrontmatter {
  title: string;
  date: string;
  description: string;
  tags: string[];
  published: boolean;
}

export interface Article {
  slug: string;
  frontmatter: ArticleFrontmatter;
  content: string;
  readingTime: string;
}

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
  dateRead: string;
  cover?: string;
}

export interface Book {
  slug: string;
  frontmatter: BookFrontmatter;
  content: string;
}

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

export function getArticles(): Article[] {
  const articlesDir = path.join(contentDirectory, "articles");
  const files = getMDXFiles(articlesDir);

  const articles = files.map((file) => {
    const slug = file.replace(".mdx", "");
    const filePath = path.join(articlesDir, file);
    const { frontmatter, content } = readMDXFile<ArticleFrontmatter>(filePath);
    const stats = readingTime(content);

    return {
      slug,
      frontmatter,
      content,
      readingTime: stats.text,
    };
  });

  return articles
    .filter((article) => article.frontmatter.published)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );
}

export function getArticle(slug: string): Article | undefined {
  const articles = getArticles();
  return articles.find((article) => article.slug === slug);
}

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

  return books.sort(
    (a, b) =>
      new Date(b.frontmatter.dateRead).getTime() -
      new Date(a.frontmatter.dateRead).getTime()
  );
}

export function getBook(slug: string): Book | undefined {
  const books = getBooks();
  return books.find((book) => book.slug === slug);
}

export function getAllTags(): string[] {
  const articles = getArticles();
  const tags = new Set<string>();
  articles.forEach((article) => {
    article.frontmatter.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}
