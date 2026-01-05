import { DATA } from '../data/data'; // Import from your new data.js file

/**
 * Safely retrieves text in the desired language from a multi-language object.
 * @param {object} textObject - An object with language keys (en, hi, en-hi).
 * @param {string} language - The desired language key ('en', 'hi', 'en-hi').
 * @returns {string} The translated text or an empty string.
 */
export const getText = (textObject, language) => {
    if (textObject && typeof textObject === 'object') {
        return textObject[language] || textObject['en'] || '';
    }
    return textObject || '';
};

/**
 * Reduces a number to a single digit by repeatedly summing its digits.
 * Always returns a single digit (1-9) without any master number exceptions.
 * @param {number|string} num - The number or string to reduce.
 * @returns {number} A single-digit result (1-9).
 */
export const reduceToSingleDigit = (num) => {
    let currentNumStr = String(num);
    while (currentNumStr.length > 1) {
        currentNumStr = String(currentNumStr.split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0));
    }
    return parseInt(currentNumStr, 10);
};

/**
 * Analyzes the influence of recurring numbers in the chart.
 * @param {Array<number>} digitCounts - Array showing count of each digit.
 * @param {number} destinyNumber - The user's destiny number.
 * @returns {Array<object>} An array of analysis results for recurring numbers.
 */
