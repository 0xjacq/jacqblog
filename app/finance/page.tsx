import { getFinanceContent } from "@/lib/mdx";
import { ContentCard } from "@/components/ContentCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Finance",
  description: "Market analysis, investing, and financial deep dives.",
};

export default function FinancePage() {
  const posts = getFinanceContent();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-4 text-3xl font-bold text-white">Finance</h1>
      <p className="mb-12 text-muted">
        Market analysis, investing, and financial deep dives.
      </p>
      {posts.length > 0 ? (
        <div className="flex flex-col gap-8">
          {posts.map((post) => (
            <ContentCard key={post.slug} content={post} basePath="finance" />
          ))}
        </div>
      ) : (
        <p className="text-muted">No posts yet. Check back soon!</p>
      )}
    </div>
  );
}
