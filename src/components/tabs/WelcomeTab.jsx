import React, { useMemo } from 'react';
import Card from '../Card';
import SectionTitle from '../SectionTitle';
import StaticVedicKundli from '../StaticVedicKundli';
import { combinationInsights, DATA } from '../../data/data'; // Import from data.js
import { getText } from '../../utils/helpers'; // Import getText

const WelcomeTab = ({ report }) => {
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

        // Using 'en' as a default, pass language as a prop if needed
        const topTraits = sortedNumbers.slice(0, 3).map(num => 
            getText(DATA.numberDetails[num].coreVibration, 'en')
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
    }, [report]);

    const insightKey = `${report.basicNumber}-${report.destinyNumber}`;
    // Using 'en' as a default
    const snapshotDescription = getText(combinationInsights[insightKey], 'en') || "No specific insight available for this combination.";
    
    return (
        <div className="space-y-6">
            <Card className="bg-indigo-900/30 border-indigo-400">
                <h3 className="text-xl font-bold text-indigo-300 mb-3">Your Numerology Snapshot</h3>
                <p className="text-indigo-200 whitespace-pre-wrap">{snapshotDescription}</p>
            </Card>

            <div className="grid md:grid-cols-2 gap-6 text-center">
                <Card><p className="text-sm text-yellow-500">Basic Number (Moolank)</p><p className="text-5xl font-bold">{report.basicNumber}</p></Card>
                <Card><p className="text-sm text-yellow-500">Destiny Number (Bhagyank)</p><p className="text-5xl font-bold">{report.destinyNumber}</p></Card>
            </div>
            
            <Card>
                <h3 className="text-xl font-bold text-center text-yellow-300 mb-4">Base Kundli</h3>
                <div className="flex justify-center">
                    <StaticVedicKundli grid={report.baseKundliGrid} />
                </div>
            </Card>

            <Card>
                <SectionTitle>Core Vibrations Based on Vedic Kundli Grid</SectionTitle>
                <div className="space-y-4">
                    {kundliNumbers.map(num => {
                        const isDestiny = num === report.destinyNumber;
                        // Using 'en' as a default
                        const description = isDestiny 
                            ? getText(DATA.destinyNumberDetails[num].description, 'en') 
                            : getText(DATA.numberDetails[num].description, 'en');
                        const name = getText(DATA.numberDetails[num].name, 'en');
                        
                        return (
                            <div key={num} className="p-3 bg-gray-900/50 rounded-md">
                                <h4 className="font-bold text-yellow-400 flex items-center">
                                    {isDestiny && <span className="mr-2 text-xl">🌟</span>}
                                    {num === report.basicNumber && !isDestiny && <span className="mr-2 text-xl">⭐</span>}
                                    Number {num} – {name}
                                    {isDestiny && <span className="ml-2 text-xs font-normal bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">Destiny Number</span>}
                                    {num === report.basicNumber && !isDestiny && <span className="ml-2 text-xs font-normal bg-rose-500/20 text-rose-300 px-2 py-1 rounded-full">Basic Number</span>}
                                </h4>
                                <p className="text-sm text-gray-300 mt-1">{description}</p>
                                {report.baseKundliGrid[num] > 1 && (
                                    <p className="text-xs text-cyan-300 italic mt-1">This number appears multiple times in the grid, amplifying its influence (see Foundational Analysis tab).</p>
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
    );
};

export default WelcomeTab;