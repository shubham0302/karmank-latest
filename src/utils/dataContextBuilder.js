/**
 * Data Context Builder - Advanced LLM Integration
 * Reads and structures ALL user numerology data for intelligent AI responses
 */

import { DATA } from '../data/data';
import { getText } from './helpers';

/**
 * Build comprehensive context for LLM
 * Includes ALL user data, yogas, dashas, traits, forecasts, remedies
 *
 * @param {Object} params - All user data
 * @returns {Object} Structured context for LLM
 */
export function buildComprehensiveContext({
  userContext,
  report,
  dashaReport,
  language = 'en',
  currentTab = 'Welcome'
}) {
  const context = {
    // User identity
    user: {
      name: userContext?.name || 'User',
      gender: userContext?.gender || 'Unknown',
      destinyNumber: report?.destinyNumber,
      basicNumber: report?.basicNumber,
      dob: report?.dob?.toISOString().split('T')[0]
    },

    // Core numerology
    coreNumbers: extractCoreNumbers(report),

    // Kundli grid analysis
    kundliAnalysis: analyzeKundliGrid(report?.baseKundliGrid),

    // Yogas (special combinations)
    yogas: extractYogaDetails(report?.yogas, language),

    // Dasha periods
    dashas: extractDashaDetails(dashaReport, language),

    // Personality traits
    traits: extractPersonalityTraits(report, userContext, language),

    // Recurring number patterns
    patterns: extractRecurringPatterns(report, language),

    // Remedies and guidance
    remedies: extractRemedies(report, language),

    // Forecasts
    forecasts: extractForecasts(report, userContext, language),

    // Current context
    currentState: {
      activeTab: currentTab,
      language: language,
      conversationContext: 'User is viewing their numerology report'
    }
  };

  return context;
}

/**
 * Extract core numbers with meanings
 */
function extractCoreNumbers(report) {
  if (!report) return null;

  const { destinyNumber, basicNumber } = report;

  return {
    destiny: {
      number: destinyNumber,
      meaning: getNumberMeaning(destinyNumber),
      represents: getNumberRepresentation(destinyNumber)
    },
    basic: {
      number: basicNumber,
      meaning: getNumberMeaning(basicNumber),
      represents: getNumberRepresentation(basicNumber)
    },
    combination: {
      key: `${basicNumber}-${destinyNumber}`,
      synergy: getCombinationSynergy(basicNumber, destinyNumber)
    }
  };
}

/**
 * Analyze kundli grid for patterns
 */
function analyzeKundliGrid(kundliGrid) {
  if (!kundliGrid) return null;

  const analysis = {
    grid: kundliGrid,
    presentNumbers: [],
    absentNumbers: [],
    strongNumbers: [], // 3+ occurrences
    weakNumbers: [], // 1 occurrence
    dominantAxis: null
  };

  for (let num = 1; num <= 9; num++) {
    const count = kundliGrid[num] || 0;

    if (count > 0) {
      analysis.presentNumbers.push(num);
      if (count >= 3) analysis.strongNumbers.push(num);
      if (count === 1) analysis.weakNumbers.push(num);
    } else {
      analysis.absentNumbers.push(num);
    }
  }

  // Analyze axes (rows, columns, diagonals)
  const axes = {
    mentalPlane: [4, 9, 2],
    emotionalPlane: [3, 5, 7],
    practicalPlane: [8, 1, 6],
    thoughtArrow: [4, 3, 8],
    willArrow: [9, 5, 1],
    actionArrow: [2, 7, 6]
  };

  for (const [axisName, numbers] of Object.entries(axes)) {
    const count = numbers.reduce((sum, num) => sum + (kundliGrid[num] || 0), 0);
    if (count >= 4) {
      analysis.dominantAxis = axisName;
      break;
    }
  }

  return analysis;
}

/**
 * Extract yoga details with full explanations
 */
