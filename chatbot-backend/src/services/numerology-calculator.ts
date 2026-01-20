// Backend Numerology Calculator Service
// This file contains all proprietary numerology calculation logic
// Kept secure on backend to protect intellectual property

/**
 * Reduces a number to a single digit by repeatedly summing its digits.
 * @param num - The number or string to reduce
 * @returns A single-digit result (1-9)
 */
export function reduceToSingleDigit(num: number | string): number {
  let currentNumStr = String(num);
  while (currentNumStr.length > 1) {
    currentNumStr = String(
      currentNumStr.split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0)
    );
  }
  return parseInt(currentNumStr, 10);
}

/**
 * Calculates the basic number from day of birth
 */
export function calculateBasicNumber(day: number): number {
  return reduceToSingleDigit(day);
}

/**
 * Calculates the destiny number from full date of birth
 */
export function calculateDestinyNumber(day: number, month: number, year: number): number {
  const dobString = `${day}${month}${year}`;
  const sum = dobString.split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
  return reduceToSingleDigit(sum);
}

/**
 * Builds the Kundli grid from date of birth
 */
export function buildKundliGrid(
  day: number,
  month: number,
  year: number,
  destinyNumber: number,
  basicNumber: number
): number[] {
  const kundliDigitsStr = (
    String(day).padStart(2, '0') +
    String(month).padStart(2, '0') +
    String(year).substring(2)
  ).replace(/0/g, '');

  const digitCounts = Array(10).fill(0);
  for (const char of kundliDigitsStr) {
    digitCounts[parseInt(char)]++;
  }

  // Add destiny number to kundli grid
  digitCounts[destinyNumber]++;

  // Add basic number for two-digit days
  if (day > 9 && day % 10 !== 0) {
    digitCounts[basicNumber]++;
  }

  return digitCounts;
}

/**
 * Dasha Calculator - All timeline calculations
 */
export class DashaCalculator {
  private static weekdayNumberMap = [1, 2, 9, 5, 3, 6, 8]; // Sun=1, Mon=2, Tue=9, ... Sat=8
  private static pratyantarDurationMap: Record<number, number> = {
    1: 8, 2: 16, 3: 24, 4: 32,
    5: 41, 6: 49, 7: 57, 8: 64, 9: 74
  };

