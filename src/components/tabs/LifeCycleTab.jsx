// LifeCycleTabWithPlanets.jsx
import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Card from '../Card';
import SectionTitle from '../SectionTitle';
import { DATA } from '../../data/data';
import { checkAdvancedYoga, getText } from '../../utils/helpers';

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

/* -------------------- Dynamic Yoga Calculator -------------------- */

const calculateDynamicYogas = (baseKundliGrid, mahaNumber, yearlyNumber, language = 'en') => {
  // Create temporary grid by adding active dasha numbers
  const tempGrid = [...baseKundliGrid];
  if (mahaNumber) tempGrid[mahaNumber]++;
  if (yearlyNumber) tempGrid[yearlyNumber]++;

  // Check which yogas are formed with this temporary grid
  const formedYogas = [];
  Object.entries(DATA.yogaDetails).forEach(([yogaId, yoga]) => {
    let isPresent = false;
    if (yoga.activation_rules) {
      isPresent = checkAdvancedYoga(yoga.activation_rules, tempGrid);
    } else if (yoga.numbers && Array.isArray(yoga.numbers)) {
      isPresent = yoga.numbers.every(num => tempGrid[num] > 0);
      if (isPresent && yoga.empty && yoga.empty.length > 0) {
        if (yoga.empty.some(num => tempGrid[num] > 0)) {
          isPresent = false;
        }
      }
    }
    if (isPresent) {
      formedYogas.push({
        id: yogaId,
        name: getText(yoga.name, language),
        description: getText(yoga.description, language)
      });
    }
  });

  // Get combined dasha insight if both numbers present
  let combinedInsight = null;
  if (mahaNumber && yearlyNumber) {
    const key = `${Math.min(mahaNumber, yearlyNumber)}-${Math.max(mahaNumber, yearlyNumber)}`;
    if (DATA.combinedDashaInsights[key]) {
      combinedInsight = getText(DATA.combinedDashaInsights[key], language);
    }
  }

  return { formedYogas, combinedInsight, tempGrid };
};

/* -------------------- Prompt Generator (Planet-aware + Yoga-aware) -------------------- */

export const generateLifeCyclePrompt = (name, destinyNum, currentMaha, currentYearly, baseKundliGrid, language = 'en') => {
  if (!currentMaha) return null;

  const mahaNum = currentMaha.dashaNumber;
  const mahaPlanet = planetName(mahaNum);
  const mahaTrait = (typeof DATA !== 'undefined' && DATA.numberDetails?.[mahaNum]?.coreVibration) || 'Transformational';

  // Calculate dynamic yogas for this period
  const yearlyNum = currentYearly ? currentYearly.dashaNumber : null;
  const { formedYogas, combinedInsight } = calculateDynamicYogas(
    baseKundliGrid || [],
    mahaNum,
    yearlyNum,
    language
  );

  // Simple yoga list (names only, details shown in UI)
  const yogaNames = formedYogas.length > 0
    ? formedYogas.map(y => y.name).join(', ')
    : 'No significant yogas';

  // Build language instruction based on user's language preference
  let languageInstruction = '';
  if (language === 'hi') {
    languageInstruction = 'IMPORTANT: Respond in PURE HINDI (हिंदी) using Devanagari script. Do not mix English words.';
  } else if (language === 'en-hi') {
    languageInstruction = 'IMPORTANT: Respond in HINGLISH (Hindi-English mix). Use Roman script with Hindi and English words mixed naturally.';
  } else {
    languageInstruction = 'IMPORTANT: Respond in ENGLISH only.';
  }

  // If only Maha Dasha (no yearly selected) - generate Maha-only summary
  if (!currentYearly) {
    return `
Act as an expert Vedic Numerologist analyzing the life path for ${name} (Destiny Number: ${destinyNum}).

Context:
- Major cycle: ${mahaPlanet} period (Number ${mahaNum}) — ${mahaTrait} energy
- Active yogas: ${yogaNames}

Task:
Write a 2-sentence inspirational summary (40-50 words):
1. Describe the core theme and energy of this ${mahaPlanet} period
2. Give one specific, actionable piece of guidance for Destiny Number ${destinyNum}

Constraints:
- Maximum 50 words
- Tone: Empowering, warm, and grounded
- Avoid technical jargon—speak naturally
- ${languageInstruction}
`;
  }

  // If both Maha and Yearly - generate combined summary
  const yearlyPlanet = planetName(yearlyNum);
  const yearlyTrait = (typeof DATA !== 'undefined' && DATA.numberDetails?.[yearlyNum]?.coreVibration) || 'Active';

  return `
Act as an expert Vedic Numerologist analyzing the life path for ${name} (Destiny Number: ${destinyNum}).

Context:
- Major cycle: ${mahaPlanet} period (Number ${mahaNum}) — ${mahaTrait} energy
- This year's influence: ${yearlyPlanet} (Number ${yearlyNum}) — ${yearlyTrait} energy
${combinedInsight ? `- Combined energy: ${combinedInsight}` : ''}
- Active yogas: ${yogaNames}

Task:
Write a 2-sentence prediction for this year (40-50 words):
1. Describe how the ${yearlyPlanet} year energy blends with the ${mahaPlanet} period
2. Give one specific, actionable piece of advice for this year

Constraints:
- Maximum 50 words
- Tone: Empowering, warm, and grounded
- Avoid technical jargon—speak naturally
- Theme alignment: Number ${yearlyNum} → ${yearlyNum === 6 ? 'Relationships/Luxury' : yearlyNum === 5 ? 'Business/Change' : yearlyNum === 8 ? 'Hard Work/Career' : yearlyNum === 7 ? 'Introspection/Travel' : 'Growth'}
- ${languageInstruction}
`;
};

