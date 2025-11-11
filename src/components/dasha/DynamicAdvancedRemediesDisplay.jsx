import React, { useMemo } from 'react';
import Card from '../Card';
import SectionTitle from '../SectionTitle';
import { DATA } from '../../data/data'; // Import DATA
import { getText } from '../../utils/helpers'; // Import getText

const DynamicAdvancedRemediesDisplay = ({ dynamicGrid }) => {
    // Using 'en' as a default, pass language as a prop if needed
    const language = 'en'; 
    const applicableRemedies = useMemo(() => {
        const remedies = [];
        if (!dynamicGrid) return remedies;
        dynamicGrid.forEach((count, number) => {
            if (count > 3) {
                const remedy = DATA.multipleNumberRemedies[number];
                if (remedy) {
                    remedies.push({
                        number,
                        focus: getText(remedy.focus, language),
                        recommendation: getText(remedy.recommendation, language)
                    });
                }
            }
        });
        return remedies;
    }, [dynamicGrid, language]);

    if (applicableRemedies.length === 0) {
        return null; // Don't render the card if there are no remedies
    }

    return (
        <Card>
            <SectionTitle>Dynamic Advanced Remedies</SectionTitle>
            <p className="mb-4 text-yellow-200/70 text-sm">These remedies are triggered because the active Dasha(s) have caused certain numbers to appear more than three times in your chart, requiring special attention.</p>
            <div className="space-y-4">
                {applicableRemedies.map(remedy => (
                    <div key={remedy.number} className="p-4 bg-indigo-900/40 border-l-4 border-indigo-400 rounded-r-lg">
                        <h3 className="text-xl font-bold text-indigo-300">For Amplified Number {remedy.number}: {remedy.focus}</h3>
                        <p className="mt-2 text-gray-300">{remedy.recommendation}</p>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default DynamicAdvancedRemediesDisplay;