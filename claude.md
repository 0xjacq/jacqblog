# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 16 blog with MDX and multi-channel publishing (blog + Twitter). All content must be written in English unless specified otherwise.

## Commands

```bash
npm run dev      # Dev server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint

# Deploy
vercel --prod --token=$(grep VERCEL_TOKEN .env.local | cut -d '=' -f2)
```

## Architecture

### Content System

Content flows through three layers:

1. **MDX Files** (`content/{category}/`) — Source files with YAML frontmatter
2. **Content Loader** (`lib/content/loader.ts`) — Reads, filters, and sorts content by category/channel
3. **Pages** (`app/{category}/`) — Renders content using `PostCard` or category-specific cards

The loader uses `lib/content/types.ts` for type definitions. Categories are mapped to directories in `categoryDirs` within the loader.

### Adding a New Category

When adding a new content category:

1. Add to `ContentCategory` type in `lib/content/types.ts`
2. Add directory mapping in `categoryDirs` in `lib/content/loader.ts`
3. Create `content/{category}/` directory
4. Create `app/{category}/page.tsx` and `app/{category}/[slug]/page.tsx`
5. **Add to navigation** in `lib/config.ts` → `siteConfig.nav`
6. **Add to homepage recent posts** in `app/page.tsx` → `getAllContent()` categories array

Missing steps 5-6 will cause content to exist but be invisible to users.

### Multi-Channel Publishing

Content can target multiple channels via frontmatter:
- `channels.blog.enabled` — Appears on website
- `channels.twitter.enabled` — Can be published as thread via API

Twitter publishing: `POST /api/publish/twitter` with `{slug, category, format}`

## Content

| Category | Directory | Route |
|----------|-----------|-------|
| AI | `content/ai/` | `/ai` |
| Finance | `content/finance/` | `/finance` |
| Projects | `content/projects/` | `/projects` |
| Books | `content/books/` | `/books` |
| Music | `content/music/` | `/music` |
| Biohacking | `content/biohacking/` | `/biohacking` |
| Security | `content/security/` | `/security` |
| Ideas | `content/ideas/` | `/ideas` |
| Drafts | `content/drafts/` | (not routed) |

## Frontmatter

**Articles & Thematic:**
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

## /article Command

Generate article from project analysis:

```
/article <project-path> [--type X] [--draft] [--title X] [--tags X]
```

Types: showcase, tutorial, announcement, deep-dive, case-study
