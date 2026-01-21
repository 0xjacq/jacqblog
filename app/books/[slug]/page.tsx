import { notFound } from "next/navigation";
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

export default async function BookPage({ params }: BookPageProps) {
  const { slug } = await params;
  const book = getBook(slug);

  if (!book) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <article>
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            {book.frontmatter.title}
          </h1>
          <p className="mt-1 text-lg text-muted">{book.frontmatter.author}</p>
          <p className="mt-2 text-muted">{book.frontmatter.rating}/10</p>
        </header>

        {book.content.trim() && <MDXContent source={book.content} />}
      </article>
    </div>
  );
}
