import React, { useState, useMemo } from 'react';
import Card from '../Card';
import SectionTitle from '../SectionTitle';
import NlgSummaryComponent from '../NlgSummaryComponent';
import VedicDashaKundli from '../dasha/VedicDashaKundli';
import DynamicAdvancedRemediesDisplay from '../dasha/DynamicAdvancedRemediesDisplay';
import DynamicSpecialGuidanceDisplay from '../dasha/DynamicSpecialGuidanceDisplay';
import { DATA } from '../../data/data';
import { analyzeRecurringNumbers, checkAdvancedYoga } from '../../utils/helpers';
import { getText } from '../../utils/helpers';

const AdvancedDashaTab = ({ dashaReport, baseKundliGrid, basicNumber, destinyNumber, foundationalYogas }) => {
    const [activeSubTab, setActiveSubTab] = useState('maha');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    // Using 'en' as a default, pass language as a prop if needed
    const language = 'en'; 

    if (!dashaReport) return <Card><p className="text-center">Generating Advanced Dasha Report...</p></Card>;
    const targetDate = new Date(selectedDate + 'T00:00:00');

    const currentMaha = dashaReport.mahaDashaTimeline.find(d => targetDate >= d.startDate && targetDate <= d.endDate);
    const currentYearly = dashaReport.yearlyDashaTimeline.find(d => targetDate >= d.startDate && targetDate <= d.endDate);
    const currentMonthly = dashaReport.monthlyDashaTimeline.find(d => targetDate >= d.startDate && targetDate <= d.endDate);
    const currentDaily = dashaReport.dailyDashaTimeline.find(d => d.date.getTime() === targetDate.getTime());

    const activeDashaNumbersForKundli = useMemo(() => {
        const active = {};
        if (currentMaha) active.maha = currentMaha.dashaNumber;
        if (currentYearly && ['yearly', 'monthly', 'daily'].includes(activeSubTab)) active.yearly = currentYearly.dashaNumber;
        if (currentMonthly && ['monthly', 'daily'].includes(activeSubTab)) active.monthly = currentMonthly.dashaNumber;
        if (currentDaily && activeSubTab === 'daily') active.daily = currentDaily.dashaNumber;
        return active;
    }, [activeSubTab, currentMaha, currentYearly, currentMonthly, currentDaily]);

    const { dynamicAnalysis, nlgPrompt } = useMemo(() => {
        const tempGrid = [...baseKundliGrid];
        const activeNumbers = Object.values(activeDashaNumbersForKundli);
        activeNumbers.forEach(num => {
            if(num) tempGrid[num]++;
        });

        const allPossibleYogas = new Set();
        Object.values(DATA.yogaDetails).forEach(yoga => {
            let isPresent = false;
            if (yoga.activation_rules) {
                isPresent = checkAdvancedYoga(yoga.activation_rules, tempGrid);
            } else if (yoga.numbers && Array.isArray(yoga.numbers)) {
                isPresent = yoga.numbers.every(num => tempGrid[num] > 0);
                if (isPresent && yoga.empty && yoga.empty.length > 0) {
                    if (yoga.empty.some(num => tempGrid[num] > 0)) {
                        isPresent = false;
                    }
                }
            }
            if(isPresent) allPossibleYogas.add(getText(yoga.name, language));
        });

        const foundationalYogaNames = new Set(foundationalYogas.map(y => getText(y.name, language)));
        const dynamicYogaNames = [...allPossibleYogas].filter(name => !foundationalYogaNames.has(name));
        const dynamicYogas = Object.values(DATA.yogaDetails).filter(yoga => dynamicYogaNames.includes(getText(yoga.name, language)));

        const traitAnalysis = {};
        Object.entries(activeDashaNumbersForKundli).forEach(([dashaType, number]) => {
            if (number) {
                if (!traitAnalysis[number]) {
                    traitAnalysis[number] = { sources: [], details: DATA.numberDetails[number] };
                }
                traitAnalysis[number].sources.push(dashaType);
            }
        });

        const uniqueActiveNumbers = Object.keys(traitAnalysis).map(Number).sort();
        let combinedNote = null;
        if (uniqueActiveNumbers.length > 1) {
            const key = uniqueActiveNumbers.join('-');
            if(DATA.combinedDashaInsights[key]) {
                combinedNote = getText(DATA.combinedDashaInsights[key], language);
            }
        }

        const dynamicMultiplicityAnalysis = [];
        const fullRecurringAnalysis = analyzeRecurringNumbers(tempGrid, destinyNumber);
        fullRecurringAnalysis.forEach(analysis => {
            if (tempGrid[analysis.number] > baseKundliGrid[analysis.number]) {
                dynamicMultiplicityAnalysis.push(analysis);
            }
        });

        const analysisResult = { dynamicYogas, traitAnalysis, combinedNote, dynamicMultiplicityAnalysis, tempGrid };

        let prompt = `You are a Vedic numerologist summarizing the energy of a specific date: ${targetDate.toLocaleDateString()}.
        Based on the data below, provide a 3-4 sentence summary of the overall theme for this day.
        Active Dasha Numbers:
        ${currentMaha ? `- Maha Dasha: ${currentMaha.dashaNumber}\n` : ''}
        ${currentYearly ? `- Yearly Dasha: ${currentYearly.dashaNumber}\n` : ''}
        ${currentMonthly ? `- Monthly Dasha: ${currentMonthly.dashaNumber}\n` : ''}
        ${currentDaily ? `- Daily Dasha: ${currentDaily.dashaNumber}\n` : ''}

        ${analysisResult.combinedNote ? `Combined Dasha Insight: ${analysisResult.combinedNote}\n` : ''}

        Dynamically Formed Yogas:
        ${analysisResult.dynamicYogas.length > 0 ?
            analysisResult.dynamicYogas.map(y => `- ${getText(y.name, language)}: ${getText(y.description, language)}`).join('\n') : "None"}

        Focus on the primary energies at play and give a brief, actionable piece of advice.`;

        return { dynamicAnalysis: analysisResult, nlgPrompt: prompt };

    }, [baseKundliGrid, activeDashaNumbersForKundli, foundationalYogas, destinyNumber, targetDate, currentMaha, currentYearly, currentMonthly, currentDaily, language]);

    const formatDate = (date) => date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const subTabs = [{ key: 'maha', label: 'Maha' }, { key: 'yearly', label: 'Yearly' }, { key: 'monthly', label: 'Monthly' }, { key: 'daily', label: 'Daily' }];

    const renderContent = () => {
        const timelineMap = { maha: dashaReport.mahaDashaTimeline, yearly: dashaReport.yearlyDashaTimeline, monthly: dashaReport.monthlyDashaTimeline };
        const activeDashaMap = { maha: currentMaha, yearly: currentYearly, monthly: currentMonthly };

        if (activeSubTab === 'daily') {
            return (
                <div className="text-center p-8 bg-gray-900/50 rounded-lg h-full flex flex-col justify-center">
                    {currentDaily ? (
                        <>
                            <p className="text-gray-400">Dasha for {formatDate(targetDate)}</p>
                            <p className="text-7xl font-bold my-4 text-yellow-400">{currentDaily.dashaNumber}</p>
                        </>
                    ) : <p className="text-2xl font-bold">Could not calculate Dasha for this day.</p>}
                </div>
            );
        }

        const timeline = timelineMap[activeSubTab];
        const activeDasha = activeDashaMap[activeSubTab];
        let startIndex = 0;
        if (activeDasha) {
            const activeIndex = timeline.findIndex(d => d.startDate.getTime() === activeDasha.startDate.getTime());
            startIndex = Math.max(0, activeIndex - 5);
        }

        const slice = timeline.slice(startIndex, startIndex + 20);
        return (
            <div className="max-h-96 overflow-y-auto">
                <table className="w-full text-left text-sm">
                    <thead><tr className="border-b border-yellow-400/30">
                        {activeSubTab === 'yearly' && <th className="p-2 text-yellow-500">Year</th>}
                        <th className="p-2 text-yellow-500">Dasha</th><th className="p-2 text-yellow-500">Start</th><th className="p-2 text-yellow-500">End</th>
                    </tr></thead>
                    <tbody>
                        {slice.map((p, i) => (
                            <tr key={i} className={`border-b border-gray-700 ${activeDasha && p.startDate.getTime() === activeDasha.startDate.getTime() ? 'bg-yellow-500/20' : ''}`}>
                                {activeSubTab === 'yearly' && <td className="p-2">{p.year}</td>}
                                <td className="p-2 font-bold">{p.dashaNumber}</td><td className="p-2">{formatDate(p.startDate)}</td><td className="p-2">{formatDate(p.endDate)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <NlgSummaryComponent title={`AI Summary for ${formatDate(targetDate)}`} prompt={nlgPrompt} />
            <Card>
                <SectionTitle>Advanced Dasha System</SectionTitle>
                <div className="mb-4">
                    <label htmlFor="dasha-date" className="block text-sm font-medium text-yellow-500 mb-1">Select Date for Analysis</label>
                    <input type="date" id="dasha-date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="mt-1 block w-full md:w-1/3 bg-gray-700 border-gray-600 rounded-md shadow-sm p-2" />
                </div>
                <div className="grid lg:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-xl font-bold text-center text-yellow-300 mb-2">Dasha Kundli ({activeSubTab})</h3>
                        <VedicDashaKundli 
                            baseGrid={baseKundliGrid} 
                            activeNumbers={activeDashaNumbersForKundli} 
                            basicNumber={basicNumber} 
                            destinyNumber={destinyNumber} 
                        />
                        <div className="mt-4 text-center p-2 bg-gray-900/50 rounded-lg text-xs">
                            <p className="text-gray-300">
                                Maha: <span className="font-bold text-purple-400">{currentMaha ? currentMaha.dashaNumber : 'N/A'}</span> |
                                Yearly: <span className="font-bold text-indigo-400">{currentYearly ? currentYearly.dashaNumber : 'N/A'}</span> | 
                                Monthly: <span className="font-bold text-emerald-400">{currentMonthly ? currentMonthly.dashaNumber : 'N/A'}</span> |
                                Daily: <span className="font-bold text-fuchsia-400">{currentDaily ? currentDaily.dashaNumber : 'N/A'}</span>
                            </p>
                        </div>
                    </div>
                    <div>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {subTabs.map(tab => (
                                <button key={tab.key} onClick={() => setActiveSubTab(tab.key)} className={`py-2 px-4 rounded-md font-semibold transition-colors duration-200 text-sm ${activeSubTab === tab.key ? 'bg-yellow-500 text-indigo-900' : 'bg-gray-700 hover:bg-gray-600 text-yellow-200/80'}`}>
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                        <div className="mt-4">{renderContent()}</div>
                    </div>
                </div>
            </Card>

            <Card>
                <SectionTitle>Traits Influenced by Dashas on {formatDate(targetDate)}</SectionTitle>
                {Object.keys(dynamicAnalysis.traitAnalysis).length > 0 ? (
                    <div className="space-y-4">
                        {dynamicAnalysis.combinedNote && (
                            <div className="p-3 bg-fuchsia-500/20 border-l-4 border-fuchsia-400 rounded-r-lg">
                                <h4 className="font-bold text-fuchsia-300">Combined Insight</h4>
                                <p className="text-sm text-gray-300">{dynamicAnalysis.combinedNote}</p>
                            </div>
                        )}
                        {Object.entries(dynamicAnalysis.traitAnalysis).map(([number, data]) => (
                            <div key={number} className="p-3 bg-gray-900/50 rounded-md">
                                <h4 className="font-bold text-yellow-400">Number {number}: {getText(data.details.name, language)}</h4>
                                <p className="text-xs text-yellow-200/80 italic mb-2">
                                    These traits are derived from the active {data.sources.join(' & ')} Dasha.
                                    {data.sources.length > 1 && <span className="font-bold text-red-400"> (Amplified Influence)</span>}
                                </p>
                                <p className="text-sm text-gray-300">{getText(data.details.description, language)}</p>
                            </div>
                        ))}
                    </div>
                ) : <p>No specific dasha influences to analyze for this period.</p>}
            </Card>

            {dynamicAnalysis.dynamicMultiplicityAnalysis.length > 0 && (
                 <Card>
                    <SectionTitle>Impact of Dasha-Induced Multiplicity</SectionTitle>
                    <div className="space-y-4">
                        {dynamicAnalysis.dynamicMultiplicityAnalysis.map(item => (
                             <div key={item.number} className="p-3 bg-cyan-500/10 border-l-4 border-cyan-400 rounded-r-lg">
                                <h4 className="font-bold text-cyan-300">Increased Influence of Number {item.number}</h4>
                                <p className="text-xs text-cyan-200/80 italic mb-2">
                                    The active Dasha(s) have increased the count of Number {item.number} to {item.occurrences}, introducing the following traits:
                                </p>
                                <p className="text-sm text-gray-300">{item.influence}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            <Card>
                <SectionTitle>Dynamic Yogas for Selected Dasha</SectionTitle>
                <div className="text-center bg-yellow-900/30 text-yellow-300 p-2 rounded-md mb-4 text-sm">
                    <p>This Yoga is generated based on the currently active Dashas on {formatDate(targetDate)}.</p>
                </div>
                {dynamicAnalysis.dynamicYogas.length > 0 ? (
                    <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                        {dynamicAnalysis.dynamicYogas.map(yoga => (
                            <div key={getText(yoga.name, language)} className="bg-gray-900/30 p-3 rounded-md">
                                <strong className="text-yellow-500">{getText(yoga.name, language)}</strong>
                                <p className="text-sm text-gray-300">{getText(yoga.description, language)}</p>
                                {yoga.traits && (
                                    <ul className="list-disc list-inside text-xs mt-1 text-gray-400">
                                        {yoga.traits.map(trait => <li key={getText(trait, language)}>{getText(trait, language)}</li>)}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                ) : <p>No new yogas are dynamically formed by the selected dasha period.</p>}
            </Card>

            <div className="space-y-6 mt-6">
                <DynamicAdvancedRemediesDisplay dynamicGrid={dynamicAnalysis.tempGrid} />
                <DynamicSpecialGuidanceDisplay 
                    dynamicGrid={dynamicAnalysis.tempGrid} 
                    destinyNumber={destinyNumber}
                    mahaDasha={currentMaha?.dashaNumber}
                    annualDasha={currentYearly?.dashaNumber}
                />
            </div>
        </div>
    );
};

export default AdvancedDashaTab;