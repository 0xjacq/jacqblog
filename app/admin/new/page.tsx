"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FrontmatterEditor, type FrontmatterData } from "@/components/admin/FrontmatterEditor";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { MDXPreview } from "@/components/admin/MDXPreview";
import type { ContentCategory } from "@/lib/content/types";

const categories: { value: ContentCategory; label: string }[] = [
  { value: "ai", label: "AI" },
  { value: "finance", label: "Finance" },
  { value: "biohacking", label: "Biohacking" },
  { value: "security", label: "Security" },
  { value: "idea", label: "Ideas" },
  { value: "music", label: "Music" },
  { value: "project", label: "Projects" },
  { value: "book", label: "Books" },
];

const defaultFrontmatter: FrontmatterData = {
  title: "",
  description: "",
  date: new Date().toISOString().split("T")[0],
  tags: [],
  published: false,
  contentType: undefined,
  channels: {
    blog: { enabled: true },
    twitter: { enabled: false },
  },
};

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
}

export default function NewArticlePage() {
  const router = useRouter();
  const [category, setCategory] = useState<ContentCategory>("ai");
  const [slug, setSlug] = useState("");
  const [autoSlug, setAutoSlug] = useState(true);
  const [frontmatter, setFrontmatter] = useState<FrontmatterData>(defaultFrontmatter);
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFrontmatterChange = useCallback(
    (newFrontmatter: FrontmatterData) => {
      setFrontmatter(newFrontmatter);
      if (autoSlug && newFrontmatter.title) {
        setSlug(generateSlug(newFrontmatter.title));
      }
    },
    [autoSlug]
  );

  const handleSlugChange = (newSlug: string) => {
    setSlug(newSlug);
    setAutoSlug(false);
  };

  const handleSave = async () => {
    if (!slug) {
      setError("Slug is required");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          slug,
          frontmatter,
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.errors?.join(", ") || data.error || "Failed to create article");
        return;
      }

      router.push(`/admin/edit/${category}/${slug}`);
    } catch {
      setError("An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-100">New Article</h1>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? "Creating..." : "Create Article"}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-900/20 p-3 text-red-400">
          {error}
        </div>
      )}

      <div className="mb-4 flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-zinc-300">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ContentCategory)}
            className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-zinc-300">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            placeholder="auto-generated-from-title"
            className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid flex-1 grid-cols-2 gap-4 overflow-hidden">
        {/* Left side: Form + Editor */}
        <div className="flex flex-col gap-4 overflow-hidden">
          <div className="overflow-auto rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <FrontmatterEditor
              frontmatter={frontmatter}
              category={category}
              onChange={handleFrontmatterChange}
            />
          </div>
          <div className="min-h-[400px] flex-1 overflow-hidden rounded-lg border border-zinc-800">
            <ArticleEditor
              content={content}
              onChange={setContent}
              onSave={handleSave}
            />
          </div>
        </div>

        {/* Right side: Preview */}
        <div className="overflow-hidden rounded-lg border border-zinc-800">
          <MDXPreview content={content} />
        </div>
      </div>
    </div>
  );
}
