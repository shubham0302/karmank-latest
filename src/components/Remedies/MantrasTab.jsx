import React from 'react';
import Card from '../Card';
import { DATA } from '../../data/data';
import { getText } from '../../utils/helpers';

const MantrasTab = ({ report }) => {
    // Assuming 'language' prop will be passed, defaulting to 'en' for now
    const language = 'en'; 
    const uniqueNumbers = [...new Set([report.basicNumber, report.destinyNumber])];

    const MantraCard = ({ number }) => {
        const mantraData = DATA.mantraRemedies[number];
        if (!mantraData) return null;

        return (
            <Card>
                <h2 className="text-2xl font-bold text-yellow-400 mb-4">
                    Mantra for Number {number} ({getText(mantraData.planet, language)})
                </h2>
                <div className="mb-4">
                    <p className="text-lg text-cyan-300 font-semibold">{getText(mantraData.mantra, language)}</p>
                    {/* <p className="text-sm text-gray-400">{getText(mantraData.transliteration, language)}</p> */}
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