/* -------------------- Caching Hook (localStorage + Gemini placeholder) -------------------- */

export const useCachedLifeCycleNlg = (uniqueKey, prompt, shouldGenerate = false) => {
  const [text, setText] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (!uniqueKey || !prompt) {
      setText('');
      return;
    }

    // PRIORITY 1: Check localStorage (fastest)
    try {
      const cachedData = localStorage.getItem(uniqueKey);
      if (cachedData) {
        // Check if cached data is the error fallback message - if so, don't use it
        const isFallbackError = cachedData.includes('Please ensure backend server is running');
        if (isFallbackError) {
          console.warn('⚠️ Cached data is error fallback - clearing and refetching');
          localStorage.removeItem(uniqueKey);
          // Don't return - continue to API fetch
        } else {
          console.log('✅ Life Cycle NLG: Loaded from localStorage for key:', uniqueKey);
          setText(cachedData);
          return; // Stop here - no API call needed
        }
      }
    } catch (e) {
      // localStorage may be disabled — continue to fetch
      console.warn('localStorage unavailable', e);
    }

    // Only fetch from API if user has manually triggered generation
    if (!shouldGenerate) {
      setText('');
      return;
    }

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
        console.log("[Life Cycle] API Response:", JSON.stringify(result, null, 2));

        if (!response.ok) {
          const errorMsg = result.message || result.error || `API call failed with status: ${response.status}`;
          console.error("[Life Cycle] ❌ API Error:", errorMsg);
          console.error("[Life Cycle] Full error response:", result);
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
        console.error("[Life Cycle] ❌ API returned unexpected structure - no text field");
        throw new Error('NLG returned unexpected structure');
      } catch (e) {
        console.error('[Life Cycle] ❌ NLG Generation Error:', e.message);
        console.error('[Life Cycle] Full error:', e);

        // Better error handling with user-friendly messages
        let fallback = '';
        if (e.message.includes('No content generated from Gemini API')) {
          fallback = 'The AI service encountered a content filter. This may happen with certain name combinations or astrological patterns. Try refreshing the page or selecting a different year.';
        } else if (e.message.includes('Gemini API Error')) {
          fallback = `AI service error: ${e.message.replace('Gemini API Error:', '').trim()}. Please try again in a moment.`;
        } else if (e.message.includes('Failed to fetch') || e.message.includes('NetworkError')) {
          fallback = 'Unable to connect to backend server. Please check your internet connection.';
        } else if (e.message.includes('API key')) {
          fallback = 'Backend configuration error. Please contact support.';
        } else {
          fallback = `Unable to generate insight. ${e.message}. Please try again.`;
        }

        setText(fallback);
      } finally {
        setLoading(false);
      }
    };

    fetchNlg();
  }, [uniqueKey, prompt, shouldGenerate]);

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

