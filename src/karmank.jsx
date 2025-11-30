import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// --- Core Data & Logic ---
import {
  calculateNumerology,
  validateInput,
  formatErrorMessage,
} from "./api/numerologyClient";
import { useAuth } from "./contexts/AuthContext";
import { useFamilyMembers } from "./hooks/useFamilyMembers";
import { getCombinationInsight } from "./utils/localData";

// --- UI Components ---
import Card from "./components/Card";
import SectionTitle from "./components/SectionTitle";
import StaticVedicKundli from "./components/StaticVedicKundli";
import NlgSummaryComponent from "./components/NlgSummaryComponent";
import CosmicBackground from "./components/CosmicBackground";
import FamilyMemberSelector from "./components/FamilyMemberSelector";
import LoadingAnimation from "./components/LoadingAnimation";
import { GradientText, gradientUtils } from "./components/GradientText";
import { ArrowLeft, ChevronDown } from "lucide-react";

// --- Main Tabs (Imported from sub-folders) ---
import WelcomeTab from "./components/tabs/WelcomeTab";
import FoundationalAnalysisTab from "./components/tabs/FoundationalAnalysisTab";
import AdvancedDashaTab from "./components/tabs/AdvancedDashaTab";
import ForecastTab from "./components/tabs/ForecastTab";
import RemediesAndGuidanceTab from "./components/tabs/RemediesAndGuidanceTab";
import NumerologyTraitsTab from "./components/tabs/NumerologyTraitsTab";

// A simple placeholder for any tab you haven't moved or want to disable
const PlaceholderTab = ({ name }) => (
  <Card>
    <h3 className="text-xl font-bold text-indigo-300">{name}</h3>
    <p className="text-indigo-200">
      Content for {name} will be displayed here.
    </p>
  </Card>
);

