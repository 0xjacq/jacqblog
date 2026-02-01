import { getContent } from "@/lib/content/loader";
import { PostCard } from "@/components/PostCard";
import type { Metadata } from "next";
import type { BaseContentFrontmatter } from "@/lib/content/types";

export const metadata: Metadata = {
  title: "AI",
  description: "Thoughts on artificial intelligence, LLMs, and the future of coding.",
};

export default function AIPage() {
  const posts = getContent<BaseContentFrontmatter>("ai", {
    channel: "blog",
    published: true,
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-4 text-3xl font-bold text-white">AI</h1>
      <p className="mb-12 text-muted">
        Thoughts on artificial intelligence, LLMs, and the future of coding.
      </p>
      {posts.length > 0 ? (
        <div className="flex flex-col gap-8">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} category="ai" />
          ))}
        </div>
      ) : (
        <p className="text-muted">No posts yet. Check back soon!</p>
      )}
    </div>
  );
}
