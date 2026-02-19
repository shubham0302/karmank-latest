/**
 * Astrology API Service
 * Connects React frontend to FastAPI backend
 */

const API_BASE_URL = import.meta.env.VITE_ASTROLOGY_API_URL || 'http://localhost:8000';

export interface BirthData {
  birth_datetime: string; // ISO format: "1990-05-15T14:30:00"
  latitude: number;
  longitude: number;
  timezone?: string;
  ayanamsa?: string;
  location_name?: string;
  // Optional form-origin fields kept for compatibility across pages/components
  name?: string;
  birthDate?: Date;
  birthTime?: string;
  birthLocation?: string;
}

export interface BirthChart {
  planets: {
    [key: string]: {
      longitude: number;
      latitude: number;
      speed: number;
      is_retrograde: boolean;
      house: number;
      sign: string;
      sign_lord: string;
      nakshatra: string;
      nakshatra_lord: string;
      nakshatra_pada: number;
    };
  };
  houses: number[];
  ascendant: {
    longitude: number;
    sign: string;
    sign_lord: string;
  };
  metadata: {
    birth_datetime: string;
    location: {
      latitude: number;
      longitude: number;
    };
    ayanamsa_used: string;
    ayanamsa_value: number;
  };
}

export interface Yoga {
  name: string;
  category: string;
  sanskrit_name: string;
  formation_rule: string;
  results: string;
  strength: string;
  planets_involved: string[];
  houses_involved: number[];
  is_present: boolean;
  // New interpretive fields
  description?: string;
  effects?: string;
  practical_guidance?: string;
  what_is_this_yoga?: string;
  life_impact?: string;
  positive_manifestations?: string;
  potential_challenges?: string;
  strength_percentage?: number;
  peak_activation_year?: number | null;
  peak_activation_age?: number | null;
}

export interface YogaAnalysis {
  summary: {
    total_yogas_detected: number;
    currently_active: number;
    upcoming_10_years: number;
  };
  all_yogas: Yoga[];
  current_active_yogas: any[];
  upcoming_activations: any[];
}

export interface ShadbalaResult {
  planet: string;
  total_shadbala: number;
  sthana_bala: number;
  dig_bala: number;
  kala_bala: number;
  cheshta_bala: number;
  naisargika_bala: number;
  drik_bala: number;
  required_minimum: number;
  is_strong: boolean;
  grade: string;
  strength_percentage?: number;
}

export interface DashaPeriod {
  planet: string;
  start_date: string;
  end_date: string;
  level: 'Mahadasha' | 'Antardasha' | 'Pratyantardasha';
  parent_dasha?: string;
  antardashas?: DashaPeriod[];
  pratyantardashas?: DashaPeriod[];
}

// ============================================================================
// BIRTH CHART API
// ============================================================================

