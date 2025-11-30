import { VercelRequest, VercelResponse } from "@vercel/node";
import {
  verifyAuth,
  validateDOB,
  validateName,
  validateGender,
} from "./lib/supabaseAuth.js";
import { calculateNumerology, dashaCalculator } from "./lib/calculators.js";
import {
  buildRelevantDataSet,
  validateFilteredData,
} from "./lib/dataFiltering.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("[API] ===== CALCULATION START =====");
    console.log("[API] Timestamp:", new Date().toISOString());
    console.log("[API] Node ENV:", process.env.NODE_ENV);

    // 1. Verify authentication (skip in development mode)
    const isDevelopment =
      process.env.NODE_ENV === "development" || !process.env.VITE_SUPABASE_URL;
    let userId = "dev-user";

    console.log("[API] isDevelopment:", isDevelopment);

    if (!isDevelopment) {
      const authResult = await verifyAuth(req);
      if (authResult.error) {
        console.error("[API] Auth failed:", authResult.error);
        return res.status(authResult.status).json({ error: authResult.error });
      }

      userId = authResult.user?.id || "";
      if (!userId) {
        console.error("[API] No user ID found");
        return res.status(401).json({ error: "User ID not found" });
      }
      console.log("[API] Auth successful for user:", userId);
    }

    // 2. Validate input
    const { dob, name, gender } = req.body;
    console.log("[API] Input received:", { dob, name, gender });

    if (!dob || !validateDOB(dob)) {
      console.error("[API] Invalid DOB:", dob);
      return res
        .status(400)
        .json({ error: "Invalid date of birth format. Use YYYY-MM-DD" });
    }

    if (!name || !validateName(name)) {
      console.error("[API] Invalid name:", name);
      return res.status(400).json({ error: "Invalid name" });
    }

    if (!gender || !validateGender(gender)) {
      console.error("[API] Invalid gender:", gender);
      return res
        .status(400)
        .json({ error: "Invalid gender. Use Male, Female, or Other" });
    }

    console.log("[API] Input validation passed");

    // 3. Calculate numerology
    console.log("[API] Starting numerology calculation...");
    const mainReport = calculateNumerology(dob);

    if (!mainReport) {
      console.error("[API] mainReport is null/undefined");
      return res
        .status(400)
        .json({ error: "Failed to generate numerology report" });
    }

    console.log("[API] MainReport generated:", {
      basicNumber: mainReport.basicNumber,
      destinyNumber: mainReport.destinyNumber,
      yogasCount: mainReport.yogas?.length || 0,
      baseKundliGridLength: mainReport.baseKundliGrid?.length || 0
    });

    // 4. Calculate dasha timelines
    console.log("[API] Starting dasha calculations...");
    const mahaDashaTimeline = dashaCalculator.calculateMahaDasha(
      mainReport.dob,
      mainReport.basicNumber
    );
    const yearlyDashaTimeline = dashaCalculator.calculateYearlyDasha(
      mainReport.dob,
      mainReport.basicNumber
    );
    const monthlyDashaTimeline =
      dashaCalculator.calculateMonthlyDasha(yearlyDashaTimeline);
    const dailyDashaTimeline =
      dashaCalculator.calculateDailyDasha(monthlyDashaTimeline);

    console.log("[API] Dasha timelines calculated:", {
      mahaDashaCount: mahaDashaTimeline?.length || 0,
      yearlyDashaCount: yearlyDashaTimeline?.length || 0,
      monthlyDashaCount: monthlyDashaTimeline?.length || 0,
      dailyDashaCount: dailyDashaTimeline?.length || 0
    });

    // 5. Build dasha report
    const dashaReport = {
      mahaDashaTimeline,
      yearlyDashaTimeline,
      monthlyDashaTimeline,
      dailyDashaTimeline,
    };

    // 6. Filter data to show only user-specific relevant insights
    console.log("[API] Building relevant data set...");
    const relevantData = buildRelevantDataSet(mainReport, dashaReport, gender);

    if (!relevantData) {
      console.error("[API] relevantData is null/undefined");
      return res
        .status(400)
        .json({ error: "Failed to build relevant data set" });
    }

    console.log("[API] Relevant data keys:", Object.keys(relevantData));

    // 7. Validate filtered data contains required fields
    console.log("[API] Validating filtered data...");
    if (!validateFilteredData(relevantData)) {
      console.warn("[API] WARNING: Filtered data missing some required fields");
    } else {
      console.log("[API] Filtered data validation passed");
    }

    // 8. Build report with relevant data only
    console.log("[API] Building final report...");
    const report = {
      ...mainReport,
      name,
      dob: new Date(dob + "T00:00:00"),
      relevantData, // Only user-specific data is included
    };

    console.log("[API] Final report keys:", Object.keys(report));
    console.log("[API] Report structure:", {
      hasBasicNumber: !!report.basicNumber,
      hasDestinyNumber: !!report.destinyNumber,
      hasYogas: !!report.yogas,
      hasBaseKundliGrid: !!report.baseKundliGrid,
      hasRelevantData: !!report.relevantData,
      relevantDataKeys: report.relevantData ? Object.keys(report.relevantData).slice(0, 5) : 'N/A'
    });

    // 9. Return success response with filtered data
    console.log("[API] ===== CALCULATION SUCCESS =====");
    console.log("[API] Returning response with dashaReport:", {
      hasMahaDasha: !!dashaReport.mahaDashaTimeline,
      hasYearlyDasha: !!dashaReport.yearlyDashaTimeline,
      hasMonthlyDasha: !!dashaReport.monthlyDashaTimeline,
      hasDailyDasha: !!dashaReport.dailyDashaTimeline
    });

    return res.status(200).json({
      success: true,
      report,
      dashaReport,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[API] ===== CALCULATION FAILED =====");
    console.error("[API] Error:", error.message);
    console.error("[API] Stack:", error.stack);
    return res.status(500).json({
      error: "Internal server error",
      message:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
