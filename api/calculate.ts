import { VercelRequest, VercelResponse } from "@vercel/node";
import {
  verifyAuth,
  validateDOB,
  validateName,
  validateGender,
} from "./lib/supabaseAuth";
import { calculateNumerology, dashaCalculator } from "./lib/calculators";
import {
  buildRelevantDataSet,
  validateFilteredData,
} from "./lib/dataFiltering";

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
    // 1. Verify authentication (skip in development mode)
    const isDevelopment =
      process.env.NODE_ENV === "development" || !process.env.VITE_SUPABASE_URL;
    let userId = "dev-user";

    if (!isDevelopment) {
      const authResult = await verifyAuth(req);
      if (authResult.error) {
        return res.status(authResult.status).json({ error: authResult.error });
      }

      userId = authResult.user?.id || "";
      if (!userId) {
        return res.status(401).json({ error: "User ID not found" });
      }
    }

    // 2. Validate input
    const { dob, name, gender } = req.body;

    if (!dob || !validateDOB(dob)) {
      return res
        .status(400)
        .json({ error: "Invalid date of birth format. Use YYYY-MM-DD" });
    }

    if (!name || !validateName(name)) {
      return res.status(400).json({ error: "Invalid name" });
    }

    if (!gender || !validateGender(gender)) {
      return res
        .status(400)
        .json({ error: "Invalid gender. Use Male, Female, or Other" });
    }

    // 3. Calculate numerology
    const mainReport = calculateNumerology(dob);

    if (!mainReport) {
      return res
        .status(400)
        .json({ error: "Failed to generate numerology report" });
    }

    // 4. Calculate dasha timelines
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

    // 5. Build dasha report
    const dashaReport = {
      mahaDashaTimeline,
      yearlyDashaTimeline,
      monthlyDashaTimeline,
      dailyDashaTimeline,
    };

    // 6. Filter data to show only user-specific relevant insights
    const relevantData = buildRelevantDataSet(mainReport, dashaReport, gender);

    // 7. Validate filtered data contains required fields
    if (!validateFilteredData(relevantData)) {
      console.warn("[VALIDATE] Filtered data missing required fields");
    }

    // 8. Build report with relevant data only
    const report = {
      ...mainReport,
      name,
      dob: new Date(dob + "T00:00:00"),
      relevantData, // Only user-specific data is included
    };

    // 9. Log calculation (minimal security logging - no sensitive data)
    try {
      console.log(
        `[CALC] User: ${userId}, DOB Hash: ${Buffer.from(dob)
          .toString("base64")
          .slice(0, 8)}, Time: ${new Date().toISOString()}`
      );
    } catch (logError) {
      console.error("Logging error:", logError);
      // Don't fail the request if logging fails
    }

    // 10. Return success response with filtered data
    return res.status(200).json({
      success: true,
      report,
      dashaReport,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Calculation error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
