// Data Service - Manages secure access to proprietary numerology data
// This service controls what data is exposed to the frontend

import { DATA, combinationInsights } from '../data/proprietary-data.js';
import { checkForSpecialRemedies } from './numerology-calculator.js';

/**
 * Data Service class - handles all protected data access
 */
export class DataService {
  private checkAdvancedYoga(rules: any, kundliGrid: number[]): boolean {
    if (!rules || !kundliGrid || kundliGrid.length === 0) return false;

    if (rules.requires_counts) {
      for (const [numStr, requiredCount] of Object.entries(rules.requires_counts)) {
        const number = parseInt(numStr, 10);
        if ((kundliGrid[number] || 0) < Number(requiredCount)) {
          return false;
        }
      }
    }

    if (rules.requires_presence) {
      if (!rules.requires_presence.every((num: number) => (kundliGrid[num] || 0) > 0)) {
        return false;
      }
    }

    if (rules.requires_absence) {
      if (rules.requires_absence.some((num: number) => (kundliGrid[num] || 0) > 0)) {
        return false;
      }
    }

    return true;
  }

  private identifyYogaIds(kundliGrid: number[], basicNumber: number, destinyNumber: number): string[] {
    if (!kundliGrid || kundliGrid.length === 0) return [];

    const yogaIds: string[] = [];
    const yogaDetails = DATA.yogaDetails || {};

    Object.entries(yogaDetails).forEach(([yogaId, yoga]: [string, any]) => {
      let isPresent = false;
      if (yoga.activation_rules) {
        isPresent = this.checkAdvancedYoga(yoga.activation_rules, kundliGrid);
      } else if (Array.isArray(yoga.numbers)) {
        isPresent = yoga.numbers.every((num: number) => (kundliGrid[num] || 0) > 0);
        if (isPresent && Array.isArray(yoga.empty) && yoga.empty.length > 0) {
          if (yoga.empty.some((num: number) => (kundliGrid[num] || 0) > 0)) {
            isPresent = false;
          }
        }
      }

      if (isPresent) {
        yogaIds.push(yogaId);
      }
    });

    // Preserve special handling used in the web app.
    if (basicNumber === 2 && destinyNumber === 1 && !yogaIds.includes('rajYoga')) {
      yogaIds.push('rajYoga');
    }

    return yogaIds;
  }

  private identifyRecurringNumbers(kundliGrid: number[]): number[] {
    if (!kundliGrid || kundliGrid.length === 0) return [];

    const recurringNumbers: number[] = [];
    kundliGrid.forEach((count, number) => {
      if (number > 0 && count >= 2) {
        recurringNumbers.push(number);
      }
    });
    return recurringNumbers;
  }

  /**
   * Get combination insight for a basic/destiny number pair
   */
  getCombinationInsight(basic: number, destiny: number) {
    const key = `${basic}-${destiny}`;
    return combinationInsights[key] || null;
  }

  /**
   * Get yoga details by yoga ID
   */
  getYogaDetails(yogaId: string) {
    return DATA.yogaDetails[yogaId] || null;
  }

  /**
   * Get multiple yoga details at once
   */
  getMultipleYogaDetails(yogaIds: string[]) {
    const yogas: Record<string, any> = {};
    yogaIds.forEach(id => {
      const yoga = this.getYogaDetails(id);
      if (yoga) {
        yogas[id] = yoga;
      }
    });
    return yogas;
  }

  /**
   * Get recurring number influence
   */
  getRecurringNumberInfluence(number: number) {
    try {
      const recurringNumberInfluence = DATA.recurringNumberInfluence || {};
      return recurringNumberInfluence[number] || null;
    } catch (error) {
      console.error(`Error getting recurring number influence for ${number}:`, error);
      return null;
    }
  }

  /**
   * Get remedies for a specific number
   */
  getRemedies(number: number) {
    try {
      const remedies = DATA.remedies || {};
      return remedies[number] || null;
    } catch (error) {
      console.error(`Error getting remedies for ${number}:`, error);
      return null;
    }
  }

  /**
   * Get dasha interpretation
   */
  getDashaInterpretation(number: number) {
    try {
      const dashaGuide = (DATA as any).dashaGuide || {};
      return dashaGuide[number] || null;
    } catch (error) {
      console.error(`Error getting dasha interpretation for ${number}:`, error);
      return null;
    }
  }

  /**
   * Get number details (planet, description, etc.)
   */
  getNumberDetails(number: number) {
    try {
      const numberDetails = DATA.numberDetails || {};
      return numberDetails[number] || null;
    } catch (error) {
      console.error(`Error getting number details for ${number}:`, error);
      return null;
    }
  }

  /**
   * Get destiny number details
   */
  getDestinyNumberDetails(number: number) {
    return DATA.destinyNumberDetails[number] || null;
  }

