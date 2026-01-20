import React, { useMemo } from "react";
import Card from "../Card";
import SectionTitle from "../SectionTitle";
import { getDashaNumborsForDate } from "./dashaUtils";

const MarriageForecastTab = ({ report, dashaReport, targetDate }) => {
  if (!report || !dashaReport) {
    console.error("[MarriageForecast] Missing required data:", {
      report: !!report,
      dashaReport: !!dashaReport,
    });
    return null;
  }

  // Helper to ensure dates are Date objects
  const toDate = (date) => (date instanceof Date ? date : new Date(date));

  const marriageAnalysis = useMemo(() => {
    console.log(
      "[MarriageForecast] Calculating analysis for targetDate:",
      targetDate,
    );

    const yearlyDasha = dashaReport.yearlyDashaTimeline.find(
      (d) => targetDate >= d.startDate && targetDate <= d.endDate,
    );
    const mahaDasha = dashaReport.mahaDashaTimeline.find(
      (d) => targetDate >= d.startDate && targetDate <= d.endDate,
    );

    if (!yearlyDasha || !mahaDasha) {
      console.warn(
        "[MarriageForecast] Dasha not found for targetDate:",
        targetDate,
      );
      return { mahaDashaInsights: [], annualDashaInsights: [] };
    }

    console.log("[MarriageForecast] Found dashas:", {
      annualDasha: yearlyDasha.dashaNumber,
      mahaDasha: mahaDasha.dashaNumber,
    });

    const { destinyNumber, baseKundliGrid } = report;
    const annualDashaNumber = yearlyDasha.dashaNumber;
    const mahaDashaNumber = mahaDasha.dashaNumber;

    const count = (num) => baseKundliGrid[num] || 0;

    let mahaDashaInsights = [];
    let annualDashaInsights = [];

    switch (mahaDashaNumber) {
      case 3:
        mahaDashaInsights.push({
          text: "This is a very positive and expansive period for relationships. It fosters strong, positive bonding and is considered highly conducive to marriage and the growth of a family.",
          status: "Green",
        });
        break;
      case 6:
        if (destinyNumber === 6 || count(6) === 0) {
          mahaDashaInsights.push({
            text: "A very positive period. It is a favorable time that brings love, harmony, and luxury into your life.",
            status: "Green",
          });
        }
        break;
      case 7:
        if (destinyNumber === 7 || count(7) === 0) {
          mahaDashaInsights.push({
            text: "A very positive period. This fosters spiritual connection and deep understanding within relationships.",
            status: "Green",
          });
        }
        break;
      case 8:
        if ((count(8) + 1) % 2 === 0) {
          // Even count after adding dasha
          mahaDashaInsights.push({
            text: "A positive period. This time can bring reconciliation in past relationships or create opportunities for new, stable connections to form.",
            status: "Green",
          });
        }
        break;
      default:
        break;
    }

    switch (annualDashaNumber) {
      case 2:
        annualDashaInsights.push({
          text: "While this year is marked by emotional sensitivity, it can also signify the entry of a new person into one's life.",
          status: "Yellow",
        });
        break;
      case 3:
        annualDashaInsights.push({
          text: "A precious and highly favorable time for marriage. It is a year of expansion and growth, making it an excellent time for marriage or childbirth.",
          status: "Green",
        });
        break;
      case 6:
        if (destinyNumber === 6 || count(6) === 0) {
          annualDashaInsights.push({
            text: "An excellent and perfect year for relationships. It brings harmony, love, luxury, and enjoyment.",
            status: "Green",
          });
        }
        break;
      case 7:
        if (count(7) <= 1 || destinyNumber === 7) {
          annualDashaInsights.push({
            text: "A positive year. This period brings harmony, deeper understanding, and a peaceful, spiritual time in romance.",
            status: "Green",
          });
        }
        break;
      case 8:
        if ((count(8) + 1) % 2 === 0) {
          // Even count after adding dasha
          annualDashaInsights.push({
            text: "A good year for relationships. This period is favorable for reconciliation and healing existing relationships, and new romantic opportunities may also arise.",
            status: "Green",
          });
        }
        break;
      default:
        break;
    }

    const result = { mahaDashaInsights, annualDashaInsights };
    console.log("[MarriageForecast] Calculated insights:", {
      mahaDashaInsightsCount: result.mahaDashaInsights.length,
      annualDashaInsightsCount: result.annualDashaInsights.length,
    });
    return result;
  }, [report, dashaReport, targetDate]);

  const marriageProbabilityChart = useMemo(() => {
    console.log("[MarriageForecast] Calculating probability chart...");
    const probabilities = [];
    const startAge = 20;
    const endAge = 40;
    const dob =
      typeof report.dob === "string" ? new Date(report.dob) : report.dob;
    const birthYear = dob.getFullYear();

    for (let age = startAge; age <= endAge; age++) {
      const targetYear = birthYear + age;
      const yearlyDashaForAge = dashaReport.yearlyDashaTimeline.find(
        (d) => d.year === targetYear,
      );
      if (yearlyDashaForAge) {
        let probability = "Neutral";
        let status = "Yellow";
        const dashaNum = yearlyDashaForAge.dashaNumber;
        const count = (num) => report.baseKundliGrid[num] || 0;

        switch (dashaNum) {
          case 3:
            probability = "High";
            status = "Green";
            break;
          case 6:
            if (report.destinyNumber === 6 || count(6) === 0) {
              probability = "High";
              status = "Green";
            }
            break;
          case 7:
            if (count(7) <= 1 || report.destinyNumber === 7) {
              probability = "High";
              status = "Green";
            }
            break;
          case 8:
            if ((count(8) + 1) % 2 === 0) {
              probability = "High";
              status = "Green";
            }
            break;
          case 2:
            probability = "Moderate";
            status = "Yellow";
            break;
          default:
            break;
        }
        probabilities.push({ age, year: targetYear, probability, status });
      }
    }
    console.log("[MarriageForecast] Calculated probability chart:", {
      totalYears: probabilities.length,
      highProbYears: probabilities.filter((p) => p.probability === "High")
        .length,
    });
    return probabilities;
  }, [report, dashaReport]);

  // Compatibility data comes from report if available
  const compatibilityData =
    report.relevantData?.destinyCompatibility?.[report.destinyNumber] || {};
  const compatibilityDescription = compatibilityData?.description?.en || "";
  const compatibility = {
    good: compatibilityData?.good || [],
    neutral: compatibilityData?.neutral || [],
    not: compatibilityData?.not || compatibilityData?.avoid || [],
  };

  return (
    <div className="space-y-6">
      {/* Page 1: Marriage Forecast + Personality Compatibility */}
      <Card
        className="pdf-page-break-after"
        style={{ pageBreakAfter: "always", pageBreakInside: "avoid" }}
      >
        <SectionTitle>Marriage Forecast</SectionTitle>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-semibold text-lg text-yellow-300 mb-2 print:text-base print:mb-1">
              Major Life Period (Maha-Dasha) Influences
            </h4>
            {marriageAnalysis.mahaDashaInsights.length > 0 ? (
              marriageAnalysis.mahaDashaInsights.map((item, i) => (
                <p
                  key={i}
                  className={`${item.status === "Green" ? "text-green-400" : "text-red-400"} print:text-sm print:mb-1`}
                >
                  {item.text}
                </p>
              ))
            ) : (
              <p className="print:text-sm">
                Neutral influence from current Maha Dasha.
              </p>
            )}
          </div>
          <div>
            <h4 className="font-semibold text-lg text-yellow-300 mb-2 print:text-base print:mb-1">
              Yearly (Annual Dasha) Influences
            </h4>
            {marriageAnalysis.annualDashaInsights.length > 0 ? (
              marriageAnalysis.annualDashaInsights.map((item, i) => (
                <p
                  key={i}
                  className={`${item.status === "Green" ? "text-green-400" : item.status === "Red" ? "text-red-400" : "text-yellow-400"} print:text-sm print:mb-1`}
                >
                  {item.text}
                </p>
              ))
            ) : (
              <p className="print:text-sm">
                Neutral influence from current Annual Dasha.
              </p>
            )}
          </div>
        </div>

        {/* Personality Compatibility on Same Page */}
        <div className="mt-6 pt-6 border-t border-gray-700 print:mt-4 print:pt-4">
          <h3 className="text-xl font-bold text-yellow-300 mb-3 print:text-lg print:mb-2">
            Personality Compatibility Snapshot
          </h3>
          <p className="mb-4 text-white/90 print:text-sm print:mb-2">
            As a Destiny Number{" "}
            <span className="font-bold text-yellow-400">
              {report.destinyNumber}
            </span>
            , your core life path energy influences who you connect with most
            naturally. {compatibilityDescription}
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-center print:gap-2">
            <div className="bg-green-500/10 p-3 rounded-lg print:p-2">
              <h4 className="font-bold text-green-400 mb-2 print:text-sm print:mb-1">
                Good Compatibility
              </h4>
              <p className="text-2xl font-bold text-white print:text-lg">
                {compatibility?.good?.join(", ") || "N/A"}
              </p>
            </div>
            <div className="bg-yellow-500/10 p-3 rounded-lg print:p-2">
              <h4 className="font-bold text-yellow-400 mb-2 print:text-sm print:mb-1">
                Neutral
              </h4>
              <p className="text-2xl font-bold text-white print:text-lg">
                {compatibility?.neutral?.join(", ") || "N/A"}
              </p>
            </div>
            <div className="bg-red-500/10 p-3 rounded-lg print:p-2">
              <h4 className="font-bold text-red-400 mb-2 print:text-sm print:mb-1">
                {compatibility?.not ? "Not Compatible" : "Avoid"}
              </h4>
              <p className="text-2xl font-bold text-white print:text-lg">
                {(compatibility?.not || compatibility?.avoid || []).join(
                  ", ",
                ) || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Page 2: Year-wise Marriage Probability - Ultra Compressed */}
      <Card
        className="pdf-page-break-after"
        style={{ pageBreakAfter: "always", pageBreakInside: "avoid" }}
      >
        <SectionTitle>Year-wise Marriage Probability (Age 20-40)</SectionTitle>
        <div className="space-y-0.5 print:space-y-0 print:leading-tight">
          {marriageProbabilityChart.map((item) => (
            <div
              key={item.age}
              className="flex items-center justify-between p-1 bg-gray-900/50 rounded-md print:p-0.5 print:py-0 print:bg-transparent print:border-b print:border-gray-700/30"
            >
              <div className="font-bold print:text-[10px] print:font-normal">
                {item.year} (Age {item.age})
              </div>
              <div
                className={`px-3 py-1 text-sm font-semibold rounded-full print:px-1.5 print:py-0 print:text-[10px] print:rounded ${
                  item.status === "Green"
                    ? "bg-green-500/20 text-green-300"
                    : item.status === "Red"
                      ? "bg-red-500/20 text-red-300"
                      : "bg-yellow-500/20 text-yellow-300"
                }`}
              >
                {item.probability}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default MarriageForecastTab;
