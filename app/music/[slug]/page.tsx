import { notFound } from "next/navigation";
import { getMusicPost, getMusicContent } from "@/lib/mdx";
import { MDXContent } from "@/components/MDXComponents";
import { NewsletterForm } from "@/components/NewsletterForm";
import { formatDate } from "@/lib/utils";
import { siteConfig } from "@/lib/config";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getMusicContent();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getMusicPost(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: "article",
      publishedTime: post.frontmatter.date,
      authors: [siteConfig.author],
    },
  };
}

export default async function MusicPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getMusicPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <article>
        <header className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-white">
            {post.frontmatter.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted">
            <time dateTime={post.frontmatter.date}>
              {formatDate(post.frontmatter.date)}
            </time>
            {post.readingTime && (
              <>
                <span>&middot;</span>
                <span>{post.readingTime}</span>
              </>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {post.frontmatter.tags?.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-border px-2.5 py-0.5 text-xs text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <MDXContent source={post.content} />

        <footer className="mt-12 border-t border-border pt-8">
          <NewsletterForm />
        </footer>
      </article>
    </div>
  );
}
