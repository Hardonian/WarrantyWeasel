'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (data.ok) {
        // Store in local state/session or just redirect to result
        // For this demo, we'll use session storage to pass data or just pass the hash
        const hash = data.resultId;
        window.sessionStorage.setItem(`result_${hash}`, JSON.stringify(data));
        router.push(`/result/${hash}`);
      } else {
        setError(data.errorCode || 'Analysis failed. Please try a different URL.');
      }
    } catch (err) {
      setError('A network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '4rem 0 8rem' }}>
      <section style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>
          Stop buying <span style={{ color: 'var(--danger)' }}>ghost</span> reviews.
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--neutral)', maxWidth: '600px', margin: '0 auto 3rem' }}>
          Deterministic intelligence to decode product sentiment. 
          We strip the noise, detect the bots, and give you the truth.
        </p>

        <form onSubmit={handleAnalyze} className="glass" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '1rem' }}>
          <input 
            type="url" 
            className="input" 
            placeholder="Paste Amazon or retail product URL..." 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            disabled={loading}
          />
          <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }} disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze Now'}
          </button>
        </form>
        {error && <p style={{ color: 'var(--danger)', marginTop: '1rem' }}>{error}</p>}
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div className="glass" style={{ padding: '2rem' }}>
          <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Resilient Scrapers</h3>
          <p style={{ color: 'var(--neutral)' }}>Tiered fetching strategies to bypass blockers and CAPTCHAs silently.</p>
        </div>
        <div className="glass" style={{ padding: '2rem' }}>
          <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Deterministic Scoring</h3>
          <p style={{ color: 'var(--neutral)' }}>No AI hallucination. Pure signal-based scoring with 50+ failure handlers.</p>
        </div>
        <div className="glass" style={{ padding: '2rem' }}>
          <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Privacy First</h3>
          <p style={{ color: 'var(--neutral)' }}>No PII stored. No tracking parameters. Just the data you need.</p>
        </div>
      </div>
    </div>
  );
}
