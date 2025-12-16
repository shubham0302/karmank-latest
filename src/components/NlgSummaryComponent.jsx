import React, { useState, useEffect } from 'react';
import Card from './Card'; // Import the Card component

const NlgSummaryComponent = ({ prompt, title, shouldGenerate = false }) => {
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [userTriggered, setUserTriggered] = useState(false);
    const [lastPrompt, setLastPrompt] = useState('');

    useEffect(() => {
        if (!prompt) return;

        // Only generate if:
        // 1. Explicitly triggered by shouldGenerate prop or user button click
        // 2. OR prompt has changed (first load or language switch)
        // BUT skip if we've already generated this exact prompt (lastPrompt tracks what we generated)
        const promptChanged = prompt !== lastPrompt;
        const shouldRegenerate = shouldGenerate || userTriggered || promptChanged;

        if (!shouldRegenerate) {
            setIsLoading(false);
            return;
        }

        const generateSummary = async () => {
            setIsLoading(true);
            setError('');
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

                console.log("🔒 Calling secure backend API for NLG generation...");
                console.time("NLG Generation Time");

                // Generate cache key based on prompt (first 50 chars)
                const cacheKey = `nlg_summary_${prompt.substring(0, 50).replace(/\s+/g, '_')}`;

                // Add timeout wrapper (30 seconds max)
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 30000);

                const response = await fetch(`${backendUrl}/nlg/generate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        prompt,
                        cacheKey,
                        nlgType: 'summary'
                    }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                console.log("Response status:", response.status);
                const result = await response.json();
                console.timeEnd("NLG Generation Time");
                console.log("API Response:", result);

                if (!response.ok) {
                    const errorMsg = result.message || `API call failed with status: ${response.status}`;
                    throw new Error(errorMsg);
                }

                if (result.success && result.text) {
                    setSummary(result.text);
                    setLastPrompt(prompt); // Track this prompt
                    setUserTriggered(false); // Reset user trigger
                    if (result.cached) {
                        console.log("✅ Summary loaded from cache (no API cost)");
                    } else {
                        console.log("✅ Summary generated and cached");
                    }
                } else {
                    setSummary("Could not generate a detailed summary at this time. Please review the data below.");
                    setLastPrompt(prompt);
                    setUserTriggered(false);
                }
            } catch (err) {
                console.error("Error generating summary:", err);

                console.timeEnd("NLG Generation Time");

                // More detailed error messages
                let errorMessage = 'An error occurred while generating the summary.';
                let summaryMessage = "Could not generate a summary. Please check your backend server is running.";

                if (err.name === 'AbortError') {
                    errorMessage = 'Request timeout: AI generation took too long (>30s).';
                    summaryMessage = "The AI service is taking longer than expected. This might be due to Lambda cold start or Gemini API latency. Please try again.";
                } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
                    errorMessage = 'Network error: Unable to connect to backend server.';
                    summaryMessage = "Backend server is not reachable. Check if the server is running at: " + (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080');
                } else if (err.message.includes('API key')) {
                    errorMessage = 'Backend API key not configured.';
                    summaryMessage = "The backend server needs a valid Gemini API key. Please configure GEMINI_API_KEY environment variable.";
                } else if (err.message.includes('Gemini')) {
                    errorMessage = 'AI service error: ' + err.message;
                    summaryMessage = "Google Gemini API returned an error. Check Lambda logs for details.";
                } else {
                    errorMessage = 'Error: ' + err.message;
                }

                setError(errorMessage);
                setSummary(summaryMessage);
                setLastPrompt(prompt); // Track even on error to prevent infinite retries
                setUserTriggered(false);
            } finally {
                setIsLoading(false);
            }
        };

        generateSummary();
    }, [prompt, shouldGenerate, userTriggered, summary, lastPrompt]); // Re-run when prompt or trigger changes

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