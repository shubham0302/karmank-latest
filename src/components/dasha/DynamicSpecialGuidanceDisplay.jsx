import React, { useMemo } from 'react';
import Card from '../Card';
import SectionTitle from '../SectionTitle';
import { checkForSpecialRemedies } from '../../utils/helpers'; // Import helper
import { getText } from '../../utils/helpers'; // Import getText

const DynamicSpecialGuidanceDisplay = ({ dynamicGrid, destinyNumber, mahaDasha, annualDasha }) => {
    const specialRemedies = useMemo(() => 
        checkForSpecialRemedies(dynamicGrid, destinyNumber, mahaDasha, annualDasha), 
        [dynamicGrid, destinyNumber, mahaDasha, annualDasha]
    );

    // Using 'en' as a default, pass language as a prop if needed
    const language = 'en'; 

    if (specialRemedies.length === 0) {
        return null;
    }

    const SimpleRemedy = ({ remedy }) => (
        <div className="p-4 bg-red-900/40 border-l-4 border-red-400 rounded-r-lg">
            <h3 className="font-bold text-red-300 text-lg">{getText(remedy.title, language)}</h3>
            <p className="text-red-200/90 mt-2">{getText(remedy.text, language)}</p>
        </div>
    );

    const DetailedRudrakshaRemedy = ({ remedy }) => (
        <div className="p-4 bg-teal-900/40 border-l-4 border-teal-400 rounded-r-lg">
            <h3 className="font-bold text-teal-300 text-lg">{getText(remedy.title, language)}</h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-900/50 p-3 rounded-md"><strong>Rudraksha:</strong> {getText(remedy.rudrakshaName, language)}</div>
                <div className="bg-gray-900/50 p-3 rounded-md"><strong>Deity:</strong> {getText(remedy.deity, language)}</div>
                <div className="bg-gray-900/50 p-3 rounded-md"><strong>Ruling Planet:</strong> {getText(remedy.rulingPlanet, language)}</div>
                <div className="bg-gray-900/50 p-3 rounded-md"><strong>Mantra:</strong> {getText(remedy.mantra, language)}</div>
                <div className="bg-gray-900/50 p-3 rounded-md col-span-1 md:col-span-2"><strong>Significance:</strong> {getText(remedy.significance, language)}</div>
                <div className="bg-gray-900/50 p-3 rounded-md col-span-1 md:col-span-2"><strong>Benefits:</strong> {getText(remedy.benefits, language)}</div>
                <div className="bg-gray-900/50 p-3 rounded-md col-span-1 md:col-span-2"><strong>Remedy For:</strong> {getText(remedy.remedyFor, language)}</div>
                <div className="bg-gray-900/50 p-3 rounded-md col-span-1 md:col-span-2"><strong>Who Should Wear:</strong> {getText(remedy.whoShouldWear, language)}</div>
                <div className="bg-gray-900/50 p-3 rounded-md"><strong>Availability:</strong> {getText(remedy.availability, language)}</div>
                <div className="bg-gray-900/50 p-3 rounded-md"><strong>Form:</strong> {getText(remedy.form, language)}</div>
            </div>
        </div>
    );

    return (
        <Card>
            <SectionTitle>Dynamic Special Guidance</SectionTitle>
            <p className="mb-4 text-yellow-200/70 text-sm">This guidance is triggered by your chart's interaction with the currently selected Dasha period.</p>
            <div className="space-y-6">
                {specialRemedies.map((remedy, index) => {
                    if (remedy.type === 'detailedRudraksha') {
                        return <DetailedRudrakshaRemedy key={index} remedy={remedy} />;
                    }
                    return <SimpleRemedy key={index} remedy={remedy} />;
                })}
            </div>
        </Card>
    );
};

export default DynamicSpecialGuidanceDisplay;