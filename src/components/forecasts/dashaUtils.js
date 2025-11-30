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
 * Normalize a date to UTC midnight for consistent comparison across timezones
 * @param {Date} date - The date to normalize
 * @returns {Date} - New date normalized to UTC midnight
 */
const normalizeDateToUTCMidnight = (date) => {
  const utcDate = new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    0, 0, 0, 0
  ));
  return utcDate;
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
    console.warn('[dashaUtils] Timeline is empty or not an array');
    return null;
  }

  // Normalize target date to UTC midnight for consistent comparison
  const normalizedTarget = normalizeDateToUTCMidnight(targetDate);

  console.log('[dashaUtils] Searching for date:', {
    original: targetDate.toISOString(),
    normalized: normalizedTarget.toISOString(),
    timelineLength: timeline.length
  });

  let found = null;
  for (let i = 0; i < timeline.length; i++) {
    const d = timeline[i];
    try {
      const startDateObj = toDate(d.startDate);
      const endDateObj = toDate(d.endDate);

      // Normalize both start and end dates to UTC midnight
      const startDate = normalizeDateToUTCMidnight(startDateObj);
      const endDate = normalizeDateToUTCMidnight(endDateObj);

      if (normalizedTarget >= startDate && normalizedTarget <= endDate) {
        console.log('[dashaUtils] Found matching period:', {
          dashaNumber: d.dashaNumber,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          targetDate: normalizedTarget.toISOString()
        });
        found = d;
        break;
      }
    } catch (error) {
      console.error('[dashaUtils] Error comparing dates at index', i, ':', error);
    }
  }

  if (!found) {
    console.warn('[dashaUtils] No matching dasha period found for date:', normalizedTarget.toISOString());
    console.log('[dashaUtils] First 3 periods in timeline:', timeline.slice(0, 3).map(d => {
      const start = toDate(d.startDate);
      const end = toDate(d.endDate);
      return {
        dashaNumber: d.dashaNumber,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        normalizedStart: normalizeDateToUTCMidnight(start).toISOString(),
        normalizedEnd: normalizeDateToUTCMidnight(end).toISOString()
      };
    }));
  }

  return found || null;
};

/**
 * Get safe dasha numbers for a date
 * @param {Object} dashaReport - The dasha report
 * @param {Date} targetDate - The target date
 * @param {Function} toDate - Function to convert date strings to Date objects
 * @returns {Object} - Object with yearlyDashaNumber and mahaDashaNumber
 */
export const getDashaNumborsForDate = (dashaReport, targetDate, toDate) => {
  console.log('[dashaUtils] getDashaNumborsForDate called with targetDate:', targetDate);

  const validation = validateDashaReport(dashaReport);
  console.log('[dashaUtils] Dasha report validation:', validation);

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

  console.log('[dashaUtils] Looking for yearly dasha period...');
  const yearlyDasha = findDashaPeriod(dashaReport.yearlyDashaTimeline, targetDate, toDate);

  console.log('[dashaUtils] Looking for maha dasha period...');
  const mahaDasha = findDashaPeriod(dashaReport.mahaDashaTimeline, targetDate, toDate);

  console.log('[dashaUtils] Result:', {
    foundYearly: !!yearlyDasha,
    foundMaha: !!mahaDasha,
    yearlyDashaNumber: yearlyDasha?.dashaNumber || null,
    mahaDashaNumber: mahaDasha?.dashaNumber || null
  });

  return {
    yearlyDashaNumber: yearlyDasha?.dashaNumber || null,
    mahaDashaNumber: mahaDasha?.dashaNumber || null,
    yearlyDasha,
    mahaDasha,
    isValid: !!(yearlyDasha && mahaDasha)
  };
};
