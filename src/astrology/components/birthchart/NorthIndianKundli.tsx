import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { calculatePlanetHouse, calculateHousesData } from '@/astrology/lib/house-calculator';

interface Planet {
  longitude: number;
  sign: string;
  nakshatra: string;
  house: number;
}

interface NorthIndianKundliProps {
  planets: Record<string, Planet>;
  houses: number[] | Record<string, any>;
  ascendant: {
    sign: string;
    longitude: number;
  };
}

const PLANET_ABBREVIATIONS: Record<string, string> = {
  Sun: 'Su',
  Moon: 'Mo',
  Mars: 'Ma',
  Mercury: 'Me',
  Jupiter: 'Ju',
  Venus: 'Ve',
  Saturn: 'Sa',
  Rahu: 'Ra',
  Ketu: 'Ke'
};

const SIGN_ABBREVIATIONS: Record<string, string> = {
  Aries: 'Ar',
  Taurus: 'Ta',
  Gemini: 'Ge',
  Cancer: 'Cn',
  Leo: 'Le',
  Virgo: 'Vi',
  Libra: 'Li',
  Scorpio: 'Sc',
  Sagittarius: 'Sg',
  Capricorn: 'Cp',
  Aquarius: 'Aq',
  Pisces: 'Pi'
};

