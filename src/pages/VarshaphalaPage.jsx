import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Sun, AlertCircle, RefreshCw, TrendingUp, User,
  MapPin, Clock, CheckCircle2, ExternalLink
} from "lucide-react";
import CosmicBackground from "../components/CosmicBackground";
import { useProfileBirthData } from "../hooks/useProfileBirthData";

const API_BASE = import.meta.env.VITE_ASTROLOGY_API_URL || "http://localhost:8000";

// ─── Constants ──────────────────────────────────────────────────────────────

const PLANET_COLORS = {
  Sun:     "amber",  Moon:    "slate",  Mars:    "red",
  Mercury: "emerald", Jupiter: "yellow", Venus:   "pink",
  Saturn:  "blue",   Rahu:    "purple", Ketu:    "orange",
};

const PLANET_SYMBOLS = {
  Sun: "☉", Moon: "☽", Mars: "♂", Mercury: "☿", Jupiter: "♃",
  Venus: "♀", Saturn: "♄", Rahu: "☊", Ketu: "☋",
};

const QUALITY_CONFIG = {
  excellent: { label: "Exceptional Year",  bg: "bg-emerald-500/10 border-emerald-400/30", text: "text-emerald-300", dot: "bg-emerald-400" },
  good:      { label: "Favourable Year",   bg: "bg-cyan-500/10 border-cyan-400/30",       text: "text-cyan-300",   dot: "bg-cyan-400" },
  moderate:  { label: "Mixed Year",        bg: "bg-amber-500/10 border-amber-400/30",     text: "text-amber-300",  dot: "bg-amber-400" },
  mixed:     { label: "Complex Year",      bg: "bg-violet-500/10 border-violet-400/30",   text: "text-violet-300", dot: "bg-violet-400" },
};

// ─── Profile Card ─────────────────────────────────────────────────────────────

