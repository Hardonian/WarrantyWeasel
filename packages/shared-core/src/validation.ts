import type { ValidationResult } from './types'

const BLOCKED_HOSTS = [
  'localhost', '127.0.0.1', '0.0.0.0', '::1',
  'metadata.google.internal', '169.254.169.254',
  'instance-data', 'metadata.azure.com',
]

const PRIVATE_IP_PATTERNS = [
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^127\./,
  /^0\./,
  /^169\.254\./,
  /^::1$/,
  /^fe80:/,
  /^fc00:/,
  /^fd00:/,
]

export function validateUrl(input: string): ValidationResult {
  let parsedUrl: URL
  try {
    parsedUrl = new URL(input)
  } catch {
    return { valid: false, error: 'Invalid URL format' }
  }

  if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
    return { valid: false, error: 'Only HTTP and HTTPS protocols are allowed' }
  }

  if (parsedUrl.protocol !== 'https:') {
    return { valid: false, error: 'HTTPS is required for security' }
  }

  const hostname = parsedUrl.hostname.toLowerCase()

  if (BLOCKED_HOSTS.some((blocked) => hostname === blocked || hostname.endsWith(`.${blocked}`))) {
    return { valid: false, error: 'Access to this host is not allowed' }
  }

  const isIp = hostname.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)
  if (isIp && PRIVATE_IP_PATTERNS.some((pattern) => pattern.test(hostname))) {
    return { valid: false, error: 'Access to private networks is not allowed' }
  }

  if (isIp) {
    return { valid: false, error: 'Direct IP access is not allowed' }
  }

  return { valid: true }
}

export function sanitizeHtml(html: string): string {
  let sanitized = html.replace(/<script[\s\S]*?<\/script>/gi, '')
  sanitized = sanitized.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '')
  sanitized = sanitized.replace(/\son\w+\s*=\s*\S+/gi, '')
  sanitized = sanitized.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, '')
  sanitized = sanitized.replace(/<(iframe|object|embed|form)[\s\S]*?<\/\1>/gi, '')
  sanitized = sanitized.replace(/<(iframe|object|embed|form)[^>]*\/?>/gi, '')
  return sanitized
}
