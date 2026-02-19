import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Briefcase, Baby, Users, UserCheck, UserX, Sparkles, ChevronRight, DollarSign, Shield, Home, Award, Zap, Car, Church, GraduationCap, Target, Skull, Gem, User, Clock } from 'lucide-react';

interface LifeArea {
  id: string;
  name: string;
  chart: string;
  icon: any;
  color: string;
  description: string;
  keyInsights: string[];
}

const LIFE_AREAS: LifeArea[] = [
  {
    id: 'marriage',
    name: 'Marriage & Partnership',
    chart: 'D9_Navamsa',
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
    chart: 'D10_Dasamsa',
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
    chart: 'D7_Saptamsa',
    icon: Baby,
    color: 'from-green-500 to-emerald-500',
    description: 'Saptamsa (D7) - The chart of children, fertility, and parent-child relationships',
    keyInsights: [
      'Number and nature of children',
      'Fertility and conception timing',
      'Parent-child relationship quality',
      "Children's health and wellbeing"
    ]
  },
  {
    id: 'family',
    name: 'Family & Relatives',
    chart: 'D12_Dwadasamsa',
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
    name: 'Friends & Gains',
    chart: 'D11_Ekadasamsa',
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
    chart: 'D6_Shashtamsa',
    icon: UserX,
    color: 'from-red-500 to-rose-600',
    description: 'Shashtamsa (D6) - The chart of enemies, diseases, debts, and legal matters',
    keyInsights: [
      'Hidden enemies and opposition',
      'Health challenges and diseases',
      'Litigation and legal matters',
      'Service, debts, and obstacles'
    ]
  },
  {
    id: 'wealth',
    name: 'Wealth & Prosperity',
    chart: 'D2_Hora',
    icon: DollarSign,
    color: 'from-yellow-500 to-amber-500',
    description: 'Hora (D2) - The chart of wealth, financial prosperity, and monetary gains',
    keyInsights: [
      'Financial prosperity and wealth accumulation',
      'Income sources and money flow',
      'Material success and abundance',
      'Financial challenges and opportunities'
    ]
  },
  {
    id: 'siblings',
    name: 'Siblings & Courage',
    chart: 'D3_Drekkana',
    icon: Shield,
    color: 'from-indigo-500 to-blue-500',
    description: 'Drekkana (D3) - The chart of siblings, courage, initiatives, and short journeys',
    keyInsights: [
      'Sibling relationships and dynamics',
      'Courage and personal bravery',
      'Initiative-taking abilities',
      'Short travels and adventures'
    ]
  },
  {
    id: 'property',
    name: 'Property & Fortune',
    chart: 'D4_Chaturthamsa',
    icon: Home,
    color: 'from-teal-500 to-cyan-500',
    description: 'Chaturthamsa (D4) - The chart of fortune, property, land, and fixed assets',
    keyInsights: [
      'Real estate and land ownership',
      'Fixed assets and property',
      'Overall fortune and prosperity',
      'Inheritance and ancestral property'
    ]
  },
  {
    id: 'fame',
    name: 'Fame & Authority',
    chart: 'D5_Panchamsa',
    icon: Award,
    color: 'from-orange-500 to-red-500',
    description: 'Panchamsa (D5) - The chart of fame, authority, reputation, and mantras',
    keyInsights: [
      'Fame and public recognition',
      'Authority and power',
      'Reputation in society',
      'Power of mantras and remedies'
    ]
  },
  {
    id: 'longevity',
    name: 'Longevity & Events',
    chart: 'D8_Ashtamsa',
    icon: Zap,
    color: 'from-violet-500 to-purple-500',
    description: 'Ashtamsa (D8) - The chart of longevity, sudden events, accidents, and hidden matters',
    keyInsights: [
      'Longevity and life span indicators',
      'Sudden events and accidents',
      'Hidden wealth and occult matters',
      'Transformative life experiences'
    ]
  },
  {
    id: 'vehicles',
    name: 'Vehicles & Comforts',
    chart: 'D16_Shodasamsa',
    icon: Car,
    color: 'from-sky-500 to-blue-500',
    description: 'Shodasamsa (D16) - The chart of vehicles, conveyances, material comforts, and happiness',
    keyInsights: [
      'Vehicles and conveyances',
      'Material comforts and luxuries',
      'General happiness and contentment',
      'Ease and comfort in life'
    ]
  },
  {
    id: 'spirituality',
    name: 'Spirituality & Religion',
    chart: 'D20_Vimsamsa',
    icon: Church,
    color: 'from-purple-600 to-pink-500',
    description: 'Vimsamsa (D20) - The chart of spiritual pursuits, religious activities, and devotion',
    keyInsights: [
      'Spiritual inclinations and path',
      'Religious activities and worship',
      'Devotion and faith',
      'Spiritual growth and evolution'
    ]
  },
  {
    id: 'education',
    name: 'Education & Learning',
    chart: 'D24_Chaturvimsamsa',
    icon: GraduationCap,
    color: 'from-blue-600 to-indigo-500',
    description: 'Chaturvimsamsa (D24) - The chart of education, learning abilities, and academic success',
    keyInsights: [
      'Educational pursuits and success',
      'Learning abilities and aptitude',
      'Academic achievements',
      'Knowledge acquisition and wisdom'
    ]
  },
  {
    id: 'character',
    name: 'Strengths & Character',
    chart: 'D27_Nakshatramsa',
    icon: Target,
    color: 'from-green-600 to-teal-500',
    description: 'Nakshatramsa (D27) - The chart of individual strengths, weaknesses, and character traits',
    keyInsights: [
      'Individual strengths and talents',
      'Personal weaknesses and challenges',
      'Character traits and temperament',
      'Overall personality assessment'
    ]
  },
  {
    id: 'evils',
    name: 'Evils & Misfortunes',
    chart: 'D30_Trimsamsa',
    icon: Skull,
    color: 'from-red-600 to-rose-700',
    description: 'Trimsamsa (D30) - The chart of evils, misfortunes, calamities, and diseases (unequal divisions)',
    keyInsights: [
      'Calamities and misfortunes',
      'Disease patterns and health issues',
      'Negative karmic influences',
      'Areas requiring caution and remedies'
    ]
  },
  {
    id: 'effects',
    name: 'Auspicious Effects',
    chart: 'D40_Khavedamsa',
    icon: Gem,
    color: 'from-emerald-500 to-green-500',
    description: 'Khavedamsa (D40) - The chart of auspicious and inauspicious effects, maternal family, and protection',
    keyInsights: [
      'Auspicious and inauspicious effects',
      'Maternal family influences',
      'Protection and guardianship',
      'Overall life effects and outcomes'
    ]
  },
  {
    id: 'conduct',
    name: 'Conduct & Behavior',
    chart: 'D45_Akshavedamsa',
    icon: User,
    color: 'from-cyan-600 to-blue-600',
    description: 'Akshavedamsa (D45) - The chart of moral character, ethical conduct, and behavioral patterns',
    keyInsights: [
      'Moral character and ethics',
      'Behavioral patterns and conduct',
      'Personal integrity and values',
      'Ethical decision-making tendencies'
    ]
  },
  {
    id: 'karma',
    name: 'Karma & Rectification',
    chart: 'D60_Shashtiamsa',
    icon: Clock,
    color: 'from-red-500 to-orange-500',
    description: 'Shashtiamsa (D60) - CRITICAL chart for overall karma, past life influences, and birth time rectification',
    keyInsights: [
      'Overall life karma assessment',
      'Past life influences and debts',
      'Birth time verification and rectification',
      'Fine-tuning of all predictions and timing'
    ]
  }
];

