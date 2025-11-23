import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Crown, Heart, Users, Info } from 'lucide-react';
import CosmicBackground from '../components/CosmicBackground';
import { useAuth } from '../contexts/AuthContext';
import { DATA } from '../data/data';
import { reduceToSingleDigit, getText } from '../utils/helpers';

const CompatibilityPage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const [person1Name, setPerson1Name] = useState("");
  const [person1DOB, setPerson1DOB] = useState("");
  const [person2Name, setPerson2Name] = useState("");
  const [person2DOB, setPerson2DOB] = useState("");
  const [compatibilityReport, setCompatibilityReport] = useState(null);
  const [error, setError] = useState("");

  const handleSignOut = async () => {
    await signOut();
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const calculateDestinyNumber = (dob) => {
    if (!dob) return null;
    const cleanedDOB = dob.replace(/\D/g, "");
    if (cleanedDOB.length !== 8) return null;

    const day = parseInt(cleanedDOB.substring(0, 2), 10);
    const month = parseInt(cleanedDOB.substring(2, 4), 10);
    const year = parseInt(cleanedDOB.substring(4, 8), 10);

    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > 2100) {
      return null;
    }

    const fullSum = `${day}${month}${year}`;
    return reduceToSingleDigit(fullSum);
  };

  const getCompatibilityStatus = (destinyNum, partnerDestinyNum) => {
    const compatData = DATA.destinyCompatibility[destinyNum];
    if (!compatData) return 'neutral';

    if (compatData.good && compatData.good.includes(partnerDestinyNum)) return 'good';
    if (compatData.not && compatData.not.includes(partnerDestinyNum)) return 'not';
    if (compatData.avoid && compatData.avoid.includes(partnerDestinyNum)) return 'avoid';
    if (compatData.neutral && compatData.neutral.includes(partnerDestinyNum)) return 'neutral';

    return 'neutral';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good':
        return 'from-green-500 to-emerald-600';
      case 'neutral':
        return 'from-blue-500 to-cyan-600';
      case 'not':
        return 'from-yellow-500 to-amber-600';
      case 'avoid':
        return 'from-orange-500 to-red-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'good':
        return 'Good Match';
      case 'neutral':
        return 'Neutral Connection';
      case 'not':
        return 'Challenging Match';
      case 'avoid':
        return 'Difficult Match';
      default:
        return 'Unknown';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good':
        return '💚';
      case 'neutral':
        return '💙';
      case 'not':
        return '💛';
      case 'avoid':
        return '🧡';
      default:
        return '💜';
    }
  };

  const handleAnalyzeCompatibility = (e) => {
    e.preventDefault();
    if (!person1Name || !person1DOB || !person2Name || !person2DOB) {
      setError("Please fill in all fields for both people.");
      setCompatibilityReport(null);
      return;
    }
    setError("");

    const destiny1 = calculateDestinyNumber(person1DOB);
    const destiny2 = calculateDestinyNumber(person2DOB);

    if (!destiny1 || !destiny2) {
      setError("One or both dates of birth are invalid. Please use DDMMYYYY format.");
      return;
    }

    const status1to2 = getCompatibilityStatus(destiny1, destiny2);
    const status2to1 = getCompatibilityStatus(destiny2, destiny1);

    const compatData1 = DATA.destinyCompatibility[destiny1];
    const compatData2 = DATA.destinyCompatibility[destiny2];

    setCompatibilityReport({
      person1: {
        name: person1Name,
        dob: person1DOB,
        destiny: destiny1,
        description: compatData1 ? getText(compatData1.description, 'en') : '',
        status: status1to2
      },
      person2: {
        name: person2Name,
        dob: person2DOB,
        destiny: destiny2,
        description: compatData2 ? getText(compatData2.description, 'en') : '',
        status: status2to1
      },
      overallStatus: status1to2 === 'good' && status2to1 === 'good' ? 'good' :
                     status1to2 === 'avoid' || status2to1 === 'avoid' ? 'avoid' :
                     status1to2 === 'not' || status2to1 === 'not' ? 'not' : 'neutral'
    });
  };

  const getDestinyArchetype = (destinyNum) => {
    const archetypes = {
      1: "Leader",
      2: "Mediator",
      3: "Creator",
      4: "Builder",
      5: "Adventurer",
      6: "Nurturer",
      7: "Seeker",
      8: "Powerhouse",
      9: "Humanitarian"
    };
    return archetypes[destinyNum] || "Unknown";
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
              COSMIC COMPATIBILITY
            </h1>
            <p className="text-yellow-200/70 mt-2">
              Measure synergy for partners, teams and relationships using authentic Vedic numerology
            </p>
          </motion.div>

          {/* Input Form */}
          {!compatibilityReport && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-3xl mx-auto bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 p-6 md:p-8 rounded-lg shadow-lg"
            >
              <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
                Enter Details for Both People
              </h2>
              <form onSubmit={handleAnalyzeCompatibility} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Person 1 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-yellow-300 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      First Person
                    </h3>
                    <div>
                      <label htmlFor="person1Name" className="block text-sm font-medium text-yellow-500 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="person1Name"
                        value={person1Name}
                        onChange={e => setPerson1Name(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 text-white"
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="person1DOB" className="block text-sm font-medium text-yellow-500 mb-2">
                        Date of Birth (DDMMYYYY)
                      </label>
                      <input
                        type="text"
                        id="person1DOB"
                        value={person1DOB}
                        onChange={e => setPerson1DOB(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 text-white"
                        placeholder="e.g., 15011990"
                        maxLength="8"
                      />
                    </div>
                  </div>

                  {/* Person 2 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-yellow-300 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Second Person
                    </h3>
                    <div>
                      <label htmlFor="person2Name" className="block text-sm font-medium text-yellow-500 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="person2Name"
                        value={person2Name}
                        onChange={e => setPerson2Name(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 text-white"
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="person2DOB" className="block text-sm font-medium text-yellow-500 mb-2">
                        Date of Birth (DDMMYYYY)
                      </label>
                      <input
                        type="text"
                        id="person2DOB"
                        value={person2DOB}
                        onChange={e => setPerson2DOB(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 text-white"
                        placeholder="e.g., 20051992"
                        maxLength="8"
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-yellow-500 text-indigo-900 font-bold px-8 py-3 rounded-lg hover:bg-yellow-600 transition duration-200 shadow-lg flex items-center justify-center gap-2"
                >
                  <Heart className="w-5 h-5" />
                  Analyze Compatibility
                </button>
                {error && <p className="text-center text-red-400 mt-4">{error}</p>}
              </form>
            </motion.div>
          )}

          {/* Compatibility Report */}
          {compatibilityReport && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Overall Compatibility Score */}
              <div className={`p-8 rounded-xl bg-gradient-to-r ${getStatusColor(compatibilityReport.overallStatus)} bg-opacity-20 border-2 border-white/20 text-center`}>
                <p className="text-sm uppercase tracking-widest font-semibold text-white/80 mb-2">
                  Overall Compatibility Status
                </p>
                <p className="text-6xl mb-3">{getStatusIcon(compatibilityReport.overallStatus)}</p>
                <p className="text-3xl font-bold text-white mb-2">{getStatusLabel(compatibilityReport.overallStatus)}</p>
                <p className="text-white/70">
                  {compatibilityReport.person1.name} & {compatibilityReport.person2.name}
                </p>
              </div>

              {/* Individual Destiny Numbers */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Person 1 */}
                <div className="bg-gray-800/60 p-6 rounded-lg shadow-lg border border-yellow-400/20">
                  <h4 className="font-bold text-xl text-yellow-300 mb-4 text-center flex items-center justify-center gap-2">
                    <Users className="w-5 h-5" />
                    {compatibilityReport.person1.name}
                  </h4>
                  <div className="space-y-3">
                    <div className="bg-gray-900/50 p-4 rounded-md text-center">
                      <p className="text-sm text-gray-400 mb-1">Destiny Number</p>
                      <p className="text-5xl font-bold text-yellow-300 mb-2">{compatibilityReport.person1.destiny}</p>
                      <p className="text-lg text-yellow-200 font-semibold">
                        The {getDestinyArchetype(compatibilityReport.person1.destiny)}
                      </p>
                    </div>
                    <div className={`p-3 rounded-md border-l-4 ${
                      compatibilityReport.person1.status === 'good' ? 'bg-green-900/20 border-green-400' :
                      compatibilityReport.person1.status === 'avoid' ? 'bg-red-900/20 border-red-400' :
                      compatibilityReport.person1.status === 'not' ? 'bg-orange-900/20 border-orange-400' :
                      'bg-blue-900/20 border-blue-400'
                    }`}>
                      <p className="text-xs text-gray-400 mb-1">Compatibility with {compatibilityReport.person2.name}</p>
                      <p className="text-lg font-bold text-yellow-300">{getStatusLabel(compatibilityReport.person1.status)}</p>
                    </div>
                    <div className="bg-gray-900/50 p-3 rounded-md">
                      <p className="text-xs text-gray-400 mb-2">Destiny Archetype Description</p>
                      <p className="text-sm text-gray-300 leading-relaxed">{compatibilityReport.person1.description}</p>
                    </div>
                  </div>
                </div>

                {/* Person 2 */}
                <div className="bg-gray-800/60 p-6 rounded-lg shadow-lg border border-yellow-400/20">
                  <h4 className="font-bold text-xl text-yellow-300 mb-4 text-center flex items-center justify-center gap-2">
                    <Users className="w-5 h-5" />
                    {compatibilityReport.person2.name}
                  </h4>
                  <div className="space-y-3">
                    <div className="bg-gray-900/50 p-4 rounded-md text-center">
                      <p className="text-sm text-gray-400 mb-1">Destiny Number</p>
                      <p className="text-5xl font-bold text-yellow-300 mb-2">{compatibilityReport.person2.destiny}</p>
                      <p className="text-lg text-yellow-200 font-semibold">
                        The {getDestinyArchetype(compatibilityReport.person2.destiny)}
                      </p>
                    </div>
                    <div className={`p-3 rounded-md border-l-4 ${
                      compatibilityReport.person2.status === 'good' ? 'bg-green-900/20 border-green-400' :
                      compatibilityReport.person2.status === 'avoid' ? 'bg-red-900/20 border-red-400' :
                      compatibilityReport.person2.status === 'not' ? 'bg-orange-900/20 border-orange-400' :
                      'bg-blue-900/20 border-blue-400'
                    }`}>
                      <p className="text-xs text-gray-400 mb-1">Compatibility with {compatibilityReport.person1.name}</p>
                      <p className="text-lg font-bold text-yellow-300">{getStatusLabel(compatibilityReport.person2.status)}</p>
                    </div>
                    <div className="bg-gray-900/50 p-3 rounded-md">
                      <p className="text-xs text-gray-400 mb-2">Destiny Archetype Description</p>
                      <p className="text-sm text-gray-300 leading-relaxed">{compatibilityReport.person2.description}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Compatibility Matrix */}
              <div className="bg-gray-800/60 p-6 rounded-lg shadow-lg border border-yellow-400/20">
                <h3 className="text-2xl font-bold text-yellow-400 mb-6 font-serif tracking-wider text-center flex items-center justify-center gap-2">
                  <Info className="w-6 h-6" />
                  Compatibility Analysis
                </h3>
                <div className="space-y-6">
                  {/* From Person 1 to Person 2 */}
                  <div className="bg-gray-900/50 p-5 rounded-lg">
                    <h4 className="text-lg font-semibold text-yellow-300 mb-3">
                      {compatibilityReport.person1.name} → {compatibilityReport.person2.name}
                    </h4>
                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      {DATA.destinyCompatibility[compatibilityReport.person1.destiny]?.good && (
                        <div className="bg-green-900/20 p-3 rounded-md border border-green-400/30">
                          <p className="text-xs text-green-300 mb-2 font-semibold">Good Matches</p>
                          <p className="text-sm text-white">
                            {DATA.destinyCompatibility[compatibilityReport.person1.destiny].good.join(', ')}
                          </p>
                        </div>
                      )}
                      {DATA.destinyCompatibility[compatibilityReport.person1.destiny]?.neutral && (
                        <div className="bg-blue-900/20 p-3 rounded-md border border-blue-400/30">
                          <p className="text-xs text-blue-300 mb-2 font-semibold">Neutral</p>
                          <p className="text-sm text-white">
                            {DATA.destinyCompatibility[compatibilityReport.person1.destiny].neutral.join(', ')}
                          </p>
                        </div>
                      )}
                      {DATA.destinyCompatibility[compatibilityReport.person1.destiny]?.not && (
                        <div className="bg-orange-900/20 p-3 rounded-md border border-orange-400/30">
                          <p className="text-xs text-orange-300 mb-2 font-semibold">Challenging</p>
                          <p className="text-sm text-white">
                            {DATA.destinyCompatibility[compatibilityReport.person1.destiny].not.join(', ')}
                          </p>
                        </div>
                      )}
                      {DATA.destinyCompatibility[compatibilityReport.person1.destiny]?.avoid && (
                        <div className="bg-red-900/20 p-3 rounded-md border border-red-400/30">
                          <p className="text-xs text-red-300 mb-2 font-semibold">Avoid</p>
                          <p className="text-sm text-white">
                            {DATA.destinyCompatibility[compatibilityReport.person1.destiny].avoid.join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-300 italic">
                      Partner's Destiny {compatibilityReport.person2.destiny} falls under: <span className="font-bold text-yellow-300">{getStatusLabel(compatibilityReport.person1.status)}</span>
                    </p>
                  </div>

                  {/* From Person 2 to Person 1 */}
                  <div className="bg-gray-900/50 p-5 rounded-lg">
                    <h4 className="text-lg font-semibold text-yellow-300 mb-3">
                      {compatibilityReport.person2.name} → {compatibilityReport.person1.name}
                    </h4>
                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      {DATA.destinyCompatibility[compatibilityReport.person2.destiny]?.good && (
                        <div className="bg-green-900/20 p-3 rounded-md border border-green-400/30">
                          <p className="text-xs text-green-300 mb-2 font-semibold">Good Matches</p>
                          <p className="text-sm text-white">
                            {DATA.destinyCompatibility[compatibilityReport.person2.destiny].good.join(', ')}
                          </p>
                        </div>
                      )}
                      {DATA.destinyCompatibility[compatibilityReport.person2.destiny]?.neutral && (
                        <div className="bg-blue-900/20 p-3 rounded-md border border-blue-400/30">
                          <p className="text-xs text-blue-300 mb-2 font-semibold">Neutral</p>
                          <p className="text-sm text-white">
                            {DATA.destinyCompatibility[compatibilityReport.person2.destiny].neutral.join(', ')}
                          </p>
                        </div>
                      )}
                      {DATA.destinyCompatibility[compatibilityReport.person2.destiny]?.not && (
                        <div className="bg-orange-900/20 p-3 rounded-md border border-orange-400/30">
                          <p className="text-xs text-orange-300 mb-2 font-semibold">Challenging</p>
                          <p className="text-sm text-white">
                            {DATA.destinyCompatibility[compatibilityReport.person2.destiny].not.join(', ')}
                          </p>
                        </div>
                      )}
                      {DATA.destinyCompatibility[compatibilityReport.person2.destiny]?.avoid && (
                        <div className="bg-red-900/20 p-3 rounded-md border border-red-400/30">
                          <p className="text-xs text-red-300 mb-2 font-semibold">Avoid</p>
                          <p className="text-sm text-white">
                            {DATA.destinyCompatibility[compatibilityReport.person2.destiny].avoid.join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-300 italic">
                      Partner's Destiny {compatibilityReport.person1.destiny} falls under: <span className="font-bold text-yellow-300">{getStatusLabel(compatibilityReport.person2.status)}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Guidance */}
              <div className="bg-gray-800/60 p-6 rounded-lg shadow-lg border border-yellow-400/20">
                <h3 className="text-xl font-bold text-yellow-400 mb-4 font-serif tracking-wider flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Guidance for Your Relationship
                </h3>
                <div className="prose prose-invert text-gray-300 max-w-none">
                  <p className="mb-4">
                    Numerology compatibility reveals the natural energy dynamics between two people based on their Destiny Numbers.
                    This ancient Vedic wisdom can guide you toward understanding, but remember:
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      <strong className="text-yellow-300">Good Matches</strong> show natural harmony and ease in the relationship
                    </li>
                    <li>
                      <strong className="text-yellow-300">Neutral Connections</strong> can work with mutual respect and understanding
                    </li>
                    <li>
                      <strong className="text-yellow-300">Challenging Matches</strong> require extra effort but can lead to growth
                    </li>
                    <li>
                      <strong className="text-yellow-300">Difficult Matches</strong> need conscious work and compromise
                    </li>
                  </ul>
                  <p className="mt-4 text-sm text-yellow-200/80">
                    Every relationship is unique. These insights are meant to guide, not dictate. With awareness, communication,
                    and genuine care, any two people can create a meaningful connection.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setCompatibilityReport(null);
                  setPerson1Name("");
                  setPerson1DOB("");
                  setPerson2Name("");
                  setPerson2DOB("");
                  setError("");
                }}
                className="mt-8 block mx-auto bg-gray-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-gray-700 transition"
              >
                Analyze Another Pair
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </CosmicBackground>
  );
};

export default CompatibilityPage;
