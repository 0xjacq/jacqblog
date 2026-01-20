import { notFound } from "next/navigation";
import { getArticle, getArticles } from "@/lib/mdx";
import { MDXContent } from "@/components/MDXComponents";
import { NewsletterForm } from "@/components/NewsletterForm";
import { formatDate } from "@/lib/utils";
import { siteConfig } from "@/lib/config";
import type { Metadata } from "next";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = getArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    return {};
  }

  return {
    title: article.frontmatter.title,
    description: article.frontmatter.description,
    openGraph: {
      title: article.frontmatter.title,
      description: article.frontmatter.description,
      type: "article",
      publishedTime: article.frontmatter.date,
      authors: [siteConfig.author],
    },
    twitter: {
      card: "summary_large_image",
      title: article.frontmatter.title,
      description: article.frontmatter.description,
    },
  };
}

function TwitterIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    notFound();
  }

  const shareUrl = `${siteConfig.url}/articles/${slug}`;
  const shareText = `${article.frontmatter.title} by @jacq`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <article>
        <header className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-white">
            {article.frontmatter.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted">
            <time dateTime={article.frontmatter.date}>
              {formatDate(article.frontmatter.date)}
            </time>
            <span>&middot;</span>
            <span>{article.readingTime}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {article.frontmatter.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-border px-2.5 py-0.5 text-xs text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <MDXContent source={article.content} />

        <footer className="mt-12 border-t border-border pt-8">
          <div className="mb-8 flex items-center justify-between">
            <span className="text-sm text-muted">Share this article</span>
            <a
              href={twitterShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
            >
              <TwitterIcon />
              <span>Share on Twitter</span>
            </a>
          </div>
          <NewsletterForm />
        </footer>
      </article>
    </div>
  );
}