export async function calculateBirthChart(birthData: BirthData): Promise<BirthChart> {
  const response = await fetch(`${API_BASE_URL}/api/chart/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(birthData),
  });

  if (!response.ok) {
    throw new Error(`Failed to calculate birth chart: ${response.statusText}`);
  }

  const data = await response.json();
  const rawChart = data.chart;

  // Transform backend response to match frontend interface
  const transformedChart: BirthChart = {
    planets: {} as any,
    houses: rawChart.houses || [],
    ascendant: {
      longitude: rawChart.ascendant.degree,
      sign: rawChart.ascendant.sign_name,
      sign_lord: rawChart.ascendant.sign_lord || 'Unknown',
      // Add Western (Tropical) sign
      sign_name_tropical: (rawChart.ascendant as any).sign_name_tropical || 'N/A',
      longitude_tropical: (rawChart.ascendant as any).degree_tropical || 0
    } as any,
    metadata: {
      birth_datetime: birthData.birth_datetime, // Use the actual birth datetime, not calculation time
      location: {
        latitude: birthData.latitude,
        longitude: birthData.longitude
      },
      ayanamsa_used: rawChart.calculation_metadata?.ayanamsa_type || 'LAHIRI',
      ayanamsa_value: rawChart.calculation_metadata?.ayanamsa_degrees || 0
    }
  };

  // Transform planets
  for (const [planetName, planetData] of Object.entries(rawChart.planets || {})) {
    transformedChart.planets[planetName] = {
      longitude: (planetData as any).longitude_sidereal,
      latitude: (planetData as any).latitude,
      speed: (planetData as any).speed,
      is_retrograde: (planetData as any).is_retrograde,
      house: (planetData as any).house_num || 1,
      sign: (planetData as any).sign_name,
      sign_lord: (planetData as any).sign_lord || 'Unknown',
      nakshatra: (planetData as any).nakshatra_name,
      nakshatra_lord: (planetData as any).nakshatra_lord || 'Unknown',
      nakshatra_pada: (planetData as any).nakshatra_pada,
      // Add Western (Tropical) sign
      sign_tropical: (planetData as any).sign_name_tropical || 'N/A',
      longitude_tropical: (planetData as any).longitude_tropical || 0
    } as any;
  }

  return transformedChart;
}

// ============================================================================
// YOGA DETECTION API
// ============================================================================

export async function detectYogas(birthData: BirthData): Promise<YogaAnalysis> {
  const response = await fetch(`${API_BASE_URL}/api/yogas/detect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      birth_data: birthData,
      include_timing: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to detect yogas: ${response.statusText}`);
  }

  const data = await response.json();
  return data.yoga_analysis;
}

export async function getCurrentActiveYogas(birthData: BirthData): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/api/yogas/current-active`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(birthData),
  });

  if (!response.ok) {
    throw new Error(`Failed to get current yogas: ${response.statusText}`);
  }

  const data = await response.json();
  return data.current_active_yogas;
}

export async function getUpcomingYogaActivations(
  birthData: BirthData,
  yearsAhead: number = 10
): Promise<any[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/yogas/upcoming?years_ahead=${yearsAhead}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(birthData),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get upcoming yogas: ${response.statusText}`);
  }

  const data = await response.json();
  return data.upcoming_activations;
}

export async function getYogasByCategory(
  birthData: BirthData,
  category: string
): Promise<Yoga[]> {
  const response = await fetch(`${API_BASE_URL}/api/yogas/by-category/${category}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(birthData),
  });

  if (!response.ok) {
    throw new Error(`Failed to get yogas by category: ${response.statusText}`);
  }

  const data = await response.json();
  return data.yogas;
}

// ============================================================================
// SHADBALA API
// ============================================================================

export async function calculateShadbala(birthData: BirthData): Promise<{
  [planet: string]: ShadbalaResult;
}> {
  const response = await fetch(`${API_BASE_URL}/api/shadbala/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(birthData),
  });

  if (!response.ok) {
    throw new Error(`Failed to calculate Shadbala: ${response.statusText}`);
  }

  const data = await response.json();
  return data.shadbala_analysis?.planetary_strengths || data.shadbala_results;
}

export async function getPlanetShadbala(
  birthData: BirthData,
  planet: string
): Promise<ShadbalaResult> {
  const response = await fetch(`${API_BASE_URL}/api/shadbala/planet/${planet}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(birthData),
  });

  if (!response.ok) {
    throw new Error(`Failed to get planet Shadbala: ${response.statusText}`);
  }

  const data = await response.json();
  return data.shadbala;
}

