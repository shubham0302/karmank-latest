import React, { useMemo } from 'react';
import Card from '../Card';
import SectionTitle from '../SectionTitle';
import { DATA } from '../../data/data';
import { getText } from '../../utils/helpers';

const AdvancedRemediesTab = ({ report }) => {
    // Assuming 'language' prop will be passed, defaulting to 'en' for now
    const language = 'en'; 

    const { baseKundliGrid } = report;
    const applicableRemedies = useMemo(() => {
        const remedies = [];
        baseKundliGrid.forEach((count, number) => {
            // Skip number 0 as it's not significant in numerology
            if (number === 0) return;

            if (count >= 2) {
                const remedy = DATA.multipleNumberRemedies[number];
                if (remedy) {
                    remedies.push({
                        number,
                        count,
                        focus: getText(remedy.focus, language),
                        recommendation: getText(remedy.recommendation, language)
                    });
                }
            }
        });
        return remedies;
    }, [baseKundliGrid, language]);

    return (
        <Card>
            <SectionTitle>Advanced Remedies for Amplified Numbers</SectionTitle>
            <p className="mb-6 text-yellow-200/70">This section provides specific recommendations when a number appears multiple times (two or more) in your chart, indicating amplified energy that may need balancing.</p>
            {applicableRemedies.length > 0 ? (
                <div className="space-y-6">
                    {applicableRemedies.map(remedy => (
                        <div key={remedy.number} className="p-4 bg-indigo-900/40 border-l-4 border-indigo-400 rounded-r-lg">
                            <h3 className="text-xl font-bold text-indigo-300">For Amplified Number {remedy.number} (appears {remedy.count}x): {remedy.focus}</h3>
                            <p className="mt-2 text-gray-300">{remedy.recommendation}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-400 p-4 bg-gray-900/50 rounded-md">No specific advanced remedies are required based on your chart. The energies of your recurring numbers are in balance.</p>
            )}
        </Card>
    );
};

export default AdvancedRemediesTab;