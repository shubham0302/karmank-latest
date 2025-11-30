import React, { useState } from 'react';
import Card from '../Card';
import SectionTitle from '../SectionTitle';
import { getText } from '../../utils/helpers';
import { getSpecialInsights } from '../../utils/localData';

const ShaktiBeejMantraTab = ({ report, language = 'en' }) => {
    // Static Shakti Beej Mantras data (reference data, not user-specific)
    const shaktiBeejMantras = {
        wealth: {
            purpose: { en: "Wealth & Prosperity", hi: "धन और समृद्धि", "en-hi": "Dhan aur Samriddhi" },
            beej: { en: "ॐ श्रीं", hi: "ॐ श्रीं", "en-hi": "Om Shreem" },
            deity: { en: "Lakshmi", hi: "लक्ष्मी", "en-hi": "Lakshmi" },
            day: { en: "Friday", hi: "शुक्रवार", "en-hi": "Shukravar" },
            mala: { en: "Rudraksha Mala (108 beads)", hi: "रुद्राक्ष माला (108 मनके)", "en-hi": "Rudraksh Mala" },
            count: "21,000 or multiples",
            notes: { en: "Chant for financial growth", hi: "वित्तीय वृद्धि के लिए जप करें", "en-hi": "Chant for financial growth" }
        },
        health: {
            purpose: { en: "Health & Vitality", hi: "स्वास्थ्य और जीवन शक्ति", "en-hi": "Swasthya aur Jeevan Shakti" },
            beej: { en: "ॐ हूं", hi: "ॐ हूं", "en-hi": "Om Hum" },
            deity: { en: "Hanuman", hi: "हनुमान", "en-hi": "Hanuman" },
            day: { en: "Tuesday", hi: "मंगलवार", "en-hi": "Mangalvar" },
            mala: { en: "Rudraksha Mala (108 beads)", hi: "रुद्राक्ष माला (108 मनके)", "en-hi": "Rudraksh Mala" },
            count: "21,000 or multiples",
            notes: { en: "Chant for strength and vitality", hi: "शक्ति और ऊर्जा के लिए जप करें", "en-hi": "Chant for strength" }
        }
    };

    const [selectedPurpose, setSelectedPurpose] = useState(Object.keys(shaktiBeejMantras)[0]);
    const mantraData = shaktiBeejMantras[selectedPurpose];
    
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
                    {Object.entries(shaktiBeejMantras).map(([key, value]) => (
                        <option key={key} value={key}>{getText(value.purpose, language)}</option>
                    ))}
                </select>
            </div>

            {mantraData && (
                <div>
                    <div className="text-center mb-6">
                        <p className="text-5xl font-bold text-cyan-300">{getText(mantraData.beej, language)}</p>
                        {/* Use selectedPurpose for the title, as it's the key */}
                        <p className="text-2xl text-yellow-400">{getText(shaktiBeejMantras[selectedPurpose].purpose, language)}</p>
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