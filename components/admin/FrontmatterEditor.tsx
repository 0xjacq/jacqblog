"use client";

import type { ContentCategory, ContentType } from "@/lib/content/types";

export interface FrontmatterData {
  title: string;
  description: string;
  date: string;
  tags: string[];
  published: boolean;
  contentType?: ContentType;
  channels: {
    blog: { enabled: boolean; format?: string };
    twitter: { enabled: boolean; format?: string };
  };
  // Book-specific
  author?: string;
  rating?: number;
  dateRead?: string;
  // Project-specific
  url?: string;
  github?: string;
  featured?: boolean;
}

interface FrontmatterEditorProps {
  frontmatter: FrontmatterData;
  category: ContentCategory;
  onChange: (frontmatter: FrontmatterData) => void;
}

const contentTypes: ContentType[] = [
  "tutorial",
  "deep-dive",
  "case-study",
  "announcement",
  "build-in-public",
  "quick-tip",
  "project-showcase",
];

export function FrontmatterEditor({ frontmatter, category, onChange }: FrontmatterEditorProps) {
  const updateField = <K extends keyof FrontmatterData>(
    field: K,
    value: FrontmatterData[K]
  ) => {
    onChange({ ...frontmatter, [field]: value });
  };

  const updateChannel = (
    channel: "blog" | "twitter",
    field: "enabled" | "format",
    value: boolean | string
  ) => {
    onChange({
      ...frontmatter,
      channels: {
        ...frontmatter.channels,
        [channel]: {
          ...frontmatter.channels[channel],
          [field]: value,
        },
      },
    });
  };

  const isBook = category === "book";
  const isProject = category === "project";
  const isArticle = !isBook && !isProject;

  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={frontmatter.title}
          onChange={(e) => updateField("title", e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={frontmatter.description}
          onChange={(e) => updateField("description", e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Date (for articles) */}
      {isArticle && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={frontmatter.date}
            onChange={(e) => updateField("date", e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={frontmatter.tags.join(", ")}
          onChange={(e) =>
            updateField(
              "tags",
              e.target.value.split(",").map((t) => t.trim()).filter(Boolean)
            )
          }
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Content Type (for articles) */}
      {isArticle && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Content Type</label>
          <select
            value={frontmatter.contentType || ""}
            onChange={(e) => updateField("contentType", e.target.value as ContentType || undefined)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">None</option>
            {contentTypes.map((type) => (
              <option key={type} value={type}>
                {type.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Published (for articles) */}
      {isArticle && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="published"
            checked={frontmatter.published}
            onChange={(e) => updateField("published", e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="published" className="text-sm font-medium text-gray-700">
            Published
          </label>
        </div>
      )}

      {/* Book-specific fields */}
      {isBook && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">Author</label>
            <input
              type="text"
              value={frontmatter.author || ""}
              onChange={(e) => updateField("author", e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rating (1-10)</label>
            <input
              type="number"
              min={1}
              max={10}
              value={frontmatter.rating || ""}
              onChange={(e) => updateField("rating", parseInt(e.target.value) || undefined)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date Read</label>
            <input
              type="date"
              value={frontmatter.dateRead || ""}
              onChange={(e) => updateField("dateRead", e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </>
      )}

      {/* Project-specific fields */}
      {isProject && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">URL</label>
            <input
              type="url"
              value={frontmatter.url || ""}
              onChange={(e) => updateField("url", e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">GitHub (user/repo)</label>
            <input
              type="text"
              value={frontmatter.github || ""}
              onChange={(e) => updateField("github", e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={frontmatter.featured || false}
              onChange={(e) => updateField("featured", e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="featured" className="text-sm font-medium text-gray-700">
              Featured
            </label>
          </div>
        </>
      )}

      {/* Channel toggles (for articles) */}
      {isArticle && (
        <div className="border-t pt-4">
          <h3 className="mb-2 text-sm font-medium text-gray-700">Channels</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="blog-enabled"
                checked={frontmatter.channels.blog.enabled}
                onChange={(e) => updateChannel("blog", "enabled", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="blog-enabled" className="text-sm text-gray-700">
                Blog
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="twitter-enabled"
                checked={frontmatter.channels.twitter.enabled}
                onChange={(e) => updateChannel("twitter", "enabled", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="twitter-enabled" className="text-sm text-gray-700">
                Twitter
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
