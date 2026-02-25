import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Sun, Star, Sparkles, AlertCircle,
  RefreshCw, TrendingUp, Calendar, RotateCcw
} from "lucide-react";
import CosmicBackground from "../components/CosmicBackground";
import { useProfileBirthData } from "../hooks/useProfileBirthData";

const API_BASE = import.meta.env.VITE_ASTROLOGY_API_URL || "http://localhost:8000";

// ─── Constants ──────────────────────────────────────────────────────────────

const ZODIAC_SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
];
const SIGN_SYMBOLS = ["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"];

const PLANET_COLORS = {
  Sun:     "amber",  Moon:    "slate",  Mars:    "red",
  Mercury: "emerald", Jupiter: "yellow", Venus:   "pink",
  Saturn:  "blue",  Rahu:    "purple", Ketu:    "orange",
};

const PLANET_SYMBOLS = {
  Sun: "☉", Moon: "☽", Mars: "♂", Mercury: "☿", Jupiter: "♃",
  Venus: "♀", Saturn: "♄", Rahu: "☊", Ketu: "☋",
};

const QUALITY_CONFIG = {
  excellent: { label: "Exceptional Year",  color: "emerald", bg: "bg-emerald-500/10 border-emerald-400/30", text: "text-emerald-300" },
  good:      { label: "Favourable Year",   color: "cyan",    bg: "bg-cyan-500/10 border-cyan-400/30",       text: "text-cyan-300" },
  moderate:  { label: "Mixed Year",        color: "amber",   bg: "bg-amber-500/10 border-amber-400/30",     text: "text-amber-300" },
  mixed:     { label: "Complex Year",      color: "violet",  bg: "bg-violet-500/10 border-violet-400/30",   text: "text-violet-300" },
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function PlanetChip({ planet }) {
  const colorKey = PLANET_COLORS[planet.name] || "slate";
  const colorMap = {
    amber:   { bg: "bg-amber-500/10 border-amber-400/30", text: "text-amber-300", sym: "text-amber-400" },
    slate:   { bg: "bg-slate-500/10 border-slate-400/30", text: "text-slate-300", sym: "text-slate-400" },
    red:     { bg: "bg-red-500/10 border-red-400/30",     text: "text-red-300",   sym: "text-red-400" },
    emerald: { bg: "bg-emerald-500/10 border-emerald-400/30", text: "text-emerald-300", sym: "text-emerald-400" },
    yellow:  { bg: "bg-yellow-500/10 border-yellow-400/30", text: "text-yellow-300",  sym: "text-yellow-400" },
    pink:    { bg: "bg-pink-500/10 border-pink-400/30",   text: "text-pink-300",   sym: "text-pink-400" },
    blue:    { bg: "bg-blue-500/10 border-blue-400/30",   text: "text-blue-300",   sym: "text-blue-400" },
    purple:  { bg: "bg-purple-500/10 border-purple-400/30", text: "text-purple-300", sym: "text-purple-400" },
    orange:  { bg: "bg-orange-500/10 border-orange-400/30", text: "text-orange-300", sym: "text-orange-400" },
  };
  const c = colorMap[colorKey] || colorMap.slate;
  const sym = PLANET_SYMBOLS[planet.name] || "●";
  const deg = Math.floor(planet.degree_in_sign || 0);
  const min = Math.round(((planet.degree_in_sign || 0) % 1) * 60);

  return (
    <div className={`rounded-xl border p-3 flex flex-col gap-1.5 ${c.bg}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className={`text-lg ${c.sym}`}>{sym}</span>
          <span className="text-sm font-semibold text-white">{planet.name}</span>
          {planet.is_retrograde && (
            <span className="text-[9px] bg-orange-500/20 border border-orange-400/30 text-orange-300 px-1 rounded">℞</span>
          )}
        </div>
        <span className={`text-xs font-mono ${c.text}`}>H{planet.house}</span>
      </div>
      <div className="text-xs text-white/50">{planet.sign}</div>
      <div className="text-[10px] text-white/30">{deg}°{min}' · {planet.nakshatra}</div>
    </div>
  );
}

function HouseWheel({ planets }) {
  // Simple text-based house summary; each house with its occupants
  const houses = Array.from({ length: 12 }, (_, i) => ({
    num: i + 1,
    planets: planets.filter(p => p.house === i + 1),
  }));

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
      {houses.map(h => (
        <div
          key={h.num}
          className={`rounded-lg border p-2 text-center min-h-[56px] flex flex-col items-center justify-start gap-1 ${
            h.planets.length > 0 ? "border-white/20 bg-white/5" : "border-white/5 bg-transparent"
          }`}
        >
          <div className="text-[10px] text-white/30">H{h.num}</div>
          <div className="flex flex-wrap gap-0.5 justify-center">
            {h.planets.map(p => (
              <span
                key={p.name}
                className="text-[10px] font-mono text-white/70"
                title={`${p.name} ${Math.floor(p.degree_in_sign || 0)}°`}
              >
                {PLANET_SYMBOLS[p.name] || p.name.slice(0, 2)}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function VarshaphalaPage() {
  const navigate = useNavigate();
  const { birthDataFormValue, isAstrologyReady } = useProfileBirthData();

  const currentYear = new Date().getFullYear();
  const [targetYear, setTargetYear] = useState(currentYear);
  const [result, setResult]         = useState(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);

  async function handleCalculate() {
    if (!birthDataFormValue) {
      setError("Please complete your birth profile first (Profile → Edit).");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/varshaphala/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birth_datetime: birthDataFormValue.birthDate.toISOString().split("T")[0]
            + "T" + (birthDataFormValue.birthTime || "12:00") + ":00",
          birth_latitude:  birthDataFormValue.latitude  || 28.6139,
          birth_longitude: birthDataFormValue.longitude || 77.209,
          target_year: targetYear,
          ayanamsa: "LAHIRI",
          node_type: "MEAN",
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Unknown error" }));
        throw new Error(err.detail || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(e.message || "Failed to calculate Varshaphala. Check backend connection.");
    } finally {
      setLoading(false);
    }
  }

  const qCfg = result ? (QUALITY_CONFIG[result.quality] || QUALITY_CONFIG.moderate) : null;

  return (
    <CosmicBackground density={100} useVideo={true}>
      <div className="min-h-screen text-white relative z-10">
        <div className="max-w-4xl mx-auto px-4 pt-6">
          {/* Back */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => navigate("/astrology")}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 px-4 py-2 rounded-md text-sm transition duration-200 mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </motion.button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/15 border border-amber-500/30 rounded-full text-xs text-amber-300 mb-4">
              <Sun className="h-3 w-3" /> Varshaphala — Solar Return
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400">
                Annual Horoscope
              </span>
            </h1>
            <p className="text-white/50 max-w-xl mx-auto text-sm">
              The moment the Sun returns to its natal longitude begins your personal new year. The chart for that exact instant reveals the themes, challenges and blessings of the year ahead.
            </p>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 mb-6"
          >
            {/* Year selector */}
            <div className="mb-5">
              <label className="text-xs text-white/50 uppercase tracking-widest mb-3 block">Select Year</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setTargetYear(y => Math.max(currentYear - 5, y - 1))}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white/70 transition"
                >‹</button>
                <div className="flex-1 text-center">
                  <div className="text-3xl font-serif font-bold text-amber-300">{targetYear}</div>
                  {targetYear === currentYear && (
                    <div className="text-xs text-white/30 mt-0.5">Current year</div>
                  )}
                  {targetYear === currentYear + 1 && (
                    <div className="text-xs text-white/30 mt-0.5">Next year</div>
                  )}
                </div>
                <button
                  onClick={() => setTargetYear(y => Math.min(currentYear + 5, y + 1))}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white/70 transition"
                >›</button>
              </div>
              {/* Quick buttons */}
              <div className="flex gap-2 mt-3">
                {[currentYear, currentYear + 1, currentYear + 2].map(y => (
                  <button
                    key={y}
                    onClick={() => setTargetYear(y)}
                    className={`flex-1 py-1.5 rounded-lg border text-xs transition-all ${
                      targetYear === y
                        ? "bg-amber-500/20 border-amber-400/50 text-amber-300"
                        : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>

            {/* Profile notice */}
            {!isAstrologyReady && (
              <div className="mb-4 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-400/30 text-xs text-amber-300 flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                No birth profile found. Using New Delhi defaults. Complete your profile for accurate results.
              </div>
            )}

            {error && (
              <div className="mb-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-400/30 text-xs text-red-300 flex items-start gap-2">
                <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <button
              onClick={handleCalculate}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><RefreshCw className="h-4 w-4 animate-spin" /> Locating solar return moment…</>
              ) : (
                <><Sun className="h-4 w-4" /> Calculate {targetYear} Varshaphala</>
              )}
            </button>
          </motion.div>

          {/* Results */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-5"
            >
              {/* Solar Return Moment */}
              <div className="rounded-2xl border border-amber-400/20 bg-amber-500/5 p-5">
                <div className="text-xs text-amber-400/70 uppercase tracking-widest mb-2">Solar Return Moment</div>
                <div className="text-lg font-semibold text-amber-200">{result.solar_return_local_approx}</div>
                <div className="text-xs text-white/30 mt-0.5">UTC: {result.solar_return_utc}</div>
                <div className="flex flex-wrap gap-4 mt-3 text-sm">
                  <div>
                    <div className="text-xs text-white/30">Natal Sun</div>
                    <div className="text-white/70 font-mono">{result.natal_sun_longitude?.toFixed(2)}°</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/30">Lagna (Ascendant)</div>
                    <div className="text-amber-300 font-semibold">{result.lagna} {result.lagna_degree?.toFixed(1)}°</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/30">Year Lord</div>
                    <div className="text-cyan-300 font-semibold">{result.year_lord}</div>
                  </div>
                </div>
              </div>

              {/* Year Quality */}
              <div className={`rounded-2xl border p-5 ${qCfg?.bg || ""}`}>
                <div className={`text-xs uppercase tracking-widest mb-2 ${qCfg?.text}`}>{qCfg?.label}</div>
                <p className="text-sm text-white/70 leading-relaxed">{result.year_message}</p>
                {result.year_themes?.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {result.year_themes.map((t, i) => (
                      <li key={i} className="text-xs text-white/50 flex items-start gap-1.5">
                        <TrendingUp className={`h-3 w-3 shrink-0 mt-0.5 ${qCfg?.text}`} />
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
                {result.strong_planets?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {result.strong_planets.map(p => (
                      <span key={p} className="text-[10px] bg-white/10 border border-white/20 text-white/60 px-2 py-0.5 rounded-full">
                        {PLANET_SYMBOLS[p] || ""} {p}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* House Wheel */}
              <div>
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-3">
                  Bhava Chart (Whole-Sign Houses)
                </h3>
                <HouseWheel planets={result.planets || []} />
              </div>

              {/* Planet Grid */}
              <div>
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-3">
                  Graha Positions
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {(result.planets || []).map(p => (
                    <PlanetChip key={p.name} planet={p} />
                  ))}
                </div>
              </div>

              {/* Calculation note */}
              <div className="text-xs text-white/20 text-center pb-6">
                {result.calculation_note}
              </div>
            </motion.div>
          )}

          {!result && !loading && (
            <div className="text-center py-16 text-white/20 text-sm">
              Select a year and calculate your solar return chart above.
            </div>
          )}
        </div>
      </div>
    </CosmicBackground>
  );
}
