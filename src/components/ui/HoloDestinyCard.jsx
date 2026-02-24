import React from "react";
import { motion } from "framer-motion";
import GradientText from "../GradientText";

export default function HoloDestinyCard({
  title,
  subtitle = "",
  blurb,
  ctaLabel,
  onPrimary,
  badge = null,
  icon: Icon = null,
  blurbMaxLines = null,
  className = "",
}) {
  const isDisabled = badge === "Coming Soon" || !onPrimary;
  const handleActivate = () => {
    if (!isDisabled && onPrimary) onPrimary();
  };
  const blurbClampStyle = blurbMaxLines
    ? {
        display: "-webkit-box",
        WebkitLineClamp: blurbMaxLines,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }
    : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`relative w-full ${isDisabled ? "" : "cursor-pointer"} ${className}`}
      onClick={handleActivate}
      role={isDisabled ? undefined : "button"}
      tabIndex={isDisabled ? -1 : 0}
      onKeyDown={(e) => {
        if (isDisabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleActivate();
        }
      }}
    >
      {/* Cosmic aura behind the card */}
      <div
        className="absolute -inset-4 -z-10 rounded-[28px] opacity-50 blur-2xl"
        style={{
          background:
            "radial-gradient(circle at 50% 35%, rgba(84,150,255,.35) 0%, rgba(84,150,255,0.0) 55%)",
        }}
      />

      {/* Deep blue frame */}
      <div
        className="
          relative p-[2px] rounded-3xl ring-1 ring-blue-300/20
          shadow-[0_0_24px_6px_rgba(56,120,248,0.12)]
          backdrop-blur-md
        "
        style={{
          background:
            "linear-gradient(135deg, rgba(13,28,60,0.15), rgba(9,22,48,0.15))",
        }}
      >
        {/* Glass core: fixed height + flex column so the CTA stays at the bottom */}
        <div className="relative h-[270px] md:h-[290px] rounded-[22px] overflow-hidden backdrop-blur-xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10">
          {/* Subtle inner glow for depth */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(800px 420px at 50% 0%, rgba(42,78,140,0.18) 0%, transparent 60%), radial-gradient(700px 380px at 50% 100%, rgba(18,42,92,0.16) 0%, transparent 60%)",
            }}
          />

          {/* Tiny stars */}
          <div
            className="absolute inset-0 opacity-[0.10] mix-blend-screen pointer-events-none
                       bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.25)_0.5px,transparent_1px)]
                       bg-[length:3px_3px]"
          />

          {/* CONTENT */}
          <div className="relative z-10 h-full flex flex-col p-5 md:p-6">
            {Icon && (
              <div className="flex justify-center mb-2">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/30 bg-cyan-400/10 text-cyan-200">
                  <Icon className="h-5 w-5" />
                </span>
              </div>
            )}
            {/* Title */}

            <GradientText
              as="span"
              className="font-serif text-center font-extrabold text-xl md:text-2xl"
            >
              {title}
            </GradientText>

            {subtitle && (
              <p className="mt-1 text-center text-[11px] md:text-xs uppercase tracking-widest text-cyan-100/65">
                {subtitle}
              </p>
            )}

            {/* Status badge */}
            {badge && (
              <div className="flex justify-center mt-1 mb-1">
                <span
                  className="
                    inline-block px-3 py-0.5 rounded-full text-[11px] font-semibold tracking-widest uppercase
                    bg-gradient-to-r from-amber-500/30 to-orange-500/30
                    text-amber-300 border border-amber-400/40
                    shadow-[0_0_8px_rgba(251,191,36,0.2)]
                  "
                >
                  {badge}
                </span>
              </div>
            )}

            {/* Blurb */}
            <p
              className="mt-3 text-center text-white/85 tracking-[0.01em] leading-7 md:leading-7"
              style={blurbClampStyle}
            >
              {blurb}
            </p>

            {/* CTA pinned at the bottom */}
            <div className="mt-auto pt-2">
              <div className="flex justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleActivate();
                  }}
                  disabled={isDisabled}
                  className={`
                    w-full max-w-[200px]
                    px-5 py-2 rounded-xl
                    text-white font-semibold transition
                    ${isDisabled
                      ? "bg-white/10 text-white/40 cursor-not-allowed border border-white/10"
                      : "bg-gradient-to-r from-[#3b82f6] to-[#4f46e5] shadow-[0_8px_28px_rgba(59,130,246,0.25)] hover:opacity-95"
                    }
                  `}
                >
                  {ctaLabel}
                </button>
              </div>
            </div>
          </div>
          {/* /CONTENT */}
        </div>
      </div>
    </motion.div>
  );
}
