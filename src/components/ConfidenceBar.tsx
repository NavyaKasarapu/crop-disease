import React from 'react';

interface ConfidenceBarProps {
  confidence: number; // 0 - 100
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ConfidenceBar: React.FC<ConfidenceBarProps> = ({
  confidence,
  showLabel = true,
  size = 'md',
  className = ''
}) => {
  const clamped = Math.min(100, Math.max(0, confidence));

  // Determine agronomic confidence color
  let barColor = 'bg-emerald-600';
  let badgeColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  let label = 'High Confidence';

  if (clamped < 70) {
    barColor = 'bg-amber-500';
    badgeColor = 'text-amber-700 bg-amber-50 border-amber-200';
    label = 'Moderate Confidence';
  } else if (clamped < 85) {
    barColor = 'bg-teal-600';
    badgeColor = 'text-teal-700 bg-teal-50 border-teal-200';
    label = 'Reliable Confidence';
  }

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5'
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs mb-1.5 font-medium text-stone-700">
          <div className="flex items-center gap-2">
            <span>ViT Softmax Confidence</span>
            <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded border ${badgeColor}`}>
              {label}
            </span>
          </div>
          <span className="font-mono font-semibold tabular-nums text-sm text-stone-900">
            {clamped.toFixed(1)}%
          </span>
        </div>
      )}
      <div className={`w-full bg-stone-200/80 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`${heights[size]} ${barColor} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
