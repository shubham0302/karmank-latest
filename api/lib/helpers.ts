import { DATA } from '../data/data.js';

/**
 * Safely retrieves text in the desired language from a multi-language object.
 * @param textObject - An object with language keys (en, hi, en-hi).
 * @param language - The desired language key ('en', 'hi', 'en-hi').
 * @returns The translated text or an empty string.
 */
export const getText = (textObject: any, language: string = 'en'): string => {
  if (textObject && typeof textObject === 'object') {
    return textObject[language] || textObject['en'] || '';
  }
  return textObject || '';
};

/**
 * Reduces a number to a single digit by repeatedly summing its digits.
 * Always returns a single digit (1-9) without any master number exceptions.
 * @param num - The number or string to reduce.
 * @returns A single-digit result (1-9).
 */
export const reduceToSingleDigit = (num: number | string): number => {
  let currentNumStr = String(num);
  while (currentNumStr.length > 1) {
    currentNumStr = String(
      currentNumStr.split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0)
    );
  }
  return parseInt(currentNumStr, 10);
};

/**
 * Analyzes the influence of recurring numbers in the chart.
 * @param digitCounts - Array showing count of each digit.
 * @param destinyNumber - The user's destiny number.
 * @returns An array of analysis results for recurring numbers.
 */
export const analyzeRecurringNumbers = (digitCounts: number[], destinyNumber: number): any[] => {
  const results = [];
  const rules = DATA.recurringNumberInfluence;
  const language = 'en'; // Default to 'en' for this logic

  for (let num = 1; num <= 9; num++) {
    const count = digitCounts[num];
    if (count <= 1) continue;

    const isDestinyMatch = num === destinyNumber;
    const rule = rules[num];
    if (!rule) continue;
    let influence: string[] = [];

    if (rule.base) influence.push(getText(rule.base, language));
    if (count >= 3 && rule.threeOrMore) influence.push(getText(rule.threeOrMore, language));
    if (isDestinyMatch && rule.withDestiny) influence.push(getText(rule.withDestiny, language));
    if (rule.evenCount && count % 2 === 0) influence.push(getText(rule.evenCount, language));
    if (rule.oddCount && count % 2 !== 0) influence.push(getText(rule.oddCount, language));

    if (influence.length > 0) {
      results.push({
        number: num,
        occurrences: count,
        influence: influence.join(' ')
      });
    }
  }
  return results;
};

/**
 * Checks for advanced, pattern-based yogas using explicit activation rules.
 * @param rules - The activation_rules object for a specific yoga.
 * @param digitCounts - The array of single-digit frequencies.
 * @returns True if all activation rules are met, false otherwise.
 */
export const checkAdvancedYoga = (rules: any, digitCounts: number[]): boolean => {
  // Check for required counts of specific digits
  if (rules.requires_counts) {
    for (const [numStr, requiredCount] of Object.entries(rules.requires_counts)) {
      const num = parseInt(numStr, 10);
      if ((digitCounts[num] || 0) < requiredCount) {
        return false;
      }
    }
  }

  // Check for the simple presence of certain digits
  if (rules.requires_presence) {
    if (!rules.requires_presence.every((num: number) => digitCounts[num] > 0)) {
      return false;
    }
  }

  // Check for the required absence of certain digits
  if (rules.requires_absence) {
    if (rules.requires_absence.some((num: number) => digitCounts[num] > 0)) {
      return false;
    }
  }

  return true;
};

/**
 * Checks for special remedy rules based on the chart.
 * @param digitCounts - The array of single-digit frequencies.
 * @param destinyNumber - The user's destiny number.
 * @param mahaDasha - The active Maha Dasha number (optional).
 * @param annualDasha - The active Annual Dasha number (optional).
 * @returns An array of special remedy objects.
 */
export const checkForSpecialRemedies = (
  digitCounts: number[],
  destinyNumber: number,
  mahaDasha: number | null = null,
  annualDasha: number | null = null
): any[] => {
  const remedies = [];
  const uniqueRemedies = new Set<string>();
  const language = 'en'; // Default to 'en' for this logic

  const addRemedy = (remedy: any) => {
    if (!remedy || !remedy.title) return; // Safety check
    const key = getText(remedy.title, language); // Use getText on the title object

    if (!uniqueRemedies.has(key)) {
      remedies.push(remedy);
      uniqueRemedies.add(key);
    }
  };

  // Rule: Presence of 4 in chart OR dasha of 4
  if (digitCounts[4] > 0 || mahaDasha === 4 || annualDasha === 4) {
    if (DATA.specialRudrakshaRemedies[4]) {
      addRemedy(DATA.specialRudrakshaRemedies[4]);
    }
  }

  // Rule: Presence of 8 in chart OR dasha of 8
  if (digitCounts[8] > 0 || mahaDasha === 8 || annualDasha === 8) {
    if (DATA.specialRudrakshaRemedies[8]) {
      addRemedy(DATA.specialRudrakshaRemedies[8]);
    }
  }

  // Rule: Destiny 4
  if (destinyNumber === 4 && DATA.destinyBasedRemedies[4]) {
    addRemedy(DATA.destinyBasedRemedies[4]);
  }

  // Rule: Combination of 9 and 4 Without 5
  if (digitCounts[9] > 0 && digitCounts[4] > 0 && digitCounts[5] === 0) {
    addRemedy({
      type: 'simple',
      title: { en: 'Protection Remedy for 9-4 Combination' },
      text: {
        en: 'Your chart contains the numbers 9 and 4 without the balancing energy of 5. It is mandatory to wear a 3 Mukhi Rudraksha for protection.'
      }
    });
  }

  // Rule: Odd Number 4
  if (digitCounts[4] > 0 && digitCounts[4] % 2 !== 0) {
    addRemedy({
      type: 'simple',
      title: { en: 'Balancing Remedy for Number 4' },
      text: {
        en: 'You have an odd number of 4s in your chart. It is advised to wear a Ganesh Rudraksha to harmonize its energy.'
      }
    });
  }

  // A "positive 1" is defined as having 0 or 1 occurrences, or having 1 as the destiny number.
  const isPositive1 = digitCounts[1] <= 1 || destinyNumber === 1;
  // Rule: Trigger remedy if the influence of number 1 is NOT positive.
  if (!isPositive1) {
    addRemedy({
      type: 'simple',
      title: { en: 'Remedy for Amplified Number 1' },
      text: {
        en: 'Your chart has multiple 1s, but your Destiny Number is not 1. To balance this, you must wear a 1 Mukhi Rudraksha and offer Surya Arghya (water to the Sun) early in the morning while chanting the mantra: ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः (at least 11 times).'
      }
    });
  }

  return remedies;
};
