import { DATA, combinationInsights } from "../data/data.js";

/**
 * Data Filtering Module
 * Filters complete knowledge base to return only user-specific relevant data
 * No user ever sees the complete data.js - only what's relevant to their report
 */

/**
 * Extract all unique numbers present in user's chart
 */
export const getAllRelevantNumbers = (
  digitCounts: number[],
  destinyNumber: number
): number[] => {
  const numbers = new Set<number>();

  // Add all numbers that appear in the chart
  for (let i = 1; i <= 9; i++) {
    if (digitCounts[i] > 0) {
      numbers.add(i);
    }
  }

  // Always add destiny number
  numbers.add(destinyNumber);

  return Array.from(numbers).sort((a, b) => a - b);
};

/**
 * Filter number details for given numbers
 * Returns only the number details relevant to user's chart
 */
export const filterNumberDetails = (
  numbers: number[]
): { [key: number]: any } => {
  const filtered: { [key: number]: any } = {};
  const numberDetails = (DATA as any).numberDetails || {};

  numbers.forEach((num) => {
    if (numberDetails[num]) {
      filtered[num] = numberDetails[num];
    }
  });

  return filtered;
};

/**
 * Filter yoga details for yogas present in user's chart
 * Returns complete yoga objects only for detected yogas
 */
export const filterYogaDetails = (yogas: any[]): any[] => {
  if (!yogas || yogas.length === 0) return [];

  const yogaDetails = (DATA as any).yogaDetails || {};

  // Yogas array already contains only detected yogas
  // Ensure we return full yoga details
  return yogas
    .map((yoga) => {
      // If yoga is just an ID, look it up in DATA
      if (typeof yoga === "string") {
        return yogaDetails[yoga] || null;
      }
      // Otherwise it's already a full yoga object
      return yoga;
    })
    .filter((y) => y !== null);
};

/**
 * Get combination insight for basic-destiny pair
 * Returns the specific insight for this user's numbers
 */
export const getCombinationInsight = (
  basicNum: number,
  destinyNum: number
): any => {
  const key = `${basicNum}-${destinyNum}`;
  return (combinationInsights as any)[key] || null;
};

/**
 * Filter remedies for given numbers
 * Returns only remedy data relevant to user's numbers
 */
export const filterRemedies = (numbers: number[]): { [key: number]: any } => {
  const filtered: { [key: number]: any } = {};
  const remedies = (DATA as any).remedies || {};

  numbers.forEach((num) => {
    if (remedies[num]) {
      filtered[num] = remedies[num];
    }
  });

  return filtered;
};

/**
 * Filter rudraksha data for given numbers
 * Returns rudraksha recommendations for user's numbers, filtered by destiny number and multiplicity
 */
export const filterRudrakshaData = (
  numbers: number[],
  digitCounts?: number[],
  destinyNumber?: number
): { basic: { [key: number]: any }; advanced: { [key: number]: any } } => {
  const basicRemedies: { [key: number]: any } = {};
  const advancedRemedies: { [key: number]: any } = {};
  const rudrakshaRemedies = (DATA as any).rudrakshaRemedies || {};
  const advancedRudrakshaRemedies = (DATA as any).advancedRudrakshaRemedies || {};

  numbers.forEach((num) => {
    // If no digit counts provided, include all rudraksha for these numbers
    if (!digitCounts || destinyNumber === undefined) {
      if (rudrakshaRemedies[num]) {
        basicRemedies[num] = rudrakshaRemedies[num];
      }
      if (advancedRudrakshaRemedies[num]) {
        advancedRemedies[num] = advancedRudrakshaRemedies[num];
      }
      return;
    }

    // Multiplicity check: Include rudraksha if:
    // 1. Number appears only once, OR
    // 2. Number appears multiple times AND is the destiny number
    const count = digitCounts[num] || 0;
    const isDestinyMatch = num === destinyNumber;

    // Include rudraksha if:
    // - Number has single or zero occurrence, OR
    // - Number has multiple occurrences AND matches destiny number (harmonious)
    const shouldInclude = count <= 1 || (count > 1 && isDestinyMatch);

    if (shouldInclude) {
      if (rudrakshaRemedies[num]) {
        basicRemedies[num] = rudrakshaRemedies[num];
      }
      if (advancedRudrakshaRemedies[num]) {
        advancedRemedies[num] = advancedRudrakshaRemedies[num];
      }
    }
  });

  return { basic: basicRemedies, advanced: advancedRemedies };
};

/**
 * Filter mantras for given numbers
 * Returns mantras relevant to user's numbers, filtered by destiny number and multiplicity
 */
