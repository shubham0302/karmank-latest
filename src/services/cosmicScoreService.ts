/**
 * Cosmic Daily Score Service
 * Calculates personalized domain scores based on:
 *  1. Day-of-week planetary ruler (always available)
 *  2. Current planetary hora (always available)
 *  3. Moon phase approximation (always available)
 *  4. Transit aspects to natal chart (when backend online + birth data present)
 */

// ─── Planetary Hora ───────────────────────────────────────────────────────────
// Chaldean order — cycles through all 7 planets
const CHALDEAN: string[] = ['Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars'];

// Day-of-week → ruling planet (0=Sun … 6=Sat)
const DAY_RULERS: string[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

// Each day starts with its ruling planet at local sunrise (~6 AM)
export function getCurrentHora(date: Date = new Date()): string {
  const dayIdx = date.getDay(); // 0=Sun
  const startIdx = CHALDEAN.indexOf(DAY_RULERS[dayIdx]);
  // Hours since local midnight → hours since ~6 AM sunrise = -6
  const hour = date.getHours();
  const horaNumber = hour < 6 ? (hour + 18) : (hour - 6);
  return CHALDEAN[(startIdx + horaNumber) % 7];
}

// ─── Moon Phase ───────────────────────────────────────────────────────────────
// Reference new moon: 2024-12-30T22:27:00Z
const REFERENCE_NEW_MOON = new Date('2024-12-30T22:27:00Z').getTime();
const SYNODIC_PERIOD_MS = 29.53058 * 24 * 3600 * 1000;

export function getMoonPhaseFraction(date: Date = new Date()): number {
  const elapsed = ((date.getTime() - REFERENCE_NEW_MOON) % SYNODIC_PERIOD_MS + SYNODIC_PERIOD_MS) % SYNODIC_PERIOD_MS;
  return elapsed / SYNODIC_PERIOD_MS; // 0=new, 0.5=full
}

export function getMoonPhaseLabel(fraction: number): { label: string; icon: string } {
  if (fraction < 0.05) return { label: 'New Moon', icon: '🌑' };
  if (fraction < 0.25) return { label: 'Waxing Crescent', icon: '🌒' };
  if (fraction < 0.30) return { label: 'First Quarter', icon: '🌓' };
  if (fraction < 0.48) return { label: 'Waxing Gibbous', icon: '🌔' };
  if (fraction < 0.52) return { label: 'Full Moon', icon: '🌕' };
  if (fraction < 0.70) return { label: 'Waning Gibbous', icon: '🌖' };
  if (fraction < 0.75) return { label: 'Last Quarter', icon: '🌗' };
  return { label: 'Waning Crescent', icon: '🌘' };
}

// ─── Domain Definitions ───────────────────────────────────────────────────────
export interface DomainConfig {
  key: string; label: string; icon: string; color: string;
  planets: string[]; gradientFrom: string; gradientTo: string;
}
export const DOMAINS: DomainConfig[] = [
  { key: 'career', label: 'Career & Ambition', icon: '🎯', color: 'amber', planets: ['Sun', 'Saturn'], gradientFrom: 'from-amber-500', gradientTo: 'to-orange-500' },
  { key: 'love', label: 'Love & Bonds', icon: '❤️', color: 'rose', planets: ['Venus', 'Moon'], gradientFrom: 'from-rose-500', gradientTo: 'to-pink-500' },
  { key: 'health', label: 'Health & Vitality', icon: '💪', color: 'emerald', planets: ['Mars', 'Moon'], gradientFrom: 'from-emerald-500', gradientTo: 'to-green-500' },
  { key: 'finance', label: 'Wealth & Finance', icon: '💰', color: 'yellow', planets: ['Jupiter', 'Venus'], gradientFrom: 'from-yellow-500', gradientTo: 'to-lime-500' },
  { key: 'spiritual', label: 'Spiritual Growth', icon: '🕉️', color: 'violet', planets: ['Ketu', 'Jupiter'], gradientFrom: 'from-violet-500', gradientTo: 'to-purple-500' },
  { key: 'mind', label: 'Mind & Clarity', icon: '🧠', color: 'cyan', planets: ['Mercury'], gradientFrom: 'from-cyan-500', gradientTo: 'to-blue-500' },
];

// ─── Base scores per domain by day-ruler ──────────────────────────────────────
const DAY_BASE: Record<string, Record<string, number>> = {
  Sun: { career: 7.5, love: 5.0, health: 7.0, finance: 6.5, spiritual: 6.5, mind: 6.0 },
  Moon: { career: 5.0, love: 8.5, health: 6.0, finance: 5.5, spiritual: 7.0, mind: 6.5 },
  Mars: { career: 7.0, love: 4.0, health: 8.5, finance: 5.0, spiritual: 5.0, mind: 5.0 },
  Mercury: { career: 6.5, love: 5.5, health: 5.5, finance: 7.0, spiritual: 5.5, mind: 8.5 },
  Jupiter: { career: 7.0, love: 7.0, health: 6.5, finance: 8.5, spiritual: 9.0, mind: 7.0 },
  Venus: { career: 5.5, love: 9.0, health: 6.0, finance: 7.5, spiritual: 6.0, mind: 6.5 },
  Saturn: { career: 6.0, love: 3.5, health: 5.0, finance: 5.0, spiritual: 7.5, mind: 5.5 },
};

// ─── Moon-phase modifiers per domain ─────────────────────────────────────────
function moonPhaseModifiers(fraction: number): Record<string, number> {
  if (fraction < 0.05) return { career: 0.5, love: 0, health: 0, finance: 0.5, spiritual: 1.0, mind: 0.5 };
  if (fraction < 0.25) return { career: 1.0, love: 0.5, health: 0.5, finance: 1.0, spiritual: 0, mind: 0.5 };
  if (fraction < 0.30) return { career: 1.0, love: 0.5, health: 1.0, finance: 0.5, spiritual: 0, mind: 0 };
  if (fraction < 0.48) return { career: 0.5, love: 1.0, health: 0, finance: 0.5, spiritual: 0.5, mind: 1.0 };
  if (fraction < 0.52) return { career: 0, love: 2.0, health: -0.5, finance: 0, spiritual: 2.0, mind: 0 };
  if (fraction < 0.70) return { career: 0, love: 0.5, health: 0.5, finance: 0, spiritual: 1.0, mind: 1.0 };
  if (fraction < 0.75) return { career: -0.5, love: 0, health: 1.0, finance: -0.5, spiritual: 1.0, mind: 0 };
  return { career: -0.5, love: -0.5, health: 1.0, finance: -0.5, spiritual: 1.5, mind: 0 };
}

// ─── Hora boost per domain ────────────────────────────────────────────────────
const HORA_BOOST: Record<string, Record<string, number>> = {
  Sun: { career: 1.5, love: 0, health: 1.0, finance: 0.5, spiritual: 0.5, mind: 0 },
  Moon: { career: 0, love: 1.5, health: 0.5, finance: 0, spiritual: 1.0, mind: 0.5 },
  Mars: { career: 1.0, love: -0.5, health: 1.5, finance: 0, spiritual: 0, mind: 0 },
  Mercury: { career: 0.5, love: 0, health: 0, finance: 1.0, spiritual: 0, mind: 1.5 },
  Jupiter: { career: 0.5, love: 1.0, health: 0.5, finance: 1.5, spiritual: 1.5, mind: 0.5 },
  Venus: { career: 0, love: 1.5, health: 0.5, finance: 1.0, spiritual: 0.5, mind: 0 },
  Saturn: { career: 0.5, love: -1.0, health: -0.5, finance: -0.5, spiritual: 1.0, mind: 0 },
};

// ─── Transit-based enhancement ───────────────────────────────────────────────
const ASPECT_EFFECT: Record<string, number> = {
  trine: 2.0, sextile: 1.5, conjunction: 0.5,
  square: -2.0, opposition: -1.5,
};
const TRANSIT_PLANET_DOMAIN: Record<string, string[]> = {
  Sun: ['career', 'health'],
  Moon: ['love', 'mind'],
  Mars: ['health', 'career'],
  Mercury: ['mind', 'career'],
  Jupiter: ['finance', 'spiritual'],
  Venus: ['love', 'finance'],
  Saturn: ['career', 'spiritual'],
  Rahu: ['career', 'mind'],
  Ketu: ['spiritual', 'mind'],
};

function applyTransits(
  scores: Record<string, number>,
  transits: any[]
): Record<string, number> {
  const updated = { ...scores };
  for (const t of transits) {
    const planet = t.transiting_planet ?? t.planet ?? '';
    const aspect = (t.aspect_type ?? t.aspect ?? '').toLowerCase();
    const effect = ASPECT_EFFECT[aspect] ?? 0;
    const domains = TRANSIT_PLANET_DOMAIN[planet] ?? [];
    for (const d of domains) {
      if (d in updated) updated[d] = updated[d] + effect * 0.6;
    }
  }
  return updated;
}

// ─── Main calculation ────────────────────────────────────────────────────────
export interface DomainScore {
  key: string; label: string; icon: string; color: string;
  score: number; // 1–10
  factor: string; // brief "why"
  gradientFrom: string; gradientTo: string;
}

export interface CosmicDailyReport {
  date: Date;
  overallScore: number;
  quality: 'excellent' | 'good' | 'moderate' | 'challenging';
  dayRuler: string; currentHora: string;
  moonPhase: string; moonIcon: string;
  domains: DomainScore[];
  todayMessage: string;
  bestHora: string;
  focusDomain: string; // highest scoring
  weakDomain: string;  // lowest scoring (remedy focus)
  remedyMantra: string;
  backendEnhanced: boolean;
}

// Deterministic daily nudge (-0.5 to +0.5) so values feel "alive" but stable per day
function dailyNudge(key: string, date: Date): number {
  const seed = date.getFullYear() * 1000 + date.getMonth() * 31 + date.getDate();
  const hash = (seed * key.charCodeAt(0) * 31) % 100;
  return (hash / 100 - 0.5) * 0.8;
}

/**
 * Birth-data personal modifier (-1.0 to +1.0) per domain.
 * Uses birth day + birth month to create a unique per-user shift
 * that is stable day-to-day and differs meaningfully between people.
 *
 * Logic:
 *  - Birth numerology number (sum of all digits in DOB, reduced to 1-9)
 *    maps to a ruling planet → boosts that planet's domains
 *  - Birth month (1-12) seeds a secondary offset
 *  - Result: same day shows different domain rankings for different people
 */
function birthPersonalModifier(key: string, birthDob: string): number {
  // Parse DOB — accept "YYYY-MM-DD"
  const parts = birthDob.split("-");
  if (parts.length < 3) return 0;
  const [y, m, d] = parts.map(Number);
  if (!y || !m || !d) return 0;

  // Reduce all digits of DOB to a single digit (1-9), ignore 0
  const digits = String(y) + String(m).padStart(2, "0") + String(d).padStart(2, "0");
  let sum = digits.split("").reduce((acc, c) => acc + Number(c), 0);
  while (sum > 9) sum = String(sum).split("").reduce((a, c) => a + Number(c), 0);
  if (sum === 0) sum = 9;

  // Birth number → ruling planet (Chaldean)
  const BIRTH_PLANET: Record<number, string> = {
    1: 'Sun', 2: 'Moon', 3: 'Jupiter', 4: 'Rahu',
    5: 'Mercury', 6: 'Venus', 7: 'Ketu', 8: 'Saturn', 9: 'Mars',
  };
  const rulingPlanet = BIRTH_PLANET[sum] ?? 'Sun';

  // Planet → domains that get a personal boost (+0.8) vs gentle dip (-0.3)
  const PLANET_BOOST: Record<string, string[]> = {
    Sun:     ['career', 'health'],
    Moon:    ['love', 'mind'],
    Jupiter: ['finance', 'spiritual'],
    Rahu:    ['career', 'mind'],
    Mercury: ['mind', 'finance'],
    Venus:   ['love', 'finance'],
    Ketu:    ['spiritual', 'mind'],
    Saturn:  ['spiritual', 'career'],
    Mars:    ['health', 'career'],
  };
  const boosted = PLANET_BOOST[rulingPlanet] ?? [];

  // Secondary modifier from birth month (creates spread between people born same day)
  const monthShift = ((m * 17 + d * 7) % 20 - 10) / 100; // -0.1 to +0.1 per domain

  if (boosted.includes(key)) return 0.8 + monthShift;
  return -0.3 + monthShift;
}

const REMEDY_MANTRAS: Record<string, string> = {
  career: 'Om Suryaya Namah — Sun mantra for career clarity',
  love: 'Om Shukraya Namah — Venus mantra for harmonious bonds',
  health: 'Om Mangalaya Namah — Mars mantra for strength & vitality',
  finance: 'Om Brihaspataye Namah — Jupiter mantra for abundance',
  spiritual: 'Om Ketave Namah — Ketu mantra for inner awakening',
  mind: 'Om Budhaya Namah — Mercury mantra for mental clarity',
};

const MESSAGES: Record<string, string[]> = {
  excellent: [
    'The cosmos is fully aligned in your favour today, {name}. Act boldly — the universe is backing you.',
    'Rare planetary harmony today, {name}. Take your most important step forward.',
    'Exceptional energy flows through all domains for you, {name}. Trust your instincts completely.',
  ],
  good: [
    '{name}, strong cosmic tailwinds support you today. Focus on your priorities and you will achieve much.',
    'Favourable planetary energies support your goals, {name}. Stay grounded and take action.',
    'Mostly auspicious patterns today, {name}. Lead with your strengths.',
  ],
  moderate: [
    'Mixed cosmic energies today, {name}. Discern carefully before major decisions.',
    '{name}, planetary patterns call for balance. Work with your strongest domain.',
    'Some friction in the cosmic field today, {name} — use it as a catalyst for growth.',
  ],
  challenging: [
    "{name}, challenging transits today invite introspection and patience. Rest is sacred.",
    "The cosmos suggests caution today, {name}. Avoid major decisions; focus on planning.",
    "A day for inner work and preparation, {name}. What you sow in silence blooms later.",
  ],
};

function pickMessage(quality: string, date: Date, userName?: string): string {
  const arr = MESSAGES[quality] ?? MESSAGES.moderate;
  const idx = date.getDate() % arr.length;
  const nameToUse = userName || 'Cosmic Explorer';
  return arr[idx].replace(/\{name\}/g, nameToUse);
}

function bestHoraFor(dayRuler: string): string {
  const HORA_LABELS: Record<string, string> = {
    Sun: 'Sunrise–7 AM (Sun Hora) — ideal for career & leadership',
    Moon: '7–8 AM (Moon Hora) — ideal for emotional decisions & relationships',
    Mars: '8–9 AM (Mars Hora) — ideal for exercise, competition, bold moves',
    Mercury: '9–10 AM (Mercury Hora) — ideal for communication, deals, study',
    Jupiter: '10–11 AM (Jupiter Hora) — ideal for learning, finance, spirituality',
    Venus: '11 AM–12 PM (Venus Hora) — ideal for creative work & relationships',
    Saturn: 'Evening 5–6 PM (Saturn Hora) — ideal for discipline & long-term planning',
  };
  return HORA_LABELS[dayRuler] ?? 'Jupiter Hora — ideal for auspicious beginnings';
}

export function calculateCosmicReport(
  date: Date = new Date(),
  transitData?: any,
  userName?: string,
  birthDob?: string,
): CosmicDailyReport {
  const dayRuler = DAY_RULERS[date.getDay()];
  const hora = getCurrentHora(date);
  const moonFrac = getMoonPhaseFraction(date);
  const moonInfo = getMoonPhaseLabel(moonFrac);
  const moonMods = moonPhaseModifiers(moonFrac);
  const horaMods = HORA_BOOST[hora] ?? {};
  const base = DAY_BASE[dayRuler] ?? DAY_BASE['Sun'];

  // Build raw scores — include birth-data personal modifier when DOB is available
  let raw: Record<string, number> = {};
  for (const d of DOMAINS) {
    const personalMod = birthDob ? birthPersonalModifier(d.key, birthDob) : 0;
    raw[d.key] = (base[d.key] ?? 5)
      + (moonMods[d.key] ?? 0)
      + (horaMods[d.key] ?? 0)
      + dailyNudge(d.key, date)
      + personalMod;
  }

  // Enhance with live transit data if available
  let backendEnhanced = false;
  if (transitData?.transit_analysis?.active_transits?.length) {
    raw = applyTransits(raw, transitData.transit_analysis.active_transits);
    backendEnhanced = true;
  }

  // Clamp to 1–10 and build domain objects
  const domains: DomainScore[] = DOMAINS.map(d => {
    const score = Math.min(10, Math.max(1, Math.round(raw[d.key] * 10) / 10));
    const factor = score >= 7
      ? `${d.planets[0]} supports today's ${d.label.split(' ')[0].toLowerCase()} energy`
      : score >= 5
        ? `${d.planets[0]} in neutral position — steady but not exceptional`
        : `${d.planets[0]} under tension — approach ${d.label.split(' ')[0].toLowerCase()} matters gently`;
    return { ...d, score, factor };
  });

  const overall = Math.round(domains.reduce((s, d) => s + d.score, 0) / domains.length * 10) / 10;
  const quality: CosmicDailyReport['quality'] =
    overall >= 7.5 ? 'excellent' : overall >= 6 ? 'good' : overall >= 4.5 ? 'moderate' : 'challenging';

  const sorted = [...domains].sort((a, b) => b.score - a.score);
  const focusDomain = sorted[0].key;
  const weakDomain = sorted[sorted.length - 1].key;

  return {
    date, overallScore: overall, quality,
    dayRuler, currentHora: hora,
    moonPhase: moonInfo.label, moonIcon: moonInfo.icon,
    domains,
    todayMessage: pickMessage(quality, date, userName),
    bestHora: bestHoraFor(dayRuler),
    focusDomain, weakDomain,
    remedyMantra: REMEDY_MANTRAS[weakDomain] ?? REMEDY_MANTRAS.mind,
    backendEnhanced,
  };
}
