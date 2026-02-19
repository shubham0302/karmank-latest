import { useState } from 'react';
import Navbar from '@/astrology/components/layout/Navbar';
import CosmicBackground from '@/components/CosmicBackground';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

// Planet data from the HTML example
const PLANETS = [
  { id: 'sun', name: 'Surya (Sun)', sanskrit: 'Atma Karaka', icon: '☀️', color: 'text-orange-600', desc: 'The Soul, King, Father, Vitality.', own: 'Leo', exalt: 'Aries', rel: 'Friends: Moon, Mars, Jupiter. Enemies: Saturn, Venus.' },
  { id: 'moon', name: 'Chandra (Moon)', sanskrit: 'Manas Karaka', icon: '☾', color: 'text-gray-600', desc: 'The Mind, Queen, Mother, Emotions.', own: 'Cancer', exalt: 'Taurus', rel: 'Friends: Sun, Mercury. Enemies: None.' },
  { id: 'mars', name: 'Kuja (Mars)', sanskrit: 'Bhatri Karaka', icon: '♂', color: 'text-red-600', desc: 'Energy, Commander, Siblings, Logic.', own: 'Aries, Scorpio', exalt: 'Capricorn', rel: 'Friends: Sun, Moon, Jupiter. Enemies: Mercury.' },
  { id: 'mercury', name: 'Budha (Mercury)', sanskrit: 'Matula Karaka', icon: '☿', color: 'text-green-600', desc: 'Intellect, Prince, Speech, Business.', own: 'Gemini, Virgo', exalt: 'Virgo', rel: 'Friends: Sun, Venus. Enemies: Moon.' },
  { id: 'jupiter', name: 'Guru (Jupiter)', sanskrit: 'Putra Karaka', icon: '♃', color: 'text-yellow-600', desc: 'Wisdom, Teacher, Wealth, Children.', own: 'Sagittarius, Pisces', exalt: 'Cancer', rel: 'Friends: Sun, Moon, Mars. Enemies: Mercury, Venus.' },
  { id: 'venus', name: 'Shukra (Venus)', sanskrit: 'Kalatra Karaka', icon: '♀', color: 'text-pink-600', desc: 'Love, Pleasure, Spouse, Vehicles.', own: 'Taurus, Libra', exalt: 'Pisces', rel: 'Friends: Mercury, Saturn. Enemies: Sun, Moon.' },
  { id: 'saturn', name: 'Shani (Saturn)', sanskrit: 'Ayush Karaka', icon: '♄', color: 'text-blue-900', desc: 'Sorrow, Servant, Longevity, Discipline.', own: 'Capricorn, Aquarius', exalt: 'Libra', rel: 'Friends: Mercury, Venus. Enemies: Sun, Moon, Mars.' },
  { id: 'rahu', name: 'Rahu', sanskrit: 'North Node', icon: '☊', color: 'text-purple-600', desc: 'Illusion, Foreign, Innovation, Outcast.', own: 'Aquarius (Co)', exalt: 'Taurus', rel: 'Friends: Venus, Saturn. Enemies: Sun, Moon.' },
  { id: 'ketu', name: 'Ketu', sanskrit: 'South Node', icon: '☋', color: 'text-gray-500', desc: 'Liberation, Detachment, Spirituality.', own: 'Scorpio (Co)', exalt: 'Scorpio', rel: 'Friends: Mars. Enemies: Sun, Moon.' }
];

