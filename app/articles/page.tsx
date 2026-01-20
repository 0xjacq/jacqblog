import { getArticles } from "@/lib/mdx";
import { ArticleCard } from "@/components/ArticleCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles",
  description: "Thoughts on software development, technology, and more.",
};

export default function ArticlesPage() {
  const articles = getArticles();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-4 text-3xl font-bold text-white">Articles</h1>
      <p className="mb-12 text-muted">
        Thoughts on software development, technology, and things I find
        interesting.
      </p>
      {articles.length > 0 ? (
        <div className="flex flex-col gap-8">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-muted">No articles yet. Check back soon!</p>
      )}
    </div>
  );
}
