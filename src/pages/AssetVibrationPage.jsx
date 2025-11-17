import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Building2, Car, Briefcase, Landmark, TrendingUp, AlertCircle, CheckCircle, MinusCircle, XCircle, ArrowLeft, Crown } from 'lucide-react';
import CosmicBackground from '../components/CosmicBackground';
import { DATA } from '../data/data';
import { getText } from '../utils/helpers';
import { useAuth } from '../contexts/AuthContext';

// Asset Type Icons
const assetIcons = {
  property: Home,
  business: Briefcase,
  vehicle: Car,
  commercial: Building2,
  investment: TrendingUp,
  land: Landmark,
};

// Status Icons
const StatusIcon = ({ status, className = "w-5 h-5" }) => {
  switch (status) {
    case 'auspicious':
      return <CheckCircle className={`${className} text-green-400`} />;
    case 'good':
      return <CheckCircle className={`${className} text-blue-400`} />;
    case 'neutral':
      return <MinusCircle className={`${className} text-yellow-400`} />;
    case 'avoid':
      return <XCircle className={`${className} text-red-400`} />;
    default:
      return <AlertCircle className={`${className} text-gray-400`} />;
  }
};

const AssetVibrationPage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const [userData, setUserData] = useState({ dob: '', name: '' });
  const [destinyNumber, setDestinyNumber] = useState(null);
  const [basicNumber, setBasicNumber] = useState(null);
  const [selectedAssetType, setSelectedAssetType] = useState('property');
  const [assetNumber, setAssetNumber] = useState('');
  const [compatibilityResult, setCompatibilityResult] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSignOut = async () => {
    await signOut();
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  // Calculate numbers from DOB
  const handleCalculate = (e) => {
    e.preventDefault();
    if (!userData.dob || !userData.name) {
      setFormError('Please enter both name and date of birth.');
      return;
    }
    setFormError('');

    try {
      const date = new Date(userData.dob + 'T00:00:00');
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      // Calculate Basic Number (from day)
      let basic = day;
      while (basic > 9) {
        basic = String(basic)
          .split('')
          .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
      }

      // Calculate Destiny Number (from full date)
      let destiny = String(`${day}${month}${year}`)
        .split('')
        .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
      while (destiny > 9) {
        destiny = String(destiny)
          .split('')
          .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
      }

      setBasicNumber(basic);
      setDestinyNumber(destiny);
    } catch (error) {
      setFormError('Invalid date format. Please try again.');
      console.error('Error calculating numbers:', error);
    }
  };

  // Analyze compatibility
  const analyzeCompatibility = () => {
    if (!assetNumber) return;

    const num = parseInt(assetNumber, 10);
    if (isNaN(num) || num < 1 || num > 9) {
      alert('Please enter a valid number between 1-9');
      return;
    }

    if (!destinyNumber || !basicNumber) {
      alert('Please calculate your numbers first using the form above.');
      return;
    }

    // Use destiny number as primary reference
    const compatibility = DATA.assetCompatibility[destinyNumber];

    let status = 'neutral';
    if (compatibility.auspicious.includes(num)) {
      status = 'auspicious';
    } else if (compatibility.good.includes(num)) {
      status = 'good';
    } else if (compatibility.avoid.includes(num)) {
      status = 'avoid';
    }

    // Also check with basic number
    const basicCompatibility = DATA.assetCompatibility[basicNumber];
    let basicStatus = 'neutral';
    if (basicCompatibility.auspicious.includes(num)) {
      basicStatus = 'auspicious';
    } else if (basicCompatibility.good.includes(num)) {
      basicStatus = 'good';
    } else if (basicCompatibility.avoid.includes(num)) {
      basicStatus = 'avoid';
    }

    setCompatibilityResult({
      assetNum: num,
      destinyStatus: status,
      basicStatus: basicStatus,
      assetType: selectedAssetType,
    });
  };

  // Get compatibility status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'auspicious':
        return 'from-green-500 to-emerald-600';
      case 'good':
        return 'from-blue-500 to-cyan-600';
      case 'neutral':
        return 'from-yellow-500 to-amber-600';
      case 'avoid':
        return 'from-red-500 to-rose-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'auspicious':
        return 'Highly Auspicious';
      case 'good':
        return 'Good Alignment';
      case 'neutral':
        return 'Neutral Energy';
      case 'avoid':
        return 'Should Avoid';
      default:
        return 'Unknown';
    }
  };

  const getStatusDescription = (status, assetType) => {
    const descriptions = {
      auspicious: `This ${assetType} carries excellent vibrational alignment with your destiny. It will bring prosperity, stability, and positive energy into your life. Highly recommended for investment or ownership.`,
      good: `This ${assetType} has favorable vibrations that support your life path. While not the most powerful match, it will serve you well and bring balanced benefits.`,
      neutral: `This ${assetType} carries neutral energy relative to your destiny. It won't significantly help or hinder you. Consider other factors beyond numerology for this decision.`,
      avoid: `This ${assetType} has conflicting vibrations with your destiny number. It may bring challenges, delays, or financial strain. Consider alternative options or modify the number (address, name, etc.).`,
    };
    return descriptions[status] || '';
  };

  // Comprehensive compatibility matrix
  const compatibilityMatrix = useMemo(() => {
    if (!destinyNumber) return null;
    const destinyCompat = DATA.assetCompatibility[destinyNumber];
    return {
      auspicious: destinyCompat.auspicious,
      good: destinyCompat.good,
      neutral: destinyCompat.neutral,
      avoid: destinyCompat.avoid,
    };
  }, [destinyNumber]);

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
              ASSET VIBRATION ANALYSIS
            </h1>
            <p className="text-yellow-200/70 mt-2">
              Discover the cosmic compatibility of properties, businesses & assets with your destiny
            </p>
          </motion.div>

          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-yellow-400/20 p-6 rounded-lg shadow-lg mb-8"
          >
            <h2 className="text-2xl font-bold text-yellow-400 mb-4 text-center">
              Calculate Your Numbers
            </h2>
            <form onSubmit={handleCalculate} className="grid md:grid-cols-3 gap-4 items-end">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-yellow-500 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border-gray-600 rounded-md shadow-sm text-white placeholder:text-gray-400"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label htmlFor="dob" className="block text-sm font-medium text-yellow-500 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dob"
                  value={userData.dob}
                  onChange={(e) => setUserData({ ...userData, dob: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border-gray-600 rounded-md shadow-sm text-white"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
              <button
                type="submit"
                className="bg-yellow-500 text-indigo-900 font-bold px-8 py-3 rounded-lg hover:bg-yellow-600 transition duration-200 shadow-lg"
              >
                Calculate
              </button>
            </form>
            {formError && <p className="text-center text-red-400 mt-4">{formError}</p>}
          </motion.div>

          {/* Numbers Display & Analysis Section */}
          {destinyNumber && basicNumber && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Holo Card Container */}
              <div className="relative">
                {/* Cosmic aura */}
                <div
                  className="absolute -inset-4 -z-10 rounded-[28px] opacity-50 blur-2xl"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 35%, rgba(168,85,247,.35) 0%, rgba(168,85,247,0.0) 55%)',
                  }}
                />

                {/* Deep purple/violet frame */}
                <div
                  className="relative p-[2px] rounded-3xl ring-1 ring-purple-300/20 shadow-[0_0_24px_6px_rgba(168,85,247,0.12)]"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(46,16,101,0.9), rgba(31,13,74,0.9))',
                  }}
                >
                  {/* Glass core */}
                  <div className="relative rounded-[22px] overflow-hidden backdrop-blur-xl bg-transparent border border-white/10">
                    {/* Subtle inner glow */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          'radial-gradient(800px 420px at 50% 0%, rgba(139,92,246,0.18) 0%, transparent 60%), radial-gradient(700px 380px at 50% 100%, rgba(91,33,182,0.16) 0%, transparent 60%)',
                      }}
                    />

                    {/* Tiny stars */}
                    <div className="absolute inset-0 opacity-[0.10] mix-blend-screen pointer-events-none bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.25)_0.5px,transparent_1px)] bg-[length:3px_3px]" />

                    {/* CONTENT */}
                    <div className="relative z-10 p-6 md:p-8 space-y-6">
                      {/* User Numbers Display */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-purple-900/30 border border-purple-400/20 rounded-lg p-6 text-center">
                          <p className="text-sm text-purple-300 mb-2">Your Destiny Number</p>
                          <p className="text-5xl font-bold text-purple-200">{destinyNumber}</p>
                          <p className="text-xs text-purple-400 mt-2">(Primary Reference)</p>
                        </div>
                        <div className="bg-purple-900/30 border border-purple-400/20 rounded-lg p-6 text-center">
                          <p className="text-sm text-purple-300 mb-2">Your Basic Number</p>
                          <p className="text-5xl font-bold text-purple-200">{basicNumber}</p>
                          <p className="text-xs text-purple-400 mt-2">(Secondary Reference)</p>
                        </div>
                      </div>

                      {/* Asset Type Selection */}
                      <div>
                        <label className="block text-sm font-medium text-purple-200 mb-3">
                          Select Asset Type
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {Object.entries(assetIcons).map(([type, Icon]) => (
                            <button
                              key={type}
                              onClick={() => setSelectedAssetType(type)}
                              className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                                selectedAssetType === type
                                  ? 'bg-purple-600/40 border-purple-400 text-white'
                                  : 'bg-purple-900/20 border-purple-700/30 text-purple-300 hover:bg-purple-800/30'
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                              <span className="text-sm font-medium capitalize">{type}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Asset Number Input */}
                      <div>
                        <label htmlFor="assetNumber" className="block text-sm font-medium text-purple-200 mb-2">
                          Enter Asset Number (1-9)
                        </label>
                        <p className="text-xs text-purple-400/70 mb-3">
                          For properties: Sum the digits of house/flat number. For businesses: Calculate from business name. For vehicles: Use number plate sum.
                        </p>
                        <div className="flex gap-3">
                          <input
                            type="text"
                            id="assetNumber"
                            value={assetNumber}
                            onChange={(e) => setAssetNumber(e.target.value)}
                            placeholder="e.g., 5"
                            className="flex-1 px-4 py-3 bg-purple-900/30 border border-purple-400/30 rounded-lg focus:ring-2 focus:ring-purple-500 text-white placeholder:text-purple-400/50"
                            maxLength="1"
                          />
                          <button
                            onClick={analyzeCompatibility}
                            className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-[0_8px_28px_rgba(168,85,247,0.35)] hover:opacity-95 transition"
                          >
                            Analyze
                          </button>
                        </div>
                      </div>

                      {/* Compatibility Result */}
                      {compatibilityResult && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
                          {/* Primary Result Card */}
                          <div
                            className={`p-5 rounded-xl bg-gradient-to-r ${getStatusColor(
                              compatibilityResult.destinyStatus
                            )} bg-opacity-20 border-2 border-white/20`}
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <StatusIcon status={compatibilityResult.destinyStatus} className="w-8 h-8" />
                              <div>
                                <h4 className="text-xl font-bold text-white">
                                  {getStatusText(compatibilityResult.destinyStatus)}
                                </h4>
                                <p className="text-sm text-white/80">
                                  Asset Number {compatibilityResult.assetNum} vs. Destiny Number {destinyNumber}
                                </p>
                              </div>
                            </div>
                            <p className="text-white/90 text-sm leading-relaxed">
                              {getStatusDescription(
                                compatibilityResult.destinyStatus,
                                compatibilityResult.assetType
                              )}
                            </p>
                          </div>

                          {/* Secondary Check with Basic Number */}
                          {compatibilityResult.basicStatus !== compatibilityResult.destinyStatus && (
                            <div className="bg-purple-900/30 border border-purple-400/20 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <StatusIcon status={compatibilityResult.basicStatus} className="w-5 h-5" />
                                <p className="text-sm font-semibold text-purple-200">
                                  Secondary Analysis (Basic Number {basicNumber})
                                </p>
                              </div>
                              <p className="text-xs text-purple-300/80">
                                With your Basic Number, this asset shows{' '}
                                <strong>{getStatusText(compatibilityResult.basicStatus)}</strong> energy. Your
                                Destiny Number takes precedence for major decisions.
                              </p>
                            </div>
                          )}

                          {/* Remedial Suggestions */}
                          {compatibilityResult.destinyStatus === 'avoid' && compatibilityMatrix && (
                            <div className="bg-red-900/20 border border-red-400/30 rounded-lg p-4">
                              <h5 className="font-semibold text-red-300 mb-2 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5" />
                                Remedial Options
                              </h5>
                              <ul className="text-sm text-red-200/80 space-y-1 list-disc list-inside">
                                <li>
                                  Modify the asset number (change flat number display, business name spelling)
                                </li>
                                <li>
                                  Consider assets with compatible numbers: {compatibilityMatrix.auspicious.join(', ')}{' '}
                                  (auspicious) or {compatibilityMatrix.good.join(', ')} (good)
                                </li>
                                <li>
                                  Perform Vedic remedies: Rudraksha, mantras, or charity on auspicious days
                                </li>
                              </ul>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* Advanced Matrix Toggle */}
                      {compatibilityMatrix && (
                        <div className="border-t border-purple-400/20 pt-4">
                          <button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="w-full flex items-center justify-between text-sm font-medium text-purple-200 hover:text-white transition"
                          >
                            <span>{showAdvanced ? '▼' : '▶'} View Complete Compatibility Matrix</span>
                          </button>

                          {showAdvanced && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-4 space-y-3"
                            >
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {/* Auspicious */}
                                <div className="bg-green-900/20 border border-green-400/30 rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                    <p className="text-xs font-semibold text-green-300">Auspicious</p>
                                  </div>
                                  <p className="text-2xl font-bold text-green-200">
                                    {compatibilityMatrix.auspicious.join(', ')}
                                  </p>
                                </div>

                                {/* Good */}
                                <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle className="w-4 h-4 text-blue-400" />
                                    <p className="text-xs font-semibold text-blue-300">Good</p>
                                  </div>
                                  <p className="text-2xl font-bold text-blue-200">
                                    {compatibilityMatrix.good.join(', ')}
                                  </p>
                                </div>

                                {/* Neutral */}
                                <div className="bg-yellow-900/20 border border-yellow-400/30 rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <MinusCircle className="w-4 h-4 text-yellow-400" />
                                    <p className="text-xs font-semibold text-yellow-300">Neutral</p>
                                  </div>
                                  <p className="text-2xl font-bold text-yellow-200">
                                    {compatibilityMatrix.neutral.join(', ')}
                                  </p>
                                </div>

                                {/* Avoid */}
                                <div className="bg-red-900/20 border border-red-400/30 rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <XCircle className="w-4 h-4 text-red-400" />
                                    <p className="text-xs font-semibold text-red-300">Avoid</p>
                                  </div>
                                  <p className="text-2xl font-bold text-red-200">
                                    {compatibilityMatrix.avoid.join(', ')}
                                  </p>
                                </div>
                              </div>

                              {/* Description from DATA */}
                              <div className="bg-purple-900/30 border border-purple-400/20 rounded-lg p-4">
                                <p className="text-xs text-purple-200/80 leading-relaxed">
                                  {getText(DATA.assetCompatibility[destinyNumber].description, 'en')}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      )}

                      {/* Footer Note */}
                      <div className="text-center text-xs text-purple-300/60">
                        <p>
                          🔮 Asset vibration analysis uses authentic Vedic numerology principles. Consult with a
                          professional for major investments.
                        </p>
                      </div>
                    </div>
                    {/* /CONTENT */}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </CosmicBackground>
  );
};

export default AssetVibrationPage;
