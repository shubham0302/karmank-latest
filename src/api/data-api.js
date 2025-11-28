// Data API Client
// This file fetches protected numerology data from the secure backend
// All proprietary interpretations, yogas, and insights are now hidden on the backend

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

/**
 * Fetch enrichment data from backend
 * This includes combination insights, yoga details, remedies, etc.
 *
 * @param {number} basicNumber - Basic number (1-9)
 * @param {number} destinyNumber - Destiny number (1-9)
 * @param {string[]} yogaIds - Array of yoga IDs present in the kundli
 * @param {number[]} kundliGrid - The kundli grid array
 * @param {number[]} recurringNumbers - Numbers that appear multiple times
 * @returns {Promise<object>} Enrichment data from backend
 */
export async function fetchEnrichmentData(basicNumber, destinyNumber, yogaIds, kundliGrid = [], recurringNumbers = []) {
  try {
    console.log('🔐 Fetching protected enrichment data from backend...');

    const response = await fetch(`${BACKEND_URL}/api/data/enrichment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        basicNumber,
        destinyNumber,
        yogaIds,
        kundliGrid,
        recurringNumbers
      }),
    });

    if (!response.ok) {
      const error = await response.json();
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