/* -------------------- Year Summary Component (for inline year summaries) -------------------- */

const YearSummary = ({ maha, yearDasha, userName, destinyNumber, baseKundliGrid, dob, language }) => {
  const [shouldGenerate, setShouldGenerate] = useState(false);

  // Build unique cache key for this specific year
  const cacheKey = useMemo(() => {
    if (!userName || !dob || !maha || !yearDasha) return null;
    const dobStr = toDate(dob).toISOString().split('T')[0];
    return normalizeKey(`KarmAnk_LC_Year_${userName}_${dobStr}_${maha.dashaNumber}_${yearDasha.year}`);
  }, [userName, dob, maha, yearDasha]);

  // Generate prompt for this year
  const prompt = useMemo(() => {
    if (!maha || !yearDasha) return null;
    return generateLifeCyclePrompt(userName, destinyNumber, maha, yearDasha, baseKundliGrid, language);
  }, [userName, destinyNumber, maha, yearDasha, baseKundliGrid, language]);

  const { text: summary, loading } = useCachedLifeCycleNlg(cacheKey, prompt, shouldGenerate);

  // Auto-generate on mount
  useEffect(() => {
    if (cacheKey && prompt && !shouldGenerate) {
      setShouldGenerate(true);
    }
  }, [cacheKey, prompt]);

  if (!summary && !loading) return null;

  return (
    <div className="mt-3 bg-indigo-900/20 border-l-4 border-indigo-400 p-3 rounded print:mt-2 print:p-2 print:border-l-2 print:bg-gray-50 print:border-gray-400">
      {loading ? (
        <div className="flex items-center gap-2 text-indigo-300 text-xs print:hidden">
          <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-pulse" />
          <span>Generating year insight...</span>
        </div>
      ) : (
        <p className="text-sm text-indigo-200 leading-relaxed italic print:text-xs print:leading-snug print:text-gray-900">"{summary}"</p>
      )}
    </div>
  );
};

/* -------------------- LifeCycleTab Component -------------------- */

