import React, { useState, useMemo } from 'react';

// --- ICONS (Inline SVGs for portability) ---
const BookOpenIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M5.5 2A3.5 3.5 0 002 5.5v9A3.5 3.5 0 005.5 18h9a3.5 3.5 0 003.5-3.5v-9A3.5 3.5 0 0014.5 2h-9zM10 12H5.5a.5.5 0 01-.5-.5V5.5a.5.5 0 01.5-.5H10v7zM10 12v7a.5.5 0 00.5.5h4.5a.5.5 0 00.5-.5V5.5a.5.5 0 00-.5-.5H10v7z" />
  </svg>
);

const LinkIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12.586 4.414a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 5.586l4.586-4.586z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M12.586 10.414a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 11.586l4.586-4.586z" clipRule="evenodd" />
  </svg>
);

const BriefcaseIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M6 3a1 1 0 00-1 1v1H4a2 2 0 00-2 2v7a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1V4a1 1 0 10-2 0v1H7V4a1 1 0 00-1-1zm4 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
  </svg>
);

const UsersIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm-3 5a5 5 0 00-5 5v1h10v-1a5 5 0 00-5-5zm6 0a3 3 0 11-6 0 3 3 0 016 0zm-3 5a5 5 0 00-4.545 3h9.09A5.002 5.002 0 0012 11z" />
  </svg>
);

