import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CosmicBackground from "../components/CosmicBackground";
import HoloDestinyCard from "../components/ui/HoloDestinyCard";
import { useAuth } from "../contexts/AuthContext";
import { Crown, Sparkles } from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const modules = [
    {
      title: "KARMANK • NUMEROLOGY",
      blurb: "Decode your 3×3 Vedic grid, karmic patterns and the sacred mathematics shaping your life's rhythm.",
      cta: "Explore",
      route: "/numerology"
    },
    {
      title: "KARMANK • NAME ANALYSIS",
      blurb: "Uncover name vibrations, auspicious spellings and alignment with your destiny grid.",
      cta: "Analyze",
      route: "/name-analysis"
    },
    {
      title: "KARMANK • COSMIC COMPATIBILITY",
      blurb: "Measure synergy for partners, teams and relationships using authentic Vedic numerology.",
      cta: "Check",
      route: "/compatibility"
    },
    {
      title: "KARMANK • GITA GYAN",
      blurb: "Timeless wisdom of the Bhagavad Gita mapped to modern decisions and your numerological signatures.",
      cta: "Open",
      route: "/gita-gyan"
    }
  ];

  return (
    <CosmicBackground density={140} useVideo={true}>
      <div className="min-h-screen relative px-4 md:px-6 py-6 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header with Sign Out */}
          <div className="flex justify-between items-center mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <Crown className="h-8 w-8 text-auric-gold" />
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-white">
                KarmAnk
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <span className="text-sm text-white/70 hidden md:block">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/50 px-4 py-2 rounded-md text-sm font-medium transition duration-200"
              >
                Sign Out
              </button>
            </motion.div>
          </div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-6 md:mb-12"
          >
            <h2
              className="
                text-center text-4xl md:text-6xl font-serif font-extrabold leading-snug
                bg-[linear-gradient(90deg,#facc15_0%,#fbbf24_20%,#f9a8d4_60%,#c084fc_100%)]
                bg-clip-text text-transparent
                drop-shadow-[0_0_12px_rgba(0,255,255,.25)]
              "
            >
              Choose your cosmic path
              <br className="hidden md:block" />
              to begin your KarmAnk journey
            </h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-4 text-sm md:text-base text-white/70 flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-auric-gold" />
              Each card is a gateway. Enter any module—switch anytime from the navigation.
            </motion.p>
          </motion.div>

          {/* Module Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch"
          >
            {modules.map((module, index) => (
              <motion.div
                key={module.route}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              >
                <HoloDestinyCard
                  title={module.title}
                  blurb={module.blurb}
                  ctaLabel={module.cta}
                  onPrimary={() => navigate(module.route)}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-12 text-center text-xs text-white/40 font-light"
          >
            <p className="flex items-center justify-center gap-2">
              <Sparkles className="h-3 w-3" />
              © {new Date().getFullYear()} KarmAnk - Sacred Technology
            </p>
          </motion.div>
        </div>
      </div>
    </CosmicBackground>
  );
}
