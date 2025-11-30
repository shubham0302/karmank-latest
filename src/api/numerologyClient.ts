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
  dob: string;
  relevantData: RelevantData;
}

interface CalculationResponse {
  success: boolean;
  report: NumerologyReport;
  dashaReport: any;
  timestamp: string;
}

/**
 * Calls the backend API to calculate numerology
 * @param userData - User data containing dob, name, gender
 * @returns Promise resolving to calculation response
 */
export async function calculateNumerology(
  userData: CalculationRequest
): Promise<CalculationResponse> {
  try {
    console.log("[CLIENT] ===== NUMEROLOGY CALCULATION START =====");
    console.log("[CLIENT] Timestamp:", new Date().toISOString());
    console.log("[CLIENT] Input data:", userData);

    // Determine API URL based on environment
    const API_URL = import.meta.env.DEV
      ? "http://localhost:3001/api/calculate" // Local dev server
      : "/api/calculate"; // Production Vercel endpoint

    console.log("[CLIENT] API_URL:", API_URL);
    console.log("[CLIENT] Environment:", import.meta.env.DEV ? "development" : "production");

    // In development mode, skip authentication
    const isDevelopment = import.meta.env.DEV;
    let headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    console.log("[CLIENT] isDevelopment:", isDevelopment);

    if (!isDevelopment) {
      console.log("[CLIENT] Getting session for production...");
      // Only get session in production
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.error("[CLIENT] Session error:", sessionError);
        throw new Error("Not authenticated. Please log in.");
      }

      console.log("[CLIENT] Session obtained");

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
      console.log("[CLIENT] Auth headers set");
    }

    // Call the backend API
    console.log("[CLIENT] Calling API...");
    const response = await fetch(API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(userData),
    });

    console.log("[CLIENT] API Response status:", response.status);
    console.log("[CLIENT] API Response headers:", {
      contentType: response.headers.get("content-type"),
      contentLength: response.headers.get("content-length")
    });

    // Handle response
    const data = await response.json();

    console.log("[CLIENT] API Response data keys:", Object.keys(data));
    console.log("[CLIENT] Response success:", data.success);

    if (!response.ok) {
      console.error("[CLIENT] API response not OK:", data.error);
      throw new Error(data.error || "Failed to calculate numerology");
    }

    if (!data.success) {
      console.error("[CLIENT] Calculation unsuccessful:", data.error);
      throw new Error(data.error || "Calculation was unsuccessful");
    }

    console.log("[CLIENT] API response structure:", {
      hasReport: !!data.report,
      hasDashaReport: !!data.dashaReport,
      hasTimestamp: !!data.timestamp,
      reportKeys: data.report ? Object.keys(data.report).slice(0, 5) : 'N/A',
      dashaReportKeys: data.dashaReport ? Object.keys(data.dashaReport) : 'N/A'
    });

    // Parse dates if needed - convert all date strings in dashaReport to Date objects
    const parseDateInObject = (obj: any): any => {
      if (!obj) return obj;
      if (obj instanceof Date) return obj;

      if (Array.isArray(obj)) {
        return obj.map(item => parseDateInObject(item));
      }

      if (typeof obj === 'object') {
        const parsed: any = {};
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            // Convert startDate and endDate strings to Date objects
            if ((key === 'startDate' || key === 'endDate') && typeof value === 'string') {
              parsed[key] = new Date(value);
            } else if (typeof value === 'object') {
              parsed[key] = parseDateInObject(value);
            } else {
              parsed[key] = value;
            }
          }
        }
        return parsed;
      }

      return obj;
    };

    const result: CalculationResponse = {
      success: data.success,
      report: {
        ...data.report,
        dob: new Date(data.report.dob),
      },
      dashaReport: parseDateInObject(data.dashaReport),
      timestamp: data.timestamp,
    };

    console.log("[CLIENT] Date parsing completed");
    console.log("[CLIENT] Final result structure:", {
      success: result.success,
      hasReport: !!result.report,
      hasDashaReport: !!result.dashaReport,
      reportBasicNumber: result.report?.basicNumber,
      reportDestinyNumber: result.report?.destinyNumber,
      dashaReportKeys: result.dashaReport ? Object.keys(result.dashaReport) : 'N/A',
      mahaDashaLength: result.dashaReport?.mahaDashaTimeline?.length || 0,
      yearlyDashaLength: result.dashaReport?.yearlyDashaTimeline?.length || 0
    });

    console.log("[CLIENT] ===== NUMEROLOGY CALCULATION SUCCESS =====");
    return result;
  } catch (error: any) {
    console.error("[CLIENT] ===== NUMEROLOGY CALCULATION FAILED =====");
    console.error("[CLIENT] Error message:", error.message);
    console.error("[CLIENT] Error stack:", error.stack);
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