export async function getStrongestPlanet(birthData: BirthData): Promise<{
  planet: string;
  strength: number;
}> {
  const response = await fetch(`${API_BASE_URL}/api/shadbala/strongest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(birthData),
  });

  if (!response.ok) {
    throw new Error(`Failed to get strongest planet: ${response.statusText}`);
  }

  return response.json();
}

export async function getWeakPlanets(birthData: BirthData): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/api/shadbala/weak-planets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(birthData),
  });

  if (!response.ok) {
    throw new Error(`Failed to get weak planets: ${response.statusText}`);
  }

  const data = await response.json();
  return data.weak_planets;
}

// ============================================================================
// DASHA API
// ============================================================================

export async function getCurrentDasha(birthData: BirthData): Promise<{
  mahadasha: DashaPeriod;
  antardasha: DashaPeriod;
  pratyantardasha: DashaPeriod;
}> {
  const response = await fetch(`${API_BASE_URL}/api/dasha/current`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(birthData),
  });

  if (!response.ok) {
    throw new Error(`Failed to get current dasha: ${response.statusText}`);
  }

  return response.json();
}

export async function getDashaTimeline(birthData: BirthData): Promise<{
  mahadashas: DashaPeriod[];
  birth_nakshatra: string;
  birth_nakshatra_lord: string;
}> {
  const response = await fetch(`${API_BASE_URL}/api/dasha/timeline`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(birthData),
  });

  if (!response.ok) {
    throw new Error(`Failed to get dasha timeline: ${response.statusText}`);
  }

  const data = await response.json();
  return data.timeline || data;
}

export async function getMahadashaDetail(
  birthData: BirthData,
  planet: string
): Promise<{
  mahadasha: DashaPeriod;
  antardashas: DashaPeriod[];
}> {
  const response = await fetch(`${API_BASE_URL}/api/dasha/mahadasha-detail`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...birthData,
      mahadasha_lord: planet,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get Mahadasha detail: ${response.statusText}`);
  }

  return response.json();
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Convert form data to BirthData API format
 */
export function formatBirthDataForAPI(formData: {
  birthDate: Date;
  birthTime: string;
  latitude: number;
  longitude: number;
  timezone: string;
}): BirthData {
  // Combine date and time - keep in LOCAL time format, not UTC
  const [hours, minutes] = formData.birthTime.split(':').map(Number);
  const birthDateTime = new Date(formData.birthDate);
  birthDateTime.setHours(hours, minutes, 0, 0);

  // Format as local datetime string (YYYY-MM-DDTHH:MM:SS) without converting to UTC
  const year = birthDateTime.getFullYear();
  const month = String(birthDateTime.getMonth() + 1).padStart(2, '0');
  const day = String(birthDateTime.getDate()).padStart(2, '0');
  const hour = String(birthDateTime.getHours()).padStart(2, '0');
  const minute = String(birthDateTime.getMinutes()).padStart(2, '0');
  const second = String(birthDateTime.getSeconds()).padStart(2, '0');
  const localDateTimeString = `${year}-${month}-${day}T${hour}:${minute}:${second}`;

  return {
    birth_datetime: localDateTimeString, // Local time, not UTC
    latitude: formData.latitude,
    longitude: formData.longitude,
    timezone: formData.timezone || 'UTC',
    ayanamsa: 'LAHIRI',
  };
}

/**
 * Calculate age from birth date
 */
export function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format planet name for display
 */
export function getPlanetDisplayName(planet: string): string {
  const names: { [key: string]: string } = {
    Sun: 'Surya (Sun)',
    Moon: 'Chandra (Moon)',
    Mars: 'Kuja (Mars)',
    Mercury: 'Budha (Mercury)',
    Jupiter: 'Guru (Jupiter)',
    Venus: 'Shukra (Venus)',
    Saturn: 'Shani (Saturn)',
    Rahu: 'Rahu',
    Ketu: 'Ketu',
  };
  return names[planet] || planet;
}

/**
 * Get planet icon/symbol
 */
export function getPlanetIcon(planet: string): string {
  const icons: { [key: string]: string } = {
    Sun: '☀️',
    Moon: '☾',
    Mars: '♂',
    Mercury: '☿',
    Jupiter: '♃',
    Venus: '♀',
    Saturn: '♄',
    Rahu: '☊',
    Ketu: '☋',
  };
  return icons[planet] || '●';
}

