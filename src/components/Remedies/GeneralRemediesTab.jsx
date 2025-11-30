import React from 'react';
import Card from '../Card';
import { getText } from '../../utils/helpers';
import { GradientText } from '../GradientText';
import { getRemedyData } from '../../utils/localData';

const GeneralRemediesTab = ({ report, language = 'en' }) => {
    if (!report?.relevantData) {
        return <Card><p className="text-yellow-400">Report data not fully loaded.</p></Card>;
    }

    const basicRemedy = getRemedyData(report, report.basicNumber);
    const destinyRemedy = getRemedyData(report, report.destinyNumber);

    const RemedyCard = ({ title, number, remedyData }) => (
        <Card>
            <GradientText as="h2" size="2xl" className="mb-4">
                {title} (Number: {number})
            </GradientText>
            <div className="space-y-4 text-white/90">
                <div>
                    <GradientText as="h3" size="lg" className="mb-1">
                        General Advice
                    </GradientText>
                    <p>{getText(remedyData.general, language)}</p>
                </div>
                <div>
                    <GradientText as="h3" size="lg" className="mb-1">
                        Mantra
                    </GradientText>
                    <p className="italic">{getText(remedyData.mantra, language)}</p>
                </div>
                <div>
                    <GradientText as="h3" size="lg" className="mb-1">
                        Donations
                    </GradientText>
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