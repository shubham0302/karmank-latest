import React from 'react';
import Card from '../Card';
import SectionTitle from '../SectionTitle';
import { DATA } from '../../data/data';
import { getText } from '../../utils/helpers';

const GeneralRemediesTab = ({ report, language = 'en' }) => {

    const basicRemedy = DATA.remedies[report.basicNumber];
    const destinyRemedy = DATA.remedies[report.destinyNumber];

    const RemedySection = ({ title, number, remedyData }) => (
        <div className="mb-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4 print:text-lg print:mb-2">
                {title} (Number: {number})
            </h2>
            <div className="space-y-4 text-white/90 print:space-y-2 print:text-sm">
                <div>
                    <h3 className="font-semibold text-yellow-300 text-lg mb-1 print:text-sm print:mb-0.5">General Advice</h3>
                    <p>{getText(remedyData.general, language)}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-yellow-300 text-lg mb-1 print:text-sm print:mb-0.5">Mantra</h3>
                    <p className="italic">{getText(remedyData.mantra, language)}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-yellow-300 text-lg mb-1 print:text-sm print:mb-0.5">Donations</h3>
                    <p>{getText(remedyData.donation, language)}</p>
                </div>
            </div>
        </div>
    );

    return (
        <Card className="pdf-page-break-after" style={{ pageBreakAfter: 'always', pageBreakInside: 'avoid' }}>
            <SectionTitle>General Remedies</SectionTitle>
            <RemedySection title="Remedies for Basic Number" number={report.basicNumber} remedyData={basicRemedy} />
            {report.basicNumber !== report.destinyNumber && (
                 <RemedySection title="Remedies for Destiny Number" number={report.destinyNumber} remedyData={destinyRemedy} />
            )}
        </Card>
    );
};

export default GeneralRemediesTab;