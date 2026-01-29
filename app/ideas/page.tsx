import { getIdeasContent } from "@/lib/mdx";
import { ContentCard } from "@/components/ContentCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ideas",
  description: "Ideas for startups, side projects, and experiments.",
};

export default function IdeasPage() {
  const posts = getIdeasContent();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-4 text-3xl font-bold text-white">Ideas</h1>
      <p className="mb-12 text-muted">
        Ideas for startups, side projects, and experiments.
      </p>
      {posts.length > 0 ? (
        <div className="flex flex-col gap-8">
          {posts.map((post) => (
            <ContentCard key={post.slug} content={post} basePath="ideas" />
          ))}
        </div>
      ) : (
        <p className="text-muted">No posts yet. Check back soon!</p>
      )}
    </div>
  );
}
