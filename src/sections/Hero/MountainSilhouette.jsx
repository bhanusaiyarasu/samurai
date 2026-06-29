import React from 'react';

export default function MountainSilhouette() {
  return (
    <svg
      className="hero-mountains"
      viewBox="0 0 1200 400"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '45%',
        pointerEvents: 'none',
      }}
    >
      <defs>
        <linearGradient id="mountainGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(40, 20, 10, 0.3)" />
          <stop offset="100%" stopColor="rgba(20, 10, 5, 0.6)" />
        </linearGradient>
        <linearGradient id="mountainGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(30, 15, 8, 0.25)" />
          <stop offset="100%" stopColor="rgba(15, 8, 4, 0.5)" />
        </linearGradient>
      </defs>

      {/* Back mountain range (deeper, more transparent) */}
      <path
        d="M 0 200 Q 150 80 300 140 T 600 120 T 900 100 T 1200 180 L 1200 400 L 0 400 Z"
        fill="url(#mountainGrad1)"
      />

      {/* Mid mountain range */}
      <path
        d="M 0 260 Q 120 180 240 220 Q 360 260 480 200 Q 600 140 720 240 Q 840 280 960 210 Q 1080 150 1200 280 L 1200 400 L 0 400 Z"
        fill="url(#mountainGrad2)"
      />

      {/* Front mountain silhouette (darker, sharper) */}
      <path
        d="M 0 300 L 80 220 L 180 290 L 280 180 L 360 260 L 480 150 L 580 280 L 680 190 L 780 270 L 900 160 L 1000 290 L 1100 200 L 1200 320 L 1200 400 L 0 400 Z"
        fill="rgba(10, 5, 2, 0.7)"
      />
    </svg>
  );
}
