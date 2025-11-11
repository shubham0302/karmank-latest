import React from 'react';

const SectionTitle = ({ children, className = '' }) => (
    <h2 className={`text-2xl font-bold text-yellow-400 mb-4 font-serif tracking-wider ${className}`}>{children}</h2>
);

export default SectionTitle;