import React from 'react';
import { interpretStrength, renderStars } from '@/astrology/lib/interpretation-engine';

interface StrengthMeterProps {
  shadbalaScore: number;
  planetName: string;
  showDetails?: boolean;
  compact?: boolean;
}

export function StrengthMeter({
  shadbalaScore,
  planetName,
  showDetails = true,
  compact = false
}: StrengthMeterProps) {
  const strength = interpretStrength(shadbalaScore, planetName);

  if (compact) {
    // Compact version for tables
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm">{renderStars(strength.stars)}</span>
        <span className="text-xs font-medium" style={{ color: strength.color }}>
          {strength.label}
        </span>
      </div>
    );
  }

  // Full version
  return (
    <div className="space-y-2">
      {/* Stars and Label */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{renderStars(strength.stars)}</span>
          <span className="text-sm font-semibold" style={{ color: strength.color }}>
            {strength.label}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {strength.percentage}% of required
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${Math.min(strength.percentage, 100)}%`,
            backgroundColor: strength.color
          }}
        />
      </div>

      {/* Description */}
      {showDetails && (
        <p className="text-xs text-muted-foreground leading-relaxed">
          {strength.description}
        </p>
      )}

      {/* Technical details (collapsible) */}
      {showDetails && (
        <details className="text-xs">
          <summary className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
            Show technical details
          </summary>
          <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-900 rounded text-xs space-y-1">
            <div><strong>Shadbala Score:</strong> {shadbalaScore.toFixed(2)} Shashtiamsha</div>
            <div><strong>Required Minimum:</strong> {(shadbalaScore / (strength.percentage / 100)).toFixed(2)} Shashtiamsha</div>
            <div><strong>Percentage:</strong> {strength.percentage}%</div>
          </div>
        </details>
      )}
    </div>
  );
}
