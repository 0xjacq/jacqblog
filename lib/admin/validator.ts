import type { ContentCategory } from "@/lib/content/types";

const VALID_CATEGORIES: ContentCategory[] = [
  "ai",
  "project",
  "book",
  "music",
  "biohacking",
  "security",
  "idea",
  "finance",
];

const SLUG_REGEX = /^[a-z0-9-]+$/;

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateCategory(category: string): ValidationResult {
  const errors: string[] = [];

  if (!category) {
    errors.push("Category is required");
  } else if (!VALID_CATEGORIES.includes(category as ContentCategory)) {
    errors.push(`Invalid category: ${category}. Valid categories: ${VALID_CATEGORIES.join(", ")}`);
  }

  return { valid: errors.length === 0, errors };
}

export function validateSlug(slug: string): ValidationResult {
  const errors: string[] = [];

  if (!slug) {
    errors.push("Slug is required");
  } else if (!SLUG_REGEX.test(slug)) {
    errors.push("Slug must contain only lowercase letters, numbers, and hyphens");
  } else if (slug.length < 3) {
    errors.push("Slug must be at least 3 characters long");
  } else if (slug.length > 100) {
    errors.push("Slug must be less than 100 characters");
  }

  return { valid: errors.length === 0, errors };
}

export interface FrontmatterInput {
  title?: string;
  description?: string;
  date?: string;
  tags?: string[];
  published?: boolean;
  contentType?: string;
  channels?: {
    blog?: { enabled?: boolean; format?: string };
    twitter?: { enabled?: boolean; format?: string };
  };
  // Book-specific
  author?: string;
  rating?: number;
  dateRead?: string;
  cover?: string;
  // Project-specific
  url?: string;
  github?: string;
  featured?: boolean;
}

export function validateFrontmatter(
  frontmatter: FrontmatterInput,
  category: ContentCategory
): ValidationResult {
  const errors: string[] = [];

  if (!frontmatter.title || frontmatter.title.trim() === "") {
    errors.push("Title is required");
  }

  if (category === "book") {
    if (!frontmatter.author) {
      errors.push("Author is required for books");
    }
    if (frontmatter.rating !== undefined && (frontmatter.rating < 1 || frontmatter.rating > 10)) {
      errors.push("Rating must be between 1 and 10");
    }
  } else if (category === "project") {
    if (!frontmatter.description) {
      errors.push("Description is required for projects");
    }
  } else {
    // Standard article frontmatter
    if (!frontmatter.date) {
      errors.push("Date is required");
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(frontmatter.date)) {
      errors.push("Date must be in YYYY-MM-DD format");
    }

    if (!frontmatter.description) {
      errors.push("Description is required");
    }
  }

  return { valid: errors.length === 0, errors };
}

export function sanitizePath(path: string): string {
  // Prevent path traversal attacks
  return path.replace(/\.\./g, "").replace(/\/+/g, "/");
}

export function isValidPath(category: string, slug: string): boolean {
  // Ensure no path traversal
  if (category.includes("..") || category.includes("/")) {
    return false;
  }
  if (slug.includes("..") || slug.includes("/")) {
    return false;
  }
  return true;
}
