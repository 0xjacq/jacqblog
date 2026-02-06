/**
 * GitHub API client for committing content changes
 * Used in production where filesystem is read-only (Vercel)
 */

const GITHUB_API = "https://api.github.com";

interface GitHubFileResponse {
  sha: string;
  content: string;
  encoding: string;
}

interface GitHubCommitResponse {
  content: {
    sha: string;
    path: string;
  };
  commit: {
    sha: string;
    message: string;
  };
}

function getConfig() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER || "0xjacq";
  const repo = process.env.GITHUB_REPO || "jacqblog";
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!token) {
    throw new Error("GITHUB_TOKEN environment variable is not set");
  }

  return { token, owner, repo, branch };
}

function getHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

/**
 * Check if we're in production (should use GitHub API)
 */
export function shouldUseGitHubAPI(): boolean {
  return process.env.VERCEL === "1" || process.env.USE_GITHUB_API === "true";
}

/**
 * Get a file from GitHub repository
 */
export async function getFile(filePath: string): Promise<GitHubFileResponse | null> {
  const { token, owner, repo, branch } = getConfig();

  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;

  const response = await fetch(url, {
    headers: getHeaders(token),
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`GitHub API error: ${error.message || response.statusText}`);
  }

  return response.json();
}

/**
 * Create or update a file in the GitHub repository
 */
export async function createOrUpdateFile(
  filePath: string,
  content: string,
  message: string
): Promise<GitHubCommitResponse> {
  const { token, owner, repo, branch } = getConfig();

  // Get current file SHA if it exists (required for updates)
  let sha: string | undefined;
  try {
    const existingFile = await getFile(filePath);
    if (existingFile) {
      sha = existingFile.sha;
    }
  } catch {
    // File doesn't exist, that's fine for creation
  }

  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${filePath}`;

  const body: Record<string, string> = {
    message,
    content: Buffer.from(content).toString("base64"),
    branch,
  };

  if (sha) {
    body.sha = sha;
  }

  const response = await fetch(url, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`GitHub API error: ${error.message || response.statusText}`);
  }

  return response.json();
}

/**
 * Delete a file from the GitHub repository
 */
export async function deleteFile(
  filePath: string,
  message: string
): Promise<void> {
  const { token, owner, repo, branch } = getConfig();

  // Get current file SHA (required for deletion)
  const existingFile = await getFile(filePath);
  if (!existingFile) {
    throw new Error("File not found");
  }

  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${filePath}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: getHeaders(token),
    body: JSON.stringify({
      message,
      sha: existingFile.sha,
      branch,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`GitHub API error: ${error.message || response.statusText}`);
  }
}

/**
 * Check if a file exists in the repository
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    const file = await getFile(filePath);
    return file !== null;
  } catch {
    return false;
  }
}