export const filterMantras = (
  numbers: number[],
  digitCounts?: number[],
  destinyNumber?: number
): { [key: number]: any } => {
  const filtered: { [key: number]: any } = {};
  const mantraRemedies = (DATA as any).mantraRemedies || {};

  numbers.forEach((num) => {
    if (!mantraRemedies[num]) return;

    // If no digit counts provided, include all mantras for these numbers
    if (!digitCounts || destinyNumber === undefined) {
      filtered[num] = mantraRemedies[num];
      return;
    }

    // Multiplicity check: Include mantra if:
    // 1. Number appears only once, OR
    // 2. Number appears multiple times AND is the destiny number, OR
    // 3. Number appears once (single occurrence is always included)
    const count = digitCounts[num] || 0;
    const isDestinyMatch = num === destinyNumber;

    // Include mantra if:
    // - Number has single or zero occurrence, OR
    // - Number has multiple occurrences AND matches destiny number (harmonious)
    const shouldInclude = count <= 1 || (count > 1 && isDestinyMatch);

    if (shouldInclude) {
      filtered[num] = mantraRemedies[num];
    }
  });

  return filtered;
};

/**
 * Extract dasha traits for numbers appearing in user's dasha timeline
 * Returns traits only for dasha numbers user will experience
 */
export const extractDashaTraits = (
  dashaTimeline: any[]
): { [key: number]: any } => {
  const traits: { [key: number]: any } = {};
  const seenNumbers = new Set<number>();

  // Collect all unique dasha numbers from timeline
  dashaTimeline.forEach((period) => {
    if (period.dashaNumber && !seenNumbers.has(period.dashaNumber)) {
      seenNumbers.add(period.dashaNumber);
    }
  });

  // Get dasha traits for these numbers
  seenNumbers.forEach((num) => {
    const destinyDetails = (DATA as any).destinyNumberDetails;
    if (destinyDetails && destinyDetails[num]) {
      traits[num] = destinyDetails[num];
    }
  });

  return traits;
};

/**
 * Filter recurring number influences for numbers in user's chart
 * Returns influence descriptions only for recurring numbers user has
 */
export const filterRecurringNumberInfluences = (
  digitCounts: number[]
): any[] => {
  const influences = [];
  const rules = DATA.recurringNumberInfluence || {};

  for (let num = 1; num <= 9; num++) {
    const count = digitCounts[num];

    // Only include if number appears more than once
    if (count > 1 && (rules as any)[num]) {
      influences.push({
        number: num,
        occurrences: count,
        details: (rules as any)[num],
      });
    }
  }

  return influences;
};

/**
 * Get special remedies applicable to user
 * Returns remedies that match user's specific chart conditions
 */
export const filterSpecialRemedies = (specialRemedies: any[]): any[] => {
  // Special remedies are already filtered by helper functions during calculation
  // Just return them as-is
  return specialRemedies || [];
};

/**
 * Get gender-specific traits (if available)
 * Returns traits specific to user's gender
 */
export const getGenderSpecificTraits = (
  destinyNumber: number,
  gender: string
): any => {
  // Normalize gender to lowercase for comparison
  const normalizedGender = gender?.toLowerCase() || "other";

  // Try to find destiny-specific traits first
  const destinyDetails = (DATA as any).destinyNumberDetails?.[destinyNumber];

  if (!destinyDetails) return null;

  // Look for gender-specific information
  if (normalizedGender === "female" && destinyDetails.femaleTraits) {
    return destinyDetails.femaleTraits;
  }

  if (normalizedGender === "male" && destinyDetails.maleTraits) {
    return destinyDetails.maleTraits;
  }

  return destinyDetails.traits || null;
};

/**
 * Extract asset compatibility data (static reference data)
 * This is reference data, but can be filtered to show only user's relevant compatibility
 */
export const getAssetCompatibility = (destinyNumber: number): any => {
  if (
    !DATA.assetCompatibility ||
    !(DATA.assetCompatibility as any)[destinyNumber]
  ) {
    return null;
  }

  return (DATA.assetCompatibility as any)[destinyNumber];
};

/**
 * Build complete relevant data set for user
 * This is the main function called by API endpoint
 * Returns only the data needed for user's specific report
 */
