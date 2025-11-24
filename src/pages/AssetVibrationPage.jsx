import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home, Building2, Car, Briefcase, Landmark, TrendingUp, AlertCircle,
  CheckCircle, MinusCircle, XCircle, ArrowLeft, Crown, Phone, CreditCard,
  Sparkles, Wand2, CheckCircle2, Star
} from 'lucide-react';
import CosmicBackground from '../components/CosmicBackground';
import { DATA } from '../data/data';
import { getText } from '../utils/helpers';
import { useAuth } from '../contexts/AuthContext';

// Enhanced Asset Data with Pythagorean Letter Values
const ASSET_DATA = {
  letterValues: {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
    'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8,
  },
  vehicleNumberDetails: {
    1: "Represents leadership and independence. Great for a car that stands out and is often driven solo.",
    2: "Promotes smooth, pleasant journeys. A good, reliable number, especially for a shared car.",
    3: "Associated with fun, creativity, and social trips. Expect enjoyable drives.",
    4: "Signifies reliability and safety, but may be prone to occasional mechanical issues.",
    5: "The number of adventure and travel. Perfect for road trips and exploring new places.",
    6: "Represents comfort, luxury, and family trips. A safe and nurturing vehicle.",
    7: "A number for the spiritual seeker or lone traveler. Great for solo drives and introspection.",
    8: "Symbolizes power, status, and success. Often associated with business and ambition.",
    9: "Connected to service and long-distance travel. May be used to help others."
  },
  houseNumberDetails: {
    1: "Promotes independence, ambition, and new beginnings.",
    2: "Fosters love, harmony, and relationships.",
    3: "A hub of creativity, social gatherings, and self-expression.",
    4: "Represents stability, security, and hard work.",
    5: "Full of adventure, change, and social energy.",
    6: "The ultimate number for family, nurturing, and responsibility.",
    7: "A space for introspection, spirituality, and analysis.",
    8: "Attracts abundance, success, and power.",
    9: "Fosters compassion, humanitarianism, and wisdom."
  },
  mobileNumberDetails: {
    1: "Vibration of leadership and ambition. Good for business owners.",
    2: "Vibration of partnership and harmony. Excellent for teamwork.",
    3: "Vibration of creativity and socializing. Great for artists and writers.",
    4: "Vibration of hard work, but can also bring unexpected issues.",
    5: "Vibration of business, sales, and networking. Ideal for adaptability.",
    6: "Vibration of family, service, and luxury. A nurturing number.",
    7: "Vibration of introspection and research. Good for analysts.",
    8: "Vibration of power, finance, and karma. Can attract significant wealth.",
    9: "Vibration of humanitarianism and energy. Good for public-facing roles."
  },
  accountNumberDetails: {
    1: "Good for accounts related to new ventures and independent earnings.",
    2: "Favors joint accounts, partnerships, and savings.",
    3: "Supports accounts used for creative projects and social spending.",
    4: "Excellent for long-term savings and property investment.",
    5: "Ideal for accounts with frequent transactions and travel funds.",
    6: "Best for family savings and household expenses.",
    7: "Suits accounts for research, education, or spiritual pursuits.",
    8: "The powerhouse number for wealth, business, and large-scale goals.",
    9: "Aligns with charitable donations and humanitarian causes."
  },
  businessNumberDetails: {
    1: "Leadership & Innovation - Perfect for pioneering startups, tech ventures, and solo entrepreneurship. Attracts strong-willed leaders and first-movers.",
    2: "Partnership & Collaboration - Ideal for consulting, customer service, and partnership-based businesses. Promotes harmony and diplomatic relations.",
    3: "Creativity & Marketing - Excellent for media, entertainment, advertising, and creative agencies. Brings social charm and expressive communication.",
    4: "Structure & Systems - Great for manufacturing, real estate, construction, and process-driven businesses. Ensures stability but requires patience.",
    5: "Dynamic Sales & Travel - Perfect for sales, e-commerce, travel agencies, and communication businesses. Attracts change, variety, and adaptability.",
    6: "Service & Hospitality - Best for healthcare, beauty, hospitality, restaurants, and family businesses. Nurtures customer loyalty and comfort.",
    7: "Research & Technology - Ideal for IT, consulting, research, spiritual businesses, and analytical services. Promotes deep expertise and wisdom.",
    8: "Finance & Authority - Powerhouse for banking, finance, corporate ventures, and high-stakes businesses. Attracts wealth, power, and material success.",
    9: "Humanitarian & Global - Perfect for NGOs, education, global businesses, and transformational services. Brings compassion and large-scale impact."
  },
  landNumberDetails: {
    1: "Prime & Standalone - Excellent for independent plots, corner properties, and leadership locations. Ideal for single-owner development and flagship projects.",
    2: "Peaceful & Residential - Perfect for calm residential zones, partnership investments, and harmonious neighborhoods. Brings cooperative energy.",
    3: "Social & Commercial - Great for commercial hubs, creative spaces, and areas with high social activity. Attracts communication and creative businesses.",
    4: "Stable & Agricultural - Ideal for long-term holdings, agricultural land, and solid foundations. Ensures reliability but slow appreciation.",
    5: "Dynamic & High-Traffic - Perfect for high-traffic commercial zones, travel-related properties, and dynamic development. Brings constant movement.",
    6: "Family & Community - Best for residential colonies, family properties, and nurturing spaces. Creates comfort, harmony, and family-oriented developments.",
    7: "Secluded & Spiritual - Ideal for retreat centers, research facilities, spiritual properties, and quiet zones. Promotes introspection and wisdom.",
    8: "Premium & Business - Powerhouse for business districts, premium locations, and authority centers. Attracts wealth, prestige, and material success.",
    9: "Large & Humanitarian - Perfect for large plots, community projects, educational institutions, and humanitarian developments. Brings universal service."
  },
  remedyData: {
    1: {
      mantra: "Om Suryaya Namah (ॐ सूर्याय नमः)",
      crystal: "Ruby (Manik) or Sunstone",
      advice: "To enhance leadership and vitality, chant the mantra daily. Wearing a Ruby (after consultation) can boost positive solar energy."
    },
    2: {
      mantra: "Om Chandraya Namah (ॐ चंद्राय नमः)",
      crystal: "Pearl (Moti) or Moonstone",
      advice: "To balance emotions, chant this mantra. A Pearl can help soothe the mind and promote emotional stability."
    },
    3: {
      mantra: "Om Gurave Namah (ॐ गुरवे नमः)",
      crystal: "Yellow Sapphire (Pukhraj)",
      advice: "To attract wisdom and expansion, chant this mantra. A Yellow Sapphire can enhance judgment and prosperity."
    },
    4: {
      mantra: "Om Rahave Namah (ॐ राहवे नमः)",
      crystal: "Gomed (Hessonite)",
      advice: "To pacify the disruptive energy of Rahu, chant this mantra 108 times daily. A Gomed crystal can help reduce sudden obstacles."
    },
    5: {
      mantra: "Om Budhaya Namah (ॐ बुधाय नमः)",
      crystal: "Emerald (Panna)",
      advice: "To improve communication and intellect, chant this mantra. An Emerald can sharpen the mind and improve financial dealings."
    },
    6: {
      mantra: "Om Shukraya Namah (ॐ शुक्राय नमः)",
      crystal: "Diamond (Heera) or White Zircon",
      advice: "To attract luxury, love, and harmony, chant this mantra. A Diamond enhances charm and material comforts."
    },
    7: {
      mantra: "Om Ketave Namah (ॐ केतवे नमः)",
      crystal: "Cat's Eye (Lehsunia)",
      advice: "To enhance intuition and protect from hidden issues, chant this mantra. A Cat's Eye can promote spiritual insight and detachment."
    },
    8: {
      mantra: "Om Shanaishcharaya Namah (ॐ शनैश्चराय नमः)",
      crystal: "Blue Sapphire (Neelam) - *Use with extreme caution*",
      advice: "To bring discipline and mitigate delays, chant daily. A Blue Sapphire is very powerful and must only be worn after expert consultation."
    },
    9: {
      mantra: "Om Angarakaya Namah (ॐ अंगारकाय नमः)",
      crystal: "Red Coral (Moonga)",
      advice: "To boost energy, courage, and reduce conflicts, chant this mantra. A Red Coral can enhance physical vitality and determination."
    }
  }
};

