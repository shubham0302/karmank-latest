import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function LoadingAnimation() {
  // Animated orbiting dots around a central point
  const orbitDots = Array.from({ length: 6 });

  // Floating particles in background
  const particles = Array.from({ length: 12 });

  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-8">
      {/* Main Cosmic Loader */}
      <div className="relative w-32 h-32">
        {/* Outer rotating ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 border-r-auric-gold"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        {/* Middle rotating ring (counter-clockwise) */}
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-transparent border-b-nebula-violet border-l-cyan-300"
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        {/* Inner pulsing ring */}
        <motion.div
          className="absolute inset-4 rounded-full border-2 border-purple-500/40"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Orbiting dots */}
        {orbitDots.map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-auric-gold"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.2,
            }}
            style={{
              top: "50%",
              left: "50%",
              transformOrigin: `0 -50px`,
            }}
          />
        ))}

        {/* Center glow point */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-3 h-3 bg-gradient-to-r from-cyan-300 to-purple-400 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-cyan-400/50"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Ambient glow */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 via-purple-500/10 to-auric-gold/20 blur-2xl"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Text with animated ellipsis */}
      <div className="text-center space-y-3">
        <motion.div
          className="flex items-center justify-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Sparkles className="h-5 w-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-400 to-auric-gold">
            Loading your analysis
          </h3>
          <Sparkles className="h-5 w-5 text-auric-gold" />
        </motion.div>

        {/* Animated ellipsis */}
        <div className="flex justify-center items-center gap-1 h-6">
          <motion.span
            className="text-white/60"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
          >
            •
          </motion.span>
          <motion.span
            className="text-white/60"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          >
            •
          </motion.span>
          <motion.span
            className="text-white/60"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
          >
            •
          </motion.span>
        </div>

        <p className="text-sm text-white/50">
          Decoding cosmic vibrations...
        </p>
      </div>

      {/* Background floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.cos((i / particles.length) * Math.PI * 2) * 50, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 3 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.1,
            }}
            style={{
              top: "20%",
              left: `${(i / particles.length) * 100}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
