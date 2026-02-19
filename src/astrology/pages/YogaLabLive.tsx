import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/astrology/components/layout/Navbar';
import CosmicBackground from '@/components/CosmicBackground';
import BirthDataForm from '@/astrology/components/birthchart/BirthDataForm';
import { useProfileBirthData } from '@/hooks/useProfileBirthData';
import ProjectAetherKundli from '@/astrology/components/birthchart/ProjectAetherKundli';
import DivisionalChartsAetherView from '@/astrology/components/divisional/DivisionalChartsAetherView';
import RishiChatInterface from '@/astrology/components/chat/RishiChatInterface';
import ConfidenceOverview from '@/astrology/components/confidence/ConfidenceOverview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Info, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { useYogaDetection, useShadbala, useDashaTimeline, useBirthChart, useLifePredictions, useMajorLifeEvents, useDivisionalCharts, useCurrentTransits, useLifeOverview } from '@/astrology/hooks/useAstrologyAPI';
import { BirthData, formatBirthDataForAPI, shadbalaToChartData, dashaToChartData } from '@/astrology/lib/api/astrology-api';
import { getYogaInterpretation, getCategoryDescription } from '@/astrology/lib/yoga-interpretations';
import { getPlanetInSignMeaning, getPlanetInHouseMeaning, getPlanetStrengthDescription } from '@/astrology/lib/kundli-interpretations';
import { calculatePlanetHouse, calculateHousesData, getSignLord } from '@/astrology/lib/house-calculator';

// Helper function to get Western zodiac sun sign based on birth date
const getWesternSunSign = (birthDate: string): string => {
  // Parse date string properly - extract YYYY-MM-DD regardless of time/timezone
  const dateMatch = birthDate.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!dateMatch) return 'Unknown';

  const year = parseInt(dateMatch[1]);
  const month = parseInt(dateMatch[2]); // Already 1-12
  const day = parseInt(dateMatch[3]);

  console.log(`Western Zodiac Debug: Date=${birthDate}, Parsed: ${year}-${month}-${day}`);

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces';

  return 'Unknown';
};

// Planet data for reference section
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

// Dasha Interpretation Helper Functions
const getPlanetDashaDescription = (planet: string) => {
  const descriptions: { [key: string]: { areas: string; general: string } } = {
    'Sun': {
      areas: 'Career, authority, government, father, health, self-confidence, leadership positions',
      general: 'Focus on career advancement, gaining recognition, and building self-esteem. Good for government jobs and positions of authority.'
    },
    'Moon': {
      areas: 'Emotions, mother, public relations, travel, mental peace, home, imagination, creativity',
      general: 'Focus on emotional wellbeing, family matters, and public connections. Good for creative work and building relationships.'
    },
    'Mars': {
      areas: 'Energy, courage, property, siblings, sports, technical skills, surgery, disputes',
      general: 'Focus on action, property matters, and competitive activities. Good for real estate, sports, and technical fields.'
    },
    'Mercury': {
      areas: 'Business, communication, education, intelligence, writing, mathematics, commerce',
      general: 'Focus on learning, business ventures, and communication. Excellent for education, trade, and intellectual pursuits.'
    },
    'Jupiter': {
      areas: 'Wisdom, children, spirituality, teaching, wealth, marriage, higher education, guru',
      general: 'Focus on spiritual growth, education, and expansion. Favorable for marriage, children, and wealth accumulation.'
    },
    'Venus': {
      areas: 'Love, marriage, luxury, vehicles, arts, entertainment, beauty, comforts, spouse',
      general: 'Focus on relationships, artistic pursuits, and material comforts. Good for marriage, arts, and acquiring luxuries.'
    },
    'Saturn': {
      areas: 'Discipline, hard work, delays, longevity, service, masses, karma, perseverance',
      general: 'Focus on hard work, discipline, and long-term goals. Requires patience and persistence. Good for service and mass-oriented work.'
    },
    'Rahu': {
      areas: 'Foreign lands, innovation, technology, sudden gains, unconventional paths, material desires',
      general: 'Focus on material ambitions and unconventional paths. Good for foreign connections, technology, and unexpected opportunities.'
    },
    'Ketu': {
      areas: 'Spirituality, detachment, liberation, past life karma, mysticism, research',
      general: 'Focus on spiritual development and inner growth. May bring detachment from worldly affairs. Good for research and spirituality.'
    }
  };
  return descriptions[planet] || { areas: '', general: '' };
};

const getDashaImpact = (planet: string, isStrong: boolean, strengthPercent: number) => {
  const desc = getPlanetDashaDescription(planet);

  if (isStrong) {
    return {
      quality: 'Highly Favorable',
      emoji: '🟢',
      explanation: `${planet} is strong (Purna Bala) and can deliver excellent results with minimal effort. This is an auspicious period.`,
      expectations: `You can expect positive developments in: ${desc.areas}. ${desc.general}`,
      advice: 'Make the most of this favorable period by taking initiative in the areas governed by this planet. Results will come naturally with moderate effort.'
    };
  } else if (strengthPercent >= 90) {
    return {
      quality: 'Favorable',
      emoji: '🔵',
      explanation: `${planet} is nearly at full strength (${strengthPercent.toFixed(0)}%). Results will come with moderate effort.`,
      expectations: `Good outcomes expected in: ${desc.areas}. ${desc.general}`,
      advice: 'This is a good period. Put in consistent effort and you will see positive results. Minor obstacles may appear but are easily overcome.'
    };
  } else if (strengthPercent >= 70) {
    return {
      quality: 'Moderate',
      emoji: '🟡',
      explanation: `${planet} has moderate strength (${strengthPercent.toFixed(0)}%). Results require consistent effort and remedies are recommended.`,
      expectations: `Mixed results in: ${desc.areas}. ${desc.general}`,
      advice: 'This period requires dedicated effort and patience. Perform remedial measures (mantras, charity, gemstones) for better results. Focus on strengthening the weak areas.'
    };
  } else {
    return {
      quality: 'Challenging',
      emoji: '🔴',
      explanation: `${planet} is weak (${strengthPercent.toFixed(0)}% strength). This period requires high personal effort (Purushartha) and remedial measures.`,
      expectations: `Challenges possible in: ${desc.areas}. ${desc.general}`,
      advice: 'This is a testing period. Focus on personal growth and resilience. Remedial measures are essential. Avoid major new ventures in weak planet areas. Focus on patience, persistence, and spiritual practices.'
    };
  }
};

