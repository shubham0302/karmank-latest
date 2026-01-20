import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Core Data & Logic ---
import { combinationInsights, DATA } from './data/data';
import { calculateNumerology } from './api/numerologyClient';
import { useAuth } from './contexts/AuthContext';
import { useFamilyMembers } from './hooks/useFamilyMembers';

// --- UI Components ---
import Card from './components/Card';
import SectionTitle from './components/SectionTitle';
import StaticVedicKundli from './components/StaticVedicKundli';
import NlgSummaryComponent from './components/NlgSummaryComponent';
import CosmicBackground from './components/CosmicBackground';
import FamilyMemberSelector from './components/FamilyMemberSelector';
import { ArrowLeft, ChevronDown, Loader2, Download } from 'lucide-react';
import { exportTabToPDF, exportFullReportToPDF } from './utils/pdfExport';

// --- Lazy Load Main Tabs for Better Performance ---
const WelcomeTab = lazy(() => import('./components/tabs/WelcomeTab'));
const AdvancedDashaTab = lazy(() => import('./components/tabs/AdvancedDashaTab'));
const ForecastTab = lazy(() => import('./components/tabs/ForecastTab'));
const RemediesAndGuidanceTab = lazy(() => import('./components/tabs/RemediesAndGuidanceTab'));
const NumerologyTraitsTab = lazy(() => import('./components/tabs/NumerologyTraitsTab'));
const LifeCycleTab = lazy(() => import('./components/tabs/LifeCycleTab'));

// --- Chat Widget ---
import WorldClassChatWidget from './components/chat/WorldClassChatWidget';
import { TABS, TAB_LIST } from './constants/tabs';

// Loading fallback component for lazy-loaded tabs
const TabLoadingFallback = () => (
    <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-cyan-400 mx-auto" />
            <p className="text-cyan-300 text-sm animate-pulse">Loading tab content...</p>
        </div>
    </div>
);

