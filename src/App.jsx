import React from 'react';
import KarmAnkApp from './karmank'; // Import your main app component

// The AppWrapper provides the background and base styles
const App = () => (
    <div className="min-h-screen bg-indigo-900 text-gray-200 font-sans p-4 md:p-8" style={{background: 'radial-gradient(circle, rgba(23,20,69,1) 0%, rgba(12,10,42,1) 100%)'}}>
        <KarmAnkApp />
    </div>
);

export default App;