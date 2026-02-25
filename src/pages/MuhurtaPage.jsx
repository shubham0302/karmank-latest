import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Calendar, Sparkles, AlertCircle,
  CheckCircle2, Clock, RefreshCw, Sun, User, MapPin, ExternalLink
} from "lucide-react";
import CosmicBackground from "../components/CosmicBackground";
import { useProfileBirthData } from "../hooks/useProfileBirthData";

const API_BASE = import.meta.env.VITE_ASTROLOGY_API_URL || "http://localhost:8000";

// ─── Constants ──────────────────────────────────────────────────────────────

const EVENT_TYPES = [
  { id: "marriage",   label: "Marriage",      icon: "💍", desc: "Vivah muhurta — auspicious for weddings & engagements" },
  { id: "business",   label: "Business",      icon: "💼", desc: "New ventures, partnerships, signings & launches" },
  { id: "property",   label: "Property",      icon: "🏠", desc: "Purchase, registration or possession of property" },
  { id: "education",  label: "Education",     icon: "📚", desc: "Vidyarambha — new courses, exams, admissions" },
  { id: "travel",     label: "Travel",        icon: "✈️", desc: "Yatra muhurta — journey beginnings & relocation" },
  { id: "surgery",    label: "Surgery",       icon: "🏥", desc: "Medical procedures & operations" },
  { id: "general",    label: "General",       icon: "⭐", desc: "Any important new beginning or auspicious activity" },
];

const QUALITY_CONFIG = {
  excellent: { color: "emerald", label: "Excellent", bar: "bg-emerald-400", bg: "bg-emerald-500/10 border-emerald-400/30", text: "text-emerald-300" },
  good:      { color: "cyan",    label: "Good",      bar: "bg-cyan-400",    bg: "bg-cyan-500/10 border-cyan-400/30",    text: "text-cyan-300" },
  moderate:  { color: "amber",   label: "Moderate",  bar: "bg-amber-400",   bg: "bg-amber-500/10 border-amber-400/30",  text: "text-amber-300" },
  avoid:     { color: "red",     label: "Avoid",     bar: "bg-red-400",     bg: "bg-red-500/10 border-red-400/30",      text: "text-red-300" },
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function ScoreBar({ score }) {
  const pct = Math.round((score / 100) * 100);
  const q = score >= 75 ? "excellent" : score >= 55 ? "good" : score >= 35 ? "moderate" : "avoid";
  const cfg = QUALITY_CONFIG[q];
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1">
        <span className={cfg.text + " font-semibold"}>{cfg.label}</span>
        <span className="text-white/50">{score}/100</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10">
        <div className={`h-full rounded-full ${cfg.bar}`} style={{ width: `${pct}%`, transition: "width 0.8s ease" }} />
      </div>
    </div>
  );
}

