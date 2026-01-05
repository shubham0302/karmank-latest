// Data API Client
// This file fetches protected numerology data from the secure backend
// All proprietary interpretations, yogas, and insights are now hidden on the backend

import { supabase } from '../lib/supabase';
import { EnrichmentRequestSchema, formatValidationError } from '../lib/validators';

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
 * Fetch enrichment data from backend
 * This includes combination insights, yoga details, remedies, etc.
 *
 * @param {number} basicNumber - Basic number (1-9)
 * @param {number} destinyNumber - Destiny number (1-9)
 * @param {string[]} yogaIds - Array of yoga IDs present in the kundli
 * @param {number[]} kundliGrid - The kundli grid array
 * @param {number[]} recurringNumbers - Numbers that appear multiple times
 * @param {number|null} currentMahaDasha - Current maha dasha number (for special remedies)
 * @param {number|null} currentYearlyDasha - Current yearly dasha number (for special remedies)
 * @returns {Promise<object>} Enrichment data from backend
 */
export async function fetchEnrichmentData(basicNumber, destinyNumber, yogaIds, kundliGrid = [], recurringNumbers = [], currentMahaDasha = null, currentYearlyDasha = null) {
  try {
    // ✅ SECURITY: Validate input
    let validated;
    try {
      validated = EnrichmentRequestSchema.parse({
        basicNumber,
        destinyNumber,
        yogaIds,
        kundliGrid,
        recurringNumbers
      });
    } catch (validationError) {
      throw new Error(formatValidationError(validationError));
    }

    console.log('🔐 Fetching protected enrichment data from backend...');

    // ✅ SECURITY: Get authentication token
    const token = await getAuthToken();

    const response = await fetch(`${BACKEND_URL}/api/data/enrichment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // ✅ Send auth token
      },
      body: JSON.stringify({
        ...validated,
        currentMahaDasha,
        currentYearlyDasha
      }),
    });

    // ✅ SECURITY: Handle authentication failures
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Session expired. Please log in again.');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to fetch enrichment data');
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error('Enrichment data fetch failed');
    }

    console.log('✅ Protected data received from backend');

    return result.data;
  } catch (error) {
    console.error('❌ Enrichment data error:', error);
    throw new Error(`Failed to fetch enrichment data: ${error.message}`);
  }
}

/**
 * Helper: Identify which yogas are present in the kundli
 * This logic stays in frontend because it's just identification, not interpretation
 * The actual yoga meanings/details come from the backend
 *
 * @param {number[]} kundliGrid - The kundli grid
 * @param {number} basicNumber - Basic number
 * @param {number} destinyNumber - Destiny number
 * @returns {string[]} Array of yoga IDs
 */
export function identifyPresentYogas(kundliGrid, basicNumber, destinyNumber) {
  const presentYogaIds = [];

  // Basic yoga identification logic
  // These are just the IDs - the actual yoga details/meanings come from backend

  // Raj Yoga: Basic 2, Destiny 1
  if (basicNumber === 2 && destinyNumber === 1) {
    presentYogaIds.push('rajYoga');
  }

  // Sanyam Yoga: Number 3 present, 6 absent
  if (kundliGrid[3] > 0 && kundliGrid[6] === 0) {
    presentYogaIds.push('sanyamYoga');
  }

  // Ekakki Yoga: Only one number present
  const nonZeroCount = kundliGrid.filter((count, idx) => idx > 0 && count > 0).length;
  if (nonZeroCount === 1) {
    presentYogaIds.push('ekakkiYoga');
  }

  // Golden Triangle: 1, 5, 9 all present
  if (kundliGrid[1] > 0 && kundliGrid[5] > 0 && kundliGrid[9] > 0) {
    presentYogaIds.push('goldenTriangle');
  }

  // Royal Path: 1, 2, 3 all present
  if (kundliGrid[1] > 0 && kundliGrid[2] > 0 && kundliGrid[3] > 0) {
    presentYogaIds.push('royalPath');
  }

  // Add more yoga identification logic here as needed
  // Note: We're only identifying WHICH yogas are present
  // The actual meanings/interpretations come from the backend

  return presentYogaIds;
}

/**
 * Helper: Identify recurring numbers in kundli
 *
 * @param {number[]} kundliGrid - The kundli grid
 * @returns {number[]} Array of numbers that appear 2+ times
 */
export function identifyRecurringNumbers(kundliGrid) {
  const recurring = [];
  kundliGrid.forEach((count, number) => {
    if (number > 0 && count >= 2) {
      recurring.push(number);
    }
  });
  return recurring;
}
