'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AnalysisResult } from '@/types';

export default function ResultPage() {
  const { id } = useParams();
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      const data = window.sessionStorage.getItem(`result_${id}`);
      if (data) {
        try {
          setResult(JSON.parse(data));
        } catch (e) {
          console.error('Failed to parse result data', e);
        }
      }
    }
  }, [id]);

  useEffect(() => {
    if (barRef.current && result) {
      barRef.current.style.width = `${result.confidence}%`;
    }
  }, [result]);

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-xl backdrop-blur-sm">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <h2 className="text-xl font-semibold text-gray-900">Locating analysis...</h2>
          <p className="mt-2 text-gray-500">This should only take a moment.</p>
        </div>
      </div>
    );
  }

  const getVerdictBg = (v: string) => {
    switch (v) {
      case 'BUY': return 'bg-buy';
      case 'CAUTION': return 'bg-caution';
      case 'AVOID': return 'bg-avoid';
      default: return 'bg-unknown';
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
        {/* Header Section */}
        <div className="flex flex-col items-start justify-between gap-6 border-b border-gray-100 p-8 md:flex-row md:items-center">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Analysis Result</h1>
            <p className="font-mono text-sm text-gray-400">ID: {result.resultId}</p>
          </div>
          <div className={`${getVerdictBg(result.verdict)} rounded-2xl px-8 py-4 text-2xl font-black text-white shadow-lg transition-transform hover:scale-105`}>
            {result.verdict}
          </div>
        </div>

        <div className="p-8">
          {/* Confidence Meter */}
          <div className="mb-12 rounded-2xl bg-gray-50 p-6">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <span className="text-sm font-bold uppercase tracking-wider text-gray-400">Confidence Score</span>
                <p className="text-sm text-gray-600">{result.confidenceExplanation}</p>
              </div>
              <span className="text-4xl font-black text-blue-600">{result.confidence}%</span>
            </div>
            <div className="h-4 overflow-hidden rounded-full bg-gray-200">
              <div 
                ref={barRef}
                className="h-full w-0 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-1000 ease-out"
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            {/* Reasons List */}
            <div className="space-y-6">
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <span className="h-6 w-1 bg-blue-600"></span>
                Top Reasons
              </h2>
              <ul className="space-y-3">
                {result.reasons.map((r, i) => (
                  <li key={i} className="rounded-xl border border-gray-100 bg-white p-4 text-sm text-gray-700 shadow-sm transition-shadow hover:shadow-md">
                    <span className="mr-2 text-blue-500">●</span>
                    {r}
                  </li>
                ))}
                {result.reasons.length === 0 && (
                  <li className="italic text-gray-400">No significant anomalies detected.</li>
                )}
              </ul>
            </div>

            {/* Signals Grid */}
            <div className="space-y-6">
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <span className="h-6 w-1 bg-blue-600"></span>
                Detected Signals
              </h2>
              <div className="flex flex-wrap gap-2">
                {result.signals.map((s, i) => (
                  <span key={i} className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                    {s.name.replace(/_/g, ' ')}
                  </span>
                ))}
                {result.signals.length === 0 && (
                  <p className="text-sm italic text-gray-400">Neutral signal landscape.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col gap-4 bg-gray-50 p-8 sm:flex-row sm:justify-end">
          <button 
            onClick={() => router.push('/')} 
            className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-700 shadow-sm transition-all hover:bg-gray-100 hover:shadow"
          >
            Analyze Another
          </button>
          <button 
            className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-blue-200"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Link copied to clipboard!');
            }}
          >
            Share Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
