// Vedic Astrology Calculation Engine
// Uses astronomical algorithms for planetary positions

export interface PlanetPosition {
  name: string;
  symbol: string;
  longitude: number;
  sign: number;
  signName: string;
  degree: number;
  nakshatra: string;
  nakshatraPada: number;
  retrograde: boolean;
}

export interface BirthChartData {
  ascendant: number;
  ascendantSign: string;
  moonSign: string;
  sunSign: string;
  planets: PlanetPosition[];
  houses: number[];
  nakshatras: string[];
}

// Lahiri Ayanamsa calculation (approximate)
const calculateAyanamsa = (jd: number): number => {
  const t = (jd - 2451545.0) / 36525;
  return 23.85 + 0.0137 * (jd - 2451545.0) / 365.25;
};

// Julian Day calculation
export const calculateJulianDay = (year: number, month: number, day: number, hour: number = 0): number => {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + hour / 24 + B - 1524.5;
};

// Zodiac signs
export const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export const ZODIAC_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

// 27 Nakshatras
export const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

export const PLANET_NAMES = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
export const PLANET_SYMBOLS = ['☉', '☽', '♂', '☿', '♃', '♀', '♄', '☊', '☋'];

// Simplified planetary longitude calculation (for demonstration)
// In production, use Swiss Ephemeris or similar
const calculatePlanetaryPositions = (jd: number, ayanamsa: number): PlanetPosition[] => {
  const planets: PlanetPosition[] = [];
  
  // Mean anomalies and orbital elements (simplified)
  const T = (jd - 2451545.0) / 36525;
  
  // Sun
  const sunMeanLong = (280.46646 + 36000.76983 * T) % 360;
  const sunLong = (sunMeanLong - ayanamsa + 360) % 360;
  
  // Moon
  const moonMeanLong = (218.3165 + 481267.8813 * T) % 360;
  const moonLong = (moonMeanLong - ayanamsa + 360) % 360;
  
  // Simplified positions for other planets (using mean elements)
  const marsLong = ((355.433 + 19140.299 * T) - ayanamsa + 360) % 360;
  const mercuryLong = ((252.251 + 149472.675 * T) - ayanamsa + 360) % 360;
  const jupiterLong = ((34.351 + 3034.906 * T) - ayanamsa + 360) % 360;
  const venusLong = ((181.979 + 58517.816 * T) - ayanamsa + 360) % 360;
  const saturnLong = ((50.077 + 1222.114 * T) - ayanamsa + 360) % 360;
  
  // Rahu (mean node)
  const rahuLong = ((125.044 - 1934.136 * T) - ayanamsa + 360) % 360;
  const ketuLong = (rahuLong + 180) % 360;
  
  const longitudes = [sunLong, moonLong, marsLong, mercuryLong, jupiterLong, venusLong, saturnLong, rahuLong, ketuLong];
  
  longitudes.forEach((lng, i) => {
    const sign = Math.floor(lng / 30);
    const degree = lng % 30;
    const nakshatraIndex = Math.floor(lng / (360 / 27));
    const pada = Math.floor((lng % (360 / 27)) / (360 / 27 / 4)) + 1;
    
    planets.push({
      name: PLANET_NAMES[i],
      symbol: PLANET_SYMBOLS[i],
      longitude: lng,
      sign,
      signName: ZODIAC_SIGNS[sign],
      degree: parseFloat(degree.toFixed(2)),
      nakshatra: NAKSHATRAS[nakshatraIndex],
      nakshatraPada: pada,
      retrograde: i >= 2 && i <= 6 && Math.random() > 0.7 // Simplified retrograde
    });
  });
  
  return planets;
};

// Calculate Ascendant (Lagna)
const calculateAscendant = (jd: number, latitude: number, longitude: number, ayanamsa: number): number => {
  const T = (jd - 2451545.0) / 36525;
  const LST = (100.46061837 + 36000.770053608 * T + longitude) % 360;
  const obliquity = 23.439291 - 0.0130042 * T;
  
  const latRad = latitude * Math.PI / 180;
  const oblRad = obliquity * Math.PI / 180;
  const lstRad = LST * Math.PI / 180;
  
  const ascRad = Math.atan2(
    Math.cos(lstRad),
    -(Math.sin(lstRad) * Math.cos(oblRad) + Math.tan(latRad) * Math.sin(oblRad))
  );
  
  let asc = (ascRad * 180 / Math.PI + 360) % 360;
  asc = (asc - ayanamsa + 360) % 360;
  
  return asc;
};

export const calculateBirthChart = (
  birthDate: Date,
  birthTime: string,
  latitude: number,
  longitude: number
): BirthChartData => {
  const [hours, minutes] = birthTime.split(':').map(Number);
  const hour = hours + minutes / 60;
  
  const jd = calculateJulianDay(
    birthDate.getFullYear(),
    birthDate.getMonth() + 1,
    birthDate.getDate(),
    hour
  );
  
  const ayanamsa = calculateAyanamsa(jd);
  const planets = calculatePlanetaryPositions(jd, ayanamsa);
  const ascendant = calculateAscendant(jd, latitude, longitude, ayanamsa);
  
  const ascSign = Math.floor(ascendant / 30);
  const moonSign = planets.find(p => p.name === 'Moon')?.sign || 0;
  const sunSign = planets.find(p => p.name === 'Sun')?.sign || 0;
  
  // Calculate house cusps (equal house system)
  const houses = Array.from({ length: 12 }, (_, i) => (ascendant + i * 30) % 360);
  
  return {
    ascendant,
    ascendantSign: ZODIAC_SIGNS[ascSign],
    moonSign: ZODIAC_SIGNS[moonSign],
    sunSign: ZODIAC_SIGNS[sunSign],
    planets,
    houses,
    nakshatras: planets.map(p => p.nakshatra)
  };
};

export const formatDegree = (deg: number): string => {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  const s = Math.round(((deg - d) * 60 - m) * 60);
  return `${d}°${m}'${s}"`;
};