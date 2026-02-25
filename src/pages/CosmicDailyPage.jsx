import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Zap, RefreshCw, ExternalLink, Music, Calendar } from "lucide-react";
import CosmicBackground from "../components/CosmicBackground";
import { useProfileBirthData } from "../hooks/useProfileBirthData";
import { localCache } from "../hooks/useLocalCache";
import {
  calculateCosmicReport,
  getMoonPhaseFraction,
  getMoonPhaseLabel,
} from "../services/cosmicScoreService";

// ─── Score Ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const pct = score / 10;
  const dash = circ * pct;

  const color =
    score >= 7.5 ? "#22d3ee"   // cyan  — excellent
    : score >= 6  ? "#a78bfa"   // violet — good
    : score >= 4.5 ? "#fbbf24"  // amber  — moderate
    : "#f87171";                // red    — challenging

  return (
    <svg width="140" height="140" className="drop-shadow-[0_0_18px_rgba(34,211,238,0.4)]">
      {/* Track */}
      <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
      {/* Progress */}
      <circle
        cx="70" cy="70" r={r}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset={circ * 0.25}
        style={{ transition: "stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)" }}
      />
      {/* Score text */}
      <text x="70" y="65" textAnchor="middle" fill="white" fontSize="28" fontWeight="bold" fontFamily="serif">
        {score.toFixed(1)}
      </text>
      <text x="70" y="84" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10" letterSpacing="2">
        OUT OF 10
      </text>
    </svg>
  );
}