// Yoga data from the HTML example
const YOGAS = [
  {
    id: 1,
    name: "Gaja Kesari Yoga",
    category: "Raja",
    sanskrit: "Elephant-Lion Combination",
    rule: "Jupiter in a Kendra (1, 4, 7, 10) from the Moon.",
    result: "Illustrious, wealthy, intelligent, virtuous. Overpowers enemies like a lion overpowers elephants.",
    planets: ['☾', '♃']
  },
  {
    id: 2,
    name: "Pancha Mahapurusha (Hamsa)",
    category: "Special",
    sanskrit: "The Swan (Jupiter)",
    rule: "Jupiter in Own or Exaltation sign AND in a Kendra from Lagna.",
    result: "Religious, sweet voice, pure heart, respected by kings. Marks of lotus/conch on hands/feet.",
    planets: ['♃']
  },
  {
    id: 3,
    name: "Dhana Yoga (Primary)",
    category: "Dhana",
    sanskrit: "Combination for Wealth",
    rule: "Relationship between Lords of Wealth (2, 11) and Lords of Trines (1, 5, 9).",
    result: "Great accumulation of wealth, financial stability, and prosperity.",
    planets: []
  },
  {
    id: 4,
    name: "Vipareeta Raja Yoga",
    category: "Raja",
    sanskrit: "Reversal of Fortune",
    rule: "Lords of Dusthanas (6, 8, 12) placed in other Dusthanas (6, 8, 12).",
    result: "Sudden rise in status, usually after a struggle or at the expense of someone else.",
    planets: []
  },
  {
    id: 5,
    name: "Neecha Bhanga Raja Yoga",
    category: "Raja",
    sanskrit: "Cancellation of Debilitation",
    rule: "A debilitated planet's dispositor is in Kendra from Lagna or Moon.",
    result: "Initial difficulties followed by great success and kingship.",
    planets: []
  },
  {
    id: 6,
    name: "Kemadruma Yoga",
    category: "Special",
    sanskrit: "Isolation Yoga",
    rule: "No planets (except Sun) on either side of the Moon.",
    result: "Mental anguish, poverty, feeling of loneliness. (Note: Can be cancelled).",
    planets: ['☾']
  },
  {
    id: 7,
    name: "Sakata Yoga",
    category: "Special",
    sanskrit: "Wheel Yoga",
    rule: "Moon in 6th, 8th, or 12th from Jupiter.",
    result: "Fortune fluctuates like a wheel. Periods of poverty and misery mixed with happiness.",
    planets: ['☾', '♃']
  },
  {
    id: 8,
    name: "Mala Yoga",
    category: "Nabhasa",
    sanskrit: "Garland Combination",
    rule: "All benefic planets in Kendras (1, 4, 7, 10).",
    result: "The person is always happy, enjoys vehicles and luxuries.",
    planets: []
  }
];

// Shadbala chart data
const SHADBALA_DATA_STRONG = [
  { planet: 'Sun', strength: 120 },
  { planet: 'Moon', strength: 100 },
  { planet: 'Mars', strength: 110 },
  { planet: 'Mercury', strength: 130 },
  { planet: 'Jupiter', strength: 140 },
  { planet: 'Venus', strength: 115 },
  { planet: 'Saturn', strength: 95 },
];

const SHADBALA_DATA_WEAK = [
  { planet: 'Sun', strength: 60 },
  { planet: 'Moon', strength: 50 },
  { planet: 'Mars', strength: 140 },
  { planet: 'Mercury', strength: 70 },
  { planet: 'Jupiter', strength: 40 },
  { planet: 'Venus', strength: 80 },
  { planet: 'Saturn', strength: 150 },
];

// Dasha data
const DASHA_DATA = [
  { planet: 'Sun', years: 6, color: '#fbbf24' },
  { planet: 'Moon', years: 10, color: '#e5e7eb' },
  { planet: 'Mars', years: 7, color: '#ef4444' },
  { planet: 'Rahu', years: 18, color: '#4b5563' },
  { planet: 'Jupiter', years: 16, color: '#f59e0b' },
  { planet: 'Saturn', years: 19, color: '#1e3a8a' },
  { planet: 'Mercury', years: 17, color: '#10b981' },
  { planet: 'Ketu', years: 7, color: '#6b7280' },
  { planet: 'Venus', years: 20, color: '#ec4899' },
];

