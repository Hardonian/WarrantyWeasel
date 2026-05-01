import { createHash } from 'crypto'

const TRACKING_PARAMS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'ref', 'qid', 'sr', 'ie', 'tag', 'gclid', 'fbclid', 'msclkid',
]

export function normalizeUrl(urlStr: string): string {
  try {
    const url = new URL(urlStr)
    TRACKING_PARAMS.forEach((p) => url.searchParams.delete(p))
    url.searchParams.sort()
    url.hostname = url.hostname.toLowerCase()
    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.slice(0, -1)
    }
    url.protocol = 'https:'
    return url.toString()
  } catch {
    return urlStr
  }
}

export function hashUrl(url: string): string {
  const normalized = normalizeUrl(url)
  return createHash('sha256').update(normalized).digest('hex')
}

export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase()
  } catch {
    return ''
  }
}

export function safeUrl(input: string): URL | null {
  try {
    return new URL(input)
  } catch {
    return null
  }
}
