export default function CarIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 800 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Road */}
      <rect x="0" y="330" width="800" height="70" fill="rgba(255,255,255,0.05)" rx="4" />
      <line x1="50" y1="365" x2="150" y2="365" stroke="rgba(255,255,255,0.15)" strokeWidth="3" strokeDasharray="20 15" />
      <line x1="200" y1="365" x2="300" y2="365" stroke="rgba(255,255,255,0.15)" strokeWidth="3" strokeDasharray="20 15" />
      <line x1="350" y1="365" x2="450" y2="365" stroke="rgba(255,255,255,0.15)" strokeWidth="3" strokeDasharray="20 15" />
      <line x1="500" y1="365" x2="600" y2="365" stroke="rgba(255,255,255,0.15)" strokeWidth="3" strokeDasharray="20 15" />
      <line x1="650" y1="365" x2="750" y2="365" stroke="rgba(255,255,255,0.15)" strokeWidth="3" strokeDasharray="20 15" />

      {/* Car body (lower) */}
      <path
        d="M210 265 L220 245 Q225 238 235 235 L540 235 Q560 235 565 245 L575 265 Q580 275 580 285 L580 310 L200 310 L200 285 Q200 275 210 265 Z"
        fill="rgba(59,130,246,0.55)"
        stroke="rgba(59,130,246,0.75)"
        strokeWidth="2"
      />

      {/* Car cabin (roof) — connects to body at y=235 */}
      <path
        d="M280 235 L305 185 Q312 172 330 168 L430 168 Q448 172 455 185 L480 235 Z"
        fill="rgba(59,130,246,0.45)"
        stroke="rgba(59,130,246,0.7)"
        strokeWidth="2"
      />

      {/* Rear window — inset within cabin left half */}
      <path
        d="M293 230 L313 190 Q318 182 330 178 L374 176 L374 230 Z"
        fill="rgba(148,197,248,0.2)"
        stroke="rgba(148,197,248,0.35)"
        strokeWidth="1.5"
      />

      {/* Front window — inset within cabin right half */}
      <path
        d="M384 230 L384 176 L430 178 Q442 182 447 190 L467 230 Z"
        fill="rgba(148,197,248,0.2)"
        stroke="rgba(148,197,248,0.35)"
        strokeWidth="1.5"
      />

      {/* Window divider (B-pillar) */}
      <line x1="379" y1="176" x2="379" y2="230" stroke="rgba(59,130,246,0.6)" strokeWidth="4" />

      {/* Hood line */}
      <line x1="480" y1="240" x2="560" y2="248" stroke="rgba(59,130,246,0.4)" strokeWidth="1.5" />

      {/* Trunk line */}
      <line x1="280" y1="240" x2="225" y2="248" stroke="rgba(59,130,246,0.4)" strokeWidth="1.5" />

      {/* Headlights */}
      <ellipse cx="570" cy="260" rx="10" ry="7" fill="rgba(251,191,36,0.5)" />
      <ellipse cx="570" cy="260" rx="5" ry="3.5" fill="rgba(251,191,36,0.9)" />

      {/* Taillights */}
      <ellipse cx="208" cy="260" rx="7" ry="5" fill="rgba(239,68,68,0.5)" />
      <ellipse cx="208" cy="260" rx="3.5" ry="2.5" fill="rgba(239,68,68,0.8)" />

      {/* Bumper details */}
      <rect x="215" y="295" width="350" height="4" rx="2" fill="rgba(59,130,246,0.3)" />

      {/* Wheels */}
      <circle cx="280" cy="315" r="32" fill="rgba(20,20,20,0.85)" stroke="rgba(80,80,80,0.5)" strokeWidth="2" />
      <circle cx="280" cy="315" r="20" fill="rgba(50,50,50,0.8)" stroke="rgba(100,100,100,0.4)" strokeWidth="2" />
      <circle cx="280" cy="315" r="7" fill="rgba(140,140,140,0.5)" />

      <circle cx="500" cy="315" r="32" fill="rgba(20,20,20,0.85)" stroke="rgba(80,80,80,0.5)" strokeWidth="2" />
      <circle cx="500" cy="315" r="20" fill="rgba(50,50,50,0.8)" stroke="rgba(100,100,100,0.4)" strokeWidth="2" />
      <circle cx="500" cy="315" r="7" fill="rgba(140,140,140,0.5)" />

      {/* Speed lines */}
      <line x1="100" y1="250" x2="175" y2="250" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
      <line x1="80" y1="270" x2="170" y2="270" stroke="rgba(255,255,255,0.07)" strokeWidth="2" />
      <line x1="110" y1="290" x2="180" y2="290" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />

      {/* Background shapes */}
      <circle cx="650" cy="100" r="40" fill="rgba(255,255,255,0.03)" />
      <circle cx="100" cy="80" r="60" fill="rgba(255,255,255,0.02)" />
      <circle cx="400" cy="60" r="30" fill="rgba(255,255,255,0.03)" />
    </svg>
  );
}
