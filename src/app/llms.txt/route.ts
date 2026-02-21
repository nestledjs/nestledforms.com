import { getDocPages, SITE_URL } from '@/lib/docs'

export async function GET() {
  const pages = await getDocPages()

  const lines = [
    '# Nestled Forms',
    '',
    '> Nestled Forms is a type-safe form library for React and React Native with 24+ field types, validation (including Zod), conditional logic, theming, layouts, and Apollo GraphQL integration. It ships as @nestledjs/forms (web), @nestledjs/forms-native (React Native), and @nestledjs/forms-core (shared foundation).',
    '',
    '## Docs',
    '',
    ...pages.map((page) => `- [${page.title}](${page.url})`),
    '',
    '## Full Documentation',
    '',
    `- [Complete docs in one file](${SITE_URL}/llms-full.txt)`,
  ]

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
