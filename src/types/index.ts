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

export interface AnalysisResult {
  verdict: 'BUY' | 'CAUTION' | 'AVOID' | 'UNKNOWN';
  confidence: number;
  confidenceExplanation: string;
  reasons: string[];
  signals: SignalDetail[];
  evidence: EvidenceDetail[];
  limitations: string[];
}
