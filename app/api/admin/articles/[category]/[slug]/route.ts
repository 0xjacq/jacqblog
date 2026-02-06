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

    // Check if file exists
    const dir = path.join(contentDirectory, categoryDirs[category as ContentCategory]);
    const filePath = path.join(dir, `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Update the MDX file
    const fileContent = matter.stringify(content || "", frontmatter);
    fs.writeFileSync(filePath, fileContent, "utf-8");

    return NextResponse.json({
      success: true,
      article: { category, slug },
    });
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

  // Check if file exists
  const dir = path.join(contentDirectory, categoryDirs[category as ContentCategory]);
  const filePath = path.join(dir, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  // Delete the file
  fs.unlinkSync(filePath);

  return NextResponse.json({ success: true });
}
