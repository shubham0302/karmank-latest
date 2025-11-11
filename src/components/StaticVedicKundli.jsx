import React from 'react';

const StaticVedicKundli = ({ grid }) => {
    const layout = [3, 1, 9, 6, 7, 5, 2, 8, 4];
    return (
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto bg-gray-900/50 p-2 rounded-md aspect-square">
            {layout.map((num, i) => (
                <div key={i} className="bg-indigo-900/80 flex items-center justify-center text-2xl font-bold rounded-md aspect-square">
                    {grid[num] > 0 ? String(num).repeat(grid[num]) : ''}
                </div>
            ))}
        </div>
    );
};

export default StaticVedicKundli;