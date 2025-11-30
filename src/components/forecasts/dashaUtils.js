/**
 * Utility functions for working with Dasha reports in forecast components
 */

/**
 * Validate dasha report structure
 * @param {Object} dashaReport - The dasha report object
 * @returns {Object} - Validation result with isValid flag and error details
 */
export const validateDashaReport = (dashaReport) => {
  if (!dashaReport) {
    return {
      isValid: false,
      error: 'dashaReport is null or undefined',
      hasYearly: false,
      hasMaha: false,
      hasMonthly: false,
      hasDaily: false
    };
  }

  const hasYearly = Array.isArray(dashaReport.yearlyDashaTimeline) && dashaReport.yearlyDashaTimeline.length > 0;
  const hasMaha = Array.isArray(dashaReport.mahaDashaTimeline) && dashaReport.mahaDashaTimeline.length > 0;
  const hasMonthly = Array.isArray(dashaReport.monthlyDashaTimeline);
  const hasDaily = Array.isArray(dashaReport.dailyDashaTimeline);

  return {
    isValid: hasYearly && hasMaha,
    error: !hasYearly || !hasMaha ? 'Missing required dasha timelines' : null,
    hasYearly,
    hasMaha,
    hasMonthly,
    hasDaily,
    yearlyCount: dashaReport.yearlyDashaTimeline?.length || 0,
    mahaCount: dashaReport.mahaDashaTimeline?.length || 0
  };
};

/**
 * Safe find dasha period for a given date
 * @param {Array} timeline - The dasha timeline array
 * @param {Date} targetDate - The date to search for
 * @param {Function} toDate - Function to convert date strings to Date objects
 * @returns {Object|null} - The found dasha period or null
 */
export const findDashaPeriod = (timeline, targetDate, toDate) => {
  if (!Array.isArray(timeline) || timeline.length === 0) {
    return null;
  }

  return timeline.find(d => {
    try {
      const startDate = toDate(d.startDate);
      const endDate = toDate(d.endDate);
      return targetDate >= startDate && targetDate <= endDate;
    } catch (error) {
      console.error('[dashaUtils] Error comparing dates:', error);
      return false;
    }
  }) || null;
};

/**
 * Get safe dasha numbers for a date
 * @param {Object} dashaReport - The dasha report
 * @param {Date} targetDate - The target date
 * @param {Function} toDate - Function to convert date strings to Date objects
 * @returns {Object} - Object with yearlyDashaNumber and mahaDashaNumber
 */
export const getDashaNumborsForDate = (dashaReport, targetDate, toDate) => {
  const validation = validateDashaReport(dashaReport);

  if (!validation.isValid) {
    console.warn('[dashaUtils] Invalid dashaReport:', validation);
    return {
      yearlyDashaNumber: null,
      mahaDashaNumber: null,
      yearlyDasha: null,
      mahaDasha: null,
      isValid: false
    };
  }

  const yearlyDasha = findDashaPeriod(dashaReport.yearlyDashaTimeline, targetDate, toDate);
  const mahaDasha = findDashaPeriod(dashaReport.mahaDashaTimeline, targetDate, toDate);

  return {
    yearlyDashaNumber: yearlyDasha?.dashaNumber || null,
    mahaDashaNumber: mahaDasha?.dashaNumber || null,
    yearlyDasha,
    mahaDasha,
    isValid: !!(yearlyDasha && mahaDasha)
  };
};
