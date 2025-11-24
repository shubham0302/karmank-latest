import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Core Data & Logic ---
import { combinationInsights, DATA } from './data/data';
import { calculateNumerology, dashaCalculator } from './utils/calculators';
import { useAuth } from './contexts/AuthContext';

// --- UI Components ---
import Card from './components/Card';
import SectionTitle from './components/SectionTitle';
import StaticVedicKundli from './components/StaticVedicKundli';
import NlgSummaryComponent from './components/NlgSummaryComponent';
import CosmicBackground from './components/CosmicBackground';
import { ArrowLeft } from 'lucide-react';

// --- Main Tabs (Imported from sub-folders) ---
import WelcomeTab from './components/tabs/WelcomeTab';
import FoundationalAnalysisTab from './components/tabs/FoundationalAnalysisTab';
import AdvancedDashaTab from './components/tabs/AdvancedDashaTab';
import ForecastTab from './components/tabs/ForecastTab';
import RemediesAndGuidanceTab from './components/tabs/RemediesAndGuidanceTab';
import NumerologyTraitsTab from './components/tabs/NumerologyTraitsTab';

// A simple placeholder for any tab you haven't moved or want to disable
const PlaceholderTab = ({ name }) => (
    <Card><h3 className="text-xl font-bold text-indigo-300">{name}</h3><p className="text-indigo-200">Content for {name} will be displayed here.</p></Card>
);

