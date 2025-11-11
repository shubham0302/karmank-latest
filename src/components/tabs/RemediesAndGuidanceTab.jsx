import React, { useState } from 'react';

// Import all the sub-tabs from the 'Remedies' folder
import GeneralRemediesTab from '../Remedies/GeneralRemediesTab';
import AdvancedRemediesTab from '../Remedies/AdvancedRemediesTab';
import SpecialGuidanceTab from '../Remedies/SpecialGuidanceTab';
import MantrasTab from '../Remedies/MantrasTab';
import RudrakshaTab from '../Remedies/RudrakshaTab';
import ChakraTab from '../Remedies/ChakraTab';
import ShaktiBeejMantraTab from '../Remedies/ShaktiBeejMantraTab';

const RemediesAndGuidanceTab = ({ report }) => {
    const [activeSubTab, setActiveSubTab] = useState('General');
    const hasFourOrEight = report.baseKundliGrid[4] > 0 || report.baseKundliGrid[8] > 0;
    
    return (
        <div>
            {hasFourOrEight && (
                 <div className="mb-4 p-4 bg-red-900/50 text-red-300 rounded-lg border border-red-500/50">
                    <p className="font-bold text-center">Important: Your chart contains the number 4 or 8. Please pay special attention to the "Advanced Remedies" and "Rudraksha" sections for guidance on balancing these energies.</p>
                </div>
            )}
            <div className="mb-4 border-b border-yellow-400/20 flex justify-center flex-wrap">
                <button onClick={() => setActiveSubTab('General')} className={`py-2 px-4 font-medium transition-colors duration-200 ${activeSubTab === 'General' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-yellow-200/70'}`}>General Remedies</button>
                <button onClick={() => setActiveSubTab('Advanced')} className={`py-2 px-4 font-medium transition-colors duration-200 ${activeSubTab === 'Advanced' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-yellow-200/70'}`}>Advanced Remedies</button>
                <button onClick={() => setActiveSubTab('Special')} className={`py-2 px-4 font-medium transition-colors duration-200 ${activeSubTab === 'Special' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-yellow-200/70'}`}>Special Guidance</button>
                <button onClick={() => setActiveSubTab('Mantras')} className={`py-2 px-4 font-medium transition-colors duration-200 ${activeSubTab === 'Mantras' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-yellow-200/70'}`}>Mantras</button>
                <button onClick={() => setActiveSubTab('Rudraksha')} className={`py-2 px-4 font-medium transition-colors duration-200 ${activeSubTab === 'Rudraksha' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-yellow-200/70'}`}>Rudraksha</button>
                <button onClick={() => setActiveSubTab('Chakra')} className={`py-2 px-4 font-medium transition-colors duration-200 ${activeSubTab === 'Chakra' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-yellow-200/70'}`}>Chakra Activation</button>
                <button onClick={() => setActiveSubTab('Shakti')} className={`py-2 px-4 font-medium transition-colors duration-200 ${activeSubTab === 'Shakti' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-yellow-200/70'}`}>Shakti Beej Mantra</button>
            </div>
            {activeSubTab === 'General' && <GeneralRemediesTab report={report} />}
            {activeSubTab === 'Advanced' && <AdvancedRemediesTab report={report} />}
            {activeSubTab === 'Special' && <SpecialGuidanceTab report={report} />}
            {activeSubTab === 'Mantras' && <MantrasTab report={report} />}
            {activeSubTab === 'Rudraksha' && <RudrakshaTab report={report} />}
            {activeSubTab === 'Chakra' && <ChakraTab report={report} />}
            {activeSubTab === 'Shakti' && <ShaktiBeejMantraTab />}
        </div>
    );
};

export default RemediesAndGuidanceTab;