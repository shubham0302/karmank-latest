// LifeCycleTabWithPlanets.jsx
import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Card from '../Card';
import SectionTitle from '../SectionTitle';
import { DATA } from '../../data/data';

/**
 * LifeCycleTabWithPlanets.jsx
 * - Planet mapping replaces numeric labels in UI and NLG prompt.
 * - Includes generateLifeCyclePrompt + useCachedLifeCycleNlg to be drop-in ready.
 */

/* -------------------- Planet Mapping & Helpers -------------------- */

export const NUMBER_TO_PLANET = {
  1: { name: 'Sun', display: '☀️ Sun' },
  2: { name: 'Moon', display: '🌙 Moon' },
  3: { name: 'Jupiter', display: '♃ Jupiter' },
  4: { name: 'Rahu', display: '☊ Rahu' },
  5: { name: 'Mercury', display: '☿ Mercury' },
  6: { name: 'Venus', display: '♀ Venus' },
  7: { name: 'Ketu', display: '☋ Ketu' },
  8: { name: 'Saturn', display: '♄ Saturn' },
  9: { name: 'Mars', display: '♂ Mars' },
};

// Return "♄ Saturn" style label (useful for large decorative display)
export const planetLabel = (num) => {
  if (num === null || num === undefined) return 'Unknown';
  const entry = NUMBER_TO_PLANET[num];
  return entry ? entry.display : `Number ${num}`;
};

// Return short planet name "Saturn" (good for chip text)
export const planetName = (num) => {
  if (num === null || num === undefined) return 'Unknown';
  return NUMBER_TO_PLANET[num]?.name || `Number ${num}`;
};

// normalize cache key
const normalizeKey = (s) =>
  s
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');

/* -------------------- Prompt Generator (Planet-aware) -------------------- */

export const generateLifeCyclePrompt = (name, destinyNum, currentMaha, currentYearly) => {
  if (!currentMaha || !currentYearly) return null;

  const mahaNum = currentMaha.dashaNumber;
  const yearlyNum = currentYearly.dashaNumber;

  const mahaPlanet = planetName(mahaNum); // "Mars"
  const yearlyPlanet = planetName(yearlyNum); // "Venus"

  // number-based static traits from DATA fallback
  const mahaTrait = (typeof DATA !== 'undefined' && DATA.numberDetails?.[mahaNum]?.coreVibration) || 'Transformational';
  const yearlyTrait = (typeof DATA !== 'undefined' && DATA.numberDetails?.[yearlyNum]?.coreVibration) || 'Active';

  // combined insight lookup (falls back to general)
  const combinedKey = `${Math.min(mahaNum, yearlyNum)}-${Math.max(mahaNum, yearlyNum)}`;
  const combinedInsight = (typeof DATA !== 'undefined' && DATA.combinedDashaInsights?.[combinedKey]) || 'A period requiring balance and adaptation.';

  // Build the human-friendly prompt using planet names but keep number available for advice context
  return `
Act as an expert Vedic Numerologist analyzing the life path for ${name} (Destiny Number: ${destinyNum}).

Current Time Cycle Context:
- Major life theme: The ${mahaPlanet} period (Number ${mahaNum}) — characterized by ${mahaTrait}.
- This year's focus: The ${yearlyPlanet} year (Number ${yearlyNum}) — characterized by ${yearlyTrait}.
- Core interaction: ${combinedInsight}

Task:
Generate a concise, 3-sentence prediction for this specific phase of life.
1. First sentence: Describe the overall "season" of life they are in (influenced by the ${mahaPlanet} period).
2. Second sentence: Highlight the specific focus for this year (influenced by the ${yearlyPlanet} year) and how it interacts with the major theme.
3. Third sentence: Give one specific, actionable piece of advice relevant to their Destiny Number ${destinyNum}.

Constraints:
- Keep it under 60 words to be direct and impactful.
- Tone: Empowering, predictive, and grounded.
- Do NOT use technical terms like "Maha Dasha" or "Antar Dasha". Use natural language like "This major cycle" or "This year".
- Alignment Rule: If the Yearly Number is 6, mention Relationships/Luxury. If 5, mention Business/Change. If 8, mention Hard Work/Career. If 7, mention Introspection/Travel.
`;
};

