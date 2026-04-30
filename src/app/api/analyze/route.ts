import { NextRequest, NextResponse } from 'next/server';
import { validateUrl, normalizeUrl } from '@/lib/security/url';
import { getUrlHash, getCachedResult, setCachedResult, withCoalescing } from '@/lib/intel/cache';
import { fetchWithResilience } from '@/lib/scraper/fetcher';
import { analyzeProduct } from '@/lib/scoring/engine';
import { AnalysisResult, ErrorCode } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ ok: false, errorCode: 'INVALID_URL' as ErrorCode }, { status: 400 });
    }

    // 1. Validate & Normalize
    const validation = validateUrl(url);
    if (!validation.valid) {
      return NextResponse.json({ ok: false, errorCode: 'INVALID_URL' as ErrorCode, details: validation.error }, { status: 400 });
    }

    const normalized = normalizeUrl(url);
    const urlHash = getUrlHash(normalized);

    // 2. Cache Check
    const cached = getCachedResult(urlHash);
    if (cached) {
      return NextResponse.json(cached);
    }

    // 3. Process with Coalescing
    const result = await withCoalescing(urlHash, async () => {
      try {
        const data = await fetchWithResilience(normalized);
        const analysis = analyzeProduct(data);
        setCachedResult(urlHash, analysis);
        return analysis;
      } catch (error: any) {
        const errorCode: ErrorCode = error.message as ErrorCode || 'UNKNOWN_ERROR';
        return {
          schemaVersion: '1.0.0',
          ok: false,
          resultId: urlHash.substring(0, 8),
          verdict: 'UNKNOWN',
          confidence: 0,
          confidenceExplanation: 'Process failed during fetch or analysis.',
          reasons: [error.message],
          signals: [],
          evidence: [],
          limitations: ['System failure encountered.'],
          errorCode
        } as AnalysisResult;
      }
    });

    return NextResponse.json(result);

  } catch (e) {
    return NextResponse.json({ ok: false, errorCode: 'UNKNOWN_ERROR' as ErrorCode }, { status: 500 });
  }
}
