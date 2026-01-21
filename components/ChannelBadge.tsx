import type { Channel } from "@/lib/content/types";

interface ChannelBadgeProps {
  channel: Channel;
  size?: "sm" | "md";
}

const channelStyles: Record<Channel, string> = {
  blog: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  twitter: "bg-sky-500/10 text-sky-400 border-sky-500/20",
};

const channelLabels: Record<Channel, string> = {
  blog: "Blog",
  twitter: "Twitter",
};

export function ChannelBadge({ channel, size = "sm" }: ChannelBadgeProps) {
  const sizeClasses = size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1";

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${channelStyles[channel]} ${sizeClasses}`}
    >
      {channelLabels[channel]}
    </span>
  );
}
