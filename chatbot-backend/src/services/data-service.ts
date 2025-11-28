// Data Service - Manages secure access to proprietary numerology data
// This service controls what data is exposed to the frontend

import { DATA, combinationInsights } from '../data/proprietary-data.js';

/**
 * Data Service class - handles all protected data access
 */
export class DataService {
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
      const dashaGuide = DATA.dashaGuide || {};
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
   * Get complete enrichment data for a numerology calculation
   * This is the main method used by the frontend
   */
  getEnrichmentData(params: {
    basicNumber: number;
    destinyNumber: number;
    yogaIds: string[];
    kundliGrid: number[];
    recurringNumbers?: number[];
  }) {
    const {
      basicNumber,
      destinyNumber,
      yogaIds,
      kundliGrid,
      recurringNumbers = []
    } = params;

    // Get combination insight
    const combinationInsight = this.getCombinationInsight(basicNumber, destinyNumber);

    // Get yoga details
    const yogas = this.getMultipleYogaDetails(yogaIds);

    // Get recurring number influences
    const recurringInfluences: Record<number, any> = {};
    recurringNumbers.forEach(num => {
      const influence = this.getRecurringNumberInfluence(num);
      if (influence) {
        recurringInfluences[num] = influence;
      }
    });

    // Get remedies
    const remedies = this.getRemedies(basicNumber);

    // Get dasha interpretations
    const dashaInterpretations = {
      basic: this.getDashaInterpretation(basicNumber),
      destiny: this.getDashaInterpretation(destinyNumber)
    };

    // Get number details
    const numberDetails = {
      basic: this.getNumberDetails(basicNumber),
      destiny: this.getDestinyNumberDetails(destinyNumber),
      traits: this.getDestinyTraits(destinyNumber)
    };

    return {
      combinationInsight,
      yogas,
      recurringInfluences,
      remedies,
      dashaInterpretations,
      numberDetails
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
