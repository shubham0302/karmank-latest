import React, { useState, useEffect } from 'react';
import Card from './Card'; // Import the Card component

const NlgSummaryComponent = ({ prompt, title }) => {
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!prompt) return;

        const generateSummary = async () => {
            setIsLoading(true);
            setError('');
            try {
                const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

                if (!apiKey) {
                    throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
                }

                const payload = {
                    contents: [{
                        role: "user",
                        parts: [{ text: prompt }]
                    }]
                };

                const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-001:generateContent?key=${apiKey}`;

                console.log("Calling Gemini API with URL:", apiUrl);

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                console.log("Response status:", response.status);
                const result = await response.json();
                console.log("API Response:", result);

                if (!response.ok) {
                    const errorMsg = result.error?.message || `API call failed with status: ${response.status}`;
                    throw new Error(errorMsg);
                }

                if (result.candidates && result.candidates.length > 0 && result.candidates[0].content?.parts?.[0]?.text) {
                    const text = result.candidates[0].content.parts[0].text;
                    setSummary(text);
                } else {
                    setSummary("Could not generate a detailed summary at this time. Please review the data below.");
                }
            } catch (err) {
                console.error("Error generating summary:", err);
                setError('An error occurred while generating the summary.');
                setSummary("Could not generate a summary. Please check the console for errors.");
            } finally {
                setIsLoading(false);
            }
        };

        generateSummary();
    }, [prompt]); // Re-run whenever the prompt changes

    return (
        <Card className="bg-indigo-900/30 border-indigo-400">
            <h3 className="text-xl font-bold text-indigo-300 mb-3">{title}</h3>
            {isLoading && <p className="text-indigo-200/80">Generating personalized insights...</p>}
            {error && <p className="text-red-400">{error}</p>}
            {!isLoading && !error && (
                <p className="text-indigo-200 whitespace-pre-wrap">{summary}</p>
            )}
        </Card>
    );
};

export default NlgSummaryComponent;