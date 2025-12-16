import React, { useMemo } from 'react';
import Card from '../Card';
import SectionTitle from '../SectionTitle';
import NlgSummaryComponent from '../NlgSummaryComponent';
import { combinationInsights, DATA } from '../../data/data'; // Import from data.js
import { getText } from '../../utils/helpers'; // Import getText

const WelcomeTab = ({ report, userData, language = 'en' }) => {
    const { kundliNumbers, coreVibrationSummary } = useMemo(() => {
        const numbers = new Set();
        report.baseKundliGrid.forEach((count, number) => {
            if (count > 0 && number > 0) {
                numbers.add(number);
            }
        });

        const sortedNumbers = Array.from(numbers);

        sortedNumbers.sort((a, b) => {
            const isADestiny = a === report.destinyNumber;
            const isBDestiny = b === report.destinyNumber;
            const isABasic = a === report.basicNumber;
            const isBBasic = b === report.basicNumber;

            if (isADestiny && !isBDestiny) return -1;
            if (isBDestiny && !isADestiny) return 1;
            if (isABasic && !isBBasic) return -1;
            if (isBBasic && !isABasic) return 1;
            return a - b;
        });

        const topTraits = sortedNumbers.slice(0, 3).map(num =>
            getText(DATA.numberDetails[num].coreVibration, language)
        );
        let summary = '';
        if (topTraits.length === 1) {
            summary = `Based on the above grid, the person is primarily influenced by ${topTraits[0]} core vibrations.`;
        } else if (topTraits.length === 2) {
            summary = `Based on the above grid, the person is primarily influenced by ${topTraits[0]} and ${topTraits[1]} core vibrations.`;
        } else if (topTraits.length > 2) {
            const lastTrait = topTraits.pop();
            summary = `Based on the above grid, the person is primarily influenced by ${topTraits.join(', ')}, and ${lastTrait} core vibrations.`;
        }

        return { kundliNumbers: sortedNumbers, coreVibrationSummary: summary };
    }, [report, language]);

    const insightKey = `${report.basicNumber}-${report.destinyNumber}`;
    const snapshotDescription = getText(combinationInsights[insightKey], language) || "No specific insight available for this combination.";

    // Process recurring numbers analysis
    const translatedAnalysis = useMemo(() => {
        if (!report.recurringAnalysis || report.recurringAnalysis.length === 0) return [];

        return report.recurringAnalysis.map(item => {
            const rule = DATA.recurringNumberInfluence[item.number];

            if (!rule) {
                return {
                    ...item,
                    influence: `This number appears ${item.occurrences} times in your chart, amplifying its influence on your life path.`
                };
            }

            let influence = [];
            const count = item.occurrences;
            const isDestinyMatch = item.isDestinyMatch || false;

            if (rule.base) influence.push(getText(rule.base, language));
            if (count >= 3 && rule.threeOrMore) influence.push(getText(rule.threeOrMore, language));
            if (isDestinyMatch && rule.withDestiny) influence.push(getText(rule.withDestiny, language));
            if (rule.evenCount && count % 2 === 0) influence.push(getText(rule.evenCount, language));
            if (rule.oddCount && count % 2 !== 0) influence.push(getText(rule.oddCount, language));

            return {
                ...item,
                influence: influence.join(' ')
            };
        });
    }, [report.recurringAnalysis, language]);

    // Generate NLG prompt for foundational analysis
    const nlgPrompt = useMemo(() => {
        if (!report.recurringAnalysis && !report.yogas) return null;

        let languageInstruction = "";
        if (language === 'hi') {
            languageInstruction = "You are a Vedic numerologist. Based on the following foundational chart analysis, write a 2-4 sentence summary of the person's key strengths and challenges in HINDI (हिंदी). Use Devanagari script. \n\n";
        } else if (language === 'en-hi') {
            languageInstruction = "You are a Vedic numerologist. Based on the following foundational chart analysis, write a 2-4 sentence summary of the person's key strengths and challenges in HINGLISH (Roman script with Hindi words). Use conversational Hindi-English mix. \n\n";
        } else {
            languageInstruction = "You are a Vedic numerologist. Based on the following foundational chart analysis, write a 2-4 sentence summary of the person's key strengths and challenges in ENGLISH. \n\n";
        }

        let prompt = languageInstruction;

        if (report.yogas && report.yogas.length > 0) {
            prompt += "Foundational Yogas Present:\n";
            report.yogas.forEach(yoga => {
                prompt += `- ${getText(yoga.name, language)}: ${getText(yoga.description, language)}\n`;
            });
        } else {
            prompt += "No significant foundational yogas are present.\n";
        }

        if (report.recurringAnalysis && report.recurringAnalysis.length > 0) {
            prompt += "\nInfluence of Recurring Numbers:\n";
            report.recurringAnalysis.forEach(item => {
                const influence = translatedAnalysis.find(a => a.number === item.number)?.influence || '';
                prompt += `- Number ${item.number} (appears ${item.occurrences} times): ${influence}\n`;
            });
        }

        if (report.specialInsights && report.specialInsights.length > 0) {
            prompt += "\nSpecial Foundational Insights:\n";
            report.specialInsights.forEach(insight => {
                prompt += `- ${getText(insight.title, language)}: ${getText(insight.text, language)}\n`;
            });
        }

        prompt += "\nSummarize the most important takeaways for the user in a gentle and empowering tone.";
        return prompt;
    }, [report, translatedAnalysis, language]);

    // Function to get cell background color based on number significance
    const getCellBackground = (num) => {
        const colors = [];

        if (report.destinyNumber === num) colors.push(DATA.colorMap.destiny);
        if (report.basicNumber === num) colors.push(DATA.colorMap.basic);

        if (colors.length === 0) {
            return report.baseKundliGrid[num] > 0 ? DATA.colorMap.dob : '#4b5563'; // Gray for empty
        }
        if (colors.length === 1) return colors[0];
        return `linear-gradient(135deg, ${colors.join(', ')})`;
    };

    return (
        <div className="space-y-6">
            {/* PAGE 1: Kundli, Snapshot, and Foundational Blueprint */}
            <div className="pdf-page-break-after space-y-6">
                {/* 1. Base Kundli and Numbers */}
                <Card>
                    <div className="grid lg:grid-cols-5 gap-6">
                        {/* Left Section - Base Kundli (3/5 width on large screens) */}
                        <div className="lg:col-span-3">
                            <h3 className="text-lg font-bold text-center text-yellow-300 mb-3">Base Kundli</h3>
                        <div className="flex justify-center items-center">
                            <div className="w-full max-w-xs">
                                <div className="grid grid-cols-3 gap-1.5 bg-gray-900/50 p-2 rounded-md aspect-square">
                                    {[3, 1, 9, 6, 7, 5, 2, 8, 4].map((num, i) => (
                                        <div
                                            key={i}
                                            style={{ background: getCellBackground(num) }}
                                            className="flex items-center justify-center text-xl font-bold rounded-md aspect-square text-white transition-all duration-300 ease-in-out shadow-lg"
                                        >
                                            {report.baseKundliGrid[num] > 0 ? String(num).repeat(report.baseKundliGrid[num]) : ''}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* Legend */}
                        <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs">
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded" style={{ backgroundColor: DATA.colorMap.basic }}></div>
                                <span className="text-white/70">Basic</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded" style={{ backgroundColor: DATA.colorMap.destiny }}></div>
                                <span className="text-white/70">Destiny</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded" style={{ backgroundColor: DATA.colorMap.dob }}></div>
                                <span className="text-white/70">DOB</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Numbers (2/5 width on large screens) */}
                    <div className="lg:col-span-2 flex flex-col justify-center space-y-3">
                        <div className="text-center p-4 bg-gradient-to-br from-rose-900/40 to-rose-800/20 border border-rose-700/50 rounded-lg">
                            <p className="text-xs text-rose-400 mb-0.5">Basic Number</p>
                            <p className="text-xs text-rose-300/70 mb-2">(Moolank)</p>
                            <p className="text-6xl font-bold text-rose-300">{report.basicNumber}</p>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-700/50 rounded-lg">
                            <p className="text-xs text-green-400 mb-0.5">Destiny Number</p>
                            <p className="text-xs text-green-300/70 mb-2">(Bhagyank)</p>
                            <p className="text-6xl font-bold text-green-300">{report.destinyNumber}</p>
                        </div>
                    </div>
                </div>
            </Card>

                {/* 2. Your Numerology Snapshot */}
                <Card className="bg-indigo-900/30 border-indigo-400">
                    <h3 className="text-xl font-bold text-indigo-300 mb-3">Your Numerology Snapshot</h3>
                    <p className="text-indigo-200 whitespace-pre-wrap">{snapshotDescription}</p>
                </Card>

                {/* 3. Your Foundational Blueprint (AI Summary) */}
                {nlgPrompt && <NlgSummaryComponent title="Your Foundational Blueprint" prompt={nlgPrompt} />}
            </div>

            {/* PAGE 2: Core Vibrations Based on Vedic Kundli Grid */}
            <div className="pdf-page-break-after">
                <Card>
                <SectionTitle>Core Vibrations Based on Vedic Kundli Grid</SectionTitle>
                <div className="space-y-4">
                    {kundliNumbers.map(num => {
                        const isDestiny = num === report.destinyNumber;
                        const description = isDestiny
                            ? getText(DATA.destinyNumberDetails[num].description, language)
                            : getText(DATA.numberDetails[num].description, language);
                        const name = getText(DATA.numberDetails[num].name, language);

                        return (
                            <div key={num} className="p-3 bg-gray-900/50 rounded-md">
                                <h4 className="font-bold text-yellow-400 flex items-center">
                                    {isDestiny && <span className="mr-2 text-xl">🌟</span>}
                                    {num === report.basicNumber && !isDestiny && <span className="mr-2 text-xl">⭐</span>}
                                    Number {num} – {name}
                                    {isDestiny && <span className="ml-2 text-xs font-normal bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">Destiny Number</span>}
                                    {num === report.basicNumber && !isDestiny && <span className="ml-2 text-xs font-normal bg-rose-500/20 text-rose-300 px-2 py-1 rounded-full">Basic Number</span>}
                                </h4>
                                <p className="text-sm text-white/90 mt-1">{description}</p>
                                {report.baseKundliGrid[num] > 1 && (
                                    <p className="text-xs text-cyan-300 italic mt-1">This number appears multiple times in the grid, amplifying its influence.</p>
                                )}
                            </div>
                        );
                    })}
                </div>
                {coreVibrationSummary && (
                    <div className="mt-6 p-3 bg-indigo-500/20 border-t-2 border-indigo-400">
                        <p className="text-center text-indigo-200 italic">{coreVibrationSummary}</p>
                    </div>
                )}
                </Card>
            </div>

            {/* PAGE 3: Foundational Yogas */}
            {report.yogas && report.yogas.length > 0 && (
                <div className="pdf-page-break-after">
                    <Card>
                        <SectionTitle>Foundational Yogas</SectionTitle>
                        <div className="text-center bg-blue-900/30 text-blue-300 p-2 rounded-md mb-4 text-sm">
                            <p>This Yoga is based on the individual's Base Chart.</p>
                        </div>
                        <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                            {report.yogas.map((yoga, idx) => (
                                <div key={idx} className="bg-gray-900/30 p-3 rounded-md">
                                    <strong className="text-yellow-500">{getText(yoga.name, language)}</strong>
                                    <p className="text-sm text-white/90">{getText(yoga.description, language)}</p>
                                    {yoga.traits && (
                                        <ul className="list-disc list-inside text-xs mt-1 text-white/70">
                                            {yoga.traits.map((trait, tIdx) => <li key={tIdx}>{getText(trait, language)}</li>)}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default WelcomeTab;