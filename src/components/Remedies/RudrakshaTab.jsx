import React from 'react';
import Card from '../Card';
import { DATA } from '../../data/data';
import { getText } from '../../utils/helpers';

const RudrakshaTab = ({ report }) => {
    // Assuming 'language' prop will be passed, defaulting to 'en' for now
    const language = 'en';

    if (!report) {
        return <Card><p className="text-red-400">Report data is not available.</p></Card>;
    }

    if (!report.basicNumber || !report.destinyNumber) {
        return <Card><p className="text-red-400">Basic number or destiny number is missing.</p></Card>;
    }

    const uniqueNumbers = [...new Set([report.basicNumber, report.destinyNumber])].filter(Boolean);

    if (uniqueNumbers.length === 0) {
        return <Card><p className="text-red-400">No valid numbers found.</p></Card>;
    }

    const RudrakshaCard = ({ number }) => {
        const rudrakshaData = DATA.rudrakshaRemedies?.[number];
        const advancedData = DATA.advancedRudrakshaRemedies?.[number];

        if (!rudrakshaData || !advancedData) {
            return (
                <Card>
                    <p className="text-yellow-400">Rudraksha data not available for number {number}.</p>
                </Card>
            );
        }

        return (
            <Card>
                <h2 className="text-2xl font-bold text-yellow-400 mb-4">
                    Rudraksha for Number {number} ({getText(rudrakshaData.planet, language)})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold text-yellow-300 text-lg mb-2">Details</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-gray-900/50 p-3 rounded-md"><strong>Primary Mukhi:</strong> {getText(advancedData.primary, language)}</div>
                            <div className="bg-gray-900/50 p-3 rounded-md"><strong>Secondary Mukhi:</strong> {getText(advancedData.secondary, language)}</div>
                            <div className="bg-gray-900/50 p-3 rounded-md"><strong>Deity:</strong> {getText(rudrakshaData.deity, language)}</div>
                            <div className="bg-gray-900/50 p-3 rounded-md"><strong>Wearing Day:</strong> {getText(rudrakshaData.wearingDay, language)}</div>
                            <div className="bg-gray-900/50 p-3 rounded-md"><strong>Finger:</strong> {getText(rudrakshaData.finger, language)}</div>
                            <div className="bg-gray-900/50 p-3 rounded-md"><strong>Metal:</strong> {getText(rudrakshaData.metal, language)}</div>
                            <div className="bg-gray-900/50 p-3 rounded-md col-span-2"><strong>Reasoning:</strong> {getText(advancedData.reasoning, language)}</div>
                        </div>
                         <div className="mt-4 bg-gray-900/50 p-3 rounded-md">
                            <h4 className="font-semibold text-yellow-300 mb-1">Mantra</h4>
                            <p className="text-cyan-300 italic">{getText(rudrakshaData.mantra, language)}</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-yellow-300 text-lg mb-2">Benefits</h3>
                        <div className="space-y-2 text-sm">
                            <p><strong>General:</strong> {getText(rudrakshaData.benefits.general, language)}</p>
                            <p><strong>Spiritual:</strong> {getText(rudrakshaData.benefits.spiritual, language)}</p>
                            <p><strong>Health:</strong> {getText(rudrakshaData.benefits.health, language)}</p>
                        </div>
                        <div className="mt-4 bg-gray-900/50 p-3 rounded-md">
                            <h4 className="font-semibold text-yellow-300 mb-1">Wearing Method</h4>
                            <p className="text-sm">{getText(rudrakshaData.method, language)}</p>
                        </div>
                    </div>
                </div>
            </Card>
        );
    };

    try {
        return (
            <div className="space-y-6">
                {uniqueNumbers.map(num => <RudrakshaCard key={num} number={num} />)}
            </div>
        );
    } catch (error) {
        console.error('Error in RudrakshaTab:', error);
        return (
            <Card>
                <p className="text-red-400">An error occurred while loading Rudraksha data: {error.message}</p>
            </Card>
        );
    }
};

export default RudrakshaTab;