// ─── Animated waveform ────────────────────────────────────────────────────────
function WaveformBar({ score, color }) {
  const bars = 24;
  return (
    <div className="flex items-end gap-[2px] h-8">
      {Array.from({ length: bars }).map((_, i) => {
        const base = (Math.sin(i * 0.7) * 0.5 + 0.5) * score / 10;
        const h = Math.max(4, Math.round(base * 28));
        return (
          <motion.div
            key={i}
            className="w-[3px] rounded-full"
            style={{ backgroundColor: color, opacity: 0.7 + (i % 3) * 0.1 }}
            initial={{ height: 4 }}
            animate={{ height: h }}
            transition={{ duration: 0.8, delay: i * 0.03, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

// ─── Domain Card ──────────────────────────────────────────────────────────────
const DOMAIN_COLORS = {
  amber:   { bar: "#f59e0b", glow: "rgba(245,158,11,0.25)",  badge: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  rose:    { bar: "#f43f5e", glow: "rgba(244,63,94,0.25)",   badge: "bg-rose-500/20 text-rose-300 border-rose-500/30"    },
  emerald: { bar: "#10b981", glow: "rgba(16,185,129,0.25)",  badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  yellow:  { bar: "#eab308", glow: "rgba(234,179,8,0.25)",   badge: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"   },
  violet:  { bar: "#8b5cf6", glow: "rgba(139,92,246,0.25)",  badge: "bg-violet-500/20 text-violet-300 border-violet-500/30"   },
  cyan:    { bar: "#06b6d4", glow: "rgba(6,182,212,0.25)",   badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"         },
};

function DomainCard({ domain, index }) {
  const c = DOMAIN_COLORS[domain.color] || DOMAIN_COLORS.cyan;
  const pct = (domain.score / 10) * 100;
  const scoreLabel =
    domain.score >= 7.5 ? "Strong" : domain.score >= 6 ? "Good" : domain.score >= 4.5 ? "Moderate" : "Low";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
      className="relative rounded-2xl border border-white/10 backdrop-blur-xl overflow-hidden p-4"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
        boxShadow: `0 0 20px ${c.glow}`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{domain.icon}</span>
          <span className="text-white/80 text-sm font-medium">{domain.label}</span>
        </div>
        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${c.badge}`}>
          {scoreLabel}
        </span>
      </div>

      {/* Score + waveform */}
      <div className="flex items-end justify-between mb-3">
        <span className="text-3xl font-bold text-white" style={{ textShadow: `0 0 12px ${c.bar}` }}>
          {domain.score.toFixed(1)}
        </span>
        <WaveformBar score={domain.score} color={c.bar} />
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mb-2">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${c.bar}99, ${c.bar})` }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, delay: 0.3 + index * 0.08, ease: "easeOut" }}
        />
      </div>

      {/* Reason */}
      <p className="text-white/45 text-[11px] leading-snug">{domain.factor}</p>
    </motion.div>
  );
}

// ─── Quality pill colours ────────────────────────────────────────────────────
const QUALITY_STYLES = {
  excellent:   "bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-[0_0_14px_rgba(34,211,238,0.3)]",
  good:        "bg-violet-500/20 text-violet-300 border-violet-400/40 shadow-[0_0_14px_rgba(139,92,246,0.3)]",
  moderate:    "bg-amber-500/20 text-amber-300 border-amber-400/40 shadow-[0_0_14px_rgba(251,191,36,0.3)]",
  challenging: "bg-red-500/20 text-red-300 border-red-400/40 shadow-[0_0_14px_rgba(248,113,113,0.3)]",
};

const QUALITY_LABELS = {
  excellent: "Exceptional Day",
  good: "Favourable Day",
  moderate: "Mixed Energies",
  challenging: "Rest & Reflect",
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CosmicDailyPage() {
  const navigate = useNavigate();
  const { birthDataFormValue, isAstrologyReady } = useProfileBirthData();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendTried, setBackendTried] = useState(false);

  const today = new Date();
  const dateLabel = today.toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  // ── Calculate immediately (client-side), then try to enhance via backend ──
  useEffect(() => {
    const base = calculateCosmicReport(today);
    setReport(base);
    setLoading(false);

    // If birth data + backend URL available, try transit enhancement
    const apiUrl = import.meta.env.VITE_ASTROLOGY_API_URL;
    if (!apiUrl || !isAstrologyReady || !birthDataFormValue) return;

    const dob = birthDataFormValue.birthDate?.toISOString?.()?.split("T")[0];
    // Use LOCAL date (not UTC) so the score refreshes at midnight in the user's timezone,
    // not at midnight UTC (which would be 5:30 AM IST for Indian users)
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // Check cache — transit scores for a given person+date are fixed for the day
    const cacheKey = localCache.cosmicDailyKey(dob, todayStr);
    const cachedTransit = localCache.get(cacheKey);
    if (cachedTransit) {
      setReport(calculateCosmicReport(today, cachedTransit));
      return;
    }

    setBackendTried(true);
    const payload = {
      birth_date:     dob,
      birth_time:     birthDataFormValue.birthTime,
      birth_location: birthDataFormValue.birthLocation,
      latitude:       birthDataFormValue.latitude,
      longitude:      birthDataFormValue.longitude,
      timezone:       birthDataFormValue.timezone,
    };

    fetch(`${apiUrl}/api/transits/current`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          // Cache for 1 day — transits are specific to today's date
          localCache.set(cacheKey, data, 24 * 60 * 60 * 1000);
          setReport(calculateCosmicReport(today, data));
        }
      })
      .catch(() => {});
  }, [isAstrologyReady]);

  const moonFrac = getMoonPhaseFraction(today);
  const moonInfo = getMoonPhaseLabel(moonFrac);
  const moonPct  = Math.round(
    moonFrac < 0.5 ? moonFrac * 200 : (1 - moonFrac) * 200
  );

  if (loading || !report) {
    return (
      <CosmicBackground density={120} useVideo>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </CosmicBackground>
    );
  }

  return (
    <CosmicBackground density={120} useVideo>
      <div className="min-h-screen text-white relative z-10 px-4 md:px-6 py-6">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Back button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-xl text-sm font-medium transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </motion.button>

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-2"
          >
            <p className="text-white/50 text-xs uppercase tracking-[0.2em]">
              {moonInfo.icon} {moonInfo.label} &nbsp;·&nbsp; {dateLabel}
            </p>
            <h1 className="text-3xl md:text-5xl font-serif font-bold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400">
                Your Cosmic Weather
              </span>
            </h1>
            <p className="text-white/50 text-sm">
              {report.backendEnhanced
                ? "Personalised from your live natal transit aspects"
                : "Based on planetary hora, lunar phase & day ruler · Enter birth data in Yoga Lab for full personalisation"}
            </p>
          </motion.div>

          {/* ── Overall Score ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative rounded-3xl border border-white/10 overflow-hidden p-6 md:p-8 flex flex-col md:flex-row items-center gap-6"
            style={{
              background: "linear-gradient(135deg, rgba(6,182,212,0.08), rgba(139,92,246,0.06), rgba(0,0,0,0.4))",
              boxShadow: "0 0 60px rgba(6,182,212,0.12)",
            }}
          >
            {/* Animated background shimmer */}
            <div className="absolute inset-0 opacity-20 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(34,211,238,0.2) 0%, transparent 60%)" }} />

            {/* Ring */}
            <div className="relative z-10 flex-shrink-0">
              <ScoreRing score={report.overallScore} />
            </div>

            {/* Info */}
            <div className="relative z-10 flex-1 text-center md:text-left space-y-3">
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${QUALITY_STYLES[report.quality]}`}>
                  <Zap className="h-3 w-3" />
                  {QUALITY_LABELS[report.quality]}
                </span>
                <span className="px-3 py-1 rounded-full text-xs border border-white/10 text-white/50">
                  {report.dayRuler} Day
                </span>
                <span className="px-3 py-1 rounded-full text-xs border border-white/10 text-white/50">
                  {report.currentHora} Hora
                </span>
              </div>
              <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-lg">
                {report.todayMessage}
              </p>
              <p className="text-white/40 text-xs flex items-center gap-1 justify-center md:justify-start">
                <span>🕐</span> Best window: {report.bestHora}
              </p>
            </div>

            {/* Moon phase mini */}
            <div className="relative z-10 flex-shrink-0 text-center space-y-1">
              <div className="text-4xl">{moonInfo.icon}</div>
              <p className="text-white/50 text-[11px]">{moonInfo.label}</p>
              <div className="h-1 w-20 bg-white/10 rounded-full overflow-hidden mx-auto">
                <div className="h-full bg-blue-400/60 rounded-full" style={{ width: `${moonPct}%` }} />
              </div>
              <p className="text-white/30 text-[10px]">{moonPct}% illumination</p>
            </div>
          </motion.div>

          {/* ── 6 Domain Cards ── */}
          <div>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white/50 text-xs uppercase tracking-[0.2em] mb-4"
            >
              Life Domain Scores
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {report.domains.map((d, i) => (
                <DomainCard key={d.key} domain={d} index={i} />
              ))}
            </div>
          </div>

          {/* ── Today's Focus & Remedy ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Focus Domain */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="rounded-2xl border border-cyan-400/20 p-5 space-y-2"
              style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.07), rgba(0,0,0,0.3))" }}
            >
              <p className="text-cyan-400/70 text-[11px] uppercase tracking-widest">Today's Power Domain</p>
              <p className="text-white font-semibold text-lg capitalize">
                {report.domains.find(d => d.key === report.focusDomain)?.icon}&nbsp;
                {report.domains.find(d => d.key === report.focusDomain)?.label}
              </p>
              <p className="text-white/50 text-sm">
                This domain is cosmically amplified today. Direct your best energy here for maximum results.
              </p>
            </motion.div>

            {/* Remedy Mantra */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="rounded-2xl border border-violet-400/20 p-5 space-y-2"
              style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.07), rgba(0,0,0,0.3))" }}
            >
              <p className="text-violet-400/70 text-[11px] uppercase tracking-widest">Today's Remedy Mantra</p>
              <p className="text-white font-semibold text-sm leading-snug">
                🕉️ {report.remedyMantra}
              </p>
              <p className="text-white/50 text-sm">
                Chant 108 times to strengthen your weakest domain today.
              </p>
            </motion.div>
          </div>

          {/* ── Quick Actions ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            {[
              { label: "Yoga Lab",    icon: <Zap className="h-4 w-4" />,      route: "/astrology/yoga-lab",  color: "cyan"   },
              { label: "Panchang",    icon: <Calendar className="h-4 w-4" />, route: "/panchang",            color: "amber"  },
              { label: "Mantra Jaap", icon: <Music className="h-4 w-4" />,    route: "/mantra-jaap",         color: "violet" },
              { label: "Remedies",    icon: <ExternalLink className="h-4 w-4" />, route: "/astrology/remedies", color: "emerald" },
            ].map(({ label, icon, route, color }) => (
              <button
                key={route}
                onClick={() => navigate(route)}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition
                  hover:bg-white/10 border-white/10 text-white/70 hover:text-white`}
              >
                {icon} {label}
              </button>
            ))}
          </motion.div>

          {/* ── Backend status note ── */}
          {backendTried && !report.backendEnhanced && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center text-white/25 text-[11px]"
            >
              Astrology backend offline — showing day-based scores. Full personalisation available when backend is active.
            </motion.p>
          )}

        </div>
      </div>
    </CosmicBackground>
  );
}
