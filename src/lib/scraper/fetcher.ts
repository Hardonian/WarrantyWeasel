import { ScrapedData } from '@/types';
import * as cheerio from 'cheerio';
// import { getFailureByTrigger } from '../intel/failureRegistry';

const USER_AGENTS = {
  desktop: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  mobile: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1'
};

const DEFAULT_TIMEOUT = 10000;
const MAX_BODY_SIZE = 1024 * 1024 * 2; // 2MB

export interface FetchOptions {
  useMobile?: boolean;
  timeout?: number;
}

/**
 * Tiered fetch implementation with resilience handlers.
 */
export async function fetchWithResilience(url: string, options: FetchOptions = {}): Promise<ScrapedData> {
  const timeout = options.timeout || DEFAULT_TIMEOUT;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': options.useMobile ? USER_AGENTS.mobile : USER_AGENTS.desktop,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: controller.signal
    });

    clearTimeout(id);

    if (response.status === 429) {
      throw new Error('RATE_LIMITED');
    }

    if (response.status === 403) {
      // Try mobile UA if desktop failed with 403
      if (!options.useMobile) {
        return fetchWithResilience(url, { ...options, useMobile: true });
      }
      throw new Error('FETCH_BLOCKED');
    }

    if (!response.ok) {
      throw new Error(`HTTP_ERROR_${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('text/html')) {
       throw new Error('INVALID_CONTENT_TYPE');
    }

    // Check size limit
    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > MAX_BODY_SIZE) {
        // We'll still try to parse if possible, but mark as degraded later if needed
    }

    const html = await response.text();
    
    if (html.length === 0) {
      throw new Error('EMPTY_RESPONSE');
    }

    // Basic detection for CAPTCHA or other blockers in HTML
    if (html.includes('captcha') || html.includes('bot detection') || html.includes('challenge-platform')) {
       throw new Error('FETCH_BLOCKED');
    }

    return parseHtml(html, url);

  } catch (error: any) {
    clearTimeout(id);
    if (error.name === 'AbortError') throw new Error('TIMEOUT');
    throw error;
  }
}

/**
 * Basic HTML parser using Cheerio.
 * (This would be expanded with per-domain parsers in a real implementation)
 */
function parseHtml(html: string, _url: string): ScrapedData {
  const $ = cheerio.load(html);
  
  // Skeleton parsing logic
  const title = $('h1, .product-title').first().text().trim() || null;
  const rating = parseFloat($('.rating, [aria-label*="rating"]').first().text()) || null;
  
  return {
    title,
    rating,
    ratingCount: null, // Placeholders for now
    reviewCount: null,
    reviewSnippets: [],
    timestamps: [],
    reviewerNames: [],
    isVerified: [],
    blocked: false,
  };
}
