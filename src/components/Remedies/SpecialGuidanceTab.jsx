import React from 'react';
import Card from '../Card';
import SectionTitle from '../SectionTitle';
import { getText } from '../../utils/helpers';

const SpecialGuidanceTab = ({ report, language = 'en' }) => {
    const { specialRemedies } = report;

    if (!specialRemedies || !Array.isArray(specialRemedies) || specialRemedies.length === 0) {
        return (
            <Card className="pdf-page-break-after" style={{ pageBreakAfter: 'always', pageBreakInside: 'avoid' }}>
                <SectionTitle>Special Guidance</SectionTitle>
                <p className="text-center text-white/70 p-4 bg-gray-900/50 rounded-md">No special remedies are required based on the specific rules in your base chart.</p>
            </Card>
        );
    }

    const SimpleRemedy = ({ remedy }) => (
        <Card className="print:mb-4" style={{ pageBreakInside: 'avoid' }}>
            <div className="p-4 bg-red-900/40 border-l-4 border-red-400 rounded-r-lg print:p-2 print:text-sm">
                <h3 className="font-bold text-red-300 text-lg print:text-base">{getText(remedy.title, language)}</h3>
                <p className="text-red-200/90 mt-2 print:mt-1">{getText(remedy.text, language)}</p>
            </div>
        </Card>
    );

    const DetailedRudrakshaRemedy = ({ remedy }) => (
        <Card className="print:mb-4" style={{ pageBreakInside: 'avoid' }}>
            <div className="p-4 bg-teal-900/40 border-l-4 border-teal-400 rounded-r-lg print:p-2">
                <h3 className="font-bold teal-300 text-lg print:text-base">{getText(remedy.title, language)}</h3>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm print:mt-2 print:gap-2 print:text-xs">
                    <div className="bg-gray-900/50 p-3 rounded-md print:p-1"><strong>Rudraksha:</strong> {getText(remedy.rudrakshaName, language)}</div>
                    <div className="bg-gray-900/50 p-3 rounded-md print:p-1"><strong>Deity:</strong> {getText(remedy.deity, language)}</div>
                    <div className="bg-gray-900/50 p-3 rounded-md print:p-1"><strong>Ruling Planet:</strong> {getText(remedy.rulingPlanet, language)}</div>
                    <div className="bg-gray-900/50 p-3 rounded-md print:p-1"><strong>Mantra:</strong> {getText(remedy.mantra, language)}</div>
                    <div className="bg-gray-900/50 p-3 rounded-md col-span-1 md:col-span-2 print:p-1"><strong>Significance:</strong> {getText(remedy.significance, language)}</div>
                    <div className="bg-gray-900/50 p-3 rounded-md col-span-1 md:col-span-2 print:p-1"><strong>Benefits:</strong> {getText(remedy.benefits, language)}</div>
                    <div className="bg-gray-900/50 p-3 rounded-md col-span-1 md:col-span-2 print:p-1"><strong>Remedy For:</strong> {getText(remedy.remedyFor, language)}</div>
                    <div className="bg-gray-900/50 p-3 rounded-md col-span-1 md:col-span-2 print:p-1"><strong>Who Should Wear:</strong> {getText(remedy.whoShouldWear, language)}</div>
                    <div className="bg-gray-900/50 p-3 rounded-md print:p-1"><strong>Availability:</strong> {getText(remedy.availability, language)}</div>
                    <div className="bg-gray-900/50 p-3 rounded-md print:p-1"><strong>Form:</strong> {getText(remedy.form, language)}</div>
                </div>
            </div>
        </Card>
    );

    // Group remedies: max 2 per page
    const groupedRemedies = [];
    for (let i = 0; i < specialRemedies.length; i += 2) {
        groupedRemedies.push(specialRemedies.slice(i, i + 2));
    }

    return (
        <div className="space-y-6 pdf-page-break-after" style={{ pageBreakAfter: 'always' }}>
            <SectionTitle>Special Guidance Based on Your Chart</SectionTitle>
            {groupedRemedies.map((group, pageIndex) => {
                // Only add page break after if this is not the last group
                const isLastGroup = pageIndex === groupedRemedies.length - 1;
                return (
                    <div
                        key={pageIndex}
                        className={isLastGroup ? "space-y-4 print:space-y-4" : "space-y-4 print:space-y-4 pdf-page-break-after"}
                        style={isLastGroup ? {} : { pageBreakAfter: 'always' }}
                    >
                        {group.map((remedy, index) => {
                            const remedyKey = `${pageIndex}-${index}`;
                            if (remedy.type === 'detailedRudraksha') {
                                return <DetailedRudrakshaRemedy key={remedyKey} remedy={remedy} />;
                            }
                            return <SimpleRemedy key={remedyKey} remedy={remedy} />;
                        })}
                    </div>
                );
            })}
        </div>
    );
};

export default SpecialGuidanceTab;