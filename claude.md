# jacqblog

Next.js 16 blog with MDX. All content must be written in English unless specified otherwise.

## Commands

```bash
npm run dev      # Dev server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint

# Deploy
vercel --prod --token=$(grep VERCEL_TOKEN .env.local | cut -d '=' -f2)
```

## Content

All MDX files in `content/`. Loaders in `lib/mdx.ts`.

| Category | Directory |
|----------|-----------|
| Articles | `content/articles/` |
| Updates | `content/updates/` |
| Projects | `content/projects/` |
| Books | `content/books/` |
| Music | `content/music/` |
| Biohacking | `content/biohacking/` |
| Security | `content/security/` |
| Drafts | `content/drafts/` |

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
