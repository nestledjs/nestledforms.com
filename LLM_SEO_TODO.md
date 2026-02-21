# LLM SEO: Making Nestled Docs AI-Accessible

## High Priority (Do First)

### 1. Add `llms.txt`

Create a `llms.txt` at the site root (e.g. `https://nestledjs.com/llms.txt`). This is the emerging standard for telling LLMs what your site is about. Format:

```
# Nestled

> Nestled is a production-ready SaaS starter template built as an Nx monorepo with NestJS GraphQL API, React frontend, Prisma ORM, and code generation. It provides auth, profiles, organizations/teams, RBAC, billing/subscriptions, admin area, and audit logging out of the box.

## Docs

- [Getting Started](https://nestledjs.com)
- [Installation](https://nestledjs.com/docs/installation)
- [Commands](https://nestledjs.com/docs/commands)
- [Architecture](https://nestledjs.com/docs/architecture)
- [Generators](https://nestledjs.com/docs/generators)
- [Deployment](https://nestledjs.com/docs/deployment)
- [Resources](https://nestledjs.com/docs/resources)
```

In Next.js App Router, create `src/app/llms.txt/route.ts` that returns this as `text/plain`.

### 2. Add `llms-full.txt`

This is the big one for AI. Concatenate ALL your doc pages into a single markdown file. LLMs can consume the whole thing in one fetch instead of crawling page by page.

Create `src/app/llms-full.txt/route.ts` that:

- Reads all `.md` files from `src/app/` and `src/app/docs/`
- Strips frontmatter, concatenates with `## Page Title` headers
- Returns as `text/plain`

This should be generated at build time or cached. Since your content is all Markdoc `.md` files, this is straightforward.

### 3. Add `robots.txt`

Currently missing entirely. Create `src/app/robots.ts`:

```typescript
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://nestledjs.com/sitemap.xml',
  }
}
```

### 4. Add `sitemap.xml`

Also missing. Create `src/app/sitemap.ts`:

```typescript
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://nestledjs.com', lastModified: new Date(), priority: 1.0 },
    {
      url: 'https://nestledjs.com/docs/installation',
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: 'https://nestledjs.com/docs/commands',
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: 'https://nestledjs.com/docs/architecture',
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: 'https://nestledjs.com/docs/generators',
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: 'https://nestledjs.com/docs/deployment',
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: 'https://nestledjs.com/docs/resources',
      lastModified: new Date(),
      priority: 0.6,
    },
  ]
}
```

Ideally auto-generate this by globbing `src/app/**/page.md` at build time.

## Medium Priority

### 5. Improve Per-Page Metadata

Your frontmatter currently has `title` and `description` but some pages may be thin on descriptions. Every page should have a unique, descriptive `description` that reads well as an AI search snippet. For example:

```yaml
---
title: Architecture
nextjs:
  metadata:
    title: Architecture
    description: How Nestled structures an Nx monorepo with NestJS GraphQL API, React frontend, Prisma code generation, shared SDK, and library organization patterns.
---
```

### 6. Add Structured Data (JSON-LD)

Add `SoftwareApplication` and `TechArticle` structured data to help search engines and AI understand what each page is. In your layout or per-page:

```typescript
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Nestled",
  "applicationCategory": "DeveloperApplication",
  "description": "Production-ready SaaS starter template...",
  "url": "https://nestledjs.com"
}
</script>
```

### 7. Ensure Clean HTML Rendering

Your site uses Markdoc which renders server-side — this is great. AI web fetchers (including mine) convert HTML to markdown. Verify that:

- Code blocks use proper `<pre><code>` tags (Markdoc does this)
- Headings use semantic `<h1>`-`<h6>` (Markdoc does this)
- No critical content is hidden behind client-side JS interactions (accordion/tabs that hide content from initial HTML)

Your current setup is already good here since Markdoc renders to static HTML on the server.

## Lower Priority (Nice to Have)

### 8. Consider Static Export

Add `output: 'export'` to `next.config.mjs`. This generates plain HTML files that are the fastest and most reliably crawlable format. Since all your content is static markdown, there's no downside. The only thing to check is whether the search functionality or any API routes break with static export — if so, keep SSR.

### 9. Add an OpenAPI/MCP Endpoint (Future)

If you build an MCP server for Nestled, you could advertise it on the docs site. This is the "pull" model — developers discover your MCP server through your docs, install it, and get rich AI-assisted interactions with the template. But this is a separate project, not a docs change.

### 10. Submit to AI Training Datasets

Some AI providers accept documentation submissions for inclusion in training data:

- Anthropic has no formal submission process but crawls public docs
- Being linked from popular sites (npm, GitHub README, dev.to articles) increases crawl likelihood
- A good GitHub README with a link to docs is the single best driver

## Implementation Order

1. `robots.txt` + `sitemap.xml` — 15 minutes, unblocks everything
2. `llms.txt` — 30 minutes, immediate AI value
3. `llms-full.txt` — 1-2 hours, the biggest win for AI consumption
4. Per-page metadata audit — 30 minutes
5. JSON-LD structured data — 1 hour
6. Static export evaluation — 30 minutes
