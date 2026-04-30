import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ReviewGhost | Sneak Past the Fine Print',
  description: 'Deterministic product analysis for the skeptical buyer.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="container" style={{ padding: '2rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary)' }}>ReviewGhost</div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <a href="/privacy" style={{ color: 'var(--neutral)', textDecoration: 'none' }}>Privacy</a>
            <a href="/terms" style={{ color: 'var(--neutral)', textDecoration: 'none' }}>Terms</a>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="container" style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--neutral)', fontSize: '0.875rem' }}>
          <p>© 2026 ReviewGhost. Policy signals only; not a guarantee; verify before purchase.</p>
        </footer>
      </body>
    </html>
  );
}
