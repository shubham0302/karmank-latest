import React, { useMemo } from 'react';
import Card from '../Card';
import SectionTitle from '../SectionTitle';
import { DATA } from '../../data/data'; // Import DATA

const MarriageForecastTab = ({ report, dashaReport, targetDate }) => {
    if (!report || !dashaReport) return null;

    const marriageAnalysis = useMemo(() => {
        const yearlyDasha = dashaReport.yearlyDashaTimeline.find(d => targetDate >= d.startDate && targetDate <= d.endDate);
        const mahaDasha = dashaReport.mahaDashaTimeline.find(d => targetDate >= d.startDate && targetDate <= d.endDate);

        if (!yearlyDasha || !mahaDasha) {
            return { mahaDashaInsights: [], annualDashaInsights: [] };
        }

        const { destinyNumber, baseKundliGrid } = report;
        const annualDashaNumber = yearlyDasha.dashaNumber;
        const mahaDashaNumber = mahaDasha.dashaNumber;

        const count = (num) => baseKundliGrid[num] || 0;

        let mahaDashaInsights = [];
        let annualDashaInsights = [];

        switch (mahaDashaNumber) {
            case 3: 
                mahaDashaInsights.push({ text: "This is a very positive and expansive period for relationships. It fosters strong, positive bonding and is considered highly conducive to marriage and the growth of a family.", status: 'Green' });
                break;
            case 6:
                if (destinyNumber === 6 || count(6) === 0) {
                    mahaDashaInsights.push({ text: "A very positive period. It is a favorable time that brings love, harmony, and luxury into your life.", status: 'Green' });
                }
                break;
            case 7:
                if (destinyNumber === 7 || count(7) === 0) {
                    mahaDashaInsights.push({ text: "A very positive period. This fosters spiritual connection and deep understanding within relationships.", status: 'Green' });
                }
                break;
            case 8:
                if (((count(8) + 1) % 2) === 0) { // Even count after adding dasha
                    mahaDashaInsights.push({ text: "A positive period. This time can bring reconciliation in past relationships or create opportunities for new, stable connections to form.", status: 'Green' });
                }
                break;
            default:
                break;
        }

        switch (annualDashaNumber) {
            case 2:
                annualDashaInsights.push({ text: "While this year is marked by emotional sensitivity, it can also signify the entry of a new person into one's life.", status: 'Yellow' });
                break;
            case 3:
                annualDashaInsights.push({ text: "A precious and highly favorable time for marriage. It is a year of expansion and growth, making it an excellent time for marriage or childbirth.", status: 'Green' });
                break;
            case 6:
                if (destinyNumber === 6 || count(6) === 0) {
                    annualDashaInsights.push({ text: "An excellent and perfect year for relationships. It brings harmony, love, luxury, and enjoyment.", status: 'Green' });
                }
                break;
            case 7:
                if (count(7) <= 1 || destinyNumber === 7) {
                    annualDashaInsights.push({ text: "A positive year. This period brings harmony, deeper understanding, and a peaceful, spiritual time in romance.", status: 'Green' });
                }
                break;
            case 8:
                if (((count(8) + 1) % 2) === 0) { // Even count after adding dasha
                    annualDashaInsights.push({ text: "A good year for relationships. This period is favorable for reconciliation and healing existing relationships, and new romantic opportunities may also arise.", status: 'Green' });
                }
                break;
            default:
                break;
        }

        return { mahaDashaInsights, annualDashaInsights };
    }, [report, dashaReport, targetDate]);

    const marriageProbabilityChart = useMemo(() => {
        const probabilities = [];
        const startAge = 20;
        const endAge = 40;
        const birthYear = report.dob.getFullYear();

        for (let age = startAge; age <= endAge; age++) {
            const targetYear = birthYear + age;
            const yearlyDashaForAge = dashaReport.yearlyDashaTimeline.find(d => d.year === targetYear);
            if (yearlyDashaForAge) {
                let probability = 'Neutral';
                let status = 'Yellow';
                const dashaNum = yearlyDashaForAge.dashaNumber;
                const count = (num) => report.baseKundliGrid[num] || 0;

                switch (dashaNum) {
                    case 3: 
                        probability = 'High'; 
                        status = 'Green'; 
                        break;
                    case 6:
                        if (report.destinyNumber === 6 || count(6) === 0) {
                            probability = 'High';
                            status = 'Green';
                        }
                        break;
                    case 7:
                        if (count(7) <= 1 || report.destinyNumber === 7) {
                            probability = 'High';
                            status = 'Green';
                        }
                        break;
                    case 8:
                        if (((count(8) + 1) % 2) === 0) {
                            probability = 'High';
                            status = 'Green';
                        }
                        break;
                    case 2:
                        probability = 'Moderate';
                        status = 'Yellow';
                        break;
                    default:
                        break;
                }
                probabilities.push({ age, year: targetYear, probability, status });
            }
        }
        return probabilities;
    }, [report, dashaReport]);

    const compatibility = DATA.destinyCompatibility[report.destinyNumber];
    const compatibilityDescription = compatibility?.description?.en || '';

    return (
        <div className="space-y-6">
            <Card>
                <SectionTitle>Marriage Forecast</SectionTitle>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold text-lg text-yellow-300 mb-2">Major Life Period (Maha-Dasha) Influences</h4>
                        {marriageAnalysis.mahaDashaInsights.length > 0 ? marriageAnalysis.mahaDashaInsights.map((item, i) => (
                            <p key={i} className={item.status === 'Green' ? 'text-green-400' : 'text-red-400'}>{item.text}</p>
                        )) : <p>Neutral influence from current Maha Dasha.</p>}
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg text-yellow-300 mb-2">Yearly (Annual Dasha) Influences</h4>
                        {marriageAnalysis.annualDashaInsights.length > 0 ?
                            marriageAnalysis.annualDashaInsights.map((item, i) => (
                                <p key={i} className={item.status === 'Green' ? 'text-green-400' : item.status === 'Red' ? 'text-red-400' : 'text-yellow-400'}>{item.text}</p>
                            )) : <p>Neutral influence from current Annual Dasha.</p>}
                    </div>
                </div>
            </Card>

            <Card>
                <SectionTitle>Personality Compatibility Snapshot</SectionTitle>
                <p className="mb-4 text-gray-300">As a Destiny Number <span className="font-bold text-yellow-400">{report.destinyNumber}</span>, your core life path energy influences who you connect with most naturally. {compatibilityDescription}</p>
                <div className="grid md:grid-cols-3 gap-4 text-center">
                    <div className="bg-green-500/10 p-3 rounded-lg">
                        <h4 className="font-bold text-green-400 mb-2">Good Compatibility</h4>
                        <p className="text-2xl font-bold text-gray-200">{compatibility?.good?.join(', ') || 'N/A'}</p>
                    </div>
                    <div className="bg-yellow-500/10 p-3 rounded-lg">
                        <h4 className="font-bold text-yellow-400 mb-2">Neutral</h4>
                        <p className="text-2xl font-bold text-gray-200">{compatibility?.neutral?.join(', ') || 'N/A'}</p>
                    </div>
                    <div className="bg-red-500/10 p-3 rounded-lg">
                        <h4 className="font-bold text-red-400 mb-2">{compatibility?.not ? 'Not Compatible' : 'Avoid'}</h4>
                        <p className="text-2xl font-bold text-gray-200">{(compatibility?.not || compatibility?.avoid || []).join(', ') || 'N/A'}</p>
                    </div>
                </div>
            </Card>

            <Card>
                <SectionTitle>Year-wise Marriage Probability (Age 20-40)</SectionTitle>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                    {marriageProbabilityChart.map(item => (
                        <div key={item.age} className="flex items-center justify-between p-2 bg-gray-900/50 rounded-md">
                            <div className="font-bold">{item.year} (Age {item.age})</div>
                            <div className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                item.status === 'Green' ? 'bg-green-500/20 text-green-300' :
                                item.status === 'Red' ? 'bg-red-500/20 text-red-300' :
                                'bg-yellow-500/20 text-yellow-300'
                            }`}>
                                {item.probability}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default MarriageForecastTab;