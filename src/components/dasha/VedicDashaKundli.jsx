import React, { useMemo } from 'react';
import { DATA } from '../../data/data'; // Import DATA

const VedicDashaKundli = ({ baseGrid, activeNumbers, basicNumber, destinyNumber }) => {
    const layout = [3, 1, 9, 6, 7, 5, 2, 8, 4];
    const displayGrid = useMemo(() => {
        const newGrid = [...baseGrid];
        Object.values(activeNumbers).forEach(num => {
            if (num > 0) newGrid[num]++;
        });
        return newGrid;
    }, [baseGrid, activeNumbers]);

    const getCellBackground = (num) => {
        const colors = [];
        if (activeNumbers.daily === num) colors.push(DATA.colorMap.daily);
        if (activeNumbers.monthly === num) colors.push(DATA.colorMap.monthly);
        if (activeNumbers.yearly === num) colors.push(DATA.colorMap.yearly);
        if (activeNumbers.maha === num) colors.push(DATA.colorMap.maha);
        if (destinyNumber === num) colors.push(DATA.colorMap.destiny);
        if (basicNumber === num) colors.push(DATA.colorMap.basic);

        if (colors.length === 0) return baseGrid[num] > 0 ?
            DATA.colorMap.dob : '#4b5563'; // Gray for empty
        if (colors.length === 1) return colors[0];
        return `linear-gradient(45deg, ${colors.join(', ')})`;
    };

    return (
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto bg-gray-900/50 p-2 rounded-md aspect-square">
            {layout.map((num, i) => (
                <div 
                    key={i} 
                    style={{ background: getCellBackground(num) }}
                    className="flex items-center justify-center text-2xl font-bold rounded-md aspect-square text-white transition-all duration-300 ease-in-out"
                >
                    {displayGrid[num] > 0 
                        ? String(num).repeat(displayGrid[num]) : ''}
                </div>
            ))}
        </div>
    );
};

export default VedicDashaKundli;