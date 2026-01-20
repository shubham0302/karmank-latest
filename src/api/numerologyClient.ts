import { supabase } from "@/lib/supabase";

/**
 * Frontend API client for calling the numerology calculation backend
 */

interface CalculationRequest {
  dob: string;
  name: string;
  gender: string;
}

interface RelevantData {
  numberDetails: { [key: number]: any };
  yogas: any[];
  combinationInsights: any;
  remedies: { [key: number]: any };
  rudrakshaRemedies: { [key: number]: any };
  advancedRudrakshaRemedies: { [key: number]: any };
  mantras: { [key: number]: any };
  dashaTraits: { [key: number]: any };
  recurringNumberInfluences: any[];
  specialInsights: any[];
  specialRemedies: any[];
  genderTraits: any;
  assetCompatibility: any;
  colors: { [key: number]: string };
}

interface NumerologyReport {
  basicNumber: number;
  destinyNumber: number;
  baseKundliGrid: number[];
  yogas: any[];
  recurringNumbersAnalysis: any[];
  specialInsights: any[];
  specialRemedies: any[];
  name: string;
  dob: Date;
  relevantData: RelevantData;
}

interface CalculationResponse {
  success: boolean;
  report: NumerologyReport;
  dashaReport: any;
  timestamp: string;
}

/**
 * Helper to get auth headers
 */
async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    console.error("[CLIENT] Session error:", sessionError);
    throw new Error("Not authenticated. Please log in.");
  }

  // Get fresh access token
  const {
    data: { session: freshSession },
    error: refreshError,
  } = await supabase.auth.refreshSession();

  if (refreshError || !freshSession) {
    console.error("[CLIENT] Refresh error:", refreshError);
    throw new Error("Failed to refresh authentication session");
  }

  headers.Authorization = `Bearer ${freshSession.access_token}`;
  return headers;
}

/**
 * Parse dates in objects recursively
 */
function parseDateInObject(obj: any): any {
  if (!obj) return obj;
  if (obj instanceof Date) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => parseDateInObject(item));
  }

  if (typeof obj === "object") {
    const parsed: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (
          (key === "startDate" || key === "endDate") &&
          typeof value === "string"
        ) {
          parsed[key] = new Date(value);
        } else if (typeof value === "object") {
          parsed[key] = parseDateInObject(value);
        } else {
          parsed[key] = value;
        }
      }
    }
    return parsed;
  }

  return obj;
}

/**
 * Identify recurring numbers in kundli grid
 */
function identifyRecurringNumbers(kundliGrid: number[]): number[] {
  const recurring: number[] = [];
  kundliGrid.forEach((count, number) => {
    if (number > 0 && count >= 2) {
      recurring.push(number);
    }
  });
  return recurring;
}

/**
 * Calls the backend API to calculate numerology
 * This calls two endpoints:
 * 1. /calculate/numerology - Gets basic calculations and dasha timelines
 * 2. /api/data/enrichment - Gets relevantData (remedies, mantras, yogas, etc.)
 *
 * @param userData - User data containing dob, name, gender
 * @returns Promise resolving to calculation response
 */
