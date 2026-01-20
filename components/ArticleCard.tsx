import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { Article } from "@/lib/mdx";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="group">
      <Link href={`/articles/${article.slug}`} className="block">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted">
            <time dateTime={article.frontmatter.date}>
              {formatDate(article.frontmatter.date)}
            </time>
            <span>&middot;</span>
            <span>{article.readingTime}</span>
          </div>
          <h2 className="text-xl font-semibold text-white transition-colors group-hover:text-accent">
            {article.frontmatter.title}
          </h2>
          <p className="text-muted">{article.frontmatter.description}</p>
          <div className="flex flex-wrap gap-2 pt-2">
            {article.frontmatter.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-border px-2.5 py-0.5 text-xs text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
}