const LifeCycleTab = ({ report, dashaReport, name, gender, language = 'en' }) => {
  const [expandedMahaIndex, setExpandedMahaIndex] = useState(null);
  const [expandedYearIndex, setExpandedYearIndex] = useState(null);
  const [shouldGenerateNlg, setShouldGenerateNlg] = useState(false);
  const [selectedMaha, setSelectedMaha] = useState(null);
  const [selectedYearly, setSelectedYearly] = useState(null);
  const [expandedYearSummaries, setExpandedYearSummaries] = useState({}); // Track which year summaries are expanded

  // Show error message instead of blank screen when data is missing
  if (!report || !dashaReport) {
    return (
      <Card>
        <SectionTitle>Life Cycle Timeline</SectionTitle>
        <div className="text-center p-8 space-y-4">
          <div className="text-red-400 text-xl">⚠️ Timeline Data Missing</div>
          <p className="text-white/70">
            {!report && !dashaReport && 'Both numerology report and dasha data are missing.'}
            {!report && dashaReport && 'Numerology report is missing.'}
            {report && !dashaReport && 'Dasha timeline data is missing.'}
          </p>
          <p className="text-yellow-300 text-sm">Please regenerate your report or contact support if this issue persists.</p>
        </div>
      </Card>
    );
  }

  const dob = report.dob;
  const destinyNumber = report.destinyNumber;
  const userName = report.name || name;
  const baseKundliGrid = report.baseKundliGrid || [];

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

  // 2) Build cache key for selected dasha (or default to current)
  const uniqueCacheKey = useMemo(() => {
    const mahaToUse = selectedMaha || currentMaha;
    const yearlyToUse = selectedYearly || currentYearly;

    if (!userName || !dob || !mahaToUse) return null;
    const dobStr = toDate(dob).toISOString().split('T')[0];
    const yearKey = yearlyToUse ? yearlyToUse.year : 'maha_only';
    return normalizeKey(`KarmAnk_LC_${userName}_${dobStr}_${mahaToUse.dashaNumber}_${yearKey}`);
  }, [userName, dob, selectedMaha, selectedYearly, currentMaha, currentYearly]);

  // 3) Generate NLG prompt for selected maha/yearly (or current if none selected)
  const nlgPrompt = useMemo(() => {
    const mahaToUse = selectedMaha || currentMaha;
    const yearlyToUse = selectedYearly || currentYearly;

    if (!mahaToUse) return null;
    return generateLifeCyclePrompt(userName, destinyNumber, mahaToUse, yearlyToUse, baseKundliGrid, language);
  }, [userName, destinyNumber, selectedMaha, selectedYearly, currentMaha, currentYearly, baseKundliGrid, language]);

  const { text: aiSummary, loading } = useCachedLifeCycleNlg(uniqueCacheKey, nlgPrompt, shouldGenerateNlg);

  const isCurrent = (start, end) => {
    const now = new Date();
    const s = toDate(start);
    const e = toDate(end);
    if (!s || !e) return false;
    return now >= s && now <= e;
  };

  const handleMahaClick = (index, mahaObj) => {
    setExpandedYearIndex(null);
    const isExpanding = expandedMahaIndex !== index;
    setExpandedMahaIndex((prev) => (prev === index ? null : index));

    if (isExpanding) {
      setSelectedMaha(mahaObj);
      setSelectedYearly(null);
      // Reset and trigger new generation
      setShouldGenerateNlg(false);
      setTimeout(() => setShouldGenerateNlg(true), 10);
    }
  };

  const handleYearClick = (maha, yIndex, yearlyObj) => {
    const isExpanding = expandedYearIndex !== yIndex;
    setExpandedYearIndex((prev) => (prev === yIndex ? null : yIndex));

    if (isExpanding) {
      setSelectedMaha(maha);
      setSelectedYearly(yearlyObj);
      // Reset and trigger new generation
      setShouldGenerateNlg(false);
      setTimeout(() => setShouldGenerateNlg(true), 10);
    }
  };

  const toggleYearSummary = (mahaIdx, yearIdx) => {
    const key = `${mahaIdx}-${yearIdx}`;
    setExpandedYearSummaries((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-8 animate-fade-in print:space-y-4">
      {/* PAGE 1: AI Insight Card */}
      <div className="pdf-page-break-after space-y-6">
        {currentMaha && (
          <div className="bg-gradient-to-r from-indigo-900 to-purple-900 border border-indigo-400 p-6 rounded-xl shadow-lg relative overflow-hidden print:bg-white print:border-gray-400 print:p-4 print:page-break-inside-avoid">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none print:hidden">
            <span className="text-9xl font-serif text-white">{currentYearly ? planetLabel(currentYearly.dashaNumber) : planetLabel(currentMaha.dashaNumber)}</span>
          </div>

          <div className="relative z-10">
            <h3 className="text-xl font-bold text-yellow-400 mb-3 flex items-center gap-2 print:text-base print:mb-2 print:text-gray-900">
              <span className="text-2xl print:text-lg">✨</span>
              {selectedMaha || selectedYearly ? (
                selectedYearly ?
                  `${planetName(selectedMaha.dashaNumber)} Period - ${planetName(selectedYearly.dashaNumber)} Year`
                  : `${planetName(selectedMaha.dashaNumber)} Period Insight`
              ) : 'Current Life Phase Insight'}
            </h3>

            {loading ? (
              <div className="flex items-center gap-2 text-indigo-200 animate-pulse print:hidden">
                <div className="w-2 h-2 bg-indigo-200 rounded-full" />
                <span>Generating your personalized timeline narrative...</span>
              </div>
            ) : aiSummary ? (
              <div className="bg-black/20 p-4 rounded-lg border-l-4 border-yellow-400 print:bg-gray-50 print:border-gray-400 print:p-2 print:text-sm">
                <p className="text-lg text-indigo-50 leading-relaxed font-medium italic print:text-sm print:leading-snug print:text-gray-900">"{aiSummary}"</p>
              </div>
            ) : (
              <div className="bg-black/20 p-4 rounded-lg border-l-4 border-indigo-400 text-center print:hidden">
                <p className="text-indigo-200 mb-4">Click below to generate your personalized life phase insight using AI</p>
                <button
                  onClick={() => setShouldGenerateNlg(true)}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-indigo-900 font-bold rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 shadow-lg hover:shadow-yellow-500/50"
                >
                  ✨ Generate AI Insight
                </button>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-indigo-300/80 print:mt-2 print:gap-2 print:text-xs print:text-gray-700">
              <span className="bg-indigo-950/50 px-3 py-1 rounded-full border border-indigo-500/30 print:bg-gray-100 print:border-gray-300 print:px-2 print:py-0.5">
                Major Cycle: <strong>{planetName(currentMaha.dashaNumber)}</strong>
              </span>
              <span className="bg-indigo-950/50 px-3 py-1 rounded-full border border-indigo-500/30 print:bg-gray-100 print:border-gray-300 print:px-2 print:py-0.5">
                Yearly Focus: <strong>{currentYearly ? planetName(currentYearly.dashaNumber) : 'N/A'}</strong>
              </span>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* PAGE 2+: Timeline */}
      <div className="pdf-page-break-after">
        <Card className="print:page-break-inside-avoid print:bg-white print:border-gray-300">
        <div className="text-center mb-8 print:mb-4">
          <SectionTitle>Timeline of Destiny</SectionTitle>
          <p className="text-yellow-200/70 print:text-xs print:hidden">Tap a major cycle to view its yearly phases. Expand the active year to see months (active year only).</p>
        </div>

        <div className="relative border-l-4 border-indigo-500/30 ml-4 md:ml-8 space-y-8 print:ml-4 print:space-y-4 print:border-l-2 print:border-gray-300">
          {hierarchy.map((maha, idx) => {
            const activeMaha = isCurrent(maha.startDate, maha.endDate);
            const isExpanded = expandedMahaIndex === idx;

            return (
              <div key={idx} className="relative pl-8 print:pl-6 print:page-break-inside-avoid">
                <div className={`absolute -left-[22px] top-0 w-10 h-10 rounded-full border-4 flex items-center justify-center bg-gray-900 z-10 transition-all duration-300 print:w-8 print:h-8 print:-left-[18px] print:border-2 print:bg-white ${activeMaha ? 'border-yellow-400 scale-110 shadow-[0_0_15px_rgba(250,204,21,0.5)] print:scale-100 print:border-gray-900' : 'border-gray-600 print:border-gray-400'}`}>
                  <button onClick={() => handleMahaClick(idx, maha)} aria-expanded={isExpanded} className="w-full h-full flex items-center justify-center focus:outline-none print:cursor-default" title={`Open ${planetName(maha.dashaNumber)} period`}>
                    <span className={`text-lg font-bold print:text-sm ${activeMaha ? 'text-yellow-400 print:text-gray-900' : 'text-gray-400 print:text-gray-600'}`}>{planetName(maha.dashaNumber)}</span>
                  </button>
                </div>

                <div className={`p-6 rounded-xl border transition-all duration-300 print:p-3 print:bg-white print:border-gray-300 ${activeMaha ? 'bg-indigo-900/40 border-yellow-500/50 shadow-lg' : 'bg-gray-800/40 border-gray-700 opacity-95'}`}>
                  <div className="flex flex-wrap justify-between items-center mb-4 print:mb-2">
                    <div>
                      <h3 className={`text-2xl font-bold print:text-base print:text-gray-900 ${activeMaha ? 'text-white' : 'text-gray-300'}`}>{planetName(maha.dashaNumber)} Period</h3>
                      <p className="text-sm text-indigo-300 font-mono mt-1 print:text-xs print:mt-0.5 print:text-gray-600">{formatMonthYear(maha.startDate)} — {formatMonthYear(maha.endDate)}</p>
                    </div>

                    <div className="print:hidden">
                      {activeMaha && <span className="px-3 py-1 bg-yellow-500 text-indigo-900 text-xs font-bold rounded-full animate-pulse">CURRENT PHASE</span>}
                      <button onClick={() => handleMahaClick(idx, maha)} className="ml-4 px-3 py-1 border rounded text-xs text-indigo-200 border-indigo-400/30">
                        {isExpanded ? 'Collapse' : 'View Years'}
                      </button>
                    </div>
                    {activeMaha && <div className="hidden print:block"><span className="px-2 py-0.5 bg-yellow-500 text-indigo-900 text-[10px] font-bold rounded">CURRENT</span></div>}
                  </div>

                  {/* Show expanded content when isExpanded (hidden in print to avoid overlap) */}
                  {(isExpanded || true) && (
                    <div className={`space-y-3 mt-6 print:hidden ${!isExpanded ? 'hidden' : ''}`}>
                      {maha.subPeriods.length === 0 && <div className="text-sm text-gray-400 print:text-xs">No yearly data available for this cycle.</div>}
                      {maha.subPeriods.map((yearDasha, yIdx) => {
                        const activeYear = isCurrent(yearDasha.startDate, yearDasha.endDate);
                        const showMonthly = activeMaha && expandedYearIndex === yIdx && activeYear;
                        const summaryKey = `${idx}-${yIdx}`;
                        const showSummary = expandedYearSummaries[summaryKey];

                        const monthlySlicesForYear = activeYear && showMonthly
                          ? buildMonthlyDashaSlices(dashaReport.monthlyDashaTimeline, yearDasha.startDate, yearDasha.endDate)
                          : [];

                        return (
                          <div key={yIdx} className={`rounded-lg p-3 transition-all border print:p-2 print:bg-gray-50 print:border-gray-300 ${activeYear ? 'bg-yellow-500/10 border-yellow-400' : 'bg-gray-900/30 border-gray-600'}`}>
                            <div className="flex items-center justify-between gap-4 print:gap-2">
                              <div className="flex items-center gap-4 print:gap-2">
                                <div className="w-16 text-center print:w-12">
                                  <div className="text-xs text-gray-400 print:text-[10px] print:text-gray-600">Year</div>
                                  <div className={`font-bold print:text-sm print:text-gray-900 ${activeYear ? 'text-yellow-400' : 'text-gray-300'}`}>{yearDasha.year}</div>
                                </div>

                                <div>
                                  <div className="flex items-center gap-2 print:gap-1">
                                    <span className="text-gray-400 text-xs uppercase print:text-[10px] print:text-gray-600">Annual</span>
                                    <span className={`text-xl font-bold print:text-base print:text-gray-900 ${activeYear ? 'text-green-400' : 'text-white'}`}>{planetName(yearDasha.dashaNumber)}</span>
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1 print:text-[10px] print:mt-0.5 print:text-gray-600">
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

                              <div className="flex items-center gap-3 print:gap-1">
                                <div className="hidden sm:block text-xs text-gray-500 font-mono print:text-[10px] print:block print:text-gray-600">
                                  {formatMonthYear(yearDasha.startDate)} <br /> to {formatMonthYear(yearDasha.endDate)}
                                </div>

                                <button
                                  onClick={() => toggleYearSummary(idx, yIdx)}
                                  className="px-3 py-1 rounded text-xs font-medium bg-purple-600 text-white hover:bg-purple-500 transition-colors print:hidden"
                                  title="View AI summary for this year"
                                >
                                  {showSummary ? '✨ Hide Insight' : '✨ View Insight'}
                                </button>

                                {activeYear && (
                                  <button onClick={() => handleYearClick(maha, yIdx, yearDasha)} className="px-3 py-1 rounded text-xs font-medium bg-yellow-400 text-indigo-900 hover:bg-yellow-300 transition-colors print:hidden" title="Expand to view 9 monthly dashas (this year)">
                                    {expandedYearIndex === yIdx ? 'Hide Monthly' : 'Monthly View'}
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Year AI Summary */}
                            {showSummary && (
                              <YearSummary
                                maha={maha}
                                yearDasha={yearDasha}
                                userName={userName}
                                destinyNumber={destinyNumber}
                                baseKundliGrid={baseKundliGrid}
                                dob={dob}
                                language={language}
                              />
                            )}

                            {showMonthly && monthlySlicesForYear.length > 0 && (
                              <div className="mt-4 print:hidden">
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