export default function NorthIndianKundli({ planets, houses, ascendant }: NorthIndianKundliProps) {
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Convert houses to proper format
  const houseCusps = Array.isArray(houses) ? houses : Object.values(houses);
  const housesData = calculateHousesData(houseCusps, ascendant.sign);

  // Recalculate correct planet houses
  const planetsWithCorrectHouses = Object.entries(planets).reduce((acc, [name, planetData]) => {
    const correctHouse = calculatePlanetHouse(planetData.longitude, houseCusps);
    acc[name] = { ...planetData, name, house: correctHouse };
    return acc;
  }, {} as Record<string, Planet & { name: string }>);

  // Group planets by house
  const planetsByHouse: Record<number, Array<Planet & { name: string }>> = {};
  Object.values(planetsWithCorrectHouses).forEach((planet) => {
    if (!planetsByHouse[planet.house]) {
      planetsByHouse[planet.house] = [];
    }
    planetsByHouse[planet.house].push(planet);
  });

  // Helper to get degree within sign (0-30)
  const getDegreeInSign = (longitude: number): number => {
    return longitude % 30;
  };

  // Draw the Kundli chart on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, 400, 400);

    // Set dark mode colors
    const isDark = document.documentElement.classList.contains('dark');
    const strokeColor = isDark ? '#d4af37' : '#1a1a1a';
    const textColor = isDark ? '#e5e5e5' : '#1a1a1a';
    const accentColor = '#d4af37';

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;

    // Outer diamond
    ctx.beginPath();
    ctx.moveTo(200, 20);
    ctx.lineTo(380, 200);
    ctx.lineTo(200, 380);
    ctx.lineTo(20, 200);
    ctx.closePath();
    ctx.stroke();

    // Vertical & horizontal lines
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(200, 20);
    ctx.lineTo(200, 380);
    ctx.moveTo(20, 200);
    ctx.lineTo(380, 200);
    ctx.stroke();

    // Diagonal lines
    ctx.beginPath();
    ctx.moveTo(200, 20);
    ctx.lineTo(380, 200);
    ctx.lineTo(200, 380);
    ctx.lineTo(20, 200);
    ctx.closePath();
    ctx.stroke();

    // Draw house numbers
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('1', 200, 50);
    ctx.fillText('2', 300, 110);
    ctx.fillText('3', 350, 200);
    ctx.fillText('4', 300, 290);
    ctx.fillText('5', 200, 350);
    ctx.fillText('6', 100, 290);
    ctx.fillText('7', 50, 200);
    ctx.fillText('8', 100, 110);
    ctx.fillText('9', 200, 320);
    ctx.fillText('10', 120, 260);
    ctx.fillText('11', 120, 150);
    ctx.fillText('12', 200, 90);

    // Draw ascendant marker
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('Lagna', 250, 45);

    // Draw zodiac signs
    ctx.fillStyle = textColor;
    ctx.font = '11px sans-serif';
    ctx.fillText(SIGN_ABBREVIATIONS[housesData[0]?.sign] || '', 200, 70);
    ctx.fillText(SIGN_ABBREVIATIONS[housesData[1]?.sign] || '', 280, 130);
    ctx.fillText(SIGN_ABBREVIATIONS[housesData[2]?.sign] || '', 330, 220);
    ctx.fillText(SIGN_ABBREVIATIONS[housesData[3]?.sign] || '', 280, 310);
    ctx.fillText(SIGN_ABBREVIATIONS[housesData[4]?.sign] || '', 200, 370);
    ctx.fillText(SIGN_ABBREVIATIONS[housesData[5]?.sign] || '', 120, 310);
    ctx.fillText(SIGN_ABBREVIATIONS[housesData[6]?.sign] || '', 70, 220);
    ctx.fillText(SIGN_ABBREVIATIONS[housesData[7]?.sign] || '', 120, 130);
    ctx.fillText(SIGN_ABBREVIATIONS[housesData[8]?.sign] || '', 200, 295);
    ctx.fillText(SIGN_ABBREVIATIONS[housesData[9]?.sign] || '', 140, 240);
    ctx.fillText(SIGN_ABBREVIATIONS[housesData[10]?.sign] || '', 140, 170);
    ctx.fillText(SIGN_ABBREVIATIONS[housesData[11]?.sign] || '', 200, 110);

    // Draw planets in houses
    const housePositions = [
      { x: 200, y: 65 },   // House 1
      { x: 290, y: 145 },  // House 2
      { x: 340, y: 200 },  // House 3
      { x: 290, y: 275 },  // House 4
      { x: 200, y: 340 },  // House 5
      { x: 110, y: 275 },  // House 6
      { x: 60, y: 200 },   // House 7
      { x: 110, y: 145 },  // House 8
      { x: 200, y: 285 },  // House 9
      { x: 130, y: 245 },  // House 10
      { x: 130, y: 165 },  // House 11
      { x: 200, y: 100 }   // House 12
    ];

    ctx.font = 'bold 9px monospace';
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].forEach((houseNum) => {
      const housePlanets = planetsByHouse[houseNum] || [];
      const pos = housePositions[houseNum - 1];

      housePlanets.forEach((planet, idx) => {
        const degreeInSign = getDegreeInSign(planet.longitude);
        const text = `${PLANET_ABBREVIATIONS[planet.name]} ${degreeInSign.toFixed(0)}°`;
        ctx.fillText(text, pos.x, pos.y + (idx * 12));
      });
    });

    // Draw ascendant in center
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('Asc', 200, 195);

    ctx.fillStyle = textColor;
    ctx.font = 'bold 12px sans-serif';
    const ascText = `${SIGN_ABBREVIATIONS[ascendant.sign]} ${getDegreeInSign(ascendant.longitude).toFixed(1)}°`;
    ctx.fillText(ascText, 200, 210);

  }, [planets, houses, ascendant, housesData, planetsByHouse]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>North Indian Kundli Chart</CardTitle>
          <CardDescription>
            Diamond-shaped birth chart showing planetary positions in 12 houses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Canvas Kundli Chart */}
          <div className="w-full max-w-[600px] mx-auto flex justify-center">
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              className="border-2 border-primary/20 rounded-lg"
            />
          </div>

          {/* Legend */}
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <div className="text-sm font-semibold text-primary mb-2">Planet Abbreviations:</div>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-1 text-xs">
              {Object.entries(PLANET_ABBREVIATIONS).map(([full, abbr]) => (
                <div key={full} className="text-gray-900 dark:text-gray-100">
                  <span className="font-semibold">{abbr}</span> = {full}
                </div>
              ))}
            </div>
          </div>

          {/* House Selection Buttons */}
          <div className="mt-6">
            <div className="text-sm font-semibold text-primary mb-2">Click a house to see details:</div>
            <div className="grid grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                <button
                  key={num}
                  onClick={() => setSelectedHouse(num)}
                  className={`px-3 py-2 rounded border transition-colors ${
                    selectedHouse === num
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-primary/30 hover:bg-primary/10'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected House Details */}
      {selectedHouse && (
        <Card className="mt-4 border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>House {selectedHouse}</span>
              <Badge variant="outline">{housesData[selectedHouse - 1]?.sign}</Badge>
            </CardTitle>
            <CardDescription>
              Lord: {housesData[selectedHouse - 1]?.sign_lord}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {planetsByHouse[selectedHouse]?.length > 0 ? (
              <div className="space-y-3">
                {planetsByHouse[selectedHouse].map((planet) => (
                  <div
                    key={planet.name}
                    className="p-3 bg-gradient-to-r from-primary/5 to-transparent rounded-lg border border-primary/20"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                          {planet.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {planet.sign} • {planet.nakshatra}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono text-primary">
                          {planet.longitude.toFixed(2)}°
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {getDegreeInSign(planet.longitude).toFixed(2)}° in sign
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-center text-muted-foreground py-4">
                No planets in this house
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
