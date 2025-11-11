import React, { useState, useEffect, useMemo } from 'react';

// --- Core Data & Logic ---
import { combinationInsights, DATA } from './data/data';
import { calculateNumerology, dashaCalculator } from './utils/calculators';

// --- UI Components ---
import Card from './components/Card';
import SectionTitle from './components/SectionTitle';
import StaticVedicKundli from './components/StaticVedicKundli';
import NlgSummaryComponent from './components/NlgSummaryComponent';

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
    const [userData, setUserData] = useState({ dob: '', name: '', gender: 'Male' });
    const [report, setReport] = useState(null);
    const [dashaReport, setDashaReport] = useState(null);
    const [activeTab, setActiveTab] = useState('Welcome');
    const [formError, setFormError] = useState('');
    
    const handleGenerate = (e) => {
        if (e) e.preventDefault();
        if (!userData.dob || !userData.name) {
            setFormError("Please enter a name and date of birth.");
            return;
        }
        setFormError('');
        
        // Use the imported calculator functions
        const mainReport = calculateNumerology(userData.dob);
        
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
        }
    };

    // UPDATED: Removed 'Name Analysis', 'Asset Vibration', and 'Education'
    const tabs = ['Welcome', 'Foundational Analysis', 'Advanced Dasha', 'Forecast', 'Remedies & Guidance', 'Numerology Traits'];

    const renderTabContent = () => {
        if (!report) return null;

        // Props for tabs that need them
        const commonProps = { report, isPremium: false, onUpgradeClick: () => {} };
        const dashaProps = { 
            dashaReport, 
            baseKundliGrid: report.baseKundliGrid, 
            basicNumber: report.basicNumber, 
            destinyNumber: report.destinyNumber, 
            foundationalYogas: report.yogas 
        };

        switch (activeTab) {
            case 'Welcome': 
                return <WelcomeTab report={report} />;
            case 'Foundational Analysis': 
                return <FoundationalAnalysisTab analysis={report.recurringNumbersAnalysis} yogas={report.yogas} specialInsights={report.specialInsights} />;
            case 'Advanced Dasha': 
                return <AdvancedDashaTab {...dashaProps} />;
            case 'Forecast': 
                return <ForecastTab report={report} dashaReport={dashaReport} gender={userData.gender} />;
            case 'Remedies & Guidance': 
                return <RemediesAndGuidanceTab report={report} />;
            case 'Numerology Traits': 
                return <NumerologyTraitsTab report={report} gender={userData.gender} />;
            default: 
                return <PlaceholderTab name={activeTab} />;
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <header className="text-center mb-8">
                <h1 className="text-5xl font-extrabold text-yellow-400 font-serif tracking-widest">KarmAnk</h1>
                <p className="text-yellow-200/70">Discover Your True Potential</p>
            </header>

            <Card className="mb-8">
                <form onSubmit={handleGenerate} className="grid md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-1">
                        <label htmlFor="name" className="block text-sm font-medium text-yellow-500">Name</label>
                        <input type="text" id="name" value={userData.name} onChange={e => setUserData({...userData, name: e.target.value})} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2" />
                    </div>
                    <div className="md:col-span-1">
                        <label htmlFor="dob" className="block text-sm font-medium text-yellow-500">Date of Birth</label>
                        <input type="date" id="dob" value={userData.dob} onChange={e => setUserData({...userData, dob: e.target.value})} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2" />
                    </div>
                    <div className="md:col-span-1">
                        <label htmlFor="gender" className="block text-sm font-medium text-yellow-500">Gender</label>
                        <select id="gender" value={userData.gender} onChange={e => setUserData({...userData, gender: e.target.value})} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2">
                            <option>Male</option>
                            <option>Female</option>
                        </select>
                    </div>
                    <div className="md:col-span-1">
                        <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-indigo-900 font-bold py-2 px-4 rounded-md transition duration-300">Generate Report</button>
                    </div>
                </form>
                {formError && <p className="text-red-400 text-center mt-4">{formError}</p>}
            </Card>

            {report ? (
                <div>
                    <div className="mb-4 border-b border-yellow-400/20 flex flex-wrap">
                        {tabs.map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`py-2 px-4 font-medium transition-colors duration-300 ${activeTab === tab ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-yellow-200/70 hover:text-yellow-300'}`}>
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="mt-6">{renderTabContent()}</div>
                </div>
            ) : (
                <div className="text-center text-yellow-200/80 p-8 bg-gray-800/50 rounded-lg">
                    <p>Please enter a name and date of birth to generate your Vedic Numerology report.</p>
                </div>
            )}
        </div>
    );
}