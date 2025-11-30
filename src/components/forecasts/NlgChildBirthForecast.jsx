import React, { useState, useEffect } from 'react';

const NlgChildBirthForecast = ({ analysis }) => {
    const [forecastText, setForecastText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!analysis) return;

        // Gemini API integration disabled - using fallback text
        setIsLoading(false);

        if (analysis.status === 'Green') {
            setForecastText("The current Dasha period shows positive indicators, suggesting a high possibility for childbirth this year.");
        } else if (analysis.status === 'Yellow') {
            setForecastText("While some indicators are present, the overall energy for childbirth is neutral. Other factors in the chart are not strongly amplifying the possibility.");
        } else {
            setForecastText("No specific numerological indicators for childbirth are active in the current major Dasha periods.");
        }
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