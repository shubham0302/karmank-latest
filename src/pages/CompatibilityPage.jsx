import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CosmicBackground from "../components/CosmicBackground";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function CompatibilityPage() {
  const navigate = useNavigate();

  return (
    <CosmicBackground density={140} useVideo={true}>
      <div className="min-h-screen relative px-4 md:px-6 py-6">
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white/70 hover:text-auric-gold mb-8 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Home</span>
          </motion.button>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center space-y-6"
          >
            <div className="space-y-4">
              <h1
                className="
                  text-5xl md:text-7xl font-serif font-extrabold
                  bg-[linear-gradient(90deg,#facc15_0%,#fbbf24_20%,#f9a8d4_60%,#c084fc_100%)]
                  bg-clip-text text-transparent
                  drop-shadow-[0_0_12px_rgba(0,255,255,.25)]
                "
              >
                Cosmic Compatibility
              </h1>
              <p className="text-xl text-white/70 flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-auric-gold" />
                Coming Soon
              </p>
            </div>

            <div className="mt-12 max-w-2xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12">
              <p className="text-lg text-white/80 leading-relaxed">
                The Cosmic Compatibility module will help you measure synergy between partners,
                teams, and relationships using authentic Vedic numerology principles.
              </p>
              <p className="mt-6 text-white/60">
                This powerful tool is currently under development and will be available soon.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </CosmicBackground>
  );
}
