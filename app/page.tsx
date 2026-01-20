import Link from "next/link";
import { getArticles } from "@/lib/mdx";
import { ArticleCard } from "@/components/ArticleCard";
import { siteConfig } from "@/lib/config";

export default function Home() {
  const articles = getArticles().slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <section className="mb-16">
        <h1 className="mb-4 text-4xl font-bold text-white">
          Hey, I&apos;m {siteConfig.name}
        </h1>
        <p className="mb-6 text-lg text-muted">
          I&apos;m a passionate creator who writes articles, reads books, builds
          applications, and shares knowledge. Welcome to my corner of the
          internet.
        </p>
        <div className="flex gap-4">
          <a
            href={siteConfig.links.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Twitter
          </a>
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            GitHub
          </a>
        </div>
      </section>

      <section>
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Recent Articles</h2>
          <Link href="/articles" className="text-sm text-accent hover:underline">
            View all
          </Link>
        </div>
        {articles.length > 0 ? (
          <div className="flex flex-col gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        ) : (
          <p className="text-muted">No articles yet. Check back soon!</p>
        )}
      </section>
    </div>
  );
}
