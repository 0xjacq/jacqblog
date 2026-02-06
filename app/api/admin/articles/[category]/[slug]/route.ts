import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { validateSession } from "@/lib/auth/session";
import { getContentBySlug, categoryDirs } from "@/lib/content/loader";
import type { ContentCategory, BaseContentFrontmatter } from "@/lib/content/types";
import {
  validateCategory,
  validateFrontmatter,
  isValidPath,
} from "@/lib/admin/validator";
import {
  shouldUseGitHubAPI,
  createOrUpdateFile,
  deleteFile,
  fileExists,
} from "@/lib/github/client";

const contentDirectory = path.join(process.cwd(), "content");

interface RouteParams {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

// GET: Get single article
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const isAuthenticated = await validateSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { category, slug } = await params;

  // Validate category
  const categoryValidation = validateCategory(category);
  if (!categoryValidation.valid) {
    return NextResponse.json({ errors: categoryValidation.errors }, { status: 400 });
  }

  // Validate path
  if (!isValidPath(category, slug)) {
    return NextResponse.json({ errors: ["Invalid path"] }, { status: 400 });
  }

  const article = getContentBySlug<BaseContentFrontmatter>(category as ContentCategory, slug);

  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  return NextResponse.json({
    category,
    slug,
    frontmatter: article.frontmatter,
    content: article.content,
  });
}

// PUT: Update article
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const isAuthenticated = await validateSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { category, slug } = await params;

  // Validate category
  const categoryValidation = validateCategory(category);
  if (!categoryValidation.valid) {
    return NextResponse.json({ errors: categoryValidation.errors }, { status: 400 });
  }

  // Validate path
  if (!isValidPath(category, slug)) {
    return NextResponse.json({ errors: ["Invalid path"] }, { status: 400 });
  }

  try {
    const { frontmatter, content } = await request.json();

    // Validate frontmatter
    const frontmatterValidation = validateFrontmatter(frontmatter, category as ContentCategory);
    if (!frontmatterValidation.valid) {
      return NextResponse.json({ errors: frontmatterValidation.errors }, { status: 400 });
    }

    const categoryDir = categoryDirs[category as ContentCategory];
    const filePath = `content/${categoryDir}/${slug}.mdx`;
    const fileContent = matter.stringify(content || "", frontmatter);

    // Use GitHub API in production, filesystem locally
    if (shouldUseGitHubAPI()) {
      // Check if file exists via GitHub
      const exists = await fileExists(filePath);
      if (!exists) {
        return NextResponse.json({ error: "Article not found" }, { status: 404 });
      }

      await createOrUpdateFile(
        filePath,
        fileContent,
        `Update ${category}/${slug}`
      );

      return NextResponse.json({
        success: true,
        article: { category, slug },
        message: "Changes committed to GitHub. Deployment will start shortly.",
        deploying: true,
      });
    } else {
      // Local filesystem write
      const localPath = path.join(contentDirectory, categoryDir, `${slug}.mdx`);

      if (!fs.existsSync(localPath)) {
        return NextResponse.json({ error: "Article not found" }, { status: 404 });
      }

      fs.writeFileSync(localPath, fileContent, "utf-8");

      return NextResponse.json({
        success: true,
        article: { category, slug },
      });
    }
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({
      error: err instanceof Error ? err.message : "Invalid request"
    }, { status: 400 });
  }
}

// DELETE: Delete article
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const isAuthenticated = await validateSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { category, slug } = await params;

  // Validate category
  const categoryValidation = validateCategory(category);
  if (!categoryValidation.valid) {
    return NextResponse.json({ errors: categoryValidation.errors }, { status: 400 });
  }

  // Validate path
  if (!isValidPath(category, slug)) {
    return NextResponse.json({ errors: ["Invalid path"] }, { status: 400 });
  }

  const categoryDir = categoryDirs[category as ContentCategory];
  const filePath = `content/${categoryDir}/${slug}.mdx`;

  try {
    if (shouldUseGitHubAPI()) {
      // Check if file exists via GitHub
      const exists = await fileExists(filePath);
      if (!exists) {
        return NextResponse.json({ error: "Article not found" }, { status: 404 });
      }

      await deleteFile(filePath, `Delete ${category}/${slug}`);

      return NextResponse.json({
        success: true,
        message: "Article deleted. Deployment will start shortly.",
        deploying: true,
      });
    } else {
      // Local filesystem delete
      const localPath = path.join(contentDirectory, categoryDir, `${slug}.mdx`);

      if (!fs.existsSync(localPath)) {
        return NextResponse.json({ error: "Article not found" }, { status: 404 });
      }

      fs.unlinkSync(localPath);

      return NextResponse.json({ success: true });
    }
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({
      error: err instanceof Error ? err.message : "Failed to delete"
    }, { status: 400 });
  }
}
