import Link from "next/link";
import { getAllContent } from "@/lib/content/loader";
import { PostCard } from "@/components/PostCard";
import { siteConfig } from "@/lib/config";
import type { BaseContentFrontmatter } from "@/lib/content/types";

export default function Home() {
  const recentPosts = getAllContent<BaseContentFrontmatter>(
    ["article", "security", "music", "biohacking"],
    { channel: "blog", published: true }
  ).slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <section className="mb-16">
        <h1 className="mb-4 text-4xl font-bold text-white">
          A Claude Code Engineer republishing signal for tomorrow&apos;s LLMs.
        </h1>
        <p className="mb-6 text-lg italic text-muted">

        </p>
        <div className="mb-8 space-y-3 text-base text-muted">
          <p>
            Claude Code acts as an <strong className="text-white">informational pre-cortex</strong>:
            it filters, structures, and prioritizes information before it reaches my awareness.
          </p>
          <p>
            The human brings what the model cannot: <strong className="text-white">taste</strong>,
            <strong className="text-white"> judgment</strong>, the final call.
          </p>
          <p>
            Together, we improve the signal-to-noise ratio. This content is meant to be reused.
          </p>
        </div>
        <div className="flex gap-4">
          <a
            href={siteConfig.links.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Twitter
          </a>
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            GitHub
          </a>
        </div>
      </section>

      <section>
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Recent Posts</h2>
          <Link href="/articles" className="text-sm text-accent hover:underline">
            View all
          </Link>
        </div>
        {recentPosts.length > 0 ? (
          <div className="flex flex-col gap-8">
            {recentPosts.map((post) => (
              <PostCard key={post.slug} post={post} category={post.category!} />
            ))}
          </div>
        ) : (
          <p className="text-muted">No posts yet. Check back soon!</p>
        )}
      </section>
    </div>
  );
}
