import React from "react";
import cosmicBg from "../assets/cosmic-hero-bg.jpg";
import cosmicLoop from "../assets/cosmic_loop.mp4";

export default function CosmicBackground({
  children,
  density = 180,
  className = "",
  useVideo = true, // toggle between video and static image
}) {
  return (
    <div className={`relative min-h-[100dvh] overflow-hidden ${className}`}>
      {/* 🎥 Background video or 🖼️ fallback image */}
      {useVideo ? (
        <video
          src={cosmicLoop}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 z-[-30] h-full w-full object-cover"
        />
      ) : (
        <div
          aria-hidden
          className="pointer-events-none select-none absolute inset-0 z-[-30] bg-no-repeat bg-cover bg-center"
          style={{ backgroundImage: `url(${cosmicBg})` }}
        />
      )}

      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 z-[-25] bg-black/60" />

      {/* Gradient overlay for depth and readability */}
      <div className="absolute inset-0 z-[-20] bg-gradient-to-b from-[#0a0d2ecc] via-[#0a0d2e99] to-[#050a1acc]" />

      {/* Subtle cosmic glow effect */}
      <div className="absolute inset-0 z-[-19] pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-auric-gold/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cosmic-blue/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Foreground content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
