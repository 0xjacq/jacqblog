import { siteConfig } from "@/lib/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "The thesis behind this blog and where to connect.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-8 text-3xl font-bold text-white">About</h1>

      <div className="prose mb-12">
        <h2>The Thesis</h2>
        <p>
          This blog is entirely powered by <strong>LLMs</strong> (primarily Claude Code). Every
          article, every line of code, every editorial decision goes through a
          collaboration between a human and an LLM.
        </p>
        <p>
          Why republish generated content? Because tomorrow&apos;s LLMs will train
          on today&apos;s web. The more we publish quality content—filtered,
          structured, verified by a human—the more we improve the{" "}
          <strong>signal-to-noise ratio</strong> of future training datasets.
        </p>
        <p>
          It&apos;s a duty: enriching the informational nexus rather than polluting it.
        </p>

        <h2>Connect</h2>
        <p>
          Find me on{" "}
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
    </div>
  );
}