function extractYogaDetails(yogas, language) {
  if (!yogas || yogas.length === 0) return [];

  return yogas.map(yoga => ({
    name: getText(yoga.name, language),
    category: yoga.category,
    description: getText(yoga.description, language),
    effects: getText(yoga.effects, language),
    activation: yoga.activation_rules ? 'Pattern-based' : 'Number-based',
    significance: getYogaSignificance(yoga)
  }));
}

/**
 * Extract dasha details with current periods
 */
function extractDashaDetails(dashaReport, language) {
  if (!dashaReport) return null;

  const now = new Date();

  // Find current Maha Dasha
  const currentMaha = dashaReport.mahaDashaTimeline?.find(d =>
    new Date(d.startDate) <= now && new Date(d.endDate) >= now
  );

  // Find current Yearly Dasha
  const currentYearly = dashaReport.yearlyDashaTimeline?.find(d =>
    new Date(d.startDate) <= now && new Date(d.endDate) >= now
  );

  // Find current Monthly Dasha
  const currentMonthly = dashaReport.monthlyDashaTimeline?.find(d =>
    new Date(d.startDate) <= now && new Date(d.endDate) >= now
  );

  // Get today's daily dasha
  const today = now.toISOString().split('T')[0];
  const currentDaily = dashaReport.dailyDashaTimeline?.find(d =>
    d.date.toISOString().split('T')[0] === today
  );

  return {
    current: {
      maha: currentMaha ? {
        planet: currentMaha.planet,
        startDate: currentMaha.startDate,
        endDate: currentMaha.endDate,
        meaning: getNumberMeaning(currentMaha.planet),
        influence: getDashaInfluence(currentMaha.planet)
      } : null,
      yearly: currentYearly ? {
        planet: currentYearly.planet,
        startDate: currentYearly.startDate,
        endDate: currentYearly.endDate,
        meaning: getNumberMeaning(currentYearly.planet),
        theme: getYearlyTheme(currentYearly.planet)
      } : null,
      monthly: currentMonthly ? {
        planet: currentMonthly.planet,
        startDate: currentMonthly.startDate,
        endDate: currentMonthly.endDate,
        focus: getMonthlyFocus(currentMonthly.planet)
      } : null,
      daily: currentDaily ? {
        planet: currentDaily.planet,
        energy: getDailyEnergy(currentDaily.planet)
      } : null
    },
    upcoming: {
      nextMaha: getNextDasha(dashaReport.mahaDashaTimeline, now),
      nextYearly: getNextDasha(dashaReport.yearlyDashaTimeline, now)
    }
  };
}

/**
 * Extract personality traits from destiny number
 */
function extractPersonalityTraits(report, userContext, language) {
  if (!report?.destinyNumber) return null;

  const destinyNum = report.destinyNumber;
  const numberData = DATA.numberDetails?.[destinyNum];

  if (!numberData) return null;

  return {
    coreTraits: getText(numberData.coreVibration, language),
    strengths: extractTraitList(numberData.positiveTraits, language),
    challenges: extractTraitList(numberData.negativeTraits, language),
    personalityType: getPersonalityType(destinyNum),
    lifeApproach: getLifeApproach(destinyNum),
    relationships: getRelationshipStyle(destinyNum, userContext?.gender)
  };
}

/**
 * Extract recurring number patterns
 */
function extractRecurringPatterns(report, language) {
  if (!report?.recurringNumbersAnalysis) return [];

  return report.recurringNumbersAnalysis.map(pattern => ({
    number: pattern.number,
    occurrences: pattern.occurrences,
    isDestinyMatch: pattern.isDestinyMatch,
    influence: getRecurringInfluence(pattern.number, pattern.occurrences),
    advice: getPatternAdvice(pattern.number, pattern.occurrences)
  }));
}

/**
 * Extract remedies
 */
