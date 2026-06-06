# jacqblog

LLM-native publishing system for human-arbitrated writing, curated project showcases, and multi-channel content distribution.

**Live site:** [jacqblog.vercel.app](https://jacqblog.vercel.app)

`jacqblog` is the publishing system behind my public writing on AI, systems, biohacking, security, and music. Models handle filtering, structuring, drafting, and operational glue. The human keeps taste, judgment, and the final call.

## Why This Exists

Most publishing stacks treat LLMs as assistants bolted onto a manual workflow. This repo treats them as part of the workflow itself.

- Research gets compressed into workable drafts
- Notes get turned into reusable content
- Distribution becomes operational instead of ad hoc
- The human arbitrates instead of typing everything by hand

## What It Does

- MDX-based long-form publishing with typed content loaders
- Channel-aware frontmatter for blog and Twitter/X workflows
- Public category indexes, RSS, sitemap, and per-post routes
- Curated `/projects` showcase synced with the GitHub profile README
- Lightweight admin flows for creating and editing content in production

## Content Model

All source content lives under `content/`:

- `ai`
- `music`
- `biohacking`
- `security`
- `projects`
- `finance`
- `ideas`
- `books`
- `drafts`

Public navigation is intentionally narrower than the repo. `finance`, `ideas`, and `books` are kept in the content model and remain directly routable, but they are hidden from primary discovery surfaces.

### Article Frontmatter

```yaml
---
title: "The Gain Stage: How LLMs Amplify Your Thinking"
date: "2026-01-31"
description: "When you're wired into an LLM, it acts as a cognitive amplifier."
tags: ["ai", "cognition"]
published: true
contentType: deep-dive
channels:
  blog:
    enabled: true
    format: "full"
  twitter:
    enabled: false
---
```

`published: false` keeps a piece in the repo while removing it from public blog surfaces. `channels` controls where it should appear.

### Project Frontmatter

```yaml
---
title: "Agenpedia"
description: "Markdown-first wiki template for agent-driven ingestion, synthesis, and reusable knowledge workflows."
github: "https://github.com/0xjacq/Agenpedia"
tags: ["agents", "wiki", "knowledge-base", "markdown", "skills"]
featured: false
showcase: true
showcaseOrder: 2
---
```

`showcase` and `showcaseOrder` control whether a project appears on `/projects` and in the project sitemap entries. Projects can stay in the repo and keep their direct detail pages without being part of the public showcase.

## Architecture Snapshot

```text
app/
  Next.js 16 App Router pages, category indexes, post routes, RSS, sitemap, admin routes

content/
  MDX source of truth for published, hidden, and draft content

lib/content/
  Typed content loader, category mapping, filtering, and channel visibility

lib/mdx.ts
  Project helpers, showcase filtering, and backward-compatible route access
```

Core stack:

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- MDX with `gray-matter`
- Vercel for deployment

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful commands:

```bash
npm run dev
npm run build
npm run lint
```

## Deployment

Production deploys run on Vercel:

```bash
vercel --prod --token=$(grep VERCEL_TOKEN .env.local | cut -d '=' -f2)
```

If you use the Twitter/X publishing flow, the app also expects the relevant API credentials in `.env.local`.

## Notes

- The public site is intentionally opinionated and content-first.
- This repo is not just a blog theme; it is a publishing workflow shaped around LLM collaboration.
- [`README-PROFILE.md`](./README-PROFILE.md) mirrors the intended GitHub profile README copy.

## License

MIT