// This is your main application component
export default function KarmAnkApp() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [userData, setUserData] = useState({ dob: '', name: '', gender: 'Male' });
    const [report, setReport] = useState(null);
    const [dashaReport, setDashaReport] = useState(null);
    const [activeTab, setActiveTab] = useState('Welcome');
    const [formError, setFormError] = useState('');

    // Language state with localStorage persistence
    const [language, setLanguage] = useState(() => {
        const saved = localStorage.getItem('karmank-numerology-language');
        return saved || 'en';
    });

    // Persist language preference
    useEffect(() => {
        localStorage.setItem('karmank-numerology-language', language);
    }, [language]);

    const handleSignOut = async () => {
        await signOut();
    };

    const handleBackToHome = () => {
        navigate('/');
    };
    
    const handleGenerate = (e) => {
        if (e) e.preventDefault();
        if (!userData.dob || !userData.name) {
            setFormError("Please enter a name and date of birth.");
            return;
        }
        setFormError('');

        try {
            // Use the imported calculator functions
            const mainReport = calculateNumerology(userData.dob);
            console.log('Main Report:', mainReport);

            if (mainReport) {
                // Store the report
                setReport({ ...mainReport, name: userData.name, dob: new Date(userData.dob + 'T00:00:00') });

                // Use the imported dashaCalculator
                const maha = dashaCalculator.calculateMahaDasha(mainReport.dob, mainReport.basicNumber);
                const yearly = dashaCalculator.calculateYearlyDasha(mainReport.dob, mainReport.basicNumber);
                const monthly = dashaCalculator.calculateMonthlyDasha(yearly);
                const daily = dashaCalculator.calculateDailyDasha(monthly);
                setDashaReport({ mahaDashaTimeline: maha, yearlyDashaTimeline: yearly, monthlyDashaTimeline: monthly, dailyDashaTimeline: daily });

                setActiveTab('Welcome');
            } else {
                console.error('Main report is null');
                setFormError('Failed to generate report. Please check the date format.');
            }
        } catch (error) {
            console.error('Error generating report:', error);
            setFormError(`Error: ${error.message}`);
        }
    };

    // UPDATED: Removed 'Name Analysis', 'Asset Vibration', and 'Education'
    const tabs = ['Welcome', 'Foundational Analysis', 'Advanced Dasha', 'Forecast', 'Remedies & Guidance', 'Numerology Traits'];

    const renderTabContent = () => {
        if (!report) return null;

        // Props for tabs that need them
        const commonProps = { report, isPremium: false, onUpgradeClick: () => {}, language };
        const dashaProps = {
            dashaReport,
            baseKundliGrid: report.baseKundliGrid,
            basicNumber: report.basicNumber,
            destinyNumber: report.destinyNumber,
            foundationalYogas: report.yogas,
            language
        };

        switch (activeTab) {
            case 'Welcome':
                return <WelcomeTab report={report} userData={userData} language={language} />;
            case 'Foundational Analysis':
                return <FoundationalAnalysisTab analysis={report.recurringNumbersAnalysis} yogas={report.yogas} specialInsights={report.specialInsights} language={language} />;
            case 'Advanced Dasha':
                return <AdvancedDashaTab {...dashaProps} />;
            case 'Forecast':
                return <ForecastTab report={report} dashaReport={dashaReport} gender={userData.gender} language={language} />;
            case 'Remedies & Guidance':
                return <RemediesAndGuidanceTab report={report} language={language} />;
            case 'Numerology Traits':
                return <NumerologyTraitsTab report={report} gender={userData.gender} language={language} />;
            default:
                return <PlaceholderTab name={activeTab} />;
        }
    };

    return (
        <CosmicBackground density={140} useVideo={true}>
            <div className="min-h-screen relative px-4 md:px-6 py-6">
                <div className="max-w-5xl mx-auto relative z-10">
                    {/* Back Button and Language Selector */}
                    <div className="flex justify-between items-center mb-6">
                        {/* Language Selector */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setLanguage('en')}
                                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                                    language === 'en'
                                        ? 'bg-gradient-to-r from-cyan-600/30 to-purple-600/30 border border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/20'
                                        : 'text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/20'
                                }`}
                            >
                                EN
                            </button>
                            <button
                                onClick={() => setLanguage('hi')}
                                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                                    language === 'hi'
                                        ? 'bg-gradient-to-r from-cyan-600/30 to-purple-600/30 border border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/20'
                                        : 'text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/20'
                                }`}
                            >
                                HI
                            </button>
                            <button
                                onClick={() => setLanguage('en-hi')}
                                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                                    language === 'en-hi'
                                        ? 'bg-gradient-to-r from-cyan-600/30 to-purple-600/30 border border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/20'
                                        : 'text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/20'
                                }`}
                            >
                                EN-HI
                            </button>
                        </div>

                        {/* Back Button */}
                        <button
                            onClick={handleBackToHome}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-4 py-2 rounded-md text-sm font-medium transition duration-200"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </button>
                    </div>

                    {/* Futuristic Gate Header */}
                    <div className="relative w-full h-40 mb-8 overflow-hidden rounded-xl border border-cyan-500/20">
                        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/40 via-gray-950 to-black" />
                        <div className="absolute inset-0" style={{
                            backgroundImage: `
                                linear-gradient(to right, rgba(34, 211, 238, 0.1) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
                            `,
                            backgroundSize: '40px 40px',
                            transform: 'perspective(500px) rotateX(60deg)',
                            transformOrigin: 'center bottom'
                        }} />
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

                    {!report ? (
                        /* Introduction Page */
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-gray-900/60 backdrop-blur-md p-8 rounded-xl border border-cyan-500/20 shadow-2xl">
                                <h2 className="text-2xl font-bold text-center text-cyan-300 mb-6">
                                    Enter Your Details
                                </h2>

                                <div className="space-y-6">
                                    <div className="group relative">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                                        <input
                                            type="text"
                                            value={userData.name}
                                            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                            placeholder="YOUR FULL NAME"
                                            className="relative w-full px-6 py-5 bg-gray-950 border border-gray-800 rounded-lg focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 text-gray-300 text-center tracking-widest uppercase outline-none placeholder-gray-600"
                                        />
                                    </div>

                                    <div className="group relative">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                                        <input
                                            type="date"
                                            value={userData.dob}
                                            onChange={(e) => setUserData({ ...userData, dob: e.target.value })}
                                            className="relative w-full px-6 py-5 bg-gray-950 border border-gray-800 rounded-lg focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 text-gray-300 text-center tracking-widest uppercase outline-none"
                                            style={{ colorScheme: 'dark' }}
                                        />
                                    </div>

                                    <div className="group relative">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                                        <select
                                            value={userData.gender}
                                            onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
                                            className="relative w-full px-6 py-5 bg-gray-950 border border-gray-800 rounded-lg focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 text-gray-300 text-center tracking-widest uppercase outline-none"
                                        >
                                            <option className="bg-gray-950 text-gray-300">Male</option>
                                            <option className="bg-gray-950 text-gray-300">Female</option>
                                            <option className="bg-gray-950 text-gray-300">Other</option>
                                        </select>
                                    </div>

                                    <button
                                        onClick={handleGenerate}
                                        className="w-full py-4 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg shadow-cyan-500/20"
                                    >
                                        INITIATE ANALYSIS
                                    </button>

                                    {formError && (
                                        <p className="text-center text-red-400 text-sm">{formError}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Analysis Results */
                        <div>
                            <div className="mb-4 border-b border-cyan-400/20 flex flex-wrap">
                                {tabs.map(tab => (
                                    <button key={tab} onClick={() => setActiveTab(tab)} className={`py-2 px-4 font-medium transition-colors duration-300 ${activeTab === tab ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-cyan-200/70 hover:text-cyan-300'}`}>
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