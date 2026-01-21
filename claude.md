# jacqblog

Next.js 16 blog with MDX. Deployed on Vercel.

## Commands

```bash
npm run dev      # Dev server
npm run build    # Production build
npm run lint     # ESLint

# Deploy to production
vercel --prod --token=$(grep VERCEL_TOKEN .env.local | cut -d '=' -f2)
```

## Content Structure

```
content/
├── articles/     # Long-form posts
├── updates/      # Micro-posts (require contentType)
├── projects/     # Project showcases
├── books/        # Reading notes
├── music/        # Bass guitar, gear, theory
├── biohacking/   # Quantified self, experiments
├── security/     # CTF, pentesting, research
└── drafts/       # Unpublished work
```

## Frontmatter

### Articles & Updates
```yaml
title: "Title"
date: "YYYY-MM-DD"
description: "SEO description"
tags: ["tag1", "tag2"]
published: true
contentType: tutorial | deep-dive | case-study | announcement | build-in-public | quick-tip | project-showcase
channels:
  blog: { enabled: true, format: "full" }
  twitter: { enabled: false, tweetId: null }
```

### Projects
```yaml
title: "Project Name"
description: "What it does"
url: "https://..."        # optional
github: "user/repo"       # optional
tags: ["tech1", "tech2"]
featured: true
```

### Books
```yaml
title: "Book Title"
author: "Author Name"
rating: 8                 # 1-10
```

### Thematic Categories (Music, Biohacking, Security)
```yaml
title: "Title"
date: "YYYY-MM-DD"
description: "SEO description"
tags: ["tag1", "tag2"]
published: true
contentType: tutorial | deep-dive | case-study | project-showcase | quick-tip
channels:
  blog: { enabled: true, format: "full" }
```

## /article Command

Generate article from project analysis:

```
/article <project-path> [--type X] [--draft] [--title X] [--tags X]
```

Types: showcase, tutorial, announcement, deep-dive, case-study
