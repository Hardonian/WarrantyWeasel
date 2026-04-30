import { URL } from 'url';

/**
 * Normalizes a URL by converting to canonical form and stripping tracking parameters.
 */
export function normalizeUrl(input: string): string {
  try {
    const url = new URL(input);
    
    // Canonical hostname
    url.hostname = url.hostname.toLowerCase().replace(/^www\./, '');
    
    // Strip common tracking parameters
    const trackingParams = [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      'fbclid', 'gclid', 'msclkid', 'ref', 'affiliate', 'ref_'
    ];
    
    trackingParams.forEach(param => url.searchParams.delete(param));
    
    // Alphabetize query params for deterministic hash
    const params = Array.from(url.searchParams.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    url.search = '';
    params.forEach(([key, val]) => url.searchParams.append(key, val));

    // Remove trailing slash from pathname if not root
    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.slice(0, -1);
    }

    return url.toString();
  } catch (e) {
    return input;
  }
}

/**
 * Validates a URL for SSRF protection and basic sanity.
 */
export function validateUrl(input: string): { valid: boolean; error?: string } {
  try {
    const url = new URL(input);

    // Protocol must be HTTPS
    if (url.protocol !== 'https:') {
      return { valid: false, error: 'ONLY_HTTPS_ALLOWED' };
    }

    const host = url.hostname.toLowerCase();

    // Block private IP ranges and internal hosts
    const privateRanges = [
      /^localhost$/,
      /^127\./,
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
      /^169\.254\./,
      /^0\./,
      /::1/,
      /fe80:/
    ];

    if (privateRanges.some(re => re.test(host))) {
      return { valid: false, error: 'INTERNAL_HOST_BLOCKED' };
    }

    // Basic domain validation (must have at least one dot)
    if (!host.includes('.')) {
      return { valid: false, error: 'INVALID_DOMAIN' };
    }

    return { valid: true };
  } catch (e) {
    return { valid: false, error: 'INVALID_URL_FORMAT' };
  }
}
