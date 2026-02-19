import { BirthChartData, ZODIAC_SYMBOLS, formatDegree } from '@/astrology/lib/astrology';
import { Compass } from 'lucide-react';

interface BirthChartDisplayProps {
  chartData: BirthChartData | null;
}

const BirthChartDisplay = ({ chartData }: BirthChartDisplayProps) => {
  if (!chartData) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <Compass className="w-16 h-16 text-muted-foreground mb-4 animate-pulse" />
        <p className="text-muted-foreground">Enter your birth details to generate your Vedic birth chart</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* South Indian Style Chart */}
      <div className="relative aspect-square max-w-md mx-auto">
        <svg viewBox="0 0 300 300" className="w-full h-full">
          {/* Outer border */}
          <rect x="10" y="10" width="280" height="280" fill="none" stroke="hsl(var(--border))" strokeWidth="2" />
          
          {/* Grid lines */}
          <line x1="103" y1="10" x2="103" y2="290" stroke="hsl(var(--border))" strokeWidth="1" />
          <line x1="197" y1="10" x2="197" y2="290" stroke="hsl(var(--border))" strokeWidth="1" />
          <line x1="10" y1="103" x2="290" y2="103" stroke="hsl(var(--border))" strokeWidth="1" />
          <line x1="10" y1="197" x2="290" y2="197" stroke="hsl(var(--border))" strokeWidth="1" />
          
          {/* Diagonal lines for corner houses */}
          <line x1="10" y1="10" x2="103" y2="103" stroke="hsl(var(--border))" strokeWidth="1" />
          <line x1="197" y1="10" x2="290" y2="103" stroke="hsl(var(--border))" strokeWidth="1" />
          <line x1="10" y1="197" x2="103" y2="290" stroke="hsl(var(--border))" strokeWidth="1" />
          <line x1="197" y1="197" x2="290" y2="290" stroke="hsl(var(--border))" strokeWidth="1" />
          <line x1="103" y1="10" x2="10" y2="103" stroke="hsl(var(--border))" strokeWidth="1" />
          <line x1="290" y1="10" x2="197" y2="103" stroke="hsl(var(--border))" strokeWidth="1" />
          <line x1="10" y1="290" x2="103" y2="197" stroke="hsl(var(--border))" strokeWidth="1" />
          <line x1="290" y1="290" x2="197" y2="197" stroke="hsl(var(--border))" strokeWidth="1" />
          
          {/* House numbers - South Indian style positions */}
          {[
            { x: 56, y: 56, house: 12 },
            { x: 150, y: 56, house: 1 },
            { x: 243, y: 56, house: 2 },
            { x: 56, y: 150, house: 11 },
            { x: 243, y: 150, house: 3 },
            { x: 56, y: 243, house: 10 },
            { x: 150, y: 243, house: 7 },
            { x: 243, y: 243, house: 4 },
            { x: 36, y: 36, house: 'Pi' },
            { x: 264, y: 36, house: 'Ar' },
            { x: 264, y: 264, house: 'Cn' },
            { x: 36, y: 264, house: 'Aq' },
          ].map((item, i) => (
            <text
              key={i}
              x={item.x}
              y={item.y}
              textAnchor="middle"
              fill="hsl(var(--muted-foreground))"
              fontSize="10"
              className="font-sans"
            >
              {item.house}
            </text>
          ))}
          
          {/* Planets in houses */}
          {chartData.planets.map((planet, i) => {
            const houseIndex = Math.floor(planet.longitude / 30);
            // Simplified positioning
            const positions = [
              { x: 150, y: 70 }, // House 1
              { x: 243, y: 70 }, // House 2
              { x: 260, y: 150 }, // House 3
              { x: 243, y: 230 }, // House 4
              { x: 190, y: 243 }, // House 5
              { x: 150, y: 243 }, // House 6
              { x: 110, y: 243 }, // House 7
              { x: 56, y: 230 }, // House 8
              { x: 40, y: 150 }, // House 9
              { x: 56, y: 70 }, // House 10
              { x: 56, y: 150 }, // House 11
              { x: 56, y: 56 }, // House 12
            ];
            
            const pos = positions[houseIndex] || positions[0];
            const offset = (i % 3) * 15 - 15;
            
            return (
              <text
                key={planet.name}
                x={pos.x + offset}
                y={pos.y + Math.floor(i / 3) * 12}
                textAnchor="middle"
                fill={planet.retrograde ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'}
                fontSize="14"
                className="font-sans"
              >
                {planet.symbol}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Key Information */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
          <p className="text-xs text-muted-foreground mb-1">Ascendant</p>
          <p className="font-display text-lg text-primary">{chartData.ascendantSign}</p>
        </div>
        <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
          <p className="text-xs text-muted-foreground mb-1">Moon Sign</p>
          <p className="font-display text-lg text-foreground">{chartData.moonSign}</p>
        </div>
        <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
          <p className="text-xs text-muted-foreground mb-1">Sun Sign</p>
          <p className="font-display text-lg text-foreground">{chartData.sunSign}</p>
        </div>
      </div>

      {/* Planetary Positions */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Planetary Positions</h3>
        <div className="grid grid-cols-1 gap-2">
          {chartData.planets.map((planet) => (
            <div
              key={planet.name}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/20"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl" style={{ color: planet.retrograde ? 'hsl(var(--destructive))' : 'hsl(var(--primary))' }}>
                  {planet.symbol}
                </span>
                <span className="text-foreground">{planet.name}</span>
                {planet.retrograde && <span className="text-xs text-destructive">(R)</span>}
              </div>
              <div className="text-right">
                <p className="text-sm text-foreground">
                  {ZODIAC_SYMBOLS[planet.sign]} {planet.signName} {formatDegree(planet.degree)}
                </p>
                <p className="text-xs text-muted-foreground">{planet.nakshatra} Pada {planet.nakshatraPada}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BirthChartDisplay;