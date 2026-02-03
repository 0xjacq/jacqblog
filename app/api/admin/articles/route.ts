import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { validateSession } from "@/lib/auth/session";
import { getContent, categoryDirs } from "@/lib/content/loader";
import type { ContentCategory, BaseContentFrontmatter } from "@/lib/content/types";
import {
  validateCategory,
  validateSlug,
  validateFrontmatter,
  isValidPath,
} from "@/lib/admin/validator";

const contentDirectory = path.join(process.cwd(), "content");

// GET: List all articles across categories
export async function GET() {
  const isAuthenticated = await validateSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const categories: ContentCategory[] = [
    "ai",
    "finance",
    "biohacking",
    "security",
    "idea",
    "music",
    "project",
    "book",
  ];

  const allArticles: Array<{
    category: ContentCategory;
    slug: string;
    title: string;
    date: string;
    published: boolean;
    tags: string[];
  }> = [];

  for (const category of categories) {
    // Get all content including unpublished
    const content = getContent<BaseContentFrontmatter>(category);

    for (const item of content) {
      allArticles.push({
        category,
        slug: item.slug,
        title: item.frontmatter.title,
        date: item.frontmatter.date || "",
        published: item.frontmatter.published ?? false,
        tags: item.frontmatter.tags || [],
      });
    }
  }

  // Sort by date, newest first
  allArticles.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return NextResponse.json({ articles: allArticles });
}

// POST: Create new article
export async function POST(request: NextRequest) {
  const isAuthenticated = await validateSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { category, slug, frontmatter, content } = await request.json();

    // Validate category
    const categoryValidation = validateCategory(category);
    if (!categoryValidation.valid) {
      return NextResponse.json({ errors: categoryValidation.errors }, { status: 400 });
    }

    // Validate slug
    const slugValidation = validateSlug(slug);
    if (!slugValidation.valid) {
      return NextResponse.json({ errors: slugValidation.errors }, { status: 400 });
    }

    // Validate path
    if (!isValidPath(category, slug)) {
      return NextResponse.json({ errors: ["Invalid path"] }, { status: 400 });
    }

    // Validate frontmatter
    const frontmatterValidation = validateFrontmatter(frontmatter, category as ContentCategory);
    if (!frontmatterValidation.valid) {
      return NextResponse.json({ errors: frontmatterValidation.errors }, { status: 400 });
    }

    // Check if file already exists
    const dir = path.join(contentDirectory, categoryDirs[category as ContentCategory]);
    const filePath = path.join(dir, `${slug}.mdx`);

    if (fs.existsSync(filePath)) {
      return NextResponse.json(
        { errors: ["An article with this slug already exists in this category"] },
        { status: 409 }
      );
    }

    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Create the MDX file
    const fileContent = matter.stringify(content || "", frontmatter);
    fs.writeFileSync(filePath, fileContent, "utf-8");

    return NextResponse.json({
      success: true,
      article: { category, slug },
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
