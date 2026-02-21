import { getDocPages } from '@/lib/docs'

export async function GET() {
  const pages = await getDocPages()

  const sections = pages.map((page) => {
    // Strip Markdoc tags ({% ... %} and {% ... /%}) for plain markdown
    const cleaned = page.content
      .replace(/\{%\s*\/[\w-]+\s*%\}/g, '') // closing tags like {% /quick-links %}
      .replace(/\{%\s*[\w-]+\s*[^%]*?\/%\}/g, '') // self-closing tags like {% quick-link ... /%}
      .replace(/\{%\s*[\w-]+[^%]*?%\}/g, '') // opening tags like {% callout %}
      .replace(/\{\.\w+\}/g, '') // attribute annotations like {.lead}
      .replace(/\n{3,}/g, '\n\n') // collapse multiple blank lines
      .trim()

    return `# ${page.title}\n\nURL: ${page.url}\n\n${cleaned}`
  })

  const output = [
    '# Nestled Forms — Complete Documentation',
    '',
    '> Nestled Forms is a type-safe form library for React and React Native with 24+ field types, validation (including Zod), conditional logic, theming, layouts, and Apollo GraphQL integration.',
    '',
    '---',
    '',
    sections.join('\n\n---\n\n'),
  ].join('\n')

  return new Response(output, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
