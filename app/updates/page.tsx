import { getUpdates } from "@/lib/mdx";
import { UpdateCard } from "@/components/UpdateCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Updates",
  description: "Quick updates, build-in-public posts, and micro-content.",
};

export default function UpdatesPage() {
  const updates = getUpdates("blog");

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-4 text-3xl font-bold text-white">Updates</h1>
      <p className="mb-12 text-muted">
        Quick updates, build-in-public posts, tips, and other micro-content.
      </p>
      {updates.length > 0 ? (
        <div className="flex flex-col gap-6">
          {updates.map((update) => (
            <UpdateCard key={update.slug} update={update} />
          ))}
        </div>
      ) : (
        <p className="text-muted">No updates yet. Check back soon!</p>
      )}
    </div>
  );
}
