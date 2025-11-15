import React, { useMemo } from 'react';
import Card from '../Card';
import SectionTitle from '../SectionTitle';
import { DATA } from '../../data/data'; // Import DATA

const PropertyForecastTab = ({ report, dashaReport, targetDate }) => {
    if (!report || !dashaReport) return null;

    const propertyAnalysis = useMemo(() => {
        const annualDasha = dashaReport.yearlyDashaTimeline.find(d => targetDate >= d.startDate && targetDate <= d.endDate);
        const mahaDasha = dashaReport.mahaDashaTimeline.find(d => targetDate >= d.startDate && targetDate <= d.endDate);

        if (!annualDasha || !mahaDasha) {
            return { opportunities: [], warnings:[], specialInsights: [] };
        }

        const { baseKundliGrid, destinyNumber } = report;
        const count1 = baseKundliGrid[1] || 0;
        const count8 = baseKundliGrid[8] || 0;

        let opportunities = [];
        let warnings = [];
        let specialInsights = [];

        // Rule for Number 1
        if (annualDasha.dashaNumber === 1 || mahaDasha.dashaNumber === 1) {
            if (count1 === 1) {
                specialInsights.push({ title: "Number 1 – The Real Estate Initiator (Single 1)", text: "Positive for property acquisition. During this Dasha, you are likely to buy property (residential or commercial) or be presented with opportunities in real estate professions. Success is moderate but stable; better to buy rather than sell.", status: 'Green' });
            } else if (count1 > 1 && destinyNumber === 1) {
                specialInsights.push({ title: "Number 1 – The Real Estate Initiator (Multiple 1s with Destiny 1)", text: "Extremely favorable for real estate business. You are likely to consistently earn profits from property investments and are skilled in handling deals. Real estate can be a core career or wealth-building avenue.", status: 'Green' });
            } else if (count1 > 1 && destinyNumber !== 1) {
                warnings.push("Multiple 1s without Destiny 1: Caution advised. This period may bring losses, delays, or legal issues in real estate. Avoid investing in under-construction projects. If a purchase is necessary, choose ready-to-move-in properties with clear legal documentation.");
            } else if (count1 === 0) {
                specialInsights.push({ title: "Number 1 – The Real Estate Initiator (Missing 1)", text: "The Dasha of Number 1 may still bring opportunities for property purchase or home renovation. However, it’s not advisable to pursue real estate as a business venture. Focus on personal use property only.", status: 'Yellow' });
            }
        }

        const isMaha8Active = mahaDasha.dashaNumber === 8;
        let effective8Count = count8;
        if (isMaha8Active || annualDasha.dashaNumber === 8) {
            effective8Count++;
        }

        const isEven8Pattern = effective8Count > 0 && effective8Count % 2 === 0;
        const isOdd8Pattern = !isEven8Pattern;

        if (isMaha8Active && isEven8Pattern) {
            specialInsights.push({ 
                title: "Even 8 in Grid (Activated by Dasha)", 
                text: "Signifies bulk financial gains, recovery of ancestral or disputed property, and sudden windfalls via land, litigation, or inheritance. Ideal timing for buying land/real estate with long-term value and resolving old property/legal cases in your favor.", 
                status: 'Green'
            });

            switch (annualDasha.dashaNumber) {
                case 1:
                    if(count1 === 1 || (count1 > 1 && destinyNumber === 1) || count1 === 0){
                        opportunities.push({ type: 'Property', text: 'Highly auspicious for acquiring property. Ideal time for purchases, title finalization, or land ownership initiation. Favorable for entering real estate business.' });
                    }
                    break;
                case 3:
                    opportunities.push({ type: 'Expansion', text: 'Promotes buying a second home, relocating to a bigger place, or investing in real estate for long-term returns. Also creates harmony in the family.' });
                    break;
                case 5:
                    opportunities.push({ type: 'Cash Flow', text: 'Brings financial liquidity, bonuses, or inheritance. Can be used for property down payments or loan clearance.' });
                    break;
                case 6:
                    opportunities.push({ type: 'Vehicle & Luxury', text: 'Activates vehicle upgrades, home renovations, and luxury asset buying to enhance material comforts.' });
                    break;
                case 4:
                    warnings.push('Annual Dasha of 4: Risk-laden property year. While opportunities may appear, there is a risk of hidden problems like legal issues, delays, or structural flaws. Also a chance of buying a Vehicle or electric gadgets. Proceed with strong caution.');
                    break;
                default:
                    break;
            }
        } else if (isMaha8Active && isOdd8Pattern) {
            warnings.push("Unstable period – avoid major property or asset moves. Reevaluate after current dasha phase ends.");
        }

        const isPositive6 = (count6, dest6) => (count6 === 0 || (count6 > 0 && dest6 === 6));
        if (annualDasha.dashaNumber === 6 && isPositive6(baseKundliGrid[6] || 0, destinyNumber) && !isMaha8Active) {
            opportunities.push({ type: 'Luxury Purchase', text: 'The Annual Dasha of 6 may lead to the purchase of a luxury item, such as a car, branded gadgets, or premium home upgrades.' });
        }

        return { opportunities, warnings, specialInsights };
    }, [targetDate, report, dashaReport]);

    const InsightBlock = ({ title, text, status }) => {
        const colorClass = status === 'Green' ?
            'border-green-500 bg-green-900/20 text-green-300' : status === 'Yellow' ? 'border-yellow-500 bg-yellow-900/20 text-yellow-300' : 'border-red-500 bg-red-900/20 text-red-300';
        return (
            <div className={`p-4 rounded-lg border-l-4 ${colorClass}`}>
                <h4 className="font-bold text-lg mb-1">{title}</h4>
                <p className="text-white/90">{text}</p>
            </div>
        )
    };

    return (
        <div className="space-y-6">
            <Card>
                <SectionTitle>Property & Asset Forecast</SectionTitle>
                <div className="space-y-4">

                    {propertyAnalysis.warnings.length > 0 && (
                        <div className="p-4 bg-red-900/50 rounded-lg">
                            <h3 className="font-bold text-xl text-red-400 mb-2">⚠️ High Caution Period</h3>
                            <ul className="list-disc list-inside text-red-300 space-y-2">
                                {propertyAnalysis.warnings.map((warn, i) => <li key={i}>{warn}</li>)}
                            </ul>
                        </div>
                    )}

                    {propertyAnalysis.specialInsights.map((insight, i) => (
                        <InsightBlock key={i} title={insight.title} text={insight.text} status={insight.status} />
                    ))}

                    {propertyAnalysis.opportunities.length > 0 && (
                        <div className="p-4 bg-green-900/50 rounded-lg">
                            <h3 className="font-bold text-xl text-green-400 mb-2">✅ Favorable Period for Assets</h3>
                            <ul className="list-disc list-inside text-green-300 space-y-2">
                                {propertyAnalysis.opportunities.map((opp, i) => <li key={i}><strong>{opp.type}:</strong> {opp.text}</li>)}
                            </ul>
                        </div>
                    )}

                    {propertyAnalysis.opportunities.length === 0 && propertyAnalysis.warnings.length === 0 && propertyAnalysis.specialInsights.length === 0 && (
                        <p className="text-center text-yellow-200/80 p-4">No specific asset triggers are active for this period based on the current Dasha. General financial prudence is advised.</p>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default PropertyForecastTab;