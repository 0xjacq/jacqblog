import Link from "next/link";
import Image from "next/image";
import type { Book } from "@/lib/mdx";

interface BookCardProps {
  book: Book;
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={filled ? "text-yellow-500" : "text-muted"}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function Rating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon key={star} filled={star <= rating} />
      ))}
    </div>
  );
}

export function BookCard({ book }: BookCardProps) {
  return (
    <article className="group">
      <Link
        href={`/books/${book.slug}`}
        className="flex gap-4 rounded-lg p-4 transition-colors hover:bg-border/30"
      >
        {book.frontmatter.cover ? (
          <div className="relative h-32 w-24 flex-shrink-0 overflow-hidden rounded">
            <Image
              src={book.frontmatter.cover}
              alt={book.frontmatter.title}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-32 w-24 flex-shrink-0 items-center justify-center rounded bg-border">
            <span className="text-2xl">📚</span>
          </div>
        )}
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold text-white transition-colors group-hover:text-accent">
            {book.frontmatter.title}
          </h2>
          <p className="text-sm text-muted">{book.frontmatter.author}</p>
          <Rating rating={book.frontmatter.rating} />
          <p className="mt-auto text-xs text-muted">
            Read: {book.frontmatter.dateRead}
          </p>
        </div>
      </Link>
    </article>
  );
}
