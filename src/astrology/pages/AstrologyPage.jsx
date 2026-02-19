import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Sun,
  Sparkles,
  BookOpen,
  Activity,
  Clock,
  Moon,
  Orbit,
  Gem,
  MessageSquare,
} from "lucide-react";
import CosmicBackground from "@/components/CosmicBackground";

const features = [
  {
    id: "birth-chart",
    title: "Birth Chart",
    subtitle: "Kundli & Planetary Positions",
    description:
      "Generate your Vedic birth chart with planetary positions, house placements, ascendant, and Nakshatra analysis.",
    icon: Sun,
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "yoga-lab",
    title: "Yoga Lab",
    subtitle: "100+ Classical Yogas",
    description:
      "Detect Raja Yogas, Dhana Yogas, Pancha Mahapurusha Yogas and 100+ classical combinations with strength analysis.",
    icon: Sparkles,
    color: "from-purple-500 to-fuchsia-500",
  },
  {
    id: "divisional",
    title: "Divisional Charts",
    subtitle: "D1 to D60 Vargas",
    description:
      "All 16 Shodasha Vargas including Navamsa (D9) for marriage, Dasamsa (D10) for career, and more.",
    icon: Orbit,
    color: "from-indigo-500 to-violet-500",
  },
  {
    id: "dasha",
    title: "Vimshottari Dasha",
    subtitle: "Planetary Periods & Timing",
    description:
      "Complete Mahadasha, Antardasha and Pratyantardasha timeline with life predictions across 8 areas.",
    icon: Clock,
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: "remedies",
    title: "Remedies & Stotras",
    subtitle: "Gemstones, Mantras, Hymns",
    description:
      "Personalized gemstone recommendations, Vedic mantras, charitable acts, fasting guidelines, and sacred stotras.",
    icon: Gem,
    color: "from-rose-500 to-pink-500",
  },
  {
    id: "astrologer",
    title: "AI Astrologer",
    subtitle: "Your Vedic Guide",
    description:
      "Chat with an AI astrologer powered by classical Vedic texts. Get personalized interpretations and guidance.",
    icon: MessageSquare,
    color: "from-yellow-500 to-amber-500",
  },
  {
    id: "shadbala",
    title: "Shadbala",
    subtitle: "Six-Fold Planetary Strength",
    description:
      "Comprehensive 6-component strength analysis — positional, directional, temporal, motional, natural and aspect.",
    icon: Activity,
    color: "from-emerald-500 to-green-500",
  },
  {
    id: "nadi",
    title: "Nadi Shastra",
    subtitle: "Ancient Palm Leaf Tradition",
    description:
      "Explore the 12 Kandams of Nadi astrology — from general life to liberation. Interactive guided experience.",
    icon: BookOpen,
    color: "from-teal-500 to-cyan-500",
  },
];

export default function AstrologyPage() {
  const navigate = useNavigate();

  const routeMap = {
    "birth-chart": "/astrology/birth-chart",
    "yoga-lab": "/astrology/yoga-lab",
    dasha: "/astrology/yoga-lab",
    divisional: "/astrology/divisional-charts",
    shadbala: "/astrology/yoga-lab",
    remedies: "/astrology/remedies",
    astrologer: "/astrology/astrologer",
    nadi: "/astrology/nadi",
  };

  const handleFeatureClick = (featureId) => {
    const route = routeMap[featureId];
    if (route) navigate(route);
  };

  return (
    <CosmicBackground density={140} useVideo={true}>
      <div className="min-h-screen text-white relative z-10">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 pt-6">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-4 py-2 rounded-md text-sm font-medium transition duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </motion.button>
        </div>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500">
                Jyotish Shastra
              </span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Professional Vedic astrology with Swiss Ephemeris precision.
              Birth chart, 100+ yogas, Vimshottari Dasha, divisional charts,
              Shadbala, transits, remedies, and AI-powered interpretations.
            </p>
            <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
              <span className="px-3 py-1 bg-cyan-500/15 border border-cyan-500/30 rounded-full text-xs text-cyan-300">
                Swiss Ephemeris
              </span>
              <span className="px-3 py-1 bg-purple-500/15 border border-purple-500/30 rounded-full text-xs text-purple-300">
                Lahiri Ayanamsa
              </span>
              <span className="px-3 py-1 bg-blue-500/15 border border-blue-500/30 rounded-full text-xs text-blue-300">
                100+ Yogas
              </span>
            </div>
          </motion.div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.button
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.08 * index }}
                  onClick={() => handleFeatureClick(feature.id)}
                  className="group relative text-left bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-cyan-400/30 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/10"
                >
                  <div
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4`}
                  >
                    <Icon size={22} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-white/50 mb-3">
                    {feature.subtitle}
                  </p>
                  <p className="text-sm text-white/40 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </CosmicBackground>
  );
}
