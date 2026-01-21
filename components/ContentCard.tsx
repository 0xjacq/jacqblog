import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { ThematicContent } from "@/lib/mdx";

interface ContentCardProps {
  content: ThematicContent;
  basePath: string;
}

export function ContentCard({ content, basePath }: ContentCardProps) {
  return (
    <article className="group">
      <Link href={`/${basePath}/${content.slug}`} className="block">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted">
            <time dateTime={content.frontmatter.date}>
              {formatDate(content.frontmatter.date)}
            </time>
            {content.readingTime && (
              <>
                <span>&middot;</span>
                <span>{content.readingTime}</span>
              </>
            )}
          </div>
          <h2 className="text-xl font-semibold text-white transition-colors group-hover:text-accent">
            {content.frontmatter.title}
          </h2>
          <p className="text-muted">{content.frontmatter.description}</p>
          <div className="flex flex-wrap gap-2 pt-2">
            {content.frontmatter.tags?.map((tag) => (
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
