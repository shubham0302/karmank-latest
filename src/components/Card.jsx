import React from 'react';

// This is your Card component
const Card = ({ children, className = '' }) => (
    <div className={`bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 p-6 rounded-lg shadow-lg text-white ${className}`}>
        {children}
    </div>
);

export default Card;