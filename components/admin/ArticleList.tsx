"use client";

import { useState } from "react";
import Link from "next/link";
import type { ContentCategory } from "@/lib/content/types";

interface Article {
  category: ContentCategory;
  slug: string;
  title: string;
  date: string;
  published: boolean;
  tags: string[];
}

interface ArticleListProps {
  articles: Article[];
}

const categoryLabels: Record<ContentCategory, string> = {
  ai: "AI",
  finance: "Finance",
  biohacking: "Biohacking",
  security: "Security",
  idea: "Ideas",
  music: "Music",
  project: "Projects",
  book: "Books",
};

export function ArticleList({ articles }: ArticleListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ContentCategory | "all">("all");
  const [publishedFilter, setPublishedFilter] = useState<"all" | "published" | "draft">("all");

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || article.category === categoryFilter;
    const matchesPublished =
      publishedFilter === "all" ||
      (publishedFilter === "published" && article.published) ||
      (publishedFilter === "draft" && !article.published);

    return matchesSearch && matchesCategory && matchesPublished;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 min-w-[200px] rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as ContentCategory | "all")}
          className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={publishedFilter}
          onChange={(e) => setPublishedFilter(e.target.value as "all" | "published" | "draft")}
          className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        <Link
          href="/admin/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          New Article
        </Link>
      </div>

      {/* Article count */}
      <div className="text-sm text-gray-600">
        {filteredArticles.length} article{filteredArticles.length !== 1 ? "s" : ""}
      </div>

      {/* Article table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredArticles.map((article) => (
              <tr
                key={`${article.category}-${article.slug}`}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/edit/${article.category}/${article.slug}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {article.title}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {categoryLabels[article.category]}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {article.date || "—"}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      article.published
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {article.published ? "Published" : "Draft"}
                  </span>
                </td>
              </tr>
            ))}

            {filteredArticles.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No articles found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
