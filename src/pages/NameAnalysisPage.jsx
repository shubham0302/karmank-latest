import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Crown, BookOpen, Link as LinkIcon, Briefcase, Users } from 'lucide-react';
import CosmicBackground from '../components/CosmicBackground';
import { useAuth } from '../contexts/AuthContext';

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

const NameAnalysisPage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [report, setReport] = useState(null);
  const [activeTab, setActiveTab] = useState('nameDeepDive');
  const [error, setError] = useState("");

  const handleSignOut = async () => {
    await signOut();
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleGenerateReport = (e) => {
    e.preventDefault();
    if (!fullName) {
      setError("Please enter your full name.");
      return;
    }
    setError("");

    try {
      const pythagoreanProfile = calculatePythagoreanProfile(fullName);

      let vedicDestiny = null;
      let karmAnkProfile = null;

      if (dateOfBirth) {
        const date = new Date(dateOfBirth + 'T00:00:00');
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        vedicDestiny = reduceToSingleDigit(`${day}${month}${year}`);

        karmAnkProfile = calculateKarmAnkProfile(fullName, vedicDestiny);
      }

      setReport({
        name: fullName,
        dob: dateOfBirth,
        pythagoreanProfile,
        vedicDestiny,
        karmAnkProfile
      });

      setActiveTab('nameDeepDive');
    } catch (e) {
      console.error("Error generating report:", e);
      setError("An error occurred while calculating your report. Please check the inputs and try again.");
    }
  };

  const tabs = [
    { id: 'nameDeepDive', label: 'Name Deep Dive', icon: BookOpen },
  ];

  if (report?.karmAnkProfile) {
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
    <CosmicBackground density={140} useVideo={true}>
      <div className="min-h-screen relative px-4 md:px-6 py-6">
        <div className="max-w-5xl mx-auto relative z-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handleBackToHome}
              className="flex items-center gap-2 text-white/70 hover:text-auric-gold transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Home</span>
            </button>

            <div className="flex items-center gap-3">
              <span className="text-sm text-white/70 hidden md:block">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/50 px-4 py-2 rounded-md text-sm font-medium transition duration-200"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl font-extrabold text-yellow-400 font-serif tracking-widest flex items-center justify-center gap-3">
              <Crown className="h-12 w-12" />
              KARMANK NAME ANALYSIS
            </h1>
            <p className="text-yellow-200/70 mt-2">
              Pythagorean Numerology Insights for Your Name
            </p>
          </motion.div>

          {/* Input Form */}
          {!report && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl mx-auto bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 p-6 md:p-8 rounded-lg shadow-lg"
            >
              <form onSubmit={handleGenerateReport} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-yellow-500 mb-2">
                    Full Name (Required)
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 text-white"
                    placeholder="e.g., Jane Marie Doe"
                  />
                </div>
                <div>
                  <label htmlFor="dob" className="block text-sm font-medium text-yellow-500 mb-2">
                    Date of Birth (Optional)
                  </label>
                  <input
                    type="date"
                    id="dob"
                    value={dateOfBirth}
                    onChange={e => setDateOfBirth(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 text-white"
                    style={{ colorScheme: 'dark' }}
                  />
                  <p className="text-xs text-gray-400 mt-1">Providing a DOB unlocks the "Synergy" feature.</p>
                </div>
                <button
                  type="submit"
                  className="w-full bg-yellow-500 text-indigo-900 font-bold px-8 py-3 rounded-lg hover:bg-yellow-600 transition duration-200 shadow-lg"
                >
                  Reveal My Analysis
                </button>
                {error && <p className="text-center text-red-400 mt-4">{error}</p>}
              </form>
            </motion.div>
          )}

          {/* Report Dashboard */}
          {report && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Tab Navigation */}
              <div className="mb-4 border-b border-yellow-400/20 flex justify-center">
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
              <div className="space-y-6">
                {activeTab === 'nameDeepDive' && (
                  <>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="bg-gray-800/60 p-6 rounded-lg shadow-lg border border-yellow-400/20 text-center">
                        <p className="text-sm text-yellow-500 uppercase tracking-widest">Expression</p>
                        <p className="text-6xl font-bold my-2">{report.pythagoreanProfile.expression}</p>
                        <p className="text-gray-300">Your Potential & Path</p>
                      </div>
                      <div className="bg-gray-800/60 p-6 rounded-lg shadow-lg border border-yellow-400/20 text-center">
                        <p className="text-sm text-yellow-500 uppercase tracking-widest">Soul Urge</p>
                        <p className="text-6xl font-bold my-2">{report.pythagoreanProfile.soulUrge}</p>
                        <p className="text-gray-300">Your Inner Desire</p>
                      </div>
                      <div className="bg-gray-800/60 p-6 rounded-lg shadow-lg border border-yellow-400/20 text-center">
                        <p className="text-sm text-yellow-500 uppercase tracking-widest">Personality</p>
                        <p className="text-6xl font-bold my-2">{report.pythagoreanProfile.personality}</p>
                        <p className="text-gray-300">Your Public Image</p>
                      </div>
                    </div>

                    <div className="bg-gray-800/60 p-6 rounded-lg shadow-lg border border-yellow-400/20">
                      <h4 className="text-2xl font-bold text-yellow-400 mb-4 font-serif tracking-wider">📖 Your Name's Threefold Self</h4>
                      <div className="prose prose-invert prose-strong:text-yellow-300 text-gray-300 max-w-none space-y-4">
                        <p>
                          <strong>Expression Number {report.pythagoreanProfile.expression}:</strong> {PYTHAGOREAN_CONSTANTS.numberMeanings[report.pythagoreanProfile.expression]}
                        </p>
                        <p>
                          <strong>Soul Urge Number {report.pythagoreanProfile.soulUrge}:</strong> {PYTHAGOREAN_CONSTANTS.numberMeanings[report.pythagoreanProfile.soulUrge]}
                        </p>
                        <p>
                          <strong>Personality Number {report.pythagoreanProfile.personality}:</strong> {PYTHAGOREAN_CONSTANTS.numberMeanings[report.pythagoreanProfile.personality]}
                        </p>
                      </div>
                    </div>

                    {report.pythagoreanProfile.repeats.length > 0 && (
                      <div className="bg-gray-800/60 p-6 rounded-lg shadow-lg border border-yellow-400/20">
                        <h4 className="text-2xl font-bold text-yellow-400 mb-4 font-serif tracking-wider">Amplified Traits</h4>
                        <p className="text-gray-400 mb-4">The repetition of letters in your name intensifies certain energies:</p>
                        <div className="space-y-3">
                          {report.pythagoreanProfile.repeats.map(item => (
                            <div key={item.letter} className="p-3 bg-gray-900/50 rounded-md">
                              <p className="font-bold text-lg text-yellow-300">Letter "{item.letter}" (appears {item.count} times)</p>
                              <p className="text-gray-300">Effect: {item.meaning}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {activeTab === 'synergy' && report.karmAnkProfile && (
                  <>
                    <div className={`p-6 rounded-lg shadow-lg text-center ${getSynergyColorClasses(report.karmAnkProfile.destinySynergy.status)}`}>
                      <p className="text-sm uppercase tracking-widest font-semibold opacity-80">Name vs. Life Path Synergy</p>
                      <p className="text-5xl font-bold my-2">{report.karmAnkProfile.destinySynergy.status}</p>
                      <p className="opacity-90">
                        Name Number ({report.karmAnkProfile.nameExpressionNumber}) vs.
                        Destiny Number ({report.karmAnkProfile.destinySynergy.target})
                      </p>
                    </div>

                    <div className="bg-gray-800/60 p-6 rounded-lg shadow-lg border border-yellow-400/20">
                      <h4 className="text-2xl font-bold text-yellow-400 mb-4 font-serif tracking-wider">🔗 Synergy Analysis</h4>
                      <div className="prose prose-invert text-gray-300 max-w-none space-y-4">
                        <p>
                          Your name carries a <strong>KarmAnk Number of {report.karmAnkProfile.nameExpressionNumber}</strong>,
                          which represents the vibrational energy of your name in relation to your life path.
                        </p>
                        <p>
                          This synergy rating of <strong className="text-yellow-300">{report.karmAnkProfile.destinySynergy.status}</strong> indicates
                          {report.karmAnkProfile.destinySynergy.status === 'Auspicious' && ' that your name is in perfect harmony with your destiny, providing strong support for your life journey.'}
                          {report.karmAnkProfile.destinySynergy.status === 'Good' && ' that your name actively supports your life path and helps manifest your destiny.'}
                          {report.karmAnkProfile.destinySynergy.status === 'Neutral' && ' that your name has a balanced relationship with your destiny - neither strongly supportive nor challenging.'}
                          {report.karmAnkProfile.destinySynergy.status === 'Avoid' && ' that there may be some friction between your name\'s vibration and your life path. Consider name harmonization techniques.'}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => { setReport(null); setFullName(""); setDateOfBirth(""); setError(""); }}
                className="mt-8 block mx-auto bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-700 transition"
              >
                Analyze Another Name
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </CosmicBackground>
  );
};

export default NameAnalysisPage;
