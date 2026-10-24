"use client";
export default function HeroIllustration({ className }) {
  return (
    <svg
      viewBox="0 0 900 360"
      className={className}
      className="hero-svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="gold" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--gold)" />
          <stop offset="100%" stopColor="var(--mint)" />
        </linearGradient>
        <linearGradient id="emberGrad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="var(--mint)" />
          <stop offset="100%" stopColor="var(--ember)" />
        </linearGradient>
      </defs>

      {/* Scattered source nodes */}
      {[
        { x: 60, y: 80, r: -12 },
        { x: 110, y: 60, r: -22 },
        { x: 170, y: 120, r: -8 },
        { x: 200, y: 90, r: -18 },
        { x: 250, y: 140, r: -14 },
      ].map((n, i) => (
        <g key={`s-${i}`} transform={`translate(${n.x}, ${n.y}) rotate(${n.r})`}>
          <rect
            x="0"
            y="0"
            width="140"
            height="80"
            rx="10"
            fill="var(--surface-2)"
            stroke="var(--border)"
            strokeWidth="2"
          />
          <rect x="12" y="12" width="60" height="10" rx="5" fill="var(--surface-3)" />
          <rect x="12" y="28" width="86" height="8" rx="4" fill="var(--surface-3)" />
          <rect x="12" y="42" width="70" height="8" rx="4" fill="var(--surface-3)" />
        </g>
      ))}

      {/* Scattered right-side approach cards */}
      {[
        { x: 480, y: 110, r: 8 },
        { x: 520, y: 190, r: -8 },
        { x: 480, y: 270, r: 10 },
      ].map((n, i) => (
        <g key={`a-${i}`} transform={`translate(${n.x}, ${n.y}) rotate(${n.r})`}>
          <rect
            x="0"
            y="0"
            width="110"
            height="56"
            rx="9"
            fill="var(--surface-2)"
            stroke="var(--border-hi)"
            strokeWidth="2"
          />
          <rect x="12" y="14" width="60" height="10" rx="5" fill="var(--surface-3)" />
        </g>
      ))}

      {/* Structured mastery path */}
      {[
        { x: 680, y: 40, check: false },
        { x: 680, y: 130, check: false },
        { x: 680, y: 220, check: true },
        { x: 680, y: 308, check: true },
      ].map((n, i) => (
        <g key={`m-${i}`}>
          <rect
            x={n.x}
            y={n.y}
            width="150"
            height="72"
            rx="10"
            fill="var(--surface-1)"
            stroke="var(--gold)"
            strokeWidth="1.5"
          />
          {n.check && (
            <circle cx={n.x + 28} cy={n.y + 36} r="14" fill="var(--mint)" />
          )}
          <rect x={n.x + 52} y={n.y + 20} width="80" height="10" rx="5" fill="var(--surface-3)" />
          <rect x={n.x + 52} y={n.y + 34} width="60" height="8" rx="4" fill="var(--surface-3)" />
          <rect x={n.x + 52} y={n.y + 48} width="50" height="8" rx="4" fill="var(--surface-3)" />
        </g>
      ))}

      {/* Connecting path */}
      <path
        d="M 300 120 C 380 120 480 70 540 40"
        fill="none"
        stroke="var(--gold)"
        strokeWidth="1.4"
        strokeDasharray="14 10"
        opacity="0.85"
      />
      <path
        d="M 300 120 C 380 120 480 160 540 188"
        fill="none"
        stroke="url(#emberGrad)"
        strokeWidth="1.4"
        strokeDasharray="14 10"
        opacity="0.9"
      />
      <path
        d="M 540 248 C 540 248 580 248 612 256"
        fill="none"
        stroke="var(--mint)"
        strokeWidth="2"
        strokeDasharray="14 10"
        opacity="0.9"
      />
      <path
        d="M 660 256 L 680 256"
        fill="none"
        stroke="var(--mint)"
        strokeWidth="2"
        opacity="0.9"
      />
      <path
        d="M 712 112 L 680 112"
        fill="none"
        stroke="var(--gold)"
        strokeWidth="1.4"
        strokeDasharray="14 10"
        opacity="0.85"
      />

      {/* Floating ember dots */}
      {[
        [310, 140, "var(--ember)"],
        [360, 118, "var(--gold)"],
        [440, 82, "var(--mint)"],
        [500, 158, "var(--ember)"],
        [570, 210, "var(--mint)"],
        [640, 230, "var(--gold)"],
      ].map(([cx, cy, c], i) => (
        <circle
          key={`d-${i}`}
          cx={cx}
          cy={cy}
          r="3.5"
          fill={c}
          opacity="0.9"
        />
      ))}
    </svg>
  );
}
