"use client";

import { useState, useEffect, useCallback } from "react";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";

interface MDXPreviewProps {
  content: string;
}

export function MDXPreview({ content }: MDXPreviewProps) {
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);

  const compileMDX = useCallback(async (source: string) => {
    setIsCompiling(true);
    setError(null);

    try {
      const result = await serialize(source, {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
        },
      });
      setMdxSource(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to compile MDX");
      setMdxSource(null);
    } finally {
      setIsCompiling(false);
    }
  }, []);

  // Debounce the MDX compilation
  useEffect(() => {
    const timer = setTimeout(() => {
      compileMDX(content);
    }, 500);

    return () => clearTimeout(timer);
  }, [content, compileMDX]);

  if (isCompiling && !mdxSource) {
    return (
      <div className="flex h-full items-center justify-center bg-zinc-900">
        <div className="text-zinc-400">Compiling preview...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full overflow-auto bg-red-900/20 p-4">
        <h3 className="mb-2 font-semibold text-red-400">MDX Error</h3>
        <pre className="whitespace-pre-wrap text-sm text-red-300">{error}</pre>
      </div>
    );
  }

  if (!mdxSource) {
    return (
      <div className="flex h-full items-center justify-center bg-zinc-900">
        <div className="text-zinc-400">No content to preview</div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-zinc-900 p-6">
      <div
        className="prose prose-invert max-w-none"
        style={{
          '--tw-prose-body': '#e5e5e5',
          '--tw-prose-headings': '#f5f5f5',
          '--tw-prose-lead': '#a1a1aa',
          '--tw-prose-links': '#60a5fa',
          '--tw-prose-bold': '#f5f5f5',
          '--tw-prose-counters': '#a1a1aa',
          '--tw-prose-bullets': '#71717a',
          '--tw-prose-hr': '#3f3f46',
          '--tw-prose-quotes': '#f5f5f5',
          '--tw-prose-quote-borders': '#3f3f46',
          '--tw-prose-captions': '#a1a1aa',
          '--tw-prose-code': '#f5f5f5',
          '--tw-prose-pre-code': '#e5e5e5',
          '--tw-prose-pre-bg': '#18181b',
          '--tw-prose-th-borders': '#3f3f46',
          '--tw-prose-td-borders': '#27272a',
        } as React.CSSProperties}
      >
        <MDXRemote {...mdxSource} />
      </div>
    </div>
  );
}
