import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getPlanetInSignMeaning, getPlanetInHouseMeaning } from '@/astrology/lib/kundli-interpretations';
import { calculateHousesData, calculatePlanetHouse } from '@/astrology/lib/house-calculator';

interface Planet {
  name: string;
  sign: string;
  longitude: number;
  house: number;
  nakshatra: string;
  is_retrograde: boolean;
}

interface KundliChartProps {
  planets: Record<string, Planet>;
  houses: number[] | Record<string, any>; // Array of cusp longitudes
  ascendant: {
    sign: string;
    longitude: number;
    sign_lord?: string;
  };
}

const PLANET_SYMBOLS: Record<string, string> = {
  Sun: '☉',
  Moon: '☽',
  Mars: '♂',
  Mercury: '☿',
  Jupiter: '♃',
  Venus: '♀',
  Saturn: '♄',
  Rahu: '☊',
  Ketu: '☋',
};

const HOUSE_MEANINGS: Record<number, { name: string; description: string }> = {
  1: { name: 'Self & Personality', description: 'Your identity, appearance, health, and how you approach life' },
  2: { name: 'Wealth & Family', description: 'Financial resources, family values, speech, and accumulated assets' },
  3: { name: 'Siblings & Skills', description: 'Communication, courage, siblings, short journeys, and skills' },
  4: { name: 'Home & Mother', description: 'Home environment, mother, property, emotional foundations' },
  5: { name: 'Children & Romance', description: 'Creativity, children, romance, intelligence, and past-life karma' },
  6: { name: 'Health & Enemies', description: 'Health challenges, daily work, service, debts, and obstacles' },
  7: { name: 'Spouse & Partnership', description: 'Marriage, business partnerships, and one-on-one relationships' },
  8: { name: 'Longevity & Transformation', description: 'Transformation, inheritance, occult knowledge, sudden events' },
  9: { name: 'Fortune & Father', description: 'Higher learning, philosophy, long journeys, father, and luck' },
  10: { name: 'Career & Status', description: 'Career, public reputation, social standing, and achievements' },
  11: { name: 'Gains & Friends', description: 'Income, social networks, aspirations, and elder siblings' },
  12: { name: 'Loss & Liberation', description: 'Expenses, foreign lands, spirituality, isolation, and moksha' },
};

