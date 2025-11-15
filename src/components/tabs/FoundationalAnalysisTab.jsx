import React, { useMemo } from 'react';
import Card from '../Card';
import SectionTitle from '../SectionTitle';
import NlgSummaryComponent from '../NlgSummaryComponent';
import { getText } from '../../utils/helpers'; // Import getText

const FoundationalAnalysisTab = ({ analysis, yogas, specialInsights }) => {
    // Assuming 'language' prop will be passed, defaulting to 'en' for now
    const language = 'en'; 

    const nlgPrompt = useMemo(() => {
        if (!analysis && !yogas) return null;
        let prompt = "You are a Vedic numerologist. Based on the following foundational chart analysis, write a 2-4 sentence summary of the person's key strengths and challenges. \n\n";
        if (yogas.length > 0) {
            prompt += "Foundational Yogas Present:\n";
            yogas.forEach(yoga => {
                prompt += `- ${getText(yoga.name, language)}: ${getText(yoga.description, language)}\n`;
            });
        } else {
            prompt += "No significant foundational yogas are present.\n";
        }
        if (analysis.length > 0) {
            prompt += "\nInfluence of Recurring Numbers:\n";
            analysis.forEach(item => {
                prompt += `- Number ${item.number} (appears ${item.occurrences} times): ${item.influence}\n`;
            });
        }
        if (specialInsights.length > 0) {
            prompt += "\nSpecial Foundational Insights:\n";
            specialInsights.forEach(insight => {
                prompt += `- ${getText(insight.title, language)}: ${getText(insight.text, language)}\n`;
            });
        }
        prompt += "\nSummarize the most important takeaways for the user in a gentle and empowering tone.";
        return prompt;
    }, [analysis, yogas, specialInsights, language]);

    return (
        <div className="space-y-6">
            <NlgSummaryComponent title="Your Foundational Blueprint" prompt={nlgPrompt} />
            <Card>
                <SectionTitle>Influence of Recurring Numbers</SectionTitle>
                
                {analysis.length > 0 ? (
                    <div className="space-y-6">
                        {analysis.map(item => (
                            <div key={item.number} className="bg-gray-900/50 p-4 rounded-md border-l-4 border-yellow-500">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="text-xl font-bold text-yellow-400">Number: {item.number}</h3>
                                    <span className="text-sm text-white/70">Occurrences: {item.occurrences}</span>
                                </div>
                                <div className="mt-3">
                                    <h4 className="font-semibold text-yellow-500 mb-1">Influence:</h4>
                                    <p className="text-white/90">{item.influence}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No numbers recur in your chart. The energy of each number is balanced.</p>
                )}
            </Card>
            {specialInsights && specialInsights.length > 0 && (
                <Card>
                    <SectionTitle>Special Foundational Insights</SectionTitle>
                    <div className="space-y-4">
                        {specialInsights.map((insight, index) => (
                            <div key={index} className="bg-indigo-900/40 p-4 rounded-md border-l-4 border-purple-400">
                                <h3 className="text-xl font-bold text-purple-300">{getText(insight.title, language)}</h3>
                                <p className="text-white/90 mt-2">{getText(insight.text, language)}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
            <Card>
                <SectionTitle>Foundational Yogas</SectionTitle>
                <div className="text-center bg-blue-900/30 text-blue-300 p-2 rounded-md mb-4 text-sm">
                    <p>This Yoga is based on the individual's Base Chart.</p>
                </div>
                {yogas.length > 0 ? (
                    <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                        {yogas.map(yoga => (
                            <div key={getText(yoga.name, language)} className="bg-gray-900/30 p-3 rounded-md">
                                <strong className="text-yellow-500">{getText(yoga.name, language)}</strong>
                                <p className="text-sm text-white/90">{getText(yoga.description, language)}</p>
                                {yoga.traits && (
                                    <ul className="list-disc list-inside text-xs mt-1 text-white/70">
                                        {yoga.traits.map(trait => <li key={getText(trait, language)}>{getText(trait, language)}</li>)}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                ) : <p>No foundational yogas detected in the birth chart.</p>}
            </Card>
        </div>
    );
};

export default FoundationalAnalysisTab;