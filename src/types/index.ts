export interface ScrapedData {
  title: string | null;
  rating: number | null;
  ratingCount: number | null;
  reviewCount: number | null;
  reviewSnippets: string[];
  timestamps: string[];
  reviewerNames: string[];
  isVerified: boolean[];
  blocked: boolean;
  degraded?: boolean;
  failureReason?: string;
  category?: string;
}

export interface SignalDetail {
  name: string;
  weight: number;
  explanation: string;
}

export interface EvidenceDetail {
  signal: string;
  snippet: string;
  source: string;
}

export type ErrorCode = 
  | 'UNSUPPORTED_DOMAIN' 
  | 'INVALID_URL' 
  | 'FETCH_BLOCKED' 
  | 'PARTIAL_PARSE' 
  | 'TIMEOUT' 
  | 'RATE_LIMITED'
  | 'UNKNOWN_ERROR';

export interface AnalysisResult {
  schemaVersion: string;
  ok: boolean;
  resultId: string;
  verdict: 'BUY' | 'CAUTION' | 'AVOID' | 'UNKNOWN';
  confidence: number;
  confidenceExplanation: string;
  reasons: string[];
  signals: SignalDetail[];
  evidence: EvidenceDetail[];
  limitations: string[];
  degraded?: boolean;
  errorCode?: ErrorCode;
}
export interface FailureScenario {
  id: string;
  scenario: string;
  trigger: string;
  expectedBehavior: string;
  badBehavior: string;
  fix: string;
  userMessage: string;
  confidenceImpact: number;
  testCase: string;
}

export interface SuspiciousSignal {
  name: string;
  description: string;
  weight: number;
  example: string;
  explanation: string;
}

export interface SafeSignal {
  name: string;
  description: string;
  weight: number;
  example: string;
}
