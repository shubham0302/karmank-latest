import React, { useState, useMemo } from "react";
import Card from "../Card";
import SectionTitle from "../SectionTitle";
import NlgSummaryComponent from "../NlgSummaryComponent";
import VedicDashaKundli from "../dasha/VedicDashaKundli";
import DynamicAdvancedRemediesDisplay from "../dasha/DynamicAdvancedRemediesDisplay";
import { DATA } from "../../data/data";
import {
  analyzeRecurringNumbers,
  checkAdvancedYoga,
} from "../../utils/helpers";
import { getText } from "../../utils/helpers";

const AdvancedDashaTab = ({
  dashaReport,
  baseKundliGrid,
  basicNumber,
  destinyNumber,
  foundationalYogas: foundationalYogasProp,
  language = "en",
}) => {
  const [activeSubTab, setActiveSubTab] = useState("maha");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  // Ensure foundationalYogas is always an array
  const foundationalYogas = Array.isArray(foundationalYogasProp)
    ? foundationalYogasProp
    : [];

  if (!dashaReport)
    return (
      <Card>
        <p className="text-center">Generating Advanced Dasha Report...</p>
      </Card>
    );
  const targetDate = new Date(selectedDate + "T00:00:00");

  const currentMaha = dashaReport.mahaDashaTimeline.find(
    (d) => targetDate >= d.startDate && targetDate <= d.endDate,
  );
  const currentYearly = dashaReport.yearlyDashaTimeline.find(
    (d) => targetDate >= d.startDate && targetDate <= d.endDate,
  );
  const currentMonthly = dashaReport.monthlyDashaTimeline.find(
    (d) => targetDate >= d.startDate && targetDate <= d.endDate,
  );
  // Fix: Use date comparison without time component to avoid timezone issues
  const currentDaily = dashaReport.dailyDashaTimeline.find((d) => {
    const dDate = new Date(d.date);
    return (
      dDate.getFullYear() === targetDate.getFullYear() &&
      dDate.getMonth() === targetDate.getMonth() &&
      dDate.getDate() === targetDate.getDate()
    );
  });

  const formatDate = (date) =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const activeDashaNumbersForKundli = useMemo(() => {
    const active = {};
    if (currentMaha) active.maha = currentMaha.dashaNumber;
    if (currentYearly && ["yearly", "monthly", "daily"].includes(activeSubTab))
      active.yearly = currentYearly.dashaNumber;
    if (currentMonthly && ["monthly", "daily"].includes(activeSubTab))
      active.monthly = currentMonthly.dashaNumber;
    if (currentDaily && activeSubTab === "daily")
      active.daily = currentDaily.dashaNumber;
    return active;
  }, [activeSubTab, currentMaha, currentYearly, currentMonthly, currentDaily]);

  // Dynamic analysis based on active sub-tab selection
  const { dynamicAnalysis, aiPrompt } = useMemo(() => {
    const tempGrid = [...baseKundliGrid];
    const activeNumbers = Object.values(activeDashaNumbersForKundli);
    activeNumbers.forEach((num) => {
      if (num) tempGrid[num]++;
    });

    const allPossibleYogas = new Set();
    Object.values(DATA.yogaDetails).forEach((yoga) => {
      let isPresent = false;
      if (yoga.activation_rules) {
        isPresent = checkAdvancedYoga(yoga.activation_rules, tempGrid);
      } else if (yoga.numbers && Array.isArray(yoga.numbers)) {
        isPresent = yoga.numbers.every((num) => tempGrid[num] > 0);
        if (isPresent && yoga.empty && yoga.empty.length > 0) {
          if (yoga.empty.some((num) => tempGrid[num] > 0)) {
            isPresent = false;
          }
        }
      }
      if (isPresent) allPossibleYogas.add(getText(yoga.name, language));
    });

    const foundationalYogaNames = new Set(
      foundationalYogas.map((y) => getText(y.name, language)),
    );
    const dynamicYogaNames = [...allPossibleYogas].filter(
      (name) => !foundationalYogaNames.has(name),
    );
    const dynamicYogas = Object.values(DATA.yogaDetails).filter((yoga) =>
      dynamicYogaNames.includes(getText(yoga.name, language)),
    );

    const traitAnalysis = {};
    Object.entries(activeDashaNumbersForKundli).forEach(
      ([dashaType, number]) => {
        if (number) {
          if (!traitAnalysis[number]) {
            traitAnalysis[number] = {
              sources: [],
              details: DATA.numberDetails[number],
            };
          }
          traitAnalysis[number].sources.push(dashaType);
        }
      },
    );

    const uniqueActiveNumbers = Object.keys(traitAnalysis).map(Number).sort();
    let combinedNote = null;
    if (uniqueActiveNumbers.length > 1) {
      const key = uniqueActiveNumbers.join("-");
      if (DATA.combinedDashaInsights[key]) {
        combinedNote = getText(DATA.combinedDashaInsights[key], language);
      }
    }

    const dynamicMultiplicityAnalysis = [];
    const fullRecurringAnalysis = analyzeRecurringNumbers(
      tempGrid,
      destinyNumber,
    );
    fullRecurringAnalysis.forEach((analysis) => {
      if (tempGrid[analysis.number] > baseKundliGrid[analysis.number]) {
        dynamicMultiplicityAnalysis.push(analysis);
      }
    });

    const analysisResult = {
      dynamicYogas,
      traitAnalysis,
      combinedNote,
      dynamicMultiplicityAnalysis,
      tempGrid,
    };

    // Build language instruction based on user's language preference
    let languageInstruction = "";
    if (language === "hi") {
      languageInstruction =
        "IMPORTANT: Respond in PURE HINDI (हिंदी) using Devanagari script. Do not mix English words.";
    } else if (language === "en-hi") {
      languageInstruction =
        "IMPORTANT: Respond in HINGLISH (Hindi-English mix). Use Roman script with Hindi and English words mixed naturally.";
    } else {
      languageInstruction = "IMPORTANT: Respond in ENGLISH only.";
    }

    // Build dynamic AI prompt based on active sub-tab
    let aiPrompt = "";
    let periodLabel = "";

    if (activeSubTab === "maha") {
      periodLabel = `Maha Dasha period (${currentMaha ? formatDate(currentMaha.startDate) + " to " + formatDate(currentMaha.endDate) : "N/A"})`;
      aiPrompt = `You are a Vedic numerologist summarizing the Maha Dasha energy.
            Based on the data below, provide a 3-4 sentence summary of the overall theme for this Maha Dasha period.
            Active Dasha Number:
            ${currentMaha ? `- Maha Dasha: ${currentMaha.dashaNumber}` : "No active Maha Dasha"}

            ${analysisResult.combinedNote ? `Combined Dasha Insight: ${analysisResult.combinedNote}\n` : ""}

            Dynamically Formed Yogas:
            ${
              analysisResult.dynamicYogas.length > 0
                ? analysisResult.dynamicYogas
                    .map(
                      (y) =>
                        `- ${getText(y.name, language)}: ${getText(y.description, language)}`,
                    )
                    .join("\n")
                : "None"
            }

            Focus on the long-term themes and life direction for this Maha Dasha period.

            ${languageInstruction}`;
    } else if (activeSubTab === "yearly") {
      periodLabel = `Annual Dasha for year ${currentYearly?.year || targetDate.getFullYear()}`;
      aiPrompt = `You are a Vedic numerologist summarizing the annual energy for year ${currentYearly?.year || targetDate.getFullYear()}.
            Based on the data below, provide a 3-4 sentence summary of the overall theme for this year.
            Active Dasha Numbers:
            ${currentMaha ? `- Maha Dasha: ${currentMaha.dashaNumber}\n` : ""}
            ${currentYearly ? `- Annual Dasha: ${currentYearly.dashaNumber}\n` : ""}

            ${analysisResult.combinedNote ? `Combined Dasha Insight: ${analysisResult.combinedNote}\n` : ""}

            Dynamically Formed Yogas:
            ${
              analysisResult.dynamicYogas.length > 0
                ? analysisResult.dynamicYogas
                    .map(
                      (y) =>
                        `- ${getText(y.name, language)}: ${getText(y.description, language)}`,
                    )
                    .join("\n")
                : "None"
            }

            Focus on the primary energies at play for the year and give a brief, actionable piece of advice.

            ${languageInstruction}`;
    } else if (activeSubTab === "monthly") {
      periodLabel = `Monthly Dasha (${currentMonthly ? formatDate(currentMonthly.startDate) + " to " + formatDate(currentMonthly.endDate) : "N/A"})`;
      aiPrompt = `You are a Vedic numerologist summarizing the monthly energy period.
            Based on the data below, provide a 3-4 sentence summary of the overall theme for this monthly period.
            Active Dasha Numbers:
            ${currentMaha ? `- Maha Dasha: ${currentMaha.dashaNumber}\n` : ""}
            ${currentYearly ? `- Yearly Dasha: ${currentYearly.dashaNumber}\n` : ""}
            ${currentMonthly ? `- Monthly Dasha: ${currentMonthly.dashaNumber}\n` : ""}

            ${analysisResult.combinedNote ? `Combined Dasha Insight: ${analysisResult.combinedNote}\n` : ""}

            Dynamically Formed Yogas:
            ${
              analysisResult.dynamicYogas.length > 0
                ? analysisResult.dynamicYogas
                    .map(
                      (y) =>
                        `- ${getText(y.name, language)}: ${getText(y.description, language)}`,
                    )
                    .join("\n")
                : "None"
            }

            Focus on the short-term influences and opportunities for this monthly period.

            ${languageInstruction}`;
    } else if (activeSubTab === "daily") {
      periodLabel = `Daily Dasha for ${formatDate(targetDate)}`;
      aiPrompt = `You are a Vedic numerologist summarizing the energy of a specific date: ${targetDate.toLocaleDateString()}.
            Based on the data below, provide a 3-4 sentence summary of the overall theme for this day.
            Active Dasha Numbers:
            ${currentMaha ? `- Maha Dasha: ${currentMaha.dashaNumber}\n` : ""}
            ${currentYearly ? `- Yearly Dasha: ${currentYearly.dashaNumber}\n` : ""}
            ${currentMonthly ? `- Monthly Dasha: ${currentMonthly.dashaNumber}\n` : ""}
            ${currentDaily ? `- Daily Dasha: ${currentDaily.dashaNumber}\n` : ""}

            ${analysisResult.combinedNote ? `Combined Dasha Insight: ${analysisResult.combinedNote}\n` : ""}

            Dynamically Formed Yogas:
            ${
              analysisResult.dynamicYogas.length > 0
                ? analysisResult.dynamicYogas
                    .map(
                      (y) =>
                        `- ${getText(y.name, language)}: ${getText(y.description, language)}`,
                    )
                    .join("\n")
                : "None"
            }

            Focus on the primary energies at play today and give a brief, actionable piece of advice.

            ${languageInstruction}`;
    }

    return { dynamicAnalysis: analysisResult, aiPrompt, periodLabel };
  }, [
    baseKundliGrid,
    activeDashaNumbersForKundli,
    foundationalYogas,
    destinyNumber,
    targetDate,
    currentMaha,
    currentYearly,
    currentMonthly,
    currentDaily,
    language,
    activeSubTab,
  ]);

  const subTabs = [
    { key: "maha", label: "Maha" },
    { key: "yearly", label: "Yearly" },
    { key: "monthly", label: "Monthly" },
    { key: "daily", label: "Daily" },
  ];

  const renderContent = () => {
    const timelineMap = {
      maha: dashaReport.mahaDashaTimeline,
      yearly: dashaReport.yearlyDashaTimeline,
      monthly: dashaReport.monthlyDashaTimeline,
    };
    const activeDashaMap = {
      maha: currentMaha,
      yearly: currentYearly,
      monthly: currentMonthly,
    };

    if (activeSubTab === "daily") {
      return (
        <div className="text-center p-8 bg-gray-900/50 rounded-lg h-full flex flex-col justify-center">
          {currentDaily ? (
            <>
              <p className="text-white/70">
                Dasha for {formatDate(targetDate)}
              </p>
              <p className="text-7xl font-bold my-4 text-yellow-400">
                {currentDaily.dashaNumber}
              </p>
            </>
          ) : (
            <p className="text-2xl font-bold">
              Could not calculate Dasha for this day.
            </p>
          )}
        </div>
      );
    }

    const timeline = timelineMap[activeSubTab];
    const activeDasha = activeDashaMap[activeSubTab];
    let startIndex = 0;
    if (activeDasha) {
      const activeIndex = timeline.findIndex(
        (d) => d.startDate.getTime() === activeDasha.startDate.getTime(),
      );
      startIndex = Math.max(0, activeIndex - 5);
    }

    const slice = timeline.slice(startIndex, startIndex + 20);
    return (
      <div className="max-h-96 overflow-y-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-yellow-400/30">
              {activeSubTab === "yearly" && (
                <th className="p-2 text-yellow-500">Year</th>
              )}
              <th className="p-2 text-yellow-500">Dasha</th>
              <th className="p-2 text-yellow-500">Start</th>
              <th className="p-2 text-yellow-500">End</th>
            </tr>
          </thead>
          <tbody>
            {slice.map((p, i) => (
              <tr
                key={i}
                className={`border-b border-gray-700 ${activeDasha && p.startDate.getTime() === activeDasha.startDate.getTime() ? "bg-yellow-500/20" : ""}`}
              >
                {activeSubTab === "yearly" && <td className="p-2">{p.year}</td>}
                <td className="p-2 font-bold">{p.dashaNumber}</td>
                <td className="p-2">{formatDate(p.startDate)}</td>
                <td className="p-2">{formatDate(p.endDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Calculate yearly dasha timeline for the current Maha Dasha period
  const yearlyDashaForCurrentMaha = useMemo(() => {
    if (!currentMaha) return [];
    return dashaReport.yearlyDashaTimeline.filter(
      (yearly) =>
        yearly.startDate >= currentMaha.startDate &&
        yearly.endDate <= currentMaha.endDate,
    );
  }, [currentMaha, dashaReport.yearlyDashaTimeline]);

  // For PDF print: calculate analysis based on current Yearly Dasha only
  const yearlyDashaAnalysis = useMemo(() => {
    if (!currentYearly) return null;

    const tempGrid = [...baseKundliGrid];
    // Add only Maha and Yearly dasha numbers
    if (currentMaha) tempGrid[currentMaha.dashaNumber]++;
    if (currentYearly) tempGrid[currentYearly.dashaNumber]++;

    const allPossibleYogas = new Set();
    Object.values(DATA.yogaDetails).forEach((yoga) => {
      let isPresent = false;
      if (yoga.activation_rules) {
        isPresent = checkAdvancedYoga(yoga.activation_rules, tempGrid);
      } else if (yoga.numbers && Array.isArray(yoga.numbers)) {
        isPresent = yoga.numbers.every((num) => tempGrid[num] > 0);
        if (isPresent && yoga.empty && yoga.empty.length > 0) {
          if (yoga.empty.some((num) => tempGrid[num] > 0)) {
            isPresent = false;
          }
        }
      }
      if (isPresent) allPossibleYogas.add(getText(yoga.name, language));
    });

    const foundationalYogaNames = new Set(
      foundationalYogas.map((y) => getText(y.name, language)),
    );
    const dynamicYogaNames = [...allPossibleYogas].filter(
      (name) => !foundationalYogaNames.has(name),
    );
    const dynamicYogas = Object.values(DATA.yogaDetails).filter((yoga) =>
      dynamicYogaNames.includes(getText(yoga.name, language)),
    );

    const traitAnalysis = {};
    const activeNumbers = [
      { type: "Maha Dasha", number: currentMaha?.dashaNumber },
      { type: "Yearly Dasha", number: currentYearly.dashaNumber },
    ];

    activeNumbers.forEach(({ type, number }) => {
      if (number) {
        if (!traitAnalysis[number]) {
          traitAnalysis[number] = {
            sources: [],
            details: DATA.numberDetails[number],
          };
        }
        traitAnalysis[number].sources.push(type);
      }
    });

    const uniqueActiveNumbers = Object.keys(traitAnalysis).map(Number).sort();
    let combinedNote = null;
    if (uniqueActiveNumbers.length > 1) {
      const key = uniqueActiveNumbers.join("-");
      if (DATA.combinedDashaInsights[key]) {
        combinedNote = getText(DATA.combinedDashaInsights[key], language);
      }
    }

    const dynamicMultiplicityAnalysis = [];
    const fullRecurringAnalysis = analyzeRecurringNumbers(
      tempGrid,
      destinyNumber,
    );
    fullRecurringAnalysis.forEach((analysis) => {
      if (tempGrid[analysis.number] > baseKundliGrid[analysis.number]) {
        dynamicMultiplicityAnalysis.push(analysis);
      }
    });

    return {
      dynamicYogas,
      traitAnalysis,
      combinedNote,
      dynamicMultiplicityAnalysis,
      tempGrid,
    };
  }, [
    currentMaha,
    currentYearly,
    baseKundliGrid,
    foundationalYogas,
    destinyNumber,
    language,
  ]);

  // Render futuristic dynamic timeline table
  const renderDynamicTimeline = () => {
    if (activeSubTab === "maha") {
      return (
        <div className="relative overflow-hidden rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-blue-900/20 backdrop-blur-sm">
          {/* Futuristic animated background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute w-full h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-pulse" />
          </div>

          <div className="relative p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                <h4 className="text-xl font-bold text-purple-300">
                  Maha Dasha Timeline
                </h4>
              </div>
              <span className="text-xs text-purple-400/70 uppercase tracking-wider">
                Long-term Cycles
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-purple-500/30">
                    <th className="p-3 text-purple-300 text-sm font-semibold">
                      Dasha Number
                    </th>
                    <th className="p-3 text-purple-300 text-sm font-semibold">
                      Planet
                    </th>
                    <th className="p-3 text-purple-300 text-sm font-semibold">
                      Start Date
                    </th>
                    <th className="p-3 text-purple-300 text-sm font-semibold">
                      End Date
                    </th>
                    <th className="p-3 text-purple-300 text-sm font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dashaReport.mahaDashaTimeline.map((maha, i) => {
                    const isActive =
                      currentMaha &&
                      maha.startDate.getTime() ===
                        currentMaha.startDate.getTime();
                    const isPast = maha.endDate < targetDate;
                    const isFuture = maha.startDate > targetDate;

                    return (
                      <tr
                        key={i}
                        className={`border-b border-purple-500/10 transition-all hover:bg-purple-500/10 ${
                          isActive
                            ? "bg-purple-500/20 shadow-lg shadow-purple-500/20"
                            : ""
                        }`}
                      >
                        <td className="p-3">
                          <span
                            className={`text-2xl font-bold ${isActive ? "text-purple-300" : "text-white/70"}`}
                          >
                            {maha.dashaNumber}
                          </span>
                        </td>
                        <td className="p-3 text-white/80 text-sm">
                          {getText(
                            DATA.numberDetails[maha.dashaNumber].name,
                            language,
                          )}
                        </td>
                        <td className="p-3 text-white/70 text-sm">
                          {formatDate(maha.startDate)}
                        </td>
                        <td className="p-3 text-white/70 text-sm">
                          {formatDate(maha.endDate)}
                        </td>
                        <td className="p-3">
                          {isActive && (
                            <span className="px-3 py-1 rounded-full bg-purple-500/30 text-purple-300 text-xs font-semibold flex items-center gap-2 w-fit">
                              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                              ACTIVE
                            </span>
                          )}
                          {isPast && (
                            <span className="text-white/40 text-xs">
                              Completed
                            </span>
                          )}
                          {isFuture && (
                            <span className="text-cyan-400/70 text-xs">
                              Upcoming
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    } else if (activeSubTab === "yearly") {
      return (
        <div className="relative overflow-hidden rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-900/20 via-blue-900/20 to-cyan-900/20 backdrop-blur-sm">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute w-full h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 animate-pulse" />
          </div>

          <div className="relative p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                <h4 className="text-xl font-bold text-indigo-300">
                  Annual Dasha Timeline
                </h4>
              </div>
              <span className="text-xs text-indigo-400/70 uppercase tracking-wider">
                Yearly Cycles
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-indigo-500/30">
                    <th className="p-3 text-indigo-300 text-sm font-semibold">
                      Year
                    </th>
                    <th className="p-3 text-indigo-300 text-sm font-semibold">
                      Dasha Number
                    </th>
                    <th className="p-3 text-indigo-300 text-sm font-semibold">
                      Planet
                    </th>
                    <th className="p-3 text-indigo-300 text-sm font-semibold">
                      Start Date
                    </th>
                    <th className="p-3 text-indigo-300 text-sm font-semibold">
                      End Date
                    </th>
                    <th className="p-3 text-indigo-300 text-sm font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {yearlyDashaForCurrentMaha.map((yearly, i) => {
                    const isActive =
                      currentYearly &&
                      yearly.startDate.getTime() ===
                        currentYearly.startDate.getTime();
                    const isPast = yearly.endDate < targetDate;
                    const isFuture = yearly.startDate > targetDate;

                    return (
                      <tr
                        key={i}
                        className={`border-b border-indigo-500/10 transition-all hover:bg-indigo-500/10 ${
                          isActive
                            ? "bg-indigo-500/20 shadow-lg shadow-indigo-500/20"
                            : ""
                        }`}
                      >
                        <td className="p-3 text-white/80 font-semibold">
                          {yearly.year}
                        </td>
                        <td className="p-3">
                          <span
                            className={`text-2xl font-bold ${isActive ? "text-indigo-300" : "text-white/70"}`}
                          >
                            {yearly.dashaNumber}
                          </span>
                        </td>
                        <td className="p-3 text-white/80 text-sm">
                          {getText(
                            DATA.numberDetails[yearly.dashaNumber].name,
                            language,
                          )}
                        </td>
                        <td className="p-3 text-white/70 text-sm">
                          {formatDate(yearly.startDate)}
                        </td>
                        <td className="p-3 text-white/70 text-sm">
                          {formatDate(yearly.endDate)}
                        </td>
                        <td className="p-3">
                          {isActive && (
                            <span className="px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center gap-2 w-fit">
                              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                              ACTIVE
                            </span>
                          )}
                          {isPast && (
                            <span className="text-white/40 text-xs">
                              Completed
                            </span>
                          )}
                          {isFuture && (
                            <span className="text-cyan-400/70 text-xs">
                              Upcoming
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    } else if (activeSubTab === "monthly") {
      const monthlyDashas = dashaReport.monthlyDashaTimeline;
      // Find current index and show surrounding months
      const currentIndex = monthlyDashas.findIndex(
        (m) =>
          currentMonthly &&
          m.startDate.getTime() === currentMonthly.startDate.getTime(),
      );
      const startIdx = Math.max(0, currentIndex - 10);
      const displayMonthly = monthlyDashas.slice(startIdx, startIdx + 20);

      return (
        <div className="relative overflow-hidden rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-900/20 via-teal-900/20 to-blue-900/20 backdrop-blur-sm">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute w-full h-full bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-500 animate-pulse" />
          </div>

          <div className="relative p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <h4 className="text-xl font-bold text-cyan-300">
                  Monthly Dasha Timeline
                </h4>
              </div>
              <span className="text-xs text-cyan-400/70 uppercase tracking-wider">
                Pratyantara Periods
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-cyan-500/30">
                    <th className="p-3 text-cyan-300 text-sm font-semibold">
                      Dasha Number
                    </th>
                    <th className="p-3 text-cyan-300 text-sm font-semibold">
                      Planet
                    </th>
                    <th className="p-3 text-cyan-300 text-sm font-semibold">
                      Start Date
                    </th>
                    <th className="p-3 text-cyan-300 text-sm font-semibold">
                      End Date
                    </th>
                    <th className="p-3 text-cyan-300 text-sm font-semibold">
                      Duration
                    </th>
                    <th className="p-3 text-cyan-300 text-sm font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayMonthly.map((monthly, i) => {
                    const isActive =
                      currentMonthly &&
                      monthly.startDate.getTime() ===
                        currentMonthly.startDate.getTime();
                    const isPast = monthly.endDate < targetDate;
                    const isFuture = monthly.startDate > targetDate;
                    const duration = Math.ceil(
                      (monthly.endDate - monthly.startDate) /
                        (1000 * 60 * 60 * 24),
                    );

                    return (
                      <tr
                        key={i}
                        className={`border-b border-cyan-500/10 transition-all hover:bg-cyan-500/10 ${
                          isActive
                            ? "bg-cyan-500/20 shadow-lg shadow-cyan-500/20"
                            : ""
                        }`}
                      >
                        <td className="p-3">
                          <span
                            className={`text-2xl font-bold ${isActive ? "text-cyan-300" : "text-white/70"}`}
                          >
                            {monthly.dashaNumber}
                          </span>
                        </td>
                        <td className="p-3 text-white/80 text-sm">
                          {getText(
                            DATA.numberDetails[monthly.dashaNumber].name,
                            language,
                          )}
                        </td>
                        <td className="p-3 text-white/70 text-sm">
                          {formatDate(monthly.startDate)}
                        </td>
                        <td className="p-3 text-white/70 text-sm">
                          {formatDate(monthly.endDate)}
                        </td>
                        <td className="p-3 text-white/60 text-xs">
                          {duration} days
                        </td>
                        <td className="p-3">
                          {isActive && (
                            <span className="px-3 py-1 rounded-full bg-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-2 w-fit">
                              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                              ACTIVE
                            </span>
                          )}
                          {isPast && (
                            <span className="text-white/40 text-xs">
                              Completed
                            </span>
                          )}
                          {isFuture && (
                            <span className="text-cyan-400/70 text-xs">
                              Upcoming
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    } else if (activeSubTab === "daily") {
      // Show today's daily dasha prominently
      return (
        <div className="relative overflow-hidden rounded-xl border border-yellow-500/30 bg-gradient-to-br from-yellow-900/20 via-amber-900/20 to-orange-900/20 backdrop-blur-sm">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute w-full h-full bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 animate-pulse" />
          </div>

          <div className="relative p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" />
              <h4 className="text-2xl font-bold text-yellow-300">
                Daily Dasha
              </h4>
              <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" />
            </div>

            {currentDaily ? (
              <div className="max-w-md mx-auto">
                <p className="text-white/70 mb-4 text-sm">
                  Dasha for {formatDate(targetDate)}
                </p>
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-yellow-400/20 blur-2xl" />
                  <p className="relative text-8xl font-bold text-yellow-400 my-6">
                    {currentDaily.dashaNumber}
                  </p>
                </div>
                <p className="text-yellow-300 font-semibold text-xl mt-4">
                  {getText(
                    DATA.numberDetails[currentDaily.dashaNumber].name,
                    language,
                  )}
                </p>
                <div className="mt-6 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <p className="text-white/80 text-sm leading-relaxed">
                    {getText(
                      DATA.numberDetails[currentDaily.dashaNumber].description,
                      language,
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-white/70">
                No daily dasha data available for this date
              </p>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="space-y-0">
      {/* Page 1: Basic Details (Maha + Annual Dasha) */}
      <Card
        className="pdf-page-break-after mb-12"
        style={{ pageBreakAfter: "always", pageBreakInside: "avoid" }}
      >
        <div className="text-center mb-10 print:mb-6">
          <div className="inline-block relative">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent print:text-2xl">
              Dasha Analysis
            </h2>
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-full" />
          </div>
          <p className="text-white/60 text-sm mt-4 print:text-xs print:mt-2">
            Influences active for year{" "}
            {currentYearly?.year || targetDate.getFullYear()}
          </p>
        </div>

        {/* 1. Current Maha Dasha + Current Annual Dasha Side by Side */}
        <div className="grid md:grid-cols-2 gap-6 mb-8 print:gap-4 print:mb-6 print:mb-0">
          {/* Current Maha Dasha */}
          <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 p-6 rounded-xl border border-purple-500/30 print:p-4">
            <div className="text-center">
              <h3 className="text-xl font-bold text-purple-300 mb-3 print:text-lg print:mb-2">
                Current Maha Dasha
              </h3>
              {currentMaha ? (
                <>
                  <p className="text-5xl font-bold text-purple-400 my-3 print:text-3xl print:my-2">
                    {currentMaha.dashaNumber}
                  </p>
                  <p className="text-white/70 text-sm print:text-xs">
                    {formatDate(currentMaha.startDate)} to{" "}
                    {formatDate(currentMaha.endDate)}
                  </p>
                  <p className="text-purple-300 font-semibold mt-2 text-base print:text-sm print:mt-1">
                    {getText(
                      DATA.numberDetails[currentMaha.dashaNumber].name,
                      language,
                    )}
                  </p>
                </>
              ) : (
                <p className="text-white/70">No Maha Dasha data available</p>
              )}
            </div>
          </div>

          {/* Current Annual Dasha */}
          <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 p-6 rounded-xl border border-indigo-500/30 print:p-4">
            <div className="text-center">
              <h3 className="text-xl font-bold text-indigo-300 mb-3 print:text-lg print:mb-2">
                Current Annual Dasha
              </h3>
              {currentYearly ? (
                <>
                  <p className="text-5xl font-bold text-indigo-400 my-3 print:text-3xl print:my-2">
                    {currentYearly.dashaNumber}
                  </p>
                  <p className="text-white/70 text-sm print:text-xs">
                    {formatDate(currentYearly.startDate)} to{" "}
                    {formatDate(currentYearly.endDate)}
                  </p>
                  <p className="text-indigo-300 font-semibold mt-2 text-base print:text-sm print:mt-1">
                    {getText(
                      DATA.numberDetails[currentYearly.dashaNumber].name,
                      language,
                    )}
                  </p>
                </>
              ) : (
                <p className="text-white/70">No Annual Dasha data available</p>
              )}
            </div>
          </div>
        </div>

        {/* AI-Generated Summary (visible in PDF) */}
        <div className="mt-8">
          <NlgSummaryComponent
            title={`${activeSubTab.charAt(0).toUpperCase() + activeSubTab.slice(1)} Dasha Analysis`}
            prompt={aiPrompt}
          />
        </div>
      </Card>

      {/* Page 3: Active Influences */}
      {Object.keys(dynamicAnalysis.traitAnalysis).length > 0 && (
        <Card
          className="pdf-page-break-after mt-12 mb-12"
          style={{
            pageBreakAfter: "always",
            pageBreakBefore: "always",
            pageBreakInside: "avoid",
          }}
        >
          <div className="text-center mb-10 print:mb-6">
            <div className="inline-block relative">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent print:text-2xl">
                Active Influences
              </h2>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-full print:hidden" />
            </div>
            <p className="text-white/60 text-sm mt-4 print:text-xs print:mt-2">
              Number influences from current dashas
            </p>
          </div>

          <div className="space-y-4">
            {dynamicAnalysis.combinedNote && (
              <div className="p-4 bg-fuchsia-500/20 border-l-4 border-fuchsia-400 rounded-r-lg print:bg-transparent print:border-l-2">
                <h4 className="font-bold text-fuchsia-300 text-base print:text-sm">
                  Combined Insight
                </h4>
                <p className="text-sm text-white/90 mt-1 print:text-xs">
                  {dynamicAnalysis.combinedNote}
                </p>
              </div>
            )}
            {Object.entries(dynamicAnalysis.traitAnalysis).map(
              ([number, data]) => (
                <div
                  key={number}
                  className="p-4 bg-gray-900/50 rounded-md border border-white/10 print:bg-transparent print:p-3"
                >
                  <h4 className="font-bold text-yellow-400 text-base print:text-sm">
                    Number {number}: {getText(data.details.name, language)}
                  </h4>
                  <p className="text-xs text-yellow-200/80 italic mb-2 print:text-xs">
                    Active from {data.sources.join(" & ")}
                    {data.sources.length > 1 && (
                      <span className="font-bold text-red-400">
                        {" "}
                        (Amplified)
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-white/90 print:text-xs">
                    {getText(data.details.description, language)}
                  </p>
                </div>
              ),
            )}
          </div>
        </Card>
      )}

      {/* Page 4: Active Yogas (if any) */}
      {dynamicAnalysis.dynamicYogas.length > 0 && (
        <Card
          className="pdf-page-break-after mt-12 mb-12"
          style={{
            pageBreakAfter: "always",
            pageBreakBefore: "always",
            pageBreakInside: "avoid",
          }}
        >
          <div className="text-center mb-10 print:mb-6">
            <div className="inline-block relative">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent print:text-2xl">
                Active Yogas
              </h2>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full print:hidden" />
            </div>
            <p className="text-white/60 text-sm mt-4 print:text-xs print:mt-2">
              Yogas formed by current{" "}
              {activeSubTab === "maha"
                ? "Maha Dasha"
                : activeSubTab === "yearly"
                  ? "Maha + Annual Dasha"
                  : activeSubTab === "monthly"
                    ? "Maha + Annual + Monthly Dasha"
                    : "All Active Dasha"}{" "}
              combination
            </p>
          </div>

          <div className="space-y-4">
            {dynamicAnalysis.dynamicYogas.map((yoga) => (
              <div
                key={getText(yoga.name, language)}
                className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 p-6 rounded-xl border border-green-500/30 print:p-4 print:bg-transparent"
              >
                <h3 className="text-xl font-bold text-yellow-400 mb-3 print:text-lg">
                  {getText(yoga.name, language)}
                </h3>
                <p className="text-base text-white/90 leading-relaxed print:text-sm">
                  {getText(yoga.description, language)}
                </p>
                {yoga.traits && yoga.traits.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-green-300 mb-2 print:text-xs">
                      Key Traits:
                    </h4>
                    <ul className="list-disc list-inside text-sm text-white/80 space-y-1 print:text-xs">
                      {yoga.traits.map((trait) => (
                        <li key={getText(trait, language)}>
                          {getText(trait, language)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Page 5: Annual Dasha Timeline */}
      <Card
        className="pdf-page-break-after mt-12 mb-12"
        style={{
          pageBreakAfter: "always",
          pageBreakBefore: "always",
          pageBreakInside: "avoid",
        }}
      >
        <div className="text-center mb-10 print:mb-6">
          <div className="inline-block relative">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent print:text-2xl">
              Annual Dasha Timeline
            </h2>
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 rounded-full" />
          </div>
          <p className="text-white/60 text-sm mt-4 print:text-xs print:mt-2">
            Yearly Cycles for Current Maha Dasha
          </p>
        </div>

        {/* Yearly Dasha Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-indigo-500/30">
                <th className="p-3 text-indigo-300 text-sm font-semibold print:p-2 print:text-xs">
                  Year
                </th>
                <th className="p-3 text-indigo-300 text-sm font-semibold print:p-2 print:text-xs">
                  Dasha Number
                </th>
                <th className="p-3 text-indigo-300 text-sm font-semibold print:p-2 print:text-xs">
                  Planet
                </th>
                <th className="p-3 text-indigo-300 text-sm font-semibold print:p-2 print:text-xs">
                  Start Date
                </th>
                <th className="p-3 text-indigo-300 text-sm font-semibold print:p-2 print:text-xs">
                  End Date
                </th>
                <th className="p-3 text-indigo-300 text-sm font-semibold print:p-2 print:text-xs print:hidden">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {yearlyDashaForCurrentMaha.map((yearly, i) => {
                const isActive =
                  currentYearly &&
                  yearly.startDate.getTime() ===
                    currentYearly.startDate.getTime();
                const isPast = yearly.endDate < targetDate;
                const isFuture = yearly.startDate > targetDate;

                return (
                  <tr
                    key={i}
                    className={`border-b border-indigo-500/10 ${
                      isActive ? "bg-indigo-500/20" : ""
                    }`}
                  >
                    <td className="p-3 text-white/80 font-semibold print:p-2 print:text-xs">
                      {yearly.year}
                    </td>
                    <td className="p-3 print:p-2">
                      <span
                        className={`text-2xl font-bold print:text-lg ${isActive ? "text-indigo-300" : "text-white/70"}`}
                      >
                        {yearly.dashaNumber}
                      </span>
                    </td>
                    <td className="p-3 text-white/80 text-sm print:p-2 print:text-xs">
                      {getText(
                        DATA.numberDetails[yearly.dashaNumber].name,
                        language,
                      )}
                    </td>
                    <td className="p-3 text-white/70 text-sm print:p-2 print:text-xs">
                      {formatDate(yearly.startDate)}
                    </td>
                    <td className="p-3 text-white/70 text-sm print:p-2 print:text-xs">
                      {formatDate(yearly.endDate)}
                    </td>
                    <td className="p-3 print:hidden">
                      {isActive && (
                        <span className="px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-300 text-xs font-semibold">
                          ACTIVE
                        </span>
                      )}
                      {isPast && (
                        <span className="text-white/40 text-xs">Completed</span>
                      )}
                      {isFuture && (
                        <span className="text-cyan-400/70 text-xs">
                          Upcoming
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Screen-only interactive sections */}
      <div className="print:hidden">
        {/* 5. Dasha Kundli (Screen only) */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-blue-900/40 border border-purple-500/30 rounded-2xl p-8 shadow-2xl">
            {/* Title Section */}
            <div className="text-center mb-8">
              <div className="inline-block relative">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
                  Dynamic Dasha Kundli
                </h3>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full animate-pulse" />
              </div>
              <p className="text-white/60 text-sm mt-4">
                Cosmic Influences Active for {formatDate(targetDate)}
              </p>
            </div>

            {/* Kundli Grid Container */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                {/* Outer glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl animate-pulse"></div>

                {/* Kundli Grid */}
                <div className="relative transform scale-110">
                  <VedicDashaKundli
                    baseGrid={baseKundliGrid}
                    activeNumbers={activeDashaNumbersForKundli}
                    basicNumber={basicNumber}
                    destinyNumber={destinyNumber}
                  />
                </div>
              </div>
            </div>

            {/* Legend Section */}
            <div className="mt-8 p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
              <h4 className="text-sm font-semibold text-center text-purple-300 mb-4 uppercase tracking-wider">
                Active Dasha Legend
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: DATA.colorMap.maha }}
                  ></div>
                  <span className="text-white/80">
                    Maha Dasha ({currentMaha ? currentMaha.dashaNumber : "N/A"})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: DATA.colorMap.yearly }}
                  ></div>
                  <span className="text-white/80">
                    Yearly Dasha (
                    {currentYearly ? currentYearly.dashaNumber : "N/A"})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: DATA.colorMap.monthly }}
                  ></div>
                  <span className="text-white/80">
                    Monthly Dasha (
                    {currentMonthly ? currentMonthly.dashaNumber : "N/A"})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: DATA.colorMap.daily }}
                  ></div>
                  <span className="text-white/80">
                    Daily Dasha (
                    {currentDaily ? currentDaily.dashaNumber : "N/A"})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: DATA.colorMap.destiny }}
                  ></div>
                  <span className="text-white/80">
                    Destiny ({destinyNumber})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: DATA.colorMap.basic }}
                  ></div>
                  <span className="text-white/80">Basic ({basicNumber})</span>
                </div>
              </div>
            </div>

            {/* Current Active Summary */}
            <div className="mt-6 p-4 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-xl">
              <div className="text-center">
                <p className="text-cyan-300 font-semibold mb-2">
                  Currently Active Influences
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  {currentMaha && (
                    <div className="bg-gray-900/50 px-3 py-1.5 rounded-lg">
                      <span className="text-white/60">Maha:</span>{" "}
                      <span className="text-white font-bold ml-1">
                        {currentMaha.dashaNumber} (
                        {getText(
                          DATA.numberDetails[currentMaha.dashaNumber]?.name,
                          language,
                        )}
                        )
                      </span>
                    </div>
                  )}
                  {currentYearly && (
                    <div className="bg-gray-900/50 px-3 py-1.5 rounded-lg">
                      <span className="text-white/60">Yearly:</span>{" "}
                      <span className="text-white font-bold ml-1">
                        {currentYearly.dashaNumber} (
                        {getText(
                          DATA.numberDetails[currentYearly.dashaNumber]?.name,
                          language,
                        )}
                        )
                      </span>
                    </div>
                  )}
                  {currentMonthly && (
                    <div className="bg-gray-900/50 px-3 py-1.5 rounded-lg">
                      <span className="text-white/60">Monthly:</span>{" "}
                      <span className="text-white font-bold ml-1">
                        {currentMonthly.dashaNumber} (
                        {getText(
                          DATA.numberDetails[currentMonthly.dashaNumber]?.name,
                          language,
                        )}
                        )
                      </span>
                    </div>
                  )}
                  {currentDaily && (
                    <div className="bg-gray-900/50 px-3 py-1.5 rounded-lg">
                      <span className="text-white/60">Daily:</span>{" "}
                      <span className="text-white font-bold ml-1">
                        {currentDaily.dashaNumber} (
                        {getText(
                          DATA.numberDetails[currentDaily.dashaNumber]?.name,
                          language,
                        )}
                        )
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Date Picker + Timeline Selector */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div>
              <label
                htmlFor="dasha-date"
                className="block text-sm font-medium text-yellow-500 mb-1"
              >
                Select Date for Analysis
              </label>
              <input
                type="date"
                id="dasha-date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-gray-700 border-gray-600 rounded-md shadow-sm p-2"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-yellow-500 mb-1">
                View Timeline
              </label>
              <div className="flex flex-wrap gap-2">
                {subTabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveSubTab(tab.key)}
                    className={`py-2 px-4 rounded-md font-semibold transition-all duration-200 text-sm ${
                      activeSubTab === tab.key
                        ? "bg-yellow-500 text-indigo-900 shadow-lg shadow-yellow-500/30"
                        : "bg-gray-700 hover:bg-gray-600 text-yellow-200/80"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 7. Futuristic Dynamic Timeline Table */}
          {renderDynamicTimeline()}
        </div>
      </div>
    </div>
  );
};

export default AdvancedDashaTab;
