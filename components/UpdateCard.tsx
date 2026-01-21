import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { ChannelBadge } from "./ChannelBadge";
import { contentTypeLabels, type Update } from "@/lib/content/types";
import { getPublishedChannels } from "@/lib/content/loader";

interface UpdateCardProps {
  update: Update;
  showChannels?: boolean;
}

export function UpdateCard({ update, showChannels = true }: UpdateCardProps) {
  const channels = getPublishedChannels(update.frontmatter);
  const contentTypeLabel = contentTypeLabels[update.frontmatter.contentType];

  return (
    <article className="group border-l-2 border-border pl-4 py-2 hover:border-accent transition-colors">
      <Link href={`/updates/${update.slug}`} className="block">
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <time dateTime={update.frontmatter.date}>
              {formatDate(update.frontmatter.date)}
            </time>
            <span>&middot;</span>
            <span>{update.readingTime}</span>
            <span>&middot;</span>
            <span className="text-accent">{contentTypeLabel}</span>
            {showChannels && channels.length > 0 && (
              <>
                <span>&middot;</span>
                <div className="flex gap-1">
                  {channels.map((channel) => (
                    <ChannelBadge key={channel} channel={channel} size="sm" />
                  ))}
                </div>
              </>
            )}
          </div>
          <h2 className="text-lg font-semibold text-white transition-colors group-hover:text-accent">
            {update.frontmatter.title}
          </h2>
          <p className="text-sm text-muted line-clamp-2">
            {update.frontmatter.description}
          </p>
          {update.frontmatter.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {update.frontmatter.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-border px-2 py-0.5 text-[10px] text-muted"
                >
                  {tag}
                </span>
              ))}
              {update.frontmatter.tags.length > 4 && (
                <span className="text-[10px] text-muted">
                  +{update.frontmatter.tags.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
