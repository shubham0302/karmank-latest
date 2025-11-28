// Numerology API Client
// This file handles all communication with the secure backend
// Calculation logic AND data interpretations are now completely hidden on the backend

import { checkAdvancedYoga, getText } from '../utils/helpers';
import { fetchEnrichmentData, identifyPresentYogas, identifyRecurringNumbers } from './data-api';
import { DATA } from '../data/data'; // Still needed for yoga identification logic only

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

/**
 * Calculate complete numerology report from backend
 * @param {string} dob - Date of birth in YYYY-MM-DD format
 * @returns {Promise<object>} Numerology calculation results
 */
export async function calculateNumerologyFromBackend(dob) {
  try {
    console.log('🔒 Calling secure backend for numerology calculation...');

    const response = await fetch(`${BACKEND_URL}/calculate/numerology`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dob }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to calculate numerology');
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error('Calculation failed');
    }

    console.log('✅ Calculation complete from backend');

    return result.data;
  } catch (error) {
    console.error('❌ Backend calculation error:', error);
    throw new Error(`Failed to calculate numerology: ${error.message}`);
  }
}

/**
 * Transform backend response to match frontend data structure
 * This ensures compatibility with existing frontend code
 */
export function transformBackendResponse(backendData, userData) {
  const { basicNumber, destinyNumber, kundliGrid, dashaTimelines } = backendData;

  return {
    dob: new Date(backendData.dob),
    basicNumber,
    destinyNumber,
    baseKundliGrid: kundliGrid,

    // Dasha timelines from backend
    mahaDashaTimeline: dashaTimelines.maha.map(d => ({
      ...d,
      startDate: new Date(d.startDate),
      endDate: new Date(d.endDate),
    })),

    yearlyDashaTimeline: dashaTimelines.yearly.map(d => ({
      ...d,
      startDate: new Date(d.startDate),
      endDate: new Date(d.endDate),
    })),

    monthlyDashaTimeline: dashaTimelines.monthly.map(d => ({
      ...d,
      startDate: new Date(d.startDate),
      endDate: new Date(d.endDate),
    })),

    dailyDashaTimeline: dashaTimelines.daily.map(d => ({
      ...d,
      date: new Date(d.date),
    })),

    // These will still be calculated on frontend as they depend on DATA
    // which contains the interpretations and meanings
    yogas: [],
    recurringNumbersAnalysis: [],
    specialInsights: [],
    specialRemedies: [],
  };
}

/**
 * Complete numerology calculation using secure backend for everything
 * This is a drop-in replacement for the old calculateNumerology function
 * @param {string} dob - Date of birth in YYYY-MM-DD format
 * @returns {Promise<object>} Complete numerology report
 */
export async function calculateNumerology(dob) {
  try {
    // Step 1: Get core calculations from secure backend
    const backendData = await calculateNumerologyFromBackend(dob);
    const { basicNumber, destinyNumber, kundliGrid } = backendData;

    const date = new Date(backendData.dob);
    const day = date.getDate();

    // Step 2: Identify which yogas are present (logic only, not interpretations)
    const yogaIds = [];
    Object.entries(DATA.yogaDetails).forEach(([yogaId, yoga]) => {
      let isPresent = false;
      if (yoga.activation_rules) {
        isPresent = checkAdvancedYoga(yoga.activation_rules, kundliGrid);
      } else if (yoga.numbers && Array.isArray(yoga.numbers)) {
        isPresent = yoga.numbers.every(num => kundliGrid[num] > 0);
        if (isPresent && yoga.empty && yoga.empty.length > 0) {
          if (yoga.empty.some(num => kundliGrid[num] > 0)) {
            isPresent = false;
          }
        }
      }
      if (isPresent) {
        yogaIds.push(yogaId);
      }
    });

    // Special Yoga: Basic 2, Destiny 1
    if (basicNumber === 2 && destinyNumber === 1) {
      if (!yogaIds.includes('rajYoga')) {
        yogaIds.push('rajYoga');
      }
    }

    // Step 3: Identify recurring numbers
    const recurringNumbers = identifyRecurringNumbers(kundliGrid);

    // Step 4: Fetch protected enrichment data from backend
    // This includes combination insights, yoga details, remedies, etc.
    const enrichmentData = await fetchEnrichmentData(
      basicNumber,
      destinyNumber,
      yogaIds,
      kundliGrid,
      recurringNumbers
    );

    // Step 5: Transform yoga data from backend to match expected format
    const yogas = yogaIds.map(yogaId => enrichmentData.yogas[yogaId]).filter(Boolean);

    // Step 6: Transform recurring number data
    const recurringNumbersAnalysis = recurringNumbers.map(num => {
      const influence = enrichmentData.recurringInfluences[num];
      return influence ? {
        number: num,
        count: kundliGrid[num],
        influence
      } : null;
    }).filter(Boolean);

    // Step 7: Add special insights (these are simple, can stay frontend)
    let specialInsights = [];
    if (day === 22) {
      specialInsights.push({
        title: "Born on the 22nd",
        text: "For individuals born on the 22nd of any month, there is a possibility of living separately from one or both parents for extended periods. This may be due to various factors such as career, business, or other circumstances."
      });
    }

    // Step 8: Get remedies from enrichment data
    const specialRemedies = enrichmentData.remedies || [];

    return {
      dob: date,
      basicNumber,
      destinyNumber,
      baseKundliGrid: kundliGrid,
      yogas,
      recurringNumbersAnalysis,
      specialInsights,
      specialRemedies,
      combinationInsight: enrichmentData.combinationInsight, // NEW: from backend
      numberDetails: enrichmentData.numberDetails, // NEW: from backend
    };
  } catch (error) {
    console.error('Error in calculateNumerology:', error);
    throw error;
  }
}

/**
 * Dasha calculator that uses backend data
 * This maintains the same interface as the old dashaCalculator
 */
export const dashaCalculator = {
  async calculateFromBackend(dob) {
    const backendData = await calculateNumerologyFromBackend(dob);
    return {
      mahaDashaTimeline: backendData.dashaTimelines.maha.map(d => ({
        ...d,
        startDate: new Date(d.startDate),
        endDate: new Date(d.endDate),
      })),
      yearlyDashaTimeline: backendData.dashaTimelines.yearly.map(d => ({
        ...d,
        startDate: new Date(d.startDate),
        endDate: new Date(d.endDate),
      })),
      monthlyDashaTimeline: backendData.dashaTimelines.monthly.map(d => ({
        ...d,
        startDate: new Date(d.startDate),
        endDate: new Date(d.endDate),
      })),
      dailyDashaTimeline: backendData.dashaTimelines.daily.map(d => ({
        ...d,
        date: new Date(d.date),
      })),
    };
  },

  // Individual methods for compatibility
  calculateMahaDasha(dob, basicNum) {
    // This will be called with already calculated dob/basicNum
    // We'll need to fetch from backend or use cached data
    // For now, return empty to force backend usage
    console.warn('⚠️ Direct dasha calculation deprecated. Use backend API.');
    return [];
  },

  calculateYearlyDasha(dob, basicNum) {
    console.warn('⚠️ Direct dasha calculation deprecated. Use backend API.');
    return [];
  },

  calculateMonthlyDasha(yearlyTimeline) {
    console.warn('⚠️ Direct dasha calculation deprecated. Use backend API.');
    return [];
  },

  calculateDailyDasha(monthlyTimeline) {
    console.warn('⚠️ Direct dasha calculation deprecated. Use backend API.');
    return [];
  },
};