/**
 * Convert Shadbala results to chart data format
 */
export function shadbalaToChartData(shadbalaResults: {
  [planet: string]: ShadbalaResult;
}): Array<{ planet: string; strength: number }> {
  return Object.entries(shadbalaResults).map(([planet, data]) => ({
    planet: getPlanetDisplayName(planet),
    strength: Math.round(data.total_shadbala),
  }));
}

/**
 * Convert Dasha timeline to chart data format
 */
export function dashaToChartData(mahadashas: DashaPeriod[]): Array<{
  planet: string;
  years: number;
  color: string;
}> {
  const planetColors: { [key: string]: string } = {
    Sun: '#fbbf24',
    Moon: '#e5e7eb',
    Mars: '#ef4444',
    Mercury: '#10b981',
    Jupiter: '#f59e0b',
    Venus: '#ec4899',
    Saturn: '#1e3a8a',
    Rahu: '#4b5563',
    Ketu: '#6b7280',
  };

  return mahadashas.map((dasha) => {
    const startDate = new Date(dasha.start_date);
    const endDate = new Date(dasha.end_date);
    const years = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);

    return {
      planet: getPlanetDisplayName(dasha.planet),
      years: Math.round(years),
      color: planetColors[dasha.planet] || '#6b7280',
    };
  });
}

// ============================================================================
// LIFE PREDICTIONS API
// ============================================================================

export interface LifeAreaPrediction {
  themes: string;
  opportunities: string;
  challenges: string;
  advice: string;
  relevance: 'high' | 'medium' | 'low';
}

export interface YearlyPrediction {
  year: number;
  age: number;
  life_stage: string;
  stage_focus_areas: string[];
  active_mahadasha: {
    planet: string;
    start_date: string;
    end_date: string;
    years_completed: number;
  };
  life_area_predictions: {
    education: LifeAreaPrediction;
    career: LifeAreaPrediction;
    love: LifeAreaPrediction;
    marriage: LifeAreaPrediction;
    wealth: LifeAreaPrediction;
    health: LifeAreaPrediction;
    spirituality: LifeAreaPrediction;
    family: LifeAreaPrediction;
  };
  year_summary: string;
  key_themes: string[];
}

export interface LifePredictionsResponse {
  success: boolean;
  birth_year: number;
  current_year: number;
  prediction_range: {
    start_year: number;
    end_year: number;
    total_years: number;
  };
  life_journey: YearlyPrediction[];
  birth_nakshatra: string;
  metadata: {
    birth_location: {
      latitude: number;
      longitude: number;
    };
    ayanamsa: string;
  };
}

export async function getYearlyLifePredictions(
  birthData: BirthData,
  startYear?: number,
  endYear?: number,
  lifeArea?: string
): Promise<LifePredictionsResponse> {
  const requestBody: any = {
    birth_data: birthData,
  };

  if (startYear) requestBody.start_year = startYear;
  if (endYear) requestBody.end_year = endYear;
  if (lifeArea) requestBody.life_area = lifeArea;

  const response = await fetch(`${API_BASE_URL}/api/life-predictions/yearly-timeline`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`Failed to get life predictions: ${response.statusText}`);
  }

  return response.json();
}

export interface MajorLifeEvent {
  event_type: string;
  year: number;
  age: number;
  title: string;
  description: string;
  planet?: string;
  duration_years?: number;
  importance: 'critical' | 'high' | 'medium' | 'low';
  life_areas_affected: string[];
}

export interface MajorLifeEventsResponse {
  success: boolean;
  birth_year: number;
  current_year: number;
  current_age: number;
  total_events: number;
  major_life_events: MajorLifeEvent[];
  upcoming_events: MajorLifeEvent[];
  recent_past_events: MajorLifeEvent[];
  summary: {
    next_major_event: MajorLifeEvent | null;
    critical_upcoming: MajorLifeEvent[];
  };
}