const LoaderIcon = ({ className = "w-6 h-6 animate-spin" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const AlertCircleIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const WandIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M3.5 2.75a.75.75 0 00-1.5 0v1.5c0 .414.336.75.75.75h1.5a.75.75 0 000-1.5H3.5v-1.5zM5.05 5.05a.75.75 0 00-1.06-1.06L2.75 5.23a.75.75 0 001.06 1.06L5.05 5.05zM2 9.25a.75.75 0 00-.75.75v1.5a.75.75 0 001.5 0v-1.5A.75.75 0 002 9.25zM3.99 14.95a.75.75 0 00-1.06 1.06l1.24 1.24a.75.75 0 001.06-1.06L3.99 14.95zM9.25 18a.75.75 0 00.75-.75v-1.5a.75.75 0 00-1.5 0v1.5c0 .414.336.75.75.75zM14.95 16.01a.75.75 0 001.06-1.06l-1.24-1.24a.75.75 0 00-1.06 1.06l1.24 1.24zM18 10.75a.75.75 0 00-.75-.75h-1.5a.75.75 0 000 1.5h1.5c.414 0 .75-.336.75-.75zM16.01 3.99a.75.75 0 001.06-1.06l-1.24-1.24a.75.75 0 00-1.06 1.06l1.24 1.24zM12.06 7.94a.75.75 0 01.53 1.28l-2.25 2.25a.75.75 0 01-1.06 0l-2.25-2.25a.75.75 0 01.53-1.28H9.75v-2.5a.75.75 0 011.5 0v2.5h.81z" />
  </svg>
);

// --- PYTHAGOREAN CONSTANTS ---
const PYTHAGOREAN_CONSTANTS = {
  letterData: {
    A: { num: 1, repeat: "Amplifies ambition" }, B: { num: 2, repeat: "Emotional depth" }, C: { num: 3, repeat: "Success after overcoming difficulties" }, D: { num: 4, repeat: "Overcomes limitations with patience" }, E: { num: 5, repeat: "Acquires fame through writing or oratory" }, F: { num: 6, repeat: "Protection in all family matters" }, G: { num: 7, repeat: "A clever analyst who understands motives" }, H: { num: 8, repeat: "Strong potential for material progress" }, I: { num: 9, repeat: "Signifies extreme sensitivity and suffering" },
    J: { num: 1, repeat: "Shifts focus quickly" }, K: { num: 2, repeat: "Emotional fluctuation" }, L: { num: 3, repeat: "Keen insight into motives" }, M: { num: 4, repeat: "Never accepts defeat" }, N: { num: 5, repeat: "Cycles of luck" }, O: { num: 6, repeat: "Can exaggerate problems" }, P: { num: 7, repeat: "Power and success follow" }, Q: { num: 8, repeat: "Manages others well" }, R: { num: 9, repeat: "Needs discretion" },
    S: { num: 1, repeat: "Easily hurt by betrayal" }, T: { num: 2, repeat: "Devotion amplified" }, U: { num: 3, repeat: "Worries unnecessarily" }, V: { num: 4, repeat: "Strong results from hard work" }, W: { num: 5, repeat: "Risk-taking amplified" }, X: { num: 6, repeat: "Conservative outlook" }, Y: { num: 7, repeat: "Keeps secrets" }, Z: { num: 8, repeat: "Steady effort" }
  },
  numberMeanings: {
    1: "Symbolizes leadership, independence, and pioneering spirit. Number 1s are ambitious, determined, and creative. Their challenge is to avoid being overly aggressive or egotistical.",
    2: "Represents cooperation, diplomacy, and sensitivity. Number 2s are peacemakers who value harmony and balance. Their challenge is to overcome indecisiveness and avoid being overly sensitive.",
    3: "Stands for self-expression, creativity, and communication. Number 3s are optimistic, artistic, and social. Their challenge is to focus their energies and avoid scattering their talents.",
    4: "Signifies stability, hard work, and practicality. Number 4s are the builders of society, organized and dependable. Their challenge is to be more flexible and open to change.",
    5: "Represents freedom, adventure, and change. Number 5s are energetic, versatile, and curious. Their challenge is to avoid restlessness and use their freedom constructively.",
    6: "Symbolizes love, responsibility, and family. Number 6s are nurturing, compassionate, and protective. Their challenge is to balance helping others and their own needs.",
    7: "Stands for introspection, analysis, and spiritual seeking. Number 7s are deep thinkers with a love of knowledge. Their challenge is to trust others and share their wisdom without becoming isolated.",
    8: "Represents power, ambition, and material success. Number 8s are natural executives with strong organizational skills. Their challenge is to balance the material and spiritual worlds.",
    9: "Signifies compassion, humanitarianism, and completion. Number 9s are selfless, tolerant, and have a broad, idealistic perspective. Their challenge is to let go of the past.",
    11: "A Master Number representing intuition, inspiration, and spiritual enlightenment. 11s have a direct channel to the subconscious and are here to inspire. They possess the qualities of the 2 at a higher vibration.",
    22: "A Master Number known as the 'Master Builder.' 22s have the ability to turn grand dreams into tangible reality. They are practical idealists with immense power, possessing the qualities of the 4 at a higher vibration.",
    33: "A Master Number known as the 'Master Teacher.' 33s are focused on selfless service and uplifting humanity. They are deeply compassionate, possessing the qualities of the 6 at a higher vibration."
  },
  vowels: ["A", "E", "I", "O", "U"],
  harmonyGroups: [[1, 5, 7], [2, 4, 8], [3, 6, 9]]
};

// --- KARMANK CONSTANTS ---
const KARMANK_CONSTANTS = {
  letterValues: {
    'A': 1, 'J': 1, 'S': 1, 'B': 2, 'K': 2, 'T': 2, 'C': 3, 'L': 3, 'U': 3,
    'D': 4, 'M': 4, 'V': 4, 'E': 5, 'N': 5, 'W': 5, 'F': 6, 'O': 6, 'X': 6,
    'G': 7, 'P': 7, 'Y': 7, 'H': 8, 'Q': 8, 'Z': 8, 'I': 9, 'R': 9
  },
  valueToLetters: {
    1: ['A', 'J', 'S'], 2: ['B', 'K', 'T'], 3: ['C', 'L', 'U'],
    4: ['D', 'M', 'V'], 5: ['E', 'N', 'W'], 6: ['F', 'O', 'X'],
    7: ['G', 'P', 'Y'], 8: ['H', 'Q', 'Z'], 9: ['I', 'R']
  },
  assetCompatibility: {
    1: { auspicious: [1, 2, 3], good: [4, 5], neutral: [6, 7], avoid: [8, 9] },
    2: { auspicious: [1, 2, 4], good: [5, 6], neutral: [3, 8], avoid: [7, 9] },
    3: { auspicious: [1, 3, 5], good: [2, 6], neutral: [4, 7], avoid: [8, 9] },
    4: { auspicious: [2, 4, 6], good: [1, 8], neutral: [5, 7], avoid: [3, 9] },
    5: { auspicious: [1, 3, 5], good: [6, 7], neutral: [2, 4], avoid: [8, 9] },
    6: { auspicious: [2, 4, 6], good: [3, 9], neutral: [1, 5], avoid: [7, 8] },
    7: { auspicious: [1, 5, 7], good: [6, 9], neutral: [2, 3], avoid: [4, 8] },
    8: { auspicious: [2, 4, 8], good: [1, 6], neutral: [3, 5], avoid: [7, 9] },
    9: { auspicious: [3, 6, 9], good: [2, 7], neutral: [1, 5], avoid: [4, 8] },
  },
};

// --- HELPER FUNCTIONS ---
const reduceToSingleDigit = (num) => {
  let currentNumStr = String(num);
  while (currentNumStr.length > 1) {
    currentNumStr = String(currentNumStr.split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0));
  }
  return parseInt(currentNumStr, 10);
};

