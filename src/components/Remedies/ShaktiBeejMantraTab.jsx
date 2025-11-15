import React, { useState } from 'react';
import Card from '../Card';
import SectionTitle from '../SectionTitle';
import { DATA } from '../../data/data';
import { getText } from '../../utils/helpers';

const ShaktiBeejMantraTab = () => {
    // Assuming 'language' prop will be passed, defaulting to 'en' for now
    const language = 'en'; 
    const [selectedPurpose, setSelectedPurpose] = useState(Object.keys(DATA.shaktiBeejMantras)[0]);
    const mantraData = DATA.shaktiBeejMantras[selectedPurpose];
    
    return (
        <Card>
            <SectionTitle>Shakti Beej Mantra Activation</SectionTitle>
            <div className="mb-6">
                <label htmlFor="purpose-select" className="block text-sm font-medium text-yellow-500 mb-2">Select Your Desired Purpose:</label>
                <select
                    id="purpose-select"
                    value={selectedPurpose}
                    onChange={(e) => setSelectedPurpose(e.target.value)}
                    className="w-full md:w-1/2 bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-yellow-500 block p-3"
                >
                    {Object.entries(DATA.shaktiBeejMantras).map(([key, value]) => (
                        <option key={key} value={key}>{getText(value.purpose, language)}</option>
                    ))}
                </select>
            </div>

            {mantraData && (
                <div>
                    <div className="text-center mb-6">
                        <p className="text-5xl font-bold text-cyan-300">{getText(mantraData.beej, language)}</p>
                        {/* Use selectedPurpose for the title, as it's the key */}
                        <p className="text-2xl text-yellow-400">{getText(DATA.shaktiBeejMantras[selectedPurpose].purpose, language)}</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-gray-900/50 p-3 rounded-md"><strong>Deity:</strong> {getText(mantraData.deity, language)}</div>
                        <div className="bg-gray-900/50 p-3 rounded-md"><strong>Purpose:</strong> {getText(mantraData.purpose, language)}</div>
                        <div className="bg-gray-900/50 p-3 rounded-md"><strong>Day:</strong> {getText(mantraData.day, language)}</div>
                        <div className="bg-gray-900/50 p-3 rounded-md"><strong>Mala:</strong> {getText(mantraData.mala, language)}</div>
                        <div className="bg-gray-900/50 p-3 rounded-md"><strong>Chant Count:</strong> {mantraData.count}</div>
                        <div className="bg-gray-900/50 p-3 rounded-md"><strong>Notes:</strong> {getText(mantraData.notes, language)}</div>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default ShaktiBeejMantraTab;