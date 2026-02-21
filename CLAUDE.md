# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Documentation website for Nestled.js — a collection of Nx generators for building full-stack applications. Built with Next.js 15 (App Router), TypeScript, Tailwind CSS 4, and Markdoc for content authoring.

## Commands

| Command             | Purpose                                    |
| ------------------- | ------------------------------------------ |
| `pnpm dev`          | Start dev server (port 3000)               |
| `pnpm build`        | Production build                           |
| `pnpm lint`         | ESLint checks                              |
| `pnpm lint:fix`     | Auto-fix lint issues                       |
| `pnpm type-check`   | TypeScript type checking (`tsc --noEmit`)  |
| `pnpm format`       | Format with Prettier                       |
| `pnpm format:check` | Check formatting                           |
| `pnpm test`         | Full validation: lint + type-check + build |
| `pnpm ci:local`     | Run quality and security checks locally    |

Package manager is **pnpm** (v10.14.0). Node >=18 required.

## Architecture

### Content System

- Documentation pages are **Markdoc** (`.md`) files in `src/app/docs/` using Next.js file-based routing
- Custom Markdoc tags defined in `src/markdoc/tags.js`: `callout`, `figure`, `quick-links`, `quick-link`
- Custom Markdoc nodes in `src/markdoc/nodes.js`
- `next.config.mjs` wraps Next.js config with `@markdoc/next.js` and a custom search loader

### Search

- FlexSearch index built at compile-time via a custom Webpack loader (`src/markdoc/search.mjs`)
- Scans all `page.md` files, extracts headings + content into searchable sections
- Frontend uses Algolia Autocomplete UI (`src/components/Search.tsx`)

### Layout & Navigation

- Layout hierarchy: `RootLayout` → `Providers` (next-themes) → `Layout` → `DocsLayout`
- Navigation structure defined in `src/lib/navigation.ts`
- Sections: Introduction, Web Forms, Native Forms, Advanced, Resources

### Styling

- Tailwind CSS 4 with `@tailwindcss/postcss` plugin
- Dark mode via class strategy (next-themes)
- Syntax highlighting with Prism React Renderer + custom CSS (`src/styles/prism.css`)
- Prettier auto-sorts Tailwind classes via `prettier-plugin-tailwindcss`

### LLM SEO & Auto-Discovery

All SEO/LLM routes auto-discover doc pages at request time — **no hardcoded page lists anywhere**. The mechanism:

1. **`src/lib/docs.ts`** is the single shared utility. Its `getDocPages()` function uses `fast-glob` to find every `**/page.md` under `src/app/` at runtime, reads each file, parses frontmatter (title) and content, and derives the URL path from the file's directory path.
2. **`src/app/sitemap.ts`**, **`src/app/llms.txt/route.ts`**, and **`src/app/llms-full.txt/route.ts`** all call `getDocPages()` — none of them maintain their own page list.
3. The `llms.txt` route renders each page as a `- [title](url)` link. The `llms-full.txt` route concatenates the full Markdoc content of every page (stripping Markdoc tags like `{% callout %}` for plain markdown output).
4. `sitemap.ts` and `llms.txt` are dynamic Next.js routes (server-rendered on demand), so they always reflect the current set of `page.md` files without a rebuild.

Other LLM SEO files:

- `src/app/robots.ts` — static `robots.txt` pointing to sitemap
- JSON-LD `SoftwareApplication` structured data in `src/app/layout.tsx`

**When adding or removing doc pages**: sitemap, llms.txt, and llms-full.txt pick up changes automatically. The only manual step is adding `nextjs.metadata.description` in the frontmatter of every new page (the `@markdoc/next.js` loader exports `frontmatter.nextjs.metadata` as the Next.js page metadata). See existing pages for the pattern:

```yaml
---
title: Page title
nextjs:
  metadata:
    description: A unique description for this page.
---
```

## Conventions

- **Import alias**: `@/*` maps to `./src/*`
- **Formatting**: Single quotes, no semicolons (Prettier config)
- **Pre-commit hooks**: Husky + lint-staged auto-formats staged files with Prettier
- **Client components**: Explicitly marked with `'use client'` only when needed (search, theme toggle, navigation)
- **Unused variables**: Prefix with `_` to satisfy ESLint
