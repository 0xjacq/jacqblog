import { siteConfig } from "@/lib/config";
import { NewsletterForm } from "@/components/NewsletterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About jacq — a passionate creator building applications and sharing knowledge.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-8 text-3xl font-bold text-white">About</h1>

      <div className="prose mb-12">
        <p>
          Hey! I&apos;m <strong>{siteConfig.name}</strong>, a passionate creator
          who loves building things and sharing knowledge.
        </p>

        <h2>What I Do</h2>
        <p>
          I spend my time writing articles about software development,
          technology, and things I find interesting. I build applications and
          tools, contribute to open source projects, and read books to
          continuously learn and grow.
        </p>

        <h2>This Blog</h2>
        <p>
          This blog is my space to share ideas, document what I learn, and
          connect with like-minded people. You&apos;ll find:
        </p>
        <ul>
          <li>
            <strong>Articles</strong> — Thoughts on software development,
            technology, and more
          </li>
          <li>
            <strong>Projects</strong> — Applications and tools I&apos;ve built
          </li>
          <li>
            <strong>Books</strong> — Reviews and notes on books I&apos;ve read
          </li>
        </ul>

        <h2>Connect</h2>
        <p>
          Feel free to reach out! You can find me on{" "}
          <a
            href={siteConfig.links.twitter}
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>{" "}
          and{" "}
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          .
        </p>
      </div>

      <NewsletterForm />
    </div>
  );
}