function DayCard({ day, rank }) {
  const q = day.quality;
  const cfg = QUALITY_CONFIG[q] || QUALITY_CONFIG.moderate;
  const [expanded, setExpanded] = useState(false);

  const dateObj = new Date(day.date + "T12:00:00");
  const formatted = dateObj.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  if (q === "avoid" && rank > 5) return null; // hide avoid days beyond top 5

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.05 }}
      className={`rounded-xl border p-4 cursor-pointer transition-all ${cfg.bg}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center gap-3">
        {/* Rank badge */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${rank === 1 ? "bg-amber-400 text-black" : rank === 2 ? "bg-slate-300 text-black" : rank === 3 ? "bg-amber-700 text-white" : "bg-white/10 text-white/60"}`}>
          {rank}
        </div>

        {/* Date */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white truncate">{formatted}</div>
          <div className="text-xs text-white/40 mt-0.5">
            {day.tithi_name} · {day.nakshatra} · {day.moon_phase}
          </div>
        </div>

        {/* Score bar */}
        <div className="w-28 shrink-0">
          <ScoreBar score={day.score} />
        </div>

        {/* Arrow */}
        <div className={`text-white/30 transition-transform ${expanded ? "rotate-90" : ""}`}>›</div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
          {day.reasons?.length > 0 && (
            <div>
              <div className="text-xs text-emerald-400 font-semibold mb-1.5 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Why it's good
              </div>
              <ul className="space-y-1">
                {day.reasons.map((r, i) => (
                  <li key={i} className="text-xs text-white/60 flex items-start gap-1.5">
                    <span className="text-emerald-400/70 mt-0.5">•</span>{r}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {day.avoid_reasons?.length > 0 && (
            <div>
              <div className="text-xs text-red-400 font-semibold mb-1.5 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> Points of caution
              </div>
              <ul className="space-y-1">
                {day.avoid_reasons.map((r, i) => (
                  <li key={i} className="text-xs text-white/60 flex items-start gap-1.5">
                    <span className="text-red-400/70 mt-0.5">•</span>{r}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {day.retrograde_alerts?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {day.retrograde_alerts.map((a, i) => (
                <span key={i} className="text-[10px] bg-orange-500/15 border border-orange-400/30 text-orange-300 px-2 py-0.5 rounded-full">
                  ℞ {a}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

// ─── Profile Card ─────────────────────────────────────────────────────────────

function ProfileCard({ member, birthDataFormValue, isAstrologyReady, onGoToProfile }) {
  if (!member) {
    return (
      <div className="rounded-xl border border-amber-400/20 bg-amber-500/5 p-3.5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-400/20 flex items-center justify-center shrink-0">
          <User className="h-3.5 w-3.5 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-amber-300">No profile found</div>
          <div className="text-[11px] text-white/40 mt-0.5">Add your birth details for personalised muhurta</div>
        </div>
        <button
          onClick={onGoToProfile}
          className="shrink-0 flex items-center gap-1 text-xs text-amber-300 border border-amber-400/30 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-lg transition"
        >
          Set Up <ExternalLink className="h-3 w-3" />
        </button>
      </div>
    );
  }

  const dob = birthDataFormValue?.birthDate
    ? birthDataFormValue.birthDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : null;

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-cyan-400/30 flex items-center justify-center shrink-0">
        <span className="text-xs font-bold text-cyan-300">
          {(member.name || "?").charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-white">{member.name}</span>
          {isAstrologyReady && <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />}
        </div>
        <div className="flex flex-wrap gap-x-3 mt-0.5">
          {dob && <span className="text-[11px] text-white/40 flex items-center gap-1"><Sun className="h-2.5 w-2.5" />{dob}</span>}
          {birthDataFormValue?.birthLocation && (
            <span className="text-[11px] text-white/40 flex items-center gap-1 truncate max-w-[140px]">
              <MapPin className="h-2.5 w-2.5 shrink-0" />{birthDataFormValue.birthLocation}
            </span>
          )}
        </div>
      </div>
      <button onClick={onGoToProfile} className="shrink-0 text-[11px] text-white/30 hover:text-white/60 transition">Edit</button>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function MuhurtaPage() {
  const navigate = useNavigate();
  const { member, birthDataFormValue, isAstrologyReady, loading: profileLoading } = useProfileBirthData();

  const today = new Date().toISOString().split("T")[0];
  const inThreeMonths = new Date(Date.now() + 88 * 86400_000).toISOString().split("T")[0];

  const [eventType, setEventType] = useState("general");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate]     = useState(inThreeMonths);
  const [results, setResults]     = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  const selectedEvent = EVENT_TYPES.find(e => e.id === eventType) || EVENT_TYPES[0];

  async function handleFetch() {
    if (!birthDataFormValue) {
      setError("Please complete your birth profile first (Profile → Edit).");
      return;
    }
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const res = await fetch(`${API_BASE}/api/muhurta/find-best-times`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birth_datetime: birthDataFormValue.birthDate.toISOString().split("T")[0] + "T" + (birthDataFormValue.birthTime || "12:00") + ":00",
          latitude:   birthDataFormValue.latitude  || 28.6139,
          longitude:  birthDataFormValue.longitude || 77.209,
          event_type: eventType,
          start_date: startDate,
          end_date:   endDate,
          timezone:   birthDataFormValue.timezone || "Asia/Kolkata",
          top_n:      15,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Unknown error" }));
        throw new Error(err.detail || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setResults(data);
    } catch (e) {
      setError(e.message || "Failed to calculate muhurta. Check backend connection.");
    } finally {
      setLoading(false);
    }
  }

  const goodDays = results?.best_windows?.filter(d => d.quality !== "avoid") || [];
  const avoidDays = results?.best_windows?.filter(d => d.quality === "avoid") || [];

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
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/15 border border-cyan-500/30 rounded-full text-xs text-cyan-300 mb-4">
              <Sparkles className="h-3 w-3" /> Muhurta Engine
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500">
                Auspicious Timing
              </span>
            </h1>
            <p className="text-white/50 max-w-xl mx-auto text-sm">
              Classical Vedic muhurta — find the best days for marriage, business, property, travel and more using Tithi, Nakshatra, Vara and planetary analysis.
            </p>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 mb-6"
          >
            {/* Profile card */}
            <div className="mb-5">
              <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">Calculating for</label>
              {profileLoading ? (
                <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 flex items-center gap-3 animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-white/10" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-2.5 bg-white/10 rounded w-28" />
                    <div className="h-2 bg-white/10 rounded w-40" />
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

            {/* Event Type Grid */}
            <div className="mb-5">
              <label className="text-xs text-white/50 uppercase tracking-widest mb-3 block">Event Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {EVENT_TYPES.map(ev => (
                  <button
                    key={ev.id}
                    onClick={() => setEventType(ev.id)}
                    className={`p-2.5 rounded-lg border text-xs text-left transition-all ${
                      eventType === ev.id
                        ? "bg-cyan-500/20 border-cyan-400/50 text-cyan-300"
                        : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
                    }`}
                  >
                    <div className="text-base mb-0.5">{ev.icon}</div>
                    <div className="font-semibold">{ev.label}</div>
                  </button>
                ))}
              </div>
              {selectedEvent && (
                <p className="text-xs text-white/40 mt-2">{selectedEvent.desc}</p>
              )}
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="text-xs text-white/50 uppercase tracking-widest mb-1.5 block">Search From</label>
                <input
                  type="date"
                  value={startDate}
                  min={today}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400/50"
                />
              </div>
              <div>
                <label className="text-xs text-white/50 uppercase tracking-widest mb-1.5 block">Search Until (max 90 days)</label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400/50"
                />
              </div>
            </div>

            {error && (
              <div className="mb-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-400/30 text-xs text-red-300 flex items-start gap-2">
                <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <button
              onClick={handleFetch}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><RefreshCw className="h-4 w-4 animate-spin" /> Scanning planetary windows…</>
              ) : (
                <><Calendar className="h-4 w-4" /> Find Auspicious Dates</>
              )}
            </button>
          </motion.div>

          {/* Results */}
          {results && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {/* Summary strip */}
              <div className="flex flex-wrap gap-3 text-xs text-white/40 px-1">
                <span>{results.total_days_scanned} days scanned</span>
                <span>·</span>
                <span>{goodDays.length} auspicious windows found</span>
                <span>·</span>
                <span className="text-cyan-400/70">{results.event_type} muhurta</span>
                <span className="ml-auto text-white/20">{results.calculation_note}</span>
              </div>

              {/* Best days */}
              {goodDays.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-sm font-semibold text-white/70 uppercase tracking-widest px-1">
                    Best Auspicious Days
                  </h2>
                  {goodDays.map((day, i) => (
                    <DayCard key={day.date} day={day} rank={i + 1} />
                  ))}
                </div>
              )}

              {goodDays.length === 0 && (
                <div className="text-center py-12 text-white/30 text-sm">
                  No highly auspicious days found in this range. Try extending the date window.
                </div>
              )}

              {/* Quality legend */}
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-white/30 mb-3">Score legend</p>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(QUALITY_CONFIG).map(([k, cfg]) => (
                    <div key={k} className="flex items-center gap-1.5 text-xs text-white/50">
                      <div className={`w-2 h-2 rounded-full ${cfg.bar}`} />
                      <span>{cfg.label} ({k === "excellent" ? "75+" : k === "good" ? "55-74" : k === "moderate" ? "35-54" : "<35"})</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Footer */}
          <div className="mt-10 pb-8 text-center text-xs text-white/20">
            Muhurta calculations use Swiss Ephemeris · Lahiri Ayanamsa · Classical Tithi-Nakshatra-Vara rules
          </div>
        </div>
      </div>
    </CosmicBackground>
  );
}
