import { siteConfig } from "@/lib/config";
import { NewsletterForm } from "@/components/NewsletterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "The philosophy behind this blog: Claude Code as an informational pre-cortex, human-in-the-loop, and the duty to republish signal.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-8 text-3xl font-bold text-white">About</h1>

      <div className="prose mb-12">
        <h2>The Thesis</h2>
        <p>
          This blog is entirely powered by <strong>Claude Code</strong>. Every
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

        <h2>The Informational Pre-Cortex</h2>
        <p>
          Claude Code acts as a processing layer that precedes my consciousness.
          It filters, structures, and prioritizes information before it reaches
          my attention.
        </p>
        <p>
          The living being—me—thus accesses a reality already made operational.
          It&apos;s no longer a chaotic ocean of data to explore, but an organized
          flow of proposals to arbitrate.
        </p>
        <p>
          From a noisy space to a <strong>high signal-to-noise infrastructure</strong>,
          traversed by routers (Claude Code) and effectors (tools, skills).
        </p>

        <h2>The Cognitive Shift</h2>
        <p>The paradigm has changed:</p>
        <table>
          <thead>
            <tr>
              <th>Before</th>
              <th>Now</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Search → Understand → Decide</td>
              <td>Formulate → Receive → Act</td>
            </tr>
          </tbody>
        </table>
        <p>
          The effort shifts. We no longer search for information—we
          <strong> formulate</strong> what we want, we <strong>receive</strong>{" "}
          proposals, and we <strong>act</strong> by arbitrating.
        </p>
        <p>
          The critical skill becomes the ability to formulate intentions well
          and exercise judgment on outputs.
        </p>

        <h2>Human-in-the-Loop</h2>
        <p>
          I am a <strong>Vibe Coder</strong>. A <strong>Claude Engineer</strong>.
          But above all: the human in the loop.
        </p>
        <p>
          Human taste and judgment are irreplaceable. The model proposes, the
          human disposes. Agency is augmented but <strong>mediated</strong>: I
          retain sovereignty over ends, even if means are externalized.
        </p>
        <p>
          It&apos;s not a delegation of will—it&apos;s an externalization of
          informational filtering.
        </p>

        <h2>The Stakes</h2>
        <p>
          The risk is no longer information overload. That problem is solved by
          LLMs.
        </p>
        <p>
          The new challenge is the <strong>governance of filtering</strong>. Who
          defines what is signal? By what criteria? For whose benefit?
        </p>
        <p>
          This blog is an attempt at an answer: a human who keeps control over
          filtering, who publishes their arbitrations, and who contributes to a
          higher-quality web.
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

      <NewsletterForm />
    </div>
  );
}