// This is your main application component
export default function KarmAnkApp() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const {
    members,
    loading: membersLoading,
    getFamilyMembersData,
  } = useFamilyMembers();
  const [userData, setUserData] = useState({
    dob: "",
    name: "",
    gender: "Male",
  });
  const [selectedFamilyMemberId, setSelectedFamilyMemberId] = useState(null);
  const [report, setReport] = useState(null);
  const [dashaReport, setDashaReport] = useState(null);
  const [activeTab, setActiveTab] = useState("Welcome");
  const [formError, setFormError] = useState("");
  const [memberDropdownOpen, setMemberDropdownOpen] = useState(false);

  // Language state with localStorage persistence
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem("karmank-numerology-language");
    return saved || "en";
  });

  // Fetch family members and auto-select first one
  useEffect(() => {
    const loadMembers = async () => {
      const result = await getFamilyMembersData();
      if (result.members && result.members.length > 0) {
        const firstMember = result.members[0];
        setSelectedFamilyMemberId(firstMember.id);
        setUserData({
          name: firstMember.name,
          dob: firstMember.date_of_birth,
          gender: firstMember.gender,
        });
        // Auto-generate report for first family member
        try {
          const calcResult = await calculateNumerology({
            dob: firstMember.date_of_birth,
            name: firstMember.name,
            gender: firstMember.gender,
          });
          if (calcResult.success) {
            setReport(calcResult.report);
            setDashaReport(calcResult.dashaReport);
            setActiveTab("Welcome");
          }
        } catch (error) {
          console.error("Error generating report for first member:", error);
        }
      }
    };
    loadMembers();
  }, []);

  // Persist language preference
  useEffect(() => {
    localStorage.setItem("karmank-numerology-language", language);
  }, [language]);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleFamilyMemberSelect = (memberId) => {
    setSelectedFamilyMemberId(memberId);
  };

  const handleFamilyMemberDetailsChange = (details) => {
    setUserData({
      name: details.name,
      dob: details.dob,
      gender: details.gender,
    });
  };

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!selectedFamilyMemberId || !userData.dob || !userData.name) {
      setFormError("Please select a family member first.");
      return;
    }
    setFormError("");

    try {
      // Call the backend API to calculate numerology
      const result = await calculateNumerology({
        dob: userData.dob,
        name: userData.name,
        gender: userData.gender,
      });

      console.log("Main Report:", result.report);

      if (result.success) {
        // Store the report
        setReport(result.report);

        // Store the dasha report
        setDashaReport(result.dashaReport);

        setActiveTab("Welcome");
      } else {
        console.error("Calculation failed");
        setFormError("Failed to generate report. Please try again.");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      setFormError(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  // UPDATED: Removed 'Name Analysis', 'Asset Vibration', and 'Education'
  const tabs = [
    "Welcome",
    "Foundational Analysis",
    "Advanced Dasha",
    "Forecast",
    "Remedies & Guidance",
    "Numerology Traits",
  ];

  const renderTabContent = () => {
    if (!report) return null;

    // Props for tabs that need them
    const commonProps = {
      report,
      isPremium: false,
      onUpgradeClick: () => {},
      language,
    };
    const dashaProps = {
      dashaReport,
      baseKundliGrid: report.baseKundliGrid,
      basicNumber: report.basicNumber,
      destinyNumber: report.destinyNumber,
      foundationalYogas: report.yogas,
      language,
      relevantData: report?.relevantData,
    };

    switch (activeTab) {
      case "Welcome":
        return (
          <WelcomeTab report={report} userData={userData} language={language} />
        );
      case "Foundational Analysis":
        return (
          <FoundationalAnalysisTab
            analysis={report.recurringNumbersAnalysis}
            yogas={report.yogas}
            specialInsights={report.specialInsights}
            language={language}
          />
        );
      case "Advanced Dasha":
        return <AdvancedDashaTab {...dashaProps} />;
      case "Forecast":
        return (
          <ForecastTab
            report={report}
            dashaReport={dashaReport}
            gender={userData.gender}
            language={language}
          />
        );
      case "Remedies & Guidance":
        return <RemediesAndGuidanceTab report={report} language={language} />;
      case "Numerology Traits":
        return (
          <NumerologyTraitsTab
            report={report}
            gender={userData.gender}
            language={language}
          />
        );
      default:
        return <PlaceholderTab name={activeTab} />;
    }
  };

  return (
    <CosmicBackground density={140} useVideo={true}>
      <div className="min-h-screen relative px-4 md:px-6 py-6">
        <div className="max-w-5xl mx-auto relative z-10">
          {/* Top Navigation - Back Button on Left, Controls on Right */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handleBackToHome}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-4 py-2 rounded-md text-sm font-medium transition duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <div className="flex gap-2">
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                    language === "en"
                      ? "bg-gradient-to-r from-cyan-600/30 to-purple-600/30 border border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/20"
                      : "text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/20"
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage("hi")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                    language === "hi"
                      ? "bg-gradient-to-r from-cyan-600/30 to-purple-600/30 border border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/20"
                      : "text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/20"
                  }`}
                >
                  HI
                </button>
                <button
                  onClick={() => setLanguage("en-hi")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                    language === "en-hi"
                      ? "bg-gradient-to-r from-cyan-600/30 to-purple-600/30 border border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/20"
                      : "text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/20"
                  }`}
                >
                  EN-HI
                </button>
              </div>

              {/* Member Selector Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setMemberDropdownOpen(!memberDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 rounded-lg text-cyan-300 text-sm font-medium transition"
                >
                  {(selectedFamilyMemberId &&
                    members.find((m) => m.id === selectedFamilyMemberId)
                      ?.name) ||
                    "Select Member"}
                  <ChevronDown className="h-4 w-4" />
                </button>
                {memberDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 bg-gray-900 border border-cyan-400/50 rounded-lg shadow-lg z-50 min-w-64">
                    {members.map((member) => (
                      <button
                        key={member.id}
                        onClick={async () => {
                          setSelectedFamilyMemberId(member.id);
                          setUserData({
                            name: member.name,
                            dob: member.date_of_birth,
                            gender: member.gender,
                          });
                          setMemberDropdownOpen(false);
                          // Auto-generate report when member is selected
                          try {
                            const calcResult = await calculateNumerology({
                              dob: member.date_of_birth,
                              name: member.name,
                              gender: member.gender,
                            });
                            if (calcResult.success) {
                              setReport(calcResult.report);
                              setDashaReport(calcResult.dashaReport);
                              setActiveTab("Welcome");
                            }
                          } catch (error) {
                            console.error("Error generating report:", error);
                          }
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-cyan-400/10 transition ${
                          selectedFamilyMemberId === member.id
                            ? "bg-cyan-400/20 border-l-2 border-l-cyan-400"
                            : ""
                        }`}
                      >
                        <div className="font-semibold text-white">
                          {member.name}
                        </div>
                        <div className="text-xs text-white/60">
                          {member.gender} • DOB:{" "}
                          {new Date(member.date_of_birth).toLocaleDateString()}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Futuristic Gate Header */}
          <div className="relative w-full h-40 mb-8 overflow-hidden rounded-xl border border-cyan-500/20">
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/40 via-gray-950 to-black" />
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                                linear-gradient(to right, rgba(34, 211, 238, 0.1) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
                            `,
                backgroundSize: "40px 40px",
                transform: "perspective(500px) rotateX(60deg)",
                transformOrigin: "center bottom",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-2 relative z-10">
                <div className="text-4xl font-bold">
                  <GradientText as="span" size="4xl" className="font-serif">
                    KarmAnk
                  </GradientText>
                  <sup className={`text-2xl -top-2 ${gradientUtils.text}`}>
                    ™
                  </sup>
                </div>
                <div className="text-sm text-cyan-400/60 tracking-widest">
                  VEDIC NUMEROLOGY SYSTEM
                </div>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
                  <div className="text-xs text-cyan-400/40">★</div>
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>

          {!report ? (
            /* Introduction Page with Animated Loading */
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-900/60 backdrop-blur-md p-8 rounded-xl border border-cyan-500/20 shadow-2xl">
                <h3 className="text-lg font-semibold text-center text-cyan-300 mb-8">
                  {userData.name || "Select a member to begin"}
                </h3>

                <LoadingAnimation />
              </div>
            </div>
          ) : (
            /* Analysis Results */
            <div>
              <div className="mb-4 border-b border-cyan-400/20 flex flex-wrap">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-4 font-medium transition-colors duration-300 ${
                      activeTab === tab
                        ? "text-cyan-400 border-b-2 border-cyan-400"
                        : "text-cyan-200/70 hover:text-cyan-300"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="mt-6">{renderTabContent()}</div>
            </div>
          )}
        </div>
      </div>
    </CosmicBackground>
  );
}
