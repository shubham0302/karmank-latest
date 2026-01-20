/**
 * Local Data Access Layer
 *
 * This module provides access to user-specific data from the report
 * Instead of importing the complete DATA object, components use these functions
 * to access only the data that's relevant to the user's numerology report.
 *
 * This ensures that:
 * 1. No component can access data it shouldn't
 * 2. Only user-specific data is ever displayed
 * 3. Complete knowledge base remains protected on the backend
 */

/**
 * Get number details for a specific number from user's report
 */
export const getNumberDetail = (report: any, number: number) => {
  if (!report?.relevantData?.numberDetails) {
    console.warn(`[LocalData] Number details not available in report`);
    return null;
  }

  return report.relevantData.numberDetails[number] || null;
};

/**
 * Get all number details for user's chart
 */
export const getAllNumberDetails = (report: any) => {
  return report?.relevantData?.numberDetails || {};
};

/**
 * Get remedy data for a specific number
 */
export const getRemedyData = (report: any, number: number) => {
  if (!report?.relevantData?.remedies) {
    return null;
  }

  return report.relevantData.remedies[number] || null;
};

/**
 * Get all remedies for user
 */
export const getAllRemedies = (report: any) => {
  return report?.relevantData?.remedies || {};
};

/**
 * Get rudraksha recommendation for a specific number
 */
export const getRudrakshaData = (report: any, number: number) => {
  if (!report?.relevantData?.rudrakshaRemedies) {
    return null;
  }

  return report.relevantData.rudrakshaRemedies[number] || null;
};

/**
 * Get all rudraksha recommendations
 */
export const getAllRudrakshaData = (report: any) => {
  return report?.relevantData?.rudrakshaRemedies || {};
};

/**
 * Get advanced rudraksha data for a specific number
 */
export const getAdvancedRudrakshaData = (report: any, number: number) => {
  if (!report?.relevantData?.advancedRudrakshaRemedies) {
    return null;
  }

  return report.relevantData.advancedRudrakshaRemedies[number] || null;
};

/**
 * Get all advanced rudraksha data
 */
export const getAllAdvancedRudrakshaData = (report: any) => {
  return report?.relevantData?.advancedRudrakshaRemedies || {};
};

/**
 * Get mantra for a specific number
 */
export const getMantraData = (report: any, number: number) => {
  if (!report?.relevantData?.mantras) {
    return null;
  }

  return report.relevantData.mantras[number] || null;
};

/**
 * Get all mantras for user
 */
export const getAllMantras = (report: any) => {
  return report?.relevantData?.mantras || {};
};

/**
 * Get yoga details (only yogas present in user's chart)
 */
export const getYogaDetails = (report: any) => {
  return report?.relevantData?.yogas || [];
};

/**
 * Check if user has a specific yoga
 */
export const hasYoga = (report: any, yogaName: string) => {
  const yogas = getYogaDetails(report);
  return yogas.some((y: any) => {
    const name = y.name || y.id;
    return name?.toLowerCase?.() === yogaName.toLowerCase?.();
  });
};

/**
 * Get combination insight for user's basic-destiny pair
 */
export const getCombinationInsight = (report: any) => {
  return report?.relevantData?.combinationInsights || null;
};

/**
 * Get dasha traits for a specific dasha number
 */
export const getDashaTraits = (report: any, dashaNumber: number) => {
  if (!report?.relevantData?.dashaTraits) {
    return null;
  }

  return report.relevantData.dashaTraits[dashaNumber] || null;
};

/**
 * Get all dasha traits
 */
export const getAllDashaTraits = (report: any) => {
  return report?.relevantData?.dashaTraits || {};
};

/**
 * Get recurring number influences
 */
export const getRecurringNumberInfluences = (report: any) => {
  return report?.relevantData?.recurringNumberInfluences || [];
};

/**
 * Get special insights (already filtered during calculation)
 */
export const getSpecialInsights = (report: any) => {
  return report?.relevantData?.specialInsights || [];
};

/**
 * Get special remedies (already filtered during calculation)
 */
export const getSpecialRemedies = (report: any) => {
  return report?.relevantData?.specialRemedies || [];
};

/**
 * Get gender-specific traits
 */
export const getGenderTraits = (report: any) => {
  return report?.relevantData?.genderTraits || null;
};

/**
 * Get asset compatibility for user's destiny number
 */
export const getAssetCompatibility = (report: any) => {
  return report?.relevantData?.assetCompatibility || null;
};

/**
 * Get color for a number
 */
export const getNumberColor = (report: any, number: number): string => {
  const colorMap = report?.relevantData?.colors || {};
  return colorMap[number] || '#808080';
};

/**
 * Safe getter with fallback error message and null coalescing
 * Usage: getSafeData(report, 'numberDetails.1.coreVibration', 'Not available')
 */
export const getSafeData = (
  report: any,
  path: string,
  defaultValue: any = null
) => {
  const keys = path.split('.');
  let current = report?.relevantData;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return defaultValue;
    }
  }

  return current ?? defaultValue;
};

/**
 * Get text in specified language from a multi-language object
 * Usage: getText(numberDetail?.coreVibration, 'en')
 */
export const getTextFromData = (
  textObject: any,
  language: string = 'en'
): string => {
  if (!textObject) return '';

  if (typeof textObject === 'string') {
    return textObject;
  }

  if (typeof textObject === 'object') {
    return textObject[language] || textObject['en'] || '';
  }

  return String(textObject);
};

/**
 * Check if report has valid relevant data
 */
export const hasValidRelevantData = (report: any): boolean => {
  return !!(
    report?.relevantData &&
    report.relevantData.numberDetails &&
    Object.keys(report.relevantData.numberDetails).length > 0
  );
};

/**
 * Get all relevant number keys from user's chart
 */
export const getRelevantNumbers = (report: any): number[] => {
  const numberDetails = getAllNumberDetails(report);
  return Object.keys(numberDetails)
    .map(key => parseInt(key, 10))
    .sort((a, b) => a - b);
};

/**
 * Get a summary of what data is available for this user
 * Useful for debugging/testing
 */
export const getDataSummary = (report: any) => {
  return {
    hasNumberDetails: !!report?.relevantData?.numberDetails,
    numberCount: Object.keys(report?.relevantData?.numberDetails || {}).length,
    yogaCount: (report?.relevantData?.yogas || []).length,
    remedyCount: Object.keys(report?.relevantData?.remedies || {}).length,
    rudrakshaCount: Object.keys(report?.relevantData?.rudrakshaRemedies || {}).length,
    mantraCount: Object.keys(report?.relevantData?.mantras || {}).length,
    hasCombinationInsight: !!report?.relevantData?.combinationInsights,
    hasGenderTraits: !!report?.relevantData?.genderTraits,
    hasAssetCompatibility: !!report?.relevantData?.assetCompatibility
  };
};
