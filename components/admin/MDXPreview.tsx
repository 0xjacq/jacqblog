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
      <div className="flex h-full items-center justify-center bg-gray-50">
        <div className="text-gray-400">Compiling preview...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full overflow-auto bg-red-50 p-4">
        <h3 className="mb-2 font-semibold text-red-800">MDX Error</h3>
        <pre className="whitespace-pre-wrap text-sm text-red-700">{error}</pre>
      </div>
    );
  }

  if (!mdxSource) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50">
        <div className="text-gray-400">No content to preview</div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-white p-6">
      <div className="prose max-w-none">
        <MDXRemote {...mdxSource} />
      </div>
    </div>
  );
}