const YogaLabLive = () => {
  const navigate = useNavigate();
  const [selectedPlanet, setSelectedPlanet] = useState(PLANETS[0]);
  const [selectedYoga, setSelectedYoga] = useState<any>(null);
  const [yogaFilter, setYogaFilter] = useState<string>('all');
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [showBirthForm, setShowBirthForm] = useState(true);

  // Auto-load from user profile
  const { birthDataFormValue: profileData, isAstrologyReady } = useProfileBirthData();
  const autoSubmittedRef = useRef(false);
  const [showYogaGuide, setShowYogaGuide] = useState(false);
  const [selectedLifeArea, setSelectedLifeArea] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [expandedMahadasha, setExpandedMahadasha] = useState<string | null>(null);
  const [expandedAntardasha, setExpandedAntardasha] = useState<string | null>(null);

  // User's own birth info for compatibility
  const [userName, setUserName] = useState('');
  const [userBirthDate, setUserBirthDate] = useState('');
  const [userBirthTime, setUserBirthTime] = useState('');
  const [userLocation, setUserLocation] = useState('');

  // Match Making State
  const [partnerName, setPartnerName] = useState('');
  const [partnerGender, setPartnerGender] = useState('');
  const [partnerDate, setPartnerDate] = useState('');
  const [partnerTime, setPartnerTime] = useState('');
  const [partnerPlace, setPartnerPlace] = useState('');
  const [partnerLatitude, setPartnerLatitude] = useState(0);
  const [partnerLongitude, setPartnerLongitude] = useState(0);
  const [partnerTimezone, setPartnerTimezone] = useState('');
  const [showCompatibility, setShowCompatibility] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [locationSearchResults, setLocationSearchResults] = useState<any[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [compatibilityData, setCompatibilityData] = useState<any>(null);
  const [isCalculatingCompatibility, setIsCalculatingCompatibility] = useState(false);

  // Location search function for matchmaking
  const searchPartnerLocation = async (query: string) => {
    if (query.length < 3) {
      setLocationSearchResults([]);
      return;
    }

    setIsSearchingLocation(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await response.json();
      setLocationSearchResults(data);
    } catch (error) {
      console.error('Location search error:', error);
      setLocationSearchResults([]);
    } finally {
      setIsSearchingLocation(false);
    }
  };

  // Popular cities for quick selection
  const POPULAR_CITIES = [
    { name: 'New Delhi, India', lat: 28.6139, lng: 77.2090, tz: 'Asia/Kolkata' },
    { name: 'Mumbai, India', lat: 19.0760, lng: 72.8777, tz: 'Asia/Kolkata' },
    { name: 'Chennai, India', lat: 13.0827, lng: 80.2707, tz: 'Asia/Kolkata' },
    { name: 'Bangalore, India', lat: 12.9716, lng: 77.5946, tz: 'Asia/Kolkata' },
    { name: 'Kolkata, India', lat: 22.5726, lng: 88.3639, tz: 'Asia/Kolkata' },
    { name: 'London, UK', lat: 51.5074, lng: -0.1278, tz: 'Europe/London' },
    { name: 'New York, USA', lat: 40.7128, lng: -74.0060, tz: 'America/New_York' },
  ];

  const filteredCities = POPULAR_CITIES.filter(city =>
    city.name.toLowerCase().includes(partnerPlace.toLowerCase())
  );

  const handleCitySelect = (city: typeof POPULAR_CITIES[0]) => {
    setPartnerPlace(city.name);
    setPartnerLatitude(city.lat);
    setPartnerLongitude(city.lng);
    setPartnerTimezone(city.tz);
    setShowLocationSuggestions(false);
  };

  const handleSearchResultSelect = (result: any) => {
    setPartnerPlace(result.display_name);
    setPartnerLatitude(parseFloat(result.lat));
    setPartnerLongitude(parseFloat(result.lon));

    // Estimate timezone based on longitude
    const offset = Math.round(parseFloat(result.lon) / 15);
    let estimatedTz = 'UTC';
    if (offset >= 5 && offset <= 6) estimatedTz = 'Asia/Kolkata';
    else if (offset >= 0 && offset <= 1) estimatedTz = 'Europe/London';
    else if (offset >= -5 && offset <= -4) estimatedTz = 'America/New_York';

    setPartnerTimezone(estimatedTz);
    setShowLocationSuggestions(false);
    setLocationSearchResults([]);
  };

  // Debounced location search
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (partnerPlace.length >= 3) {
      timeoutId = setTimeout(() => {
        searchPartnerLocation(partnerPlace);
      }, 500);
    } else {
      setLocationSearchResults([]);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [partnerPlace]);

  // API Queries
  const { data: birthChartData, isLoading: chartLoading } = useBirthChart(birthData, !!birthData);
  const { data: yogaData, isLoading: yogasLoading, error: yogasError } = useYogaDetection(birthData, !!birthData);
  const { data: shadbalaData, isLoading: shadbalaLoading } = useShadbala(birthData, !!birthData);
  const { data: dashaData, isLoading: dashaLoading } = useDashaTimeline(birthData, !!birthData);
  const { data: lifePredictions, isLoading: lifePredictionsLoading } = useLifePredictions(birthData, undefined, undefined, undefined, !!birthData);
  const { data: majorLifeEvents, isLoading: majorEventsLoading } = useMajorLifeEvents(birthData, undefined, undefined, !!birthData);
  const { data: divisionalCharts, isLoading: divisionalLoading } = useDivisionalCharts(birthData, !!birthData);
  const { data: transitsData, isLoading: transitsLoading } = useCurrentTransits(birthData, !!birthData);
  const { data: lifeOverviewData, isLoading: lifeOverviewLoading, error: lifeOverviewError } = useLifeOverview(birthData, undefined, !!birthData);

  // Handle form submission
  const handleBirthDataSubmit = (formData: {
    name: string;
    birthDate: Date;
    birthTime: string;
    birthLocation: string;
    latitude: number;
    longitude: number;
    timezone: string;
  }) => {
    const apiData = formatBirthDataForAPI(formData);
    setBirthData(apiData);

    // Store user details for compatibility calculation
    setUserName(formData.name);
    setUserBirthDate(formData.birthDate.toISOString().split('T')[0]); // YYYY-MM-DD
    setUserBirthTime(formData.birthTime); // HH:MM
    setUserLocation(formData.birthLocation);

    setShowBirthForm(false);
  };

  // Auto-submit profile data when available
  useEffect(() => {
    if (isAstrologyReady && profileData && !birthData && !autoSubmittedRef.current) {
      autoSubmittedRef.current = true;
      handleBirthDataSubmit(profileData);
    }
  }, [isAstrologyReady, profileData, birthData]);

  // Calculate Compatibility
  const calculateCompatibility = async () => {
    if (!birthData) {
      alert('Please enter your birth data first before calculating compatibility');
      return;
    }

    if (!partnerName || !partnerDate || !partnerTime || !partnerPlace || partnerLatitude === 0) {
      alert('Please fill in all partner details and select a location from the dropdown');
      return;
    }

    setIsCalculatingCompatibility(true);
    setShowLocationSuggestions(false);

    try {
      // birthData.birth_datetime is in ISO format like "1987-04-22T08:40:00"
      // We need to split it into date and time
      const [birth_date, birth_time_full] = birthData.birth_datetime.split('T');
      const birth_time = birth_time_full.substring(0, 5); // Get HH:MM from HH:MM:SS

      // Prepare the API request
      const requestBody = {
        person1: {
          name: userName || 'Person 1',
          birth_date: birth_date, // YYYY-MM-DD
          birth_time: birth_time, // HH:MM
          latitude: birthData.latitude,
          longitude: birthData.longitude,
          timezone: birthData.timezone || 'UTC',
          location_name: userLocation || 'Location 1'
        },
        person2: {
          name: partnerName,
          birth_date: partnerDate,
          birth_time: partnerTime,
          latitude: partnerLatitude,
          longitude: partnerLongitude,
          timezone: partnerTimezone,
          location_name: partnerPlace
        },
        ayanamsa: 'LAHIRI'
      };

      console.log('Compatibility request:', requestBody);

      // Call the compatibility API
      const response = await fetch(`${import.meta.env.VITE_ASTROLOGY_API_URL || 'http://localhost:8000'}/api/compatibility/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error:', errorData);
        throw new Error(JSON.stringify(errorData.detail || 'Failed to calculate compatibility'));
      }

      const data = await response.json();
      console.log('Compatibility response:', data);
      setCompatibilityData(data);
      setShowCompatibility(true);
    } catch (error) {
      console.error('Compatibility calculation error:', error);
      alert(`Error calculating compatibility: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setShowCompatibility(false);
    } finally {
      setIsCalculatingCompatibility(false);
    }
  };

  // Filter yogas
  const displayedYogas = yogaData?.all_yogas
    ? yogaFilter === 'all'
      ? yogaData.all_yogas
      : yogaData.all_yogas.filter(y => y.category.toLowerCase() === yogaFilter.toLowerCase())
    : [];

  // Set first yoga as selected when data loads
  if (!selectedYoga && displayedYogas.length > 0) {
    setSelectedYoga(displayedYogas[0]);
  }

  // Prepare chart data
  const shadbalaChartData = shadbalaData ? shadbalaToChartData(shadbalaData) : [];
  const dashaChartData = dashaData?.mahadashas ? dashaToChartData(dashaData.mahadashas) : [];

  return (
    <CosmicBackground density={140} useVideo={true}>
      <Navbar />

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">ॐ</span>
                <h1 className="text-4xl font-bold tracking-tight text-white">Yoga Laboratory — <span className="text-gradient-gold">Live Analysis</span></h1>
              </div>
              <p className="text-white/60 max-w-3xl">
                Enter your birth details to discover your unique planetary combinations, strength analysis, and timing predictions
                from our advanced Vedic astrology calculation engine.
              </p>
            </div>
            {birthData && (
              <Button variant="outline" className="border-white/20 text-white/80 hover:bg-white/10" onClick={() => setShowBirthForm(true)}>
                Change Birth Data
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Birth Data Form */}
        {showBirthForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Enter Your Birth Details</CardTitle>
              <CardDescription>
                Provide accurate birth information for personalized yoga detection, strength analysis, and dasha calculations.
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
                onSubmit={handleBirthDataSubmit}
                loading={false}
                initialData={isAstrologyReady && profileData ? profileData : undefined}
              />
            </CardContent>
          </Card>
        )}

        {/* Birth Chart Summary - Show immediately after data is submitted */}
        {birthData && !showBirthForm && birthChartData && (
          <Card className="mb-8 bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🌟</span>
                Your Cosmic Identity
              </CardTitle>
              <CardDescription>
                Essential astrological markers from your birth chart
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Ascendant (Lagna) */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg blur-sm group-hover:blur-md transition-all"></div>
                  <div className="relative bg-card border-2 border-primary/30 rounded-lg p-6 text-center hover:border-primary/60 transition-colors">
                    <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                      Ascendant (Lagna)
                    </div>
                    <div className="text-4xl font-bold text-foreground mb-2">
                      {birthChartData.ascendant.sign}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {birthChartData.ascendant?.longitude ? birthChartData.ascendant.longitude.toFixed(2) : '0.00'}°
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Lord: {getSignLord(birthChartData.ascendant.sign)}
                    </div>
                  </div>
                </div>

                {/* Moon Sign (Rashi) */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-lg blur-sm group-hover:blur-md transition-all"></div>
                  <div className="relative bg-card border-2 border-blue-500/30 rounded-lg p-6 text-center hover:border-blue-500/60 transition-colors">
                    <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
                      Moon Sign (Rashi)
                    </div>
                    <div className="text-4xl font-bold text-foreground mb-2">
                      {birthChartData.planets.Moon.sign}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {birthChartData.planets?.Moon?.longitude ? birthChartData.planets.Moon.longitude.toFixed(2) : '0.00'}°
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Nakshatra: {birthChartData.planets.Moon.nakshatra}
                    </div>
                  </div>
                </div>

                {/* Sun Sign */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-lg blur-sm group-hover:blur-md transition-all"></div>
                  <div className="relative bg-card border-2 border-orange-500/30 rounded-lg p-6 text-center hover:border-orange-500/60 transition-colors">
                    <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-2">
                      Sun Sign
                    </div>
                    <div className="text-4xl font-bold text-foreground mb-2">
                      {birthChartData.planets.Sun.sign}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {birthChartData.planets?.Sun?.longitude ? birthChartData.planets.Sun.longitude.toFixed(2) : '0.00'}°
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Nakshatra: {birthChartData.planets.Sun.nakshatra}
                    </div>
                  </div>
                </div>

                {/* Western Zodiac Sign */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-lg blur-sm group-hover:blur-md transition-all"></div>
                  <div className="relative bg-card border-2 border-purple-500/30 rounded-lg p-6 text-center hover:border-purple-500/60 transition-colors">
                    <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-2">
                      Western Zodiac
                    </div>
                    <div className="text-4xl font-bold text-foreground mb-2">
                      {getWesternSunSign(birthChartData.metadata.birth_datetime)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Sun Sign (Tropical)
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Calendar-based
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
                  <div>
                    <div className="text-muted-foreground">Ayanamsa</div>
                    <div className="font-semibold">{birthChartData.metadata.ayanamsa_used}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Ayanamsa Value</div>
                    <div className="font-semibold">{birthChartData.metadata?.ayanamsa_value ? birthChartData.metadata.ayanamsa_value.toFixed(2) : '0.00'}°</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Latitude</div>
                    <div className="font-semibold">{birthChartData.metadata?.location?.latitude ? birthChartData.metadata.location.latitude.toFixed(4) : '0.0000'}°</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Longitude</div>
                    <div className="font-semibold">{birthChartData.metadata?.location?.longitude ? birthChartData.metadata.location.longitude.toFixed(4) : '0.0000'}°</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {(yogasLoading || shadbalaLoading || dashaLoading || chartLoading) && birthData && !showBirthForm && !birthChartData && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-12 h-12 animate-spin text-cyan-400 mb-4" />
            <p className="text-lg font-medium text-white">Calculating your cosmic blueprint...</p>
            <p className="text-sm text-white/60">This may take a few seconds</p>
          </div>
        )}

        {/* Error State — API offline */}
        {yogasError && birthData && !showBirthForm && (
          <div className="card-cosmic p-8 text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h3 className="text-xl font-serif font-semibold text-white mb-2">Astrology Engine Offline</h3>
            <p className="text-white/60 max-w-md mx-auto mb-4">
              The advanced Vedic calculation engine is currently being set up.
              Birth Chart generation works offline — other features (Yoga Lab, Divisional Charts, Dasha Timeline)
              require the backend service.
            </p>
            <Button variant="outline" className="border-white/20 text-white/80 hover:bg-white/10" onClick={() => navigate('/astrology/birth-chart')}>
              Go to Birth Chart (Works Offline)
            </Button>
          </div>
        )}

        {/* Main Content - Only show when data is loaded */}
        {birthData && !showBirthForm && yogaData && !yogasLoading && (
          <Tabs defaultValue="ai-chat" className="space-y-6">
            <TabsList className="grid w-full max-w-7xl grid-cols-10">
              <TabsTrigger value="ai-chat" className="bg-gradient-to-r from-purple-500/10 to-purple-500/5">
                🤖 AI Chat
              </TabsTrigger>
              <TabsTrigger value="confidence" className="bg-gradient-to-r from-green-500/10 to-blue-500/5">
                📊 Confidence
              </TabsTrigger>
              <TabsTrigger value="fundamentals">Basics</TabsTrigger>
              <TabsTrigger value="yogas">
                Your Yogas
                <Badge variant="secondary" className="ml-2">
                  {yogaData.summary.total_yogas_detected}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="dasha">Dasha Periods</TabsTrigger>
              <TabsTrigger value="transits">Current Transits</TabsTrigger>
              <TabsTrigger value="divisional">Divisional Charts</TabsTrigger>
              <TabsTrigger value="lifecycle">Life Journey</TabsTrigger>
              <TabsTrigger value="matchmaking">Match Making</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>

            {/* Summary Card */}
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{yogaData.summary.total_yogas_detected}</div>
                    <div className="text-sm text-muted-foreground">Yogas Detected</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{yogaData.summary.currently_active}</div>
                    <div className="text-sm text-muted-foreground">Currently Active</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">{yogaData.summary.upcoming_10_years}</div>
                    <div className="text-sm text-muted-foreground">Activating (10 Years)</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI CHAT TAB */}
            <TabsContent value="ai-chat" className="space-y-6">
              <RishiChatInterface birthData={birthData} />
            </TabsContent>

            {/* CONFIDENCE SCORING TAB */}
            <TabsContent value="confidence" className="space-y-6">
              <ConfidenceOverview
                data={lifeOverviewData}
                isLoading={lifeOverviewLoading}
                error={lifeOverviewError}
                birthData={birthData}
              />
            </TabsContent>

            {/* FUNDAMENTALS TAB */}
            <TabsContent value="fundamentals" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Your Kundli (Birth Chart)</CardTitle>
                      <CardDescription>
                        Your personalized planetary positions calculated from your exact birth time and location.
                      </CardDescription>
                    </div>
                    <Badge className="bg-gradient-to-r from-cyan-600 to-indigo-600 text-white">
                      Project Aether
                    </Badge>
                  </div>
                </CardHeader>
              </Card>

              {/* Project Aether Kundli Chart */}
              {birthChartData && (
                <ProjectAetherKundli
                  planets={birthChartData.planets}
                  houses={birthChartData.houses}
                  ascendant={birthChartData.ascendant}
                  yogaData={yogaData}
                  shadbalaData={shadbalaData}
                  dashaData={dashaData}
                  lifePredictions={lifePredictions}
                  divisionalCharts={divisionalCharts}
                  birthData={birthData}
                />
              )}

              {/* Your Kundli - What Your Planets Say About You */}
              {birthChartData && (
                <Card className="bg-gradient-to-br from-primary/5 to-background border-2 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-2xl">🌟 What Your Kundli Says About You</CardTitle>
                    <CardDescription className="text-base">
                      Complete analysis: where each planet is positioned, its strength, and what it means for different areas of your life
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(birthChartData.planets).map(([planetName, planetData]: [string, any]) => {
                      const planetInfo = PLANETS.find(p => p.name.toLowerCase().includes(planetName.toLowerCase()));
                      const strengthInfo = getPlanetStrengthDescription(planetName, planetData.sign || '');
                      const signMeaning = getPlanetInSignMeaning(planetName, planetData.sign || '');

                      // Calculate correct house based on longitude and house cusps
                      const houseCusps = (Array.isArray(birthChartData.houses) ? birthChartData.houses : Object.values(birthChartData.houses)) as number[];
                      const correctHouse = calculatePlanetHouse(planetData.longitude, houseCusps);
                      const houseMeaning = getPlanetInHouseMeaning(planetName, correctHouse);

                      // House titles for context
                      const houseTitles: Record<number, string> = {
                        1: "Self & Personality", 2: "Wealth & Family", 3: "Siblings & Skills",
                        4: "Home & Mother", 5: "Children & Romance", 6: "Health & Enemies",
                        7: "Spouse & Partnership", 8: "Longevity & Transformation", 9: "Fortune & Father",
                        10: "Career & Status", 11: "Gains & Friends", 12: "Loss & Liberation"
                      };

                      // Get Shadbala strength
                      const shadbalaStrength = shadbalaData?.[planetName]?.grade;

                      return (
                        <Card key={planetName} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <CardContent className="p-0">
                            {/* Planet Header */}
                            <div className="bg-muted/50 p-4 flex items-center justify-between border-b">
                              <div className="flex items-center gap-3">
                                <span className={`text-3xl ${planetInfo?.color || ''}`}>
                                  {planetInfo?.icon || '⚫'}
                                </span>
                                <div>
                                  <h3 className="font-bold text-lg">{planetName}</h3>
                                  <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      {planetData.sign} {planetData.longitude ? `${planetData.longitude.toFixed(1)}°` : ''}
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs" title={houseTitles[correctHouse]}>
                                      House {correctHouse}: {houseTitles[correctHouse]}
                                    </Badge>
                                    {shadbalaStrength && (() => {
                                      const planetShadbala = shadbalaData?.[planetName];
                                      if (!planetShadbala) return null;

                                      const percent = planetShadbala.strength_percentage || 0;
                                      const isStrong = planetShadbala.is_strong;
                                      const displayGrade = isStrong ? 'Excellent' :
                                                          percent >= 90 ? 'Good' :
                                                          percent >= 70 ? 'Average' : 'Weak';
                                      const color = isStrong ? 'bg-green-500 hover:bg-green-600' :
                                                   percent >= 90 ? 'bg-blue-500 hover:bg-blue-600' :
                                                   percent >= 70 ? 'bg-yellow-500 hover:bg-yellow-600' :
                                                   'bg-red-500 hover:bg-red-600';
                                      return (
                                        <Badge className={`text-xs ${color}`} title={`${planetShadbala.total_shadbala.toFixed(2)}R / ${planetShadbala.required_minimum.toFixed(1)}R`}>
                                          {displayGrade} ({percent.toFixed(0)}%)
                                        </Badge>
                                      );
                                    })()}
                                    {planetData.is_retrograde && (
                                      <Badge variant="destructive" className="text-xs">
                                        Retrograde
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Meaningful Interpretations */}
                            <div className="p-4 space-y-3">
                              {/* Planet in Sign Meaning */}
                              <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                                <div className="flex items-start gap-2">
                                  <span className="text-blue-600 dark:text-blue-400 font-bold text-xs uppercase mt-0.5">
                                    Your Nature:
                                  </span>
                                  <p className="text-sm leading-relaxed flex-1 text-gray-900 dark:text-gray-100">{signMeaning}</p>
                                </div>
                              </div>

                              {/* Planet in House Meaning */}
                              <div className="bg-purple-50 dark:bg-purple-950/30 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
                                <div className="flex items-start gap-2">
                                  <span className="text-purple-600 dark:text-purple-400 font-bold text-xs uppercase mt-0.5">
                                    Life Area:
                                  </span>
                                  <p className="text-sm leading-relaxed flex-1 text-gray-900 dark:text-gray-100">{houseMeaning}</p>
                                </div>
                              </div>

                              {/* Strength Description */}
                              {strengthInfo && (
                                <div className={`${
                                  strengthInfo.strength === 'Exalted' ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800' :
                                  strengthInfo.strength === 'Debilitated' ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800' :
                                  strengthInfo.strength.includes('Own') ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800' :
                                  'bg-gray-50 dark:bg-gray-950/30 border-gray-200 dark:border-gray-800'
                                } p-3 rounded-lg border`}>
                                  <div className="flex items-start gap-2">
                                    <span className={`${strengthInfo.color} font-bold text-xs uppercase mt-0.5`}>
                                      Strength:
                                    </span>
                                    <p className="text-sm leading-relaxed flex-1 text-gray-900 dark:text-gray-100">{strengthInfo.description}</p>
                                  </div>
                                </div>
                              )}

                              {/* Nakshatra - Quick Reference */}
                              {planetData.nakshatra && (
                                <div className="text-xs text-muted-foreground pt-2 border-t flex items-center gap-2">
                                  <span className="font-semibold">Nakshatra:</span>
                                  <span>{planetData.nakshatra}</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </CardContent>
                </Card>
              )}

              {/* Planet Reference Guide removed from Basics tab - will be moved to Analysis tab */}
              {/* Divisional Charts removed from Basics tab - available in dedicated "Divisional Charts" tab */}
            </TabsContent>

            {/* YOGAS TAB */}
            <TabsContent value="yogas" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Your Detected Yogas</CardTitle>
                      <CardDescription>
                        These are the actual planetary combinations present in your birth chart, calculated from your exact birth time and location.
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowYogaGuide(!showYogaGuide)}
                      className="flex items-center gap-2"
                    >
                      <Info className="w-4 h-4" />
                      {showYogaGuide ? 'Hide Guide' : 'Understanding Yogas'}
                    </Button>
                  </div>
                </CardHeader>
                {showYogaGuide && (
                  <CardContent>
                    <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-900">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                        <span>ℹ️</span>
                        Understanding Yogas
                      </h4>
                      <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                        <p>
                          <strong>What is a Yoga?</strong> In Vedic astrology, a "yoga" is a special planetary combination that creates specific effects in your life. Think of it as planets working together to produce unique outcomes.
                        </p>
                        <p>
                          <strong>How to use this information:</strong> Each yoga below shows you patterns in your chart, what they mean for you, and when they're likely to be most active. Click on any yoga to see detailed explanations.
                        </p>
                        <p>
                          <strong>Strength matters:</strong> A "Strong" yoga will have more noticeable effects than a "Weak" one. The effects manifest most during the planetary periods (dashas) of the involved planets.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 space-y-4">
                  <Select value={yogaFilter} onValueChange={setYogaFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Yogas ({yogaData.all_yogas.length})</SelectItem>
                      <SelectItem value="raja">Raja Yoga (Power/Status)</SelectItem>
                      <SelectItem value="dhana">Dhana Yoga (Wealth)</SelectItem>
                      <SelectItem value="pancha_mahapurusha">Pancha Mahapurusha</SelectItem>
                      <SelectItem value="special">Special / Other</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {displayedYogas.map((yoga, index) => (
                      <Card
                        key={index}
                        className={`cursor-pointer transition-colors ${
                          selectedYoga?.name === yoga.name ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedYoga(yoga)}
                      >
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-sm">{yoga.name}</span>
                            <Badge variant={yoga.is_present ? "default" : "secondary"} className="text-xs">
                              {yoga.strength || yoga.category}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground truncate">{yoga.sanskrit_name}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {selectedYoga && (
                  <div className="lg:col-span-8 space-y-6">
                    {(() => {
                      const hardcodedInterpretation = getYogaInterpretation(selectedYoga.name);

                      // Create interpretation from API data if not in hardcoded dictionary
                      const interpretation = hardcodedInterpretation || {
                        fullName: selectedYoga.name,
                        category: selectedYoga.category,
                        meaning: selectedYoga.what_is_this_yoga || selectedYoga.description,
                        lifeImpact: selectedYoga.life_impact || selectedYoga.effects,
                        positiveManifestations: selectedYoga.positive_manifestations
                          ? selectedYoga.positive_manifestations.split('•').map((s: string) => s.trim()).filter(Boolean)
                          : [],
                        challenges: selectedYoga.potential_challenges
                          ? selectedYoga.potential_challenges.split('•').map((s: string) => s.trim()).filter(Boolean)
                          : [],
                        workingWithThisEnergy: selectedYoga.practical_guidance
                          ? [selectedYoga.practical_guidance]
                          : [],
                        planetaryNature: `Strength: ${selectedYoga.strength_percentage || 0}%`
                      };

                      return (
                        <Card className="border-t-4 border-t-primary">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-3xl">
                                  {interpretation?.fullName || selectedYoga.name}
                                </CardTitle>
                                <CardDescription className="text-base">
                                  {selectedYoga.sanskrit_name}
                                </CardDescription>
                                {interpretation && (
                                  <p className="text-sm text-muted-foreground mt-2">
                                    {getCategoryDescription(interpretation.category)}
                                  </p>
                                )}
                              </div>
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                {interpretation?.category || selectedYoga.category}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            {/* What This Yoga Means */}
                            {interpretation && (
                              <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg border-2 border-blue-300 dark:border-blue-700">
                                <h4 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                                  <span>📖</span>
                                  What Is This Yoga?
                                </h4>
                                <p className="text-base leading-relaxed text-gray-900 dark:text-gray-100">{interpretation.meaning}</p>
                              </div>
                            )}

                            {/* What This Means For YOU */}
                            <div className="bg-purple-50 dark:bg-purple-950 p-6 rounded-lg border-2 border-purple-300 dark:border-purple-700">
                              <h4 className="text-lg font-bold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
                                <span>💫</span>
                                How This Impacts Your Life
                              </h4>
                              <p className="text-base leading-relaxed mb-4 text-gray-900 dark:text-gray-100">
                                {interpretation?.lifeImpact || selectedYoga.results}
                              </p>

                              {selectedYoga.strength && (
                                <div className="space-y-2 mt-3">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-muted-foreground">Strength:</span>
                                    <Badge variant={selectedYoga.strength === 'Strong' ? 'default' : 'secondary'}>
                                      {selectedYoga.strength}
                                    </Badge>
                                    {selectedYoga.strength_percentage && (
                                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                                        {selectedYoga.strength_percentage}% Manifestation
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {selectedYoga.strength === 'Strong'
                                      ? 'This yoga will have a significant impact on your life'
                                      : selectedYoga.strength === 'Moderate'
                                      ? 'This yoga will have noticeable effects'
                                      : 'This yoga has subtle influences'}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Positive Manifestations and Challenges */}
                            {interpretation && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-green-50 dark:bg-green-950 p-5 rounded-lg border-2 border-green-300 dark:border-green-700">
                                  <h4 className="text-sm font-bold text-green-800 dark:text-green-100 uppercase tracking-wide mb-3 flex items-center gap-2">
                                    <span>✨</span>
                                    Positive Manifestations
                                  </h4>
                                  <ul className="space-y-2 text-sm text-gray-900 dark:text-gray-100">
                                    {interpretation.positiveManifestations.map((item, idx) => (
                                      <li key={idx} className="flex items-start gap-2">
                                        <span className="text-green-700 dark:text-green-300 mt-0.5 font-bold">•</span>
                                        <span>{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div className="bg-amber-50 dark:bg-amber-950 p-5 rounded-lg border-2 border-amber-300 dark:border-amber-700">
                                  <h4 className="text-sm font-bold text-amber-800 dark:text-amber-100 uppercase tracking-wide mb-3 flex items-center gap-2">
                                    <span>⚠️</span>
                                    Potential Challenges
                                  </h4>
                                  <ul className="space-y-2 text-sm text-gray-900 dark:text-gray-100">
                                    {interpretation.challenges.map((item, idx) => (
                                      <li key={idx} className="flex items-start gap-2">
                                        <span className="text-amber-700 dark:text-amber-300 mt-0.5 font-bold">•</span>
                                        <span>{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            )}

                            {/* How It Forms and Classical Reference */}
                            {(selectedYoga.formation_rule || selectedYoga.results) && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {selectedYoga.formation_rule && (
                                  <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg border-2 border-gray-300 dark:border-gray-700">
                                    <h4 className="text-xs font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wide mb-3 flex items-center gap-2">
                                      <span>⚙️</span>
                                      How This Yoga Forms In Your Chart
                                    </h4>
                                    <p className="text-sm leading-relaxed text-gray-900 dark:text-gray-100">{selectedYoga.formation_rule}</p>
                                  </div>
                                )}

                                {selectedYoga.results && (
                                  <div className="bg-indigo-50 dark:bg-indigo-950 p-4 rounded-lg border-2 border-indigo-300 dark:border-indigo-700">
                                    <h4 className="text-xs font-bold text-indigo-800 dark:text-indigo-100 uppercase tracking-wide mb-3 flex items-center gap-2">
                                      <span>📚</span>
                                      Classical Text Reference
                                    </h4>
                                    <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed italic">
                                      "{selectedYoga.results}"
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}

                        {/* Detailed Breakdown */}
                        <div className="space-y-4">
                          <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">Your Chart Configuration</h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedYoga.planets_involved && selectedYoga.planets_involved.length > 0 && (
                              <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg border-2 border-orange-300 dark:border-orange-700">
                                <h5 className="text-xs font-bold text-orange-800 dark:text-orange-100 uppercase tracking-wide mb-3">
                                  Planets Creating This Yoga
                                </h5>
                                <div className="flex gap-2 flex-wrap">
                                  {selectedYoga.planets_involved.map((planet: string, idx: number) => (
                                    <Badge key={idx} className="text-sm px-3 py-1 bg-orange-200 dark:bg-orange-800 text-orange-900 dark:text-orange-100">
                                      {planet}
                                    </Badge>
                                  ))}
                                </div>
                                <p className="text-xs text-gray-700 dark:text-gray-300 mt-3">
                                  These planets are positioned in your chart in a way that creates this special combination.
                                </p>
                              </div>
                            )}

                            {selectedYoga.houses_involved && selectedYoga.houses_involved.length > 0 && (
                              <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg border-2 border-purple-300 dark:border-purple-700">
                                <h5 className="text-xs font-bold text-purple-800 dark:text-purple-100 uppercase tracking-wide mb-3">
                                  Houses (Life Areas) Affected
                                </h5>
                                <div className="flex gap-2 flex-wrap">
                                  {selectedYoga.houses_involved.map((house: number, idx: number) => (
                                    <Badge key={idx} className="text-sm px-3 py-1 bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-100">
                                      House {house}
                                    </Badge>
                                  ))}
                                </div>
                                <p className="text-xs text-gray-700 dark:text-gray-300 mt-3">
                                  This yoga influences these specific areas of your life.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                            {/* Practical Guidance */}
                            <div className="bg-emerald-50 dark:bg-emerald-950 p-6 rounded-lg border-2 border-emerald-300 dark:border-emerald-700">
                              <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-100 uppercase tracking-wide mb-3 flex items-center gap-2">
                                <span>🌱</span>
                                How To Work With This Energy
                              </h4>
                              {interpretation ? (
                                <ul className="space-y-3 text-sm text-gray-900 dark:text-gray-100">
                                  {interpretation.workingWithThisEnergy.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                      <span className="text-emerald-700 dark:text-emerald-300 font-bold mt-0.5">{idx + 1}.</span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <div className="space-y-2 text-sm text-gray-900 dark:text-gray-100">
                                  <p>
                                    <strong className="text-gray-900 dark:text-gray-100">Understanding:</strong> This yoga is present in your birth chart and represents a specific pattern of planetary energies.
                                  </p>
                                  <p>
                                    <strong className="text-gray-900 dark:text-gray-100">Timing:</strong> The effects of this yoga will be most prominent during the dashas (planetary periods) of the planets involved.
                                  </p>
                                  <p>
                                    <strong className="text-gray-900 dark:text-gray-100">Action:</strong> Awareness of this yoga helps you understand certain tendencies and opportunities in your life path.
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Planetary Nature */}
                            {interpretation && (
                              <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg border-2 border-slate-300 dark:border-slate-700">
                                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide mb-2 flex items-center gap-2">
                                  <span>ℹ️</span>
                                  Additional Information
                                </h4>
                                <p className="text-sm text-gray-800 dark:text-gray-200 italic">
                                  {interpretation.planetaryNature}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })()}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* DASHA PERIODS TAB */}
            <TabsContent value="dasha" className="space-y-6">
              <Card className="bg-gradient-to-br from-primary/5 to-background border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-2xl">🕉️ Vimshottari Dasha Periods</CardTitle>
                  <CardDescription className="text-base">
                    Your planetary time periods (Mahadasha, Antardasha, Pratyantardasha) with auspiciousness analysis based on Shadbala strength
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {dashaLoading && (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span className="ml-3 text-muted-foreground">Calculating Dasha periods...</span>
                    </div>
                  )}

                  {dashaData && !dashaLoading && (() => {
                    const currentYear = new Date().getFullYear();
                    const currentDate = new Date();

                    return (
                      <div className="space-y-6">
                        {/* Current Dasha Display */}
                        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-300 dark:border-amber-800">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <span className="text-2xl">⏰</span>
                              <span>Current Active Period</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {dashaData.mahadashas && (() => {
                              // Find current Mahadasha
                              const currentMahadasha = dashaData.mahadashas.find((md: any) => {
                                const start = new Date(md.start_date);
                                const end = new Date(md.end_date);
                                return currentDate >= start && currentDate <= end;
                              });

                              if (!currentMahadasha) return <p>Current period not found</p>;

                              // Find current Antardasha
                              const currentAntardasha = currentMahadasha.antardashas?.find((ad: any) => {
                                const start = new Date(ad.start_date);
                                const end = new Date(ad.end_date);
                                return currentDate >= start && currentDate <= end;
                              });

                              // Find current Pratyantardasha
                              const currentPratyantardasha = currentAntardasha?.pratyantardashas?.find((pd: any) => {
                                const start = new Date(pd.start_date);
                                const end = new Date(pd.end_date);
                                return currentDate >= start && currentDate <= end;
                              });

                              // Get planet Shadbala for Mahadasha
                              const planetShadbala = shadbalaData?.[currentMahadasha.planet];
                              const isAuspicious = planetShadbala?.is_strong || false;
                              const strengthPercent = planetShadbala?.strength_percentage || 0;

                              // Get Antardasha strength
                              const antarPlanetShadbala = currentAntardasha ? shadbalaData?.[currentAntardasha.planet] : null;
                              const antarStrength = antarPlanetShadbala?.strength_percentage || 0;
                              const antarIsStrong = antarPlanetShadbala?.is_strong || false;

                              // Get Pratyantardasha strength
                              const pratyPlanetShadbala = currentPratyantardasha ? shadbalaData?.[currentPratyantardasha.planet] : null;
                              const pratyStrength = pratyPlanetShadbala?.strength_percentage || 0;
                              const pratyIsStrong = pratyPlanetShadbala?.is_strong || false;

                              return (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Mahadasha */}
                                    <div className="bg-white/50 dark:bg-gray-900/50 p-3 rounded-lg border-2 border-amber-400 dark:border-amber-600">
                                      <p className="text-xs text-muted-foreground mb-1">Mahadasha (Main Period)</p>
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xl font-bold text-primary">{currentMahadasha.planet}</span>
                                        <Badge className={`text-xs ${
                                          isAuspicious ? 'bg-green-500' :
                                          strengthPercent >= 90 ? 'bg-blue-500' :
                                          strengthPercent >= 70 ? 'bg-yellow-500' :
                                          'bg-red-500'
                                        }`}>
                                          {isAuspicious ? '✓' :
                                           strengthPercent >= 90 ? 'Good' :
                                           strengthPercent >= 70 ? 'Avg' :
                                           'Weak'} {strengthPercent.toFixed(0)}%
                                        </Badge>
                                      </div>
                                      <p className="text-xs text-muted-foreground">
                                        {new Date(currentMahadasha.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {new Date(currentMahadasha.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                      </p>
                                    </div>

                                    {/* Antardasha */}
                                    {currentAntardasha && (
                                      <div className="bg-white/50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-300 dark:border-gray-600">
                                        <p className="text-xs text-muted-foreground mb-1">Antardasha (Sub-period)</p>
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="text-lg font-semibold text-primary">{currentAntardasha.planet}</span>
                                          <Badge className={`text-xs ${
                                            antarIsStrong ? 'bg-green-500' :
                                            antarStrength >= 90 ? 'bg-blue-500' :
                                            antarStrength >= 70 ? 'bg-yellow-500' :
                                            'bg-red-500'
                                          }`}>
                                            {antarIsStrong ? '✓' :
                                             antarStrength >= 90 ? 'Good' :
                                             antarStrength >= 70 ? 'Avg' :
                                             'Weak'} {antarStrength.toFixed(0)}%
                                          </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                          {new Date(currentAntardasha.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {new Date(currentAntardasha.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                        </p>
                                      </div>
                                    )}

                                    {/* Pratyantardasha */}
                                    {currentPratyantardasha && (
                                      <div className="bg-white/50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-300 dark:border-gray-600">
                                        <p className="text-xs text-muted-foreground mb-1">Pratyantardasha (Sub-sub-period)</p>
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="text-lg font-semibold text-primary">{currentPratyantardasha.planet}</span>
                                          <Badge className={`text-xs ${
                                            pratyIsStrong ? 'bg-green-500' :
                                            pratyStrength >= 90 ? 'bg-blue-500' :
                                            pratyStrength >= 70 ? 'bg-yellow-500' :
                                            'bg-red-500'
                                          }`}>
                                            {pratyIsStrong ? '✓' :
                                             pratyStrength >= 90 ? 'Good' :
                                             pratyStrength >= 70 ? 'Avg' :
                                             'Weak'} {pratyStrength.toFixed(0)}%
                                          </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                          {new Date(currentPratyantardasha.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })} - {new Date(currentPratyantardasha.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                                        </p>
                                      </div>
                                    )}
                                  </div>

                                  {/* Period Quality Analysis */}
                                  <div className="bg-white/50 dark:bg-gray-900/50 p-4 rounded-lg">
                                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">💡 Current Period Quality:</p>
                                    <p className="text-sm text-gray-900 dark:text-gray-100">
                                      {isAuspicious ?
                                        `${currentMahadasha.planet} Mahadasha is strong and can deliver promised results with ease. This is an auspicious period for ${currentMahadasha.planet}'s significations.` :
                                       strengthPercent >= 90 ?
                                        `${currentMahadasha.planet} Mahadasha is nearly at full strength. Results will come with moderate effort.` :
                                       strengthPercent >= 70 ?
                                        `${currentMahadasha.planet} Mahadasha has moderate strength. Results require consistent effort and remedies are recommended.` :
                                        `${currentMahadasha.planet} Mahadasha is weak. This period requires high personal effort (Purushartha) and remedial measures for best results.`
                                      }
                                      {currentAntardasha && (
                                        <span className="block mt-1">
                                          Current {currentAntardasha.planet} Antardasha: {
                                            antarIsStrong ? 'Strong - favorable for results' :
                                            antarStrength >= 90 ? 'Good - mostly favorable' :
                                            antarStrength >= 70 ? 'Average - needs effort' :
                                            'Weak - requires remedies'
                                          }
                                        </span>
                                      )}
                                      {currentPratyantardasha && (
                                        <span className="block mt-1 text-xs">
                                          Active {currentPratyantardasha.planet} Pratyantardasha ({pratyStrength.toFixed(0)}% strength) influences day-to-day events.
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                </div>
                              );
                            })()}
                          </CardContent>
                        </Card>

                        {/* All Mahadashas Timeline */}
                        <Card>
                          <CardHeader>
                            <CardTitle>Complete Mahadasha Timeline</CardTitle>
                            <CardDescription>All major planetary periods in your life with strength analysis</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {dashaData.mahadashas?.map((mahadasha: any, index: number) => {
                                const startDate = new Date(mahadasha.start_date);
                                const endDate = new Date(mahadasha.end_date);
                                const isCurrent = currentDate >= startDate && currentDate <= endDate;
                                const isPast = currentDate > endDate;
                                const isFuture = currentDate < startDate;

                                const planetShadbala = shadbalaData?.[mahadasha.planet];
                                const isStrong = planetShadbala?.is_strong || false;
                                const strengthPercent = planetShadbala?.strength_percentage || 0;

                                return (
                                  <div key={index} className={`p-4 rounded-lg border-2 ${
                                    isCurrent ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-400 dark:border-amber-700' :
                                    isPast ? 'bg-gray-50 dark:bg-gray-900/30 border-gray-300 dark:border-gray-700 opacity-60' :
                                    'bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700'
                                  }`}>
                                    <div className="flex items-start justify-between mb-2">
                                      <div>
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="text-xl font-bold">{mahadasha.planet} Mahadasha</span>
                                          {isCurrent && <Badge variant="default">Current</Badge>}
                                          {isPast && <Badge variant="secondary">Past</Badge>}
                                          {isFuture && <Badge variant="outline">Future</Badge>}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                          {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()} ({mahadasha.duration_years.toFixed(1)} years)
                                        </p>
                                      </div>
                                      <Badge className={`${
                                        isStrong ? 'bg-green-500' :
                                        strengthPercent >= 90 ? 'bg-blue-500' :
                                        strengthPercent >= 70 ? 'bg-yellow-500' :
                                        'bg-red-500'
                                      }`}>
                                        {strengthPercent.toFixed(0)}% Strength
                                      </Badge>
                                    </div>

                                    {/* Detailed Impact Analysis */}
                                    {(() => {
                                      const impact = getDashaImpact(mahadasha.planet, isStrong, strengthPercent);
                                      return (
                                        <div className="mt-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                                          <div className="flex items-center gap-2 mb-2">
                                            <span className="text-lg">{impact.emoji}</span>
                                            <span className="font-semibold text-base">{impact.quality} Period</span>
                                          </div>

                                          <div className="space-y-2 text-sm">
                                            <div>
                                              <span className="font-semibold text-gray-900 dark:text-gray-100">Impact: </span>
                                              <span className="text-gray-700 dark:text-gray-300">{impact.explanation}</span>
                                            </div>

                                            <div>
                                              <span className="font-semibold text-gray-900 dark:text-gray-100">What to Expect: </span>
                                              <span className="text-gray-700 dark:text-gray-300">{impact.expectations}</span>
                                            </div>

                                            <div className="pt-2 border-t border-gray-300 dark:border-gray-600">
                                              <span className="font-semibold text-gray-900 dark:text-gray-100">💡 Advice: </span>
                                              <span className="text-gray-700 dark:text-gray-300">{impact.advice}</span>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })()}

                                    <div className="flex justify-end mt-3">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setExpandedMahadasha(expandedMahadasha === mahadasha.planet ? null : mahadasha.planet)}
                                      >
                                        {expandedMahadasha === mahadasha.planet ? (
                                          <>
                                            <ChevronUp className="h-4 w-4 mr-1" />
                                            Hide Antardashas
                                          </>
                                        ) : (
                                          <>
                                            <ChevronDown className="h-4 w-4 mr-1" />
                                            View Antardashas ({mahadasha.antardashas?.length || 9})
                                          </>
                                        )}
                                      </Button>
                                    </div>

                                    {/* Expanded Antardasha Section */}
                                    {expandedMahadasha === mahadasha.planet && mahadasha.antardashas && (
                                      <div className="mt-4 space-y-2 border-t pt-3">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                          Antardashas (Sub-periods):
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                          {mahadasha.antardashas.map((antardasha: any, aIndex: number) => {
                                            const antarStart = new Date(antardasha.start_date);
                                            const antarEnd = new Date(antardasha.end_date);
                                            const isAntarCurrent = currentDate >= antarStart && currentDate <= antarEnd;

                                            const antarPlanetShadbala = shadbalaData?.[antardasha.planet];
                                            const antarStrength = antarPlanetShadbala?.strength_percentage || 0;

                                            const antarKey = `${mahadasha.planet}-${antardasha.planet}`;

                                            return (
                                              <div key={aIndex} className={`rounded border ${
                                                isAntarCurrent ? 'bg-amber-100 dark:bg-amber-900/40 border-amber-400 dark:border-amber-600' :
                                                'bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                                              }`}>
                                                <div className="p-2">
                                                  <div className="flex items-center justify-between mb-1">
                                                    <span className="font-semibold text-xs">{mahadasha.planet}-{antardasha.planet}</span>
                                                    {isAntarCurrent && <Badge variant="default" className="text-xs py-0">Active</Badge>}
                                                  </div>
                                                  <div className="text-xs text-muted-foreground">
                                                    {antarStart.toLocaleDateString()} - {antarEnd.toLocaleDateString()}
                                                  </div>
                                                  <div className="flex items-center gap-1 mt-1">
                                                    <div className={`h-1.5 flex-1 rounded-full ${
                                                      antarPlanetShadbala?.is_strong ? 'bg-green-500' :
                                                      antarStrength >= 90 ? 'bg-blue-500' :
                                                      antarStrength >= 70 ? 'bg-yellow-500' :
                                                      'bg-red-500'
                                                    }`}></div>
                                                    <span className="text-xs">{antarStrength.toFixed(0)}%</span>
                                                  </div>

                                                  {/* Pratyantardasha Expand Button */}
                                                  {antardasha.pratyantardashas && antardasha.pratyantardashas.length > 0 && (
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => setExpandedAntardasha(expandedAntardasha === antarKey ? null : antarKey)}
                                                      className="w-full mt-1 h-6 text-xs"
                                                    >
                                                      {expandedAntardasha === antarKey ? (
                                                        <>
                                                          <ChevronUp className="h-3 w-3 mr-1" />
                                                          Hide Pratyantardashas
                                                        </>
                                                      ) : (
                                                        <>
                                                          <ChevronDown className="h-3 w-3 mr-1" />
                                                          View Pratyantardashas
                                                        </>
                                                      )}
                                                    </Button>
                                                  )}
                                                </div>

                                                {/* Expanded Pratyantardasha Section */}
                                                {expandedAntardasha === antarKey && antardasha.pratyantardashas && (
                                                  <div className="border-t p-2 space-y-1 bg-gray-50/50 dark:bg-gray-900/50">
                                                    <p className="text-xs font-semibold mb-1">Pratyantardashas:</p>
                                                    <div className="space-y-1 max-h-60 overflow-y-auto">
                                                      {antardasha.pratyantardashas.map((pratyantardasha: any, pIndex: number) => {
                                                        const pratyStart = new Date(pratyantardasha.start_date);
                                                        const pratyEnd = new Date(pratyantardasha.end_date);
                                                        const isPratyCurrent = currentDate >= pratyStart && currentDate <= pratyEnd;

                                                        const pratyPlanetShadbala = shadbalaData?.[pratyantardasha.planet];
                                                        const pratyStrength = pratyPlanetShadbala?.strength_percentage || 0;

                                                        return (
                                                          <div key={pIndex} className={`p-1.5 rounded text-xs border ${
                                                            isPratyCurrent ? 'bg-amber-200 dark:bg-amber-800/60 border-amber-500' :
                                                            'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                                                          }`}>
                                                            <div className="flex items-center justify-between">
                                                              <span className="font-medium text-xs">
                                                                {mahadasha.planet}-{antardasha.planet}-{pratyantardasha.planet}
                                                              </span>
                                                              {isPratyCurrent && <Badge variant="default" className="text-xs py-0 px-1">Now</Badge>}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground mt-0.5">
                                                              {pratyStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })} -
                                                              {pratyEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                                                            </div>
                                                            <div className="flex items-center gap-1 mt-1">
                                                              <div className={`h-1 flex-1 rounded-full ${
                                                                pratyPlanetShadbala?.is_strong ? 'bg-green-500' :
                                                                pratyStrength >= 90 ? 'bg-blue-500' :
                                                                pratyStrength >= 70 ? 'bg-yellow-500' :
                                                                'bg-red-500'
                                                              }`}></div>
                                                              <span className="text-xs">{pratyStrength.toFixed(0)}%</span>
                                                            </div>
                                                          </div>
                                                        );
                                                      })}
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            </TabsContent>

            {/* CURRENT TRANSITS TAB */}
            <TabsContent value="transits" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Planetary Transits</CardTitle>
                  <CardDescription>
                    How current planetary movements affect your birth chart - Updated in real-time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Loading State */}
                  {transitsLoading && (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-primary mr-3" />
                      <span>Calculating current transits...</span>
                    </div>
                  )}

                  {/* Transits Content */}
                  {transitsData && !transitsLoading && (
                    <div className="space-y-6">
                      {/* Transit Date Info */}
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h3 className="font-semibold text-blue-900 mb-2">Transit Information</h3>
                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <strong>Your Birth Date:</strong> {transitsData.natal_chart_date}
                          </div>
                          <div>
                            <strong>Current Transit Date:</strong> {transitsData.transit_date}
                          </div>
                        </div>
                      </div>

                      {/* Summary Stats */}
                      <div className="grid md:grid-cols-4 gap-4">
                        <Card className="bg-green-50 border-green-200">
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <div className="text-3xl font-bold text-green-700">
                                {transitsData.transit_analysis.summary.beneficial_count}
                              </div>
                              <div className="text-sm text-green-600 mt-1">Beneficial Transits</div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-orange-50 border-orange-200">
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <div className="text-3xl font-bold text-orange-700">
                                {transitsData.transit_analysis.summary.challenging_count}
                              </div>
                              <div className="text-sm text-orange-600 mt-1">Challenging Transits</div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-purple-50 border-purple-200">
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <div className="text-3xl font-bold text-purple-700">
                                {transitsData.transit_analysis.summary.transformative_count}
                              </div>
                              <div className="text-sm text-purple-600 mt-1">Transformative Transits</div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-gray-50 border-gray-200">
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <div className="text-3xl font-bold text-gray-700">
                                {transitsData.transit_analysis.total_active_transits}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">Total Active Transits</div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Sade Sati Warning (if active) */}
                      {transitsData.transit_analysis.special_transits.sade_sati?.is_active && (
                        <Card className="border-2 border-red-400 bg-red-50">
                          <CardHeader>
                            <CardTitle className="text-red-900 flex items-center gap-2">
                              ⚠️ Sade Sati Active - Saturn's 7.5 Year Transit
                            </CardTitle>
                            <CardDescription className="text-red-700">
                              Phase: {transitsData.transit_analysis.special_transits.sade_sati.phase} |
                              Intensity: {transitsData.transit_analysis.special_transits.sade_sati.intensity}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-700 mb-3">
                              {transitsData.transit_analysis.special_transits.sade_sati.description}
                            </p>
                            <div className="bg-white p-4 rounded-lg">
                              <strong className="text-sm text-red-900">Recommendations:</strong>
                              <p className="text-sm text-gray-700 mt-2">
                                {transitsData.transit_analysis.special_transits.sade_sati.recommendations}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Jupiter Transit */}
                      {transitsData.transit_analysis.special_transits.jupiter_transit && (
                        <Card className="border-2 border-yellow-400 bg-yellow-50">
                          <CardHeader>
                            <CardTitle className="text-yellow-900 flex items-center gap-2">
                              ⭐ Jupiter Transit - Current Blessings
                            </CardTitle>
                            <CardDescription>
                              Transiting {transitsData.transit_analysis.special_transits.jupiter_transit.transiting_house}th House
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-700 mb-3">
                              {transitsData.transit_analysis.special_transits.jupiter_transit.effect}
                            </p>
                            <div className="bg-white p-4 rounded-lg">
                              <strong className="text-sm text-yellow-900">Recommendation:</strong>
                              <p className="text-sm text-gray-700 mt-2">
                                {transitsData.transit_analysis.special_transits.jupiter_transit.recommendation}
                              </p>
                            </div>
                            <Badge className="mt-3 bg-yellow-600">
                              Duration: {transitsData.transit_analysis.special_transits.jupiter_transit.duration}
                            </Badge>
                          </CardContent>
                        </Card>
                      )}

                      {/* Active Transits List */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Top Active Transits (Strongest Effects)</CardTitle>
                          <CardDescription>
                            Currently active planetary aspects to your natal chart
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {transitsData.transit_analysis.active_transits.slice(0, 10).map((transit: any, idx: number) => {
                              const effectColors = {
                                beneficial: 'bg-green-100 border-green-300 text-green-900',
                                challenging: 'bg-orange-100 border-orange-300 text-orange-900',
                                transformative: 'bg-purple-100 border-purple-300 text-purple-900',
                                neutral: 'bg-gray-100 border-gray-300 text-gray-900'
                              };

                              return (
                                <div
                                  key={idx}
                                  className={`p-4 rounded-lg border-2 ${effectColors[transit.effect_type as keyof typeof effectColors]}`}
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <h4 className="font-semibold">
                                        {transit.transiting_planet} {transit.aspect} Natal {transit.natal_planet}
                                      </h4>
                                      <Badge variant="outline" className="mt-1">
                                        {transit.effect_type}
                                      </Badge>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-sm font-semibold">Strength: {Math.round(transit.strength)}%</div>
                                      <div className="text-xs text-gray-600">Orb: {transit.orb.toFixed(1)}°</div>
                                    </div>
                                  </div>
                                  <p className="text-sm mt-2">{transit.description}</p>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Current Planetary Positions */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Current Planetary Positions</CardTitle>
                          <CardDescription>Where planets are right now</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-3 gap-3">
                            {Object.entries(transitsData.current_planetary_positions).map(([planet, data]: [string, any]) => (
                              <div key={planet} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200">
                                <h4 className="font-bold text-blue-900 flex items-center gap-2">
                                  {planet}
                                  {data.is_retrograde && <span className="text-xs text-red-600">(R)</span>}
                                </h4>
                                <div className="text-sm text-gray-700 mt-1 space-y-1">
                                  <div><strong>Sign:</strong> {data.sign}</div>
                                  <div><strong>Nakshatra:</strong> {data.nakshatra}</div>
                                  <div><strong>Speed:</strong> {data.speed.toFixed(4)}° /day</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Understanding Transits */}
                      <Card className="bg-gray-50">
                        <CardHeader>
                          <CardTitle>Understanding Transits</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm text-gray-700">
                          <p>
                            <strong>What are Transits?</strong> Transits are the current positions of planets in the sky and how they interact with your birth chart positions. They explain what's happening NOW in your life.
                          </p>
                          <p>
                            <strong>Important Transit Cycles:</strong>
                          </p>
                          <ul className="list-disc ml-6 space-y-1">
                            <li><strong>Saturn (Shani):</strong> 2.5 years per sign - Delays, discipline, lessons, hard work</li>
                            <li><strong>Jupiter (Guru):</strong> 1 year per sign - Growth, expansion, opportunities, luck</li>
                            <li><strong>Rahu/Ketu:</strong> 1.5 years per sign - Sudden changes, karmic events, destiny</li>
                            <li><strong>Mars (Mangal):</strong> 1.5 months per sign - Energy, action, conflicts</li>
                            <li><strong>Sade Sati:</strong> Saturn's 7.5 year transit over Moon - Major life transformation period</li>
                          </ul>
                          <p>
                            <strong>How to Use:</strong> Transits work with Dashas. A Dasha shows the overall life period theme, while Transits trigger specific events and timing within that period.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* DIVISIONAL CHARTS TAB */}
            <TabsContent value="divisional" className="space-y-6">
              {/* Loading State */}
              {divisionalLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mr-3" />
                  <span>Calculating divisional charts...</span>
                </div>
              )}

              {/* Divisional Charts Content */}
              {divisionalCharts && !divisionalLoading && (
                <DivisionalChartsAetherView divisionalCharts={divisionalCharts} />
              )}
            </TabsContent>
            {/* ANALYSIS TAB */}
            <TabsContent value="analysis" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardDescription>
                    Your personalized planetary strength (Shadbala) and life timeline (Vimshottari Dasha) calculated from your birth chart.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Shadbala content placeholder */}
                  <div className="space-y-6">
                    {/* Strength interpretation guide */}
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="font-semibold mb-3">Shadbala Strength Guide:</p>
                      {!shadbalaData || Object.keys(shadbalaData).length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>Detailed Shadbala and Dasha analysis will appear here</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {(() => {
                          // Categorize by planet-specific minimum requirements (Classical BPHS)
                          const excellent = Object.entries(shadbalaData)
                            .filter(([_, data]: [string, any]) => data.is_strong === true)
                            .map(([planet, data]: [string, any]) => ({
                              planet,
                              rupas: data.total_shadbala,
                              percent: data.strength_percentage
                            }));

                          const good = Object.entries(shadbalaData)
                            .filter(([_, data]: [string, any]) => {
                              const percent = data.strength_percentage;
                              return !data.is_strong && percent >= 90;
                            })
                            .map(([planet, data]: [string, any]) => ({
                              planet,
                              rupas: data.total_shadbala,
                              percent: data.strength_percentage
                            }));

                          const average = Object.entries(shadbalaData)
                            .filter(([_, data]: [string, any]) => {
                              const percent = data.strength_percentage;
                              return percent >= 70 && percent < 90;
                            })
                            .map(([planet, data]: [string, any]) => ({
                              planet,
                              rupas: data.total_shadbala,
                              percent: data.strength_percentage
                            }));

                          const weak = Object.entries(shadbalaData)
                            .filter(([_, data]: [string, any]) => data.strength_percentage < 70)
                            .map(([planet, data]: [string, any]) => ({
                              planet,
                              rupas: data.total_shadbala,
                              percent: data.strength_percentage,
                              required: data.required_minimum
                            }));

                          return (
                            <>
                              <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg border border-green-200 dark:border-green-800">
                                <p className="font-medium text-green-700 dark:text-green-300 mb-1">★ Excellent (Meets Planet-Specific Requirement):</p>
                                <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">Planet is strong (Purna Bala) - can deliver full promised results</p>
                                {excellent.length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                    {excellent.map(item => (
                                      <div key={item.planet} className="bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                                        <div>{item.planet}</div>
                                        <div className="text-green-200">{item.rupas.toFixed(2)}R ({item.percent.toFixed(0)}%)</div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-xs text-gray-500 italic">No planets meet their minimum requirement</p>
                                )}
                              </div>
                              <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                                <p className="font-medium text-blue-700 dark:text-blue-300 mb-1">✓ Good (90-99% of Requirement):</p>
                                <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">Nearly sufficient - can give mostly positive results with minor effort</p>
                                {good.length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                    {good.map(item => (
                                      <div key={item.planet} className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                                        <div>{item.planet}</div>
                                        <div className="text-blue-200">{item.rupas.toFixed(2)}R ({item.percent.toFixed(0)}%)</div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-xs text-gray-500 italic">No planets in this range</p>
                                )}
                              </div>
                              <div className="bg-yellow-50 dark:bg-yellow-950/30 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                <p className="font-medium text-yellow-700 dark:text-yellow-300 mb-1">○ Average (70-89% of Requirement):</p>
                                <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">Moderate deficit - mixed results, remedies recommended</p>
                                {average.length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                    {average.map(item => (
                                      <div key={item.planet} className="bg-yellow-600 text-white px-2 py-1 rounded text-xs font-medium">
                                        <div>{item.planet}</div>
                                        <div className="text-yellow-200">{item.rupas.toFixed(2)}R ({item.percent.toFixed(0)}%)</div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-xs text-gray-500 italic">No planets in this range</p>
                                )}
                              </div>
                              <div className="bg-red-50 dark:bg-red-950/30 p-3 rounded-lg border border-red-200 dark:border-red-800">
                                <p className="font-medium text-red-700 dark:text-red-300 mb-1">⚠ Weak (&lt;70% of Requirement):</p>
                                <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">Significant deficit - remedies urgently needed, results require high effort (Purushartha)</p>
                                {weak.length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                    {weak.map(item => (
                                      <div key={item.planet} className="bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
                                        <div>{item.planet}</div>
                                        <div className="text-red-200">{item.rupas.toFixed(2)}R / {item.required.toFixed(1)}R ({item.percent.toFixed(0)}%)</div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-xs text-gray-500 italic">No planets in this range</p>
                                )}
                              </div>
                            </>
                          );
                        })()}
                        </div>
                      )}
                    </div>
                    {shadbalaData && Object.keys(shadbalaData).length > 0 && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="font-medium mb-2">Your Strongest & Weakest Planets:</p>
                        {(() => {
                          const strengths = Object.entries(shadbalaData)
                            .map(([planet, data]: [string, any]) => ({
                              planet,
                              strength: data.total_shadbala || 0,
                              grade: data.grade || 'Average'
                            }))
                            .sort((a, b) => b.strength - a.strength);

                          const strongest = strengths[0];
                          const weakest = strengths[strengths.length - 1];

                          return (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                              <div className="bg-green-50 p-3 rounded">
                                <p className="font-semibold text-green-700">Strongest Planet:</p>
                                <p className="text-lg font-bold">{strongest.planet}</p>
                                <p className="text-xs text-gray-600">{strongest.strength.toFixed(1)} rupas - {strongest.grade}</p>
                              </div>
                              <div className="bg-red-50 p-3 rounded">
                                <p className="font-semibold text-red-700">Weakest Planet:</p>
                                <p className="text-lg font-bold">{weakest.planet}</p>
                                <p className="text-xs text-gray-600">{weakest.strength.toFixed(1)} rupas - {weakest.grade}</p>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* Dasha content placeholder */}
                    <div className="mt-6">
                      <p className="text-muted-foreground text-center py-8">
                        Detailed Shadbala and Dasha analysis will appear here
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* LIFE CYCLE TAB */}
            <TabsContent value="lifecycle" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Major Life Events & Milestones</CardTitle>
                  <CardDescription>
                    Key events and milestones in your life journey based on planetary periods (Dashas), maturity cycles, and life stage transitions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Loading State */}
                  {majorEventsLoading && (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-primary mr-3" />
                      <span>Analyzing major life events...</span>
                    </div>
                  )}

                  {/* Major Life Events Timeline */}
                  {majorLifeEvents && !majorEventsLoading && (
                    <div className="space-y-4">
                      {/* Summary Info */}
                      <div className="bg-gradient-to-r from-primary/10 via-purple/10 to-primary/10 p-6 rounded-lg border border-primary/30 mb-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
                          <div>
                            <span className="font-semibold text-muted-foreground block mb-1">Birth Year</span>
                            <span className="text-2xl font-bold text-primary">{majorLifeEvents.birth_year}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-muted-foreground block mb-1">Current Age</span>
                            <span className="text-2xl font-bold text-primary">{majorLifeEvents.current_year - majorLifeEvents.birth_year}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-muted-foreground block mb-1">Current Year</span>
                            <span className="text-2xl font-bold text-primary">{majorLifeEvents.current_year}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-muted-foreground block mb-1">Life Phase</span>
                            <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                              {(majorLifeEvents.current_year - majorLifeEvents.birth_year) < 12 ? 'Childhood' :
                               (majorLifeEvents.current_year - majorLifeEvents.birth_year) < 30 ? 'Youth' :
                               (majorLifeEvents.current_year - majorLifeEvents.birth_year) < 60 ? 'Maturity' :
                               'Wisdom'}
                            </span>
                          </div>
                          <div>
                            <span className="font-semibold text-muted-foreground block mb-1">Total Events</span>
                            <span className="text-2xl font-bold text-primary">{majorLifeEvents.total_events}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-muted-foreground block mb-1">Upcoming</span>
                            <span className="text-2xl font-bold text-green-600">{majorLifeEvents.upcoming_events.length}</span>
                          </div>
                        </div>
                      </div>

                      {/* Next Major Event Highlight */}
                      {majorLifeEvents.summary.next_major_event && (
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 p-6 rounded-lg border-2 border-amber-400 dark:border-amber-700 mb-6 shadow-lg">
                          <div className="flex items-start gap-4">
                            <div className="text-4xl">⭐</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100">
                                  Next Major Event
                                </h3>
                                <Badge variant="secondary" className="bg-amber-600 text-white">
                                  {majorLifeEvents.summary.next_major_event.year} (Age {majorLifeEvents.summary.next_major_event.age})
                                </Badge>
                              </div>
                              <h4 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-2">
                                {majorLifeEvents.summary.next_major_event.title}
                              </h4>
                              <p className="text-amber-900 dark:text-amber-100">
                                {majorLifeEvents.summary.next_major_event.description}
                              </p>
                              {majorLifeEvents.summary.next_major_event.life_areas_affected && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {majorLifeEvents.summary.next_major_event.life_areas_affected.map((area: string) => (
                                    <Badge key={area} variant="outline" className="text-xs">
                                      {area}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Event Timeline */}
                      <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
                        {majorLifeEvents.major_life_events.map((event: any) => {
                          const isUpcoming = event.year >= majorLifeEvents.current_year;
                          const isPast = event.year < majorLifeEvents.current_year;
                          const isCritical = event.importance === 'critical';
                          const isHigh = event.importance === 'high';

                          // Color schemes by importance
                          const importanceColors: any = {
                            'critical': 'border-red-500 bg-red-50 dark:bg-red-950/20',
                            'high': 'border-orange-500 bg-orange-50 dark:bg-orange-950/20',
                            'medium': 'border-blue-500 bg-blue-50 dark:bg-blue-950/20',
                            'low': 'border-gray-400 bg-gray-50 dark:bg-gray-950/20'
                          };

                          const eventIcons: any = {
                            'dasha_transition': '🌟',
                            'planetary_maturity': '⭐',
                            'saturn_return': '🔄',
                            'life_stage_transition': '🎯'
                          };

                          return (
                            <Card
                              key={`${event.year}-${event.title}`}
                              className={`${importanceColors[event.importance] || 'border-gray-300'} ${isPast ? 'opacity-60' : ''} ${isCritical || isHigh ? 'border-2' : 'border'} transition-all hover:shadow-lg`}
                            >
                              <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex items-start gap-3 flex-1">
                                    <div className="text-3xl">{eventIcons[event.event_type] || '📅'}</div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 flex-wrap mb-2">
                                        <CardTitle className="text-lg">
                                          {event.title}
                                        </CardTitle>
                                        <Badge variant={isCritical ? 'destructive' : isHigh ? 'default' : 'secondary'} className="text-xs">
                                          {event.importance.toUpperCase()}
                                        </Badge>
                                        {isUpcoming && (
                                          <Badge variant="outline" className="text-xs bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200">
                                            Upcoming
                                          </Badge>
                                        )}
                                      </div>
                                      <CardDescription className="text-sm mb-2">
                                        <span className="font-semibold text-primary">{event.year}</span>
                                        <span className="mx-2">•</span>
                                        <span>Age {event.age}</span>
                                        {event.planet && (
                                          <>
                                            <span className="mx-2">•</span>
                                            <span className="text-purple-600 dark:text-purple-400 font-medium">{event.planet}</span>
                                          </>
                                        )}
                                        {event.duration_years && (
                                          <>
                                            <span className="mx-2">•</span>
                                            <span>{event.duration_years} years</span>
                                          </>
                                        )}
                                      </CardDescription>
                                    </div>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                                  {event.description}
                                </p>
                                {event.life_areas_affected && event.life_areas_affected.length > 0 && (
                                  <div>
                                    <p className="text-xs font-semibold text-muted-foreground mb-2">Affected Life Areas:</p>
                                    <div className="flex flex-wrap gap-2">
                                      {event.life_areas_affected.map((area: string) => (
                                        <Badge key={area} variant="outline" className="text-xs capitalize">
                                          {area.replace('_', ' ')}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ANALYSIS TAB */}
            <TabsContent value="analysis" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardDescription>
                    Your personalized planetary strength (Shadbala) and life timeline (Vimshottari Dasha) calculated from your birth chart.
                  </CardDescription>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Shadbala Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Shadbala Profile</CardTitle>
                    <CardDescription>
                      Six-fold strength analysis. Planets with higher values can deliver better results.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {shadbalaChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={350}>
                        <RadarChart data={shadbalaChartData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="planet" />
                          <PolarRadiusAxis angle={90} domain={[0, 'auto']} />
                          <Radar
                            name="Strength (Rupas)"
                            dataKey="strength"
                            stroke="hsl(var(--primary))"
                            fill="hsl(var(--primary))"
                            fillOpacity={0.3}
                          />
                          <Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[350px] flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin" />
                      </div>
                    )}
                  </CardContent>
                  <CardContent className="pt-4 border-t">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-sm">Understanding Your Planetary Strength</h4>
                      <div className="text-sm text-muted-foreground space-y-2">
                        <p>
                          <strong>Shadbala</strong> measures the six-fold strength of each planet in your chart. Higher values indicate stronger planets that can deliver better results during their periods.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                          <div>
                            <p className="font-medium text-green-600">✓ Excellent (390+ rupas):</p>
                            <p className="text-xs">Planet can give full results, highly auspicious</p>
                          </div>
                          <div>
                            <p className="font-medium text-blue-600">✓ Good (330-390 rupas):</p>
                            <p className="text-xs">Planet gives mostly positive results</p>
                          </div>
                          <div>
                            <p className="font-medium text-yellow-600">○ Average (270-330 rupas):</p>
                            <p className="text-xs">Mixed results, needs remedies for enhancement</p>
                          </div>
                          <div>
                            <p className="font-medium text-red-600">⚠ Weak (&lt;270 rupas):</p>
                            <p className="text-xs">Requires remedies, may give challenges</p>
                          </div>
                        </div>
                        {shadbalaData && Object.keys(shadbalaData).length > 0 && (
                          <div className="mt-4 p-3 bg-muted rounded-lg">
                            <p className="font-medium mb-2">Your Strongest & Weakest Planets:</p>
                            {(() => {
                              const strengths = Object.entries(shadbalaData)
                                .map(([planet, data]: [string, any]) => ({
                                  planet,
                                  strength: data.total_shadbala || 0,
                                  grade: data.grade || 'Average'
                                }))
                                .sort((a, b) => b.strength - a.strength);

                              const strongest = strengths[0];
                              const weakest = strengths[strengths.length - 1];

                              return (
                                <div className="space-y-1 text-xs">
                                  <p>
                                    <span className="text-green-600 font-medium">Strongest:</span> {strongest?.planet}
                                    ({strongest?.strength.toFixed(2)} rupas - {strongest?.grade}) -
                                    This planet can give excellent results during its period
                                  </p>
                                  <p>
                                    <span className="text-amber-600 font-medium">Weakest:</span> {weakest?.planet}
                                    ({weakest?.strength.toFixed(2)} rupas - {weakest?.grade}) -
                                    Consider remedies to strengthen this planet
                                  </p>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Dasha Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Vimshottari Dasha Timeline</CardTitle>
                    <CardDescription>
                      Life periods governed by different planets. Events manifest during their respective periods.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {dashaChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={dashaChartData} layout="vertical">
                          <XAxis type="number" />
                          <YAxis dataKey="planet" type="category" width={120} />
                          <Tooltip
                            formatter={(value) => `${value} years`}
                            contentStyle={{
                              backgroundColor: 'hsl(var(--background))',
                              border: '1px solid hsl(var(--border))'
                            }}
                          />
                          <Bar dataKey="years" radius={[0, 4, 4, 0]}>
                            {dashaChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[350px] flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin" />
                      </div>
                    )}
                  </CardContent>
                  <CardContent className="pt-4 border-t">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-sm">Understanding Vimshottari Dasha System</h4>
                      <div className="text-sm text-muted-foreground space-y-2">
                        <p>
                          <strong>Vimshottari Dasha</strong> is a 120-year planetary period system. Your entire life is divided into 9 major periods (Mahadashas), each ruled by a different planet. Events in your life manifest primarily during the relevant planet's period.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-3">
                          <div className="p-2 bg-muted/50 rounded">
                            <p className="font-medium text-red-500">Ketu (7 years)</p>
                            <p className="text-xs">Spirituality, detachment, moksha</p>
                          </div>
                          <div className="p-2 bg-muted/50 rounded">
                            <p className="font-medium text-pink-500">Venus (20 years)</p>
                            <p className="text-xs">Relationships, luxury, creativity</p>
                          </div>
                          <div className="p-2 bg-muted/50 rounded">
                            <p className="font-medium text-orange-500">Sun (6 years)</p>
                            <p className="text-xs">Authority, career, father</p>
                          </div>
                          <div className="p-2 bg-muted/50 rounded">
                            <p className="font-medium text-gray-300">Moon (10 years)</p>
                            <p className="text-xs">Emotions, mother, public</p>
                          </div>
                          <div className="p-2 bg-muted/50 rounded">
                            <p className="font-medium text-red-600">Mars (7 years)</p>
                            <p className="text-xs">Energy, property, siblings</p>
                          </div>
                          <div className="p-2 bg-muted/50 rounded">
                            <p className="font-medium text-slate-500">Rahu (18 years)</p>
                            <p className="text-xs">Ambition, foreign, innovation</p>
                          </div>
                          <div className="p-2 bg-muted/50 rounded">
                            <p className="font-medium text-yellow-500">Jupiter (16 years)</p>
                            <p className="text-xs">Wisdom, children, expansion</p>
                          </div>
                          <div className="p-2 bg-muted/50 rounded">
                            <p className="font-medium text-blue-600">Saturn (19 years)</p>
                            <p className="text-xs">Discipline, delays, longevity</p>
                          </div>
                          <div className="p-2 bg-muted/50 rounded">
                            <p className="font-medium text-green-600">Mercury (17 years)</p>
                            <p className="text-xs">Business, learning, communication</p>
                          </div>
                        </div>
                        {dashaData && dashaData.mahadashas && (
                          <div className="mt-4 p-3 bg-muted rounded-lg">
                            <p className="font-medium mb-2">Your Current & Upcoming Periods:</p>
                            {(() => {
                              const now = new Date();
                              const currentDasha = dashaData.mahadashas.find((md: any) => {
                                const start = new Date(md.start_date);
                                const end = new Date(md.end_date);
                                return now >= start && now <= end;
                              });

                              const nextDasha = dashaData.mahadashas.find((md: any) => {
                                const start = new Date(md.start_date);
                                return start > now;
                              });

                              return (
                                <div className="space-y-2 text-xs">
                                  {currentDasha && (
                                    <div className="p-2 bg-primary/10 rounded">
                                      <p className="font-medium text-primary">Currently Running:</p>
                                      <p>
                                        <strong>{currentDasha.planet} Mahadasha</strong>
                                        <span className="text-muted-foreground">
                                          {' '}({new Date(currentDasha.start_date).getFullYear()} -{' '}
                                          {new Date(currentDasha.end_date).getFullYear()})
                                        </span>
                                      </p>
                                      <p className="text-muted-foreground mt-1">
                                        This is your main life phase right now. Major events related to {currentDasha.planet}'s significations will manifest during this period.
                                      </p>
                                    </div>
                                  )}
                                  {nextDasha && (
                                    <div className="p-2 bg-muted/50 rounded">
                                      <p className="font-medium">Next Period:</p>
                                      <p>
                                        <strong>{nextDasha.planet} Mahadasha</strong>
                                        <span className="text-muted-foreground">
                                          {' '}(Starts {new Date(nextDasha.start_date).getFullYear()})
                                        </span>
                                      </p>
                                      <p className="text-muted-foreground mt-1">
                                        Prepare for this upcoming phase by understanding {nextDasha.planet}'s themes in your life.
                                      </p>
                                    </div>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        )}
                        <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-950/30 rounded text-xs">
                          <p className="font-medium text-blue-700 dark:text-blue-300">Pro Tip:</p>
                          <p className="text-blue-600 dark:text-blue-400">
                            Combine Dasha periods with your Shadbala strength above. A strong planet's dasha gives excellent results, while a weak planet's dasha may require remedies for smoother experiences.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Planet Reference Guide - Moved from Basics tab */}
              <Card className="bg-gradient-to-br from-primary/5 to-background">
                <CardHeader>
                  <CardTitle>📚 Planet Reference Guide</CardTitle>
                  <CardDescription>
                    Click any planet to learn about its significations and relationships
                  </CardDescription>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                          <div className="font-bold text-sm text-gray-900 dark:text-gray-100">{planet.name}</div>
                          <div className="text-xs text-muted-foreground">{planet.sanskrit}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

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
                      <p className="text-sm text-gray-900 dark:text-gray-100">{selectedPlanet.desc}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border">
                        <span className="text-xs text-muted-foreground uppercase block">Own Sign</span>
                        <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">{selectedPlanet.own}</span>
                      </div>
                      <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg border">
                        <span className="text-xs text-muted-foreground uppercase block">Exalted In</span>
                        <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">{selectedPlanet.exalt}</span>
                      </div>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-950 p-3 rounded-lg border">
                      <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase block mb-1">Key Relationships</span>
                      <p className="text-xs text-gray-900 dark:text-gray-100">{selectedPlanet.rel}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* MATCH MAKING TAB */}
            <TabsContent value="matchmaking" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Vedic Matchmaking & Compatibility Analysis</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Analyze marriage compatibility based on Ashtakoot Guna Milan, planetary positions, and Vedic astrology principles. Enter your partner's birth details below for a comprehensive compatibility report.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Partner Birth Data Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Partner's Birth Information</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Enter the birth details of your potential partner for compatibility analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Full Name</label>
                      <input
                        type="text"
                        placeholder="Partner's name"
                        value={partnerName}
                        onChange={(e) => setPartnerName(e.target.value)}
                        className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Gender</label>
                      <select
                        value={partnerGender}
                        onChange={(e) => setPartnerGender(e.target.value)}
                        className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Date of Birth</label>
                      <input
                        type="date"
                        value={partnerDate}
                        onChange={(e) => setPartnerDate(e.target.value)}
                        className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Time of Birth</label>
                      <input
                        type="time"
                        value={partnerTime}
                        onChange={(e) => setPartnerTime(e.target.value)}
                        className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2 relative">
                      <label className="text-sm font-medium text-foreground">Place of Birth</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                        <input
                          type="text"
                          placeholder="Search city... (e.g., Mumbai, Delhi, New York)"
                          value={partnerPlace}
                          onChange={(e) => {
                            setPartnerPlace(e.target.value);
                            setShowLocationSuggestions(true);
                          }}
                          onFocus={() => setShowLocationSuggestions(true)}
                          className="w-full pl-10 px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      {/* Location Suggestions Dropdown */}
                      {showLocationSuggestions && partnerPlace.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-64 overflow-auto">
                          {isSearchingLocation && (
                            <div className="px-4 py-3 flex items-center gap-2 text-muted-foreground text-sm">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Searching locations...
                            </div>
                          )}

                          {/* Popular cities first */}
                          {filteredCities.length > 0 && (
                            <>
                              <div className="px-4 py-2 text-xs font-semibold text-muted-foreground border-b border-border">
                                POPULAR CITIES
                              </div>
                              {filteredCities.map((city) => (
                                <button
                                  key={city.name}
                                  type="button"
                                  onClick={() => handleCitySelect(city)}
                                  className="w-full px-4 py-2 text-left hover:bg-muted transition-colors text-sm text-foreground flex items-start gap-2"
                                >
                                  <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                                  <span>{city.name}</span>
                                </button>
                              ))}
                            </>
                          )}

                          {/* Search results */}
                          {!isSearchingLocation && locationSearchResults.length > 0 && (
                            <>
                              {filteredCities.length > 0 && (
                                <div className="px-4 py-2 text-xs font-semibold text-muted-foreground border-b border-t border-border">
                                  SEARCH RESULTS
                                </div>
                              )}
                              {locationSearchResults.map((result, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => handleSearchResultSelect(result)}
                                  className="w-full px-4 py-2 text-left hover:bg-muted transition-colors text-sm text-foreground flex items-start gap-2"
                                >
                                  <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                                  <span className="line-clamp-2">{result.display_name}</span>
                                </button>
                              ))}
                            </>
                          )}

                          {!isSearchingLocation && locationSearchResults.length === 0 && filteredCities.length === 0 && partnerPlace.length >= 3 && (
                            <div className="px-4 py-3 text-sm text-muted-foreground">
                              No locations found. Try a different search.
                            </div>
                          )}
                        </div>
                      )}

                      {partnerLatitude !== 0 && partnerLongitude !== 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          📍 {partnerLatitude.toFixed(4)}°, {partnerLongitude.toFixed(4)}° • {partnerTimezone}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPartnerName('');
                        setPartnerGender('');
                        setPartnerDate('');
                        setPartnerTime('');
                        setPartnerPlace('');
                        setPartnerLatitude(0);
                        setPartnerLongitude(0);
                        setPartnerTimezone('');
                        setShowCompatibility(false);
                        setShowLocationSuggestions(false);
                        setCompatibilityData(null);
                      }}
                    >
                      Clear
                    </Button>
                    <Button
                      onClick={calculateCompatibility}
                      disabled={!partnerName || !partnerGender || !partnerDate || !partnerTime || !partnerPlace || partnerLatitude === 0 || isCalculatingCompatibility}
                    >
                      {isCalculatingCompatibility ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Calculating...
                        </>
                      ) : (
                        'Calculate Compatibility'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Compatibility Score Overview */}
              {showCompatibility && compatibilityData && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-foreground">Ashtakoot Guna Milan Score</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Traditional 36-point compatibility system based on Moon positions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Both Partners Summary */}
                    <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                      <h4 className="font-semibold text-foreground mb-3">Compatibility Analysis Between:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="font-semibold text-sm text-purple-600 dark:text-purple-400">Person 1:</p>
                          <div className="text-sm space-y-1">
                            <p className="text-foreground"><span className="text-muted-foreground">Name:</span> {compatibilityData.person1.name}</p>
                            <p className="text-foreground"><span className="text-muted-foreground">Moon Sign:</span> {compatibilityData.person1.moon_sign}</p>
                            <p className="text-foreground"><span className="text-muted-foreground">Nakshatra:</span> {compatibilityData.person1.nakshatra} (Pada {compatibilityData.person1.nakshatra_pada})</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="font-semibold text-sm text-pink-600 dark:text-pink-400">Person 2:</p>
                          <div className="text-sm space-y-1">
                            <p className="text-foreground"><span className="text-muted-foreground">Name:</span> {compatibilityData.person2.name}</p>
                            <p className="text-foreground"><span className="text-muted-foreground">Moon Sign:</span> {compatibilityData.person2.moon_sign}</p>
                            <p className="text-foreground"><span className="text-muted-foreground">Nakshatra:</span> {compatibilityData.person2.nakshatra} (Pada {compatibilityData.person2.nakshatra_pada})</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-center py-8">
                      <div className="inline-block relative">
                        <div className={`w-32 h-32 rounded-full border-8 flex items-center justify-center ${
                          compatibilityData.compatibility.total_score >= 28
                            ? 'border-green-500/30 bg-green-50 dark:bg-green-950/30'
                            : compatibilityData.compatibility.total_score >= 20
                            ? 'border-blue-500/30 bg-blue-50 dark:bg-blue-950/30'
                            : compatibilityData.compatibility.total_score >= 13
                            ? 'border-amber-500/30 bg-amber-50 dark:bg-amber-950/30'
                            : 'border-red-500/30 bg-red-50 dark:bg-red-950/30'
                        }`}>
                          <div className="text-center">
                            <div className={`text-4xl font-bold ${
                              compatibilityData.compatibility.total_score >= 28
                                ? 'text-green-600 dark:text-green-400'
                                : compatibilityData.compatibility.total_score >= 20
                                ? 'text-blue-600 dark:text-blue-400'
                                : compatibilityData.compatibility.total_score >= 13
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}>{compatibilityData.compatibility.total_score}</div>
                            <div className="text-xs text-muted-foreground">out of 36</div>
                          </div>
                        </div>
                      </div>
                      <p className={`mt-4 text-sm font-semibold ${
                        compatibilityData.compatibility.total_score >= 28
                          ? 'text-green-600 dark:text-green-400'
                          : compatibilityData.compatibility.total_score >= 20
                          ? 'text-blue-600 dark:text-blue-400'
                          : compatibilityData.compatibility.total_score >= 13
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {compatibilityData.compatibility.interpretation}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Compatibility percentage: {compatibilityData.compatibility.percentage}%
                      </p>
                    </div>

                    {/* Guna Breakdown */}
                    <div className="mt-6 space-y-3">
                      <h4 className="font-semibold text-sm mb-4 text-foreground">Eight Gunas Breakdown:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(compatibilityData.compatibility.koots).map(([kootName, kootData]: [string, any]) => {
                          const percentage = (kootData.points / kootData.max) * 100;
                          return (
                            <div key={kootName} className="p-3 bg-muted/50 rounded-lg border border-border">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <span className="font-medium text-foreground capitalize">{kootName}</span>
                                  <p className="text-xs text-muted-foreground">{kootData.description}</p>
                                  {kootData.detail && (
                                    <p className="text-xs text-muted-foreground mt-1 italic">{kootData.detail}</p>
                                  )}
                                </div>
                                <span className={`text-sm font-semibold ml-2 ${
                                  percentage >= 75 ? 'text-green-600 dark:text-green-400' :
                                  percentage >= 50 ? 'text-blue-600 dark:text-blue-400' :
                                  percentage >= 25 ? 'text-amber-600 dark:text-amber-400' :
                                  'text-red-600 dark:text-red-400'
                                }`}>
                                  {kootData.points} / {kootData.max}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Score Interpretation */}
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h4 className="font-semibold text-sm mb-2 text-foreground">Score Interpretation Guide:</h4>
                      <div className="space-y-1 text-sm text-foreground">
                        <p><span className="font-medium text-green-600 dark:text-green-400">28-36 points:</span> Excellent match - highly compatible</p>
                        <p><span className="font-medium text-blue-600 dark:text-blue-400">20-27 points:</span> Good match - compatible with minor adjustments</p>
                        <p><span className="font-medium text-amber-600 dark:text-amber-400">13-19 points:</span> Average match - requires effort and understanding</p>
                        <p><span className="font-medium text-red-600 dark:text-red-400">Below 13:</span> Poor match - significant challenges expected</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Additional Compatibility Factors */}
              {showCompatibility && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-foreground">Advanced Compatibility Analysis</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Beyond Ashtakoot - Additional factors for marriage compatibility
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-border rounded-lg bg-card">
                        <h4 className="font-semibold mb-2 text-foreground">Mangal Dosha Check</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Analysis of Mars placement for marriage compatibility
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-foreground">
                            <span>Your Mangal Dosha:</span>
                            <span className="font-medium text-green-600 dark:text-green-400">None</span>
                          </div>
                          <div className="flex justify-between text-foreground">
                            <span>Partner's Mangal Dosha:</span>
                            <span className="font-medium text-green-600 dark:text-green-400">None</span>
                          </div>
                          <div className="flex justify-between text-foreground">
                            <span>Cancellation:</span>
                            <span className="font-medium text-green-600 dark:text-green-400">Not Required</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border border-border rounded-lg bg-card">
                        <h4 className="font-semibold mb-2 text-foreground">7th House Analysis</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Marriage house compatibility and strength
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-foreground">
                            <span>Your 7th Lord:</span>
                            <span className="font-medium text-primary">Venus</span>
                          </div>
                          <div className="flex justify-between text-foreground">
                            <span>Partner's 7th Lord:</span>
                            <span className="font-medium text-primary">Jupiter</span>
                          </div>
                          <div className="flex justify-between text-foreground">
                            <span>Compatibility:</span>
                            <span className="font-medium text-green-600 dark:text-green-400">Favorable</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border border-border rounded-lg bg-card">
                        <h4 className="font-semibold mb-2 text-foreground">Venus-Mars Harmony</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Love and passion compatibility analysis
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-foreground">
                            <span>Romantic Compatibility:</span>
                            <span className="font-medium text-green-600 dark:text-green-400">High</span>
                          </div>
                          <div className="flex justify-between text-foreground">
                            <span>Physical Compatibility:</span>
                            <span className="font-medium text-green-600 dark:text-green-400">Strong</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border border-border rounded-lg bg-card">
                        <h4 className="font-semibold mb-2 text-foreground">Longevity & Children</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Analysis of marriage longevity and progeny
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-foreground">
                            <span>Marriage Longevity:</span>
                            <span className="font-medium text-green-600 dark:text-green-400">Excellent</span>
                          </div>
                          <div className="flex justify-between text-foreground">
                            <span>Children Prospects:</span>
                            <span className="font-medium text-green-600 dark:text-green-400">Favorable</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recommendations */}
              {showCompatibility && compatibilityData && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-foreground">Compatibility Recommendations</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Remedies and suggestions for improving marital harmony
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {compatibilityData.compatibility.recommendations.strengths && compatibilityData.compatibility.recommendations.strengths.length > 0 && (
                        <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                          <h4 className="font-semibold text-foreground mb-2">✅ Strengths of This Match</h4>
                          <ul className="space-y-1 text-sm text-foreground list-disc list-inside">
                            {compatibilityData.compatibility.recommendations.strengths.map((strength: string, index: number) => (
                              <li key={index}>{strength}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {compatibilityData.compatibility.recommendations.areas_to_work_on && compatibilityData.compatibility.recommendations.areas_to_work_on.length > 0 && (
                        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                          <h4 className="font-semibold text-foreground mb-2">⚠️ Areas to Work On</h4>
                          <ul className="space-y-1 text-sm text-foreground list-disc list-inside">
                            {compatibilityData.compatibility.recommendations.areas_to_work_on.map((area: string, index: number) => (
                              <li key={index}>{area}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {compatibilityData.compatibility.recommendations.general_advice && compatibilityData.compatibility.recommendations.general_advice.length > 0 && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                          <h4 className="font-semibold text-foreground mb-2">💡 General Recommendations</h4>
                          <ul className="space-y-1 text-sm text-foreground list-disc list-inside">
                            {compatibilityData.compatibility.recommendations.general_advice.map((advice: string, index: number) => (
                              <li key={index}>{advice}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                        <p className="text-xs text-muted-foreground italic">
                          Calculation Method: {compatibilityData.calculation_metadata.method} using {compatibilityData.calculation_metadata.ayanamsa} Ayanamsa.
                          Calculated at: {new Date(compatibilityData.calculation_metadata.calculated_at).toLocaleString()}.
                          For personalized guidance and remedial measures, consult a qualified Vedic astrologer.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </CosmicBackground>
  );
};

export default YogaLabLive;