  /**
   * Get destiny traits
   */
  getDestinyTraits(number: number) {
    return DATA.destinyTraits[String(number)] || null;
  }

  /**
   * Get destiny professions
   */
  getDestinyProfessions(number: number) {
    return DATA.destinyProfessions[number] || null;
  }

  /**
   * Get complete enrichment data for a numerology calculation
   * This is the main method used by the frontend
   */
  getEnrichmentData(params: {
    basicNumber: number;
    destinyNumber: number;
    yogaIds: string[];
    kundliGrid: number[];
    recurringNumbers?: number[];
    currentMahaDasha?: number | null;
    currentYearlyDasha?: number | null;
  }) {
    const {
      basicNumber,
      destinyNumber,
      yogaIds,
      kundliGrid,
      recurringNumbers = [],
      currentMahaDasha = null,
      currentYearlyDasha = null
    } = params;

    const resolvedYogaIds = yogaIds.length > 0
      ? yogaIds
      : this.identifyYogaIds(kundliGrid, basicNumber, destinyNumber);

    const resolvedRecurringNumbers = recurringNumbers.length > 0
      ? recurringNumbers
      : this.identifyRecurringNumbers(kundliGrid);

    // Get combination insight
    const combinationInsight = this.getCombinationInsight(basicNumber, destinyNumber);

    // Get yoga details
    const yogas = this.getMultipleYogaDetails(resolvedYogaIds);

    // Get recurring number influences
    const recurringInfluences: Record<number, any> = {};
    resolvedRecurringNumbers.forEach(num => {
      const influence = this.getRecurringNumberInfluence(num);
      if (influence) {
        recurringInfluences[num] = influence;
      }
    });

    // Get remedies
    const remedies = this.getRemedies(basicNumber);

    // Get special remedies based on chart conditions and current dasha
    const specialRemedies = checkForSpecialRemedies(kundliGrid, destinyNumber, currentMahaDasha, currentYearlyDasha, DATA);

    // Get dasha interpretations
    const dashaInterpretations = {
      basic: this.getDashaInterpretation(basicNumber),
      destiny: this.getDashaInterpretation(destinyNumber)
    };

    // Get number details
    const numberDetails = {
      basic: this.getNumberDetails(basicNumber),
      destiny: this.getDestinyNumberDetails(destinyNumber),
      traits: this.getDestinyTraits(destinyNumber),
      professions: this.getDestinyProfessions(destinyNumber) // NEW: Add professions data
    };

    const uiData = {
      numberDetails: DATA.numberDetails || {},
      destinyNumberDetails: DATA.destinyNumberDetails || {},
      destinyTraits: DATA.destinyTraits || {},
      destinyProfessions: DATA.destinyProfessions || {},
      destinyCompatibility: DATA.destinyCompatibility || {},
      recurringNumberInfluence: DATA.recurringNumberInfluence || {},
      combinedDashaInsights: DATA.combinedDashaInsights || {},
      remedies: DATA.remedies || {},
      multipleNumberRemedies: DATA.multipleNumberRemedies || {},
      mantraRemedies: (DATA as any).mantraRemedies || {},
      specialRudrakshaRemedies: (DATA as any).specialRudrakshaRemedies || {},
      destinyBasedRemedies: DATA.destinyBasedRemedies || {},
      rudrakshaRemedies: DATA.rudrakshaRemedies || {},
      advancedRudrakshaRemedies: DATA.advancedRudrakshaRemedies || {},
      chakraData: DATA.chakraData || {},
      shaktiBeejMantras: (DATA as any).shaktiBeejMantras || {},
    };

    return {
      combinationInsight,
      yogaIds: resolvedYogaIds,
      yogas,
      recurringNumbers: resolvedRecurringNumbers,
      recurringInfluences,
      remedies,
      specialRemedies,  // ✅ Added special remedies
      dashaInterpretations,
      numberDetails,
      uiData
    };
  }

  /**
   * Get all yoga details (for initialization or caching)
   * Use sparingly - returns a lot of data
   */
  getAllYogaDetails() {
    return DATA.yogaDetails;
  }

  /**
   * Get educational guidance for a number
   */
  getEducationalGuidance(number: number) {
    return DATA.educationalGuidance[number] || null;
  }

  /**
   * Get asset compatibility data
   */
  getAssetCompatibility(number: number, assetType: 'vehicle' | 'house' | 'account') {
    switch (assetType) {
      case 'vehicle':
        return DATA.vehicleNumberDetails[number] || null;
      case 'house':
        return DATA.houseNumberDetails[number] || null;
      case 'account':
        return DATA.accountNumberDetails[number] || null;
      default:
        return null;
    }
  }

  /**
   * Get compatibility insights
   */
  getCompatibilityInsights(number1: number, number2: number) {
    const key = `${number1}-${number2}`;
    return DATA.destinyCompatibility[key] || null;
  }
}

// Export a singleton instance
export const dataService = new DataService();
