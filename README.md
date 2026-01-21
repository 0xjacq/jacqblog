# jacqblog

A personal blog built with Next.js 16, React 19, and MDX. Features multi-channel publishing (blog + Twitter), thematic content categories, and a minimal dark theme.

**Live site:** [jacqblog.vercel.app](https://jacqblog.vercel.app)

## Features

- **MDX Content** — Write posts in Markdown with embedded React components
- **Multi-channel Publishing** — Publish to blog and Twitter simultaneously
- **7 Content Categories** — Articles, updates, projects, books, music, biohacking, security
- **Twitter Threading** — Automatic conversion of articles to tweet threads
- **Reading Time** — Automatic calculation for all posts
- **RSS Feed** — Auto-generated at `/rss.xml`
- **SEO Optimized** — Sitemap, meta tags, and Open Graph support
- **Fast & Minimal** — Static generation with Tailwind CSS dark theme

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Styling | Tailwind CSS 4 |
| Content | MDX via next-mdx-remote |
| Language | TypeScript |
| Fonts | Geist & Geist Mono |
| Deployment | Vercel |

## Project Structure

```
jacqblog/
├── app/                    # Next.js App Router pages
│   ├── articles/           # Blog articles
│   ├── updates/            # Micro-posts
│   ├── projects/           # Project showcase
│   ├── books/              # Reading notes
│   ├── music/              # Bass guitar, gear, theory
│   ├── biohacking/         # Quantified self, experiments
│   ├── security/           # CTF, pentesting, research
│   ├── about/              # About page
│   ├── api/                # API routes
│   │   ├── publish/twitter # Twitter publishing API
│   │   └── tweet/          # Standalone tweet API
│   ├── rss.xml/            # RSS feed
│   └── layout.tsx          # Root layout
├── components/             # React components
│   ├── ArticleCard.tsx
│   ├── UpdateCard.tsx
│   ├── ContentCard.tsx     # Generic card for thematic categories
│   ├── ChannelBadge.tsx    # Blog/Twitter badges
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── MDXComponents.tsx
├── content/                # MDX content files
│   ├── articles/           # Long-form posts
│   ├── updates/            # Micro-posts
│   ├── projects/           # Project showcases
│   ├── books/              # Reading notes
│   ├── music/              # Music content
│   ├── biohacking/         # Biohacking content
│   ├── security/           # Security content
│   └── drafts/             # Unpublished work
└── lib/                    # Utilities
    ├── config.ts           # Site configuration
    ├── mdx.ts              # Content loading functions
    ├── content/            # Content loader and types
    └── channels/           # Multi-channel publishing
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
git clone https://github.com/jacq/jacqblog.git
cd jacqblog
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Content Management

### Writing Content

Create a `.mdx` file in the appropriate `content/` subdirectory:

```yaml
---
title: "Your Title"
date: "2026-01-21"
description: "A brief description for SEO"
contentType: "tutorial"
tags: ["tag1", "tag2"]
published: true
channels:
  blog:
    enabled: true
  twitter:
    enabled: false
---

Your markdown content here...
```

### Content Types

| Type | Directory | Description |
|------|-----------|-------------|
| Articles | `content/articles/` | Long-form blog posts |
| Updates | `content/updates/` | Short micro-posts (contentType required) |
| Projects | `content/projects/` | Project showcases with links |
| Books | `content/books/` | Reading notes with ratings |
| Music | `content/music/` | Bass guitar, gear, music theory |
| Biohacking | `content/biohacking/` | Quantified self, experiments |
| Security | `content/security/` | CTF writeups, pentesting, tools |

### Content Type Values

- `tutorial` — Step-by-step instructional content
- `deep-dive` — In-depth technical analysis
- `case-study` — Real-world problem-solving
- `announcement` — News and releases
- `build-in-public` — Development progress
- `quick-tip` — Brief, actionable advice
- `project-showcase` — Project demonstrations

### Frontmatter Reference

**Articles & Thematic Categories:**
```yaml
title: "Title"                    # Required
date: "YYYY-MM-DD"                # Required
description: "SEO description"    # Required
contentType: tutorial             # Optional
tags: ["tag1", "tag2"]
published: true
channels:
  blog: { enabled: true, format: "full" }
  twitter: { enabled: false }
```

**Updates:**
```yaml
title: "Title"
date: "YYYY-MM-DD"
description: "Description"
contentType: tutorial             # Required for updates
tags: ["tag1"]
published: true
```

**Projects:**
```yaml
title: "Project Name"
description: "What it does"
url: "https://..."                # Optional
github: "user/repo"               # Optional
tags: ["tech1", "tech2"]
featured: true                    # Featured projects appear first
```

**Books:**
```yaml
title: "Book Title"
author: "Author Name"
rating: 4                         # 1-5
dateRead: "YYYY-MM-DD"
cover: "/images/..."              # Optional
```

## Multi-Channel Publishing

### Channel System

Content can be published to multiple channels:

- **Blog** — Primary web publication
- **Twitter** — Automatic thread generation

Configure in frontmatter:
```yaml
channels:
  blog:
    enabled: true
    format: "full"                # full or micro
  twitter:
    enabled: true
    format: "thread"              # single or thread
    customText: "..."             # Optional custom intro
```

### Twitter Publishing API

**Publish content as a Twitter thread:**
```bash
curl -X POST http://localhost:3000/api/publish/twitter \
  -H "Content-Type: application/json" \
  -d '{"slug": "my-article", "category": "article", "format": "thread"}'
```

The API will:
1. Convert MDX to Twitter-friendly text
2. Split into 280-char segments
3. Post as a thread with reply chains
4. Update frontmatter with tweet ID

**Environment variables required:**
```env
TWITTER_API_KEY=xxx
TWITTER_API_SECRET=xxx
TWITTER_ACCESS_TOKEN=xxx
TWITTER_ACCESS_SECRET=xxx
```

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Deployment

Deploy to Vercel:

```bash
vercel --prod --token=$(grep VERCEL_TOKEN .env.local | cut -d '=' -f2)
```

Or connect the repository to Vercel for automatic deployments.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `VERCEL_TOKEN` | Vercel deployment token |
| `TWITTER_API_KEY` | Twitter API key |
| `TWITTER_API_SECRET` | Twitter API secret |
| `TWITTER_ACCESS_TOKEN` | Twitter access token |
| `TWITTER_ACCESS_SECRET` | Twitter access secret |

## License

MIT
