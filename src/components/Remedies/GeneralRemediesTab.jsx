import React from 'react';
import Card from '../Card';
import { DATA } from '../../data/data';
import { getText } from '../../utils/helpers';

const GeneralRemediesTab = ({ report }) => {
    const language = 'en'; // Assuming 'en' as default

    const basicRemedy = DATA.remedies[report.basicNumber];
    const destinyRemedy = DATA.remedies[report.destinyNumber];

    const RemedyCard = ({ title, number, remedyData }) => (
        <Card>
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">
                {title} (Number: {number})
            </h2>
            <div className="space-y-4 text-gray-300">
                <div>
                    <h3 className="font-semibold text-yellow-300 text-lg mb-1">General Advice</h3>
                    <p>{getText(remedyData.general, language)}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-yellow-300 text-lg mb-1">Mantra</h3>
                    <p className="italic">{getText(remedyData.mantra, language)}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-yellow-300 text-lg mb-1">Donations</h3>
                    <p>{getText(remedyData.donation, language)}</p>
                </div>
            </div>
        </Card>
    );

    return (
        <div className="space-y-6">
            <RemedyCard title="Remedies for Basic Number" number={report.basicNumber} remedyData={basicRemedy} />
            {report.basicNumber !== report.destinyNumber && (
                 <RemedyCard title="Remedies for Destiny Number" number={report.destinyNumber} remedyData={destinyRemedy} />
            )}
        </div>
    );
};

export default GeneralRemediesTab;