export async function calculateNumerology(
  userData: CalculationRequest,
): Promise<CalculationResponse> {
  try {
    console.log("[CLIENT] ===== NUMEROLOGY CALCULATION START =====");
    console.log("[CLIENT] Input data:", userData);

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";
    const headers = await getAuthHeaders();

    // Step 1: Call /calculate/numerology to get basic calculations
    console.log("[CLIENT] Step 1: Calling /calculate/numerology...");
    const calcResponse = await fetch(`${BACKEND_URL}/calculate/numerology`, {
      method: "POST",
      headers,
      body: JSON.stringify({ dob: userData.dob }),
    });

    if (!calcResponse.ok) {
      const error = await calcResponse.json().catch(() => ({}));
      throw new Error(error.message || "Failed to calculate numerology");
    }

    const calcData = await calcResponse.json();
    console.log("[CLIENT] Calculation response:", Object.keys(calcData));

    if (!calcData.success || !calcData.data) {
      throw new Error("Calculation failed");
    }

    const { basicNumber, destinyNumber, kundliGrid, dashaTimelines, specialRemedies } = calcData.data;
    console.log("[CLIENT] Basic:", basicNumber, "Destiny:", destinyNumber);

    // Identify recurring numbers for enrichment request
    const recurringNumbers = identifyRecurringNumbers(kundliGrid);

    // Find current dasha periods
    const now = new Date();
    const currentMahaDasha = dashaTimelines.maha.find((d: any) => {
      const start = new Date(d.startDate);
      const end = new Date(d.endDate);
      return now >= start && now <= end;
    })?.dashaNumber || null;

    const currentYearlyDasha = dashaTimelines.yearly.find((d: any) => {
      const start = new Date(d.startDate);
      const end = new Date(d.endDate);
      return now >= start && now <= end;
    })?.dashaNumber || null;

    // Step 2: Call /api/data/enrichment to get relevantData
    console.log("[CLIENT] Step 2: Calling /api/data/enrichment...");
    const enrichResponse = await fetch(`${BACKEND_URL}/api/data/enrichment`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        basicNumber,
        destinyNumber,
        yogaIds: [], // Backend will detect yogas
        kundliGrid,
        recurringNumbers,
        currentMahaDasha,
        currentYearlyDasha,
      }),
    });

    if (!enrichResponse.ok) {
      const error = await enrichResponse.json().catch(() => ({}));
      throw new Error(error.message || "Failed to fetch enrichment data");
    }

    const enrichData = await enrichResponse.json();
    console.log("[CLIENT] Enrichment response:", Object.keys(enrichData));

    if (!enrichData.success || !enrichData.data) {
      throw new Error("Enrichment data fetch failed");
    }

    const relevantData = enrichData.data;
    console.log("[CLIENT] RelevantData keys:", Object.keys(relevantData));

    // Build dasha report
    const dashaReport = {
      mahaDashaTimeline: parseDateInObject(dashaTimelines.maha),
      yearlyDashaTimeline: parseDateInObject(dashaTimelines.yearly),
      monthlyDashaTimeline: parseDateInObject(dashaTimelines.monthly),
      dailyDashaTimeline: parseDateInObject(dashaTimelines.daily),
    };

    // Build complete report
    const report = {
      basicNumber,
      destinyNumber,
      baseKundliGrid: kundliGrid,
      yogas: relevantData.yogas || [],
      recurringAnalysis: recurringNumbers.map((num: number) => ({
        number: num,
        occurrences: kundliGrid[num],
        isDestinyMatch: num === destinyNumber,
      })),
      recurringNumbersAnalysis: recurringNumbers.map((num: number) => ({
        number: num,
        occurrences: kundliGrid[num],
        isDestinyMatch: num === destinyNumber,
      })),
      specialInsights: relevantData.specialInsights || [],
      specialRemedies: specialRemedies || relevantData.specialRemedies || [],
      // Extract destinyTraits and destinyProfessions from numberDetails
      destinyTraits: relevantData.numberDetails?.traits || null,
      destinyProfessions: relevantData.numberDetails?.professions || null,
      combinationInsight: relevantData.combinationInsight || null,
      name: userData.name,
      dob: new Date(calcData.data.dob),
      relevantData, // This is what components need!
    };

    console.log("[CLIENT] ===== NUMEROLOGY CALCULATION SUCCESS =====");
    console.log("[CLIENT] Report has relevantData:", !!report.relevantData);

    return {
      success: true,
      report,
      dashaReport,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error("[CLIENT] ===== NUMEROLOGY CALCULATION FAILED =====");
    console.error("[CLIENT] Error:", error.message);
    throw error;
  }
}

/**
 * Validates input before making API call
 * @param userData - User data to validate
 * @returns null if valid, error message if invalid
 */
export function validateInput(userData: CalculationRequest): string | null {
  if (!userData.dob) {
    return "Date of birth is required";
  }

  const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dobRegex.test(userData.dob)) {
    return "Date of birth must be in YYYY-MM-DD format";
  }

  if (!userData.name || userData.name.trim().length === 0) {
    return "Name is required";
  }

  if (userData.name.length > 100) {
    return "Name must be less than 100 characters";
  }

  if (
    !userData.gender ||
    !["male", "female", "other"].includes(userData.gender)
  ) {
    return "Please select a valid gender";
  }

  return null;
}

/**
 * Format error message for user display
 * @param error - The error object
 * @returns Formatted error message
 */
export function formatErrorMessage(error: any): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unexpected error occurred. Please try again.";
}
