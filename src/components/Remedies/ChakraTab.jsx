import React from 'react';
import Card from '../Card';
import SectionTitle from '../SectionTitle';
import { DATA } from '../../data/data';
import { getText } from '../../utils/helpers';

const ChakraTab = ({ report }) => {
    try {
        // Assuming 'language' prop will be passed, defaulting to 'en' for now
        const language = 'en';

        if (!report) {
            return (
                <Card>
                    <SectionTitle>Chakra Activation through Rudraksha</SectionTitle>
                    <p className="text-red-400">Report data is not available.</p>
                </Card>
            );
        }

        if (!report.basicNumber || !report.destinyNumber) {
            return (
                <Card>
                    <SectionTitle>Chakra Activation through Rudraksha</SectionTitle>
                    <p className="text-red-400">Basic number or destiny number is missing.</p>
                </Card>
            );
        }

        const uniqueNumbers = [...new Set([report.basicNumber, report.destinyNumber])].filter(Boolean);

        if (uniqueNumbers.length === 0) {
            return (
                <Card>
                    <SectionTitle>Chakra Activation through Rudraksha</SectionTitle>
                    <p className="text-red-400">No valid numbers found.</p>
                </Card>
            );
        }

        // Get all recommended Mukhis (e.g., "1 Mukhi", "12 Mukhi", "2 Mukhi", "Gauri Shankar")
        const recommendedMukhis = uniqueNumbers.flatMap(num => {
            const remedy = DATA.rudrakshaRemedies?.[num];
            // Use getText to ensure we are reading the string from the language object
            const mukhiText = remedy ? getText(remedy.mukhi, language) : "";
            return mukhiText.split(' / ');
        }).filter(Boolean); // Filter out any empty strings

        if (!DATA.chakraData) {
            return (
                <Card>
                    <SectionTitle>Chakra Activation through Rudraksha</SectionTitle>
                    <p className="text-red-400">Chakra data is not available.</p>
                </Card>
            );
        }

        const relevantChakras = Object.entries(DATA.chakraData).filter(([_, chakraDetails]) =>
            chakraDetails.mukhi.some(mukhi => recommendedMukhis.includes(mukhi))
        );

        if (relevantChakras.length === 0) {
            return (
                <Card>
                    <SectionTitle>Chakra Activation through Rudraksha</SectionTitle>
                    <p className="text-yellow-200/70">No chakras found for your recommended Rudrakshas.</p>
                </Card>
            );
        }

        return (
            <Card>
                <SectionTitle>Chakra Activation through Rudraksha</SectionTitle>
                <p className="mb-6 text-yellow-200/70">The Rudrakshas recommended for your Basic and Destiny numbers can help activate and balance the following Chakras:</p>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-900/50">
                            <tr>
                                <th className="p-3">Chakra</th>
                                <th className="p-3">Location</th>
                                <th className="p-3">Ruling Mukhi</th>
                                <th className="p-3">Effect of Wearing</th>
                            </tr>
                        </thead>
                        <tbody>
                            {relevantChakras.map(([chakraName, chakraDetails]) => (
                                <tr key={chakraName} className="border-b border-gray-700">
                                    <td className="p-3 font-semibold text-yellow-400">{chakraName}</td>
                                    <td className="p-3">{getText(chakraDetails.location, language)}</td>
                                    <td className="p-3">{chakraDetails.mukhi.join(', ')}</td>
                                    <td className="p-3">{getText(chakraDetails.effect, language)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        );
    } catch (error) {
        console.error('Error in ChakraTab:', error);
        return (
            <Card>
                <SectionTitle>Chakra Activation through Rudraksha</SectionTitle>
                <p className="text-red-400">An error occurred while loading Chakra data: {error.message}</p>
            </Card>
        );
    }
};

export default ChakraTab;
