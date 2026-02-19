import { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Activity, Globe, Cpu, Zap, Fingerprint,
  Database, ScanLine, Radio, HeartPulse, Brain, Leaf, ChevronRight,
  MapPin, Mic, Volume2, Trophy, Orbit, Layers, MessageSquare, X, Loader2
} from 'lucide-react';
import { calculatePlanetHouse } from '@/astrology/lib/house-calculator';

// Planetary abbreviations for display
const PLANET_ABBR: Record<string, string> = {
  Sun: 'SU', Moon: 'MO', Mars: 'MA', Mercury: 'ME',
  Jupiter: 'JU', Venus: 'VE', Saturn: 'SA', Rahu: 'RA', Ketu: 'KE'
};

// House metadata with bio-astrology
const HOUSE_METADATA = [
  {
    id: 1, name: "Lagna Bhava", translat: "The Ascendant",
    description: "Interface of Soul & Matter. Defines physique, immunity, and fame.",
    impact: "Defines your resilience, immunity, and personal agency.",
    planet: "Sun (Karaka)", element: "Fire", bioMarker: "Cranium / Brain",
    medicalAlert: "Monitor headaches during Sun transits.",
    nadiLeaf: "Kandam 1: General Destiny"
  },
  {
    id: 2, name: "Dhana Bhava", translat: "House of Resources",
    description: "Accumulated assets, family lineage, and vocal power.",
    impact: "Controls liquid assets, dietary habits, and verbal influence.",
    planet: "Jupiter (Wealth)", element: "Earth", bioMarker: "Face / Throat / Thyroid",
    medicalAlert: "Voice strain likely during Retrograde Mercury.",
    nadiLeaf: "Kandam 2: Wealth & Education"
  },
  {
    id: 3, name: "Sahaja Bhava", translat: "House of Effort",
    description: "Courage, manual skill, and younger siblings.",
    impact: "Determines drive, bravery, and manual dexterity.",
    planet: "Mars (Energy)", element: "Air", bioMarker: "Shoulders / Lungs",
    medicalAlert: "Respiratory sensitivity detected.",
    nadiLeaf: "Kandam 3: Siblings"
  },
  {
    id: 4, name: "Matru Bhava", translat: "House of Stability",
    description: "Emotional anchor, mother, vehicles, and real estate.",
    impact: "Governs emotional security and cardiovascular rhythm.",
    planet: "Moon (Mind)", element: "Water", bioMarker: "Heart / Chest / Valves",
    medicalAlert: "HRV variance correlates with Moon phases.",
    nadiLeaf: "Kandam 4: Mother & Assets"
  },
  {
    id: 5, name: "Putra Bhava", translat: "House of Creation",
    description: "Progeny, intelligence, and past-life merit (Purva Punya).",
    impact: "Influences merit from past lives and gut-instincts.",
    planet: "Jupiter (Wisdom)", element: "Fire", bioMarker: "Stomach / Upper Gut",
    medicalAlert: "Digestive fire (Agni) fluctuates with Jupiter.",
    nadiLeaf: "Kandam 5: Children"
  },
  {
    id: 6, name: "Ari Bhava", translat: "House of Obstacles",
    description: "Litigation, enemies, acute illness, and service.",
    impact: "Determines biological defense mechanisms and legal outcomes.",
    planet: "Mars (Defense)", element: "Earth", bioMarker: "Intestines / Immune",
    medicalAlert: "Inflammatory markers elevated.",
    nadiLeaf: "Kandam 6: Disease & Debt"
  },
  {
    id: 7, name: "Yuvati Bhava", translat: "House of Union",
    description: "Partnerships, trade, and public image.",
    impact: "Crucial for reproductive health and public relations.",
    planet: "Venus (Love)", element: "Air", bioMarker: "Kidneys / Lower Back",
    medicalAlert: "Hydration levels critical.",
    nadiLeaf: "Kandam 7: Marriage"
  },
  {
    id: 8, name: "Randhra Bhava", translat: "House of Mystery",
    description: "Longevity, sudden events, occult, and inheritance.",
    impact: "Governs chronic vitality and cellular regeneration.",
    planet: "Saturn (Time)", element: "Water", bioMarker: "Excretory / Adrenals",
    medicalAlert: "Adrenal fatigue risk during Saturn transit.",
    nadiLeaf: "Kandam 8: Longevity"
  },
  {
    id: 9, name: "Dharma Bhava", translat: "House of Fortune",
    description: "Higher law, father, guru, and long travel.",
    impact: "Influences spiritual alignment and systemic guidance.",
    planet: "Jupiter (Guru)", element: "Fire", bioMarker: "Thighs / Arteries",
    medicalAlert: "Circulation optimal.",
    nadiLeaf: "Kandam 9: Father & Fortune"
  },
  {
    id: 10, name: "Karma Bhava", translat: "House of Action",
    description: "Career, authority, status, and public deeds.",
    impact: "Defines social rank and skeletal structural integrity.",
    planet: "Mercury/Saturn", element: "Earth", bioMarker: "Knees / Skeleton",
    medicalAlert: "Joint lubrication recommended.",
    nadiLeaf: "Kandam 10: Career"
  },
  {
    id: 11, name: "Labha Bhava", translat: "House of Gains",
    description: "Network circles, fulfillment of desires, and profit.",
    impact: "Controls circulation of resources and blood.",
    planet: "Jupiter (Expansion)", element: "Air", bioMarker: "Calves / Ankles",
    medicalAlert: "Monitor ankle stability.",
    nadiLeaf: "Kandam 11: Gains"
  },
  {
    id: 12, name: "Vyaya Bhava", translat: "House of Liberation",
    description: "Loss, isolation, sleep, foreign lands, and Moksha.",
    impact: "Governs sleep cycles (REM) and lymphatic drainage.",
    planet: "Saturn (Endings)", element: "Water", bioMarker: "Feet / Lymph",
    medicalAlert: "Sleep cycle disruption detected.",
    nadiLeaf: "Kandam 12: Expenses & Moksha"
  }
];

interface Planet {
  longitude: number;
  sign: string;
  nakshatra: string;
  nakshatra_name?: string;
  house: number;
  name?: string;
}

interface ProjectAetherKundliProps {
  planets: Record<string, Planet>;
  houses: number[];
  ascendant: {
    sign: string;
    longitude: number;
  };
  // Optional 6-layer intelligence data
  yogaData?: any;
  shadbalaData?: any;
  dashaData?: any;
  lifePredictions?: any;
  divisionalCharts?: any;
  birthData?: {
    birth_datetime: string;
    latitude: number;
    longitude: number;
    timezone?: string;
  };
}

