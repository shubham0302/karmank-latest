import React, { useMemo, useState } from 'react';
import Card from '../Card';
import SectionTitle from '../SectionTitle';
import NlgChildBirthForecast from './NlgChildBirthForecast'; // Import sub-component
import { reduceToSingleDigit } from '../../utils/helpers'; // Import helper

const ChildBirthForecastTab = ({ report, dashaReport, gender, targetDate }) => {
    if (!report || !dashaReport || !targetDate) {
        return (
            <div className="p-4 bg-red-900/50 text-red-300 rounded-lg">
                Required data (report, dashaReport, targetDate) is missing. Cannot render component.
            </div>
        );
    }

    const [selectedDeliveryDate, setSelectedDeliveryDate] = useState(new Date().toISOString().split('T')[0]);

    const possibilityAnalysis = useMemo(() => {
        const yearlyDashaRec = dashaReport.yearlyDashaTimeline.find(d => targetDate >= new Date(d.startDate) && targetDate <= new Date(d.endDate));
        const mahaDashaRec = dashaReport.mahaDashaTimeline.find(d => targetDate >= new Date(d.startDate) && targetDate <= new Date(d.endDate));

        if (!yearlyDashaRec || !mahaDashaRec) {
            return { status: 'Neutral', dasha3: { active: false }, even8: { active: false } };
        }

        const yearlyDasha = yearlyDashaRec.dashaNumber;
        const mahaDasha = mahaDashaRec.dashaNumber;

        const { baseKundliGrid, destinyNumber } = report;
        const count3 = baseKundliGrid[3] || 0;
        const count8 = baseKundliGrid[8] || 0;

        const findings = {
            dasha3: { active: false, favorable: false },
            even8: { active: false, count: 0 },
            status: 'Neutral'
        };

        if (yearlyDasha === 3) {
            findings.dasha3.active = true;
            findings.dasha3.favorable = (count3 === 0) || (count3 === 1) || (count3 === 2 && destinyNumber === 3);
        }

        let effective8Count = count8;
        if (yearlyDasha === 8 || mahaDasha === 8) {
            effective8Count++;
        }

        if (effective8Count > 0 && effective8Count % 2 === 0) {
            findings.even8.active = true;
            findings.even8.count = effective8Count;
        }

        if ((findings.dasha3.active && findings.dasha3.favorable) || findings.even8.active) {
            findings.status = 'Green';
        } else if (findings.dasha3.active) {
            findings.status = 'Yellow';
        }

        return findings;
    }, [report, dashaReport, targetDate]);

    const avoidanceAnalysis = useMemo(() => {
        if (gender !== 'Female') {
            return { text: "This analysis is applicable only for the female chart.", status: 'Neutral' };
        }

        const yearlyDasha = dashaReport.yearlyDashaTimeline.find(d => targetDate >= new Date(d.startDate) && targetDate <= new Date(d.endDate))?.dashaNumber;
        if (yearlyDasha === undefined) return { text: "Dasha data not available for this period.", status: 'Neutral' };

        const resultantChart = [...report.baseKundliGrid];
        resultantChart[yearlyDasha] = (resultantChart[yearlyDasha] || 0) + 1;

        const counts = resultantChart.reduce((acc, count, num) => {
            acc[num] = count;
            return acc;
        }, {});

        const has888 = (counts[8] || 0) >= 3;
        const has4 = (counts[4] || 0) >= 1;
        const has77 = (counts[7] || 0) >= 2;
        const has22 = (counts[2] || 0) >= 2;
        const has66 = (counts[6] || 0) >= 2;

        if (has888 || has4 || has77 || has22 || has66) {
            return { text: "Not a Favorable Period", status: 'Red' };
        } else {
            return { text: "This is a Favorable Period", status: 'Green' };
        }
    }, [report, dashaReport, targetDate, gender]);

    const deliveryDateAnalysis = useMemo(() => {
        if (!selectedDeliveryDate) return { basicNumber: null, destinyNumber: null, feedback: 'Select a date' };

        const dateObj = new Date(selectedDeliveryDate + 'T00:00:00');
        const day = dateObj.getDate();
        const month = dateObj.getMonth() + 1;
        const year = dateObj.getFullYear();

        const basic = reduceToSingleDigit(day);
        const destiny = reduceToSingleDigit(`${day}${month}${year}`);

        let status;
        if (basic === 4 || basic === 8 || destiny === 4 || destiny === 8) {
            status = 'Unfavorable';
        } else if ([1, 3, 5, 6].includes(destiny)) {
            status = 'Preferred';
        } else {
            status = 'Neutral';
        }

        return { basicNumber: basic, destinyNumber: destiny, feedback: status };
    }, [selectedDeliveryDate]);

    const getFeedbackColor = (status) => {
        switch (status) {
            case 'Unfavorable': return 'bg-red-500/20 text-red-300';
            case 'Preferred': return 'bg-green-500/20 text-green-300';
            case 'Neutral': return 'bg-blue-500/20 text-blue-300';
            default: return 'bg-gray-700 text-gray-300';
        }
    };

    const StatusBlock = ({ status, children }) => {
        const colorClass = status === 'Green' ?
            'bg-green-500/20 text-green-300' : status === 'Yellow' ? 'bg-yellow-500/20 text-yellow-300' : status === 'Red' ? 'bg-red-500/20 text-red-300' : 'bg-gray-700/50 text-gray-300';
        return <div className={`p-4 rounded-lg ${colorClass}`}>{children}</div>;
    };

    return (
        <div className="space-y-8 font-sans text-white">
            <Card>
                <SectionTitle>Childbirth Possibility Prediction</SectionTitle>
                <p className="text-sm text-yellow-200/70 mb-4">Analyzes the current forecast year to identify periods with a high probability of childbirth based on your Annual Dasha.</p>
                <StatusBlock status={possibilityAnalysis.status}>
                    <NlgChildBirthForecast analysis={possibilityAnalysis} />
                </StatusBlock>
            </Card>

            <Card>
                <SectionTitle>Pregnancy Planning Window</SectionTitle>
                <p className="text-sm text-gray-400 mb-4">This analysis, most relevant for the female chart, determines if the current period is favorable for planning a pregnancy based on active numerological energies.</p>
                <StatusBlock status={avoidanceAnalysis.status}>
                    <p className="font-bold text-xl text-center">{avoidanceAnalysis.text}</p>
                </StatusBlock>
            </Card>

            <Card>
                <SectionTitle>Planned Delivery Date Validator</SectionTitle>
                <p className="text-sm text-gray-400 mb-4">Select a potential date for a planned delivery to receive numerological feedback.</p>
                <div className="mb-4">
                    <label htmlFor="deliveryDate" className="block text-sm font-medium text-yellow-500 mb-1">Select a Date</label>
                    <input
                        type="date"
                        id="deliveryDate"
                        value={selectedDeliveryDate}
                        onChange={(e) => setSelectedDeliveryDate(e.target.value)}
                        className="mt-1 block w-full md:w-1/2 bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 text-white"
                    />
                </div>
                {selectedDeliveryDate && (
                    <div className="space-y-4 p-4 bg-gray-900/50 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Calculated Basic Number:</span>
                            <span className="font-bold text-2xl text-indigo-400">{deliveryDateAnalysis.basicNumber}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Calculated Destiny Number:</span>
                            <span className="font-bold text-2xl text-indigo-400">{deliveryDateAnalysis.destinyNumber}</span>
                        </div>
                        <div className={`p-4 rounded-md text-center ${getFeedbackColor(deliveryDateAnalysis.feedback)}`}>
                            <p className="font-bold text-xl">{deliveryDateAnalysis.feedback}</p>
                        </div>
                    </div>
                )}
                <div className="mt-6 p-4 rounded-md bg-yellow-900/50 text-yellow-300 border-l-4 border-yellow-500">
                    <p className="font-bold">Disclaimer:</p>
                    <p className="text-sm">This tool provides preliminary guidance. A complete and careful analysis of the date by a professional is recommended for a final decision.</p>
                </div>
            </Card>
        </div>
    );
};

export default ChildBirthForecastTab;