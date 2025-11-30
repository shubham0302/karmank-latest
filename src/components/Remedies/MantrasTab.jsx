import React from 'react';
import Card from '../Card';
import { getText } from '../../utils/helpers';
import { GradientText } from '../GradientText';
import { getMantraData, getRelevantNumbers } from '../../utils/localData';

const MantrasTab = ({ report, language = 'en' }) => {
    if (!report?.relevantData) {
        return <Card><p className="text-yellow-400">Report data not fully loaded.</p></Card>;
    }

    const uniqueNumbers = getRelevantNumbers(report);

    const MantraCard = ({ number }) => {
        const mantraData = getMantraData(report, number);
        if (!mantraData) return null;

        return (
            <Card>
                <GradientText as="h2" size="2xl" className="mb-4">
                    Mantra for Number {number} ({getText(mantraData.planet, language)})
                </GradientText>
                <div className="mb-4">
                    <p className="text-lg text-cyan-300 font-semibold">{getText(mantraData.mantra, language)}</p>
                    {/* <p className="text-sm text-white/70">{getText(mantraData.transliteration, language)}</p> */}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-gray-900/50 p-3 rounded-md"><strong>Deity:</strong> {getText(mantraData.deity, language)}</div>
                    <div className="bg-gray-900/50 p-3 rounded-md"><strong>Purpose:</strong> {getText(mantraData.purpose, language)}</div>
                    <div className="bg-gray-900/50 p-3 rounded-md"><strong>Metal:</strong> {getText(mantraData.metal, language)}</div>
                    <div className="bg-gray-900/50 p-3 rounded-md"><strong>Finger:</strong> {getText(mantraData.finger, language)}</div>
                    <div className="bg-gray-900/50 p-3 rounded-md"><strong>Day:</strong> {getText(mantraData.day, language)}</div>
                    <div className="bg-gray-900/50 p-3 rounded-md"><strong>Chant Count:</strong> {mantraData.count}</div>
                    <div className="bg-gray-900/50 p-3 rounded-md"><strong>Mala Type:</strong> {getText(mantraData.mala, language)}</div>
                    <div className="bg-gray-900/50 p-3 rounded-md col-span-2 md:col-span-1"><strong>Notes:</strong> {getText(mantraData.notes, language)}</div>
                </div>
            </Card>
        );
    };

    return (
        <div className="space-y-6">
            {uniqueNumbers.map(num => <MantraCard key={num} number={num} />)}
        </div>
    );
};

export default MantrasTab;