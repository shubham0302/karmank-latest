/**
 * Interpretation Engine - Transforms technical astrological data
 * into beginner-friendly explanations WITHOUT changing backend
 */

export interface StrengthLevel {
  label: string;
  stars: number; // 1-5
  color: string;
  description: string;
  percentage: number;
}

/**
 * Convert Shadbala score to visual strength
 */
export function interpretStrength(shadbalaScore: number, planetName: string): StrengthLevel {
  // Required strengths from classical Vedic texts
  const REQUIRED_STRENGTH: Record<string, number> = {
    'Sun': 390,
    'Moon': 360,
    'Mars': 300,
    'Mercury': 420,
    'Jupiter': 390,
    'Venus': 330,
    'Saturn': 300,
    'Rahu': 300,
    'Ketu': 300
  };

  const required = REQUIRED_STRENGTH[planetName] || 360;
  const percentage = Math.round((shadbalaScore / required) * 100);

  if (percentage >= 120) {
    return {
      label: 'Exceptionally Strong',
      stars: 5,
      color: '#10b981',
      description: `Your ${planetName} is like a champion athlete - it delivers outstanding results throughout your life.`,
      percentage
    };
  } else if (percentage >= 100) {
    return {
      label: 'Strong',
      stars: 4,
      color: '#22c55e',
      description: `Your ${planetName} has solid strength - it works well and brings good results.`,
      percentage
    };
  } else if (percentage >= 80) {
    return {
      label: 'Moderate',
      stars: 3,
      color: '#eab308',
      description: `Your ${planetName} functions adequately with some conscious effort.`,
      percentage
    };
  } else if (percentage >= 60) {
    return {
      label: 'Below Average',
      stars: 2,
      color: '#f59e0b',
      description: `Your ${planetName} needs support - focus on remedies and conscious effort in this area.`,
      percentage
    };
  } else {
    return {
      label: 'Weak',
      stars: 1,
      color: '#ef4444',
      description: `Your ${planetName} faces challenges - extra care and remedies can help strengthen this area.`,
      percentage
    };
  }
}

/**
 * Render star rating as string
 */
export function renderStars(count: number): string {
  return '⭐'.repeat(count) + '☆'.repeat(5 - count);
}

/**
 * Glossary of common astrological terms for tooltips
 */
export const ASTRO_GLOSSARY: Record<string, {
  simple: string;
  explanation: string;
  emoji: string;
}> = {
  'Mahadasha': {
    simple: 'Life Chapter',
    explanation: 'A major time period (7-20 years) when one planet\'s themes dominate your life',
    emoji: '📖'
  },
  'Antardasha': {
    simple: 'Sub-Chapter',
    explanation: 'A shorter period within your main life chapter, adding specific flavors',
    emoji: '📄'
  },
  'Vargottama': {
    simple: 'Double Power',
    explanation: 'A planet in the same zodiac sign in both your main chart and D9 chart - this doubles its strength',
    emoji: '⚡'
  },
  'Exalted': {
    simple: 'Super Strong',
    explanation: 'Planet in its most powerful sign - like an athlete at peak performance',
    emoji: '👑'
  },
  'Debilitated': {
    simple: 'Weakened',
    explanation: 'Planet in a challenging sign - needs extra support to shine',
    emoji: '🔧'
  },
  'Retrograde': {
    simple: 'Reviewing Past',
    explanation: 'Planet appears to move backward, bringing introspection and revisiting themes',
    emoji: '⏪'
  },
  '1st House': {
    simple: 'Your Identity',
    explanation: 'Your personality, appearance, and how you approach life',
    emoji: '🎭'
  },
  '2nd House': {
    simple: 'Your Resources',
    explanation: 'Money, values, speech, and family wealth',
    emoji: '💰'
  },
  '3rd House': {
    simple: 'Your Communication',
    explanation: 'Siblings, courage, short trips, and self-effort',
    emoji: '💬'
  },
  '4th House': {
    simple: 'Your Home',
    explanation: 'Mother, home, emotions, and inner peace',
    emoji: '🏡'
  },
  '5th House': {
    simple: 'Your Creativity',
    explanation: 'Children, romance, creativity, and intelligence',
    emoji: '🎨'
  },
  '6th House': {
    simple: 'Your Service',
    explanation: 'Health, daily work, obstacles, and helping others',
    emoji: '🏥'
  },
  '7th House': {
    simple: 'Your Partnerships',
    explanation: 'Marriage, business partners, and one-on-one relationships',
    emoji: '💑'
  },
  '8th House': {
    simple: 'Your Transformation',
    explanation: 'Deep change, shared resources, mysteries, and healing',
    emoji: '🦋'
  },
  '9th House': {
    simple: 'Your Wisdom',
    explanation: 'Higher learning, spirituality, long journeys, and luck',
    emoji: '🎓'
  },
  '10th House': {
    simple: 'Your Career',
    explanation: 'Profession, reputation, father, and public status',
    emoji: '💼'
  },
  '11th House': {
    simple: 'Your Gains',
    explanation: 'Friends, income, goals, and social networks',
    emoji: '🤝'
  },
  '12th House': {
    simple: 'Your Spirituality',
    explanation: 'Letting go, foreign lands, meditation, and behind-the-scenes work',
    emoji: '🕉️'
  }
};

/**
 * Get friendly house name
 */
export function friendlyHouseName(houseNum: number, includeNumber = false): string {
  const houseName = ASTRO_GLOSSARY[`${houseNum}th House`]?.simple || `${houseNum}th House`;
  return includeNumber ? `${houseNum}th House (${houseName})` : houseName;
}

/**
 * Divisional chart guide
 */
export const DIVISIONAL_CHART_GUIDE: Record<string, {
  name: string;
  icon: string;
  priority: number;
  description: string;
  whenToUse: string;
  metaphor: string;
}> = {
  'D1': {
    name: 'Your Main Life Map',
    icon: '🗺️',
    priority: 1,
    description: 'Your overall personality, health, and life direction',
    whenToUse: 'Start here - this is your foundation',
    metaphor: 'Think of this as Google Maps for your entire life journey'
  },
  'D2': {
    name: 'Your Wealth Patterns',
    icon: '💰',
    priority: 5,
    description: 'How you earn, save, and relate to money',
    whenToUse: 'When thinking about finances or business ventures',
    metaphor: 'Your financial DNA - built-in money patterns'
  },
  'D9': {
    name: 'Your Marriage & Soul Map',
    icon: '💑',
    priority: 2,
    description: 'Your ideal partner, spiritual path, and inner strength',
    whenToUse: 'When considering marriage or exploring deeper purpose',
    metaphor: 'The "director\'s cut" of your life story - hidden depths'
  },
  'D10': {
    name: 'Your Career Blueprint',
    icon: '💼',
    priority: 3,
    description: 'Best career paths and professional timing',
    whenToUse: 'Making career decisions or job changes',
    metaphor: 'Your professional GPS and success roadmap'
  }
};
