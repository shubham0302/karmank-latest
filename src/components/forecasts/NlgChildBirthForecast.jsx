import React, { useState, useEffect } from 'react';

const NlgChildBirthForecast = ({ analysis }) => {
    const [forecastText, setForecastText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!analysis) return;

        const generateText = async () => {
            setIsLoading(true);
            setError('');

            let prompt = "You are a numerology expert providing a childbirth forecast. Based on the following analysis, write a concise, encouraging, and easy-to-understand forecast in 2-3 sentences.\n\nAnalysis Data:\n";
            if (analysis.dasha3.active) {
                prompt += `- An Annual Dasha of 3 is active. This influence is considered ${analysis.dasha3.favorable ? 'favorable' : 'not strongly favorable'} for childbirth.\n`;
            }
            if (analysis.even8.active) {
                prompt += `- An 'even 8' pattern is active with an effective count of ${analysis.even8.count}. This is a positive sign for auspicious events.\n`;
            }

            if (!analysis.dasha3.active && !analysis.even8.active) {
                prompt += "- No specific positive indicators for childbirth are active in the dashas.\n";
            }
            prompt += "\nGenerate the forecast:";

            try {
                let chatHistory = [];
                chatHistory.push({ role: "user", parts: [{ text: prompt }] });
                const payload = { contents: chatHistory };
                const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

                if (!apiKey) {
                    throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
                }

                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error(`API call failed with status: ${response.status}`);
                }

                const result = await response.json();
                if (result.candidates && result.candidates.length > 0 && result.candidates[0].content.parts.length > 0) {
                    const text = result.candidates[0].content.parts[0].text;
                    setForecastText(text);
                } else {
                    throw new Error("Received an invalid response from the API.");
                }

            } catch (err) {
                console.error("Error generating forecast:", err);
                setError('Could not generate the forecast at this time. Please try again later.');
                if (analysis.status === 'Green') {
                    setForecastText("The current Dasha period shows positive indicators, suggesting a high possibility for childbirth this year.");
                } else if (analysis.status === 'Yellow') {
                    setForecastText("While some indicators are present, the overall energy for childbirth is neutral. Other factors in the chart are not strongly amplifying the possibility.");
                } else {
                    setForecastText("No specific numerological indicators for childbirth are active in the current major Dasha periods.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        generateText();
    }, [analysis]);

    if (isLoading) {
        return <div className="p-4 text-center">Generating your personalized forecast...</div>;
    }
    if (error) {
        return <div className="p-4 text-center text-red-400">{error}</div>;
    }

    return <div className="p-4">{forecastText}</div>;
};

export default NlgChildBirthForecast;