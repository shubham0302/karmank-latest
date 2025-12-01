import React, { useState } from "react";
import { Sparkles } from "lucide-react";

// Import all the sub-tabs from the 'Remedies' folder
import GeneralRemediesTab from "../Remedies/GeneralRemediesTab";
import AdvancedRemediesTab from "../Remedies/AdvancedRemediesTab";
import SpecialGuidanceTab from "../Remedies/SpecialGuidanceTab";
import ShaktiBeejMantraTab from "../Remedies/ShaktiBeejMantraTab";

const ComingSoonOverlay = ({ feature, showIcon = true }) => (
  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-xl z-50">
    <div className="text-center">
      {showIcon && <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-pulse" />}
      <h3 className="text-3xl font-bold text-yellow-400 mb-2">Coming Soon</h3>
      <p className="text-gray-300 text-lg">
        The {feature} feature is being enhanced
      </p>
    </div>
  </div>
);

const RemediesAndGuidanceTab = ({ report, language = "en" }) => {
  const [activeSubTab, setActiveSubTab] = useState("General");
  const hasFourOrEight =
    report.baseKundliGrid[4] > 0 || report.baseKundliGrid[8] > 0;

  return (
    <div>
      {hasFourOrEight && (
        <div className="mb-4 p-4 bg-red-900/50 text-red-300 rounded-lg border border-red-500/50">
          <p className="font-bold text-center">
            Important: Your chart contains the number 4 or 8. Please pay special
            attention to the "Advanced Remedies" and "Rudraksha" sections for
            guidance on balancing these energies.
          </p>
        </div>
      )}
      <div className="mb-4 border-b border-yellow-400/20 flex justify-center flex-wrap">
        <button
          onClick={() => setActiveSubTab("General")}
          className={`py-2 px-4 font-medium transition-colors duration-200 ${
            activeSubTab === "General"
              ? "text-yellow-400 border-b-2 border-yellow-400"
              : "text-yellow-200/70"
          }`}
        >
          General Remedies
        </button>
        <button
          onClick={() => setActiveSubTab("Advanced")}
          className={`py-2 px-4 font-medium transition-colors duration-200 ${
            activeSubTab === "Advanced"
              ? "text-yellow-400 border-b-2 border-yellow-400"
              : "text-yellow-200/70"
          }`}
        >
          Advanced Remedies
        </button>
        <button
          onClick={() => setActiveSubTab("Special")}
          className={`py-2 px-4 font-medium transition-colors duration-200 ${
            activeSubTab === "Special"
              ? "text-yellow-400 border-b-2 border-yellow-400"
              : "text-yellow-200/70"
          }`}
        >
          Special Guidance
        </button>{" "}
        <button
          onClick={() => setActiveSubTab("Shakti")}
          className={`py-2 px-4 font-medium transition-colors duration-200 ${
            activeSubTab === "Shakti"
              ? "text-yellow-400 border-b-2 border-yellow-400"
              : "text-yellow-200/70"
          }`}
        >
          Shakti Beej Mantra
        </button>
        <button
          onClick={() => setActiveSubTab("Mantras")}
          className={`py-2 px-4 font-medium transition-colors duration-200 ${
            activeSubTab === "Mantras"
              ? "text-yellow-400 border-b-2 border-yellow-400"
              : "text-yellow-200/70"
          }`}
        >
          Mantras
        </button>
        <button
          onClick={() => setActiveSubTab("Rudraksha")}
          className={`py-2 px-4 font-medium transition-colors duration-200 ${
            activeSubTab === "Rudraksha"
              ? "text-yellow-400 border-b-2 border-yellow-400"
              : "text-yellow-200/70"
          }`}
        >
          Rudraksha
        </button>
        <button
          onClick={() => setActiveSubTab("Chakra")}
          className={`py-2 px-4 font-medium transition-colors duration-200 ${
            activeSubTab === "Chakra"
              ? "text-yellow-400 border-b-2 border-yellow-400"
              : "text-yellow-200/70"
          }`}
        >
          Chakra Activation
        </button>
      </div>
      {activeSubTab === "General" && (
        <GeneralRemediesTab report={report} language={language} />
      )}
      {activeSubTab === "Advanced" && (
        <AdvancedRemediesTab report={report} language={language} />
      )}
      {activeSubTab === "Special" && (
        <SpecialGuidanceTab report={report} language={language} />
      )}
      {activeSubTab === "Mantras" && (
        <div className="relative">
          <div className="space-y-6">
            <div className="bg-gray-800/40 border border-yellow-400/20 rounded-lg p-8 text-center mb-6">
              <h3 className="text-2xl font-bold text-yellow-400 mb-3 font-serif">Sacred Mantras</h3>
              <p className="text-gray-400">Harness the vibrational power of sacred chants aligned with your numerological profile</p>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-800/40 border border-yellow-400/10 rounded-lg p-4">
                  <div className="h-4 bg-gray-700/50 rounded w-32 mb-3 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-700/30 rounded w-full animate-pulse"></div>
                    <div className="h-3 bg-gray-700/30 rounded w-5/6 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <ComingSoonOverlay feature="Mantras" />
        </div>
      )}
      {activeSubTab === "Rudraksha" && (
        <div className="relative">
          <div className="space-y-6">
            <div className="bg-gray-800/40 border border-yellow-400/20 rounded-lg p-8 text-center mb-6">
              <h3 className="text-2xl font-bold text-yellow-400 mb-3 font-serif">Rudraksha Beads</h3>
              <p className="text-gray-400">Discover sacred beads and gemstones that amplify your personal vibration</p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-800/40 border border-yellow-400/10 rounded-lg p-4 text-center">
                  <div className="w-16 h-16 bg-gray-700/50 rounded-full mx-auto mb-3 animate-pulse"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-20 mx-auto mb-2 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-700/30 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-700/30 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <ComingSoonOverlay feature="Rudraksha" />
        </div>
      )}
      {activeSubTab === "Chakra" && (
        <div className="relative">
          <div className="space-y-6">
            <div className="bg-gray-800/40 border border-yellow-400/20 rounded-lg p-8 text-center mb-6">
              <h3 className="text-2xl font-bold text-yellow-400 mb-3 font-serif">Chakra Activation</h3>
              <p className="text-gray-400">Awaken and balance your energy centers through numerological practices</p>
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="flex items-center gap-4 bg-gray-800/40 border border-yellow-400/10 rounded-lg p-4">
                  <div className="w-12 h-12 bg-gray-700/50 rounded-full animate-pulse flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-700/50 rounded w-24 animate-pulse"></div>
                    <div className="h-3 bg-gray-700/30 rounded w-full animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <ComingSoonOverlay feature="Chakra Activation" showIcon={false} />
        </div>
      )}
      {activeSubTab === "Shakti" && <ShaktiBeejMantraTab language={language} />}
    </div>
  );
};

export default RemediesAndGuidanceTab;
