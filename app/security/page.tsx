import { getSecurityContent } from "@/lib/mdx";
import { ContentCard } from "@/components/ContentCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security",
  description: "CTF writeups, pentesting, security research, and tools.",
};

export default function SecurityPage() {
  const posts = getSecurityContent();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-4 text-3xl font-bold text-white">Security</h1>
      <p className="mb-12 text-muted">
        CTF writeups, pentesting, security research, and tools.
      </p>
      {posts.length > 0 ? (
        <div className="flex flex-col gap-8">
          {posts.map((post) => (
            <ContentCard key={post.slug} content={post} basePath="security" />
          ))}
        </div>
      ) : (
        <p className="text-muted">No posts yet. Check back soon!</p>
      )}
    </div>
  );
}