function extractRemedies(report, language) {
  if (!report) return null;

  const destinyNum = report.destinyNumber;
  const basicNum = report.basicNumber;

  return {
    rudraksha: extractRudrakshaRemedies(destinyNum, basicNum, language),
    mantras: extractMantras(destinyNum, language),
    gemstones: extractGemstones(destinyNum, language),
    colors: getAuspiciousColors(destinyNum),
    days: getAuspiciousDays(destinyNum),
    specialRemedies: report.specialRemedies?.map(r => ({
      title: getText(r.title, language),
      guidance: getText(r.text, language)
    })) || []
  };
}

/**
 * Extract forecasts
 */
function extractForecasts(report, userContext, language) {
  const destinyNum = report?.destinyNumber;
  const gender = userContext?.gender;

  return {
    career: getCareerForecast(destinyNum, language),
    relationships: getRelationshipForecast(destinyNum, gender, language),
    health: getHealthGuidance(destinyNum, language),
    finance: getFinancialTrends(destinyNum, language),
    spiritual: getSpiritualPath(destinyNum, language)
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getNumberMeaning(number) {
  const meanings = {
    1: 'Leadership, independence, innovation, new beginnings',
    2: 'Cooperation, diplomacy, balance, partnerships',
    3: 'Creativity, expression, joy, communication',
    4: 'Stability, discipline, hard work, foundation',
    5: 'Freedom, adventure, change, versatility',
    6: 'Love, responsibility, harmony, service',
    7: 'Wisdom, spirituality, introspection, analysis',
    8: 'Power, ambition, success, material abundance',
    9: 'Completion, compassion, humanitarianism, universal love'
  };
  return meanings[number] || 'Unique cosmic influence';
}

function getNumberRepresentation(number) {
  const representations = {
    1: 'The Sun - Individual ego, self, father, authority',
    2: 'The Moon - Mind, emotions, mother, intuition',
    3: 'Jupiter - Wisdom, expansion, growth, teaching',
    4: 'Rahu - Unconventional, rebellious, sudden changes',
    5: 'Mercury - Communication, intellect, adaptability',
    6: 'Venus - Love, beauty, luxury, relationships',
    7: 'Ketu - Spirituality, mysticism, detachment',
    8: 'Saturn - Karma, discipline, limitations, rewards',
    9: 'Mars - Energy, courage, action, ambition'
  };
  return representations[number] || 'Cosmic force';
}

function getCombinationSynergy(basic, destiny) {
  // Simplified - in production, pull from combinationInsights
  if (basic === destiny) return 'Reinforced energy - strong focus on core traits';
  if (Math.abs(basic - destiny) === 1) return 'Complementary energies - balanced growth';
  if ((basic + destiny) % 2 === 0) return 'Harmonious blend - even-numbered synergy';
  return 'Dynamic interaction - creates unique life path';
}

function getYogaSignificance(yoga) {
  const categories = {
    'raja': 'Royal combination - indicates leadership and success',
    'dhana': 'Wealth yoga - favorable for prosperity',
    'spiritual': 'Spiritual blessing - deep inner growth',
    'karmic': 'Karmic pattern - lessons to learn',
    'remedial': 'Needs balancing - follow remedies'
  };
  return categories[yoga.category] || 'Special cosmic pattern';
}

function getDashaInfluence(planet) {
  const influences = {
    1: 'Leadership opportunities, new beginnings, father figure influences',
    2: 'Emotional sensitivity, family matters, intuitive insights',
    3: 'Learning, teaching, spiritual growth, optimism',
    4: 'Unexpected changes, foreign connections, material struggles',
    5: 'Communication, business, travel, networking',
    6: 'Love, relationships, luxury, artistic pursuits',
    7: 'Spiritual awakening, isolation, research, meditation',
    8: 'Hard work, karmic results, discipline, authority',
    9: 'Action, energy, conflicts, courage, property matters'
  };
  return influences[planet] || 'General life influence';
}

function getYearlyTheme(planet) {
  const themes = {
    1: 'New projects, independence, leadership roles',
    2: 'Partnerships, cooperation, emotional bonding',
    3: 'Creative expression, learning, social connections',
    4: 'Unexpected opportunities, changes, innovation',
    5: 'Movement, communication, versatility',
    6: 'Love, family, responsibilities, harmony',
    7: 'Introspection, spirituality, analysis',
    8: 'Achievement, authority, material success',
    9: 'Completion, passion, assertiveness'
  };
  return themes[planet] || 'General life theme';
}

function getMonthlyFocus(planet) {
  return `Focus on ${getNumberMeaning(planet).split(',')[0].toLowerCase()} this month`;
}

function getDailyEnergy(planet) {
  return `${getNumberMeaning(planet).split(',')[0]} energy for today`;
}

function getNextDasha(timeline, now) {
  if (!timeline) return null;
  const future = timeline.find(d => new Date(d.startDate) > now);
  return future ? {
    planet: future.planet,
    startDate: future.startDate,
    meaning: getNumberMeaning(future.planet)
  } : null;
}

function extractTraitList(traits, language) {
  if (!traits) return [];
  const text = getText(traits, language);
  return text.split(/[,;]/).map(t => t.trim()).filter(t => t);
}

function getPersonalityType(number) {
  const types = {
    1: 'Natural Leader',
    2: 'Sensitive Diplomat',
    3: 'Creative Communicator',
    4: 'Practical Builder',
    5: 'Adventurous Explorer',
    6: 'Loving Nurturer',
    7: 'Mystical Seeker',
    8: 'Ambitious Achiever',
    9: 'Compassionate Humanitarian'
  };
  return types[number];
}

function getLifeApproach(number) {
  const approaches = {
    1: 'Direct and assertive',
    2: 'Gentle and cooperative',
    3: 'Optimistic and expressive',
    4: 'Methodical and structured',
    5: 'Flexible and spontaneous',
    6: 'Responsible and caring',
    7: 'Analytical and contemplative',
    8: 'Strategic and determined',
    9: 'Idealistic and giving'
  };
  return approaches[number];
}

function getRelationshipStyle(number, gender) {
  // Simplified relationship insights
  return `Tends to be ${getLifeApproach(number)} in relationships`;
}

function getRecurringInfluence(number, count) {
  if (count >= 4) return `Very strong ${getNumberMeaning(number)} influence`;
  if (count === 3) return `Strong ${getNumberMeaning(number)} energy`;
  if (count === 2) return `Moderate ${getNumberMeaning(number)} presence`;
  return `Light ${getNumberMeaning(number)} touch`;
}

function getPatternAdvice(number, count) {
  if (count >= 3) {
    return `Channel this strong ${number} energy positively through ${getNumberMeaning(number).split(',')[0].toLowerCase()} activities`;
  }
  return `Embrace the ${getNumberMeaning(number).split(',')[0].toLowerCase()} qualities`;
}

function extractRudrakshaRemedies(destiny, basic, language) {
  const rudrakshas = [];

  if (DATA.rudrakshaRemedies?.[destiny]) {
    rudrakshas.push({
      type: `${destiny} Mukhi`,
      purpose: 'For destiny number',
      deity: DATA.rudrakshaRemedies[destiny].deity,
      benefits: getText(DATA.rudrakshaRemedies[destiny].benefits, language)
    });
  }

  return rudrakshas;
}

function extractMantras(number, language) {
  const mantra = DATA.mantras?.[number];
  if (!mantra) return [];

  return [{
    sanskrit: getText(mantra.sanskrit, language),
    meaning: getText(mantra.meaning, language),
    times: mantra.times || 108
  }];
}

function extractGemstones(number, language) {
  const stones = {
    1: 'Ruby',
    2: 'Pearl',
    3: 'Yellow Sapphire',
    4: 'Hessonite (Gomed)',
    5: 'Emerald',
    6: 'Diamond',
    7: 'Cat\'s Eye',
    8: 'Blue Sapphire',
    9: 'Red Coral'
  };
  return [stones[number] || 'Consult astrologer'];
}

function getAuspiciousColors(number) {
  const colors = {
    1: ['Gold', 'Orange', 'Yellow'],
    2: ['White', 'Cream', 'Light Green'],
    3: ['Yellow', 'Purple', 'Blue'],
    4: ['Grey', 'Blue', 'Black'],
    5: ['Green', 'Light Grey', 'White'],
    6: ['Pink', 'Blue', 'White'],
    7: ['Purple', 'Violet', 'Green'],
    8: ['Dark Blue', 'Black', 'Purple'],
    9: ['Red', 'Maroon', 'Pink']
  };
  return colors[number] || ['White'];
}

function getAuspiciousDays(number) {
  const days = {
    1: 'Sunday',
    2: 'Monday',
    3: 'Thursday',
    4: 'Sunday, Monday',
    5: 'Wednesday',
    6: 'Friday',
    7: 'Monday, Tuesday',
    8: 'Saturday',
    9: 'Tuesday'
  };
  return days[number] || 'All days';
}

function getCareerForecast(number, language) {
  const careers = {
    1: 'Leadership roles, entrepreneurship, government positions, independent ventures',
    2: 'Counseling, diplomacy, healthcare, partnerships, supportive roles',
    3: 'Creative fields, teaching, communication, arts, entertainment',
    4: 'IT, technology, engineering, unconventional careers, innovation',
    5: 'Sales, marketing, travel, media, versatile careers',
    6: 'Hospitality, design, counseling, family business, service',
    7: 'Research, spirituality, analysis, solitary work, mysticism',
    8: 'Business, management, real estate, authority positions',
    9: 'Social work, sports, military, competitive fields, advocacy'
  };
  return careers[number] || 'Multiple career paths possible';
}

function getRelationshipForecast(number, gender, language) {
  return `Generally ${getLifeApproach(number)} in relationships. Best compatibility with numbers that complement ${number}'s energy.`;
}

function getHealthGuidance(number, language) {
  const health = {
    1: 'Watch heart health, blood pressure. Stay physically active.',
    2: 'Manage stress, digestive system care. Practice emotional balance.',
    3: 'Throat, liver care. Avoid overindulgence.',
    4: 'Nervous system, sudden ailments. Practice grounding.',
    5: 'Respiratory health, nervous energy. Need variety in exercise.',
    6: 'Throat, kidney care. Balance work and rest.',
    7: 'Mental health, isolation effects. Practice grounding activities.',
    8: 'Bone health, chronic conditions. Regular health checkups.',
    9: 'Accidents, inflammation. Control impulses, stay calm.'
  };
  return health[number] || 'Maintain balanced lifestyle';
}

function getFinancialTrends(number, language) {
  const finance = {
    1: 'Self-made wealth, leadership bonuses, independent income',
    2: 'Partnership wealth, slow but steady growth, investments',
    3: 'Multiple income sources, teaching/consulting income',
    4: 'Fluctuating finances, sudden gains or losses, technology income',
    5: 'Variable income, communication/business earnings',
    6: 'Stable income, luxury expenses, family wealth',
    7: 'Moderate earnings, spiritual wealth, research grants',
    8: 'Karmic wealth, delayed but substantial, real estate',
    9: 'Property wealth, competitive earnings, inheritance'
  };
  return finance[number] || 'Varied financial patterns';
}

function getSpiritualPath(number, language) {
  const paths = {
    1: 'Leadership in spiritual communities, self-realization',
    2: 'Devotional path, service to divine feminine',
    3: 'Knowledge path, teaching spirituality',
    4: 'Unconventional spirituality, meditation, detachment',
    5: 'Versatile spiritual practices, sacred travel',
    6: 'Devotional service, family dharma, love as path',
    7: 'Deep meditation, mysticism, solitary practice',
    8: 'Karma yoga, discipline, overcoming material attachment',
    9: 'Selfless service, completion of karmic cycles'
  };
  return paths[number] || 'Unique spiritual journey';
}
