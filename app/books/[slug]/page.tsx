import { notFound } from "next/navigation";
import Image from "next/image";
import { getBook, getBooks } from "@/lib/mdx";
import { MDXContent } from "@/components/MDXComponents";
import type { Metadata } from "next";

interface BookPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const books = getBooks();
  return books.map((book) => ({
    slug: book.slug,
  }));
}

export async function generateMetadata({
  params,
}: BookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = getBook(slug);

  if (!book) {
    return {};
  }

  return {
    title: `${book.frontmatter.title} by ${book.frontmatter.author}`,
    description: `Review of ${book.frontmatter.title} by ${book.frontmatter.author}`,
  };
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
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
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon key={star} filled={star <= rating} />
      ))}
    </div>
  );
}

export default async function BookPage({ params }: BookPageProps) {
  const { slug } = await params;
  const book = getBook(slug);

  if (!book) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <article>
        <header className="mb-8 flex gap-6">
          {book.frontmatter.cover ? (
            <div className="relative h-48 w-36 flex-shrink-0 overflow-hidden rounded-lg">
              <Image
                src={book.frontmatter.cover}
                alt={book.frontmatter.title}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-48 w-36 flex-shrink-0 items-center justify-center rounded-lg bg-border">
              <span className="text-4xl">📚</span>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-white">
              {book.frontmatter.title}
            </h1>
            <p className="text-lg text-muted">{book.frontmatter.author}</p>
            <Rating rating={book.frontmatter.rating} />
            <p className="text-sm text-muted">
              Read: {book.frontmatter.dateRead}
            </p>
          </div>
        </header>

        {book.content.trim() && <MDXContent source={book.content} />}
      </article>
    </div>
  );
}
