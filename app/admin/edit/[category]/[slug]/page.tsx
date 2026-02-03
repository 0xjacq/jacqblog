"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { FrontmatterEditor, type FrontmatterData } from "@/components/admin/FrontmatterEditor";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { MDXPreview } from "@/components/admin/MDXPreview";
import type { ContentCategory } from "@/lib/content/types";

const defaultFrontmatter: FrontmatterData = {
  title: "",
  description: "",
  date: "",
  tags: [],
  published: false,
  contentType: undefined,
  channels: {
    blog: { enabled: true },
    twitter: { enabled: false },
  },
};

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const category = params.category as ContentCategory;
  const slug = params.slug as string;

  const [frontmatter, setFrontmatter] = useState<FrontmatterData>(defaultFrontmatter);
  const [content, setContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [originalFrontmatter, setOriginalFrontmatter] = useState<FrontmatterData>(defaultFrontmatter);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isDirty =
    content !== originalContent ||
    JSON.stringify(frontmatter) !== JSON.stringify(originalFrontmatter);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/admin/articles/${category}/${slug}`);
        if (!response.ok) {
          throw new Error("Article not found");
        }
        const data = await response.json();

        const fm: FrontmatterData = {
          title: data.frontmatter.title || "",
          description: data.frontmatter.description || "",
          date: data.frontmatter.date || "",
          tags: data.frontmatter.tags || [],
          published: data.frontmatter.published || false,
          contentType: data.frontmatter.contentType,
          channels: {
            blog: data.frontmatter.channels?.blog || { enabled: true },
            twitter: data.frontmatter.channels?.twitter || { enabled: false },
          },
          // Book-specific
          author: data.frontmatter.author,
          rating: data.frontmatter.rating,
          dateRead: data.frontmatter.dateRead,
          // Project-specific
          url: data.frontmatter.url,
          github: data.frontmatter.github,
          featured: data.frontmatter.featured,
        };

        setFrontmatter(fm);
        setOriginalFrontmatter(fm);
        setContent(data.content);
        setOriginalContent(data.content);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load article");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [category, slug]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`/api/admin/articles/${category}/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frontmatter, content }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.errors?.join(", ") || data.error || "Failed to save");
        return;
      }

      setOriginalContent(content);
      setOriginalFrontmatter(frontmatter);
      setSuccessMessage("Saved successfully");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {
      setError("An error occurred");
    } finally {
      setIsSaving(false);
    }
  }, [category, slug, frontmatter, content]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this article? This cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/articles/${category}/${slug}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to delete");
        return;
      }

      router.push("/admin");
    } catch {
      setError("An error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading article...</div>
      </div>
    );
  }

  if (error && !frontmatter.title) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-140px)] flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{frontmatter.title || "Edit Article"}</h1>
          <p className="text-sm text-gray-500">
            {category} / {slug}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {successMessage && (
            <span className="text-sm text-green-600">{successMessage}</span>
          )}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-md bg-red-100 px-4 py-2 text-red-700 hover:bg-red-200 disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !isDirty}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      <div className="grid flex-1 grid-cols-2 gap-4 overflow-hidden">
        {/* Left side: Form + Editor */}
        <div className="flex flex-col gap-4 overflow-hidden">
          <div className="overflow-auto rounded-lg border border-gray-200 bg-white p-4">
            <FrontmatterEditor
              frontmatter={frontmatter}
              category={category}
              onChange={setFrontmatter}
            />
          </div>
          <div className="flex-1 overflow-hidden rounded-lg border border-gray-200">
            <ArticleEditor
              content={content}
              onChange={setContent}
              onSave={handleSave}
              isDirty={isDirty}
            />
          </div>
        </div>

        {/* Right side: Preview */}
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <MDXPreview content={content} />
        </div>
      </div>
    </div>
  );
}
