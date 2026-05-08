# jacqblog

LLM-native publishing system for human-arbitrated writing.

**Live site:** [jacqblog.vercel.app](https://jacqblog.vercel.app)

`jacqblog` is the content hub behind my public writing on AI, systems, neuroscience, security, music, and finance. The core idea is simple: models handle filtering, structuring, and drafting; the human keeps editorial judgment and the final call.

## Why This Exists

Most publishing systems assume the human does everything manually and the model is an accessory. This repo flips that model.

It treats LLMs as an informational pre-cortex:
- they compress research into workable proposals
- they help turn raw notes into reusable content
- they make multi-channel publishing operational

The job of the human is not to type more. It is to arbitrate better.

## What It Does

- MDX-based long-form publishing across multiple thematic sections
- Unified content model with `published` and channel-level visibility
- Multi-channel frontmatter for blog and Twitter/X distribution
- Static content pages, RSS, sitemap, and category archives
- Lightweight admin flows for creating and editing content in production

## Publishing Model

All content lives under `content/` and is organized by category:

- `ai`
- `finance`
- `music`
- `biohacking`
- `security`
- `ideas`
- `projects`
- `books`
- `drafts`

Visibility is controlled in frontmatter:

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

`published: false` keeps the piece in the repo but removes it from the public site. `channels` lets a piece exist on the blog, on Twitter/X, or both.

## Architecture Snapshot

```text
app/
  Next.js 16 App Router pages, category indexes, post routes, RSS, admin routes

content/
  MDX source of truth for published and draft content

lib/content/
  Typed content loader, category mapping, filtering, and channel visibility

lib/mdx.ts
  Backward-compatible content access helpers used by routes and UI
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
- The repo is not just a blog theme; it is a publishing workflow shaped around LLM collaboration.
- `README-PROFILE.md` in this repo mirrors the intended GitHub profile README copy.

## License

MIT
