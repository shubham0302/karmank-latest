import React, { useState, useEffect } from 'react';
import Card from './Card'; // Import the Card component

const NlgSummaryComponent = ({ prompt, title, shouldGenerate = false }) => {
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [userTriggered, setUserTriggered] = useState(false);

    useEffect(() => {
        if (!prompt) return;

        // Only generate if explicitly triggered by shouldGenerate prop or user button click
        if (!shouldGenerate && !userTriggered) {
            setIsLoading(false);
            return;
        }

        const generateSummary = async () => {
            setIsLoading(true);
            setError('');
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

                console.log("🔒 Calling secure backend API for NLG generation...");

                // Generate cache key based on prompt (first 50 chars)
                const cacheKey = `nlg_summary_${prompt.substring(0, 50).replace(/\s+/g, '_')}`;

                const response = await fetch(`${backendUrl}/nlg/generate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        prompt,
                        cacheKey,
                        nlgType: 'summary'
                    })
                });

                console.log("Response status:", response.status);
                const result = await response.json();
                console.log("API Response:", result);

                if (!response.ok) {
                    const errorMsg = result.message || `API call failed with status: ${response.status}`;
                    throw new Error(errorMsg);
                }

                if (result.success && result.text) {
                    setSummary(result.text);
                    if (result.cached) {
                        console.log("✅ Summary loaded from cache (no API cost)");
                    } else {
                        console.log("✅ Summary generated and cached");
                    }
                } else {
                    setSummary("Could not generate a detailed summary at this time. Please review the data below.");
                }
            } catch (err) {
                console.error("Error generating summary:", err);
                setError('An error occurred while generating the summary.');
                setSummary("Could not generate a summary. Please check your backend server is running.");
            } finally {
                setIsLoading(false);
            }
        };

        generateSummary();
    }, [prompt, shouldGenerate, userTriggered]); // Re-run when prompt or trigger changes

    return (
        <Card className="bg-indigo-900/30 border-indigo-400">
            <h3 className="text-xl font-bold text-indigo-300 mb-3">{title}</h3>
            {isLoading && <p className="text-indigo-200/80">Generating personalized insights...</p>}
            {error && <p className="text-red-400">{error}</p>}
            {!isLoading && !error && summary && (
                <p className="text-indigo-200 whitespace-pre-wrap">{summary}</p>
            )}
            {!isLoading && !summary && !error && (
                <div className="text-center">
                    <p className="text-indigo-200 mb-3">Click below to generate AI-powered insights for this section</p>
                    <button
                        onClick={() => setUserTriggered(true)}
                        className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-400 hover:to-purple-500 transition-all duration-300 shadow-md hover:shadow-indigo-500/50"
                    >
                        ✨ Generate Insights
                    </button>
                </div>
            )}
        </Card>
    );
};

export default NlgSummaryComponent;