interface Props {
  divisionalCharts: any;
}

const DivisionalChartsAetherView = ({ divisionalCharts }: Props) => {
  const [selectedArea, setSelectedArea] = useState<LifeArea | null>(null);

  const renderChartSVG = (chartData: any) => {
    if (!chartData) return null;

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
          {chartData && Object.entries(chartData).map(([planet, data]: [string, any], i) => {
            if (!data || !data.sign) return null;

            // Simple house mapping based on sign
            const signToHouse: {[key: string]: number} = {
              'Aries': 1, 'Taurus': 2, 'Gemini': 3, 'Cancer': 4,
              'Leo': 5, 'Virgo': 6, 'Libra': 7, 'Scorpio': 8,
              'Sagittarius': 9, 'Capricorn': 10, 'Aquarius': 11, 'Pisces': 12
            };
            const house = signToHouse[data.sign] || 1;

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

            const offset = Object.keys(chartData).slice(0, i).filter(p => {
              const pData = chartData[p];
              return pData && signToHouse[pData.sign] === house;
            }).length;

            return (
              <g key={planet}>
                <text
                  x={pos.x}
                  y={pos.y + offset * 14}
                  textAnchor="middle"
                  fill="hsl(var(--primary))"
                  fontSize="14"
                  fontWeight="bold"
                >
                  {planetSymbols[planet] || planet.substring(0, 2)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Life Areas Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <Badge variant="secondary">{area.chart.split('_')[0]}</Badge>
                </div>
                <CardTitle className="text-xl">{area.name}</CardTitle>
                <CardDescription className="text-sm">
                  {area.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <button
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    isSelected
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  View Chart
                  <ChevronRight className="w-4 h-4" />
                </button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Chart Display */}
      {selectedArea && divisionalCharts.divisional_charts[selectedArea.chart] && (
        <Card className="border-t-4 border-t-primary">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${selectedArea.color} flex items-center justify-center`}>
                <selectedArea.icon className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">{selectedArea.name}</CardTitle>
                <CardDescription className="text-base">
                  {selectedArea.description}
                </CardDescription>
              </div>
              <Badge className="text-lg px-4 py-2">{selectedArea.chart.split('_')[0]}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Chart Visualization */}
            <div className="bg-muted/30 p-8 rounded-lg">
              {renderChartSVG(divisionalCharts.divisional_charts[selectedArea.chart])}
            </div>

            {/* Key Insights */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-lg border border-primary/20">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Key Insights from {selectedArea.chart.split('_')[0]}
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
            <div>
              <h3 className="text-xl font-semibold mb-4">Planetary Positions</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(divisionalCharts.divisional_charts[selectedArea.chart]).map(([planet, data]: [string, any]) => (
                  <div key={planet} className="bg-muted/30 p-4 rounded-lg">
                    <div className="font-semibold text-primary">{planet}</div>
                    <div className="text-sm text-muted-foreground">
                      {data.sign}
                    </div>
                    {data.degrees_in_sign && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {data.degrees_in_sign.toFixed(2)}°
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DivisionalChartsAetherView;