export async function getMajorLifeEvents(
  birthData: BirthData,
  startYear?: number,
  endYear?: number
): Promise<MajorLifeEventsResponse> {
  const requestBody: any = {
    birth_data: {
      ...birthData,
      timezone: birthData.timezone || 'UTC',
      ayanamsa: birthData.ayanamsa || 'LAHIRI'
    },
  };

  if (startYear) requestBody.start_year = startYear;
  if (endYear) requestBody.end_year = endYear;

  const response = await fetch(`${API_BASE_URL}/api/life-predictions/major-life-events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`Failed to get major life events: ${response.statusText}`);
  }

  return response.json();
}

export async function getLifeAreaAnalysis(
  birthData: BirthData,
  lifeArea: string,
  startYear?: number,
  endYear?: number
): Promise<any> {
  const requestBody: any = {
    birth_data: birthData,
    life_area: lifeArea,
  };

  if (startYear) requestBody.start_year = startYear;
  if (endYear) requestBody.end_year = endYear;

  const response = await fetch(`${API_BASE_URL}/api/life-predictions/life-area-analysis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`Failed to get life area analysis: ${response.statusText}`);
  }

  return response.json();
}

// ============================================================================
// DIVISIONAL CHARTS API
// ============================================================================

export interface DivisionalPosition {
  sign: string;
  sign_num: number;
  longitude: number;
  degrees_in_sign: number;
  division: number;
}

export interface VargottamaAnalysis {
  d1_sign: string;
  d9_sign: string;
  is_vargottama: boolean;
  strength_verdict: string;
  marriage_significance?: string;
}

export interface DivisionalChartsSummary {
  navamsa_highlights: string[];
  career_indicators: string[];
  children_indicators: string[];
  overall_verdict: string;
}

export interface DivisionalChartsResponse {
  birth_chart_planets: {
    [planet: string]: {
      longitude: number;
      sign: string;
      nakshatra: string;
    };
  };
  divisional_charts: {
    D2_Hora: { [planet: string]: DivisionalPosition };
    D3_Drekkana: { [planet: string]: DivisionalPosition };
    D4_Chaturthamsa: { [planet: string]: DivisionalPosition };
    D5_Panchamsa: { [planet: string]: DivisionalPosition };
    D6_Shashtamsa: { [planet: string]: DivisionalPosition };
    D7_Saptamsa: { [planet: string]: DivisionalPosition };
    D8_Ashtamsa: { [planet: string]: DivisionalPosition };
    D9_Navamsa: { [planet: string]: DivisionalPosition };
    D10_Dasamsa: { [planet: string]: DivisionalPosition };
    D11_Ekadasamsa: { [planet: string]: DivisionalPosition };
    D12_Dwadasamsa: { [planet: string]: DivisionalPosition };
    D16_Shodasamsa: { [planet: string]: DivisionalPosition };
    D20_Vimsamsa: { [planet: string]: DivisionalPosition };
    D24_Chaturvimsamsa: { [planet: string]: DivisionalPosition };
    D27_Nakshatramsa: { [planet: string]: DivisionalPosition };
    D30_Trimsamsa: { [planet: string]: DivisionalPosition };
    D40_Khavedamsa: { [planet: string]: DivisionalPosition };
    D45_Akshavedamsa: { [planet: string]: DivisionalPosition };
    D60_Shashtiamsa: { [planet: string]: DivisionalPosition };
  };
  navamsa_strength_analysis: {
    [planet: string]: VargottamaAnalysis;
  };
  summary: DivisionalChartsSummary;
  calculation_info: {
    birth_date: string;
    birth_time: string;
    location: {
      latitude: number;
      longitude: number;
    };
    ayanamsa: string;
    timezone: string;
  };
  // Backward-compatible shape used by some UI components
  charts?: Array<{
    division: string;
    houses?: number[] | Record<string, number>;
    planets?: Record<string, any>;
  }>;
}

