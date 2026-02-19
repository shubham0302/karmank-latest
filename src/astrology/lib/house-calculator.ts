/**
 * House Calculator - Calculate house signs and lords from Ascendant
 */

const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const SIGN_LORDS: Record<string, string> = {
  'Aries': 'Mars',
  'Taurus': 'Venus',
  'Gemini': 'Mercury',
  'Cancer': 'Moon',
  'Leo': 'Sun',
  'Virgo': 'Mercury',
  'Libra': 'Venus',
  'Scorpio': 'Mars',
  'Sagittarius': 'Jupiter',
  'Capricorn': 'Saturn',
  'Aquarius': 'Saturn',
  'Pisces': 'Jupiter'
};

/**
 * Get sign from longitude (0-360 degrees)
 */
export function getSignFromLongitude(longitude: number): string {
  const signIndex = Math.floor(longitude / 30);
  return SIGNS[signIndex % 12];
}

/**
 * Get house sign based on house number and ascendant sign
 * In Vedic astrology, houses follow from the Ascendant sign
 */
export function getHouseSign(houseNumber: number, ascendantSign: string): string {
  const ascIndex = SIGNS.indexOf(ascendantSign);
  if (ascIndex === -1) return 'Unknown';

  // House 1 = Ascendant sign
  // House 2 = Next sign, etc.
  const houseSignIndex = (ascIndex + houseNumber - 1) % 12;
  return SIGNS[houseSignIndex];
}

/**
 * Get sign lord (ruling planet)
 */
export function getSignLord(sign: string): string {
  return SIGN_LORDS[sign] || 'Unknown';
}

/**
 * Calculate which house a planet is in based on its longitude and house cusps
 */
export function calculatePlanetHouse(
  planetLongitude: number,
  houseCusps: number[]
): number {
  // Normalize planet longitude to 0-360
  const normalizedLong = ((planetLongitude % 360) + 360) % 360;

  // Find which house the planet falls into
  for (let i = 0; i < 12; i++) {
    const currentCusp = houseCusps[i];
    const nextCusp = houseCusps[(i + 1) % 12];

    // Handle wrap-around at 360/0 degrees
    if (nextCusp > currentCusp) {
      // Normal case: cusp doesn't cross 0
      if (normalizedLong >= currentCusp && normalizedLong < nextCusp) {
        return i + 1; // House numbers are 1-indexed
      }
    } else {
      // Wrap-around case: cusp crosses 0 degrees
      if (normalizedLong >= currentCusp || normalizedLong < nextCusp) {
        return i + 1;
      }
    }
  }

  // Fallback: return house 1
  return 1;
}

/**
 * Calculate all house data from cusps and ascendant
 */
export function calculateHousesData(
  houseCusps: number[],
  ascendantSign: string
): Array<{ sign: string; longitude: number; sign_lord: string }> {
  return houseCusps.map((cusp, index) => {
    const houseNumber = index + 1;
    const sign = getHouseSign(houseNumber, ascendantSign);
    const lord = getSignLord(sign);

    return {
      sign,
      longitude: cusp,
      sign_lord: lord
    };
  });
}
