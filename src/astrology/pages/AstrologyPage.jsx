import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, BookOpen, Gem, MessageSquare, BarChart3 } from "lucide-react";
import CosmicBackground from "@/components/CosmicBackground";
import HoloDestinyCard from "@/components/ui/HoloDestinyCard";

const features = [
  {
    id: "cosmic-daily",
    title: "Cosmic Daily Score",
    subtitle: "Your Planetary Weather Today",
    description:
      "Personalised 6-domain score for Career, Love, Health, Finance, Spiritual & Mind — updated daily from live transits.",
    icon: BarChart3,
    cta: "View Today",
    badge: "New",
  },
  {
    id: "yoga-lab",
    title: "Yoga Lab",
    subtitle: "100+ Classical Yogas",
    description:
      "Detect major classical yogas with strength scoring and activation context.",
    icon: Sparkles,
    cta: "Open Lab",
    badge: "Updated",
  },
  {
    id: "remedies",
    title: "Remedies",
    subtitle: "Upaya and Graha Balance",
    description:
      "Practical Jyotish upayas: gemstone, mantra, vrata, daan and conduct guidance.",
    icon: Gem,
    cta: "View Remedies",
    badge: "Updated",
  },
  {
    id: "stotras",
    title: "Stotras",
    subtitle: "Sacred Recitation Library",
    description:
      "Classical stotras mapped to graha energies and life situations for daily sadhana.",
    icon: BookOpen,
    cta: "Open Stotras",
    badge: "Updated",
  },
  {
    id: "astrologer",
    title: "Astrologer AI",
    subtitle: "Guided Jyotish Dialogue",
    description:
      "Interactive AI pandit for chart interpretation, timing clarity and practical next steps.",
    icon: MessageSquare,
    cta: "Start Chat",
    badge: "New",
  },
];

export default function AstrologyPage() {
  const navigate = useNavigate();

  const routeMap = {
    "cosmic-daily": "/cosmic-daily",
    "yoga-lab": "/astrology/yoga-lab",
    remedies: "/astrology/remedies",
    stotras: "/astrology/stotras",
    astrologer: "/astrology/astrologer",
  };

  const handleFeatureClick = (featureId) => {
    const route = routeMap[featureId];
    if (route) navigate(route);
  };

  return (
    <CosmicBackground density={140} useVideo={true}>
      <div className="min-h-screen text-white relative z-10">
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
              Core astrology modules ready for guided practice and interpretation.
            </p>
            <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
              <span className="px-3 py-1 bg-cyan-500/15 border border-cyan-500/30 rounded-full text-xs text-cyan-300">
                Swiss Ephemeris
              </span>
              <span className="px-3 py-1 bg-purple-500/15 border border-purple-500/30 rounded-full text-xs text-purple-300">
                Lahiri Ayanamsa
              </span>
              <span className="px-3 py-1 bg-blue-500/15 border border-blue-500/30 rounded-full text-xs text-blue-300">
                Classical Jyotish
              </span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-stretch">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 * index }}
                className="h-full"
              >
                <HoloDestinyCard
                  title={feature.title}
                  subtitle={feature.subtitle}
                  blurb={feature.description}
                  blurbMaxLines={4}
                  ctaLabel={feature.cta}
                  onPrimary={() => handleFeatureClick(feature.id)}
                  icon={feature.icon}
                  badge={feature.badge}
                  className="h-full"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </CosmicBackground>
  );
}
