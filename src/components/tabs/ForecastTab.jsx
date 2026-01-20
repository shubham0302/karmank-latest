import React, { useState, useMemo } from "react";
import Card from "../Card";
import ProfessionForecastTab from "../forecasts/ProfessionForecastTab";
import TravelForecastTab from "../forecasts/TravelForecastTab";
import PropertyForecastTab from "../forecasts/PropertyForecastTab";
import MarriageForecastTab from "../forecasts/MarriageForecastTab";
import ChildBirthForecastTab from "../forecasts/ChildBirthForecastTab";

const ForecastTab = ({ report, dashaReport, gender, language = "en" }) => {
  const [activeSubTab, setActiveSubTab] = useState("Profession");
  const [forecastYear, setForecastYear] = useState(new Date().getFullYear());

  // All hooks must be called before any early returns
  const dob = report?.dob || new Date();

  const targetDate = useMemo(() => {
    const date = new Date(forecastYear, dob.getMonth(), dob.getDate());
    console.log("[ForecastTab] Calculated targetDate:", date);
    return date;
  }, [forecastYear, dob]);

  const endDate = useMemo(() => {
    const date = new Date(targetDate);
    date.setFullYear(date.getFullYear() + 1);
    date.setDate(date.getDate() - 1);
    return date;
  }, [targetDate]);

  // Validate dashaReport matches current report to prevent flash when switching users
  const dashaReportMatches = useMemo(() => {
    if (
      !report ||
      !dashaReport ||
      !dashaReport.yearlyDashaTimeline ||
      dashaReport.yearlyDashaTimeline.length === 0
    ) {
      console.warn("[ForecastTab] dashaReport missing or empty");
      return false;
    }

    // Check if the first yearly dasha's year matches the birth year
    const reportBirthYear = report.dob.getFullYear();
    const dashaFirstYear = dashaReport.yearlyDashaTimeline[0].year;

    const matches = dashaFirstYear === reportBirthYear;
    console.log("[ForecastTab] Validating dashaReport match:", {
      reportBirthYear,
      dashaFirstYear,
      matches,
    });

    return matches;
  }, [report, dashaReport]);

  // NOW we can do early returns after all hooks are called
  if (!report) return null;

  console.log("[ForecastTab] Rendering with forecastYear:", forecastYear);
  console.log("[ForecastTab] Report DOB:", report.dob);

  // If dashaReport doesn't match current report, show loading message
  if (!dashaReportMatches) {
    return (
      <div className="space-y-0">
        <Card className="mb-6">
          <p className="text-yellow-200/80 text-center py-8">
            Loading forecast data...
          </p>
        </Card>
      </div>
    );
  }

  const formatDate = (date) =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const forecastTypes = [
    { key: "Profession", component: ProfessionForecastTab },
    { key: "Travel", component: TravelForecastTab },
    { key: "Property", component: PropertyForecastTab },
    { key: "Marriage", component: MarriageForecastTab },
    { key: "Child Birth", component: ChildBirthForecastTab },
  ];

  return (
    <div className="space-y-0">
      {/* Interactive Controls - Hidden in Print */}
      <div className="print:hidden">
        <div className="flex flex-wrap gap-2 mb-4 border-b border-gray-700">
          {forecastTypes.map(({ key }) => (
            <button
              key={key}
              onClick={() => setActiveSubTab(key)}
              className={`py-2 px-4 font-semibold transition-colors duration-200 ${activeSubTab === key ? "text-yellow-400 border-b-2 border-yellow-400" : "text-yellow-200/70 hover:text-yellow-300"}`}
            >
              {key}
            </button>
          ))}
        </div>

        <Card className="mb-6">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label
                htmlFor="forecast-year"
                className="block text-sm font-medium text-yellow-500 mb-1"
              >
                Select Forecast Year
              </label>
              <input
                type="number"
                id="forecast-year"
                value={forecastYear}
                onChange={(e) =>
                  setForecastYear(
                    parseInt(e.target.value, 10) || new Date().getFullYear(),
                  )
                }
                className="bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 w-32"
              />
            </div>
            <div className="bg-gray-900/50 p-2 rounded-md text-center">
              <p className="text-sm text-yellow-200/80">
                Showing Forecast For:
              </p>
              <p className="font-bold text-yellow-400">
                {formatDate(targetDate)} to {formatDate(endDate)}
              </p>
            </div>
          </div>
        </Card>

        {/* Active Tab Content - Screen View Only */}
        <div>
          {activeSubTab === "Profession" && (
            <ProfessionForecastTab
              key={`profession-${forecastYear}`}
              report={report}
              dashaReport={dashaReport}
              gender={gender}
              targetDate={targetDate}
              language={language}
            />
          )}
          {activeSubTab === "Travel" && (
            <TravelForecastTab
              key={`travel-${forecastYear}`}
              report={report}
              dashaReport={dashaReport}
              targetDate={targetDate}
              language={language}
            />
          )}
          {activeSubTab === "Property" && (
            <PropertyForecastTab
              key={`property-${forecastYear}`}
              report={report}
              dashaReport={dashaReport}
              targetDate={targetDate}
              language={language}
            />
          )}
          {activeSubTab === "Marriage" && (
            <MarriageForecastTab
              key={`marriage-${forecastYear}`}
              report={report}
              dashaReport={dashaReport}
              targetDate={targetDate}
              language={language}
            />
          )}
          {activeSubTab === "Child Birth" && (
            <ChildBirthForecastTab
              key={`childbirth-${forecastYear}`}
              report={report}
              dashaReport={dashaReport}
              gender={gender}
              targetDate={targetDate}
              language={language}
            />
          )}
        </div>
      </div>

      {/* PDF Print View - All Forecasts (Hidden on screen, shown in print/PDF) */}
      <div className="hidden print:block" style={{ display: "none" }}>
        {forecastTypes.map(({ key, component: Component }, index) => (
          <div key={key}>
            <Component
              report={report}
              dashaReport={dashaReport}
              gender={gender}
              targetDate={targetDate}
              language={language}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastTab;
