import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Navbar from '@/astrology/components/layout/Navbar';
import CosmicBackground from '@/components/CosmicBackground';
import BirthDataForm, { type BirthDataFormValue } from '@/astrology/components/birthchart/BirthDataForm';
import { useProfileBirthData } from '@/hooks/useProfileBirthData';
import { useDivisionalCharts } from '@/astrology/hooks/useAstrologyAPI';
import { formatBirthDataForAPI } from '@/astrology/lib/api/astrology-api';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Heart,
  Briefcase,
  Baby,
  Users,
  UserCheck,
  UserX,
  Sparkles,
  ChevronRight,
  Loader2,
  Info
} from 'lucide-react';

interface LifeArea {
  id: string;
  name: string;
  chart: string; // D-chart type (D1, D7, D9, etc.)
  icon: any;
  color: string;
  description: string;
  keyInsights: string[];
}

const LIFE_AREAS: LifeArea[] = [
  {
    id: 'marriage',
    name: 'Marriage & Partnership',
    chart: 'D9',
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
    description: 'Navamsa (D9) - The chart of marital harmony, spouse nature, and partnership dynamics',
    keyInsights: [
      'Spouse characteristics and personality',
      'Marital happiness and compatibility',
      'Timing and nature of marriage',
      'Relationship challenges and strengths'
    ]
  },
  {
    id: 'career',
    name: 'Career & Profession',
    chart: 'D10',
    icon: Briefcase,
    color: 'from-blue-500 to-cyan-500',
    description: 'Dashamsa (D10) - The chart of professional success, career path, and achievements',
    keyInsights: [
      'Career direction and suitable professions',
      'Professional success and recognition',
      'Authority and leadership potential',
      'Career challenges and opportunities'
    ]
  },
  {
    id: 'children',
    name: 'Children & Progeny',
    chart: 'D7',
    icon: Baby,
    color: 'from-green-500 to-emerald-500',
    description: 'Saptamsa (D7) - The chart of children, fertility, and parent-child relationships',
    keyInsights: [
      'Number and nature of children',
      'Fertility and conception timing',
      'Parent-child relationship quality',
      'Children\'s health and wellbeing'
    ]
  },
  {
    id: 'family',
    name: 'Family & Relatives',
    chart: 'D12',
    icon: Users,
    color: 'from-purple-500 to-violet-500',
    description: 'Dwadasamsa (D12) - The chart of parents, siblings, and extended family',
    keyInsights: [
      'Parental relationships and influence',
      'Sibling dynamics and support',
      'Family inheritance and property',
      'Ancestral blessings and karma'
    ]
  },
  {
    id: 'friends',
    name: 'Friends & Allies',
    chart: 'D11',
    icon: UserCheck,
    color: 'from-amber-500 to-orange-500',
    description: 'Ekadasamsa (D11) - The chart of friendships, social circle, and gains from others',
    keyInsights: [
      'Quality of friendships and social support',
      'Gains through networking and connections',
      'Elder siblings and mentors',
      'Fulfillment of desires and aspirations'
    ]
  },
  {
    id: 'enemies',
    name: 'Enemies & Obstacles',
    chart: 'D6',
    icon: UserX,
    color: 'from-red-500 to-rose-600',
    description: 'Shashtamsa (D6) - The chart of enemies, diseases, debts, and legal matters',
    keyInsights: [
      'Hidden enemies and opposition',
      'Health challenges and diseases',
      'Litigation and legal matters',
      'Service, debts, and obstacles'
    ]
  }
];

