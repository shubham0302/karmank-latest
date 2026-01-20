import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Home, Building2, Car, Briefcase, Landmark, TrendingUp, AlertCircle, CheckCircle, MinusCircle, XCircle } from 'lucide-react';
import { getText } from '../../utils/helpers';
import { GradientText } from '../GradientText';
import { getAssetCompatibility } from '../../utils/localData';

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

const AssetVibrationCard = ({ report, userData, language = 'en' }) => {
  const [selectedAssetType, setSelectedAssetType] = useState('property');
  const [assetNumber, setAssetNumber] = useState('');
  const [compatibilityResult, setCompatibilityResult] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!report?.relevantData) {
    return <div className="text-yellow-400 p-4">Report data not fully loaded.</div>;
  }

  // Extract user's primary numbers
  const { destinyNumber, basicNumber } = report;

  // Calculate asset name number (similar to name calculation)
  const calculateAssetNameNumber = (name) => {
    const letterValues = {
      'A': 1, 'J': 1, 'S': 1, 'B': 2, 'K': 2, 'T': 2, 'C': 3, 'L': 3, 'U': 3,
      'D': 4, 'M': 4, 'V': 4, 'E': 5, 'N': 5, 'W': 5, 'F': 6, 'O': 6, 'X': 6,
      'G': 7, 'P': 7, 'Y': 7, 'H': 8, 'Q': 8, 'Z': 8, 'I': 9, 'R': 9
    };

    const sum = name
      .toUpperCase()
      .replace(/[^A-Z]/g, '')
      .split('')
      .reduce((acc, char) => acc + (letterValues[char] || 0), 0);

    let result = sum;
    while (result > 9) {
      result = String(result)
        .split('')
        .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
    }
    return result;
  };

  // Analyze compatibility
  const analyzeCompatibility = () => {
    if (!assetNumber) return;

    const num = parseInt(assetNumber, 10);
    if (isNaN(num) || num < 1 || num > 9) {
      alert('Please enter a valid number between 1-9');
      return;
    }

    // Use destiny number as primary reference
    const compatibility = getAssetCompatibility(report, destinyNumber);

    let status = 'neutral';
    if (compatibility && compatibility.auspicious && compatibility.auspicious.includes(num)) {
      status = 'auspicious';
    } else if (compatibility && compatibility.good && compatibility.good.includes(num)) {
      status = 'good';
    } else if (compatibility && compatibility.avoid && compatibility.avoid.includes(num)) {
      status = 'avoid';
    }

    // Also check with basic number
    const basicCompatibility = getAssetCompatibility(report, basicNumber);
    let basicStatus = 'neutral';
    if (basicCompatibility && basicCompatibility.auspicious && basicCompatibility.auspicious.includes(num)) {
      basicStatus = 'auspicious';
    } else if (basicCompatibility && basicCompatibility.good && basicCompatibility.good.includes(num)) {
      basicStatus = 'good';
    } else if (basicCompatibility && basicCompatibility.avoid && basicCompatibility.avoid.includes(num)) {
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
    const destinyCompat = getAssetCompatibility(report, destinyNumber);
    if (!destinyCompat) {
      return {
        auspicious: [],
        good: [],
        neutral: [],
        avoid: [],
      };
    }
    return {
      auspicious: destinyCompat.auspicious || [],
      good: destinyCompat.good || [],
      neutral: destinyCompat.neutral || [],
      avoid: destinyCompat.avoid || [],
    };
  }, [destinyNumber, report]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full"
    >
      {/* Cosmic aura behind the card */}
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
          <div
            className="absolute inset-0 opacity-[0.10] mix-blend-screen pointer-events-none bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.25)_0.5px,transparent_1px)] bg-[length:3px_3px]"
          />

          {/* CONTENT */}
          <div className="relative z-10 p-6 md:p-8 space-y-6">
            {/* Title */}
            <div className="text-center">
              <h3
                className="text-2xl md:text-3xl font-serif font-extrabold bg-[linear-gradient(90deg,#a855f7_0%,#c084fc_30%,#e879f9_70%,#f0abfc_100%)] bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]"
              >
                🏠 ASSET VIBRATION ANALYSIS
              </h3>
              <p className="mt-2 text-white/70 text-sm">
                Discover the cosmic compatibility of properties, businesses & assets with your destiny
              </p>
            </div>

            {/* User Numbers Display */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-900/30 border border-purple-400/20 rounded-lg p-4 text-center">
                <p className="text-xs text-purple-300 mb-1">Your Destiny Number</p>
                <p className="text-4xl font-bold text-purple-200">{destinyNumber}</p>
                <p className="text-xs text-purple-400 mt-1">(Primary Reference)</p>
              </div>
              <div className="bg-purple-900/30 border border-purple-400/20 rounded-lg p-4 text-center">
                <p className="text-xs text-purple-300 mb-1">Your Basic Number</p>
                <p className="text-4xl font-bold text-purple-200">{basicNumber}</p>
                <p className="text-xs text-purple-400 mt-1">(Secondary Reference)</p>
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
                <div className={`p-5 rounded-xl bg-gradient-to-r ${getStatusColor(compatibilityResult.destinyStatus)} bg-opacity-20 border-2 border-white/20`}>
                  <div className="flex items-center gap-3 mb-3">
                    <StatusIcon status={compatibilityResult.destinyStatus} className="w-8 h-8" />
                    <div>
                      <GradientText as="h4" size="xl">
                        {getStatusText(compatibilityResult.destinyStatus)}
                      </GradientText>
                      <p className="text-sm text-white/80">
                        Asset Number {compatibilityResult.assetNum} vs. Destiny Number {destinyNumber}
                      </p>
                    </div>
                  </div>
                  <p className="text-white/90 text-sm leading-relaxed">
                    {getStatusDescription(compatibilityResult.destinyStatus, compatibilityResult.assetType)}
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
                      <strong>{getStatusText(compatibilityResult.basicStatus)}</strong> energy.
                      Your Destiny Number takes precedence for major decisions.
                    </p>
                  </div>
                )}

                {/* Remedial Suggestions */}
                {compatibilityResult.destinyStatus === 'avoid' && (
                  <div className="bg-red-900/20 border border-red-400/30 rounded-lg p-4">
                    <h5 className="font-semibold text-red-300 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Remedial Options
                    </h5>
                    <ul className="text-sm text-red-200/80 space-y-1 list-disc list-inside">
                      <li>Modify the asset number (change flat number display, business name spelling)</li>
                      <li>Consider assets with compatible numbers: {compatibilityMatrix.auspicious.join(', ')} (auspicious) or {compatibilityMatrix.good.join(', ')} (good)</li>
                      <li>Perform Vedic remedies: Rudraksha, mantras, or charity on auspicious days</li>
                    </ul>
                  </div>
                )}
              </motion.div>
            )}

            {/* Advanced Matrix Toggle */}
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

                  {/* Description from report data */}
                  <div className="bg-purple-900/30 border border-purple-400/20 rounded-lg p-4">
                    <p className="text-xs text-purple-200/80 leading-relaxed">
                      {getAssetCompatibility(report, destinyNumber)?.description
                        ? getText(getAssetCompatibility(report, destinyNumber).description, language)
                        : 'Asset compatibility analysis for your destiny number.'}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer Note */}
            <div className="text-center text-xs text-purple-300/60">
              <p>
                🔮 Asset vibration analysis uses authentic Vedic numerology principles. Consult with a professional for major investments.
              </p>
            </div>
          </div>
          {/* /CONTENT */}
        </div>
      </div>
    </motion.div>
  );
};

export default AssetVibrationCard;
