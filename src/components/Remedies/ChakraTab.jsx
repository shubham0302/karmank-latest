import React from 'react';
import Card from '../Card';
import SectionTitle from '../SectionTitle';
import { getText } from '../../utils/helpers';
import { getRudrakshaData, getRelevantNumbers } from '../../utils/localData';

const ChakraTab = ({ report, language = 'en' }) => {
    try {

        if (!report?.relevantData) {
            return (
                <Card>
                    <SectionTitle>Chakra Activation through Rudraksha</SectionTitle>
                    <p className="text-yellow-400">Report data not fully loaded.</p>
                </Card>
            );
        }

        const uniqueNumbers = getRelevantNumbers(report);

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
            const remedy = getRudrakshaData(report, num);
            // Use getText to ensure we are reading the string from the language object
            const mukhiText = remedy ? getText(remedy.mukhi, language) : "";
            return mukhiText.split(' / ');
        }).filter(Boolean); // Filter out any empty strings

        // Get chakra data from relevantData if available
        const chakraData = report.relevantData?.chakraData;
        if (!chakraData) {
            return (
                <Card>
                    <SectionTitle>Chakra Activation through Rudraksha</SectionTitle>
                    <p className="text-blue-400">Chakra data is not available.</p>
                </Card>
            );
        }

        const relevantChakras = Object.entries(chakraData).filter(([_, chakraDetails]) =>
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
            <Card className="pdf-page-break-after" style={{ pageBreakAfter: 'always', pageBreakInside: 'avoid' }}>
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
