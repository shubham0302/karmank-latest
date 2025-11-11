import { reduceToSingleDigit, analyzeRecurringNumbers, checkAdvancedYoga, checkForSpecialRemedies, getText } from './helpers';
import { DATA } from '../data/data';

/**
 * Calculates the base numerology report.
 * @param {string} dob - The date of birth in 'YYYY-MM-DD' format.
 * @returns {object|null} The numerology report or null if DOB is invalid.
 */
export const calculateNumerology = (dob) => {
    if (!dob) return null;
    const date = new Date(dob + 'T00:00:00');
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const basicNumber = reduceToSingleDigit(day);
    const dobString = `${day}${month}${year}`;
    const destinyNumber = reduceToSingleDigit(dobString.split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0));
    
    const kundliDigitsStr = (String(day).padStart(2, '0') + String(month).padStart(2, '0') + String(year).substring(2)).replace(/0/g, '');
    
    const digitCounts = Array(10).fill(0);
    for (const char of kundliDigitsStr) {
        digitCounts[parseInt(char)]++;
    }
    
    digitCounts[destinyNumber]++;
    if (day > 9 && day % 10 !== 0) {
        digitCounts[basicNumber]++;
    }
    
    const yogas = [];
    // Standard Yoga check based on number presence
    Object.values(DATA.yogaDetails).forEach(yoga => {
        let isPresent = false;
        if (yoga.activation_rules) {
            isPresent = checkAdvancedYoga(yoga.activation_rules, digitCounts);
        } 
        else if (yoga.numbers && Array.isArray(yoga.numbers)) {
            isPresent = yoga.numbers.every(num => digitCounts[num] > 0);
            if (isPresent && yoga.empty && yoga.empty.length > 0) {
                if (yoga.empty.some(num => digitCounts[num] > 0)) {
                    isPresent = false;
                }
            }
        }
        if (isPresent) {
            yogas.push(yoga);
        }
    });
    
    // Special Yoga Checks (Basic 2, Destiny 1)
    if (basicNumber === 2 && destinyNumber === 1) {
        if (!yogas.some(y => getText(y.name, 'en') === "Raj Yoga / Surya Chandra Yoga")) {
            yogas.push(DATA.yogaDetails.rajYoga);
        }
    }
    
    const recurringNumbersAnalysis = analyzeRecurringNumbers(digitCounts, destinyNumber);
    
    let specialInsights = [];
    if (day === 22) {
        specialInsights.push({
            title: "Born on the 22nd",
            text: "For individuals born on the 22nd of any month, there is a possibility of living separately from one or both parents for extended periods. This may be due to various factors such as career, business, or other circumstances."
        });
    }
    
    const specialRemedies = checkForSpecialRemedies(digitCounts, destinyNumber);
    
    return {
        dob: date,
        basicNumber,
        destinyNumber,
        baseKundliGrid: digitCounts,
        yogas,
        recurringNumbersAnalysis,
        specialInsights,
        specialRemedies,
    };
};

/**
 * A standalone object containing all Dasha calculation logic.
 */
export const dashaCalculator = {
    weekdayNumberMap: [1, 2, 9, 5, 3, 6, 8], // Sun=1, Mon=2, Tue=9, ... Sat=8
    pratyantarDurationMap: { 1: 8, 2: 16, 3: 24, 4: 32, 5: 41, 6: 49, 7: 57, 8: 64, 9: 74 },
    
    calculateMahaDasha(dob, basicNum) {
        const timeline = [];
        let startDate = new Date(dob);
        let dashaNumber = basicNum;
        for (let i = 0; i < 3; i++) { // Calculate for a few cycles
            for (let j = 0; j < 9; j++) {
                const spanYears = dashaNumber;
                let endDate = new Date(startDate);
                endDate.setFullYear(endDate.getFullYear() + spanYears);
                endDate.setDate(endDate.getDate() - 1);
                timeline.push({ dashaNumber, startDate, endDate });
                startDate = new Date(endDate);
                startDate.setDate(startDate.getDate() + 1);
                dashaNumber = dashaNumber % 9 + 1;
            }
        }
        return timeline;
    },
    calculateYearlyDasha(dob, basicNum) {
        const timeline = [];
        const birthMonth = dob.getMonth();
        const birthDate = dob.getDate();
        for (let i = 0; i < 100; i++) { // Calculate for 100 years
            const targetYear = dob.getFullYear() + i;
            const birthdayOfTargetYear = new Date(targetYear, birthMonth, birthDate);
            const dayOfWeek = birthdayOfTargetYear.getDay();
            const dayAllottedNumber = this.weekdayNumberMap[dayOfWeek];
            const yearForCalc = targetYear % 100;
            const total = basicNum + (birthMonth + 1) + yearForCalc + dayAllottedNumber;
            const dashaNumber = reduceToSingleDigit(total);
            const startDate = birthdayOfTargetYear;
            const endDate = new Date(targetYear + 1, birthMonth, birthDate - 1);
            timeline.push({ year: targetYear, dashaNumber, startDate, endDate });
        }
        return timeline;
    },
    calculateMonthlyDasha(yearlyDashaTimeline) {
        const timeline = [];
        const pratyantarSequence = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        yearlyDashaTimeline.forEach(yearlyDasha => {
            let currentStartDate = new Date(yearlyDasha.startDate);
            const endOfYearPeriod = new Date(yearlyDasha.endDate);
            const startDasha = yearlyDasha.dashaNumber;
            const dashaIndex = pratyantarSequence.indexOf(startDasha);
            let sequenceCounter = 0;
            while (currentStartDate <= endOfYearPeriod) {
                const currentDashaNum = pratyantarSequence[(dashaIndex + sequenceCounter) % 9];
                const duration = this.pratyantarDurationMap[currentDashaNum];
                let endDate = new Date(currentStartDate);
                endDate.setDate(endDate.getDate() + duration - 1);
                timeline.push({ dashaNumber: currentDashaNum, startDate: new Date(currentStartDate), endDate });
                currentStartDate = new Date(endDate);
                currentStartDate.setDate(currentStartDate.getDate() + 1);
                sequenceCounter++;
            }
        });
        return timeline;
    },
    calculateDailyDasha(monthlyDashaTimeline) {
        const timeline = [];
        monthlyDashaTimeline.forEach(({ dashaNumber: pratyantarNum, startDate, endDate }) => {
            let currentDate = new Date(startDate);
            while(currentDate <= endDate) {
                const dayOfWeek = currentDate.getDay();
                const dayAllottedNumber = this.weekdayNumberMap[dayOfWeek];
                const dashaNumber = reduceToSingleDigit(pratyantarNum + dayAllottedNumber);
                timeline.push({ date: new Date(currentDate), dashaNumber });
                currentDate.setDate(currentDate.getDate() + 1);
            }
        });
        return timeline;
    }
};