const reduceWestern = (num) => {
  if (num === 0) return 0;
  const masterNumbers = [11, 22, 33];
  while (num > 9 && !masterNumbers.includes(num)) {
    num = num.toString().split("").reduce((a, b) => a + parseInt(b), 0);
  }
  return num;
};

const calculatePythagoreanProfile = (name) => {
  if (!name) return null;
  const { letterData, vowels, harmonyGroups } = PYTHAGOREAN_CONSTANTS;

  let expr = 0, soul = 0, pers = 0;
  const letters = name.toUpperCase().replace(/[^A-Z]/g, "").split("");
  if (letters.length === 0) return null;

  const repeatMap = {};
  letters.forEach(l => {
    if (!letterData[l]) return;
    const num = letterData[l].num;
    expr += num;
    if (vowels.includes(l)) soul += num;
    else pers += num;
    repeatMap[l] = (repeatMap[l] || 0) + 1;
  });

  const expression = reduceWestern(expr);
  const soulUrge = reduceWestern(soul);
  const personality = reduceWestern(pers);

  const repeats = Object.entries(repeatMap)
    .filter(([_, count]) => count > 1)
    .map(([letter, count]) => ({
      letter,
      count,
      meaning: letterData[letter].repeat
    }));

  const singleDigitExpr = reduceToSingleDigit(expression);
  const harmonyGroup = harmonyGroups.findIndex(g => g.includes(singleDigitExpr)) + 1;

  return {
    expression,
    soulUrge,
    personality,
    repeats,
    harmonyGroup,
  };
};

const calculateKarmAnkProfile = (name, destinyNumber) => {
  const { letterValues, assetCompatibility } = KARMANK_CONSTANTS;

  const nameValue = name.toUpperCase().replace(/[^A-Z]/g, '').split('').reduce((acc, char) => {
    return acc + (letterValues[char] || 0);
  }, 0);

  const nameExpressionNumber = reduceToSingleDigit(nameValue);

  const destinyCompat = assetCompatibility[destinyNumber];
  let destinyStatus = 'Avoid';
  if (destinyCompat?.auspicious.includes(nameExpressionNumber)) {
    destinyStatus = 'Auspicious';
  } else if (destinyCompat?.good.includes(nameExpressionNumber)) {
    destinyStatus = 'Good';
  } else if (destinyCompat?.neutral.includes(nameExpressionNumber)) {
    destinyStatus = 'Neutral';
  }

  return {
    nameExpressionNumber,
    destinySynergy: {
      status: destinyStatus,
      target: destinyNumber
    },
  };
};

