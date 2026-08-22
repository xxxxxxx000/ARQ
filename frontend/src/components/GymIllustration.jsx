import React from 'react';

export default function GymIllustration() {
  return (
    <div style={{ width: '100%', height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0' }}>
      <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="gymGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--acc)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--acc-2)" stopOpacity="0.6" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <circle cx="100" cy="100" r="60" fill="none" stroke="var(--acc)" strokeWidth="1" opacity="0.2">
          <animate attributeName="r" values="60; 90; 60" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2; 0; 0.2" dur="3s" repeatCount="indefinite" />
        </circle>
        
        <circle cx="100" cy="100" r="50" fill="none" stroke="var(--acc)" strokeWidth="1" opacity="0.4">
          <animate attributeName="r" values="50; 70; 50" dur="3s" repeatCount="indefinite" begin="1s" />
          <animate attributeName="opacity" values="0.4; 0; 0.4" dur="3s" repeatCount="indefinite" begin="1s" />
        </circle>

        <g filter="url(#glow)">
          <rect x="30" y="40" width="140" height="6" rx="3" fill="var(--label-2)" />
          <rect x="40" y="25" width="12" height="36" rx="4" fill="url(#gymGlow)" />
          <rect x="25" y="30" width="10" height="26" rx="3" fill="url(#gymGlow)" opacity="0.7" />
          <rect x="148" y="25" width="12" height="36" rx="4" fill="url(#gymGlow)" />
          <rect x="165" y="30" width="10" height="26" rx="3" fill="url(#gymGlow)" opacity="0.7" />
          
          <animateTransform 
            attributeName="transform" 
            type="translate" 
            values="0,20; 0,0; 0,20; 0,40; 0,20" 
            dur="4s" 
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1"
          />
        </g>
        
        <g>
          <circle cx="100" cy="90" r="14" fill="var(--label)" />
          <path d="M 85 110 Q 100 130 115 110 L 105 160 L 95 160 Z" fill="var(--label)" />
          <path d="M 85 110 Q 70 80 60 60" fill="none" stroke="var(--label)" strokeWidth="10" strokeLinecap="round">
             <animate attributeName="d" values="M 85 110 Q 70 80 60 60; M 85 110 Q 70 60 60 40; M 85 110 Q 70 80 60 60; M 85 110 Q 70 100 60 80; M 85 110 Q 70 80 60 60" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1" />
          </path>
          <path d="M 115 110 Q 130 80 140 60" fill="none" stroke="var(--label)" strokeWidth="10" strokeLinecap="round">
             <animate attributeName="d" values="M 115 110 Q 130 80 140 60; M 115 110 Q 130 60 140 40; M 115 110 Q 130 80 140 60; M 115 110 Q 130 100 140 80; M 115 110 Q 130 80 140 60" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1" />
          </path>
          <path d="M 95 160 L 80 190" fill="none" stroke="var(--label)" strokeWidth="12" strokeLinecap="round">
            <animate attributeName="d" values="M 95 160 L 80 190; M 95 160 L 75 190; M 95 160 L 80 190; M 95 160 L 85 180; M 95 160 L 80 190" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1" />
          </path>
          <path d="M 105 160 L 120 190" fill="none" stroke="var(--label)" strokeWidth="12" strokeLinecap="round">
             <animate attributeName="d" values="M 105 160 L 120 190; M 105 160 L 125 190; M 105 160 L 120 190; M 105 160 L 115 180; M 105 160 L 120 190" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1" />
          </path>
          
          <animateTransform 
            attributeName="transform" 
            type="translate" 
            values="0,15; 0,0; 0,15; 0,25; 0,15" 
            dur="4s" 
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1"
          />
        </g>
      </svg>
    </div>
  );
}
