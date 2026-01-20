import RSS from "rss";
import { getArticles } from "@/lib/mdx";
import { siteConfig } from "@/lib/config";

export async function GET() {
  const articles = getArticles();

  const feed = new RSS({
    title: siteConfig.title,
    description: siteConfig.description,
    site_url: siteConfig.url,
    feed_url: `${siteConfig.url}/rss.xml`,
    language: "en",
    pubDate: new Date(),
  });

  articles.forEach((article) => {
    feed.item({
      title: article.frontmatter.title,
      description: article.frontmatter.description,
      url: `${siteConfig.url}/articles/${article.slug}`,
      date: new Date(article.frontmatter.date),
      categories: article.frontmatter.tags,
    });
  });

  return new Response(feed.xml({ indent: true }), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
