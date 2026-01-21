import { getAllContent } from "@/lib/content/loader";
import { PostCard } from "@/components/PostCard";
import type { Metadata } from "next";
import type { BaseContentFrontmatter } from "@/lib/content/types";

export const metadata: Metadata = {
  title: "Articles",
  description: "Thoughts on software development, technology, and more.",
};

export default function ArticlesPage() {
  const posts = getAllContent<BaseContentFrontmatter>(
    ["article", "security", "music", "biohacking"],
    { channel: "blog", published: true }
  );

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-4 text-3xl font-bold text-white">Articles</h1>
      <p className="mb-12 text-muted">
        Thoughts on software development, technology, and things I find
        interesting.
      </p>
      {posts.length > 0 ? (
        <div className="flex flex-col gap-8">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} category={post.category!} />
          ))}
        </div>
      ) : (
        <p className="text-muted">No articles yet. Check back soon!</p>
      )}
    </div>
  );
}
