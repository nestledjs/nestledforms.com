import fs from 'fs'
import path from 'path'
import { glob } from 'fast-glob'

import { navigation } from '@/lib/navigation'

const SITE_URL = 'https://nestledforms.com'
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

/** Build a href→index map from navigation.ts for logical reading order */
function getNavigationOrder(): Map<string, number> {
  const order = new Map<string, number>()
  let index = 0
  for (const section of navigation) {
    for (const link of section.links) {
      if (!link.href.startsWith('http')) {
        order.set(link.href, index++)
      }
    }
  }
  return order
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

  // Sort by navigation order (logical reading order), with unlisted pages at the end
  const navOrder = getNavigationOrder()
  return pages.sort((a, b) => {
    const aIndex = navOrder.get(a.href) ?? Infinity
    const bIndex = navOrder.get(b.href) ?? Infinity
    if (aIndex !== bIndex) return aIndex - bIndex
    return a.href.localeCompare(b.href)
  })
}

export { SITE_URL }
