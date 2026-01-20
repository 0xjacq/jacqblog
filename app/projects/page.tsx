import { getProjects } from "@/lib/mdx";
import { ProjectCard } from "@/components/ProjectCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "A collection of projects and applications I've built.",
};

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-4 text-3xl font-bold text-white">Projects</h1>
      <p className="mb-12 text-muted">
        A collection of projects and applications I&apos;ve built. Some are
        open source, some are experiments, and some are just for fun.
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