export async function getDivisionalCharts(birthData: BirthData): Promise<DivisionalChartsResponse> {
  const response = await fetch(`${API_BASE_URL}/api/divisional-charts/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(birthData),
  });

  if (!response.ok) {
    throw new Error(`Failed to calculate divisional charts: ${response.statusText}`);
  }

  return response.json();
}

export async function getNavamsaChart(birthData: BirthData): Promise<{
  birth_chart_planets: any;
  navamsa_d9: { [planet: string]: DivisionalPosition };
  strength_analysis: { [planet: string]: VargottamaAnalysis };
  calculation_info: {
    chart_type: string;
    purpose: string;
    birth_date: string;
    birth_time: string;
  };
}> {
  const response = await fetch(`${API_BASE_URL}/api/divisional-charts/navamsa-only`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(birthData),
  });

  if (!response.ok) {
    throw new Error(`Failed to calculate Navamsa chart: ${response.statusText}`);
  }

  return response.json();
}

// ============================================================================
// TRANSITS API
// ============================================================================

export interface TransitEffect {
  transiting_planet: string;
  natal_planet: string;
  aspect: string;
  effect_type: 'beneficial' | 'challenging' | 'transformative' | 'neutral';
  description: string;
  strength: number;
  orb: number;
}

export interface SadeSatiInfo {
  is_active: boolean;
  phase: string;
  description: string;
  intensity: string;
  years_in_phase: string;
  recommendations: string;
}

export interface JupiterTransitInfo {
  transiting_house: number;
  effect: string;
  duration: string;
  overall_impact: string;
  recommendation: string;
}

export interface TransitAnalysis {
  active_transits: TransitEffect[];
  total_active_transits: number;
  special_transits: {
    sade_sati?: SadeSatiInfo;
    jupiter_transit?: JupiterTransitInfo;
  };
  summary: {
    beneficial_count: number;
    challenging_count: number;
    transformative_count: number;
  };
}

export interface CurrentTransitsResponse {
  natal_chart_date: string;
  transit_date: string;
  current_planetary_positions: {
    [planet: string]: {
      longitude: number;
      sign: string;
      nakshatra: string;
      is_retrograde: boolean;
      speed: number;
    };
  };
  transit_analysis: TransitAnalysis;
  calculation_info: {
    birth_location: {
      latitude: number;
      longitude: number;
    };
    ayanamsa: string;
    timezone: string;
  };
}

export async function getCurrentTransits(birthData: BirthData): Promise<CurrentTransitsResponse> {
  const response = await fetch(`${API_BASE_URL}/api/transits/current`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(birthData),
  });

  if (!response.ok) {
    throw new Error(`Failed to get current transits: ${response.statusText}`);
  }

  return response.json();
}

export async function getTransitsOnDate(
  birthData: BirthData,
  transitDate?: string
): Promise<CurrentTransitsResponse> {
  const response = await fetch(`${API_BASE_URL}/api/transits/on-date`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      birth_data: birthData,
      transit_date: transitDate,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get transits on date: ${response.statusText}`);
  }

  return response.json();
}

// ============================================================================
// REMEDIES INTERFACES
// ============================================================================

export interface GemstoneInfo {
  primary: string;
  substitute: string[];
  weight: string;
  metal: string;
  finger: string;
  day_to_wear: string;
  time: string;
  mantra_while_wearing: string;
  caution?: string;
}

export interface MantraInfo {
  beej_mantra: string;
  vedic_mantra: string;
  gayatri: string;
  simple: string;
  count: string;
  best_time: string;
}

export interface CharityInfo {
  items_to_donate: string[];
  people_to_help: string;
  best_day: string;
  additional: string;
}

export interface FastingInfo {
  day: string;
  type: string;
  allowed: string;
  break_fast_with: string;
}

export interface DeityInfo {
  primary_deity: string;
  secondary: string[];
  worship_method: string;
  offerings: string;
  yantra: string;
  stotram: string;
}

