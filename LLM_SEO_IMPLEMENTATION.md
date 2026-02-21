# LLM SEO Implementation Guide

How to add robots.txt, sitemap.xml, llms.txt, llms-full.txt, per-page metadata, and JSON-LD structured data to a Next.js 15 App Router site that uses Markdoc for content.

---

## Prerequisites

- Next.js 15 with App Router
- Markdoc (`@markdoc/next.js`) with `.md` files as pages
- `fast-glob` as a dependency (`pnpm add fast-glob`)
- All doc content lives as `page.md` files under `src/app/`

---

## 1. Shared page discovery utility (`src/lib/docs.ts`)

This is the key piece — a single utility that all routes share. It globs `**/page.md` under `src/app/` at runtime, so **no route ever maintains a hardcoded list of pages**. When you add or remove a `page.md`, every route picks it up automatically.

```typescript
import fs from 'fs'
import path from 'path'
import { glob } from 'fast-glob'

const SITE_URL = 'https://YOUR_DOMAIN.com'
const APP_DIR = path.join(process.cwd(), 'src', 'app')

export interface DocPage {
  title: string
  href: string
  url: string
  content: string
}

function parseFrontmatter(raw: string): { title: string; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return { title: '', content: raw }

  const frontmatter = match[1]
  const content = match[2]
  const titleMatch = frontmatter.match(/^title:\s*(.+)$/m)
  const title = titleMatch ? titleMatch[1].trim() : ''

  return { title, content }
}

export async function getDocPages(): Promise<DocPage[]> {
  const files = await glob('**/page.md', { cwd: APP_DIR })

  const pages = files.map((file) => {
    const raw = fs.readFileSync(path.join(APP_DIR, file), 'utf-8')
    const { title, content } = parseFrontmatter(raw)
    const dir = path.dirname(file)
    const href = dir === '.' ? '/' : `/${dir}`

    return {
      title,
      href,
      url: `${SITE_URL}${href}`,
      content,
    }
  })

  return pages.sort((a, b) => {
    if (a.href === '/') return -1
    if (b.href === '/') return 1
    return a.href.localeCompare(b.href)
  })
}

export { SITE_URL }
```

**How auto-discovery works:** `fast-glob` scans the filesystem for every `page.md` at request time. The URL path is derived from the file's directory relative to `src/app/` (e.g., `src/app/docs/installation/page.md` → `/docs/installation`). The title comes from YAML frontmatter. No page list is maintained anywhere.

---

## 2. robots.txt (`src/app/robots.ts`)

```typescript
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://YOUR_DOMAIN.com/sitemap.xml',
  }
}
```

---

## 3. sitemap.xml (`src/app/sitemap.ts`)

Calls `getDocPages()` — no hardcoded URLs.

```typescript
import type { MetadataRoute } from 'next'

import { getDocPages } from '@/lib/docs'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await getDocPages()

  return pages.map((page) => ({
    url: page.url,
    lastModified: new Date(),
    priority:
      page.href === '/' ? 1.0 : page.href.split('/').length <= 3 ? 0.8 : 0.7,
  }))
}
```

---

## 4. llms.txt (`src/app/llms.txt/route.ts`)

Summary page for LLM crawlers. Calls `getDocPages()` — no hardcoded URLs.

```typescript
import { getDocPages } from '@/lib/docs'

export async function GET() {
  const pages = await getDocPages()

  const lines = [
    '# Your Project Name',
    '',
    '> One-paragraph description of your project.',
    '',
    '## Docs',
    '',
    ...pages.map((page) => `- [${page.title}](${page.url})`),
  ]

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
```

---

## 5. llms-full.txt (`src/app/llms-full.txt/route.ts`)

Concatenates ALL doc content into one file. Calls `getDocPages()` — no hardcoded URLs or content.

```typescript
import { getDocPages } from '@/lib/docs'

export async function GET() {
  const pages = await getDocPages()

  const sections = pages.map((page) => {
    // Strip Markdoc tags for plain markdown output
    const cleaned = page.content
      .replace(/\{%\s*\/[\w-]+\s*%\}/g, '') // closing tags {% /tag %}
      .replace(/\{%\s*[\w-]+\s*[^%]*?\/%\}/g, '') // self-closing {% tag /%}
      .replace(/\{%\s*[\w-]+[^%]*?%\}/g, '') // opening tags {% tag %}
      .replace(/\{\.\w+\}/g, '') // attribute annotations {.lead}
      .replace(/\n{3,}/g, '\n\n') // collapse blank lines
      .trim()

    return `# ${page.title}\n\nURL: ${page.url}\n\n${cleaned}`
  })

  const output = [
    '# Your Project Name — Complete Documentation',
    '',
    '> One-paragraph description.',
    '',
    '---',
    '',
    sections.join('\n\n---\n\n'),
  ].join('\n')

  return new Response(output, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
```

**Note on Markdoc stripping:** The regexes above handle standard Markdoc tags (`{% callout %}`, `{% quick-link ... /%}`, `{.lead}`). If your project uses additional custom syntax, add more patterns. If your project doesn't use Markdoc, skip the stripping or adapt for your format.

---

## 6. Per-page metadata

`@markdoc/next.js` (v0.3+) exports `frontmatter.nextjs.metadata` as the Next.js `metadata` export. Add this to every `page.md`:

```yaml
---
title: Page title
nextjs:
  metadata:
    description: A unique, descriptive summary of this page for search engines and AI.
---
```

This gives each page a proper `<meta name="description">` tag. Without it, pages fall back to the root layout description.

---

## 7. JSON-LD structured data (`src/app/layout.tsx`)

Add inside `<body>`, before your providers/content:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Your Project Name',
      applicationCategory: 'DeveloperApplication',
      description: 'Your project description.',
      url: 'https://YOUR_DOMAIN.com',
      operatingSystem: 'Any',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    }),
  }}
/>
```

---

## What's auto-discovered vs. what's manual

| Concern               | Auto-discovered? | Details                                                                            |
| --------------------- | ---------------- | ---------------------------------------------------------------------------------- |
| sitemap.xml pages     | Yes              | Globs `**/page.md` via `getDocPages()`                                             |
| llms.txt page links   | Yes              | Same `getDocPages()` call                                                          |
| llms-full.txt content | Yes              | Same `getDocPages()` call, reads file content                                      |
| Page URL paths        | Yes              | Derived from file directory path                                                   |
| Page titles           | Yes              | Parsed from YAML frontmatter `title:` field                                        |
| Page descriptions     | **No**           | Must be manually added as `nextjs.metadata.description` in each page's frontmatter |
| robots.txt            | Static           | No page awareness needed                                                           |
| JSON-LD               | Static           | Lives in root layout, not per-page                                                 |

---

## Verification

After implementation, run `pnpm build` and confirm the build output includes:

```
├ ƒ /llms-full.txt
├ ƒ /llms.txt
├ ○ /robots.txt
└ ○ /sitemap.xml
```

The `ƒ` (dynamic) marker on llms routes means they run `getDocPages()` on each request — always fresh. If you need them static, you can add `export const dynamic = 'force-static'` to the route files, but then they'll only update on rebuild.
