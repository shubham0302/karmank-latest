import React, { useState, useEffect } from 'react';

const NlgChildBirthForecast = ({ analysis, shouldGenerate = false }) => {
    const [forecastText, setForecastText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [userTriggered, setUserTriggered] = useState(false);

    useEffect(() => {
        if (!analysis) return;

        // Only generate if explicitly triggered
        if (!shouldGenerate && !userTriggered) {
            setIsLoading(false);
            return;
        }

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
                const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

                console.log("[Childbirth Forecast] 🔒 Calling secure backend API for NLG generation...");

                // Generate cache key based on analysis status
                const cacheKey = `nlg_childbirth_${analysis.status}`;

                const response = await fetch(`${backendUrl}/nlg/generate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        prompt,
                        cacheKey,
                        nlgType: 'childbirth'
                    })
                });

                console.log("[Childbirth Forecast] Response status:", response.status);
                const result = await response.json();
                console.log("[Childbirth Forecast] API Response:", result);

                if (!response.ok) {
                    const errorMsg = result.message || `API call failed with status: ${response.status}`;
                    throw new Error(errorMsg);
                }

                if (result.success && result.text) {
                    setForecastText(result.text);
                    if (result.cached) {
                        console.log("✅ Childbirth forecast loaded from cache (no API cost)");
                    } else {
                        console.log("✅ Childbirth forecast generated and cached");
                    }
                } else {
                    throw new Error("Received an invalid response from the API.");
                }

            } catch (err) {
                console.error("Error generating forecast:", err);
                setError('Could not generate the forecast at this time. Please ensure backend server is running.');
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
    }, [analysis, shouldGenerate, userTriggered]);

    if (isLoading) {
        return <div className="p-4 text-center text-indigo-200 animate-pulse">Generating your personalized forecast...</div>;
    }
    if (error) {
        return <div className="p-4 text-center text-red-400">{error}</div>;
    }
    if (!forecastText) {
        return (
            <div className="p-4 text-center">
                <p className="text-indigo-200 mb-3">Click below to generate your AI-powered childbirth forecast</p>
                <button
                    onClick={() => setUserTriggered(true)}
                    className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-400 hover:to-purple-500 transition-all duration-300 shadow-md hover:shadow-indigo-500/50"
                >
                    ✨ Generate Forecast
                </button>
            </div>
        );
    }

    return <div className="p-4 text-indigo-100">{forecastText}</div>;
};

export default NlgChildBirthForecast;