export default function KundliChart({ planets, houses, ascendant }: KundliChartProps) {
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);

  // Convert houses array to proper house data
  const houseCusps = Array.isArray(houses) ? houses : Object.values(houses);
  const housesData = calculateHousesData(houseCusps, ascendant.sign);

  // Recalculate planet houses based on actual cusps
  const planetsWithCorrectHouses = Object.entries(planets).reduce((acc, [name, planetData]) => {
    const correctHouse = calculatePlanetHouse(planetData.longitude, houseCusps);
    acc[name] = {
      ...planetData,
      name,
      house: correctHouse
    };
    return acc;
  }, {} as Record<string, Planet & { name: string }>);

  // Get planets in a specific house
  const getPlanetsInHouse = (houseNumber: number): Array<Planet & { name: string }> => {
    return Object.values(planetsWithCorrectHouses).filter(
      planet => planet.house === houseNumber
    );
  };

  // Get house data by number
  const getHouseData = (houseNumber: number) => {
    return housesData[houseNumber - 1] || { sign: 'N/A', longitude: 0, sign_lord: 'N/A' };
  };

  // Render house interpretation
  const renderHouseInterpretation = (houseNum: number) => {
    const housePlanets = getPlanetsInHouse(houseNum);
    const houseInfo = HOUSE_MEANINGS[houseNum];
    const houseData = getHouseData(houseNum);

    return (
      <Card className="mt-4 border-2 border-primary/50 bg-gradient-to-br from-primary/5 to-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Badge variant="default" className="text-lg px-3 py-1">{houseNum}</Badge>
            <span>{houseInfo.name}</span>
          </CardTitle>
          <CardDescription className="text-base">{houseInfo.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* House Sign Info */}
          <div className="bg-muted/50 p-4 rounded-lg border">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div>
                <span className="font-semibold text-muted-foreground">Sign:</span>
                <div className="text-lg font-bold">{houseData.sign}</div>
              </div>
              <div>
                <span className="font-semibold text-muted-foreground">Cusp:</span>
                <div className="text-lg font-bold">{houseData.longitude?.toFixed(2) || '0'}°</div>
              </div>
              <div>
                <span className="font-semibold text-muted-foreground">Lord:</span>
                <div className="text-lg font-bold">{houseData.sign_lord}</div>
              </div>
            </div>
          </div>

          {/* Planets in this house */}
          {housePlanets.length > 0 ? (
            <div className="space-y-3">
              <h4 className="font-semibold text-base flex items-center gap-2">
                <span className="text-primary">🌟</span>
                Planets in This House:
              </h4>
              {housePlanets.map((planet) => {
                const signMeaning = getPlanetInSignMeaning(planet.name, planet.sign);
                const houseMeaning = getPlanetInHouseMeaning(planet.name, houseNum);

                return (
                  <Card key={planet.name} className="bg-gradient-to-br from-background to-muted/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{PLANET_SYMBOLS[planet.name] || '●'}</span>
                        <div className="flex-1">
                          <div className="font-bold text-lg">{planet.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {planet.sign} {planet.longitude?.toFixed(1) || '0'}°
                            {planet.is_retrograde && ' (Retrograde ℞)'}
                          </div>
                        </div>
                      </div>

                      {/* Combined Meaning */}
                      <div className="space-y-2">
                        <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1 uppercase">
                            🔵 Nature ({planet.name} in {planet.sign}):
                          </div>
                          <p className="text-sm text-foreground dark:text-gray-100 leading-relaxed">{signMeaning}</p>
                        </div>

                        <div className="bg-purple-50 dark:bg-purple-950/30 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
                          <div className="text-xs font-bold text-purple-600 dark:text-purple-400 mb-1 uppercase">
                            🟣 Impact (In House {houseNum} - {houseInfo.name}):
                          </div>
                          <p className="text-sm text-foreground dark:text-gray-100 leading-relaxed">{houseMeaning}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground italic bg-muted/30 p-4 rounded-lg border">
              No planets in this house. The house is still active through its lord: <span className="font-semibold">{houseData.sign_lord}</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            Your Kundli (Birth Chart)
          </CardTitle>
          <CardDescription className="text-base">
            Click on any house to see detailed interpretations of planets in that life area.
            Your Ascendant (Lagna) is <span className="font-bold text-primary">{ascendant?.sign || 'N/A'}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Table-Based Chart */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary/10 border-b-2 border-primary">
                  <th className="p-3 text-left font-bold">House</th>
                  <th className="p-3 text-left font-bold">Life Area</th>
                  <th className="p-3 text-left font-bold">Sign</th>
                  <th className="p-3 text-left font-bold">Lord</th>
                  <th className="p-3 text-left font-bold">Planets</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((houseNum) => {
                  const houseData = getHouseData(houseNum);
                  const housePlanets = getPlanetsInHouse(houseNum);
                  const houseInfo = HOUSE_MEANINGS[houseNum];
                  const isSelected = selectedHouse === houseNum;
                  const isAscendant = houseNum === 1;

                  return (
                    <tr
                      key={houseNum}
                      onClick={() => setSelectedHouse(houseNum)}
                      className={`
                        border-b cursor-pointer transition-all
                        ${isSelected ? 'bg-primary/20 border-l-4 border-l-primary' : 'hover:bg-muted/50'}
                        ${isAscendant ? 'bg-orange-50 dark:bg-orange-950/20 border-l-4 border-l-orange-500' : ''}
                      `}
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Badge variant={isAscendant ? "default" : "outline"} className="font-bold">
                            {houseNum}
                          </Badge>
                          {isAscendant && (
                            <Badge variant="secondary" className="text-xs">
                              Ascendant
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-sm text-foreground dark:text-gray-100">{houseInfo.name}</div>
                        <div className="text-xs text-muted-foreground">{houseInfo.description.slice(0, 50)}...</div>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-lg text-foreground dark:text-gray-100">{houseData.sign}</div>
                        <div className="text-xs text-muted-foreground">{houseData.longitude?.toFixed(1) || '0'}°</div>
                      </td>
                      <td className="p-3 font-semibold text-foreground dark:text-gray-100">{houseData.sign_lord}</td>
                      <td className="p-3">
                        {housePlanets.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {housePlanets.map((planet) => (
                              <Badge
                                key={planet.name}
                                variant="secondary"
                                className="text-base"
                                title={`${planet.name} in ${planet.sign}`}
                              >
                                {PLANET_SYMBOLS[planet.name] || planet.name.charAt(0)}
                                {planet.is_retrograde && '℞'}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">Empty</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="mt-4 p-3 bg-muted/30 rounded-lg">
            <div className="text-xs font-semibold mb-2">Planet Symbols:</div>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2 text-xs">
              {Object.entries(PLANET_SYMBOLS).map(([name, symbol]) => (
                <div key={name} className="flex items-center gap-1">
                  <span className="text-base font-bold">{symbol}</span>
                  <span>= {name}</span>
                </div>
              ))}
              <div className="flex items-center gap-1">
                <span className="text-base font-bold">℞</span>
                <span>= Retrograde</span>
              </div>
            </div>
          </div>

          <div className="mt-2 text-xs text-muted-foreground text-center">
            💡 Click any house row to see detailed planet interpretations below
          </div>
        </CardContent>
      </Card>

      {/* Selected House Interpretation */}
      {selectedHouse && renderHouseInterpretation(selectedHouse)}
    </div>
  );
}