export default function ProjectAetherKundli({
  planets,
  houses,
  ascendant,
  yogaData,
  shadbalaData,
  dashaData,
  lifePredictions,
  divisionalCharts,
  birthData
}: ProjectAetherKundliProps) {
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
  const [hoveredHouse, setHoveredHouse] = useState<number | null>(null);
  const [systemReady, setSystemReady] = useState(false);
  const [simulatedHRV, setSimulatedHRV] = useState(98);
  const [selectedChart, setSelectedChart] = useState<string>('D1');
  const [showExplanation, setShowExplanation] = useState(false);
  const [chartExplanation, setChartExplanation] = useState<string>('');
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [personalizedInterpretation, setPersonalizedInterpretation] = useState<any>(null);
  const [isLoadingInterpretation, setIsLoadingInterpretation] = useState(false);

  // Divisional chart options - ALL 19 PROFESSIONAL CHARTS
  const chartOptions = [
    { value: 'D1', label: 'D1 - Birth Chart (Rashi)', description: 'Main birth chart' },
    { value: 'D2', label: 'D2 - Wealth (Hora)', description: 'Financial prosperity' },
    { value: 'D3', label: 'D3 - Siblings (Drekkana)', description: 'Courage & initiatives' },
    { value: 'D4', label: 'D4 - Property (Chaturthamsa)', description: 'Fortune & assets' },
    { value: 'D5', label: 'D5 - Fame (Panchamsa)', description: 'Authority & reputation' },
    { value: 'D6', label: 'D6 - Enemies (Shashtamsa)', description: 'Obstacles & diseases' },
    { value: 'D7', label: 'D7 - Children (Saptamsa)', description: 'Progeny & creativity' },
    { value: 'D8', label: 'D8 - Longevity (Ashtamsa)', description: 'Sudden events' },
    { value: 'D9', label: 'D9 - Marriage (Navamsa)', description: 'Spouse & partnership' },
    { value: 'D10', label: 'D10 - Career (Dasamsa)', description: 'Professional life' },
    { value: 'D11', label: 'D11 - Gains (Ekadasamsa)', description: 'Friends & income' },
    { value: 'D12', label: 'D12 - Parents (Dwadasamsa)', description: 'Family & ancestors' },
    { value: 'D16', label: 'D16 - Vehicles (Shodasamsa)', description: 'Comforts & happiness' },
    { value: 'D20', label: 'D20 - Spirituality (Vimsamsa)', description: 'Religious pursuits' },
    { value: 'D24', label: 'D24 - Education (Chaturvimsamsa)', description: 'Learning & knowledge' },
    { value: 'D27', label: 'D27 - Character (Nakshatramsa)', description: 'Strengths & weaknesses' },
    { value: 'D30', label: 'D30 - Evils (Trimsamsa)', description: 'Misfortunes & diseases' },
    { value: 'D40', label: 'D40 - Effects (Khavedamsa)', description: 'Auspicious results' },
    { value: 'D45', label: 'D45 - Conduct (Akshavedamsa)', description: 'Moral character' },
    { value: 'D60', label: 'D60 - Karma (Shashtiamsa)', description: 'Past life & rectification ⭐' }
  ];
  const [karmaPoints, setKarmaPoints] = useState(1240);
  const [ayanamsa, setAyanamsa] = useState("LAHIRI");
  const ayanamsaOptions = ["LAHIRI", "TRUE CITRA", "KP (NEW)", "RAMAN", "SURYA SIDDHANTA"];
  const [showAyanamsaMenu, setShowAyanamsaMenu] = useState(false);

  // Function to explain the chart using RISHI-70B Multi-Agent System
  const explainChart = async () => {
    if (!birthData) {
      alert('Birth data is not available. Please ensure the chart is loaded.');
      return;
    }

    setIsLoadingExplanation(true);
    setShowExplanation(true);
    setChartExplanation('');

    try {
      const chartOption = chartOptions.find(opt => opt.value === selectedChart);
      const chartDescription = chartOption?.description || 'chart analysis';

      const response = await fetch(`${import.meta.env.VITE_ASTROLOGY_API_URL || 'http://localhost:8000'}/api/ai-astrologer/explain-chart-simple`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: `Please explain the ${selectedChart} (${chartDescription}) in simple, easy-to-understand language for a non-technical person. Focus on what this chart reveals about the person's life and what the planetary positions mean in practical terms.`,
          chart_context: {
            birth_datetime: birthData.birth_datetime,
            latitude: birthData.latitude,
            longitude: birthData.longitude,
            timezone: birthData.timezone,
            ayanamsa: ayanamsa
          },
          focus_area: selectedChart
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Format the response according to the guideline
      const formattedExplanation = formatExplanation(data.message, selectedChart, chartOption?.label || selectedChart);

      setChartExplanation(formattedExplanation);
    } catch (error) {
      console.error('Error fetching chart explanation:', error);
      setChartExplanation(
        'Unable to connect to RISHI-70B AI system. Please ensure the backend server is running.\n\n' +
        'Error: ' + (error as Error).message
      );
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  // Format the AI response in user-friendly language
  const formatExplanation = (aiResponse: string, chartCode: string, chartName: string): string => {
    return `## ${chartName} - Simplified Explanation\n\n${aiResponse}\n\n---\n\n**Note:** This interpretation is generated by RISHI-70B, our multi-agent AI system that combines:\n- **The Mathematician**: Technical calculations from Swiss Ephemeris\n- **The Historian**: Classical Vedic texts and wisdom\n- **The Synthesizer**: Balanced interpretation of all factors\n- **The Counselor**: Human-centric, actionable guidance\n\nRemember: Astrology shows tendencies and possibilities, not fixed outcomes. Your free will and conscious choices shape your destiny.`;
  };

  // Helper function to calculate divisional chart sign from longitude
  const getDivisionalSign = (longitude: number, chartType: string): string => {
    const signs = [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];

    // For D1, just return the regular sign
    if (chartType === 'D1') {
      const signIndex = Math.floor(longitude / 30);
      return signs[signIndex % 12];
    }

    // For divisional charts, calculate the divisional sign
    // This exactly mimics the backend Python calculation logic
    const birthSign = Math.floor(longitude / 30);
    const degreesInSign = longitude % 30;
    let divSignIndex: number;

    switch (chartType) {
      case 'D2': {
        // Hora: Each sign divided into 2 parts of 15° each
        const division = Math.floor(degreesInSign / 15.0);
        // Odd signs: First half Leo, second half Cancer
        // Even signs: First half Cancer, second half Leo
        if (birthSign % 2 === 0) {
          divSignIndex = division === 0 ? 4 : 3;  // Leo : Cancer
        } else {
          divSignIndex = division === 0 ? 3 : 4;  // Cancer : Leo
        }
        break;
      }
      case 'D3': {
        // Drekkana: Each sign divided into 3 parts of 10° each
        const division = Math.floor(degreesInSign / 10.0);
        divSignIndex = (birthSign + (division * 4)) % 12;
        break;
      }
      case 'D4': {
        // Chaturthamsa: Each sign divided into 4 parts of 7°30' each
        const division = Math.floor(degreesInSign / 7.5);
        divSignIndex = (birthSign + division) % 12;
        break;
      }
      case 'D5': {
        // Panchamsa: Each sign divided into 5 parts of 6° each
        const division = Math.floor(degreesInSign / 6.0);
        if (birthSign % 2 === 0) {
          divSignIndex = (birthSign + division) % 12;
        } else {
          divSignIndex = (birthSign + 8 + division) % 12;
        }
        break;
      }
      case 'D6': {
        // Shashtamsa: Each sign divided into 6 parts of 5° each
        const division = Math.floor(degreesInSign / 5.0);
        if (birthSign % 2 === 0) {
          divSignIndex = (0 + division) % 12;  // Start from Aries
        } else {
          divSignIndex = (6 + division) % 12;  // Start from Libra
        }
        break;
      }
      case 'D7': {
        // Saptamsa: Each sign divided into 7 parts
        const divisionSize = 30.0 / 7.0;
        const division = Math.floor(degreesInSign / divisionSize);
        if (birthSign % 2 === 0) {
          divSignIndex = (birthSign + division) % 12;
        } else {
          divSignIndex = (birthSign + 6 + division) % 12;
        }
        break;
      }
      case 'D8': {
        // Ashtamsa: Each sign divided into 8 parts of 3°45' each
        const division = Math.floor(degreesInSign / 3.75);
        if (birthSign % 2 === 0) {
          divSignIndex = (birthSign + division) % 12;
        } else {
          divSignIndex = (birthSign + 8 + division) % 12;
        }
        break;
      }
      case 'D9': {
        // Navamsa: Each sign divided into 9 parts of 3°20' each
        const division = Math.floor(degreesInSign / 3.333333);
        if (birthSign % 2 === 0) {
          divSignIndex = (birthSign + division) % 12;
        } else {
          divSignIndex = (birthSign + 8 + division) % 12;
        }
        break;
      }
      case 'D10': {
        // Dasamsa: Each sign divided into 10 parts of 3° each
        const division = Math.floor(degreesInSign / 3.0);
        if (birthSign % 2 === 0) {
          divSignIndex = (birthSign + division) % 12;
        } else {
          divSignIndex = (birthSign + 8 + division) % 12;
        }
        break;
      }
      case 'D11': {
        // Ekadasamsa: Each sign divided into 11 parts
        const divisionSize = 30.0 / 11.0;
        const division = Math.floor(degreesInSign / divisionSize);
        divSignIndex = (birthSign + division) % 12;
        break;
      }
      case 'D12': {
        // Dwadasamsa: Each sign divided into 12 parts of 2°30' each
        const division = Math.floor(degreesInSign / 2.5);
        divSignIndex = (birthSign + division) % 12;
        break;
      }
      case 'D16': {
        // Shodasamsa: Each sign divided into 16 parts of 1°52'30" each
        const division = Math.floor(degreesInSign / 1.875);
        const signNature = birthSign % 3;
        if (signNature === 0) divSignIndex = (0 + division) % 12;  // Movable from Aries
        else if (signNature === 1) divSignIndex = (4 + division) % 12;  // Fixed from Leo
        else divSignIndex = (8 + division) % 12;  // Dual from Sagittarius
        break;
      }
      case 'D20': {
        // Vimsamsa: Each sign divided into 20 parts of 1°30' each
        const division = Math.floor(degreesInSign / 1.5);
        const signNature = birthSign % 3;
        if (signNature === 0) divSignIndex = (0 + division) % 12;  // Movable from Aries
        else if (signNature === 1) divSignIndex = (8 + division) % 12;  // Fixed from Sagittarius
        else divSignIndex = (4 + division) % 12;  // Dual from Leo
        break;
      }
      case 'D24': {
        // Chaturvimsamsa: Each sign divided into 24 parts of 1°15' each
        const division = Math.floor(degreesInSign / 1.25);
        if (birthSign % 2 === 0) {
          divSignIndex = (4 + division) % 12;  // Odd from Leo
        } else {
          divSignIndex = (3 + division) % 12;  // Even from Cancer
        }
        break;
      }
      case 'D27': {
        // Nakshatramsa: Each sign divided into 27 parts
        const division = Math.floor(degreesInSign / (30.0 / 27.0));
        const element = birthSign % 4;
        if (element === 0) divSignIndex = (0 + division) % 12;  // Fire from Aries
        else if (element === 1) divSignIndex = (3 + division) % 12;  // Earth from Cancer
        else if (element === 2) divSignIndex = (6 + division) % 12;  // Air from Libra
        else divSignIndex = (9 + division) % 12;  // Water from Capricorn
        break;
      }
      case 'D30': {
        // Trimsamsa: Unequal divisions
        if (birthSign % 2 === 0) {
          // Odd signs
          if (degreesInSign < 5) divSignIndex = 0;  // Aries
          else if (degreesInSign < 10) divSignIndex = 10;  // Aquarius
          else if (degreesInSign < 18) divSignIndex = 8;  // Sagittarius
          else if (degreesInSign < 25) divSignIndex = 5;  // Virgo
          else divSignIndex = 1;  // Taurus
        } else {
          // Even signs
          if (degreesInSign < 5) divSignIndex = 6;  // Libra
          else if (degreesInSign < 12) divSignIndex = 2;  // Gemini
          else if (degreesInSign < 20) divSignIndex = 11;  // Pisces
          else if (degreesInSign < 25) divSignIndex = 9;  // Capricorn
          else divSignIndex = 7;  // Scorpio
        }
        break;
      }
      case 'D40': {
        // Khavedamsa: Each sign divided into 40 parts of 0°45' each
        const division = Math.floor(degreesInSign / 0.75);
        const signNature = birthSign % 3;
        if (signNature === 0) divSignIndex = (0 + division) % 12;
        else if (signNature === 1) divSignIndex = (4 + division) % 12;
        else divSignIndex = (8 + division) % 12;
        break;
      }
      case 'D45': {
        // Akshavedamsa: Each sign divided into 45 parts of 0°40' each
        const division = Math.floor(degreesInSign / (30.0 / 45.0));
        const signNature = birthSign % 3;
        if (signNature === 0) divSignIndex = (0 + division) % 12;
        else if (signNature === 1) divSignIndex = (4 + division) % 12;
        else divSignIndex = (8 + division) % 12;
        break;
      }
      case 'D60': {
        // Shashtiamsa: Each sign divided into 60 parts of 0°30' each
        const division = Math.floor(degreesInSign / 0.5);
        const positionInCycle = division % 12;
        const signNature = birthSign % 3;
        let startSign;
        if (signNature === 0) startSign = birthSign;  // Movable
        else if (signNature === 1) startSign = (birthSign + 8) % 12;  // Fixed
        else startSign = (birthSign + 4) % 12;  // Dual
        divSignIndex = (startSign + positionInCycle) % 12;
        break;
      }
      default:
        divSignIndex = birthSign;
    }

    return signs[divSignIndex];
  };

  // Get current chart's planet data
  const getCurrentChartPlanets = () => {
    if (selectedChart === 'D1' || !divisionalCharts) {
      return planets;
    }

    // Map chart selector to API keys - All 19 divisional charts
    const chartMapping: {[key: string]: string} = {
      'D2': 'D2_Hora',
      'D3': 'D3_Drekkana',
      'D4': 'D4_Chaturthamsa',
      'D5': 'D5_Panchamsa',
      'D6': 'D6_Shashtamsa',
      'D7': 'D7_Saptamsa',
      'D8': 'D8_Ashtamsa',
      'D9': 'D9_Navamsa',
      'D10': 'D10_Dasamsa',
      'D11': 'D11_Ekadasamsa',
      'D12': 'D12_Dwadasamsa',
      'D16': 'D16_Shodasamsa',
      'D20': 'D20_Vimsamsa',
      'D24': 'D24_Chaturvimsamsa',
      'D27': 'D27_Nakshatramsa',
      'D30': 'D30_Trimsamsa',
      'D40': 'D40_Khavedamsa',
      'D45': 'D45_Akshavedamsa',
      'D60': 'D60_Shashtiamsa'
    };

    const chartKey = chartMapping[selectedChart];
    if (!chartKey || !divisionalCharts.divisional_charts || !divisionalCharts.divisional_charts[chartKey]) {
      return planets;
    }

    // Convert divisional chart data to planet format
    const divChart = divisionalCharts.divisional_charts[chartKey];
    const convertedPlanets: Record<string, Planet> = {};

    // CRITICAL VEDIC PRINCIPLE: In divisional charts, house cusps remain the same as D1
    // Only planetary positions change. We use D1 houses, not divisional ascendant.

    // Debug logging
    console.log(`📊 ${selectedChart} - Chart Key: ${chartKey}`);
    console.log(`📊 ${selectedChart} - Houses:`, houses);
    console.log(`📊 ${selectedChart} - Div Chart Data:`, divChart);

    Object.entries(divChart).forEach(([planetName, data]: [string, any]) => {
      if (data && data.sign && data.longitude !== undefined) {
        // Use the divisional chart's longitude to calculate house based on D1 house cusps
        // This preserves the D1 house system while showing divisional planet positions
        const houseNum = calculatePlanetHouse(data.longitude, houses);

        console.log(`📊 ${selectedChart} - ${planetName}: longitude=${data.longitude}, sign=${data.sign}, house=${houseNum}`);

        convertedPlanets[planetName] = {
          longitude: data.longitude,
          sign: data.sign,
          nakshatra: planets[planetName]?.nakshatra || planets[planetName]?.nakshatra_name || '',
          house: houseNum,
          name: planetName
        };
      }
    });

    return convertedPlanets;
  };

  const currentPlanets = getCurrentChartPlanets();
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [timeView, setTimeView] = useState<'past' | 'present' | 'future'>('present');
  const [showLayers, setShowLayers] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanStage, setScanStage] = useState("");
  const [scanComplete, setScanComplete] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{role: string; text: string}>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [summaryGenerated, setSummaryGenerated] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Convert houses to proper format and recalculate planet houses
  const houseCusps: number[] = Array.isArray(houses)
    ? houses
    : (Object.values(houses as Record<string, number>) as number[]);

  // Recalculate correct planet houses using house cusps (only for D1 birth chart)
  // For divisional charts, houses are already correctly calculated in getCurrentChartPlanets
  const planetsWithCorrectHouses = Object.entries(currentPlanets).reduce((acc, [name, planetData]) => {
    let correctHouse: number;

    if (selectedChart === 'D1') {
      // For birth chart (D1), use house cusps to calculate precise house position
      correctHouse = calculatePlanetHouse(planetData.longitude, houseCusps);
    } else {
      // For divisional charts, use the already-calculated house from getCurrentChartPlanets
      correctHouse = planetData.house;
    }

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

  // System boot
  useEffect(() => {
    const timer = setTimeout(() => setSystemReady(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Bio-feedback simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedHRV(prev => {
        const variance = Math.random() > 0.5 ? 1 : -1;
        let newValue = prev + variance;
        if (newValue > 110) newValue = 100;
        if (newValue < 60) newValue = 65;
        return newValue;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping]);

  // Load personalized interpretation when chart changes
  useEffect(() => {
    if (birthData && selectedChart) {
      loadPersonalizedInterpretation();
    }
  }, [selectedChart, birthData]);

  // Function to load personalized interpretation
  const loadPersonalizedInterpretation = async () => {
    if (!birthData) {
      console.log('No birthData available for personalized interpretation');
      return;
    }

    console.log('Loading personalized interpretation for:', selectedChart, birthData);
    setIsLoadingInterpretation(true);
    try {
      const requestBody = {
        question: `Interpret ${selectedChart}`,
        chart_context: {
          birth_datetime: birthData.birth_datetime,
          latitude: birthData.latitude,
          longitude: birthData.longitude,
          timezone: birthData.timezone || 'UTC',
          ayanamsa: 'LAHIRI'
        },
        focus_area: selectedChart
      };

      console.log('Request body:', requestBody);

      // Use the divisional chart AI interpretation endpoint
      const response = await fetch(`${import.meta.env.VITE_ASTROLOGY_API_URL || 'http://localhost:8000'}/api/test/ai-personality`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          birth_datetime: birthData.birth_datetime,
          latitude: birthData.latitude,
          longitude: birthData.longitude,
          timezone: birthData.timezone || 'UTC',
          chart_type: selectedChart  // Pass the selected chart type (D1, D2, D3, etc.)
        })
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('AI Response data:', data);
        if (data.success && data.ai_analysis) {
          // Transform AI analysis into interpretation format
          const aiAnalysis = data.ai_analysis;
          const chartName = aiAnalysis.chart_name || data.chart_type || selectedChart;
          const chartPurpose = aiAnalysis.chart_purpose || '';

          const interpretation = {
            summary: `**${chartName}**${chartPurpose ? ` - ${chartPurpose}` : ''}\n\n${aiAnalysis.overview || ''}`,
            key_insights: [],
            strengths: [],
            challenges: [],
            guidance: ''
          };

          // Handle different chart type responses dynamically
          // For D1 (Personality)
          if (aiAnalysis.how_others_see_you?.strangers_think) {
            interpretation.key_insights.push(`👤 **How Others See You**: ${aiAnalysis.how_others_see_you.strangers_think}`);
          }
          if (aiAnalysis.behavioral_patterns && Array.isArray(aiAnalysis.behavioral_patterns)) {
            interpretation.key_insights.push('\n\n**Verify These Behaviors**:\n' +
              aiAnalysis.behavioral_patterns.slice(0, 7).map(b => `• ${b}`).join('\n'));
          }
          if (aiAnalysis.core_traits && Array.isArray(aiAnalysis.core_traits)) {
            interpretation.key_insights.push('\n\n**Core Traits**:\n' +
              aiAnalysis.core_traits.map(t => `• ${t}`).join('\n'));
          }

          // For D2 (Wealth)
          if (aiAnalysis.primary_source) {
            interpretation.key_insights.push(`💰 **Primary Wealth Source**: ${aiAnalysis.primary_source}`);
          }
          if (aiAnalysis.best_strategies && Array.isArray(aiAnalysis.best_strategies)) {
            interpretation.key_insights.push('\n\n**Wealth Building Strategies**:\n' +
              aiAnalysis.best_strategies.map(s => `• ${s}`).join('\n'));
          }

          // For D9 (Marriage)
          if (aiAnalysis.spouse_nature) {
            interpretation.key_insights.push(`💑 **Spouse Nature**: ${aiAnalysis.spouse_nature}`);
          }
          if (aiAnalysis.marriage_quality) {
            interpretation.key_insights.push(`\n\n**Marriage Quality**: ${aiAnalysis.marriage_quality}`);
          }

          // For D10 (Career)
          if (aiAnalysis.best_careers && Array.isArray(aiAnalysis.best_careers)) {
            interpretation.key_insights.push('💼 **Best Career Paths**:\n' +
              aiAnalysis.best_careers.map(c => `• ${c}`).join('\n'));
          }

          // Generic fields that work for all charts
          if (aiAnalysis.key_patterns && Array.isArray(aiAnalysis.key_patterns)) {
            interpretation.key_insights.push('\n\n**Key Patterns**:\n' +
              aiAnalysis.key_patterns.map(p => `• ${p}`).join('\n'));
          }
          if (aiAnalysis.strengths && Array.isArray(aiAnalysis.strengths)) {
            interpretation.strengths = aiAnalysis.strengths;
          }
          if (aiAnalysis.challenges && Array.isArray(aiAnalysis.challenges)) {
            interpretation.challenges = aiAnalysis.challenges;
          }
          if (aiAnalysis.guidance) {
            interpretation.guidance = aiAnalysis.guidance;
          }

          // Add verification points as guidance
          if (aiAnalysis.verification_points && Array.isArray(aiAnalysis.verification_points)) {
            interpretation.guidance = (interpretation.guidance ? interpretation.guidance + '\n\n' : '') +
              '**Verify This Analysis:**\n\n' +
              aiAnalysis.verification_points.map(item => `✓ ${item}`).join('\n') +
              '\n\n**If 80%+ matches your real life, this system is reading your chart accurately.**';
          }

          setPersonalizedInterpretation(interpretation);
          console.log(`AI-powered interpretation set for ${chartName}:`, interpretation);
        } else {
          console.warn('API returned success:false or no ai_analysis');
        }
      } else {
        console.error('API returned error status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
      }
    } catch (error) {
      console.error('Error loading personalized interpretation:', error);
      setPersonalizedInterpretation(null);
    } finally {
      setIsLoadingInterpretation(false);
    }
  };

  // Generate initial personal summary when data is loaded
  useEffect(() => {
    if (systemReady && !summaryGenerated && yogaData && shadbalaData && dashaData) {
      setSummaryGenerated(true);
      generatePersonalSummary();
    }
  }, [systemReady, yogaData, shadbalaData, dashaData, summaryGenerated]);

  const generatePersonalSummary = () => {
    setIsTyping(true);
    const messages: Array<{role: string; text: string}> = [];

    // System initialization - simpler version since we have visual panel
    messages.push({ role: 'system', text: "COSMIC OS v4.1 :: INITIALIZED" });
    messages.push({ role: 'system', text: "SWISS EPHEMERIS (v2.10) :: LINKED" });
    messages.push({ role: 'system', text: "BIRTH CHART DATA :: SYNCED" });
    messages.push({ role: 'system', text: "6-LAYER INTELLIGENCE :: ACTIVE" });
    messages.push({ role: 'system', text: "WEARABLE API :: LISTENING..." });
    messages.push({ role: 'system', text: "═══════════════════════════════════════" });
    messages.push({ role: 'system', text: "PERSONAL COSMIC PROFILE GENERATED" });
    messages.push({ role: 'system', text: "═══════════════════════════════════════" });

    // Welcome message - simplified since visual panel shows details
    messages.push({
      role: 'ai',
      text: `[RISHI-70B]: Welcome! Your personal cosmic profile has been generated and is displayed below the Kundli chart. Review your core identity, planetary strengths, yogas, and current timeline.`
    });

    messages.push({
      role: 'ai',
      text: `[INTERACTION_GUIDE]: Click any house sector on the chart to initiate a deep-dive 6-layer analysis. The system will correlate birth chart data, yogas, planetary strengths, dasha periods, bio-astrology markers, and ancient Nadi wisdom for that specific life area.`
    });

    messages.push({
      role: 'ai',
      text: `[TEMPORAL_SYSTEM]: Use the PAST/PRESENT/FUTURE timeline controls to switch between karmic patterns, current activation, and 10-year projections. Each analysis adapts to your selected time frame.`
    });

    // Stream messages with delays
    let delay = 500;
    messages.forEach((msg, index) => {
      setTimeout(() => {
        setChatHistory(prev => [...prev, msg]);
        if (index === messages.length - 1) {
          setIsTyping(false);
        }
      }, delay);
      delay += msg.role === 'system' ? 400 : 1200;
    });
  };

  const handleHouseClick = (id: number) => {
    if (scanning) return;

    const house = HOUSE_METADATA.find(h => h.id === id);
    if (!house) return;

    setSelectedHouse(id);
    setScanComplete(false);
    setScanning(true);
    setChatHistory([]);

    // Project Agastya scan simulation
    setScanStage("CAPTURING_THUMBPRINT");
    setTimeout(() => setScanStage("ENHANCING_RIDGE_CONTRAST"), 800);
    setTimeout(() => setScanStage("CLASSIFYING_PATTERN: WHORL"), 1600);
    setTimeout(() => setScanStage("RETRIEVING_LEAF_BUNDLE"), 2400);

    setTimeout(() => {
      setScanning(false);
      setScanStage("");
      setScanComplete(true);
      generateMultiAgentAnalysis(house);
    }, 3200);
  };

  const generateMultiAgentAnalysis = (house: typeof HOUSE_METADATA[0]) => {
    setIsTyping(true);

    // Clear previous analysis - start fresh for progressive display
    setChatHistory([]);

    const housePlanets = planetsByHouse[house.id] || [];

    // FUTURISTIC PROGRESSIVE 6-LAYER ANALYSIS
    // Each layer appears, then fades out as next layer begins

    // LAYER 1: FOUNDATION (visible for 2 seconds, then fades)
    setTimeout(() => {
      setChatHistory([{
        role: 'system',
        text: `[LAYER_1::FOUNDATION] 🔷 Initializing quantum analysis for House ${house.id}: ${house.name}...\n▸ Element: ${house.element} | Lord: ${house.planet}`
      }]);
    }, 0);

    // LAYER 2: YOGA DETECTION (Layer 1 fades out, Layer 2 appears)
    setTimeout(() => {
      if (yogaData && (yogaData.yogas || yogaData.all_yogas)) {
        const yogaList = yogaData.yogas || yogaData.all_yogas || [];
        const houseYogas = yogaList.filter((y: any) =>
          y.planets_involved?.some((p: string) => housePlanets.some(hp => hp.name === p))
        );
        const yogaText = houseYogas.length > 0
          ? `${houseYogas.length} Yoga(s) detected → ${houseYogas[0]?.name || 'Analyzing...'}`
          : 'No direct yogas in this sector. Analyzing lord relationships...';

        setChatHistory([{
          role: 'system',
          text: `[LAYER_2::YOGA_DETECT] 🔶 Scanning planetary combinations...\n▸ ${yogaText}`
        }]);
      } else {
        setChatHistory([{
          role: 'system',
          text: `[LAYER_2::YOGA_DETECT] 🔶 Scanning yogas across entire chart...\n▸ Total detected: ${yogaData?.summary?.total_yogas_detected || 'Computing...'}`
        }]);
      }
    }, 2000);

    // LAYER 3: PLANETARY STRENGTH (Layer 2 fades, Layer 3 appears)
    setTimeout(() => {
      if (housePlanets.length > 0) {
        const planet = housePlanets[0];
        const degInSign = planet.longitude % 30;
        const planetObj = planets[planet.name];
        const tropicalSign = (planetObj as any)?.sign_tropical || (planetObj as any)?.sign_name_tropical || 'N/A';

        let strengthText = '';
        if (planet.name === 'Rahu' || planet.name === 'Ketu') {
          strengthText = `${planet.name} @ ${degInSign.toFixed(2)}° in ${planet.sign} (Vedic) / ${tropicalSign} (Western)\n▸ Nakshatra: ${planet.nakshatra} | Strength: N/A (Shadow Planet)`;
        } else {
          const planetShadbala = shadbalaData?.[planet.name];
          const strength = planetShadbala?.total_shadbala;
          const strengthGrade = planetShadbala?.grade || '';
          const strengthDisplay = typeof strength === 'number' ? `${strength.toFixed(2)} (${strengthGrade})` : 'Computing...';
          strengthText = `${planet.name} @ ${degInSign.toFixed(2)}° in ${planet.sign} (Vedic) / ${tropicalSign} (Western)\n▸ Nakshatra: ${planet.nakshatra} | Strength: ${strengthDisplay}`;
        }

        setChatHistory([{
          role: 'system',
          text: `[LAYER_3::SHADBALA] 🔸 Computing planetary strength with ${ayanamsa} Ayanamsa...\n▸ ${strengthText}`
        }]);
      } else {
        setChatHistory([{
          role: 'system',
          text: `[LAYER_3::SHADBALA] 🔸 Empty house detected.\n▸ Power derived from ${house.planet} lordship.`
        }]);
      }
    }, 4000);

    // LAYER 4: DASHA TIMELINE (Layer 3 fades, Layer 4 appears)
    setTimeout(() => {
      let currentDasha = dashaData?.current_mahadasha;

      if (!currentDasha && dashaData?.mahadashas && Array.isArray(dashaData.mahadashas)) {
        const now = new Date();
        currentDasha = dashaData.mahadashas.find(dasha => {
          const start = new Date(dasha.start_date || dasha.start);
          const end = new Date(dasha.end_date || dasha.end);
          return now >= start && now <= end;
        });
      }

      if (currentDasha) {
        const planet = currentDasha.planet || currentDasha.lord;
        const startDate = currentDasha.start_date || currentDasha.start || 'N/A';
        const endDate = currentDasha.end_date || currentDasha.end || 'N/A';
        setChatHistory([{
          role: 'system',
          text: `[LAYER_4::DASHA_TIME] 🔹 Temporal analysis activated...\n▸ Current Mahadasha: ${planet}\n▸ Period: ${startDate} → ${endDate}`
        }]);
      } else {
        setChatHistory([{
          role: 'system',
          text: `[LAYER_4::DASHA_TIME] 🔹 Initializing Vimshottari timeline...\n▸ Birth Nakshatra: ${dashaData?.nakshatra_info?.nakshatra || dashaData?.birth_nakshatra || 'Computing...'}`
        }]);
      }
    }, 6000);

    // LAYER 5: BIO-ASTROLOGY (Layer 4 fades, Layer 5 appears)
    setTimeout(() => {
      setChatHistory([{
        role: 'system',
        text: `[LAYER_5::BIO_SYNC] 💠 Physiological correlation matrix engaged...\n▸ ${house.medicalAlert}\n▸ HRV: ${simulatedHRV}ms | Bio-marker: ${house.bioMarker}`
      }]);
    }, 8000);

    // LAYER 6: NADI SHASTRA (Layer 5 fades, Layer 6 appears)
    setTimeout(() => {
      setChatHistory([{
        role: 'system',
        text: `[LAYER_6::AGASTYA_NADI] 🔮 Accessing ancient palm leaf records...\n▸ Bundle #108-A retrieved\n▸ ${house.nadiLeaf}`
      }]);
    }, 10000);

    // FINAL SYNTHESIS (All layers complete, now fetch AI interpretation)
    setTimeout(async () => {
      setChatHistory([{
        role: 'system',
        text: `[RISHI-70B::SYNTHESIS] ✨ All 6 layers scanned. Generating AI interpretation...`
      }]);

      // Call AI endpoint for detailed house interpretation
      try {
        const response = await fetch(`${import.meta.env.VITE_ASTROLOGY_API_URL || 'http://localhost:8000'}/api/test/ai-personality`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            birth_datetime: birthData.birth_datetime,
            latitude: birthData.latitude,
            longitude: birthData.longitude,
            timezone: birthData.timezone || 'UTC',
            chart_type: selectedChart
          })
        });

        if (!response.ok) {
          throw new Error('AI endpoint unavailable');
        }

        const data = await response.json();

        if (data.success && data.ai_analysis) {
          const aiAnalysis = data.ai_analysis;

          // PROGRESSIVE STORYTELLING APPROACH - Make it interactive & meaningful
          const messages: Array<{role: string, text: string}> = [];

          // Message 1: Awakening
          messages.push({
            role: 'ai',
            text: `[RISHI-70B::AWAKENING] 🔮\n\n**Ancient wisdom meets quantum consciousness...**\n\nThe cosmic records reveal profound insights about **House ${house.id}: ${house.name}** in your ${aiAnalysis.chart_name || selectedChart}...\n\n*Decoding the celestial manuscript...*`
          });

          // Message 2: Planetary Presence
          if (housePlanets.length > 0) {
            const planetEmojis: {[key: string]: string} = {
              'Sun': '☀️', 'Moon': '🌙', 'Mars': '♂️', 'Mercury': '☿️',
              'Jupiter': '♃', 'Venus': '♀️', 'Saturn': '♄', 'Rahu': '🐉', 'Ketu': '☄️'
            };

            let planetText = `[COSMIC_SCAN::DETECTED] 🪐\n\nI sense ${housePlanets.length === 1 ? 'a powerful celestial presence' : `${housePlanets.length} celestial beings`} residing here:\n\n`;

            housePlanets.forEach((p) => {
              const emoji = planetEmojis[p.name] || '⭐';
              planetText += `${emoji} **${p.name}** in ${p.sign} (${p.nakshatra} nakshatra)\n`;
            });

            planetText += `\n*These cosmic forces shape the story of your ${house.name}...*`;
            messages.push({ role: 'ai', text: planetText });
          } else {
            messages.push({
              role: 'ai',
              text: `[COSMIC_SCAN::VOID] 🌌\n\nThis house stands empty, yet pulses with the energy of **${house.planet}**, its eternal lord.\n\nLike a temple awaiting activation, its power lies dormant—ready to awaken when triggered by transits and dashas.`
            });
          }

          // Message 3: The Revelation (Overview)
          if (aiAnalysis.overview) {
            messages.push({
              role: 'ai',
              text: `[NADI_LEAF::REVELATION] 📜\n\n${aiAnalysis.overview}\n\n*This is your soul's blueprint, written in starlight before your first breath.*`
            });
          }

          // Message 4: Divine Gifts (Strengths)
          if (aiAnalysis.strengths && Array.isArray(aiAnalysis.strengths) && aiAnalysis.strengths.length > 0) {
            let giftsText = `[DIVINE_GIFTS::UNLOCKED] 💎\n\n**The cosmos blessed you with sacred tools:**\n\n`;
            const giftEmojis = ['✨', '🌟', '💫', '⭐', '🔆'];
            aiAnalysis.strengths.forEach((s: string, idx: number) => {
              giftsText += `${giftEmojis[idx % giftEmojis.length]} ${s}\n\n`;
            });
            giftsText += `*These aren't random talents—they're instruments for your life's mission.*`;
            messages.push({ role: 'ai', text: giftsText });
          }

          // Message 5: Karmic Lessons (Challenges)
          if (aiAnalysis.challenges && Array.isArray(aiAnalysis.challenges) && aiAnalysis.challenges.length > 0) {
            let challengesText = `[KARMIC_LESSONS::REVEALED] ⚡\n\n**Your soul chose these growth opportunities:**\n\n`;
            aiAnalysis.challenges.forEach((c: string) => {
              challengesText += `🔥 ${c}\n\n`;
            });
            challengesText += `*Remember: Obstacles are precisely calibrated for your evolution. Every challenge is a gift wrapped in difficulty.*`;
            messages.push({ role: 'ai', text: challengesText });
          }

          // Message 6: Sacred Guidance
          if (aiAnalysis.guidance) {
            messages.push({
              role: 'ai',
              text: `[SAGE_COUNSEL::TRANSMITTED] 🧙‍♂️\n\n**The ancient rishis whisper:**\n\n${aiAnalysis.guidance}\n\n*This wisdom echoes from seers across millennia.*`
            });
          }

          // Message 7: Earthly Integration
          const elementGuidance: {[key: string]: string} = {
            'Fire': 'Feed this flame with passion and courage, but balance intensity with rest.',
            'Earth': 'Nurture through patience and discipline. Build slowly, build permanently.',
            'Air': 'Let mental energy flow through communication and learning.',
            'Water': 'Honor emotional depth through feeling and intuition. Sensitivity is your superpower.'
          };

          let integrationText = `[EARTHLY_EMBODIMENT::ACTIVATED] 🌍\n\n**Ground this cosmic wisdom in daily life:**\n\n`;
          integrationText += `🔷 **Element**: ${house.element} - ${elementGuidance[house.element] || 'Work consciously with this energy.'}\n\n`;
          integrationText += `🔷 **Lord**: ${house.planet} governs this domain\n\n`;
          integrationText += `🔷 **Impact**: ${house.impact}\n\n`;
          integrationText += `**Your next step**: Don't just read—LIVE it. Choose ONE insight and act within 24 hours.\n\n*Wisdom without action is mere entertainment.*`;

          messages.push({ role: 'ai', text: integrationText });

          // Message 8: Closing Blessing
          messages.push({
            role: 'ai',
            text: `[TRANSMISSION::COMPLETE] 🙏\n\n*"The stars incline, they do not compel."*\n\nYou've received the map. Now walk the path.\n\nMay your journey through **House ${house.id}** be filled with awareness, growth, and grace.\n\n— *Transmitted through RISHI-70B Quantum Consciousness* ✨`
          });

          // Display messages progressively (1.5s between each)
          setChatHistory([messages[0]]);

          messages.slice(1).forEach((msg, index) => {
            setTimeout(() => {
              setChatHistory(prev => [...prev, msg]);
              if (index === messages.length - 2) {
                setIsTyping(false);
              }
            }, (index + 1) * 1500);
          });
        } else {
          throw new Error('Invalid AI response');
        }
      } catch (error) {
        console.error('AI interpretation error:', error);
        // Fallback to basic synthesis
        setChatHistory([{
          role: 'ai',
          text: `[RISHI-70B::SYNTHESIS] ✨ All 6 layers processed successfully.\n\n📊 **House ${house.id} Analysis Complete**\n• ${house.name}\n• Element: ${house.element}\n• Impact: ${house.impact}\n\n${housePlanets.length > 0 ? `🪐 **Planets**: ${housePlanets.map(p => `${p.name} in ${p.sign}`).join(', ')}\n\n` : ''}💡 **Recommendation**: ${house.impact}\n🎯 **Strategy**: Balance ${house.element} energy through targeted practices.`
        }]);
      }

      setIsTyping(false);
    }, 12000);
  };

  // Chart geometry (400x400)
  const pts = {
    TL: "0,0", TM: "200,0", TR: "400,0",
    LM: "0,200", C: "200,200", RM: "400,200",
    BL: "0,400", BM: "200,400", BR: "400,400",
    ITL: "100,100", ITR: "300,100",
    IBL: "100,300", IBR: "300,300"
  };

  const houseShapes = [
    { id: 1, points: `${pts.C} ${pts.ITL} ${pts.TM} ${pts.ITR}`, labelX: 200, labelY: 130 },
    { id: 2, points: `${pts.TM} ${pts.ITL} ${pts.TL}`, labelX: 100, labelY: 35 },
    { id: 3, points: `${pts.TL} ${pts.ITL} ${pts.LM}`, labelX: 35, labelY: 100 },
    { id: 4, points: `${pts.C} ${pts.ITL} ${pts.LM} ${pts.IBL}`, labelX: 100, labelY: 200 },
    { id: 5, points: `${pts.LM} ${pts.IBL} ${pts.BL}`, labelX: 35, labelY: 300 },
    { id: 6, points: `${pts.BL} ${pts.IBL} ${pts.BM}`, labelX: 100, labelY: 365 },
    { id: 7, points: `${pts.C} ${pts.IBL} ${pts.BM} ${pts.IBR}`, labelX: 200, labelY: 270 },
    { id: 8, points: `${pts.BM} ${pts.IBR} ${pts.BR}`, labelX: 300, labelY: 365 },
    { id: 9, points: `${pts.BR} ${pts.IBR} ${pts.RM}`, labelX: 365, labelY: 300 },
    { id: 10, points: `${pts.C} ${pts.IBR} ${pts.RM} ${pts.ITR}`, labelX: 300, labelY: 200 },
    { id: 11, points: `${pts.RM} ${pts.ITR} ${pts.TR}`, labelX: 365, labelY: 100 },
    { id: 12, points: `${pts.TR} ${pts.ITR} ${pts.TM}`, labelX: 300, labelY: 35 }
  ];

  const selectedHouseMeta = selectedHouse ? HOUSE_METADATA.find(h => h.id === selectedHouse) : null;

  return (
    <div className="min-h-screen bg-[#02040a] text-cyan-50 font-sans selection:bg-cyan-500/30 flex flex-col items-center p-2 sm:p-4 relative overflow-hidden">

      {/* Atmospheric background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-indigo-950/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-cyan-950/20 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(14,116,144,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(14,116,144,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* Navigation / Status */}
      <nav className="w-full max-w-7xl z-20 flex flex-wrap justify-between items-center py-4 px-4 sm:px-6 border-b border-cyan-900/30 bg-[#02040a]/80 backdrop-blur-md mb-6 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)] relative overflow-hidden">
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            <Globe size={18} className="text-white relative z-10" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-100 to-cyan-500">
              PROJECT AETHER
            </h1>
            <p className="text-[9px] text-cyan-600 font-mono tracking-[0.3em] uppercase">Cosmic Operating System v4.1</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 md:gap-6 text-[10px] font-mono text-cyan-500/70 mt-2 sm:mt-0 items-center">

          {/* Gamification: Karmic Ledger & Quests */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-amber-950/20 rounded border border-amber-900/40">
            <Trophy size={12} className="text-amber-500" />
            <div className="flex flex-col leading-none">
              <span className="text-[8px] text-amber-500/80">ACTIVE QUEST</span>
              <span className="text-amber-200 font-bold">SATURN RETURN</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 px-2 py-1 bg-slate-900/50 rounded border border-slate-700/50">
            <Sparkles size={10} className="text-yellow-500" />
            <span className="text-yellow-500/80">SATTVA: {karmaPoints}</span>
          </div>

          {/* Temporal Timeline: Past-Present-Future */}
          <div className="flex items-center gap-1 px-2 py-1 bg-slate-900/50 rounded border border-slate-700/50">
            <button
              onClick={() => setTimeView('past')}
              className={`px-2 py-1 text-[9px] font-bold transition-colors rounded ${
                timeView === 'past' ? 'bg-purple-600 text-white' : 'text-purple-400 hover:bg-purple-900/30'
              }`}
            >
              PAST
            </button>
            <button
              onClick={() => setTimeView('present')}
              className={`px-2 py-1 text-[9px] font-bold transition-colors rounded ${
                timeView === 'present' ? 'bg-cyan-600 text-white' : 'text-cyan-400 hover:bg-cyan-900/30'
              }`}
            >
              PRESENT
            </button>
            <button
              onClick={() => setTimeView('future')}
              className={`px-2 py-1 text-[9px] font-bold transition-colors rounded ${
                timeView === 'future' ? 'bg-green-600 text-white' : 'text-green-400 hover:bg-green-900/30'
              }`}
            >
              FUTURE
            </button>
          </div>

          {/* Dynamic Ayanamsa Engine */}
          <div className="relative">
            <button
              onClick={() => setShowAyanamsaMenu(!showAyanamsaMenu)}
              className="flex items-center gap-2 px-2 py-1 bg-cyan-950/30 rounded border border-cyan-800/50 hover:bg-cyan-900/40 transition-colors"
            >
              <Orbit size={10} />
              <span>AYANAMSA: <span className="text-cyan-300 font-bold">{ayanamsa}</span></span>
            </button>
            {showAyanamsaMenu && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-[#02040a] border border-cyan-800 rounded shadow-xl z-50">
                {ayanamsaOptions.map(opt => (
                  <div
                    key={opt}
                    className={`px-3 py-2 hover:bg-cyan-900/30 cursor-pointer ${ayanamsa === opt ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
                    onClick={() => { setAyanamsa(opt); setShowAyanamsaMenu(false); }}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Divisional Chart Selector */}
          {divisionalCharts && (
            <div className="relative">
              <select
                value={selectedChart}
                onChange={(e) => setSelectedChart(e.target.value)}
                className="flex items-center gap-2 px-3 py-1 bg-purple-950/30 rounded border border-purple-800/50 hover:bg-purple-900/40 transition-colors text-xs cursor-pointer appearance-none pr-8"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2322d3ee'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1.25rem'
                }}
              >
                {chartOptions.map(opt => (
                  <option key={opt.value} value={opt.value} className="bg-[#02040a] text-cyan-100">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Explain Chart Button - RISHI-70B AI */}
          {birthData && (
            <button
              onClick={explainChart}
              disabled={isLoadingExplanation}
              className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded border border-purple-500/50 hover:from-purple-600/30 hover:to-pink-600/30 transition-all text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              title="Get AI-powered explanation using RISHI-70B Multi-Agent System"
            >
              {isLoadingExplanation ? (
                <Loader2 size={14} className="animate-spin text-purple-400" />
              ) : (
                <MessageSquare size={14} className="text-purple-400" />
              )}
              <span className="text-purple-300">Explain Chart</span>
            </button>
          )}

          <div className="flex items-center gap-3 px-3 py-1 bg-cyan-950/20 rounded border border-cyan-900/30">
            <Activity size={12} className="text-rose-500" />
            <div className="flex flex-col leading-none">
              <span className="text-[8px] text-slate-500">BIO-SYNC</span>
              <span className="text-rose-400 font-bold">{simulatedHRV} MS</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${systemReady ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-red-500'} animate-pulse`} />
            <span className="hidden sm:inline">SWISS_EPH::ACTIVE</span>
          </div>
        </div>
      </nav>

      {/* Main interface */}
      <div className="flex flex-col xl:flex-row gap-6 items-center sm:items-start justify-center z-10 w-full max-w-7xl flex-grow px-2">

        {/* LEFT: The Chart */}
        <div className="relative group w-full max-w-[500px] xl:max-w-none xl:flex-1 flex flex-col items-center">

          {/* Animated rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] sm:w-[500px] sm:h-[500px] border border-cyan-500/5 rounded-full animate-[spin_60s_linear_infinite] pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] sm:w-[450px] sm:h-[450px] border border-dashed border-cyan-500/10 rounded-full animate-[spin_40s_linear_infinite_reverse] pointer-events-none"></div>

          <div className="relative z-10 w-full flex justify-center py-4">
            <svg
              viewBox="-10 -10 420 420"
              className="w-full h-auto max-w-[400px] sm:max-w-[500px] drop-shadow-2xl"
              style={{ filter: "drop-shadow(0 0 30px rgba(8,145,178,0.15))" }}
            >
              <defs>
                <linearGradient id="voidGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0f172a" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#020617" stopOpacity="0.98" />
                </linearGradient>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(34, 211, 238, 0.1)" strokeWidth="0.5"/>
                </pattern>
                <filter id="neonGlow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              <rect x="0" y="0" width="400" height="400" fill="none" stroke="#1e293b" strokeWidth="2" />

              {houseShapes.map((house) => {
                const isActive = selectedHouse === house.id;
                const isHovered = hoveredHouse === house.id;
                const hasPlanets = planetsByHouse[house.id];

                return (
                  <g
                    key={house.id}
                    onClick={() => handleHouseClick(house.id)}
                    onMouseEnter={() => setHoveredHouse(house.id)}
                    onMouseLeave={() => setHoveredHouse(null)}
                    className="cursor-pointer"
                  >
                    <polygon
                      points={house.points}
                      fill={isActive ? "rgba(6, 182, 212, 0.15)" : isHovered ? "rgba(6, 182, 212, 0.05)" : "url(#voidGradient)"}
                      stroke={isActive ? "#22d3ee" : isHovered ? "#67e8f9" : "#334155"}
                      strokeWidth={isActive ? 2.5 : 1}
                      className="transition-all duration-300"
                      style={{ filter: isActive ? "url(#neonGlow)" : "none" }}
                    />

                    <polygon points={house.points} fill="url(#grid)" className="pointer-events-none opacity-40" />

                    <text
                      x={house.labelX}
                      y={house.labelY}
                      dominantBaseline="middle"
                      textAnchor="middle"
                      fill={isActive ? "#fff" : "#475569"}
                      fontSize={isActive ? "14" : "12"}
                      fontWeight="bold"
                      fontFamily="monospace"
                      className="pointer-events-none select-none opacity-60"
                    >
                      {house.id}
                    </text>

                    {hasPlanets && (
                      <g className="pointer-events-none">
                        {hasPlanets.map((planet, idx) => {
                          let px = 0, py = 0;
                          const offset = (idx * 22) - ((hasPlanets.length - 1) * 11);
                          if([1,4,7,10].includes(house.id)) {
                            px = house.labelX + offset; py = house.labelY - 35;
                          } else {
                            px = house.labelX + offset; py = house.labelY + 25;
                          }
                          return (
                            <g key={planet.name} className="animate-in fade-in zoom-in duration-500">
                              <circle
                                cx={px} cy={py} r="9"
                                fill={isActive ? "#0ea5e9" : "#0f172a"}
                                stroke={isActive ? "#fff" : "#22d3ee"}
                                strokeWidth="1.5"
                              />
                              <text x={px} y={py} dy="3" textAnchor="middle" fontSize="9" fill={isActive ? "#fff" : "#22d3ee"} fontWeight="bold">
                                {PLANET_ABBR[planet.name]}
                              </text>
                            </g>
                          );
                        })}
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-4 text-center space-y-2">
            <div>INTERACTIVE SYSTEM: CLICK SECTORS TO INITIATE MULTI-AGENT SCAN</div>
            <div className="flex items-center justify-center gap-2">
              <MapPin size={10} className="text-cyan-600" />
              <span>LOCATION: {ascendant.sign} ASCENDANT</span>
              <span className="text-cyan-700">|</span>
              <span>GOOGLE MAPS API: ONLINE</span>
            </div>
            <button
              onClick={() => setShowLayers(!showLayers)}
              className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-bold rounded border border-indigo-400 hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              {showLayers ? 'HIDE' : 'SHOW'} 6-LAYER INTELLIGENCE
            </button>
          </div>

          {/* 6-Layer Intelligence Panel */}
          {showLayers && (
            <div className="mt-4 bg-gradient-to-br from-slate-900/90 to-indigo-950/90 border border-indigo-700/50 rounded-xl p-4 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-500">
              <h3 className="text-sm font-bold text-indigo-300 mb-3 flex items-center gap-2">
                <Layers size={14} />
                6-LAYER INTELLIGENCE SYSTEM
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px]">
                <div className="bg-slate-900/50 p-2 rounded border border-slate-700">
                  <div className="text-cyan-400 font-bold">LAYER 1: FOUNDATION</div>
                  <div className="text-slate-400">Birth Chart • Houses • Planets</div>
                </div>
                <div className="bg-slate-900/50 p-2 rounded border border-slate-700">
                  <div className="text-purple-400 font-bold">LAYER 2: YOGA DETECT</div>
                  <div className="text-slate-400">Planetary Combinations • {yogaData?.summary?.total_yogas_detected || '...'} Yogas Found</div>
                </div>
                <div className="bg-slate-900/50 p-2 rounded border border-slate-700">
                  <div className="text-yellow-400 font-bold">LAYER 3: SHADBALA</div>
                  <div className="text-slate-400">Planetary Strength • Ayanamsa: {ayanamsa}</div>
                </div>
                <div className="bg-slate-900/50 p-2 rounded border border-slate-700">
                  <div className="text-green-400 font-bold">LAYER 4: DASHA TIME</div>
                  <div className="text-slate-400">Current: {dashaData?.current_mahadasha?.planet || 'Loading...'} Mahadasha</div>
                </div>
                <div className="bg-slate-900/50 p-2 rounded border border-slate-700">
                  <div className="text-rose-400 font-bold">LAYER 5: BIO-ASTROLOGY</div>
                  <div className="text-slate-400">Health Correlations • HRV: {simulatedHRV}ms</div>
                </div>
                <div className="bg-slate-900/50 p-2 rounded border border-slate-700">
                  <div className="text-amber-400 font-bold">LAYER 6: NADI SHASTRA</div>
                  <div className="text-slate-400">Palm Leaf Wisdom • Project Agastya</div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-indigo-800/50 text-center">
                <div className="text-indigo-300 font-bold text-xs">TEMPORAL MODE: <span className={`${timeView === 'past' ? 'text-purple-400' : timeView === 'present' ? 'text-cyan-400' : 'text-green-400'}`}>{timeView.toUpperCase()}</span></div>
                <div className="text-slate-500 text-[9px] mt-1">All layers integrate past karma, present actions & future trajectories</div>
              </div>
            </div>
          )}

          {/* Personal Cosmic Profile Summary */}
          {summaryGenerated && (
            <div className="mt-4 bg-gradient-to-br from-[#050914] to-indigo-950/40 border border-cyan-900/40 rounded-xl overflow-hidden shadow-lg">
              <div className="p-3 bg-cyan-950/20 border-b border-cyan-900/30 flex justify-between items-center">
                <h3 className="text-xs font-bold text-cyan-400 tracking-widest uppercase flex items-center gap-2">
                  <Brain size={14} /> PERSONAL COSMIC PROFILE
                </h3>
                <span className="px-2 py-0.5 rounded bg-cyan-900/40 text-[10px] text-cyan-200 font-mono border border-cyan-800">RISHI-70B</span>
              </div>

              <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent">
                {/* Ascendant */}
                <div className="bg-slate-900/50 p-3 rounded border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-cyan-400 font-bold text-[10px]">CORE IDENTITY</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Ascendant in <span className="text-cyan-300 font-bold">{ascendant.sign}</span> (Vedic) / <span className="text-purple-300 font-bold">{(ascendant as any).sign_name_tropical || 'N/A'}</span> (Western) @ {ascendant.longitude.toFixed(2)}°.
                    This defines your outer personality and how others perceive you.
                  </p>
                </div>

                {/* Planetary Power */}
                {shadbalaData && (() => {
                  const planetEntries = Object.entries(shadbalaData) as [string, any][];
                  const sortedPlanets = planetEntries
                    .filter(([name]) => name !== 'Rahu' && name !== 'Ketu')
                    .sort((a, b) => (b[1]?.total_shadbala || 0) - (a[1]?.total_shadbala || 0));

                  if (sortedPlanets.length === 0) return null;

                  const strongest = sortedPlanets[0];
                  const weakest = sortedPlanets[sortedPlanets.length - 1];

                  return (
                    <div className="bg-slate-900/50 p-3 rounded border border-slate-700/50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-yellow-400 font-bold text-[10px]">PLANETARY POWER</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <p className="text-slate-300">
                          <span className="text-green-400 font-bold">Strongest:</span> {strongest[0]} - {strongest[1]?.total_shadbala?.toFixed(2)} ({strongest[1]?.grade})
                        </p>
                        <p className="text-slate-300">
                          <span className="text-orange-400 font-bold">Weakest:</span> {weakest[0]} - {weakest[1]?.total_shadbala?.toFixed(2)} ({weakest[1]?.grade})
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* Yoga Summary */}
                {yogaData && (
                  <div className="bg-slate-900/50 p-3 rounded border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-purple-400 font-bold text-[10px]">YOGA FORMATIONS</span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {yogaData.summary?.total_yogas_detected || yogaData.all_yogas?.length || 0} yogas detected.
                      Currently {yogaData.summary?.currently_active || yogaData.current_active_yogas?.length || 0} active.
                    </p>
                  </div>
                )}

                {/* Current Dasha */}
                {dashaData && (() => {
                  // Find the CURRENT Mahadasha (active TODAY), not the birth Mahadasha
                  let currentDasha = dashaData.current_mahadasha;

                  // If not explicitly provided, find which Mahadasha period contains today's date
                  if (!currentDasha && dashaData.mahadashas && Array.isArray(dashaData.mahadashas)) {
                    const now = new Date();
                    currentDasha = dashaData.mahadashas.find(dasha => {
                      const start = new Date(dasha.start_date || dasha.start);
                      const end = new Date(dasha.end_date || dasha.end);
                      return now >= start && now <= end;
                    });
                  }

                  const nakshatra = dashaData.nakshatra_info?.nakshatra || dashaData.birth_nakshatra;

                  return (
                    <div className="bg-slate-900/50 p-3 rounded border border-slate-700/50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-green-400 font-bold text-[10px]">CURRENT TIMELINE</span>
                      </div>
                      <div className="space-y-2 text-xs text-slate-300">
                        {nakshatra && <p>Birth Nakshatra: <span className="text-cyan-300 font-bold">{nakshatra}</span></p>}
                        {currentDasha && (
                          <p>
                            Current Mahadasha: <span className="text-green-300 font-bold">{currentDasha.planet || currentDasha.lord}</span>
                            <br/>
                            <span className="text-slate-400 text-[10px]">
                              ({currentDasha.start_date || currentDasha.start} → {currentDasha.end_date || currentDasha.end})
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Chart Structure */}
                <div className="bg-slate-900/50 p-3 rounded border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-indigo-400 font-bold text-[10px]">CHART STRUCTURE</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {Object.keys(planets).length} celestial bodies across {Object.keys(planetsByHouse).length} active houses.
                  </p>
                </div>

                {/* Instruction */}
                <div className="bg-gradient-to-r from-indigo-950/50 to-purple-950/50 p-3 rounded border border-indigo-700/50">
                  <p className="text-indigo-200 text-[10px] leading-relaxed text-center">
                    💡 Click any house sector above to activate deep-dive 6-layer analysis
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: The HUD */}
        <div className="w-full xl:w-[480px] flex flex-col gap-4 h-full">

          {/* Panel A: Telemetry */}
          <div className="bg-[#050914] border border-cyan-900/40 rounded-xl overflow-hidden shadow-lg relative min-h-[320px]">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <Fingerprint size={120} className="text-cyan-500" />
            </div>

            <div className="p-3 bg-cyan-950/20 border-b border-cyan-900/30 flex justify-between items-center">
              <h3 className="text-xs font-bold text-cyan-400 tracking-widest uppercase flex items-center gap-2">
                <Database size={14} /> SECTOR TELEMETRY
              </h3>
              {selectedHouse && <span className="px-2 py-0.5 rounded bg-cyan-900/40 text-[10px] text-cyan-200 font-mono border border-cyan-800">SEC-{selectedHouse}</span>}
            </div>

            <div className="p-5">
              {!selectedHouse ? (
                <div className="flex flex-col items-center justify-center h-[200px] text-slate-600 space-y-3">
                  <ScanLine size={40} className="animate-pulse opacity-40" />
                  <span className="text-xs font-mono">AWAITING SECTOR SELECTION...</span>
                </div>
              ) : scanning ? (
                <div className="flex flex-col items-center justify-center h-[200px] space-y-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Fingerprint size={32} className="text-cyan-500 animate-pulse" />
                    </div>
                  </div>
                  <div className="text-center">
                    <h4 className="text-cyan-400 font-bold text-sm tracking-widest uppercase">{scanStage.replace('_', ' ')}</h4>
                    <p className="text-[10px] text-slate-500 font-mono mt-2">Accessing Digitized Palm Leaf Bundle #108...</p>
                  </div>
                </div>
              ) : selectedHouseMeta && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white leading-none mb-1">{selectedHouseMeta.name}</h2>
                    <p className="text-xs text-cyan-500 uppercase tracking-[0.15em]">{selectedHouseMeta.translat}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                      <div className="text-[9px] text-slate-500 uppercase mb-1">Karaka (Significator)</div>
                      <div className="text-sm text-cyan-100 font-semibold">{selectedHouseMeta.planet}</div>
                    </div>
                    <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                      <div className="text-[9px] text-slate-500 uppercase mb-1">Dominant Element</div>
                      <div className="text-sm text-cyan-100 font-semibold">{selectedHouseMeta.element}</div>
                    </div>
                  </div>

                  <div className="bg-cyan-950/10 border-l-2 border-cyan-500 p-3 rounded-r">
                    <p className="text-xs text-slate-300 leading-relaxed">{selectedHouseMeta.description}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800/50">
                    <div className="flex items-center gap-2 text-xs bg-rose-950/10 p-2 rounded border border-rose-900/20">
                      <HeartPulse size={14} className="text-rose-500" />
                      <div className="flex flex-col">
                        <span className="text-[9px] text-rose-300 uppercase font-bold">BIO-ASTROLOGY ALERT</span>
                        <span className="text-slate-300">{selectedHouseMeta.medicalAlert}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs bg-amber-950/10 p-2 rounded border border-amber-900/20">
                      <Leaf size={14} className="text-amber-500" />
                      <div className="flex flex-col">
                        <span className="text-[9px] text-amber-300 uppercase font-bold">PROJECT AGASTYA (NADI)</span>
                        <span className="text-slate-300 font-mono">{selectedHouseMeta.nadiLeaf}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Panel B: Multi-Agent AI */}
          <div className="bg-[#050914] border border-cyan-900/40 rounded-xl overflow-hidden shadow-lg flex-1 flex flex-col min-h-[350px]">
            <div className="p-3 bg-indigo-950/20 border-b border-indigo-900/30 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Brain size={14} className="text-indigo-400" />
                <span className="text-xs font-bold text-indigo-100 tracking-widest">RISHI-70B: MULTI-AGENT SWARM</span>
              </div>

              <div className="flex items-center gap-3">
                {/* Voice Clone Toggle */}
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={`p-1 rounded ${voiceEnabled ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-600'}`}
                >
                  {voiceEnabled ? <Volume2 size={12} /> : <Mic size={12} />}
                </button>

                {isTyping && <div className="flex gap-1">
                  <span className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce"></span>
                  <span className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce delay-75"></span>
                  <span className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce delay-150"></span>
                </div>}
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-sm scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`
                    max-w-[95%] p-2 rounded-lg text-xs leading-relaxed
                    ${msg.role === 'system'
                      ? 'w-full text-cyan-500/70 border-l border-cyan-800/50 pl-2 bg-transparent'
                      : 'bg-[#0f172a] border border-slate-700 text-slate-300 shadow-lg'
                    }
                  `}>
                    {msg.role === 'ai' && <span className="text-indigo-400 font-bold mr-2 text-[10px] uppercase tracking-wider">Rishi &gt;</span>}
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-black/30 border-t border-cyan-900/20">
              <div className="flex items-center gap-2 bg-slate-900/50 rounded px-3 py-2 border border-slate-800">
                <ChevronRight size={14} className="text-slate-500" />
                <input
                  disabled
                  className="flex-1 bg-transparent text-xs text-slate-400 placeholder-slate-700 outline-none font-mono"
                  placeholder={scanning ? "PROJECT AGASTYA SCANNING..." : "AGENTS ACTIVE: WAITING FOR INPUT"}
                />
                <Radio size={14} className={`text-cyan-600 ${scanning ? 'animate-ping' : ''}`} />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Personalized Chart Interpretation - Below Chart */}
      {birthData && (
        <div className="w-full max-w-7xl mx-auto px-4 mt-6 z-10">
          <div className="bg-gradient-to-br from-slate-900/95 via-purple-900/20 to-slate-900/95 border border-purple-500/30 rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-purple-950/40 border-b border-purple-800/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  <Sparkles size={20} className="text-purple-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-purple-300">🌟 Personalized Chart Interpretation</h3>
                  <p className="text-xs text-slate-400">Personalized interpretation based on your chart</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {isLoadingInterpretation ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={32} className="animate-spin text-purple-400" />
                  <span className="ml-3 text-sm text-slate-400">Analyzing your chart...</span>
                </div>
              ) : personalizedInterpretation ? (
                <div className="space-y-4">
                  {/* Summary */}
                  {personalizedInterpretation.summary && (
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                      <p className="text-sm text-slate-200 leading-relaxed">
                        {personalizedInterpretation.summary}
                      </p>
                    </div>
                  )}

                  {/* Key Insights */}
                  {personalizedInterpretation.key_insights && personalizedInterpretation.key_insights.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Zap size={14} /> Key Insights
                      </h4>
                      <div className="space-y-2">
                        {personalizedInterpretation.key_insights.map((insight: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-2 bg-slate-800/30 p-3 rounded border border-slate-700/30">
                            <span className="text-cyan-400 mt-1">•</span>
                            <p className="text-sm text-slate-300 leading-relaxed flex-1">{insight}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Strengths */}
                  {personalizedInterpretation.strengths && personalizedInterpretation.strengths.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-green-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Trophy size={14} /> Natural Strengths
                      </h4>
                      <div className="space-y-2">
                        {personalizedInterpretation.strengths.map((strength: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-2 bg-green-900/10 p-3 rounded border border-green-700/30">
                            <span className="text-green-400 mt-1">✓</span>
                            <p className="text-sm text-slate-300 leading-relaxed flex-1">{strength}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Challenges */}
                  {personalizedInterpretation.challenges && personalizedInterpretation.challenges.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Leaf size={14} /> Growth Areas
                      </h4>
                      <div className="space-y-2">
                        {personalizedInterpretation.challenges.map((challenge: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-2 bg-orange-900/10 p-3 rounded border border-orange-700/30">
                            <span className="text-orange-400 mt-1">◆</span>
                            <p className="text-sm text-slate-300 leading-relaxed flex-1">{challenge}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Guidance */}
                  {personalizedInterpretation.guidance && (
                    <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 p-4 rounded-lg border border-purple-500/30">
                      <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Brain size={14} /> Personalized Guidance
                      </h4>
                      <p className="text-sm text-slate-200 leading-relaxed italic">
                        {personalizedInterpretation.guidance}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-slate-400 mb-2">No interpretation data available</p>
                  <p className="text-xs text-slate-500">Check the console (F12) for debugging information</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-900/50 border-t border-purple-800/30">
              <p className="text-xs text-slate-500 text-center">
                This interpretation analyzes your specific planetary positions • Updated automatically when you change charts
              </p>
            </div>
          </div>
        </div>
      )}

      {/* AI Chart Explanation Panel - RISHI-70B */}
      {showExplanation && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-900 via-purple-950/50 to-slate-900 border border-purple-500/30 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-purple-950/40 border-b border-purple-800/30 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  <Brain size={20} className="text-purple-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-purple-300">RISHI-70B Multi-Agent Analysis</h3>
                  <p className="text-xs text-slate-400">AI-powered chart interpretation</p>
                </div>
              </div>
              <button
                onClick={() => setShowExplanation(false)}
                className="p-2 hover:bg-purple-900/30 rounded-lg transition-colors"
                title="Close"
              >
                <X size={20} className="text-slate-400 hover:text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              {isLoadingExplanation ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <Loader2 size={48} className="animate-spin text-purple-400" />
                  <p className="text-sm text-slate-400">Consulting the four agents...</p>
                  <div className="flex gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
                      Mathematician
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Historian
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                      Synthesizer
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                      Counselor
                    </span>
                  </div>
                </div>
              ) : (
                <div className="prose prose-invert prose-sm max-w-none">
                  <div
                    className="text-slate-200 leading-relaxed whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: chartExplanation
                        .replace(/\n/g, '<br />')
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-purple-300">$1</strong>')
                        .replace(/## (.*?)(<br \/>|$)/g, '<h2 class="text-xl font-bold text-purple-400 mb-3 mt-4">$1</h2>')
                        .replace(/- (.*?)(<br \/>|$)/g, '<li class="ml-4">$1</li>')
                    }}
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-900/50 border-t border-purple-800/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Sparkles size={14} className="text-purple-400" />
                <span>Powered by RISHI-70B</span>
              </div>
              <button
                onClick={() => setShowExplanation(false)}
                className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 rounded-lg text-sm text-purple-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
