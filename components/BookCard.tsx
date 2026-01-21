import Link from "next/link";
import type { Book } from "@/lib/mdx";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <article className="group">
      <Link
        href={`/books/${book.slug}`}
        className="flex items-center justify-between rounded-lg p-4 transition-colors hover:bg-border/30"
      >
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold text-white transition-colors group-hover:text-accent">
            {book.frontmatter.title}
          </h2>
          <p className="text-sm text-muted">{book.frontmatter.author}</p>
        </div>
        <span className="text-sm text-muted">{book.frontmatter.rating}/10</span>
      </Link>
    </article>
  );
}
