import React from 'react';
import Card from '../Card';

const numerologyTalismans = [
  {
    "id": 1,
    "moolank": 1,
    "planet": "Sun",
    "totalSum": 15,
    "metal": "Gold",
    "placement": "Ring finger (also known as the finger of Sun)",
    "mantra": "ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः",
    "mantraTransliteration": "Om Hraam Hreem Hraum Sah Suryaya Namah",
    "chantingCount": 7000,
    "installationDay": "Sunday",
    "grid": [
      [6, 1, 8],
      [7, 5, 3],
      [2, 9, 4]
    ]
  },
  {
    "id": 2,
    "moolank": 2,
    "planet": "Moon",
    "totalSum": 18,
    "metal": "Silver",
    "placement": "Fourth finger",
    "mantra": "ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः",
    "mantraTransliteration": "Om Shraam Shreem Shraum Sah Chandraya Namah",
    "chantingCount": 11000,
    "installationDay": "Monday",
    "grid": [
      [7, 2, 9],
      [8, 6, 4],
      [3, 10, 5]
    ]
  },
  {
    "id": 3,
    "moolank": 3,
    "planet": "Jupiter",
    "totalSum": 27,
    "metal": "Gold",
    "placement": "Ring finger or the first finger (Jupiter finger)",
    "mantra": "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः",
    "mantraTransliteration": "Om Graam Greem Graum Sah Gurave Namah",
    "chantingCount": 19000,
    "installationDay": "Thursday",
    "grid": [
      [10, 5, 12],
      [11, 9, 7],
      [6, 13, 8]
    ]
  },
  {
    "id": 4,
    "moolank": 4,
    "planet": "Uranus",
    "totalSum": 36,
    "metal": "Tin",
    "placement": "Fourth finger",
    "mantra": "ॐ ऐं ह्रीं श्रीं राहवे नमः",
    "mantraTransliteration": "Om Aim Hreem Shreem Rahave Namah",
    "chantingCount": 18000,
    "installationDay": "Saturday",
    "grid": [
      [13, 8, 15],
      [14, 12, 10],
      [9, 16, 11]
    ]
  },
  {
    "id": 5,
    "moolank": 5,
    "planet": "Mercury",
    "totalSum": 24,
    "metal": "Brass",
    "placement": "Fourth finger (Mercury finger)",
    "mantra": "ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः",
    "mantraTransliteration": "Om Braam Breem Braum Sah Budhaya Namah",
    "chantingCount": 9000,
    "installationDay": "Wednesday",
    "grid": [
      [9, 4, 11],
      [10, 8, 6],
      [5, 12, 7]
    ]
  },
  {
    "id": 6,
    "moolank": 6,
    "planet": "Venus",
    "totalSum": 30,
    "metal": "Silver",
    "placement": "Ring finger",
    "mantra": "ॐ द्रां द्रीं द्रौं सः शुक्राय नमः",
    "mantraTransliteration": "Om Draam Dreem Draum Sah Shukraya Namah",
    "chantingCount": 16000,
    "installationDay": "Friday",
    "grid": [
      [11, 6, 13],
      [12, 10, 8],
      [7, 14, 9]
    ]
  },
  {
    "id": 7,
    "moolank": 7,
    "planet": "Neptune",
    "totalSum": 39,
    "metal": "Gold",
    "placement": "Ring finger",
    "mantra": "ॐ ऐं ह्रीं केतवे नमः",
    "mantraTransliteration": "Om Aim Hreem Ketave Namah",
    "chantingCount": 17000,
    "installationDay": "Sunday",
    "grid": [
      [14, 9, 16],
      [15, 13, 11],
      [10, 17, 12]
    ]
  },
  {
    "id": 8,
    "moolank": 8,
    "planet": "Saturn",
    "totalSum": 33,
    "metal": "Zinc",
    "placement": "Second finger (Saturn finger)",
    "mantra": "ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः",
    "mantraTransliteration": "Om Praam Preem Praum Sah Shanaischaraya Namah",
    "chantingCount": 23000,
    "installationDay": "Saturday",
    "grid": [
      [12, 7, 14],
      [13, 11, 9],
      [8, 15, 10]
    ]
  },
  {
    "id": 9,
    "moolank": 9,
    "planet": "Mars",
    "totalSum": 21,
    "metal": "Copper",
    "placement": "Ring finger",
    "mantra": "ॐ क्रां क्रीं क्रौं सः भौमाय नमः",
    "mantraTransliteration": "Om Kraam Kreem Kraum Sah Bhaumaya Namah",
    "chantingCount": 10000,
    "installationDay": "Tuesday",
    "grid": [
      [8, 3, 10],
      [9, 7, 5],
      [4, 11, 6]
    ]
  }
];

