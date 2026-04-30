import type { AnalysisResult, FetchResult, ParsedData, SignalResult, SignalEvidence } from '@/types'
import { fetchController } from '@/lib/scraper/fetchController'
import { parseReviews } from '@/lib/parsers/reviewParser'
import { runSignalDetection } from '@/lib/signals/signalDetector'
import { computeScore } from '@/lib/scoring/scoreCalculator'
import { validateUrl } from '@/lib/security/urlValidator'
import { MIN_REVIEWS_FOR_ANALYSIS, getFailureScenario } from '@/lib/intel'

const SCHEMA_VERSION = '1.0.0'

function generateId(url: string): string {
  return 'res_' + Buffer.from(url).toString('hex').slice(0, 12)
}

export async function analyzeUrl(url: string): Promise<AnalysisResult> {
  // Validate URL first
  const validation = validateUrl(url)
  if (!validation.valid) {
    return {
      schemaVersion: SCHEMA_VERSION,
      ok: true,
      resultId: generateId(url),
      verdict: 'UNKNOWN',
      confidence: 0,
      confidenceExplanation: validation.error || 'Invalid URL.',
      reasons: ['URL validation failed.'],
      signals: [],
      evidence: [],
      limitations: [validation.error || 'Invalid URL format.'],
      url,
      reviewCount: 0,
    }
  }

  // Fetch the page
  const fetchResult: FetchResult = await fetchController(url)

  // If fetch completely failed
  if (!fetchResult.success && !fetchResult.html) {
    const failureScenario = fetchResult.failureId ? getFailureScenario(fetchResult.failureId) : null
    return {
      schemaVersion: SCHEMA_VERSION,
      ok: true,
      resultId: generateId(url),
      verdict: 'UNKNOWN',
      confidence: 0,
      confidenceExplanation: fetchResult.userMessage || 'Unable to access the review page.',
      reasons: [fetchResult.userMessage || 'The review page could not be accessed.'],
      signals: [],
      evidence: [],
      limitations: [
        fetchResult.userMessage || 'Unable to fetch review data.',
        'Strategy attempted: ' + fetchResult.strategy,
        failureScenario?.userMessage || '',
      ].filter(Boolean),
      url,
      reviewCount: 0,
      degraded: true,
    }
  }

  // Parse reviews from HTML
  const parsedData: ParsedData = parseReviews(fetchResult.html || '')

  // Run signal detection
  const signals: SignalResult[] = runSignalDetection(
    parsedData.reviews,
    parsedData.metadata,
  )

  // Compute score
  const scoreResult = computeScore(
    signals,
    parsedData.reviews.length,
    fetchResult.confidencePenalty,
    parsedData.productName,
    parsedData.metadata,
  )

  // Build evidence from signals
  const evidence = signals.flatMap((s) =>
    (s.evidence || []).map((e: SignalEvidence) => ({
      signal: s.name,
      snippet: e.snippet,
      source: e.source,
    })),
  )

  // Build final result
  const result: AnalysisResult = {
    schemaVersion: SCHEMA_VERSION,
    ok: true,
    resultId: generateId(url),
    verdict: scoreResult.verdict,
    confidence: scoreResult.confidence,
    confidenceExplanation: scoreResult.confidenceExplanation,
    reasons: scoreResult.reasons.length > 0 ? scoreResult.reasons : ['No significant signals detected.'],
    signals: scoreResult.signals.map((s) => ({
      name: s.name,
      weight: s.weight,
      explanation: s.explanation,
    })),
    evidence,
    limitations: scoreResult.limitations,
    degraded: fetchResult.degraded || parsedData.reviews.length < MIN_REVIEWS_FOR_ANALYSIS,
    url,
    reviewCount: parsedData.reviews.length,
    productName: parsedData.productName || undefined,
    category: parsedData.category || undefined,
  }

  // If verdict is UNKNOWN, add next steps
  if (result.verdict === 'UNKNOWN') {
    result.limitations.push(
      'Try another product listing to compare.',
      'Check the seller return window and warranty information manually.',
    )
  }

  return result
}
