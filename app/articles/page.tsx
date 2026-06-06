import { getAllContent } from "@/lib/content/loader";
import { PostCard } from "@/components/PostCard";
import type { BaseContentFrontmatter } from "@/lib/content/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Articles",
  description: "Browse all articles sorted by date",
};

export default function ArticlesPage() {
  // Get all content from all categories, sorted by date (most recent first)
  const allPosts = getAllContent<BaseContentFrontmatter>(
    ["ai", "security", "music", "biohacking", "project"],
    { channel: "blog", published: true }
  );

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-bold text-white">All Articles</h1>
        <p className="text-muted">
          {allPosts.length} {allPosts.length === 1 ? "article" : "articles"} sorted by date
        </p>
      </div>

      {allPosts.length > 0 ? (
        <div className="flex flex-col gap-8">
          {allPosts.map((post) => (
            <PostCard key={post.slug} post={post} category={post.category!} />
          ))}
        </div>
      ) : (
        <p className="text-muted">No articles yet. Check back soon!</p>
      )}
    </div>
  );
}