/* -------------------- Caching Hook (localStorage + Gemini placeholder) -------------------- */

export const useCachedLifeCycleNlg = (uniqueKey, prompt, shouldGenerate = false) => {
  const [text, setText] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [hasCheckedCache, setHasCheckedCache] = React.useState(false);

  useEffect(() => {
    if (!uniqueKey || !prompt) return;

    // PRIORITY 1: Check localStorage (fastest) - only once
    if (!hasCheckedCache) {
      try {
        const cachedData = localStorage.getItem(uniqueKey);
        if (cachedData) {
          console.log('✅ Life Cycle NLG: Loaded from localStorage (no API cost)');
          setText(cachedData);
          setHasCheckedCache(true);
          return; // Stop here - no API call needed
        }
      } catch (e) {
        // localStorage may be disabled — continue to fetch
        console.warn('localStorage unavailable', e);
      }
      setHasCheckedCache(true);
    }

    // Only fetch from API if user has manually triggered generation
    if (!shouldGenerate || text) return;

    // Fetch from NLG API
    const fetchNlg = async () => {
      setLoading(true);
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

        console.log("[Life Cycle] 🔒 Calling secure backend API for NLG generation...");

        const response = await fetch(`${backendUrl}/nlg/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            cacheKey: uniqueKey,
            nlgType: 'lifecycle'
          }),
        });

        console.log("[Life Cycle] Response status:", response.status);
        const result = await response.json();
        console.log("[Life Cycle] API Response:", result);

        if (!response.ok) {
          const errorMsg = result.message || `API call failed with status: ${response.status}`;
          throw new Error(errorMsg);
        }

        if (result.success && result.text) {
          const generatedText = result.text;
          // Save to localStorage for instant retrieval on future visits
          try {
            localStorage.setItem(uniqueKey, generatedText);
            console.log('💾 Life Cycle NLG: Saved to localStorage (stable for this year)');
          } catch (e) {
            // ignore storage failures
            console.warn('Failed to save to localStorage', e);
          }
          setText(generatedText);

          if (result.cached) {
            console.log("✅ Life Cycle loaded from backend cache (no API cost)");
          } else {
            console.log("✅ Life Cycle generated and cached");
          }
          return;
        }

        // fallback when API didn't return expected shape
        throw new Error('NLG returned unexpected structure');
      } catch (e) {
        console.error('NLG Error', e);
        // sensible fallback copy
        const fallback = 'Your current life cycle suggests a period of transformation. Focus on aligning daily actions with major goals. Please ensure backend server is running.';
        setText(fallback);
      } finally {
        setLoading(false);
      }
    };

    fetchNlg();
  }, [uniqueKey, prompt, shouldGenerate, hasCheckedCache, text]);

  return { text, loading };
};

/* -------------------- Utility Helpers -------------------- */

// Ensure value is a Date object (accepts ISO string)
const toDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

// Format "Mar 2025"
const formatMonthYear = (date) => (date ? date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : 'N/A');

// Build monthly dasha slices for a specific year (9 dashas per year)
const buildMonthlyDashaSlices = (monthlyDashaTimeline, yearStartDate, yearEndDate) => {
  if (!monthlyDashaTimeline || !yearStartDate || !yearEndDate) return [];

  const start = toDate(yearStartDate);
  const end = toDate(yearEndDate);
  if (!start || !end) return [];

  // Filter monthly dashas that fall within this year period
  return monthlyDashaTimeline.filter(monthly => {
    const mStart = toDate(monthly.startDate);
    const mEnd = toDate(monthly.endDate);
    if (!mStart || !mEnd) return false;
    // Include if any part of the monthly dasha overlaps with the year period
    return mStart <= end && mEnd >= start;
  });
};

/* -------------------- LifeCycleTab Component -------------------- */

const LifeCycleTab = ({ report, dashaReport, name, gender, language = 'en' }) => {
  const [expandedMahaIndex, setExpandedMahaIndex] = useState(null);
  const [expandedYearIndex, setExpandedYearIndex] = useState(null);
  const [shouldGenerateNlg, setShouldGenerateNlg] = useState(false);

  if (!report || !dashaReport) return null;

  const dob = report.dob;
  const destinyNumber = report.destinyNumber;
  const userName = report.name || name;

  // 1) Process timelines into hierarchy and detect current maha/yearly
  const { hierarchy, currentMaha, currentYearly } = useMemo(() => {
    if (!dashaReport || !dob) return { hierarchy: [], currentMaha: null, currentYearly: null };

    const now = new Date();
    const currentYear = now.getFullYear();
    const endLimitYear = currentYear + 5;

    const mahaDashaTimeline = (dashaReport.mahaDashaTimeline || []).map((m) => ({
      ...m,
      startDate: toDate(m.startDate),
      endDate: toDate(m.endDate),
    }));

    const yearlyDashaTimeline = (dashaReport.yearlyDashaTimeline || []).map((y) => ({
      ...y,
      startDate: toDate(y.startDate),
      endDate: toDate(y.endDate),
    }));

    const activeMaha = mahaDashaTimeline.find((m) => m.startDate && m.endDate && now >= m.startDate && now <= m.endDate) || null;
    const activeYearly = yearlyDashaTimeline.find((y) => y.startDate && y.endDate && now >= y.startDate && now <= y.endDate) || null;

    const processedHierarchy = [];
    mahaDashaTimeline.forEach((maha) => {
      const subPeriods = yearlyDashaTimeline.filter(
        (yearly) =>
          yearly.startDate &&
          maha.startDate &&
          yearly.startDate >= maha.startDate &&
          yearly.startDate < maha.endDate &&
          yearly.year <= endLimitYear
      );

      if (subPeriods.length > 0 || (maha.endDate && maha.endDate.getFullYear() < currentYear)) {
        processedHierarchy.push({ ...maha, subPeriods });
      }
    });

    return { hierarchy: processedHierarchy, currentMaha: activeMaha, currentYearly: activeYearly };
  }, [dashaReport, dob]);

  // 2) Build cache key only for active yearly (minimize NLG usage)
  const uniqueCacheKey = useMemo(() => {
    if (!userName || !dob || !currentYearly) return null;
    const dobStr = toDate(dob).toISOString().split('T')[0];
    return normalizeKey(`KarmAnk_LC_${userName}_${dobStr}_${currentYearly.year}`);
  }, [userName, dob, currentYearly]);

  // 3) Generate NLG prompt for current maha/yearly
  const nlgPrompt = useMemo(() => {
    if (!currentMaha || !currentYearly) return null;
    return generateLifeCyclePrompt(userName, destinyNumber, currentMaha, currentYearly);
  }, [userName, destinyNumber, currentMaha, currentYearly]);

  const { text: aiSummary, loading } = useCachedLifeCycleNlg(uniqueCacheKey, nlgPrompt, shouldGenerateNlg);

  const isCurrent = (start, end) => {
    const now = new Date();
    const s = toDate(start);
    const e = toDate(end);
    if (!s || !e) return false;
    return now >= s && now <= e;
  };

  const handleMahaClick = (index) => {
    setExpandedYearIndex(null);
    setExpandedMahaIndex((prev) => (prev === index ? null : index));
  };

  const handleYearClick = (maha, yIndex, yearlyObj) => {
    const activeYear = isCurrent(yearlyObj.startDate, yearlyObj.endDate);
    if (!activeYear) {
      setExpandedYearIndex((prev) => (prev === yIndex ? null : yIndex));
      return;
    }
    setExpandedYearIndex((prev) => (prev === yIndex ? null : yIndex));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* AI Insight Card */}
      {currentMaha && (
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 border border-indigo-400 p-6 rounded-xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <span className="text-9xl font-serif text-white">{currentYearly ? planetLabel(currentYearly.dashaNumber) : planetLabel(currentMaha.dashaNumber)}</span>
          </div>

          <div className="relative z-10">
            <h3 className="text-xl font-bold text-yellow-400 mb-3 flex items-center gap-2">
              <span className="text-2xl">✨</span> Current Life Phase Insight
            </h3>

            {loading ? (
              <div className="flex items-center gap-2 text-indigo-200 animate-pulse">
                <div className="w-2 h-2 bg-indigo-200 rounded-full" />
                <span>Generating your personalized timeline narrative...</span>
              </div>
            ) : aiSummary ? (
              <div className="bg-black/20 p-4 rounded-lg border-l-4 border-yellow-400">
                <p className="text-lg text-indigo-50 leading-relaxed font-medium italic">"{aiSummary}"</p>
              </div>
            ) : (
              <div className="bg-black/20 p-4 rounded-lg border-l-4 border-indigo-400 text-center">
                <p className="text-indigo-200 mb-4">Click below to generate your personalized life phase insight using AI</p>
                <button
                  onClick={() => setShouldGenerateNlg(true)}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-indigo-900 font-bold rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 shadow-lg hover:shadow-yellow-500/50"
                >
                  ✨ Generate AI Insight
                </button>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-indigo-300/80">
              <span className="bg-indigo-950/50 px-3 py-1 rounded-full border border-indigo-500/30">
                Major Cycle: <strong>{planetName(currentMaha.dashaNumber)}</strong>
              </span>
              <span className="bg-indigo-950/50 px-3 py-1 rounded-full border border-indigo-500/30">
                Yearly Focus: <strong>{currentYearly ? planetName(currentYearly.dashaNumber) : 'N/A'}</strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      <Card>
        <div className="text-center mb-8">
          <SectionTitle>Timeline of Destiny</SectionTitle>
          <p className="text-yellow-200/70">Tap a major cycle to view its yearly phases. Expand the active year to see months (active year only).</p>
        </div>

        <div className="relative border-l-4 border-indigo-500/30 ml-4 md:ml-8 space-y-8">
          {hierarchy.map((maha, idx) => {
            const activeMaha = isCurrent(maha.startDate, maha.endDate);
            const isExpanded = expandedMahaIndex === idx;

            return (
              <div key={idx} className="relative pl-8">
                <div className={`absolute -left-[22px] top-0 w-10 h-10 rounded-full border-4 flex items-center justify-center bg-gray-900 z-10 transition-all duration-300 ${activeMaha ? 'border-yellow-400 scale-110 shadow-[0_0_15px_rgba(250,204,21,0.5)]' : 'border-gray-600'}`}>
                  <button onClick={() => handleMahaClick(idx)} aria-expanded={isExpanded} className="w-full h-full flex items-center justify-center focus:outline-none" title={`Open ${planetName(maha.dashaNumber)} period`}>
                    <span className={`text-lg font-bold ${activeMaha ? 'text-yellow-400' : 'text-gray-400'}`}>{planetName(maha.dashaNumber)}</span>
                  </button>
                </div>

                <div className={`p-6 rounded-xl border transition-all duration-300 ${activeMaha ? 'bg-indigo-900/40 border-yellow-500/50 shadow-lg' : 'bg-gray-800/40 border-gray-700 opacity-95'}`}>
                  <div className="flex flex-wrap justify-between items-center mb-4">
                    <div>
                      <h3 className={`text-2xl font-bold ${activeMaha ? 'text-white' : 'text-gray-300'}`}>{planetName(maha.dashaNumber)} Period</h3>
                      <p className="text-sm text-indigo-300 font-mono mt-1">{formatMonthYear(maha.startDate)} — {formatMonthYear(maha.endDate)}</p>
                    </div>

                    <div>
                      {activeMaha && <span className="px-3 py-1 bg-yellow-500 text-indigo-900 text-xs font-bold rounded-full animate-pulse">CURRENT PHASE</span>}
                      <button onClick={() => handleMahaClick(idx)} className="ml-4 px-3 py-1 border rounded text-xs text-indigo-200 border-indigo-400/30">
                        {isExpanded ? 'Collapse' : 'View Years'}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="space-y-3 mt-6">
                      {maha.subPeriods.length === 0 && <div className="text-sm text-gray-400">No yearly data available for this cycle.</div>}
                      {maha.subPeriods.map((yearDasha, yIdx) => {
                        const activeYear = isCurrent(yearDasha.startDate, yearDasha.endDate);
                        const showMonthly = activeMaha && expandedYearIndex === yIdx && activeYear;

                        const monthlySlicesForYear = activeYear && showMonthly
                          ? buildMonthlyDashaSlices(dashaReport.monthlyDashaTimeline, yearDasha.startDate, yearDasha.endDate)
                          : [];

                        return (
                          <div key={yIdx} className={`rounded-lg p-3 transition-all border ${activeYear ? 'bg-yellow-500/10 border-yellow-400' : 'bg-gray-900/30 border-gray-600'}`}>
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <div className="w-16 text-center">
                                  <div className="text-xs text-gray-400">Year</div>
                                  <div className={`font-bold ${activeYear ? 'text-yellow-400' : 'text-gray-300'}`}>{yearDasha.year}</div>
                                </div>

                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-400 text-xs uppercase">Annual</span>
                                    <span className={`text-xl font-bold ${activeYear ? 'text-green-400' : 'text-white'}`}>{planetName(yearDasha.dashaNumber)}</span>
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {(() => {
                                      if (typeof DATA === 'undefined' || !DATA.numberDetails?.[yearDasha.dashaNumber]?.coreVibration) return '';
                                      const cv = DATA.numberDetails[yearDasha.dashaNumber].coreVibration;
                                      // Handle multi-language object {en: "...", hi: "...", en-hi: "..."}
                                      if (typeof cv === 'object' && cv !== null) {
                                        const text = cv[language] || cv['en'] || cv['en-hi'] || '';
                                        return typeof text === 'string' ? text.toUpperCase() : '';
                                      }
                                      // Handle plain string
                                      return typeof cv === 'string' ? cv.toUpperCase() : '';
                                    })()}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="hidden sm:block text-xs text-gray-500 font-mono">
                                  {formatMonthYear(yearDasha.startDate)} <br /> to {formatMonthYear(yearDasha.endDate)}
                                </div>

                                <button onClick={() => handleYearClick(maha, yIdx, yearDasha)} className={`px-3 py-1 rounded text-xs font-medium ${activeYear ? 'bg-yellow-400 text-indigo-900' : 'bg-indigo-700 text-white'}`} title={activeYear ? 'Expand to view 9 monthly dashas (this year)' : 'Select / highlight year'}>
                                  {activeYear ? (expandedYearIndex === yIdx ? 'Hide Monthly Dashas' : 'View Monthly Dashas') : (expandedYearIndex === yIdx ? 'Hide' : 'Select')}
                                </button>
                              </div>
                            </div>

                            {showMonthly && monthlySlicesForYear.length > 0 && (
                              <div className="mt-4">
                                <div className="text-xs text-indigo-300 mb-2 text-center bg-indigo-900/30 p-2 rounded">
                                  9 Monthly Dashas (Pratyantara) - Each period varies from 8 to 74 days
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                  {monthlySlicesForYear.map((monthly, mi) => {
                                    const monthlyStart = toDate(monthly.startDate);
                                    const monthlyEnd = toDate(monthly.endDate);
                                    const isCurrentMonthly = isCurrent(monthlyStart, monthlyEnd);
                                    const durationDays = Math.ceil((monthlyEnd - monthlyStart) / (1000 * 60 * 60 * 24)) + 1;

                                    return (
                                      <div key={mi} className={`p-2 border rounded text-xs ${isCurrentMonthly ? 'bg-yellow-500/20 border-yellow-400' : 'bg-gray-800/30 border-gray-600'}`}>
                                        <div className="flex items-center justify-between mb-1">
                                          <span className={`font-bold text-lg ${isCurrentMonthly ? 'text-yellow-300' : 'text-white'}`}>{planetName(monthly.dashaNumber)}</span>
                                          <span className="text-gray-400">{durationDays}d</span>
                                        </div>
                                        <div className="text-gray-400">
                                          {formatMonthYear(monthlyStart)} <br />
                                          <span className="text-[10px]">to {formatMonthYear(monthlyEnd)}</span>
                                        </div>
                                        {isCurrentMonthly && (
                                          <div className="mt-1 text-yellow-400 font-bold text-[10px]">● ACTIVE NOW</div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

LifeCycleTab.propTypes = {
  report: PropTypes.object.isRequired,
  dashaReport: PropTypes.shape({
    mahaDashaTimeline: PropTypes.array,
    yearlyDashaTimeline: PropTypes.array,
  }),
  name: PropTypes.string,
  gender: PropTypes.string,
  language: PropTypes.string,
};

export default LifeCycleTab;
