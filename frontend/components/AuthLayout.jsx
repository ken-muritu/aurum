"use client";

export default function AuthLayout({ children }) {
  return (
    <div className="container auth-wrap auth-split">
      <div className="auth-motif" aria-hidden="true">
        <div className="auth-motif-inner">
          <svg viewBox="0 0 300 340" className="auth-motif-svg">
            <defs>
              <linearGradient id="authGrad" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--gold)" />
                <stop offset="100%" stopColor="var(--mint)" />
              </linearGradient>
            </defs>
            {[
              { x: 10, y: 25, r: -10 },
              { x: 60, y: 50, r: -20 },
              { x: 120, y: 95, r: -14 },
              { x: 160, y: 18, r: 22 },
              { x: 85, y: 145, r: 8 },
            ].map((n, i) => (
              <g key={"a" + i} transform={"translate(" + n.x + "," + n.y + ") rotate(" + n.r + ")"}>
                <rect x="0" y="0" width="100" height="56" rx="8" fill="var(--surface-2)" stroke="var(--border)" strokeWidth="1.5" />
                <rect x="10" y="10" width="50" height="8" rx="4" fill="var(--surface-3)" />
                <rect x="10" y="22" width="70" height="6" rx="3" fill="var(--surface-3)" />
                <rect x="10" y="34" width="60" height="6" rx="3" fill="var(--surface-3)" />
              </g>
            ))}
            {[120, 200, 280].map(function(cx, i) {
              return (
                <g key={"b" + i}>
                  <rect x={cx} y={100} width="80" height="56" rx="8" fill="var(--surface-1)" stroke="var(--border-hi)" strokeWidth="1.2" />
                  <rect x={cx + 12} y={112} width="52" height="8" rx="4" fill="var(--surface-3)" />
                  <rect x={cx + 12} y={126} width="40" height="6" rx="3" fill="var(--surface-3)" />
                  <rect x={cx + 36} y={132} width="16" height="16" r="8" fill="var(--mint)" />
                </g>
              );
            })}
            <path d="M 170 60 C 210 60 235 80 265 100" fill="none" stroke="url(#authGrad)" strokeWidth="1.3" strokeDasharray="10 8" />
            <path d="M 280 156 L 290 156" fill="none" stroke="var(--mint)" strokeWidth="1.6" />
          </svg>
        </div>
      </div>
      <div className="auth-card auth-card--elevated">
        {children}
      </div>
    </div>
  );
}