const YogaLab = () => {
  const [selectedPlanet, setSelectedPlanet] = useState(PLANETS[0]);
  const [selectedYoga, setSelectedYoga] = useState(YOGAS[0]);
  const [yogaFilter, setYogaFilter] = useState<string>('all');
  const [shadbalaType, setShadbalaType] = useState<'strong' | 'weak'>('strong');

  const filteredYogas = yogaFilter === 'all'
    ? YOGAS
    : YOGAS.filter(y => y.category.toLowerCase() === yogaFilter.toLowerCase());

  const shadbalaData = shadbalaType === 'strong' ? SHADBALA_DATA_STRONG : SHADBALA_DATA_WEAK;

  return (
    <CosmicBackground density={140} useVideo={true}>
      <Navbar />

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">ॐ</span>
            <h1 className="text-4xl font-bold tracking-tight text-white">Vedic Astrology: <span className="text-gradient-gold">The Yoga Laboratory</span></h1>
          </div>
          <p className="text-white/60 max-w-3xl">
            Interactive workbench to explore planetary combinations (Yogas), visualize planetary strength (Shadbala),
            and understand the timing of events (Vimshottari Dasha). Based on classical Vedic astrology texts.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="fundamentals" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="fundamentals">Basics</TabsTrigger>
            <TabsTrigger value="yogas">Yogas</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          {/* FUNDAMENTALS TAB */}
          <TabsContent value="fundamentals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>The Building Blocks: Grahas & Rasis</CardTitle>
                <CardDescription>
                  Before analyzing complex yogas, master the basic characteristics of the 9 Planets (Grahas).
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Planet Grid */}
              <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                {PLANETS.map((planet) => (
                  <Card
                    key={planet.id}
                    className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all"
                    onClick={() => setSelectedPlanet(planet)}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className={`text-3xl ${planet.color}`}>{planet.icon}</div>
                      <div>
                        <div className="font-bold text-sm">{planet.name}</div>
                        <div className="text-xs text-muted-foreground">{planet.sanskrit}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Planet Detail */}
              <Card className="lg:sticky lg:top-24 h-fit">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`text-5xl ${selectedPlanet.color}`}>{selectedPlanet.icon}</div>
                    <div>
                      <CardTitle>{selectedPlanet.name}</CardTitle>
                      <Badge variant="outline">{selectedPlanet.sanskrit}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted p-3 rounded-lg">
                    <span className="text-xs font-bold text-primary uppercase block mb-1">Significations</span>
                    <p className="text-sm">{selectedPlanet.desc}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border">
                      <span className="text-xs text-muted-foreground uppercase block">Own Sign</span>
                      <span className="font-semibold text-sm">{selectedPlanet.own}</span>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg border">
                      <span className="text-xs text-muted-foreground uppercase block">Exalted In</span>
                      <span className="font-semibold text-sm">{selectedPlanet.exalt}</span>
                    </div>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-950 p-3 rounded-lg border">
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase block mb-1">Key Relationships</span>
                    <p className="text-xs">{selectedPlanet.rel}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* YOGAS TAB */}
          <TabsContent value="yogas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>The Yoga Laboratory</CardTitle>
                <CardDescription>
                  Yogas are specific planetary combinations that alter chart results. Explore Raja Yogas (Power), Dhana Yogas (Wealth), and special combinations.
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Filter & List */}
              <div className="lg:col-span-4 space-y-4">
                <Select value={yogaFilter} onValueChange={setYogaFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Yogas</SelectItem>
                    <SelectItem value="raja">Raja Yoga (Power/Status)</SelectItem>
                    <SelectItem value="dhana">Dhana Yoga (Wealth)</SelectItem>
                    <SelectItem value="nabhasa">Nabhasa Yoga (Pattern)</SelectItem>
                    <SelectItem value="special">Special / Misc</SelectItem>
                  </SelectContent>
                </Select>

                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {filteredYogas.map((yoga) => (
                    <Card
                      key={yoga.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setSelectedYoga(yoga)}
                    >
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-sm">{yoga.name}</span>
                          <Badge variant="secondary" className="text-xs">{yoga.category}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground truncate">{yoga.sanskrit}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Yoga Detail */}
              <div className="lg:col-span-8 space-y-6">
                <Card className="border-t-4 border-t-primary">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-3xl">{selectedYoga.name}</CardTitle>
                        <CardDescription className="text-base">{selectedYoga.sanskrit}</CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        {selectedYoga.category} Yoga
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Formation Rules</h4>
                      <p className="text-sm font-medium bg-muted p-3 rounded border">{selectedYoga.rule}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Results (Phala)</h4>
                      <p className="text-sm leading-relaxed">{selectedYoga.result}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Logic Visualizer */}
                <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
                  <CardHeader>
                    <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">Configuration Pattern</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center min-h-[200px]">
                    <div className="flex items-center gap-4">
                      {selectedYoga.planets.map((planet, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="bg-white dark:bg-gray-800 border-2 border-primary rounded-lg p-4 min-w-[80px] text-center shadow-lg">
                            <span className="text-3xl">{planet}</span>
                          </div>
                          {index < selectedYoga.planets.length - 1 && (
                            <div className="flex flex-col items-center">
                              <span className="text-xs text-primary font-mono">Kendra</span>
                              <div className="h-1 w-16 bg-primary rounded"></div>
                            </div>
                          )}
                        </div>
                      ))}
                      {selectedYoga.planets.length === 0 && (
                        <p className="text-muted-foreground italic">Complex multi-planet combination</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ANALYSIS TAB */}
          <TabsContent value="analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analysis: Strength, Time & Space</CardTitle>
                <CardDescription>
                  Visualize planetary strength (Shadbala) and timing of events (Vimshottari Dasha). Understanding when yogas activate is crucial.
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Shadbala Chart */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Shadbala Profile (Strength)</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={shadbalaType === 'strong' ? 'default' : 'outline'}
                        onClick={() => setShadbalaType('strong')}
                      >
                        Strong Chart
                      </Button>
                      <Button
                        size="sm"
                        variant={shadbalaType === 'weak' ? 'default' : 'outline'}
                        onClick={() => setShadbalaType('weak')}
                      >
                        Weak Chart
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    Values &gt; 100 Rupas indicate capability to deliver results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <RadarChart data={shadbalaData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="planet" />
                      <PolarRadiusAxis angle={90} domain={[0, 160]} />
                      <Radar
                        name="Strength"
                        dataKey="strength"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.3}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Dasha Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Vimsottari Dasha Timeline</CardTitle>
                  <CardDescription>
                    The 120-year cycle of planetary periods. Events happen when the Dasa Lord is active.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={DASHA_DATA} layout="vertical">
                      <XAxis type="number" />
                      <YAxis dataKey="planet" type="category" width={80} />
                      <Tooltip
                        formatter={(value) => `${value} years`}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))'
                        }}
                      />
                      <Bar dataKey="years" radius={[0, 4, 4, 0]}>
                        {DASHA_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* South Indian Chart */}
              <Card className="xl:col-span-2 bg-gradient-to-br from-primary/5 to-background">
                <CardHeader>
                  <CardTitle className="text-2xl">The South Indian Chart</CardTitle>
                  <CardDescription>
                    Signs are fixed to specific positions. Planets move through these boxes. This is the classical format used in most Vedic astrology texts.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                      <div className="bg-muted p-4 rounded-lg border-l-4 border-primary">
                        <h5 className="font-bold mb-2">How to Read</h5>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          The top-left box is always Pisces (♓), followed clockwise by Aries (♈), Taurus (♉), etc.
                          Houses (Bhavas) rotate based on the Ascendant (Lagna), but Signs remain fixed.
                          This system emphasizes sign-based interpretation.
                        </p>
                      </div>
                      <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg border">
                        <h5 className="font-bold text-orange-600 dark:text-orange-400 mb-2">Key Features</h5>
                        <ul className="text-sm space-y-1 list-disc list-inside">
                          <li>Fixed sign positions (never change)</li>
                          <li>Clockwise progression (Mesha to Meena)</li>
                          <li>Center shows Lagna reference</li>
                          <li>Easy to spot sign-based yogas</li>
                        </ul>
                      </div>
                    </div>

                    {/* CSS Grid Chart */}
                    <div className="grid grid-cols-4 grid-rows-4 gap-0.5 bg-border aspect-square max-w-md mx-auto w-full">
                      {/* Row 1 */}
                      <div className="bg-card p-2 text-center flex flex-col justify-between border hover:bg-muted transition-colors cursor-pointer">
                        <span className="text-xs font-medium">Pisces</span>
                        <span className="text-2xl">♓</span>
                      </div>
                      <div className="bg-card p-2 text-center flex flex-col justify-between border hover:bg-muted transition-colors cursor-pointer">
                        <span className="text-xs font-medium">Aries</span>
                        <span className="text-2xl">♈</span>
                      </div>
                      <div className="bg-card p-2 text-center flex flex-col justify-between border hover:bg-muted transition-colors cursor-pointer">
                        <span className="text-xs font-medium">Taurus</span>
                        <span className="text-2xl">♉</span>
                      </div>
                      <div className="bg-card p-2 text-center flex flex-col justify-between border hover:bg-muted transition-colors cursor-pointer">
                        <span className="text-xs font-medium">Gemini</span>
                        <span className="text-2xl">♊</span>
                      </div>

                      {/* Row 2 */}
                      <div className="bg-card p-2 text-center flex flex-col justify-between border hover:bg-muted transition-colors cursor-pointer">
                        <span className="text-xs font-medium">Aquarius</span>
                        <span className="text-2xl">♒</span>
                      </div>
                      <div className="col-span-2 row-span-2 bg-muted/50 flex items-center justify-center border">
                        <div className="text-center">
                          <div className="font-bold text-lg">Rasi Chakra</div>
                          <div className="text-xs text-muted-foreground">Clockwise</div>
                        </div>
                      </div>
                      <div className="bg-card p-2 text-center flex flex-col justify-between border hover:bg-muted transition-colors cursor-pointer">
                        <span className="text-xs font-medium">Cancer</span>
                        <span className="text-2xl">♋</span>
                      </div>

                      {/* Row 3 */}
                      <div className="bg-card p-2 text-center flex flex-col justify-between border hover:bg-muted transition-colors cursor-pointer">
                        <span className="text-xs font-medium">Capricorn</span>
                        <span className="text-2xl">♑</span>
                      </div>
                      <div className="bg-card p-2 text-center flex flex-col justify-between border hover:bg-muted transition-colors cursor-pointer">
                        <span className="text-xs font-medium">Leo</span>
                        <span className="text-2xl">♌</span>
                      </div>

                      {/* Row 4 */}
                      <div className="bg-card p-2 text-center flex flex-col justify-between border hover:bg-muted transition-colors cursor-pointer">
                        <span className="text-xs font-medium">Sagittarius</span>
                        <span className="text-2xl">♐</span>
                      </div>
                      <div className="bg-card p-2 text-center flex flex-col justify-between border hover:bg-muted transition-colors cursor-pointer">
                        <span className="text-xs font-medium">Scorpio</span>
                        <span className="text-2xl">♏</span>
                      </div>
                      <div className="bg-card p-2 text-center flex flex-col justify-between border hover:bg-muted transition-colors cursor-pointer">
                        <span className="text-xs font-medium">Libra</span>
                        <span className="text-2xl">♎</span>
                      </div>
                      <div className="bg-card p-2 text-center flex flex-col justify-between border hover:bg-muted transition-colors cursor-pointer">
                        <span className="text-xs font-medium">Virgo</span>
                        <span className="text-2xl">♍</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </CosmicBackground>
  );
};

export default YogaLab;
