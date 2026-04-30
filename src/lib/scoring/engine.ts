import { ScrapedData, AnalysisResult, SignalDetail, EvidenceDetail } from '@/types';
import { suspiciousSignals } from '../intel/signalRegistry';
import { detectCategory } from '../intel/categoryRegistry';

/**
 * Normalizes scores to 0-100 range.
 */
function normalizeScore(score: number): number {
  return Math.min(Math.max(Math.round(score), 0), 100);
}

/**
 * Core scoring engine.
 */
export function analyzeProduct(data: ScrapedData): AnalysisResult {
  const resultId = Math.random().toString(36).substring(7);
  const signals: SignalDetail[] = [];
  const evidence: EvidenceDetail[] = [];
  const reasons: string[] = [];
  const limitations: string[] = [];

  let rawScore = 50; // Neutral baseline
  let confidence = 85; // Initial high confidence
  
  const category = data.category || detectCategory(data.title || '', {});

  // 1. Process Detected Signals (Simplified for this version)
  // In a real app, this would be based on sophisticated pattern matching
  
  if (data.blocked) {
    confidence = 30;
    return {
      schemaVersion: '1.0.0',
      ok: true,
      resultId,
      verdict: 'UNKNOWN',
      confidence,
      confidenceExplanation: 'Analysis blocked by site security.',
      reasons: ['Access restricted by the target site.'],
      signals: [],
      evidence: [],
      limitations: ['Full page content could not be retrieved.'],
      degraded: true,
      url: data.failureReason || 'unknown',
      reviewCount: 0,
    };
  }

  // Example heuristic checks
  if (data.rating === 5 && (!data.reviewCount || data.reviewCount < 5)) {
    const sig = suspiciousSignals.find(s => s.name === 'anonymity_ratio');
    if (sig) {
      signals.push({ name: sig.name, weight: sig.weight, explanation: sig.explanation });
      rawScore += sig.weight;
      reasons.push('Low review count for a perfect rating suggests potential manipulation.');
    }
  }

  if (data.title && (data.title.toLowerCase().includes('case') && data.title.toLowerCase().includes('charger'))) {
      const sig = suspiciousSignals.find(s => s.name === 'review_hijacking');
      if (sig) {
          signals.push({ name: sig.name, weight: sig.weight, explanation: sig.explanation });
          rawScore += sig.weight;
          reasons.push('Product title contains conflicting category keywords.');
      }
  }

  // 2. Apply Thresholds
  const score = normalizeScore(rawScore);
  let verdict: AnalysisResult['verdict'] = 'UNKNOWN';

  if (score <= 30) {
    verdict = 'BUY';
  } else if (score <= 60) {
    verdict = 'CAUTION';
  } else if (score <= 100) {
    // Require >= 2 signals for AVOID unless score is extremely high
    if (signals.length >= 2 || score > 80) {
        verdict = 'AVOID';
    } else {
        verdict = 'CAUTION';
    }
  }

  // 3. Confidence Caps
  if (data.degraded) confidence = Math.min(confidence, 60);
  if (signals.length === 0) confidence = Math.min(confidence, 75);
  if (signals.length > 2) confidence = Math.min(confidence, 95);

  return {
    schemaVersion: '1.0.0',
    ok: true,
    resultId,
    verdict,
    confidence,
    confidenceExplanation: `Based on ${signals.length} detected signals and category-specific rules for ${category}.`,
    reasons,
    signals,
    evidence,
    limitations,
    url: 'legacy_engine_result',
    reviewCount: data.reviewCount || 0,
  };
}
