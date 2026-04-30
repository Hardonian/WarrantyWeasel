'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AnalysisResult } from '@/types';

export default function ResultPage() {
  const { id } = useParams();
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    if (id) {
      const data = window.sessionStorage.getItem(`result_${id}`);
      if (data) {
        setResult(JSON.parse(data));
      }
    }
  }, [id]);

  if (!result) {
    return (
      <div className="container" style={{ padding: '8rem 0', textAlign: 'center' }}>
        <div className="glass" style={{ padding: '4rem' }}>
          <h2>Locating analysis...</h2>
        </div>
      </div>
    );
  }

  const getVerdictColor = (v: string) => {
    switch (v) {
      case 'BUY': return 'var(--success)';
      case 'CAUTION': return 'var(--warning)';
      case 'AVOID': return 'var(--danger)';
      default: return 'var(--neutral)';
    }
  };

  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <div className="glass" style={{ padding: '3rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ marginBottom: '0.5rem' }}>Analysis Result</h1>
            <p style={{ color: 'var(--neutral)' }}>ID: {result.resultId}</p>
          </div>
          <div style={{ 
            padding: '1rem 2rem', 
            borderRadius: 'var(--radius)', 
            background: getVerdictColor(result.verdict),
            color: 'white',
            fontWeight: 800,
            fontSize: '1.5rem'
          }}>
            {result.verdict}
          </div>
        </div>

        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>Confidence</span>
            <span>{result.confidence}%</span>
          </div>
          <div style={{ height: '8px', background: 'var(--glass-border)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'var(--primary)', width: `${result.confidence}%` }}></div>
          </div>
          <p style={{ marginTop: '1rem', color: 'var(--neutral)', fontSize: '0.9rem' }}>{result.confidenceExplanation}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
          <div>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Top Reasons</h2>
            <ul style={{ padding: 0, listStyle: 'none' }}>
              {result.reasons.map((r, i) => (
                <li key={i} style={{ padding: '1rem', marginBottom: '0.5rem', borderLeft: '3px solid var(--primary)', background: 'rgba(255,255,255,0.02)' }}>
                  {r}
                </li>
              ))}
              {result.reasons.length === 0 && <li style={{ color: 'var(--neutral)' }}>No significant anomalies detected.</li>}
            </ul>
          </div>

          <div>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Detected Signals</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {result.signals.map((s, i) => (
                <span key={i} className="glass" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderColor: 'var(--primary)' }}>
                  {s.name}
                </span>
              ))}
              {result.signals.length === 0 && <p style={{ color: 'var(--neutral)' }}>Neutral signal landscape.</p>}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button onClick={() => window.location.href = '/'} className="btn glass">Analyze Another</button>
        <button className="btn btn-primary" onClick={() => alert('Link copied!')}>Share Analysis</button>
      </div>
    </div>
  );
}