function ProfileCard({ member, birthDataFormValue, isAstrologyReady, onGoToProfile }) {
  if (!member) {
    return (
      <div className="rounded-xl border border-amber-400/20 bg-amber-500/5 p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-400/20 flex items-center justify-center shrink-0">
          <User className="h-4 w-4 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-amber-300">No profile found</div>
          <div className="text-xs text-white/40 mt-0.5">Add your birth details for accurate calculations</div>
        </div>
        <button
          onClick={onGoToProfile}
          className="shrink-0 flex items-center gap-1 text-xs text-amber-300 border border-amber-400/30 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg transition"
        >
          Set Up <ExternalLink className="h-3 w-3" />
        </button>
      </div>
    );
  }

  const dob = birthDataFormValue?.birthDate
    ? birthDataFormValue.birthDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500/30 to-orange-600/30 border border-amber-400/30 flex items-center justify-center shrink-0">
        <span className="text-sm font-bold text-amber-300">
          {(member.name || "?").charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">{member.name}</span>
          {isAstrologyReady ? (
            <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
          ) : (
            <span className="text-[10px] bg-amber-500/15 border border-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded">Partial data</span>
          )}
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
          {dob && (
            <span className="text-xs text-white/40 flex items-center gap-1">
              <Sun className="h-2.5 w-2.5" />{dob}
            </span>
          )}
          {birthDataFormValue?.birthTime && birthDataFormValue.birthTime !== "12:00" && (
            <span className="text-xs text-white/40 flex items-center gap-1">
              <Clock className="h-2.5 w-2.5" />{birthDataFormValue.birthTime}
            </span>
          )}
          {birthDataFormValue?.birthLocation && (
            <span className="text-xs text-white/40 flex items-center gap-1 truncate max-w-[160px]">
              <MapPin className="h-2.5 w-2.5 shrink-0" />{birthDataFormValue.birthLocation}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={onGoToProfile}
        className="shrink-0 text-xs text-white/30 hover:text-white/60 transition"
        title="Update profile"
      >
        Edit
      </button>
    </div>
  );
}

// ─── Planet Chip ──────────────────────────────────────────────────────────────

function PlanetChip({ planet }) {
  const colorKey = PLANET_COLORS[planet.name] || "slate";
  const colorMap = {
    amber:   { bg: "bg-amber-500/10 border-amber-400/30", sym: "text-amber-400", sub: "text-amber-300/60" },
    slate:   { bg: "bg-slate-500/10 border-slate-400/30", sym: "text-slate-400", sub: "text-slate-300/60" },
    red:     { bg: "bg-red-500/10 border-red-400/30",     sym: "text-red-400",   sub: "text-red-300/60" },
    emerald: { bg: "bg-emerald-500/10 border-emerald-400/30", sym: "text-emerald-400", sub: "text-emerald-300/60" },
    yellow:  { bg: "bg-yellow-500/10 border-yellow-400/30",   sym: "text-yellow-400",  sub: "text-yellow-300/60" },
    pink:    { bg: "bg-pink-500/10 border-pink-400/30",   sym: "text-pink-400",   sub: "text-pink-300/60" },
    blue:    { bg: "bg-blue-500/10 border-blue-400/30",   sym: "text-blue-400",   sub: "text-blue-300/60" },
    purple:  { bg: "bg-purple-500/10 border-purple-400/30", sym: "text-purple-400", sub: "text-purple-300/60" },
    orange:  { bg: "bg-orange-500/10 border-orange-400/30", sym: "text-orange-400", sub: "text-orange-300/60" },
  };
  const c = colorMap[colorKey] || colorMap.slate;
  const sym = PLANET_SYMBOLS[planet.name] || "●";
  const deg = Math.floor(planet.degree_in_sign || 0);
  const min = Math.round(((planet.degree_in_sign || 0) % 1) * 60);

  return (
    <div className={`rounded-xl border p-3 flex flex-col gap-1.5 ${c.bg}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className={`text-lg leading-none ${c.sym}`}>{sym}</span>
          <span className="text-sm font-semibold text-white">{planet.name}</span>
          {planet.is_retrograde && (
            <span className="text-[9px] bg-orange-500/20 border border-orange-400/30 text-orange-300 px-1 rounded">℞</span>
          )}
        </div>
        <span className={`text-xs font-mono ${c.sub}`}>H{planet.house}</span>
      </div>
      <div className="text-xs text-white/50">{planet.sign}</div>
      <div className="text-[10px] text-white/30">{deg}°{min}' · {planet.nakshatra}</div>
    </div>
  );
}

// ─── House Wheel ──────────────────────────────────────────────────────────────

function HouseWheel({ planets }) {
  const houses = Array.from({ length: 12 }, (_, i) => ({
    num: i + 1,
    occupants: planets.filter(p => p.house === i + 1),
  }));

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
      {houses.map(h => (
        <div
          key={h.num}
          className={`rounded-lg border p-2 text-center min-h-[56px] flex flex-col items-center justify-start gap-1 ${
            h.occupants.length > 0 ? "border-white/20 bg-white/5" : "border-white/5 bg-transparent"
          }`}
        >
          <div className="text-[10px] text-white/30">H{h.num}</div>
          <div className="flex flex-wrap gap-0.5 justify-center">
            {h.occupants.map(p => (
              <span
                key={p.name}
                className="text-[11px] font-mono text-white/70"
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

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function VarshaphalaPage() {
  const navigate = useNavigate();
  const { member, birthDataFormValue, isAstrologyReady, loading: profileLoading } = useProfileBirthData();

  const currentYear = new Date().getFullYear();
  const [targetYear, setTargetYear] = useState(currentYear);
  const [result, setResult]         = useState(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);

  // Auto-calculate for current year once profile is ready
  useEffect(() => {
    if (isAstrologyReady && !result && !loading && !error) {
      handleCalculate();
    }
  // Only run once when profile becomes ready
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAstrologyReady]);

  async function handleCalculate() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const birthDt = birthDataFormValue?.birthDate
        ? birthDataFormValue.birthDate.toISOString().split("T")[0]
            + "T" + (birthDataFormValue.birthTime || "12:00") + ":00"
        : null;

      if (!birthDt) {
        setError("No birth date found. Please complete your profile.");
        return;
      }

      const res = await fetch(`${API_BASE}/api/varshaphala/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birth_datetime:  birthDt,
          birth_latitude:  birthDataFormValue?.latitude  || 28.6139,
          birth_longitude: birthDataFormValue?.longitude || 77.209,
          target_year:     targetYear,
          ayanamsa:        "LAHIRI",
          node_type:       "MEAN",
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Unknown error" }));
        throw new Error(err.detail || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(e.message || "Backend offline. Start the astrology backend and try again.");
    } finally {
      setLoading(false);
    }
  }

  const qCfg = result ? (QUALITY_CONFIG[result.quality] || QUALITY_CONFIG.moderate) : null;

  return (
    <CosmicBackground density={100} useVideo={true}>
      <div className="min-h-screen text-white relative z-10">
        <div className="max-w-4xl mx-auto px-4 pt-6 pb-12">

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
              The moment the Sun returns to its natal longitude begins your personal new year.
              The chart for that exact instant reveals the themes, challenges and blessings of the year ahead.
            </p>
          </motion.div>

          {/* Controls card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 mb-6 space-y-5"
          >
            {/* Profile selection */}
            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">Calculating for</label>
              {profileLoading ? (
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center gap-3 animate-pulse">
                  <div className="w-9 h-9 rounded-full bg-white/10" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-white/10 rounded w-32" />
                    <div className="h-2.5 bg-white/10 rounded w-48" />
                  </div>
                </div>
              ) : (
                <ProfileCard
                  member={member}
                  birthDataFormValue={birthDataFormValue}
                  isAstrologyReady={isAstrologyReady}
                  onGoToProfile={() => navigate("/profile")}
                />
              )}
            </div>

            {/* Year selector */}
            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest mb-3 block">Year</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setTargetYear(y => Math.max(currentYear - 10, y - 1))}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white/70 transition"
                >‹</button>
                <div className="flex-1 text-center">
                  <div className="text-3xl font-serif font-bold text-amber-300">{targetYear}</div>
                  <div className="text-xs text-white/30 mt-0.5">
                    {targetYear === currentYear ? "Current year"
                      : targetYear < currentYear ? `${currentYear - targetYear} year${currentYear - targetYear > 1 ? "s" : ""} ago`
                      : `${targetYear - currentYear} year${targetYear - currentYear > 1 ? "s" : ""} ahead`}
                  </div>
                </div>
                <button
                  onClick={() => setTargetYear(y => Math.min(currentYear + 10, y + 1))}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white/70 transition"
                >›</button>
              </div>
              {/* Quick year pills */}
              <div className="flex gap-2 mt-3 flex-wrap">
                {[currentYear - 1, currentYear, currentYear + 1, currentYear + 2].map(y => (
                  <button
                    key={y}
                    onClick={() => setTargetYear(y)}
                    className={`flex-1 min-w-[60px] py-1.5 rounded-lg border text-xs transition-all ${
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

            {/* Error */}
            {error && (
              <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-400/30 text-xs text-red-300 flex items-start gap-2">
                <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <button
              onClick={handleCalculate}
              disabled={loading || profileLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><RefreshCw className="h-4 w-4 animate-spin" /> Locating solar return…</>
              ) : (
                <><Sun className="h-4 w-4" /> Calculate {targetYear} Varshaphala</>
              )}
            </button>
          </motion.div>

          {/* ── Results ── */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-5"
            >
              {/* Solar return moment */}
              <div className="rounded-2xl border border-amber-400/20 bg-amber-500/5 p-5">
                <div className="text-xs text-amber-400/60 uppercase tracking-widest mb-2">Solar Return Moment — {targetYear}</div>
                <div className="text-lg font-semibold text-amber-200">{result.solar_return_local_approx}</div>
                <div className="text-xs text-white/25 mt-0.5">UTC: {result.solar_return_utc}</div>
                <div className="flex flex-wrap gap-5 mt-4">
                  <div>
                    <div className="text-[10px] text-white/30 uppercase tracking-widest mb-0.5">Natal Sun</div>
                    <div className="text-sm text-white/70 font-mono">{result.natal_sun_longitude?.toFixed(2)}°</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/30 uppercase tracking-widest mb-0.5">SR Lagna</div>
                    <div className="text-sm text-amber-300 font-semibold">{result.lagna} {result.lagna_degree?.toFixed(1)}°</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/30 uppercase tracking-widest mb-0.5">Year Lord</div>
                    <div className="text-sm text-cyan-300 font-semibold">{result.year_lord}</div>
                  </div>
                  {member?.name && (
                    <div>
                      <div className="text-[10px] text-white/30 uppercase tracking-widest mb-0.5">For</div>
                      <div className="text-sm text-white/70">{member.name}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Year quality + themes */}
              <div className={`rounded-2xl border p-5 ${qCfg?.bg || ""}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${qCfg?.dot}`} />
                  <span className={`text-xs uppercase tracking-widest font-semibold ${qCfg?.text}`}>
                    {qCfg?.label}
                  </span>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">{result.year_message}</p>
                {result.year_themes?.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {result.year_themes.map((t, i) => (
                      <li key={i} className="text-xs text-white/50 flex items-start gap-2">
                        <TrendingUp className={`h-3 w-3 shrink-0 mt-0.5 ${qCfg?.text}`} />
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
                {result.strong_planets?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    <span className="text-[10px] text-white/30 mr-1 self-center">Strong planets:</span>
                    {result.strong_planets.map(p => (
                      <span key={p} className="text-[10px] bg-white/10 border border-white/20 text-white/60 px-2 py-0.5 rounded-full">
                        {PLANET_SYMBOLS[p] || ""} {p}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bhava chart */}
              <div>
                <h3 className="text-xs text-white/40 uppercase tracking-widest mb-3">
                  Bhava Chart — Whole Sign Houses
                </h3>
                <HouseWheel planets={result.planets || []} />
              </div>

              {/* Planet grid */}
              <div>
                <h3 className="text-xs text-white/40 uppercase tracking-widest mb-3">
                  Graha Positions
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {(result.planets || []).map(p => (
                    <PlanetChip key={p.name} planet={p} />
                  ))}
                </div>
              </div>

              {/* Recalculate for different year hint */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-white/25">
                <span>{result.calculation_note}</span>
                <button
                  onClick={() => { setResult(null); setError(null); }}
                  className="text-white/40 hover:text-white/70 transition"
                >
                  Change year ›
                </button>
              </div>
            </motion.div>
          )}

          {/* Empty state */}
          {!result && !loading && !error && (
            <div className="text-center py-16 text-white/20 text-sm">
              {profileLoading ? "Loading profile…" : "Select a year and calculate your solar return chart above."}
            </div>
          )}
        </div>
      </div>
    </CosmicBackground>
  );
}