// Asset Type Icons
const assetIcons = {
  vehicle: Car,
  property: Home,
  mobile: Phone,
  account: CreditCard,
  business: Briefcase,
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
  const [selectedAssetType, setSelectedAssetType] = useState('vehicle');
  const [assetInput, setAssetInput] = useState('');
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

  // Helper function to reduce to single digit
  const reduceToSingleDigit = (num) => {
    if (typeof num !== 'number' && typeof num !== 'string') return 0;
    let currentNumStr = String(num);
    while (currentNumStr.length > 1) {
      currentNumStr = String(currentNumStr.split('').reduce((acc, digit) => {
        const parsedDigit = parseInt(digit, 10);
        return acc + (isNaN(parsedDigit) ? 0 : parsedDigit);
      }, 0));
    }
    const finalNum = parseInt(currentNumStr, 10);
    return isNaN(finalNum) ? 0 : finalNum;
  };

  // Enhanced Analyze compatibility with different asset types
  const analyzeCompatibility = () => {
    if (!assetInput.trim()) {
      alert(`Please enter a ${selectedAssetType} number or identifier.`);
      return;
    }

    if (!destinyNumber || !basicNumber) {
      alert('Please calculate your numbers first using the form above.');
      return;
    }

    let finalNumber;
    let interpretation = '';

    try {
      if (selectedAssetType === 'vehicle') {
        // Vehicle: Calculate from both letters and numbers
        const letters = (assetInput.match(/[A-Z]/gi) || []).join('').toUpperCase();
        const digits = (assetInput.match(/\d/g) || []).join('');

        if (!letters && !digits) {
          alert("No letters or digits found in the vehicle number.");
          return;
        }

        const letterSum = letters.split('').reduce((acc, char) => acc + (ASSET_DATA.letterValues[char] || 0), 0);
        const digitSum = digits.split('').reduce((acc, d) => acc + parseInt(d, 10), 0);

        finalNumber = reduceToSingleDigit(letterSum + digitSum);
        interpretation = ASSET_DATA.vehicleNumberDetails[finalNumber];
      } else if (selectedAssetType === 'mobile') {
        // Mobile: Calculate from all digits
        const digits = assetInput.replace(/\D/g, "");
        if (!digits.length) {
          alert("No digits found in the mobile number.");
          return;
        }
        const sum = digits.split("").reduce((acc, d) => acc + parseInt(d, 10), 0);
        finalNumber = reduceToSingleDigit(sum);
        interpretation = ASSET_DATA.mobileNumberDetails[finalNumber];
      } else if (selectedAssetType === 'account') {
        // Account: Calculate from digits
        const digits = assetInput.replace(/\D/g, "");
        if (!digits.length) {
          alert("No digits found in the account number.");
          return;
        }
        const sum = digits.split("").reduce((acc, d) => acc + parseInt(d, 10), 0);
        finalNumber = reduceToSingleDigit(sum);
        interpretation = ASSET_DATA.accountNumberDetails[finalNumber];
      } else if (selectedAssetType === 'property') {
        // Property: Calculate from digits
        const digits = assetInput.replace(/\D/g, "");
        if (!digits.length) {
          alert("No digits found in the property number.");
          return;
        }
        const sum = digits.split("").reduce((acc, d) => acc + parseInt(d, 10), 0);
        finalNumber = reduceToSingleDigit(sum);
        interpretation = ASSET_DATA.houseNumberDetails[finalNumber];
      } else if (selectedAssetType === 'business') {
        // Business: Calculate from business name using Pythagorean values
        const letters = (assetInput.match(/[A-Z]/gi) || []).join('').toUpperCase();
        if (!letters) {
          alert("Please enter a valid business name with letters.");
          return;
        }
        const letterSum = letters.split('').reduce((acc, char) => acc + (ASSET_DATA.letterValues[char] || 0), 0);
        finalNumber = reduceToSingleDigit(letterSum);
        interpretation = ASSET_DATA.businessNumberDetails[finalNumber];
      } else if (selectedAssetType === 'land') {
        // Land: Calculate from plot/survey number
        const digits = assetInput.replace(/\D/g, "");
        if (!digits.length) {
          alert("No digits found in the land/plot number.");
          return;
        }
        const sum = digits.split("").reduce((acc, d) => acc + parseInt(d, 10), 0);
        finalNumber = reduceToSingleDigit(sum);
        interpretation = ASSET_DATA.landNumberDetails[finalNumber];
      } else {
        // Default: try to parse as number
        const num = parseInt(assetInput, 10);
        if (isNaN(num) || num < 1 || num > 9) {
          alert('Please enter a valid number between 1-9');
          return;
        }
        finalNumber = num;
      }

      // Use destiny number as primary reference
      const compatibility = DATA.assetCompatibility[destinyNumber];

      let status = 'neutral';
      if (compatibility.auspicious.includes(finalNumber)) {
        status = 'auspicious';
      } else if (compatibility.good.includes(finalNumber)) {
        status = 'good';
      } else if (compatibility.avoid.includes(finalNumber)) {
        status = 'avoid';
      }

      // Also check with basic number
      const basicCompatibility = DATA.assetCompatibility[basicNumber];
      let basicStatus = 'neutral';
      if (basicCompatibility.auspicious.includes(finalNumber)) {
        basicStatus = 'auspicious';
      } else if (basicCompatibility.good.includes(finalNumber)) {
        basicStatus = 'good';
      } else if (basicCompatibility.avoid.includes(finalNumber)) {
        basicStatus = 'avoid';
      }

      setCompatibilityResult({
        assetNum: finalNumber,
        destinyStatus: status,
        basicStatus: basicStatus,
        assetType: selectedAssetType,
        interpretation: interpretation || `No specific interpretation found for ${selectedAssetType} number ${finalNumber}.`,
        remedy: ASSET_DATA.remedyData[finalNumber]
      });
    } catch (e) {
      console.error("Asset analyze error:", e);
      alert("Could not analyze this number. Please try again.");
    }
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
          {/* Back Button */}
          <div className="flex justify-end items-center mb-6">
            <button
              onClick={handleBackToHome}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-4 py-2 rounded-md text-sm font-medium transition duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          </div>

          {/* Futuristic Gate Header */}
          <div className="relative w-full h-40 mb-8 overflow-hidden rounded-xl border border-cyan-500/20">
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/40 via-gray-950 to-black" />
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(to right, rgba(34, 211, 238, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
              transform: 'perspective(500px) rotateX(60deg)',
              transformOrigin: 'center bottom'
            }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-2 relative z-10">
                <div className="text-4xl font-bold">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500">
                    KarmAnk
                  </span>
                  <sup className="text-2xl -top-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500">
                    ™
                  </sup>
                </div>
                <div className="text-sm text-cyan-400/60 tracking-widest">
                  ASSET VIBRATION SYSTEM
                </div>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
                  <div className="text-xs text-cyan-400/40">★</div>
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>

          {!destinyNumber ? (
            /* Introduction Page */
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-900/60 backdrop-blur-md p-8 rounded-xl border border-cyan-500/20 shadow-2xl">
                <h2 className="text-2xl font-bold text-center text-cyan-300 mb-6">
                  Enter Your Details
                </h2>

                <div className="space-y-6">
                  <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                    <input
                      type="text"
                      value={userData.name}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                      placeholder="YOUR FULL NAME"
                      className="relative w-full px-6 py-5 bg-gray-950 border border-gray-800 rounded-lg focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 text-gray-300 text-center tracking-widest uppercase outline-none placeholder-gray-600"
                    />
                  </div>

                  <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                    <input
                      type="date"
                      value={userData.dob}
                      onChange={(e) => setUserData({ ...userData, dob: e.target.value })}
                      placeholder="DD-MM-YYYY"
                      className="relative w-full px-6 py-5 bg-gray-950 border border-gray-800 rounded-lg focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 text-gray-300 text-center tracking-widest uppercase outline-none"
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>

                  <button
                    onClick={handleCalculate}
                    className="w-full py-4 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg shadow-cyan-500/20"
                  >
                    INITIATE ANALYSIS
                  </button>

                  {formError && (
                    <p className="text-center text-red-400 text-sm">{formError}</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Analysis Section */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Main Card Container */}
              <div className="bg-gray-900/50 p-6 md:p-8 rounded-xl border border-cyan-500/20 shadow-2xl">
                <div className="space-y-6">
                  {/* User Numbers Display */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-6 text-center">
                      <p className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400 mb-2 font-semibold">Your Destiny Number</p>
                      <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-500">{destinyNumber}</p>
                      <p className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mt-2">(Primary Reference)</p>
                    </div>
                    <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-6 text-center">
                      <p className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400 mb-2 font-semibold">Your Basic Number</p>
                      <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-500">{basicNumber}</p>
                      <p className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mt-2">(Secondary Reference)</p>
                    </div>
                  </div>

                  {/* Asset Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-cyan-200 mb-3">
                      Select Asset Type
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(assetIcons).map(([type, Icon]) => (
                        <button
                          key={type}
                          onClick={() => setSelectedAssetType(type)}
                          className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                            selectedAssetType === type
                              ? 'bg-cyan-600/40 border-cyan-400'
                              : 'bg-gray-900/50 border-cyan-700/30 hover:bg-cyan-900/30'
                          }`}
                        >
                          <Icon className={`w-5 h-5 ${
                            selectedAssetType === type
                              ? 'text-cyan-200'
                              : 'text-cyan-400'
                          }`} />
                          <span className={`text-sm font-medium capitalize ${
                            selectedAssetType === type
                              ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-blue-300'
                              : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400'
                          }`}>
                            {type}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Asset Number Input */}
                  <div>
                    <label htmlFor="assetInput" className="block text-sm font-medium text-cyan-200 mb-2">
                      {selectedAssetType === 'vehicle' && 'Enter Vehicle Number (Letters + Digits)'}
                      {selectedAssetType === 'mobile' && 'Enter Mobile Number (10 Digits)'}
                      {selectedAssetType === 'account' && 'Enter Account Number (Last 4-6 Digits)'}
                      {selectedAssetType === 'property' && 'Enter House/Flat Number'}
                      {selectedAssetType === 'business' && 'Enter Business/Brand Name'}
                      {selectedAssetType === 'land' && 'Enter Plot/Survey Number'}
                    </label>
                    <p className="text-xs text-cyan-400/70 mb-3">
                      {selectedAssetType === 'vehicle' && 'Example: MH12AB1234 (Letters A=1, B=2... Z=8 calculated with digits)'}
                      {selectedAssetType === 'mobile' && 'Example: 9876543210 (All digits will be summed)'}
                      {selectedAssetType === 'account' && 'Example: Enter last 4-6 digits of your account number'}
                      {selectedAssetType === 'property' && 'Example: B-404, 123, or 12 (Digits are summed)'}
                      {selectedAssetType === 'business' && 'Example: APPLE, Google Cafe (Letters summed via Pythagorean values)'}
                      {selectedAssetType === 'land' && 'Example: Plot 123, Survey 456 (Digits are summed)'}
                    </p>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        id="assetInput"
                        value={assetInput}
                        onChange={(e) => setAssetInput(e.target.value)}
                        placeholder={
                          selectedAssetType === 'vehicle' ? 'MH12AB1234' :
                          selectedAssetType === 'mobile' ? '9876543210' :
                          selectedAssetType === 'account' ? '123456' :
                          selectedAssetType === 'property' ? 'B-404' :
                          selectedAssetType === 'business' ? 'Business Name' :
                          selectedAssetType === 'land' ? 'Plot 123' :
                          'Enter number'
                        }
                        className="flex-1 px-4 py-3 bg-gray-900/50 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 text-white placeholder:text-cyan-400/50 uppercase"
                      />
                      <button
                        onClick={analyzeCompatibility}
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg hover:opacity-95 transition"
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

                          {/* Asset Interpretation */}
                          {compatibilityResult.interpretation && (
                            <div className="bg-gray-900/60 p-5 rounded-xl border border-cyan-500/30">
                              <h5 className="font-semibold text-cyan-400 mb-2 flex items-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                {selectedAssetType.charAt(0).toUpperCase() + selectedAssetType.slice(1)} Number Interpretation
                              </h5>
                              <p className="text-gray-300 leading-relaxed text-sm">
                                {compatibilityResult.interpretation}
                              </p>
                            </div>
                          )}

                          {/* Remedial Guidance */}
                          {compatibilityResult.remedy && (
                            <div className={`p-5 rounded-xl border-2 ${
                              [4, 8].includes(compatibilityResult.assetNum)
                                ? 'bg-red-900/20 border-red-500/50'
                                : 'bg-cyan-900/20 border-cyan-500/30'
                            }`}>
                              <h5 className={`font-bold mb-3 text-lg flex items-center gap-2 ${
                                [4, 8].includes(compatibilityResult.assetNum)
                                  ? 'text-red-300'
                                  : 'text-cyan-300'
                              }`}>
                                <Wand2 className="w-5 h-5" />
                                Remedial Guidance (Vibration {compatibilityResult.assetNum})
                              </h5>
                              <p className="text-gray-300 mb-3 text-sm leading-relaxed">{compatibilityResult.remedy.advice}</p>
                              <div className="space-y-2">
                                <p className="text-gray-300 text-sm">
                                  <strong className="text-blue-400">Mantra:</strong>{' '}
                                  <span className="text-blue-300 italic">{compatibilityResult.remedy.mantra}</span>
                                </p>
                                <p className="text-gray-300 text-sm">
                                  <strong className="text-cyan-400">Crystal:</strong>{' '}
                                  <span className="text-cyan-300">{compatibilityResult.remedy.crystal}</span>
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Secondary Check with Basic Number */}
                          {compatibilityResult.basicStatus !== compatibilityResult.destinyStatus && (
                            <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <StatusIcon status={compatibilityResult.basicStatus} className="w-5 h-5" />
                                <p className="text-sm font-semibold text-cyan-200">
                                  Secondary Analysis (Basic Number {basicNumber})
                                </p>
                              </div>
                              <p className="text-xs text-cyan-300/80">
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
                    <div className="border-t border-cyan-500/20 pt-4">
                      <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="w-full flex items-center justify-between text-sm font-medium text-cyan-200 hover:text-white transition"
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
                          <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-4">
                            <p className="text-xs text-cyan-200/80 leading-relaxed">
                              {getText(DATA.assetCompatibility[destinyNumber].description, 'en')}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Footer Note */}
                  <div className="text-center text-xs text-gray-400/60">
                    <p>
                      🔮 Asset vibration analysis uses authentic Vedic numerology principles. Consult with a
                      professional for major investments.
                    </p>
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