const YantraTab = ({ report, language = 'en' }) => {
    if (!report) {
        return <Card><p className="text-red-400">Report data is not available.</p></Card>;
    }

    if (!report.basicNumber) {
        return <Card><p className="text-red-400">Basic number is missing.</p></Card>;
    }

    // Yantra is only based on Basic Number, not Destiny Number
    const basicNumber = report.basicNumber;

    const YantraCard = ({ number }) => {
        const yantraData = numerologyTalismans.find(t => t.moolank === number);

        if (!yantraData) {
            return (
                <Card>
                    <p className="text-yellow-400">Yantra data not available for number {number}.</p>
                </Card>
            );
        }

        return (
            <>
            <Card className="print:mb-4" style={{ pageBreakInside: 'avoid' }}>
                <h2 className="text-2xl font-bold text-yellow-400 mb-4 print:text-xl print:mb-2">
                    Yantra / Talisman for Number {number} ({yantraData.planet})
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-3">
                    {/* Left Column: Yantra Grid */}
                    <div>
                        <div className="flex justify-center mb-2 print:mb-1">
                            <div className="text-5xl text-yellow-400 print:text-3xl" style={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.5)' }}>ॐ</div>
                        </div>
                        <h3 className="font-semibold text-yellow-300 text-lg mb-1 text-center print:text-base print:mb-0">{yantraData.planet} Yantra</h3>
                        <p className="text-xs text-yellow-400/60 text-center mb-4 uppercase tracking-wider print:hidden">Sacred Numerical Talisman</p>

                        <div className="flex justify-center mb-4 relative print:mb-2">
                            {/* Screen View: Decorative Yantra Grid with animations */}
                            <div className="print:hidden">
                                {/* Rotating ring background */}
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-dashed border-yellow-400/20 rounded-full animate-spin-slow pointer-events-none" style={{ animationDuration: '60s' }}></div>

                                {/* Sacred geometry background */}
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 opacity-10 pointer-events-none">
                                    <svg viewBox="0 0 100 100" className="w-full h-full">
                                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-yellow-400"/>
                                        <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-yellow-400"/>
                                        <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-yellow-400"/>
                                    </svg>
                                </div>

                                {/* Yantra Grid - Screen */}
                                <div className="relative p-1 rounded bg-gradient-to-br from-yellow-600/30 via-yellow-500/20 to-yellow-800/30" style={{ boxShadow: '0 0 30px rgba(0,0,0,0.8), 0 0 15px rgba(255, 215, 0, 0.3)' }}>
                                    <div className="grid grid-cols-3 gap-0.5 bg-black p-2 border border-yellow-600/50 relative">
                                        {/* Grid lines */}
                                        <div className="absolute top-0 left-1/3 w-px h-full bg-yellow-600/50" style={{ boxShadow: '0 0 5px rgba(255, 215, 0, 0.5)' }}></div>
                                        <div className="absolute top-0 right-1/3 w-px h-full bg-yellow-600/50" style={{ boxShadow: '0 0 5px rgba(255, 215, 0, 0.5)' }}></div>
                                        <div className="absolute top-1/3 left-0 w-full h-px bg-yellow-600/50" style={{ boxShadow: '0 0 5px rgba(255, 215, 0, 0.5)' }}></div>
                                        <div className="absolute bottom-1/3 left-0 w-full h-px bg-yellow-600/50" style={{ boxShadow: '0 0 5px rgba(255, 215, 0, 0.5)' }}></div>

                                        {yantraData.grid.flat().map((num, idx) => (
                                            <div
                                                key={idx}
                                                className={`w-16 h-16 flex items-center justify-center font-serif font-bold text-2xl relative z-10 transition-all duration-300 hover:scale-110 cursor-pointer ${
                                                    idx === 4
                                                        ? 'text-yellow-300 text-3xl'
                                                        : 'text-yellow-100/90'
                                                }`}
                                                style={{
                                                    textShadow: idx === 4
                                                        ? '0 0 15px rgba(255, 215, 0, 0.8), 0 2px 10px rgba(0,0,0,1)'
                                                        : '0 2px 10px rgba(0,0,0,1)'
                                                }}
                                            >
                                                {num}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Print View: Simple Kundli Format */}
                            <div className="hidden print:block">
                                <div className="grid grid-cols-3 gap-1 max-w-xs mx-auto bg-gray-900/50 p-1 rounded-md aspect-square">
                                    {yantraData.grid.flat().map((num, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-yellow-900/80 flex items-center justify-center text-lg font-bold rounded-md aspect-square"
                                        >
                                            {num}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-900/50 p-3 rounded-md text-center border border-yellow-400/20">
                            <p className="text-sm text-yellow-300">
                                <strong>Magic Sum:</strong> {yantraData.totalSum}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                (Each row, column, and diagonal adds up to {yantraData.totalSum})
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="space-y-4 print:space-y-2">
                        <h3 className="font-semibold text-yellow-300 text-lg mb-2 print:text-base print:mb-1">Talisman Details</h3>

                        <div className="bg-gray-900/50 p-4 rounded-md print:p-2">
                            <div className="grid grid-cols-1 gap-3 print:gap-1 print:text-xs">
                                <div>
                                    <strong className="text-yellow-300">Planet:</strong>
                                    <p className="text-gray-300">{yantraData.planet}</p>
                                </div>
                                <div>
                                    <strong className="text-yellow-300">Metal:</strong>
                                    <p className="text-gray-300">{yantraData.metal}</p>
                                </div>
                                <div>
                                    <strong className="text-yellow-300">Placement:</strong>
                                    <p className="text-gray-300">{yantraData.placement}</p>
                                </div>
                                <div>
                                    <strong className="text-yellow-300">Installation Day:</strong>
                                    <p className="text-gray-300">{yantraData.installationDay}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-purple-900/20 p-4 rounded-md border border-purple-400/30 print:p-2">
                            <h4 className="font-semibold text-purple-300 mb-2 print:text-sm print:mb-1">Sacred Mantra</h4>
                            <div className="space-y-2 print:space-y-1">
                                <div className="bg-purple-950/40 p-3 rounded-md print:p-1">
                                    <p className="text-lg text-purple-200 font-devanagari text-center print:text-sm">{yantraData.mantra}</p>
                                </div>
                                <p className="text-sm text-purple-200 italic text-center print:text-xs">{yantraData.mantraTransliteration}</p>
                                <p className="text-xs text-gray-400 text-center mt-2 print:mt-1 print:text-[10px]">
                                    Chant this mantra <strong className="text-purple-300">{yantraData.chantingCount.toLocaleString()}</strong> times to energize the yantra
                                </p>
                            </div>
                        </div>

                        <div className="bg-purple-900/20 p-4 rounded-md border border-purple-400/30 print:p-2">
                            <h4 className="font-semibold text-purple-300 mb-2 print:text-sm print:mb-1">Benefits</h4>
                            <p className="text-sm text-gray-300 print:text-xs">
                                This sacred numerical yantra harnesses the vibrations of {yantraData.planet} and the number {number}.
                                It helps balance planetary influences, attracts positive energy, and provides protection from
                                negative vibrations associated with this number.
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Installation Method Section - New Page in Print */}
            <Card className="pdf-page-break-before print:mb-4" style={{ pageBreakBefore: 'always', pageBreakInside: 'avoid' }}>
                {/* Installation Method */}
                <div className="bg-blue-900/20 p-4 rounded-md border border-blue-400/30 print:p-2">
                    <h4 className="font-semibold text-blue-300 mb-3 print:text-sm print:mb-1">Installation Method</h4>
                    <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside print:text-xs print:space-y-1">
                        <li><strong>Preparation:</strong> Get this yantra grid engraved on a {yantraData.metal.toLowerCase()} plate, pendant, or ring by a skilled craftsman.</li>
                        <li><strong>Purification:</strong> On a {yantraData.installationDay}, cleanse the yantra by washing it with clean water or milk, then wipe it dry with a clean cloth.</li>
                        <li><strong>Energization:</strong> Sit in a clean, quiet place facing east. Light a lamp or incense. Hold the yantra in your hands and chant the sacred mantra "{yantraData.mantraTransliteration}" {yantraData.chantingCount.toLocaleString()} times with full devotion and concentration.</li>
                        <li><strong>Installation:</strong> After completing the mantra chanting, wear the yantra on your {yantraData.placement.toLowerCase()} or keep it in your wallet/purse.</li>
                        <li><strong>Maintenance:</strong> Keep the yantra clean and treat it with respect. You can re-energize it monthly by chanting the mantra 108 times.</li>
                    </ol>
                </div>

                {/* Additional Information */}
                <div className="mt-6 bg-yellow-900/10 p-4 rounded-md border border-yellow-400/20 print:mt-2 print:p-2">
                    <h4 className="font-semibold text-yellow-300 mb-2 print:text-sm print:mb-1">About This Yantra</h4>
                    <p className="text-sm text-gray-300 print:text-xs">
                        The yantra works through the principle of sacred geometry and numerology. Each number is placed
                        strategically to create a harmonious energy field. The sum of {yantraData.totalSum} appears in every
                        row, column, and diagonal, creating a perfect mathematical and spiritual balance aligned with the
                        vibrations of {yantraData.planet}. This geometric perfection amplifies the planetary energies and
                        brings them into harmony with your personal vibration.
                    </p>
                </div>
            </Card>
            </>
        );
    };

    try {
        return (
            <div className="space-y-6 pdf-page-break-after" style={{ pageBreakAfter: 'always' }}>
                {/* Introduction Card */}
                <Card className="print:mb-4" style={{ pageBreakInside: 'avoid' }}>
                    <h3 className="text-lg font-semibold text-yellow-300 mb-2 print:text-base print:mb-1">About Numerology Yantras / Talismans</h3>
                    <p className="text-sm text-gray-300 print:text-xs">
                        Numerology yantras, also known as talismans, are sacred geometric grids containing numbers arranged
                        in a specific pattern. These magical squares have been used for centuries across different cultures
                        for protection, prosperity, and spiritual enhancement. Each yantra is associated with a planet and
                        your Basic Number, creating a powerful tool to harmonize planetary energies in your life.
                    </p>
                    <p className="text-xs text-yellow-400/70 mt-2 italic print:text-[10px] print:mt-1">
                        Note: The yantra is determined by your Basic Number (Moolank) only.
                    </p>
                </Card>
                {/* Yantra Card */}
                <YantraCard number={basicNumber} />
            </div>
        );
    } catch (error) {
        console.error('Error in YantraTab:', error);
        return (
            <Card>
                <p className="text-red-400">
                    An error occurred while rendering the Yantra tab.
                </p>
            </Card>
        );
    }
};

export default YantraTab;