const DivisionalCharts = () => {
  const [birthData, setBirthData] = useState<BirthDataFormValue | null>(null);
  const [selectedArea, setSelectedArea] = useState<LifeArea | null>(null);
  const [showForm, setShowForm] = useState(true);

  // Auto-load from user profile
  const { birthDataFormValue: profileData, isAstrologyReady } = useProfileBirthData();
  const autoSubmittedRef = useRef(false);

  const {
    data: divisionalData,
    isLoading,
    error,
    refetch
  } = useDivisionalCharts(birthData ? formatBirthDataForAPI(birthData) : null);

  const handleCalculate = (data: BirthDataFormValue) => {
    setBirthData(data);
    setShowForm(false);
    refetch();
  };

  // Auto-submit profile data when available
  useEffect(() => {
    if (isAstrologyReady && profileData && !birthData && !autoSubmittedRef.current) {
      autoSubmittedRef.current = true;
      handleCalculate(profileData);
    }
  }, [isAstrologyReady, profileData, birthData]);

  const getChartData = (chartType: string) => {
    if (!divisionalData) return null;
    return (divisionalData as any).charts?.find((c: any) => c.division === chartType) || null;
  };

  const renderChartSVG = (chartData: any) => {
    if (!chartData || !chartData.houses) return null;

    return (
      <div className="relative aspect-square max-w-md mx-auto">
        <svg viewBox="0 0 300 300" className="w-full h-full">
          {/* Outer border */}
          <rect x="10" y="10" width="280" height="280" fill="none" stroke="hsl(var(--border))" strokeWidth="2" />

          {/* Grid lines - South Indian style */}
          <line x1="103" y1="10" x2="103" y2="290" stroke="hsl(var(--border))" strokeWidth="1" />
          <line x1="197" y1="10" x2="197" y2="290" stroke="hsl(var(--border))" strokeWidth="1" />
          <line x1="10" y1="103" x2="290" y2="103" stroke="hsl(var(--border))" strokeWidth="1" />
          <line x1="10" y1="197" x2="290" y2="197" stroke="hsl(var(--border))" strokeWidth="1" />

          {/* Diagonal lines for corners */}
          <line x1="10" y1="10" x2="103" y2="103" stroke="hsl(var(--border))" strokeWidth="1" />
          <line x1="197" y1="10" x2="290" y2="103" stroke="hsl(var(--border))" strokeWidth="1" />
          <line x1="10" y1="197" x2="103" y2="290" stroke="hsl(var(--border))" strokeWidth="1" />
          <line x1="197" y1="197" x2="290" y2="290" stroke="hsl(var(--border))" strokeWidth="1" />
          <line x1="103" y1="10" x2="10" y2="103" stroke="hsl(var(--border))" strokeWidth="1" />
          <line x1="290" y1="10" x2="197" y2="103" stroke="hsl(var(--border))" strokeWidth="1" />
          <line x1="10" y1="290" x2="103" y2="197" stroke="hsl(var(--border))" strokeWidth="1" />
          <line x1="290" y1="290" x2="197" y2="197" stroke="hsl(var(--border))" strokeWidth="1" />

          {/* House labels */}
          {[
            { x: 56, y: 56, label: '12' },
            { x: 150, y: 56, label: '1' },
            { x: 243, y: 56, label: '2' },
            { x: 56, y: 150, label: '11' },
            { x: 243, y: 150, label: '3' },
            { x: 56, y: 243, label: '10' },
            { x: 150, y: 243, label: '9' },
            { x: 243, y: 243, label: '4' },
          ].map((item, i) => (
            <text
              key={i}
              x={item.x}
              y={item.y - 30}
              textAnchor="middle"
              fill="hsl(var(--muted-foreground))"
              fontSize="10"
              fontWeight="bold"
            >
              {item.label}
            </text>
          ))}

          {/* Planet placements */}
          {chartData.planets && Object.entries(chartData.planets).map(([planet, data]: [string, any], i) => {
            const house = data.house || 1;
            const positions: { [key: number]: { x: number, y: number } } = {
              1: { x: 150, y: 75 },
              2: { x: 243, y: 75 },
              3: { x: 255, y: 150 },
              4: { x: 243, y: 225 },
              5: { x: 190, y: 243 },
              6: { x: 150, y: 255 },
              7: { x: 110, y: 243 },
              8: { x: 56, y: 225 },
              9: { x: 45, y: 150 },
              10: { x: 56, y: 75 },
              11: { x: 75, y: 150 },
              12: { x: 75, y: 75 }
            };

            const pos = positions[house] || positions[1];
            const planetSymbols: { [key: string]: string } = {
              'Sun': '☉',
              'Moon': '☽',
              'Mars': '♂',
              'Mercury': '☿',
              'Jupiter': '♃',
              'Venus': '♀',
              'Saturn': '♄',
              'Rahu': '☊',
              'Ketu': '☋'
            };

            return (
              <g key={planet}>
                <text
                  x={pos.x}
                  y={pos.y + (i % 3) * 14}
                  textAnchor="middle"
                  fill="hsl(var(--primary))"
                  fontSize="16"
                  fontWeight="bold"
                >
                  {planetSymbols[planet] || planet.substring(0, 2)}
                </text>
                <text
                  x={pos.x}
                  y={pos.y + (i % 3) * 14 + 10}
                  textAnchor="middle"
                  fill="hsl(var(--muted-foreground))"
                  fontSize="8"
                >
                  {planet.substring(0, 2)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <CosmicBackground density={140} useVideo={true}>
      <Navbar />
      <main className="container mx-auto px-4 py-8 mt-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-bold mb-4 text-gradient-gold">
              Divisional Charts Explorer
            </h1>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              Explore specialized Vedic charts (Vargas) that reveal detailed insights into specific life areas
            </p>
          </div>

          {showForm && (
            <Card className="max-w-2xl mx-auto mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  Enter Birth Details
                </CardTitle>
                <CardDescription>
                  Provide your birth information to generate divisional charts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isAstrologyReady && profileData && (
                  <Alert className="mb-4">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Using your profile birth data. Edit below if needed.
                    </AlertDescription>
                  </Alert>
                )}
                <BirthDataForm
                  onCalculate={handleCalculate}
                  loading={isLoading}
                  initialData={isAstrologyReady && profileData ? profileData : undefined}
                />
              </CardContent>
            </Card>
          )}

          {!showForm && (
            <>
              <div className="text-center mb-8">
                <Button
                  variant="outline"
                  onClick={() => setShowForm(true)}
                  size="sm"
                >
                  Change Birth Details
                </Button>
              </div>

              {/* Life Areas Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {LIFE_AREAS.map((area) => {
                  const Icon = area.icon;
                  const isSelected = selectedArea?.id === area.id;

                  return (
                    <Card
                      key={area.id}
                      className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        isSelected ? 'ring-2 ring-primary shadow-xl' : ''
                      }`}
                      onClick={() => setSelectedArea(area)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${area.color} flex items-center justify-center mb-3`}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <Badge variant="secondary">{area.chart}</Badge>
                        </div>
                        <CardTitle className="text-xl">{area.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {area.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          variant={isSelected ? "default" : "ghost"}
                          className="w-full"
                          size="sm"
                        >
                          View Chart
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Selected Chart Display */}
              {selectedArea && (
                <Card className="border-t-4" style={{ borderTopColor: `hsl(var(--primary))` }}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${selectedArea.color} flex items-center justify-center`}>
                        {<selectedArea.icon className="w-10 h-10 text-white" />}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-3xl mb-2">{selectedArea.name}</CardTitle>
                        <CardDescription className="text-base">
                          {selectedArea.description}
                        </CardDescription>
                      </div>
                      <Badge className="text-lg px-4 py-2">{selectedArea.chart}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                        <span className="ml-3 text-white/60">Calculating divisional chart...</span>
                      </div>
                    ) : error ? (
                      <div className="card-cosmic p-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                          <span className="text-3xl">⚠️</span>
                        </div>
                        <h3 className="text-xl font-serif font-semibold text-white mb-2">Astrology Engine Offline</h3>
                        <p className="text-white/60 max-w-md mx-auto">
                          The advanced Vedic calculation engine is currently being set up.
                          Divisional chart analysis requires the backend service.
                          Birth Chart generation works offline.
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Chart Visualization */}
                        <div className="bg-muted/30 p-8 rounded-lg">
                          {renderChartSVG(getChartData(selectedArea.chart))}
                        </div>

                        {/* Key Insights */}
                        <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-lg border border-primary/20">
                          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            Key Insights from {selectedArea.chart}
                          </h3>
                          <ul className="space-y-3">
                            {selectedArea.keyInsights.map((insight, index) => (
                              <li key={index} className="flex items-start gap-3">
                                <span className="text-primary mt-1">✦</span>
                                <span className="text-muted-foreground">{insight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Planetary Positions */}
                        {getChartData(selectedArea.chart)?.planets && (
                          <div>
                            <h3 className="text-xl font-semibold mb-4">Planetary Positions</h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {Object.entries(getChartData(selectedArea.chart).planets).map(([planet, data]: [string, any]) => (
                                <div key={planet} className="bg-muted/30 p-4 rounded-lg">
                                  <div className="font-semibold text-primary">{planet}</div>
                                  <div className="text-sm text-muted-foreground">
                                    House {data.house} • {data.sign}
                                  </div>
                                  {data.degree && (
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {data.degree.toFixed(2)}°
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </main>
    </CosmicBackground>
  );
};

export default DivisionalCharts;
