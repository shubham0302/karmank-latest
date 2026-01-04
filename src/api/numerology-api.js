// Numerology API Client
// This file handles all communication with the secure backend
// Calculation logic AND data interpretations are now completely hidden on the backend

import { checkAdvancedYoga, getText } from '../utils/helpers';
import { fetchEnrichmentData, identifyPresentYogas, identifyRecurringNumbers } from './data-api';
import { DATA } from '../data/data'; // Still needed for yoga identification logic only
import { supabase } from '../lib/supabase';
import { NumerologyRequestSchema, formatValidationError } from '../lib/validators';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

/**
 * Get authentication token for backend requests
 * @returns {Promise<string>} JWT access token
 * @throws {Error} If not authenticated
 */
async function getAuthToken() {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session?.access_token) {
    throw new Error('Not authenticated. Please log in again.');
  }

  return session.access_token;
}

/**
 * Calculate complete numerology report from backend
 * @param {string} dob - Date of birth in YYYY-MM-DD format
 * @returns {Promise<object>} Numerology calculation results
 */
export async function calculateNumerologyFromBackend(dob) {
  try {
    // ✅ SECURITY: Validate input before sending to backend
    let validated;
    try {
      validated = NumerologyRequestSchema.parse({ dob });
    } catch (validationError) {
      throw new Error(formatValidationError(validationError));
    }

    console.log('🔒 Calling secure backend for numerology calculation...');

    // ✅ SECURITY: Get authentication token
    const token = await getAuthToken();

    const response = await fetch(`${BACKEND_URL}/calculate/numerology`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // ✅ Send auth token
      },
      body: JSON.stringify(validated),
    });

    // ✅ SECURITY: Handle authentication failures
    if (response.status === 401) {
      // Session expired, redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Session expired. Please log in again.');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
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
      return {
        number: num,
        occurrences: kundliGrid[num],
        isDestinyMatch: num === destinyNumber,
        // Don't pass backend influence object - component will show message about backend data
      };
    });

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
      combinationInsight: enrichmentData.combinationInsight, // from backend
      // Extract specific data from backend numberDetails (don't pass the whole object)
      destinyTraits: enrichmentData.numberDetails?.traits || {}, // For NumerologyTraitsTab
      destinyProfessions: enrichmentData.numberDetails?.professions || null, // For NumerologyTraitsTab
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

    console.log('[DashaCalculator] Raw backend yearly timeline sample:', backendData.dashaTimelines.yearly?.slice(0, 2));
    console.log('[DashaCalculator] Raw backend maha timeline sample:', backendData.dashaTimelines.maha?.slice(0, 2));

    // Helper to safely parse dates - handles both string and Date inputs
    const parseDate = (dateInput) => {
      if (!dateInput) return new Date();
      if (dateInput instanceof Date) return dateInput;

      // If it's a string, parse it as a date
      const dateStr = String(dateInput).trim();

      // Try to parse ISO date strings (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)
      // Remove any timezone info and parse in local timezone
      const cleanDateStr = dateStr.split('T')[0]; // Get just the date part
      const [year, month, day] = cleanDateStr.split('-').map(Number);

      if (year && month && day) {
        // Create date in local timezone at midnight
        return new Date(year, month - 1, day, 0, 0, 0, 0);
      }

      // Fallback to Date constructor
      return new Date(dateStr);
    };

    return {
      mahaDashaTimeline: backendData.dashaTimelines.maha.map(d => ({
        ...d,
        startDate: parseDate(d.startDate),
        endDate: parseDate(d.endDate),
      })),
      yearlyDashaTimeline: backendData.dashaTimelines.yearly.map(d => ({
        ...d,
        startDate: parseDate(d.startDate),
        endDate: parseDate(d.endDate),
      })),
      monthlyDashaTimeline: backendData.dashaTimelines.monthly.map(d => ({
        ...d,
        startDate: parseDate(d.startDate),
        endDate: parseDate(d.endDate),
      })),
      dailyDashaTimeline: backendData.dashaTimelines.daily.map(d => ({
        ...d,
        date: parseDate(d.date),
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

