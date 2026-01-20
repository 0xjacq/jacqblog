import { getArticles, getProjects, getBooks } from "@/lib/mdx";
import { siteConfig } from "@/lib/config";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getArticles();
  const projects = getProjects();
  const books = getBooks();

  const articleEntries = articles.map((article) => ({
    url: `${siteConfig.url}/articles/${article.slug}`,
    lastModified: new Date(article.frontmatter.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const projectEntries = projects.map((project) => ({
    url: `${siteConfig.url}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const bookEntries = books.map((book) => ({
    url: `${siteConfig.url}/books/${book.slug}`,
    lastModified: new Date(book.frontmatter.dateRead),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/articles`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/projects`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/books`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    ...articleEntries,
    ...projectEntries,
    ...bookEntries,
  ];
}