  /**
   * Calculate Maha Dasha timeline
   */
  static calculateMahaDasha(dob: Date, basicNum: number) {
    const timeline: Array<{
      dashaNumber: number;
      startDate: Date;
      endDate: Date;
    }> = [];

    let startDate = new Date(dob);
    let dashaNumber = basicNum;

    for (let i = 0; i < 3; i++) { // Calculate for a few cycles
      for (let j = 0; j < 9; j++) {
        const spanYears = dashaNumber;
        let endDate = new Date(startDate);
        endDate.setFullYear(endDate.getFullYear() + spanYears);
        endDate.setDate(endDate.getDate() - 1);

        timeline.push({
          dashaNumber,
          startDate: new Date(startDate),
          endDate: new Date(endDate)
        });

        startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() + 1);
        dashaNumber = dashaNumber % 9 + 1;
      }
    }
    return timeline;
  }

  /**
   * Calculate Yearly Dasha timeline
   */
  static calculateYearlyDasha(dob: Date, basicNum: number) {
    const timeline: Array<{
      year: number;
      dashaNumber: number;
      startDate: Date;
      endDate: Date;
    }> = [];

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
  }

  /**
   * Calculate Monthly Dasha timeline
   */
  static calculateMonthlyDasha(yearlyDashaTimeline: Array<{
    year: number;
    dashaNumber: number;
    startDate: Date;
    endDate: Date;
  }>) {
    const timeline: Array<{
      dashaNumber: number;
      startDate: Date;
      endDate: Date;
    }> = [];

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

        timeline.push({
          dashaNumber: currentDashaNum,
          startDate: new Date(currentStartDate),
          endDate: new Date(endDate)
        });

        currentStartDate = new Date(endDate);
        currentStartDate.setDate(currentStartDate.getDate() + 1);
        sequenceCounter++;
      }
    });
    return timeline;
  }

  /**
   * Calculate Daily Dasha timeline
   */
  static calculateDailyDasha(monthlyDashaTimeline: Array<{
    dashaNumber: number;
    startDate: Date;
    endDate: Date;
  }>) {
    const timeline: Array<{
      date: Date;
      dashaNumber: number;
    }> = [];

    monthlyDashaTimeline.forEach(({ dashaNumber: pratyantarNum, startDate, endDate }) => {
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        const dayAllottedNumber = this.weekdayNumberMap[dayOfWeek];
        const dashaNumber = reduceToSingleDigit(pratyantarNum + dayAllottedNumber);

        timeline.push({
          date: new Date(currentDate),
          dashaNumber
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
    return timeline;
  }
}

/**
 * Check for special remedies based on chart conditions
 */
export function checkForSpecialRemedies(
  digitCounts: number[],
  destinyNumber: number,
  mahaDasha: number | null = null,
  annualDasha: number | null = null,
  DATA: any
): any[] {
  const remedies: any[] = [];
  const uniqueRemedies = new Set<string>();

  const addRemedy = (remedy: any) => {
    if (!remedy || !remedy.title) return;
    const key = remedy.title.en || JSON.stringify(remedy.title);

    if (!uniqueRemedies.has(key)) {
      remedies.push(remedy);
      uniqueRemedies.add(key);
    }
  };

  // Rule: Presence of 4 in chart OR dasha of 4
  if (digitCounts[4] > 0 || mahaDasha === 4 || annualDasha === 4) {
    addRemedy(DATA.specialRudrakshaRemedies[4]);
  }

  // Rule: Presence of 8 in chart OR dasha of 8
  if (digitCounts[8] > 0 || mahaDasha === 8 || annualDasha === 8) {
    addRemedy(DATA.specialRudrakshaRemedies[8]);
  }

  // Rule: Destiny 4
  if (destinyNumber === 4 && DATA.destinyBasedRemedies[4]) {
    addRemedy(DATA.destinyBasedRemedies[4]);
  }

  // Rule: Combination of 9 and 4 Without 5
  // Triggers if:
  // - (9 in chart OR dasha 9) AND (4 in chart OR dasha 4) AND (no 5 in chart)
  const has9 = digitCounts[9] > 0 || mahaDasha === 9 || annualDasha === 9;
  const has4 = digitCounts[4] > 0 || mahaDasha === 4 || annualDasha === 4;
  const has5 = digitCounts[5] > 0;

  if (has9 && has4 && !has5) {
    addRemedy({
      type: 'simple',
      title: { en: "Protection Remedy for 9-4 Combination" },
      text: { en: "Your chart contains the numbers 9 and 4 (or you are in their dasha periods) without the balancing energy of 5. It is mandatory to wear a 3 Mukhi Rudraksha for protection." }
    });
  }

  // Rule: Odd Number 4
  if (digitCounts[4] > 0 && digitCounts[4] % 2 !== 0) {
    addRemedy({
      type: 'simple',
      title: { en: "Balancing Remedy for Number 4" },
      text: { en: "You have an odd number of 4s in your chart. It is advised to wear a Ganesh Rudraksha to harmonize its energy." }
    });
  }

  // Rule: Multiple 1s without Destiny 1
  const isPositive1 = digitCounts[1] <= 1 || destinyNumber === 1;
  if (!isPositive1) {
    addRemedy({
      type: 'simple',
      title: { en: "Remedy for Amplified Number 1" },
      text: { en: "Your chart has multiple 1s, but your Destiny Number is not 1. To balance this, you must wear a 1 Mukhi Rudraksha and offer Surya Arghya (water to the Sun) early in the morning while chanting the mantra: ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः (at least 11 times)." }
    });
  }

  return remedies;
}

/**
 * Complete numerology calculation from DOB
 */
export function calculateCompleteNumerology(dob: string, DATA: any) {
  const date = new Date(dob + 'T00:00:00');
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  // Basic calculations
  const basicNumber = calculateBasicNumber(day);
  const destinyNumber = calculateDestinyNumber(day, month, year);
  const kundliGrid = buildKundliGrid(day, month, year, destinyNumber, basicNumber);

  // Dasha calculations
  const mahaDashaTimeline = DashaCalculator.calculateMahaDasha(date, basicNumber);
  const yearlyDashaTimeline = DashaCalculator.calculateYearlyDasha(date, basicNumber);
  const monthlyDashaTimeline = DashaCalculator.calculateMonthlyDasha(yearlyDashaTimeline);
  const dailyDashaTimeline = DashaCalculator.calculateDailyDasha(monthlyDashaTimeline);

  // Find current dasha periods for special remedies
  const now = new Date();
  const currentMahaDasha = mahaDashaTimeline.find(d =>
    now >= d.startDate && now <= d.endDate
  )?.dashaNumber || null;

  const currentYearlyDasha = yearlyDashaTimeline.find(d =>
    now >= d.startDate && now <= d.endDate
  )?.dashaNumber || null;

  // Calculate special remedies with current dasha context
  const specialRemedies = checkForSpecialRemedies(
    kundliGrid,
    destinyNumber,
    currentMahaDasha,
    currentYearlyDasha,
    DATA
  );

  return {
    dob: date.toISOString(),
    basicNumber,
    destinyNumber,
    kundliGrid,
    specialRemedies,  // ✅ Added special remedies
    dashaTimelines: {
      maha: mahaDashaTimeline,
      yearly: yearlyDashaTimeline,
      monthly: monthlyDashaTimeline,
      daily: dailyDashaTimeline
    }
  };
}
