import React, { useState } from 'react';
import Card from '../Card';
import ProfessionForecastTab from '../forecasts/ProfessionForecastTab';
import TravelForecastTab from '../forecasts/TravelForecastTab';
import PropertyForecastTab from '../forecasts/PropertyForecastTab';
import MarriageForecastTab from '../forecasts/MarriageForecastTab';
import ChildBirthForecastTab from '../forecasts/ChildBirthForecastTab';

const ForecastTab = ({ report, dashaReport, gender }) => {
    const [activeSubTab, setActiveSubTab] = useState('Profession');
    const [forecastYear, setForecastYear] = useState(new Date().getFullYear());

    if (!report) return null;

    const dob = report.dob;
    const targetDate = new Date(forecastYear, dob.getMonth(), dob.getDate());
    const endDate = new Date(targetDate);
    endDate.setFullYear(endDate.getFullYear() + 1);
    endDate.setDate(endDate.getDate() - 1);

    const formatDate = (date) => date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    return (
        <div>
            <div className="flex flex-wrap gap-2 mb-4 border-b border-gray-700">
                <button onClick={() => setActiveSubTab('Profession')} className={`py-2 px-4 font-semibold transition-colors duration-200 ${activeSubTab === 'Profession' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-yellow-200/70 hover:text-yellow-300'}`}>
                    Profession
                </button>
                <button onClick={() => setActiveSubTab('Travel')} className={`py-2 px-4 font-semibold transition-colors duration-200 ${activeSubTab === 'Travel' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-yellow-200/70 hover:text-yellow-300'}`}>
                    Travel
                </button>
                <button onClick={() => setActiveSubTab('Property')} className={`py-2 px-4 font-semibold transition-colors duration-200 ${activeSubTab === 'Property' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-yellow-200/70 hover:text-yellow-300'}`}>
                    Property
                </button>
                <button onClick={() => setActiveSubTab('Marriage')} className={`py-2 px-4 font-semibold transition-colors duration-200 ${activeSubTab === 'Marriage' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-yellow-200/70 hover:text-yellow-300'}`}>
                    Marriage
                </button>
                <button onClick={() => setActiveSubTab('Child Birth')} className={`py-2 px-4 font-semibold transition-colors duration-200 ${activeSubTab === 'Child Birth' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-yellow-200/70 hover:text-yellow-300'}`}>
                    Child Birth
                </button>
            </div>

            <Card className="mb-6">
                <div className="flex flex-wrap items-end gap-4">
                    <div>
                        <label htmlFor="forecast-year" className="block text-sm font-medium text-yellow-500 mb-1">Select Forecast Year</label>
                        <input 
                            type="number" 
                            id="forecast-year" 
                            value={forecastYear} 
                            onChange={e => setForecastYear(parseInt(e.target.value, 10) || new Date().getFullYear())}
                            className="bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 w-32"
                        />
                    </div>
                    <div className="bg-gray-900/50 p-2 rounded-md text-center">
                        <p className="text-sm text-yellow-200/80">Showing Forecast For:</p>
                        <p className="font-bold text-yellow-400">{formatDate(targetDate)} to {formatDate(endDate)}</p>
                    </div>
                </div>
            </Card>

            <div>
                {activeSubTab === 'Profession' && <ProfessionForecastTab report={report} dashaReport={dashaReport} gender={gender} targetDate={targetDate} />}
                {activeSubTab === 'Travel' && <TravelForecastTab report={report} dashaReport={dashaReport} targetDate={targetDate} />}
                {activeSubTab === 'Property' && <PropertyForecastTab report={report} dashaReport={dashaReport} targetDate={targetDate} />}
                {activeSubTab === 'Marriage' && <MarriageForecastTab report={report} dashaReport={dashaReport} targetDate={targetDate} />}
                {activeSubTab === 'Child Birth' && <ChildBirthForecastTab report={report} dashaReport={dashaReport} gender={gender} targetDate={targetDate} />}
            </div>
        </div>
    );
};

export default ForecastTab;