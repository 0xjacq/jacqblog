import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { BaseContentFrontmatter, ContentCategory } from "@/lib/content/types";

interface PostCardProps {
  post: {
    slug: string;
    frontmatter: BaseContentFrontmatter;
    readingTime?: string;
  };
  category: ContentCategory;
}

const categoryPaths: Record<ContentCategory, string> = {
  article: "articles",
  security: "security",
  music: "music",
  biohacking: "biohacking",
  project: "projects",
  book: "books",
  idea: "ideas",
};

export function PostCard({ post, category }: PostCardProps) {
  const path = categoryPaths[category];

  return (
    <article className="group">
      <Link href={`/${path}/${post.slug}`} className="block">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted">
            <time dateTime={post.frontmatter.date}>
              {formatDate(post.frontmatter.date)}
            </time>
            {post.readingTime && (
              <>
                <span>&middot;</span>
                <span>{post.readingTime}</span>
              </>
            )}
          </div>
          <h2 className="text-xl font-semibold text-white transition-colors group-hover:text-accent">
            {post.frontmatter.title}
          </h2>
          <p className="text-muted">{post.frontmatter.description}</p>
          {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {post.frontmatter.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-border px-2.5 py-0.5 text-xs text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
