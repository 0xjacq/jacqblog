export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export interface GitHubRepoRef {
  owner: string;
  repo: string;
}

export function getGitHubRepoRef(value?: string): GitHubRepoRef | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  const match = trimmed.match(/^(?:https?:\/\/github\.com\/)?([^/\s]+)\/([^/\s]+?)(?:\/|\.git)?$/i);

  if (!match) {
    return null;
  }

  return {
    owner: match[1],
    repo: match[2],
  };
}

export function normalizeGitHubUrl(value?: string): string | undefined {
  const repoRef = getGitHubRepoRef(value);

  if (!repoRef) {
    return value;
  }

  return `https://github.com/${repoRef.owner}/${repoRef.repo}`;
}

export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
