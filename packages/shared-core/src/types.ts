export type Verdict = 'BUY' | 'CAUTION' | 'AVOID' | 'UNKNOWN'

export type SignalStrength = 'strong' | 'weak' | 'conflicting'

export type FailureSeverity = 'low' | 'medium' | 'high' | 'critical'

export type ErrorCode =
  | 'UNSUPPORTED_DOMAIN'
  | 'INVALID_URL'
  | 'FETCH_BLOCKED'
  | 'PARTIAL_PARSE'
  | 'TIMEOUT'
  | 'RATE_LIMITED'
  | 'UNKNOWN_ERROR'
  | 'CIRCUIT_BREAKER_OPEN'

export type FallbackStrategy =
  | 'retry-with-backoff'
  | 'try-next-tier'
  | 'return-unknown'
  | 'partial-parse'
  | 'safe-truncate'
  | 'none'

export interface SignalEvidence {
  source: string
  snippet: string
}

export interface SignalResult {
  name: string
  weight: number
  explanation: string
  strength: SignalStrength
  evidence?: SignalEvidence[]
}

export interface SignalDetail {
  name: string
  weight: number
  explanation: string
}

export interface EvidenceDetail {
  signal: string
  snippet: string
  source: string
}

export interface ProductInfo {
  name: string | null
  category: string | null
  price: number | null
  url: string
  urlHash: string
}

export interface VerdictResult {
  buyRisk: Verdict
  returnDifficulty: 'low' | 'medium' | 'high' | 'unknown'
  warrantyStrength: 'strong' | 'moderate' | 'weak' | 'unknown'
  confidence: number
  confidenceExplanation: string
}

export interface AnalyzeResult {
  schemaVersion: string
  ok: boolean
  resultId: string
  product: ProductInfo
  verdict: VerdictResult
  redFlags: SignalDetail[]
  finePrintHits: string[]
  whatToCheck: string[]
  signals: SignalDetail[]
  evidence: EvidenceDetail[]
  limitations: string[]
  degraded: boolean
  diagnosticsId: string
  errorCode?: ErrorCode
}

export interface ErrorResponse {
  ok: false
  code: string
  message: string
  retryable: boolean
  degraded?: boolean
}

export interface ParsedReview {
  id: string
  title: string
  rating: number
  date: string | null
  author: string
  verified: boolean
  snippet: string
  helpfulVotes: number
  rawHtml: string
}

export interface ParsedData {
  reviews: ParsedReview[]
  productName: string | null
  averageRating: number | null
  totalReviews: number | null
  category: string | null
  metadata: Record<string, unknown>
}

export interface FetchResult {
  success: boolean
  html: string | null
  status: number
  strategy: string
  degraded: boolean
  userMessage: string
  confidencePenalty: number
  failureId: string | null
  redirected: boolean
  responseUrl: string
}

export interface FailureScenario {
  id: string
  scenario: string
  trigger: string
  severity: FailureSeverity
  expectedBehavior: string
  userMessage: string
  confidencePenalty: number
  fallbackStrategy: FallbackStrategy
  testCase: string
}

export interface ConfidenceResult {
  confidence: number
  explanation: string
  capped: boolean
  capReason: string | null
}

export interface ScoreResult {
  score: number
  verdict: Verdict
  confidence: number
  confidenceExplanation: string
  signals: SignalResult[]
  reasons: string[]
  limitations: string[]
}

export interface DegradedStateContext {
  reason: string
  failureId: string | null
  fallback: string
  userMessage: string
  confidenceImpact: number
  timestamp: number
}

export interface CacheEntry<T> {
  result: T
  expiresAt: number
  createdAt: number
}

export interface CacheConfig {
  defaultTTL: number
  maxSize: number
}

export interface CategoryRule {
  category: string
  adjustments: Record<string, number>
  description: string
}

export interface SuspiciousSignal {
  name: string
  description: string
  weight: number
  example: string
  explanation: string
}

export interface SafeSignal {
  name: string
  description: string
  weight: number
  example: string
}

export interface EdgeCase {
  id: string
  description: string
  handling: string
}

export interface IntelConfig {
  maxResponseSize: number
  fetchTimeout: number
  maxRetries: number
  retryDelayBase: number
  maxReviewsToParse: number
  minReviewsForAnalysis: number
  cacheTTL: number
}

export interface DomainAdapter {
  domain: string
  patterns: RegExp[]
  fetch: (url: string) => Promise<FetchResult>
  parse: (html: string) => ParsedData
  extractCategory: (html: string, productName: string | null) => string
}

export interface ValidationResult {
  valid: boolean
  error?: string
}

export interface SanitizationOptions {
  maxLength?: number
  allowedTags?: string[]
}