// --- MAIN COMPONENT ---
const NameAnalysisSection = ({ userName, userDob }) => {
  const [activeTab, setActiveTab] = useState('nameDeepDive');
  const [nameAnalysisReport, setNameAnalysisReport] = useState(null);

  // Calculate report when component mounts or userName changes
  useMemo(() => {
    if (userName) {
      const pythagoreanProfile = calculatePythagoreanProfile(userName);

      let karmAnkProfile = null;
      if (userDob) {
        // Extract destiny number from DOB
        const date = new Date(userDob + 'T00:00:00');
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const destinyNumber = reduceToSingleDigit(`${day}${month}${year}`);

        karmAnkProfile = calculateKarmAnkProfile(userName, destinyNumber);
      }

      setNameAnalysisReport({
        pythagoreanProfile,
        karmAnkProfile,
        userName
      });
    }
  }, [userName, userDob]);

  if (!nameAnalysisReport || !nameAnalysisReport.pythagoreanProfile) {
    return null;
  }

  const tabs = [
    { id: 'nameDeepDive', label: 'Name Deep Dive', icon: BookOpenIcon },
  ];

  if (nameAnalysisReport.karmAnkProfile) {
    tabs.push({ id: 'synergy', label: 'Synergy', icon: LinkIcon });
  }

  const getSynergyColorClasses = (status) => {
    switch (status) {
      case 'Auspicious': return 'bg-blue-600 border-blue-400 text-white';
      case 'Good': return 'bg-green-600 border-green-400 text-white';
      case 'Neutral': return 'bg-yellow-600 border-yellow-400 text-gray-900';
      case 'Avoid': return 'bg-red-600 border-red-400 text-white';
      default: return 'bg-gray-600 border-gray-400 text-white';
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-yellow-400/30 rounded-lg p-6 space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-3xl font-bold text-yellow-400 font-serif tracking-wider mb-2">
          🔮 KarmAnk™ Name Analysis
        </h3>
        <p className="text-yellow-200/70">Pythagorean Numerology Insights for {nameAnalysisReport.userName}</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-yellow-400/20 flex justify-center">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 px-5 font-medium transition-colors duration-300 flex items-center gap-2 ${
              activeTab === tab.id
                ? 'text-yellow-400 border-b-2 border-yellow-400'
                : 'text-yellow-200/70 hover:text-yellow-300'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'nameDeepDive' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-800/60 p-6 rounded-lg shadow-lg border border-yellow-400/20 text-center">
                <p className="text-sm text-yellow-500 uppercase tracking-widest">Expression</p>
                <p className="text-6xl font-bold my-2">{nameAnalysisReport.pythagoreanProfile.expression}</p>
                <p className="text-gray-300">Your Potential & Path</p>
              </div>
              <div className="bg-gray-800/60 p-6 rounded-lg shadow-lg border border-yellow-400/20 text-center">
                <p className="text-sm text-yellow-500 uppercase tracking-widest">Soul Urge</p>
                <p className="text-6xl font-bold my-2">{nameAnalysisReport.pythagoreanProfile.soulUrge}</p>
                <p className="text-gray-300">Your Inner Desire</p>
              </div>
              <div className="bg-gray-800/60 p-6 rounded-lg shadow-lg border border-yellow-400/20 text-center">
                <p className="text-sm text-yellow-500 uppercase tracking-widest">Personality</p>
                <p className="text-6xl font-bold my-2">{nameAnalysisReport.pythagoreanProfile.personality}</p>
                <p className="text-gray-300">Your Public Image</p>
              </div>
            </div>

            <div className="bg-gray-800/60 p-6 rounded-lg shadow-lg border border-yellow-400/20">
              <h4 className="text-2xl font-bold text-yellow-400 mb-4 font-serif tracking-wider">📖 Your Name's Threefold Self</h4>
              <div className="prose prose-invert prose-strong:text-yellow-300 text-gray-300 max-w-none space-y-4">
                <p>
                  <strong>Expression Number {nameAnalysisReport.pythagoreanProfile.expression}:</strong> {PYTHAGOREAN_CONSTANTS.numberMeanings[nameAnalysisReport.pythagoreanProfile.expression]}
                </p>
                <p>
                  <strong>Soul Urge Number {nameAnalysisReport.pythagoreanProfile.soulUrge}:</strong> {PYTHAGOREAN_CONSTANTS.numberMeanings[nameAnalysisReport.pythagoreanProfile.soulUrge]}
                </p>
                <p>
                  <strong>Personality Number {nameAnalysisReport.pythagoreanProfile.personality}:</strong> {PYTHAGOREAN_CONSTANTS.numberMeanings[nameAnalysisReport.pythagoreanProfile.personality]}
                </p>
              </div>
            </div>

            {nameAnalysisReport.pythagoreanProfile.repeats.length > 0 && (
              <div className="bg-gray-800/60 p-6 rounded-lg shadow-lg border border-yellow-400/20">
                <h4 className="text-2xl font-bold text-yellow-400 mb-4 font-serif tracking-wider">Amplified Traits</h4>
                <p className="text-gray-400 mb-4">The repetition of letters in your name intensifies certain energies:</p>
                <div className="space-y-3">
                  {nameAnalysisReport.pythagoreanProfile.repeats.map(item => (
                    <div key={item.letter} className="p-3 bg-gray-900/50 rounded-md">
                      <p className="font-bold text-lg text-yellow-300">Letter "{item.letter}" (appears {item.count} times)</p>
                      <p className="text-gray-300">Effect: {item.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'synergy' && nameAnalysisReport.karmAnkProfile && (
          <div className="space-y-6">
            <div className={`p-6 rounded-lg shadow-lg text-center ${getSynergyColorClasses(nameAnalysisReport.karmAnkProfile.destinySynergy.status)}`}>
              <p className="text-sm uppercase tracking-widest font-semibold opacity-80">Name vs. Life Path Synergy</p>
              <p className="text-5xl font-bold my-2">{nameAnalysisReport.karmAnkProfile.destinySynergy.status}</p>
              <p className="opacity-90">
                Name Number ({nameAnalysisReport.karmAnkProfile.nameExpressionNumber}) vs.
                Destiny Number ({nameAnalysisReport.karmAnkProfile.destinySynergy.target})
              </p>
            </div>

            <div className="bg-gray-800/60 p-6 rounded-lg shadow-lg border border-yellow-400/20">
              <h4 className="text-2xl font-bold text-yellow-400 mb-4 font-serif tracking-wider">🔗 Synergy Analysis</h4>
              <div className="prose prose-invert text-gray-300 max-w-none space-y-4">
                <p>
                  Your name carries a <strong>KarmAnk™ Number of {nameAnalysisReport.karmAnkProfile.nameExpressionNumber}</strong>,
                  which represents the vibrational energy of your name in relation to your life path.
                </p>
                <p>
                  This synergy rating of <strong className="text-yellow-300">{nameAnalysisReport.karmAnkProfile.destinySynergy.status}</strong> indicates
                  {nameAnalysisReport.karmAnkProfile.destinySynergy.status === 'Auspicious' && ' that your name is in perfect harmony with your destiny, providing strong support for your life journey.'}
                  {nameAnalysisReport.karmAnkProfile.destinySynergy.status === 'Good' && ' that your name actively supports your life path and helps manifest your destiny.'}
                  {nameAnalysisReport.karmAnkProfile.destinySynergy.status === 'Neutral' && ' that your name has a balanced relationship with your destiny - neither strongly supportive nor challenging.'}
                  {nameAnalysisReport.karmAnkProfile.destinySynergy.status === 'Avoid' && ' that there may be some friction between your name\'s vibration and your life path. Consider name harmonization techniques.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NameAnalysisSection;
