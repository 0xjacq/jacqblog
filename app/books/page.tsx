import { getBooks } from "@/lib/mdx";
import { BookCard } from "@/components/BookCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Books",
  description: "Books I've read with notes and reviews.",
};

export default function BooksPage() {
  const books = getBooks();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-12 text-3xl font-bold text-white">Books</h1>
      {books.length > 0 ? (
        <div className="flex flex-col gap-2">
          {books.map((book) => (
            <BookCard key={book.slug} book={book} />
          ))}
        </div>
      ) : (
        <p className="text-muted">No books yet. Check back soon!</p>
      )}
    </div>
  );
}
