import React, { useMemo, useEffect } from 'react';
import Card from '../Card';
import SectionTitle from '../SectionTitle';
import { DATA } from '../../data/data';

const ProfessionForecastTab = ({ report, dashaReport, gender, targetDate }) => {
    useEffect(() => {
        console.log('[ProfessionForecast] Component MOUNTED');
        return () => {
            console.log('[ProfessionForecast] Component UNMOUNTING');
        };
    }, []);

    useEffect(() => {
        console.log('[ProfessionForecast] Props changed:', { targetDate, reportExists: !!report, dashaExists: !!dashaReport });
    }, [targetDate, report, dashaReport]);

    if (!report || !dashaReport) {
        console.error('[ProfessionForecast] Missing required data:', { report: !!report, dashaReport: !!dashaReport });
        return null;
    }

    const professionAnalysis = useMemo(() => {
        console.log('[ProfessionForecast] Calculating analysis for targetDate:', targetDate);
        console.log('[ProfessionForecast] Report data:', {
            destinyNumber: report.destinyNumber,
            baseKundliGrid: report.baseKundliGrid,
            dob: report.dob
        });
        console.log('[ProfessionForecast] DashaReport timelines:', {
            yearlyCount: dashaReport.yearlyDashaTimeline?.length,
            mahaCount: dashaReport.mahaDashaTimeline?.length
        });

        // Debug: Log first dasha entry to see data types
        if (dashaReport.yearlyDashaTimeline.length > 0) {
            const firstYearly = dashaReport.yearlyDashaTimeline[0];
            console.log('[ProfessionForecast] First yearly dasha sample:', {
                startDate: firstYearly.startDate,
                startDateType: typeof firstYearly.startDate,
                startDateIsDate: firstYearly.startDate instanceof Date,
                endDate: firstYearly.endDate,
                endDateType: typeof firstYearly.endDate,
                endDateIsDate: firstYearly.endDate instanceof Date
            });
        }

        console.log('[ProfessionForecast] Looking for dasha matching targetDate:', {
            targetDate,
            targetDateType: typeof targetDate,
            targetDateIsDate: targetDate instanceof Date
        });

        const yearlyDasha = dashaReport.yearlyDashaTimeline.find(d => targetDate >= d.startDate && targetDate <= d.endDate);
        const mahaDasha = dashaReport.mahaDashaTimeline.find(d => targetDate >= d.startDate && targetDate <= d.endDate);

        console.log('[ProfessionForecast] Found dashas:', {
            yearlyDasha: yearlyDasha ? { dashaNumber: yearlyDasha.dashaNumber, startDate: yearlyDasha.startDate, endDate: yearlyDasha.endDate } : null,
            mahaDasha: mahaDasha ? { dashaNumber: mahaDasha.dashaNumber, startDate: mahaDasha.startDate, endDate: mahaDasha.endDate } : null
        });

        if (!yearlyDasha || !mahaDasha) {
            console.warn('[ProfessionForecast] Dasha not found for targetDate:', targetDate);
            return { outlook: { title: 'N/A', text: 'Forecast not available for this date.', status: 'Yellow'}, opportunities: [], challenges: [], advice: [], partnership: [], milestones: [] };
        }

        const { destinyNumber, baseKundliGrid } = report;
        const annualDashaNumber = yearlyDasha.dashaNumber;
        const mahaDashaNumber = mahaDasha.dashaNumber;

        const outlook = { title: '', text: '', status: 'Yellow' };
        let opportunities = [];
        let challenges = [];
        let advice = [];
        let partnership = [];
        let isMahaDashaDominant = false;

        const count = (num) => baseKundliGrid[num] || 0;

        if (mahaDashaNumber === 1) {
            const isPositive1 = (count(1) <= 1 || destinyNumber === 1);
            if (isPositive1) {
                outlook.status = 'Green';
                outlook.title = "Long-Term Favorable Period (Maha Dasha of 1)";
                outlook.text = "Your major life period is governed by a positive Number 1, indicating a long-term phase highly favorable for career growth, leadership, and professional success. The Annual Dasha will add specific flavors to this overarching positive theme.";
                isMahaDashaDominant = true;
            }
        }

        console.log('[ProfessionForecast] isMahaDashaDominant:', isMahaDashaDominant);
        console.log('[ProfessionForecast] annualDashaNumber:', annualDashaNumber);

        if (!isMahaDashaDominant) {
            switch (annualDashaNumber) {
                case 1:
                    outlook.title = "This period is influenced by Number 1 – The Leader's Code";
                    const isPositive1InChart = (count(1) <= 1 || destinyNumber === 1);
                    console.log('[ProfessionForecast] Case 1: count(1)=' + count(1) + ', destinyNumber=' + destinyNumber + ', isPositive=' + isPositive1InChart);
                    if (isPositive1InChart) {
                        outlook.status = 'Green';
                        outlook.text = "This Dasha brings confidence, leadership roles, promotions, and opportunities for business leadership. The native receives respect, high decision-making authority, and wealth through power. It enhances their command over others and uplifts their self-image.";
                    } else {
                        outlook.status = 'Red';
                        outlook.text = "This period brings ego clashes, aggression, isolation, and financial disruption. The person may become impulsive, leading to poor decision-making and facing delays or rejections in high-stake opportunities.";
                    }
                    console.log('[ProfessionForecast] After case 1: outlook =', outlook);
                    break;
                case 2:
                    outlook.title = "This period is influenced by Number 2 – The Mirror of Emotion";
                    outlook.status = 'Red';
                    outlook.text = "This period often triggers significant emotional instability, heightened sensitivity, and internal conflict. The native may experience sharp mood fluctuations, self-doubt, and clouded judgment. This inner turmoil can manifest externally as professional setbacks, strained relationships with colleagues, and a pervasive lack of clarity and confidence.";
                    advice.push("This is a time for introspection and patience, not for bold, decisive action. It is strongly advised to postpone major life and career decisions, such as changing jobs, launching a new venture, or making significant financial commitments. Decisions made under this influence are likely to be emotionally driven and may lead to future regret.");
                    break;
                case 3:
                    outlook.title = "This period is influenced by Number 3 – The Guru’s Blueprint";
                    if (count(3) <= 1) {
                        outlook.status = 'Green';
                        outlook.text = "This period is highly positive for professional expansion, bringing respect, name, fame, and financial growth. It broadens horizons and elevates one's social and professional standing. It is exceptionally favorable for those in consultation-based industries, positioning them as thought leaders in fields like teaching, coaching, astrology, science, and law.";
                    } else if (count(3) === 2) {
                        outlook.status = 'Yellow';
                        outlook.text = "This configuration is manageable professionally but often introduces challenges in the domestic sphere. While career growth may continue, it can be accompanied by family disputes, communication breakdowns, or a feeling of being pulled between public success and private responsibilities.";
                    } else {
                        outlook.status = 'Red';
                        outlook.text = "This becomes a negative influence. The over-abundance of Jupiter's energy leads to scattered focus, arrogance, and poor judgment. Professional growth stalls, promises may be broken, and the native's reputation can suffer.";
                    }
                    break;
                case 4:
                    outlook.title = "This period is influenced by Number 4 – The Unpredictable Disruptor";
                    if (destinyNumber === 4) {
                        outlook.status = 'Yellow';
                        outlook.text = "When Destiny is 4, the disruptive energy of the Dasha transforms into a catalyst for growth. The risk of deception is significantly reduced. Instead, there is a high probability of receiving a major new opportunity, often one that requires hard work and structure but leads to long-term stability and success.";
                    } else {
                        outlook.status = 'Red';
                        outlook.text = "This period is often marked by a high risk of professional losses, unexpected setbacks, and deception. It is a time when one's judgment and trust are tested.";
                        advice.push("Financial Prudence: Exercise extreme caution in all financial dealings. This is not the time for risky investments or verbal financial agreements.", "Contractual Diligence: Before switching jobs, signing contracts, or entering new partnerships, ensure every detail is documented meticulously on paper.", "Trust & Verification: Be wary of 'too good to be true' offers. This Dasha can expose hidden intentions.");
                    }
                    break;
                case 5:
                    outlook.title = "This period is influenced by Number 5 – The Transformer’s Gateway";
                    if (count(5) === 0 || destinyNumber === 5) {
                        outlook.status = 'Green';
                        outlook.text = "Brings breakthrough job opportunities, unexpected offers, and favorable job switches. This often translates directly into a cash flow boost, promotions, and salary hikes. It is highly beneficial for business expansion, especially in dynamic fields like digital marketing and communications.";
                    } else if (count(5) === 1) {
                        outlook.status = 'Green';
                        outlook.text = "This Dasha is exceptionally beneficial. For those who are, or aspire to be, Chartered Accountants (CAs) or work in finance, this period enhances analytical skills and brings significant professional success.";
                    } else {
                        outlook.status = 'Red';
                        outlook.text = "This leads to mental fatigue, chronic anxiety, and instability. The excess energy of 5 results in poor decision-making, financial mismanagement, and scattered goals, often causing 'career whiplash.'";
                    }
                    const masculine = count(1) + count(3) + count(9);
                    const feminine = count(2) + count(6) + count(8);
                    if (feminine > masculine) {
                        partnership.push({ status: 'Red', text: "Vulnerable to being cheated, misled, or taken advantage of in financial or contractual matters." });
                    } else {
                        partnership.push({ status: 'Yellow', text: "May be tempted to use their intellectual sharpness to mislead others, cut corners, or engage in deceptive practices for personal gain." });
                    }
                    break;
                case 6:
                    outlook.title = "This period is influenced by Number 6 – The Magnet of Luxury";
                    if (count(6) === 0 || destinyNumber === 6) {
                        outlook.status = 'Green';
                        outlook.text = "Highly favorable for financial growth, attracting luxury, building a brand, and improving relationships. It activates charm, attraction, and diplomacy, bringing high-value collaborations. It is highly favorable for careers in fashion, design, beauty, entertainment, and hospitality.";
                    } else {
                        outlook.status = 'Red';
                        outlook.text = "Can cause financial overindulgence, vanity, and unwanted romantic entanglements. Career progress may become dependent on appearances and external validation, resulting in setbacks.";
                    }
                    break;
                case 7:
                    outlook.title = "This period is influenced by Number 7 – The Spiritual Teacher";
                    if (count(7) >= 3 && destinyNumber !== 7) {
                        outlook.status = 'Red';
                        outlook.text = "The Maha Dasha or Annual Dasha of 7 can trigger job loss, sudden transfers, professional confusion, instability, or a deep mental detachment from one's career. Often, this period is a karmic test of detachment.";
                    } else {
                        outlook.status = 'Green';
                        outlook.text = "Leads to job attainment, often through what feels like divine timing, network grace, or a karmic return. It is especially useful for professionals in healing, spirituality, technology, research, or teaching.";
                    }
                    break;
                case 8:
                    outlook.title = "This period is influenced by Number 8 – The Karma Financier";
                    let effective8Count = count(8);
                    if (mahaDashaNumber === 8) effective8Count++;
                    if (annualDashaNumber === 8) effective8Count++;
                    if (effective8Count > 0 && effective8Count % 2 === 0) {
                        outlook.status = 'Green';
                        outlook.text = "Brings bonuses, sudden financial gains, promotion, job security, power, and authority. It enables the recovery of stuck money, resolves debts, and can lead to legal wins or past karmic rewards. Ideal for those in government, banking, law, real estate, and politics.";
                        if (destinyNumber === 8) {
                            opportunities.push("With Destiny 8, this Dasha becomes immensely auspicious, turning you into a magnet for wealth, especially within large systems or legacy industries.");
                        }
                        advice.push("An Even 8 count during a Dasha makes the native intuitively powerful, making it a suitable time for trading, speculation, and high-risk financial ventures.");
                    } else {
                        outlook.status = 'Red';
                        outlook.text = "Leads to financial instability, unpredictable losses, career delays, and blocked promotions. An overburden of karma without clear direction can cause exhaustion and struggle.";
                    }
                    break;
                case 9:
                    outlook.title = "This period is influenced by Number 9 – The Commander";
                    if (destinyNumber === 9) {
                        outlook.status = 'Green';
                        outlook.text = "Brings power, elevated social standing, and financial growth through courage and decisive leadership. It is excellent for careers in the military, politics, top-tier management, or spiritual leadership. This period often grants land/property gains, public honors, and command roles.";
                    } else if (count(9) === 1) {
                        outlook.status = 'Yellow';
                        outlook.text = "The Dasha is largely neutral, with no strong financial boost.";
                    } else {
                        outlook.status = 'Red';
                        outlook.text = "The Dasha becomes problematic. It can trigger external troubles, issues with superiors, and tension surrounding one's social image. Businesses may suffer from negative publicity, hidden enemies, or unwanted office politics.";
                    }
                    break;
                default:
                    outlook.text = "No specific professional forecast for this Dasha period.";
            }
        } else {
            if (annualDashaNumber === 4) {
                challenges.push("While your long-term outlook is positive, this specific year (Annual Dasha of 4) may bring some temporary documentation issues or delays. Stay organized to navigate them smoothly.");
            }
             if (annualDashaNumber === 2) {
                challenges.push("While your long-term career trend is positive, this year's Annual Dasha of 2 may bring emotional sensitivity into the workplace. Avoid making major decisions based on feelings alone.");
            }
        }

        const currentYear = new Date().getFullYear();
        const milestoneYears = dashaReport.yearlyDashaTimeline
            .filter(d => d.year >= currentYear)
            .filter(d => {
                const dashaNum = d.dashaNumber;

                // Number 1: Only favorable if count(1) <= 1 OR destinyNumber === 1
                if (dashaNum === 1) return (count(1) <= 1 || destinyNumber === 1);

                // Number 3: Only favorable if count(3) <= 1 (Green status)
                if (dashaNum === 3) return count(3) <= 1;

                // Number 5: Only favorable if count(5) === 0 OR count(5) === 1 OR destinyNumber === 5
                if (dashaNum === 5) return (count(5) === 0 || count(5) === 1 || destinyNumber === 5);

                // Number 6: Only favorable if count(6) === 0 OR destinyNumber === 6
                if (dashaNum === 6) return (count(6) === 0 || destinyNumber === 6);

                // Number 7: Only favorable if NOT (count(7) >= 3 AND destinyNumber !== 7)
                if (dashaNum === 7) return !(count(7) >= 3 && destinyNumber !== 7);

                // Number 8: Only favorable if even count (including this dasha)
                if (dashaNum === 8) {
                    let effective8 = count(8);
                    // Find maha dasha for this year
                    const yearDate = new Date(d.year, report.dob.getMonth(), report.dob.getDate());
                    const mahaFor8 = dashaReport.mahaDashaTimeline.find(md =>
                        yearDate >= md.startDate && yearDate <= md.endDate
                    );
                    if (mahaFor8?.dashaNumber === 8) effective8++;
                    effective8++; // Add the annual dasha itself
                    return (effective8 > 0 && effective8 % 2 === 0);
                }

                // Number 9: Only favorable if destinyNumber === 9
                if (dashaNum === 9) return destinyNumber === 9;

                return false;
            })
            .slice(0, 10)
            .map(d => d.year);

        const result = { outlook, opportunities, challenges, advice, partnership, milestones: milestoneYears };
        console.log('[ProfessionForecast] Calculated analysis:', {
            outlookTitle: result.outlook.title,
            outlookStatus: result.outlook.status,
            opportunitiesCount: result.opportunities.length,
            challengesCount: result.challenges.length,
            adviceCount: result.advice.length,
            partnershipCount: result.partnership.length,
            milestonesCount: result.milestones.length,
            milestones: result.milestones
        });

        return result;

    }, [targetDate, report, dashaReport]);

    console.log('[ProfessionForecast] RENDERING with analysis:', {
        hasOutlookTitle: !!professionAnalysis.outlook.title,
        outlookTitle: professionAnalysis.outlook.title,
        outlookText: professionAnalysis.outlook.text?.substring(0, 50) + '...'
    });

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
                <h4 className="font-semibold text-lg text-yellow-300 mb-2 print:text-sm print:mb-1">{icon} {title}</h4>
                <ul className={`list-disc list-inside space-y-2 pl-4 border-l-4 ${colorClass} print:space-y-1 print:text-xs print:pl-2`}>
                    {items.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <Card className="pdf-page-break-after print:space-y-2" style={{ pageBreakAfter: 'always', pageBreakInside: 'avoid' }}>
                <SectionTitle className="print:text-base print:mb-2">Professional Forecast</SectionTitle>
                <div className="p-4 bg-gray-900/50 rounded-lg space-y-6 print:space-y-2 print:p-2">
                    <div>
                        <h3 className="font-bold text-xl text-yellow-400 mb-2 print:text-sm print:mb-1">{professionAnalysis.outlook.title}</h3>
                        <div className="flex items-start">
                            <StatusIcon status={professionAnalysis.outlook.status} />
                            <p className="print:text-xs">{professionAnalysis.outlook.text}</p>
                        </div>
                    </div>

                    <InsightCard title="Key Opportunities" items={professionAnalysis.opportunities} status="Green" icon="✅" />
                    <InsightCard title="Potential Challenges" items={professionAnalysis.challenges} status="Red" icon="❌" />
                    <InsightCard title="Strategic Advice" items={professionAnalysis.advice} status="Yellow" icon="💡" />
                </div>
                <div className="flex justify-end mt-4 print:hidden">
                    <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 disabled:bg-gray-500" title="Full Vedic Kundli analysis required for confirmation.">
                        Verify with Vedic Kundli
                    </button>
                </div>

                {/* Partnership & Risk Analysis - Same Page with Border */}
                <div className="mt-6 pt-4 border-t-2 border-gray-700 print:mt-3 print:pt-2">
                    <h3 className="text-xl font-bold text-yellow-300 mb-3 print:text-sm print:mb-1">Partnership & Risk Analysis</h3>
                    {professionAnalysis.partnership.length > 0 ?
                        professionAnalysis.partnership.map((item, index) => (
                            <div key={index} className="flex items-start p-3 mb-2 bg-gray-900/50 rounded-md print:p-2 print:mb-1 print:text-xs" title="Partnership Insight">
                                <StatusIcon status={item.status} />
                                <p>{item.text}</p>
                            </div>
                        )) : <p className="print:text-xs">No specific partnership risks detected for this period.</p>}
                </div>

                {/* Career Milestone Years - Same Page with Border */}
                <div className="mt-6 pt-4 border-t-2 border-gray-700 print:mt-3 print:pt-2">
                    <h3 className="text-xl font-bold text-yellow-300 mb-3 print:text-sm print:mb-1">Career Milestone Years</h3>
                    <p className="text-sm text-white/70 mb-4 print:text-xs print:mb-2">High probability years for job opportunities based on favorable Dasha periods (chart-specific calculations).</p>
                    <div className="flex flex-wrap gap-4 print:gap-2">
                        {professionAnalysis.milestones.length > 0 ?
                            professionAnalysis.milestones.map(year => (
                                <div key={year} className="bg-green-500/20 text-green-300 font-bold py-2 px-4 rounded-full print:py-1 print:px-2 print:text-xs">
                                    {year}
                                </div>
                            )) : <p className="print:text-xs">No immediate milestone years detected.</p>}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ProfessionForecastTab;