# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Build Commands

```bash
npm run dev      # Dev server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint
```

## Deploy

```bash
vercel --prod --token=$(grep VERCEL_TOKEN .env.local | cut -d '=' -f2)
```

## Content Structure

All MDX files in `content/`. Loaders in `lib/mdx.ts` and `lib/content/loader.ts`.

| Category | Directory |
|----------|-----------|
| Articles | `content/articles/` |
| Projects | `content/projects/` |
| Books | `content/books/` |
| Music | `content/music/` |
| Biohacking | `content/biohacking/` |
| Security | `content/security/` |
| Ideas | `content/ideas/` |
| Drafts | `content/drafts/` |

## Frontmatter Patterns

**Articles & Thematic Content:**
```yaml
title: "Title"
date: "YYYY-MM-DD"
description: "SEO description"
tags: ["tag1", "tag2"]
published: true
contentType: tutorial | deep-dive | case-study | announcement | build-in-public | quick-tip | project-showcase
channels:
  blog: { enabled: true, format: "full" }
  twitter: { enabled: false }
```

**Projects:**
```yaml
title: "Project Name"
description: "What it does"
url: "https://..."        # optional
github: "user/repo"       # optional
tags: ["tech1", "tech2"]
featured: true
```

**Books:**
```yaml
title: "Book Title"
author: "Author Name"
rating: 8                 # 1-10
```

## Code Style

- **Language**: All content must be written in English unless specified otherwise
- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS v4
- **Content**: MDX with gray-matter for frontmatter

## Custom Commands

### /article

Generate article from project analysis:

```
/article <project-path> [--type X] [--draft] [--title X] [--tags X]
```

Types: showcase, tutorial, announcement, deep-dive, case-study