import React, { useMemo } from 'react';
import Card from '../Card';
import SectionTitle from '../SectionTitle';

const TravelForecastTab = ({ report, dashaReport, targetDate }) => {
    if (!report || !dashaReport) return null;

    const travelAnalysis = useMemo(() => {
        const annualDasha = dashaReport.yearlyDashaTimeline.find(d => targetDate >= d.startDate && targetDate <= d.endDate);
        const mahaDasha = dashaReport.mahaDashaTimeline.find(d => targetDate >= d.startDate && targetDate <= d.endDate);

        if (!annualDasha || !mahaDasha) {
            return { outlook: { title: 'N/A', text: 'Forecast not available for this date.', status: 'Yellow'}, opportunities: [], 
            challenges: [], advice: [], warnings:[], score: 'Low', visaEase: 'Moderate', countryType: 'N/A' };
        }

        const { baseKundliGrid, basicNumber, destinyNumber } = report;
        const has7InChart = baseKundliGrid[7] > 0 || basicNumber === 7 || destinyNumber === 7;
        const has4InChart = baseKundliGrid[4] > 0 || basicNumber === 4 || destinyNumber === 4;

        const total7s = (baseKundliGrid[7] || 0) + (mahaDasha.dashaNumber === 7 ? 1 : 0) + (annualDasha.dashaNumber === 7 ? 1 : 0);

        const outlook = { title: '', text: '', status: 'Yellow' };
        const opportunities = [];
        const challenges = [];
        const advice = [];
        let warnings = [];
        let score = 'Low';
        let visaEase = 'Moderate';
        let countryType = 'N/A';

        if (total7s >= 4) {
            warnings.push("7777 Pattern: Considered very unfavorable. It signifies chronic, endless, and involuntary travel without stability, leading to mental exhaustion and an inability to feel settled.");
        } else if (total7s === 3) {
            warnings.push("777 Pattern: Indicates unstable or forced travel, anxiety, mental distress, and a lack of peace. If driven by dashas, it suggests sudden, uncontrollable relocations.");
        }

        if (has4InChart && has7InChart) {
            outlook.title = "This period is influenced by a combination of 4 & 7";
            if ([3, 5, 6].includes(annualDasha.dashaNumber)) {
                outlook.status = 'Green';
                outlook.text = "The conflicting energies of 4 and 7 are balanced by a favorable Dasha, suggesting a positive travel outcome is likely.";
                score = 'High';
                visaEase = 'Easy';
                countryType = 'Developed';                
                if (annualDasha.dashaNumber === 3) opportunities.push("Annual Dasha 3: Promotes travel for education, professional growth, or expansion.");
                if (annualDasha.dashaNumber === 5) opportunities.push("Annual Dasha 5: Encourages travel related to tourism and exploration.");
                if (annualDasha.dashaNumber === 6) opportunities.push("Annual Dasha 6: Facilitates travel to luxurious or high-end destinations.");
            } else {
                outlook.status = 'Red';
                outlook.text = "The current negative Dasha exacerbates the conflict between 4 and 7, pointing to a high risk of documentation issues and mental tension related to travel.";
                score = 'Low';
                visaEase = 'Difficult';
                countryType = 'Developing';
            }
        }
        else if (has7InChart) {
            outlook.title = "This period is influenced by Number 7 – The Global Voyager";
            outlook.status = 'Green';
            outlook.text = "Your chart contains the number 7, indicating a high potential for fruitful travel and relocation to a developed country.";
            score = 'High'; visaEase = 'Easy'; countryType = 'Developed';
            opportunities.push("During favorable periods, you may receive work visas, Permanent Residency (PR), or citizenship with less resistance.");
            if (annualDasha.dashaNumber === 3) opportunities.push("Annual Dasha 3: Promotes travel for education, professional growth, or expansion.");
            if (annualDasha.dashaNumber === 5) opportunities.push("Annual Dasha 5: Encourages travel related to tourism and exploration.");
            if (annualDasha.dashaNumber === 6) opportunities.push("Annual Dasha 6: Facilitates travel to luxurious or high-end destinations.");
            if (annualDasha.dashaNumber === 7) opportunities.push("Annual Dasha 7: Strongly activates your inherent travel potential.");
            if (annualDasha.dashaNumber === 2) {
                challenges.push("Annual Dasha 2: This period often leads to delays or postponements of travel plans.");
                visaEase = 'Difficult';
            }
            if (annualDasha.dashaNumber === 4) {
                challenges.push("Annual Dasha 4: This period can bring issues with documentation, legal formalities, or processing delays.");
                visaEase = 'Difficult';
            }
        } 
        else if (has4InChart) {
            outlook.title = "This period is influenced by Number 4 – The Karmic Relocator";
            outlook.status = 'Yellow';
            outlook.text = "Your chart contains the number 4, associated with relocation and travel challenges. Relocation is often driven by 'push factors' like economic necessity.";
            countryType = 'Developing/Underdeveloped';
            challenges.push("Tendency to travel or relocate to developing countries, particularly in the Middle East.", "Likely to face delays in visa approvals, additional scrutiny, documentation issues, and a need to spend more money on travel.");
            advice.push("To travel to developed nations, it is advised to go through relationship or marriage-based connections or by investing significantly more resources and effort.");
            if ([5, 6, 7].includes(annualDasha.dashaNumber)) {
                outlook.status = 'Green';
                outlook.text += " However, the current favorable Dasha provides a moderate improvement, increasing the chances of a positive outcome.";
                score = 'Moderate';
            }
            if (baseKundliGrid[4] >= 2) {
                warnings.push("Double 4 (44) in the chart helps to reduce or neutralize some of the negative traits associated with a single 4.");
            }
        } 
        else { // Neither 4 nor 7 in chart
            outlook.title = "Dasha-Driven Travel Potential";
            if (mahaDasha.dashaNumber === 7) {
                outlook.status = 'Yellow';
                outlook.text = "Although 7 is not in your base chart, the current Maha Dasha of 7 provides moderate travel opportunities.";
                score = 'Moderate';
                if ([5, 6, 7].includes(annualDasha.dashaNumber)) {
                    outlook.status = 'Green';
                    outlook.text += " The favorable Annual Dasha further enhances these opportunities.";
                    score = 'High';
                } else if ([2, 4].includes(annualDasha.dashaNumber)) {
                    outlook.status = 'Red';
                    outlook.text += " However, the current Annual Dasha warns of significant obstacles or delays.";
                    score = 'Low';
                }
            } else {
                outlook.text = "Your chart does not have strong innate indicators for foreign travel. Opportunities will depend heavily on specific Dasha periods.";
            }
        }

        return { outlook, opportunities, challenges, advice, warnings, score, visaEase, countryType };
    }, [targetDate, report, dashaReport]);

    const StatusIcon = ({ status }) => {
        if (status === 'Green') return <span className="text-green-500 text-2xl mr-3" title="Favorable">🟢</span>;
        if (status === 'Yellow') return <span className="text-yellow-500 text-2xl mr-3" title="Mixed Signals">🟡</span>;
        if (status === 'Red') return <span className="text-red-500 text-2xl mr-3" title="High Caution">🔴</span>;
        return null;
    };

    const InsightCard = ({ title, items, status, icon }) => {
        if (!items || items.length === 0) return null;
        const colorClass = status === 'Green' ? 'border-green-500/50' : status === 'Red' ? 'border-red-500/50' : 'border-yellow-500/50';
        return (
            <div>
                <h4 className="font-semibold text-lg text-yellow-300 mb-2">{icon} {title}</h4>
                <ul className={`list-disc list-inside space-y-2 pl-4 border-l-4 ${colorClass}`}>
                    {items.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <Card>
                <SectionTitle>Travel & Relocation Forecast</SectionTitle>
                {travelAnalysis ? (
                    <div className="bg-gray-900/50 p-4 rounded-lg">
                        <h3 className="font-bold text-xl text-yellow-400 mb-2">{travelAnalysis.outlook.title}</h3>
                        <div className="flex items-start mb-6">
                            <StatusIcon status={travelAnalysis.outlook.status} />
                            <p>{travelAnalysis.outlook.text}</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 mb-6 text-center text-sm">
                            <div className="bg-gray-800 p-2 rounded-md"><p className="text-white/70">Travel Score</p><p className="font-bold text-xl">{travelAnalysis.score}</p></div>
                            <div className="bg-gray-800 p-2 rounded-md"><p className="text-white/70">Visa Ease</p><p className="font-bold text-xl">{travelAnalysis.visaEase}</p></div>
                            <div className="bg-gray-800 p-2 rounded-md"><p className="text-white/70">Destination Type</p><p className="font-bold text-xl">{travelAnalysis.countryType}</p></div>
                        </div>

                        <div className="space-y-6">
                            <InsightCard title="Key Opportunities" items={travelAnalysis.opportunities} status="Green" icon="✅" />
                            <InsightCard title="Potential Challenges" items={travelAnalysis.challenges} status="Red" icon="❌" />
                            <InsightCard title="Strategic Advice" items={travelAnalysis.advice} status="Yellow" icon="💡" />
                        </div>

                        {travelAnalysis.warnings.length > 0 && (
                            <div className="mt-6">
                                <h4 className="font-semibold text-lg text-red-400 mb-2">⚠️ Warnings</h4>
                                <ul className="list-disc list-inside space-y-2 pl-4 border-l-4 border-red-500/50">
                                    {travelAnalysis.warnings.map((warn, i) => <li key={i}>{warn}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                ) : (
                    <p>Could not generate a forecast for the selected date. Please try another date.</p>
                )}
            </Card>
        </div>
    );
};

export default TravelForecastTab;