import { getShowcaseProjects } from "@/lib/mdx";
import { ProjectCard } from "@/components/ProjectCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "AI agent systems, publishing infrastructure, and deployment tooling.",
};

export default function ProjectsPage() {
  const projects = getShowcaseProjects();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-4 text-3xl font-bold text-white">Projects</h1>
      <p className="mb-12 text-muted">
        AI agent systems, knowledge workflows, and deployment tooling. This is
        the shortlist I want public surfaces to reflect consistently.
      </p>
      {projects.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <p className="text-muted">No projects yet. Check back soon!</p>
      )}
    </div>
  );
}