// Loading animation for initial load
const LoadingAnimation = () => (
    <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
            <p className="text-cyan-300 text-sm animate-pulse">Loading your analysis...</p>
        </div>
    </div>
);

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
    const { members, loading: membersLoading, getFamilyMembersData } = useFamilyMembers();
    const [userData, setUserData] = useState({ dob: '', name: '', gender: 'Male' });
    const [selectedFamilyMemberId, setSelectedFamilyMemberId] = useState(null);
    const [report, setReport] = useState(null);
    const [dashaReport, setDashaReport] = useState(null);
    const [activeTab, setActiveTab] = useState('Welcome');
    const [visitedTabs, setVisitedTabs] = useState(new Set(['Welcome']));
    const [formError, setFormError] = useState('');
    const [memberDropdownOpen, setMemberDropdownOpen] = useState(false);
    const [downloadDropdownOpen, setDownloadDropdownOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isLoadingMemberChange, setIsLoadingMemberChange] = useState(false);

    // Language state with localStorage persistence
    const [language, setLanguage] = useState(() => {
        const saved = localStorage.getItem("karmank-numerology-language");
        return saved || "en";
    });

    // Tab list
    const tabs = ['Welcome', 'Numerology Traits', 'Advanced Dasha', 'Forecast', 'Remedies & Guidance', 'Life Cycle'];

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
                    gender: firstMember.gender
                });
                // Auto-generate report for first family member
                try {
                    const result = await calculateNumerology({
                        dob: firstMember.date_of_birth,
                        name: firstMember.name,
                        gender: firstMember.gender?.toLowerCase() || 'other'
                    });
                    if (result.success && result.report) {
                        setReport(result.report);
                        setDashaReport(result.dashaReport);
                        setActiveTab('Welcome');
                    }
                } catch (error) {
                    console.error('Error generating report for first member:', error);
                }
            }
        };
        loadMembers();
    }, []);

    // Persist language preference
    useEffect(() => {
        localStorage.setItem('karmank-numerology-language', language);
    }, [language]);

    // Close download dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (downloadDropdownOpen && !event.target.closest('.relative')) {
                setDownloadDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [downloadDropdownOpen]);

    const handleSignOut = async () => {
        await signOut();
    };

    const handleBackToHome = () => {
        navigate('/');
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
            const result = await calculateNumerology({
                dob: userData.dob,
                name: userData.name,
                gender: userData.gender?.toLowerCase() || 'other',
            });

            console.log("Main Report:", result.report);

            if (result.success) {
                setReport(result.report);
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

    // Handle tab click with lazy loading
    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
        setVisitedTabs(prev => new Set([...prev, tabName]));
    };

    // Secure bot navigation handler
    const handleBotNavigation = (targetTab) => {
        if (typeof targetTab !== 'string') {
            console.error('Invalid navigation target type:', typeof targetTab);
            return;
        }

        if (!TAB_LIST.includes(targetTab)) {
            console.warn(`Invalid tab navigation attempt: "${targetTab}"`);
            return;
        }

        if (!report) {
            console.warn('Cannot navigate - report not generated yet');
            return;
        }

        console.log(`Ishira AI is navigating to: ${targetTab}`);
        setActiveTab(targetTab);
        setVisitedTabs(prev => new Set([...prev, targetTab]));

        setTimeout(() => {
            const element = document.getElementById('report-content');
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 150);
    };

    // Download handlers
    const handleDownloadCurrentTab = async () => {
        try {
            setIsDownloading(true);
            setDownloadDropdownOpen(false);
            await exportTabToPDF(activeTab, userData.name);
        } catch (error) {
            console.error('Error downloading tab:', error);
            alert('Failed to download report. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleDownloadFullReport = async () => {
        try {
            setIsDownloading(true);
            setDownloadDropdownOpen(false);
            await exportFullReportToPDF(tabs, setActiveTab, userData.name);
        } catch (error) {
            console.error('Error downloading full report:', error);
            alert('Failed to download full report. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    // Handle member selection with loading state
    const handleMemberSelect = async (member) => {
        setIsLoadingMemberChange(true);
        setMemberDropdownOpen(false);
        setSelectedFamilyMemberId(member.id);
        setUserData({
            name: member.name,
            dob: member.date_of_birth,
            gender: member.gender
        });

        try {
            const result = await calculateNumerology({
                dob: member.date_of_birth,
                name: member.name,
                gender: member.gender?.toLowerCase() || 'other'
            });
            if (result.success && result.report) {
                setReport(result.report);
                setDashaReport(result.dashaReport);
                setActiveTab('Welcome');
            }
        } catch (error) {
            console.error('Error generating report for member:', error);
        } finally {
            setIsLoadingMemberChange(false);
        }
    };

    const renderTabContent = () => {
        if (!report) return null;

        if (!visitedTabs.has(activeTab)) {
            return null;
        }

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
            case 'Welcome':
                return (
                    <Suspense fallback={<TabLoadingFallback />}>
                        <WelcomeTab report={report} userData={userData} language={language} />
                    </Suspense>
                );
            case 'Advanced Dasha':
                return (
                    <Suspense fallback={<TabLoadingFallback />}>
                        <AdvancedDashaTab {...dashaProps} />
                    </Suspense>
                );
            case 'Forecast':
                return (
                    <Suspense fallback={<TabLoadingFallback />}>
                        <ForecastTab report={report} dashaReport={dashaReport} gender={userData.gender} language={language} />
                    </Suspense>
                );
            case 'Remedies & Guidance':
                return (
                    <Suspense fallback={<TabLoadingFallback />}>
                        <RemediesAndGuidanceTab report={report} language={language} />
                    </Suspense>
                );
            case 'Numerology Traits':
                return (
                    <Suspense fallback={<TabLoadingFallback />}>
                        <NumerologyTraitsTab report={report} gender={userData.gender} language={language} />
                    </Suspense>
                );
            case 'Life Cycle':
                return (
                    <Suspense fallback={<TabLoadingFallback />}>
                        <LifeCycleTab report={report} dashaReport={dashaReport} name={userData.name} gender={userData.gender} language={language} />
                    </Suspense>
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

                        <div className="flex items-center gap-3">
                            {/* Desktop Language Tabs */}
                            <div className="hidden md:flex gap-2">
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
                                    disabled={isLoadingMemberChange}
                                    className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 rounded-lg text-cyan-300 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {selectedFamilyMemberId && members.find(m => m.id === selectedFamilyMemberId)?.name || 'Select Member'}
                                    <ChevronDown className="h-4 w-4" />
                                </button>
                                {memberDropdownOpen && !isLoadingMemberChange && (
                                    <div className="absolute top-full right-0 mt-2 bg-gray-900 border border-cyan-400/50 rounded-lg shadow-lg z-50 min-w-64">
                                        {members.map(member => (
                                            <button
                                                key={member.id}
                                                onClick={() => handleMemberSelect(member)}
                                                className={`w-full text-left px-4 py-3 hover:bg-cyan-400/10 transition ${
                                                    selectedFamilyMemberId === member.id ? 'bg-cyan-400/20 border-l-2 border-l-cyan-400' : ''
                                                }`}
                                            >
                                                <div className="font-semibold text-white">{member.name}</div>
                                                <div className="text-xs text-white/60">{member.gender} • DOB: {new Date(member.date_of_birth).toLocaleDateString()}</div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Download Button with Dropdown */}
                            {report && (
                                <div className="relative">
                                    <button
                                        onClick={() => setDownloadDropdownOpen(!downloadDropdownOpen)}
                                        disabled={isDownloading}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 border border-purple-400/50 rounded-lg text-purple-300 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isDownloading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span>Downloading...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Download className="h-4 w-4" />
                                                <span>Download PDF</span>
                                                <ChevronDown className="h-4 w-4" />
                                            </>
                                        )}
                                    </button>
                                    {downloadDropdownOpen && !isDownloading && (
                                        <div className="absolute top-full right-0 mt-2 bg-gray-900 border border-purple-400/50 rounded-lg shadow-lg z-50 min-w-56">
                                            <button
                                                onClick={handleDownloadCurrentTab}
                                                className="w-full text-left px-4 py-3 hover:bg-purple-400/10 transition text-white"
                                            >
                                                <div className="font-semibold">Current Tab</div>
                                                <div className="text-xs text-white/60">Download {activeTab} only</div>
                                            </button>
                                            <button
                                                onClick={handleDownloadFullReport}
                                                className="w-full text-left px-4 py-3 hover:bg-purple-400/10 transition text-white border-t border-purple-400/20"
                                            >
                                                <div className="font-semibold">Full Report</div>
                                                <div className="text-xs text-white/60">Download all tabs (takes longer)</div>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
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
                                backgroundSize: '40px 40px',
                                transform: 'perspective(500px) rotateX(60deg)',
                                transformOrigin: 'center bottom'
                            }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center space-y-2 relative z-10">
                                <div className="text-4xl font-bold">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500">
                                        KarmAnk
                                    </span>
                                    <sup className="text-2xl -top-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500">
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

                    {/* Member Change Loading Overlay */}
                    {isLoadingMemberChange && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
                            <div className="bg-gray-900/90 border border-cyan-400/50 rounded-xl p-8 text-center">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400 mb-4"></div>
                                <p className="text-cyan-300 font-medium">
                                    Loading {userData.name}'s analysis...
                                </p>
                            </div>
                        </div>
                    )}

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
                                {tabs.map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => handleTabClick(tab)}
                                        className={`py-2 px-4 font-medium transition-colors duration-300 ${
                                            activeTab === tab
                                                ? 'text-cyan-400 border-b-2 border-cyan-400'
                                                : 'text-cyan-200/70 hover:text-cyan-300'
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <div id="report-content" className="mt-6">{renderTabContent()}</div>
                        </div>
                    )}

                    {/* Chat Widget - Shows only after report is generated */}
                    {report && (
                        <WorldClassChatWidget
                            userContext={{
                                destinyNumber: report.destinyNumber,
                                basicNumber: report.basicNumber,
                                currentDasha: dashaReport?.mahaDashaTimeline?.[0]?.planet,
                                gender: userData.gender,
                                name: userData.name,
                            }}
                            report={report}
                            dashaReport={dashaReport}
                            language={language}
                            currentTab={activeTab}
                            onNavigate={handleBotNavigation}
                        />
                    )}
                </div>
            </div>
        </CosmicBackground>
    );
}