export const analyzeRecurringNumbers = (digitCounts, destinyNumber) => {
    const results = [];
    const rules = DATA.recurringNumberInfluence;
    const language = 'en'; // Default to 'en' for this logic

    for (let num = 1; num <= 9; num++) {
        const count = digitCounts[num];
        if (count <= 1) continue;

        const isDestinyMatch = num === destinyNumber;
        const rule = rules[num];
        if (!rule) continue;
        let influence = [];

        // *** FIXED LOGIC: Use getText to read the multi-language object ***
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
 * @param {object} rules - The activation_rules object for a specific yoga.
 * @param {Array<number>} digitCounts - The array of single-digit frequencies.
 * @returns {boolean} - True if all activation rules are met, false otherwise.
 */
export const checkAdvancedYoga = (rules, digitCounts) => {
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
        if (!rules.requires_presence.every(num => digitCounts[num] > 0)) {
            return false;
        }
    }

    // Check for the required absence of certain digits
    if (rules.requires_absence) {
        if (rules.requires_absence.some(num => digitCounts[num] > 0)) {
            return false;
        }
    }

    return true;
};

/**
 * Checks for special remedy rules based on the chart, including dynamic dasha influences.
 * @param {Array<number>} digitCounts - The array of single-digit frequencies.
 * @param {number} destinyNumber - The user's destiny number.
 * @param {number|null} mahaDasha - The active Maha Dasha number.
 * @param {number|null} annualDasha - The active Annual Dasha number.
 * @returns {Array<object>} An array of special remedy objects.
 */
export const checkForSpecialRemedies = (digitCounts, destinyNumber, mahaDasha = null, annualDasha = null) => {
    const remedies = [];
    const uniqueRemedies = new Set();
    const language = 'en'; // Default to 'en' for this logic

    // 🔍 DEBUG: Log inputs
    console.log('🔍 [checkForSpecialRemedies] Input:', {
        digitCounts,
        destinyNumber,
        mahaDasha,
        annualDasha,
        has4: digitCounts[4] > 0,
        has8: digitCounts[8] > 0,
        has9: digitCounts[9] > 0,
        has5: digitCounts[5] > 0
    });

    // 🔍 DEBUG: Check if DATA is available
    console.log('🔍 [checkForSpecialRemedies] DATA.specialRudrakshaRemedies available:', !!DATA.specialRudrakshaRemedies);
    console.log('🔍 [checkForSpecialRemedies] DATA.specialRudrakshaRemedies[4]:', DATA.specialRudrakshaRemedies?.[4]);
    console.log('🔍 [checkForSpecialRemedies] DATA.specialRudrakshaRemedies[8]:', DATA.specialRudrakshaRemedies?.[8]);

    const addRemedy = (remedy) => {
        console.log('🔍 [addRemedy] Attempting to add:', remedy);
        if (!remedy || !remedy.title) {
            console.log('❌ [addRemedy] Skipped - no remedy or title');
            return;
        }
        const key = getText(remedy.title, language); // Use getText on the title object
        console.log('🔍 [addRemedy] Key:', key);

        if (!uniqueRemedies.has(key)) {
            remedies.push(remedy);
            uniqueRemedies.add(key);
            console.log('✅ [addRemedy] Added successfully');
        } else {
            console.log('⚠️ [addRemedy] Duplicate - skipped');
        }
    };

    // Rule: Presence of 4 in chart OR dasha of 4
    console.log('🔍 [Rule 1] Checking for 4:', digitCounts[4] > 0);
    if (digitCounts[4] > 0 || mahaDasha === 4 || annualDasha === 4) {
        console.log('✅ [Rule 1] Triggered - adding remedy for 4');
        addRemedy(DATA.specialRudrakshaRemedies[4]);
    }

    // Rule: Presence of 8 in chart OR dasha of 8
    console.log('🔍 [Rule 2] Checking for 8:', digitCounts[8] > 0);
    if (digitCounts[8] > 0 || mahaDasha === 8 || annualDasha === 8) {
        console.log('✅ [Rule 2] Triggered - adding remedy for 8');
        addRemedy(DATA.specialRudrakshaRemedies[8]);
    }
    
    // Rule: Destiny 4
    console.log('🔍 [Rule 3] Checking Destiny 4:', destinyNumber === 4);
    if (destinyNumber === 4 && DATA.destinyBasedRemedies[4]) {
        console.log('✅ [Rule 3] Triggered - adding destiny 4 remedy');
        addRemedy(DATA.destinyBasedRemedies[4]);
    }

    // Rule: Combination of 9 and 4 Without 5
    const has9and4without5 = digitCounts[9] > 0 && digitCounts[4] > 0 && digitCounts[5] === 0;
    console.log('🔍 [Rule 4] Checking 9+4 without 5:', has9and4without5);
    if (has9and4without5) {
        console.log('✅ [Rule 4] Triggered - adding 9-4 combination remedy');
        addRemedy({
            type: 'simple',
            title: {en: "Protection Remedy for 9-4 Combination"},
            text: {en: "Your chart contains the numbers 9 and 4 without the balancing energy of 5. It is mandatory to wear a 3 Mukhi Rudraksha for protection."}
        });
    }

    // Rule: Odd Number 4
    const hasOdd4 = digitCounts[4] > 0 && digitCounts[4] % 2 !== 0;
    console.log('🔍 [Rule 5] Checking odd count of 4:', hasOdd4, '(count:', digitCounts[4], ')');
    if (hasOdd4) {
        console.log('✅ [Rule 5] Triggered - adding odd 4 remedy');
        addRemedy({
            type: 'simple',
            title: {en: "Balancing Remedy for Number 4"},
            text: {en: "You have an odd number of 4s in your chart. It is advised to wear a Ganesh Rudraksha to harmonize its energy."}
        });
    }

   // A "positive 1" is defined as having 0 or 1 occurrences, or having 1 as the destiny number.
   const isPositive1 = (digitCounts[1] <= 1 || destinyNumber === 1);
   console.log('🔍 [Rule 6] Checking multiple 1s without Destiny 1:', !isPositive1, '(count 1s:', digitCounts[1], ', destiny:', destinyNumber, ')');
   // Rule: Trigger remedy if the influence of number 1 is NOT positive.
   if (!isPositive1) {
    console.log('✅ [Rule 6] Triggered - adding amplified 1 remedy');
    addRemedy({
        type: 'simple',
        title: {en: "Remedy for Amplified Number 1"},
        text: {en: "Your chart has multiple 1s, but your Destiny Number is not 1. To balance this, you must wear a 1 Mukhi Rudraksha and offer Surya Arghya (water to the Sun) early in the morning while chanting the mantra: ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः (at least 11 times)."}
    });
   }

    console.log('🔍 [checkForSpecialRemedies] Final remedies count:', remedies.length);
    console.log('🔍 [checkForSpecialRemedies] Remedies:', remedies);
    return remedies;
};