export interface ColorsDirections {
  color: string;
  direction: string;
  day_ruler: string;
}

export interface PlanetRemedies {
  planet: string;
  current_strength: string;
  issue_type: string;
  priority: string;
  gemstone: GemstoneInfo;
  mantras: MantraInfo;
  charity: CharityInfo;
  fasting: FastingInfo;
  deity_worship: DeityInfo;
  colors_directions: ColorsDirections;
  quick_remedies: string[];
  lifestyle_changes: string[];
}

export interface GeneralRemedies {
  daily_practices: string[];
  weekly_practices: string[];
  monthly_practices: string[];
  important_tips: string[];
}

export interface PersonalizedRemediesResponse {
  success: boolean;
  birth_date: string;
  total_remedy_categories: number;
  personalized_remedies: PlanetRemedies[];
  general_remedies: GeneralRemedies;
  important_note: string;
}

// ============================================================================
// REMEDIES API FUNCTIONS
// ============================================================================

/**
 * Get personalized remedies based on birth chart
 */
export async function getPersonalizedRemedies(birthData: BirthData): Promise<PersonalizedRemediesResponse> {
  const response = await fetch(`${API_BASE_URL}/api/remedies/personalized`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(birthData),
  });

  if (!response.ok) {
    throw new Error(`Failed to get personalized remedies: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get remedies for a specific planet
 */
export async function getPlanetRemedies(planetName: string, strength: string = 'Average') {
  const response = await fetch(
    `${API_BASE_URL}/api/remedies/planet/${planetName}?strength=${strength}`
  );

  if (!response.ok) {
    throw new Error(`Failed to get planet remedies: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get general remedies beneficial for everyone
 */
export async function getGeneralRemedies() {
  const response = await fetch(`${API_BASE_URL}/api/remedies/general`);

  if (!response.ok) {
    throw new Error(`Failed to get general remedies: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get comprehensive gemstone guide
 */
export async function getAllGemstones() {
  const response = await fetch(`${API_BASE_URL}/api/remedies/gemstones`);

  if (!response.ok) {
    throw new Error(`Failed to get gemstones: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get complete mantra guide
 */
export async function getAllMantras() {
  const response = await fetch(`${API_BASE_URL}/api/remedies/mantras`);

  if (!response.ok) {
    throw new Error(`Failed to get mantras: ${response.statusText}`);
  }

  return response.json();
}

// ============================================================================
// CONFIDENCE SCORING INTERFACES
// ============================================================================

export interface ConfidenceFactor {
  name: string;
  type: string;
  tradition: string;
  strength: number;
  description: string;
  technical_details?: Record<string, any>;
  supports_prediction?: boolean;
}

export interface ConfidenceBreakdown {
  natal_strength: number;
  dasha_support: number;
  transit_support: number;
  yoga_support: number;
  cross_tradition_agreement: number;
}

export interface TimingWindow {
  start: string;
  end: string;
  peak: string | null;
  confidence: number;
  triggers: string[];
  description: string;
}

export interface ConfidenceData {
  overall_confidence: number;
  confidence_percentage: string;
  confidence_band: {
    lower: number;
    upper: number;
    display: string;
  };
  breakdown: ConfidenceBreakdown;
  supporting_factors: ConfidenceFactor[];
  contradicting_factors: ConfidenceFactor[];
  timing_windows: TimingWindow[];
  uncertainty_reasons: string[];
  traditions_consulted: string[];
  category: string;
  calculated_at: string;
}

export interface ConfidenceInterpretation {
  summary: string;
  confidence_level: string;
  outlook: string;
  key_strengths: string[];
  challenges: string[];
  timing: string;
  advice: string;
}

export interface ConfidenceAnalysisResponse {
  success: boolean;
  category: string;
  confidence: ConfidenceData;
  interpretation: ConfidenceInterpretation;
  chart_hash: string;
}

export interface CategoryConfidence {
  confidence: ConfidenceData;
  interpretation: ConfidenceInterpretation;
}

export interface LifeOverviewResponse {
  success: boolean;
  chart_hash: string;
  categories: {
    [key: string]: CategoryConfidence;
  };
  overall_chart_strength: number;
  key_strengths: string[];
  areas_of_attention: string[];
}

export interface QuickScoreResponse {
  success: boolean;
  category: string;
  confidence_score: number;
  confidence_percentage: string;
  confidence_band: {
    lower: string;
    upper: string;
  };
  supporting_factors_count: number;
  contradicting_factors_count: number;
}

export interface ConfidenceCategory {
  id: string;
  name: string;
  description: string;
  key_houses: number[];
  key_planets: string[];
}

// ============================================================================
// CONFIDENCE SCORING API FUNCTIONS
// ============================================================================

/**
 * Get list of available prediction categories
 */
export async function getConfidenceCategories(): Promise<{ categories: ConfidenceCategory[] }> {
  const response = await fetch(`${API_BASE_URL}/api/confidence/categories`);

  if (!response.ok) {
    throw new Error(`Failed to get confidence categories: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get quick confidence score for a specific category
 */
export async function getQuickConfidenceScore(
  birthData: BirthData,
  category: string
): Promise<QuickScoreResponse> {
  const response = await fetch(`${API_BASE_URL}/api/confidence/quick-score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      birth_data: birthData,
      category: category,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get quick confidence score: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get full confidence analysis for a specific category
 */
export async function getConfidenceAnalysis(
  birthData: BirthData,
  category: string
): Promise<ConfidenceAnalysisResponse> {
  const response = await fetch(`${API_BASE_URL}/api/confidence/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      birth_data: birthData,
      category: category,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get confidence analysis: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get complete life overview with confidence scores for all categories
 */
export async function getLifeOverview(
  birthData: BirthData,
  categories?: string[]
): Promise<LifeOverviewResponse> {
  const response = await fetch(`${API_BASE_URL}/api/confidence/life-overview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      birth_data: birthData,
      categories: categories || null,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get life overview: ${response.statusText}`);
  }

  return response.json();
}

// ============================================================================
// TIMING PREDICTIONS INTERFACES & FUNCTIONS
// ============================================================================

export interface TimingPeriod {
  start_date: string;
  end_date: string;
  period_type: 'golden' | 'favorable' | 'neutral' | 'challenging' | 'difficult';
  intensity: number;
  description: string;
  dasha_info: string;
  key_factors: string[];
}

export interface CurrentPeriod extends TimingPeriod {
  is_current: boolean;
  days_remaining: number;
  progress_percentage: number;
}

export interface CategoryTimingResponse {
  success: boolean;
  category: string;
  current_period: CurrentPeriod;
  past_periods: TimingPeriod[];
  golden_periods: TimingPeriod[];
  favorable_periods: TimingPeriod[];
  challenging_periods: TimingPeriod[];
  timeline_summary: string;
}

export interface TimingOverviewCategory {
  current_period: CurrentPeriod;
  next_golden: TimingPeriod | null;
  golden_count: number;
  favorable_count: number;
  challenging_count: number;
}

export interface TimingOverviewResponse {
  success: boolean;
  years_analyzed: number;
  timing_by_category: {
    [key: string]: TimingOverviewCategory;
  };
}

/**
 * Get timing predictions for a specific life category
 */
export async function getCategoryTiming(
  birthData: BirthData,
  category: string,
  yearsAhead: number = 5
): Promise<CategoryTimingResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/confidence/timing/${category}?years_ahead=${yearsAhead}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(birthData),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get category timing: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get timing overview for all major life categories
 */
export async function getTimingOverview(
  birthData: BirthData,
  yearsAhead: number = 3
): Promise<TimingOverviewResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/confidence/timing-overview?years_ahead=${yearsAhead}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(birthData),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get timing overview: ${response.statusText}`);
  }

  return response.json();
}
