import { notFound } from "next/navigation";
import { getUpdate, getUpdates } from "@/lib/mdx";
import { MDXContent } from "@/components/MDXComponents";
import { formatDate } from "@/lib/utils";
import { siteConfig } from "@/lib/config";
import { ChannelBadge } from "@/components/ChannelBadge";
import { contentTypeLabels } from "@/lib/content/types";
import { getPublishedChannels } from "@/lib/content/loader";
import type { Metadata } from "next";

interface UpdatePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const updates = getUpdates();
  return updates.map((update) => ({
    slug: update.slug,
  }));
}

export async function generateMetadata({
  params,
}: UpdatePageProps): Promise<Metadata> {
  const { slug } = await params;
  const update = getUpdate(slug);

  if (!update) {
    return {};
  }

  return {
    title: update.frontmatter.title,
    description: update.frontmatter.description,
    openGraph: {
      title: update.frontmatter.title,
      description: update.frontmatter.description,
      type: "article",
      publishedTime: update.frontmatter.date,
      authors: [siteConfig.author],
    },
    twitter: {
      card: "summary",
      title: update.frontmatter.title,
      description: update.frontmatter.description,
    },
  };
}

function TwitterIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default async function UpdatePage({ params }: UpdatePageProps) {
  const { slug } = await params;
  const update = getUpdate(slug);

  if (!update) {
    notFound();
  }

  const channels = getPublishedChannels(update.frontmatter);
  const contentTypeLabel = contentTypeLabels[update.frontmatter.contentType];

  const shareUrl = `${siteConfig.url}/updates/${slug}`;
  const shareText = `${update.frontmatter.title} by @jacq`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <article>
        <header className="mb-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
              {contentTypeLabel}
            </span>
            {channels.map((channel) => (
              <ChannelBadge key={channel} channel={channel} size="sm" />
            ))}
          </div>
          <h1 className="mb-4 text-2xl font-bold text-white">
            {update.frontmatter.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted">
            <time dateTime={update.frontmatter.date}>
              {formatDate(update.frontmatter.date)}
            </time>
            <span>&middot;</span>
            <span>{update.readingTime}</span>
          </div>
          {update.frontmatter.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {update.frontmatter.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-border px-2.5 py-0.5 text-xs text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <MDXContent source={update.content} />

        <footer className="mt-12 border-t border-border pt-8">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">Share this update</span>
            <a
              href={twitterShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
            >
              <TwitterIcon />
              <span>Share on Twitter</span>
            </a>
          </div>
        </footer>
      </article>
    </div>
  );
}
