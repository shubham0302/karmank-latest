import React from 'react';
import { X } from 'lucide-react';
import { numberMeanings } from '../data/data'; // Import the data it needs

const NumberMeaningModal = ({ isOpen, onClose, number }) => {
    if (!isOpen) return null;
    const meaning = numberMeanings[number];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 max-w-2xl w-full relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X size={24} /></button>
                <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">The Significance of Number {number}</h3>

                <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{meaning}</p>
            </div>
        </div>
    );
};

export default NumberMeaningModal;