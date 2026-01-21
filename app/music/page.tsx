import { getMusicContent } from "@/lib/mdx";
import { ContentCard } from "@/components/ContentCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Music",
  description: "Bass guitar, music theory, gear, and everything audio.",
};

export default function MusicPage() {
  const posts = getMusicContent();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-4 text-3xl font-bold text-white">Music</h1>
      <p className="mb-12 text-muted">
        Bass guitar, music theory, gear, and everything audio.
      </p>
      {posts.length > 0 ? (
        <div className="flex flex-col gap-8">
          {posts.map((post) => (
            <ContentCard key={post.slug} content={post} basePath="music" />
          ))}
        </div>
      ) : (
        <p className="text-muted">No posts yet. Check back soon!</p>
      )}
    </div>
  );
}