export const buildRelevantDataSet = (
  mainReport: any,
  dashaReport: any,
  gender: string = "Other"
): any => {
  const {
    basicNumber,
    destinyNumber,
    baseKundliGrid,
    yogas,
    recurringNumbersAnalysis,
    specialInsights,
    specialRemedies,
  } = mainReport;

  // Get all numbers relevant to this user
  const relevantNumbers = getAllRelevantNumbers(baseKundliGrid, destinyNumber);

  // Get all dasha numbers user will experience
  const allDashaNumbers = new Set<number>();
  if (dashaReport?.mahaDashaTimeline) {
    dashaReport.mahaDashaTimeline.forEach((p: any) =>
      allDashaNumbers.add(p.dashaNumber)
    );
  }
  if (dashaReport?.yearlyDashaTimeline) {
    dashaReport.yearlyDashaTimeline.forEach((p: any) =>
      allDashaNumbers.add(p.dashaNumber)
    );
  }
  if (dashaReport?.monthlyDashaTimeline) {
    dashaReport.monthlyDashaTimeline.forEach((p: any) =>
      allDashaNumbers.add(p.dashaNumber)
    );
  }

  // Combine chart numbers and dasha numbers for complete number details
  const allRelevantNumbers = Array.from(
    new Set([...relevantNumbers, ...Array.from(allDashaNumbers)])
  );

  // Build filtered data sets
  const numberDetails = filterNumberDetails(allRelevantNumbers);
  const yogaDetails = filterYogaDetails(yogas);
  const combinationInsight = getCombinationInsight(basicNumber, destinyNumber);
  const remedies = filterRemedies(relevantNumbers);
  const rudrakshaData = filterRudrakshaData(relevantNumbers, baseKundliGrid, destinyNumber);
  const mantras = filterMantras(relevantNumbers, baseKundliGrid, destinyNumber);
  const dashaTraits = extractDashaTraits(dashaReport?.mahaDashaTimeline || []);
  const recurringInfluences = filterRecurringNumberInfluences(baseKundliGrid);
  const genderTraits = getGenderSpecificTraits(destinyNumber, gender);
  const assetCompatibility = getAssetCompatibility(destinyNumber);

  return {
    // Numbers in chart
    numberDetails,

    // Yogas detected in base chart
    yogas: yogaDetails,

    // All yoga definitions (for dynamic yoga detection in AdvancedDashaTab)
    allYogaDefinitions: DATA.yogaDetails || {},

    // Specific combination insight
    combinationInsights: combinationInsight,

    // Remedies (basic)
    remedies,

    // Rudraksha recommendations
    rudrakshaRemedies: rudrakshaData.basic,
    advancedRudrakshaRemedies: rudrakshaData.advanced,

    // Mantras
    mantras,

    // Dasha period information
    dashaTraits,

    // Recurring number influences (analyzed from base chart)
    recurringNumberInfluences: recurringInfluences,

    // All recurring number influence rules (for dynamic analysis in AdvancedDashaTab)
    recurringNumberInfluenceRules: DATA.recurringNumberInfluence || {},

    // Special insights (already filtered during calculation)
    specialInsights,

    // Special remedies (already filtered during calculation)
    specialRemedies,

    // Gender-specific traits
    genderTraits,

    // Asset compatibility
    assetCompatibility,

    // Chakra data (static reference data)
    chakraData: DATA.chakraData || {},

    // Multiple number remedies (for amplified numbers)
    multipleNumberRemedies: DATA.multipleNumberRemedies || {},

    // Destiny traits (for NumerologyTraitsTab)
    destinyTraits: DATA.destinyTraits || {},

    // Destiny professions (for NumerologyTraitsTab)
    destinyProfessions: DATA.destinyProfessions || {},

    // Combined dasha insights (for AdvancedDashaTab)
    combinedDashaInsights: DATA.combinedDashaInsights || {},

    // Destiny compatibility (for forecasts)
    destinyCompatibility: DATA.destinyCompatibility || {},

    // Color associations (static)
    colors: {
      [basicNumber]: getNumberColor(basicNumber),
      [destinyNumber]: getNumberColor(destinyNumber),
    },
  };
};

/**
 * Get color associated with a number (for UI)
 * Helper function for visual representation
 */
export const getNumberColor = (number: number): string => {
  const colorMap: { [key: number]: string } = {
    1: "#FFD700", // Gold
    2: "#FF69B4", // Pink
    3: "#FFA500", // Orange
    4: "#4169E1", // Royal Blue
    5: "#32CD32", // Lime Green
    6: "#20B2AA", // Light Sea Green
    7: "#9370DB", // Medium Purple
    8: "#DC143C", // Crimson
    9: "#FF4500", // Orange Red
  };

  return colorMap[number] || "#808080";
};

/**
 * Validate that all required data is present
 * Helper function for debugging
 */
export const validateFilteredData = (relevantData: any): boolean => {
  const requiredFields = [
    "numberDetails",
    "yogas",
    "remedies",
    "mantras",
    "dashaTraits",
  ];

  for (const field of requiredFields) {
    if (!(field in relevantData)) {
      console.warn(`[DataFiltering] Missing required field: ${field}`);
      return false;
    }
  }

  return true;
};
