import React, { useState, useEffect } from 'react';
import Card from './Card'; // Import the Card component

const NlgSummaryComponent = ({ prompt, title }) => {
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Gemini API integration disabled for production deployment
        setIsLoading(false);
        setSummary("AI-powered insights temporarily unavailable. Please review the detailed analysis below.");
    }, [prompt]);

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