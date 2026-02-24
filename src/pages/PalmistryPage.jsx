import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, History, Layers, Globe, Calendar } from 'lucide-react';
import CosmicBackground from '../components/CosmicBackground';
import CameraCapture from '../components/palmistry/CameraCapture';
import FullHandCapture from '../components/palmistry/FullHandCapture';
import AnalysisDisplay from '../components/palmistry/AnalysisDisplay';
import ReadingHistoryPanel from '../components/palmistry/ReadingHistoryPanel';
import { analyzeNadiPatterns } from '../services/palmistryService';
import { generateBundleAndLeaf } from '../data/verificationQuestions';
import { preprocessThumbprint } from '../services/thumbprintPreprocessor';
import {
  saveThumbprintClassification,
  createReadingSession,
  completeReading,
  generateBiometricHash
} from '../services/nadiReadingService';
import { useAuth } from '../contexts/AuthContext';
import { saveReadingToHistory } from '../services/readingHistoryService';

const STATUS_MESSAGES = {
  en: [
    "Consulting the sacred palm leaf archives...",
    "Translating from ancient Tamil script...",
    "Cross-referencing with Rishi Agastya's predictions...",
    "Decoding the eternal patterns...",
    "Accessing the Akashic records...",
    "Finalizing divine revelations..."
  ],
  hi: [
    "पवित्र ताड़पत्र अभिलेखागार से परामर्श...",
    "प्राचीन तमिल लिपि से अनुवाद...",
    "ऋषि अगस्त्य की भविष्यवाणियों से मिलान...",
    "शाश्वत पैटर्न को डिकोड करना...",
    "आकाशिक रिकॉर्ड तक पहुँच...",
    "दिव्य रहस्योद्घाटन को अंतिम रूप देना..."
  ],
  'en-hi': [
    "Sacred palm leaf archives se consult ho raha hai...",
    "Ancient Tamil script se translate ho raha hai...",
    "Rishi Agastya ki predictions se cross-check ho raha hai...",
    "Eternal patterns decode ho rahe hain...",
    "Akashic records access ho rahe hain...",
    "Divine revelations finalize ho rahi hain..."
  ]
};

export default function PalmistryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [state, setState] = useState('idle');
  const [showHistory, setShowHistory] = useState(false);
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('nadi_lang') || 'en';
  });

  const [userInfo, setUserInfo] = useState(() => {
    const saved = localStorage.getItem('nadi_user_info');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migrate old ageRange to dob if needed
      if (parsed.ageRange && !parsed.dob) {
        return { ...parsed, dob: '', age: '' };
      }
      return parsed;
    }
    return { name: '', gender: 'male', dob: '', age: '' };
  });

  // Calculate age from DOB
  const calculateAge = (dob) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age > 0 ? age : '';
  };

  // Get age range for API (derived from DOB or age)
  const getAgeRange = () => {
    const age = userInfo.dob ? calculateAge(userInfo.dob) : parseInt(userInfo.age) || 25;
    if (age < 18) return '18-20';
    if (age <= 20) return '18-20';
    if (age <= 25) return '21-25';
    if (age <= 30) return '26-30';
    if (age <= 35) return '31-35';
    if (age <= 40) return '36-40';
    if (age <= 45) return '41-45';
    if (age <= 50) return '46-50';
    if (age <= 55) return '51-55';
    if (age <= 60) return '56-60';
    if (age <= 65) return '61-65';
    if (age <= 70) return '66-70';
    return '71+';
  };

  // Language options
  const languages = [
    { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🏛️' },
    { code: 'sa', name: 'Sanskrit', native: 'संस्कृत', flag: '🕉️' }
  ];

  const [images, setImages] = useState({ fullHand: null, palm: null, thumb: null });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [statusIdx, setStatusIdx] = useState(0);

  // Quality assessment state
  const [thumbMetadata, setThumbMetadata] = useState(null);
  const [fullHandValidation, setFullHandValidation] = useState(null);

  // Reading session tracking
  const [readingSessionId, setReadingSessionId] = useState(null);
  const [classificationId, setClassificationId] = useState(null);
  const [bundleInfo, setBundleInfo] = useState(null);
  const [currentBiometricHash, setCurrentBiometricHash] = useState(null);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('nadi_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('nadi_user_info', JSON.stringify(userInfo));
  }, [userInfo]);

  // Layer 1: Full Hand Capture (MANDATORY for relative finger analysis)
  const handleFullHandCapture = (image, validation) => {
    setImages(prev => ({ ...prev, fullHand: image }));
    setFullHandValidation(validation);

    console.log('🖐️ Full Hand Capture:', {
      passed: validation.passed,
      score: validation.score,
      fingersDetected: validation.checks.find(c => c.name === 'all_fingers_visible')?.score || 0
    });

    // Proceed to Layer 2: Palm detail capture
    setState('capturing_palm');
  };

  // Layer 2: Palm Detail Capture
  const handlePalmCapture = (image) => {
    setImages(prev => ({ ...prev, palm: image }));
    setState('capturing_thumb');
  };

  const handleThumbCapture = async (image) => {
    setImages(prev => ({ ...prev, thumb: image }));

    // Generate deterministic bundle/leaf numbers
    const palmHash = images.palm;
    const thumbHash = image;
    const generatedBundleInfo = generateBundleAndLeaf(palmHash, thumbHash);
    setBundleInfo(generatedBundleInfo);

    // Preprocess thumbprint for quality assessment (background, non-blocking)
    try {
      const metadata = await preprocessThumbprint(image);
      setThumbMetadata(metadata);

      console.log('📊 Thumbprint Analysis:', {
        quality: metadata.quality.score,
        pattern: metadata.estimatedPattern,
        features: metadata.features
      });

      // Generate biometric hash and save to database (background)
      const biometricHash = await generateBiometricHash(thumbHash);
      setCurrentBiometricHash(biometricHash);
      const savedClassification = await saveThumbprintClassification(
        metadata,
        generatedBundleInfo.bundleNumber,
        biometricHash
      );

      if (savedClassification) {
        setClassificationId(savedClassification.id);
        console.log('✅ Thumbprint classification saved to database');
      }

      // Create reading session in database
      const session = await createReadingSession(
        savedClassification?.id || null,
        userInfo,
        generatedBundleInfo.bundleNumber,
        lang
      );

      if (session) {
        setReadingSessionId(session.id);
        console.log('✅ Reading session created:', session.id);
      }
    } catch (err) {
      console.error('Thumbprint preprocessing error (continuing anyway):', err);
    }

    // Go directly to analyzing - skip verification questions
    setState('analyzing');
  };

  useEffect(() => {
    let interval;
    if (state === 'analyzing') {
      interval = window.setInterval(() => {
        const activeMessages = STATUS_MESSAGES[lang] || STATUS_MESSAGES.en;
        setStatusIdx(prev => (prev + 1) % activeMessages.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [state, lang]);

  const getFriendlyErrorMessage = (err) => {
    const msg = err?.message?.toLowerCase() || "";

    if (msg.includes("api_key") || msg.includes("key not found")) {
      return lang === 'en'
        ? "Access Denied: The divine key (API Key) is missing or invalid. Please ensure the environment is correctly configured."
        : "पहुँच अस्वीकृत: दिव्य कुंजी (API Key) गायब या अमान्य है। कृपया सुनिश्चित करें कि वातावरण सही ढंग से कॉन्फ़िगर किया गया है।";
    }
    if (msg.includes("safety") || msg.includes("blocked")) {
      return lang === 'en'
        ? "Celestial Shield: The analysis was halted by safety filters. Please ensure the images clearly show palm/thumb patterns without obscured content."
        : "दिव्य कवच: सुरक्षा फिल्टर द्वारा विश्लेषण रोक दिया गया था। कृपया सुनिश्चित करें कि चित्र बिना किसी बाधा के हथेली/अंगूठे के पैटर्न को स्पष्ट रूप से दिखाते हैं।";
    }
    if (msg.includes("quota") || msg.includes("429") || msg.includes("rate limit")) {
      return lang === 'en'
        ? "Cosmic Congestion: Too many seekers are accessing the records at once. Please wait a moment for the cosmic energy to replenish."
        : "लौकिक भीड़: एक साथ बहुत सारे साधक रिकॉर्ड तक पहुँच रहे हैं। कृपया लौकिक ऊर्जा के पुनर्भरण के लिए कुछ क्षण प्रतीक्षा करें।";
    }
    if (msg.includes("network") || msg.includes("fetch") || msg.includes("failed to fetch")) {
      return lang === 'en'
        ? "Astral Disconnect: Unable to reach the Akashic servers. Check your internet connection and try again."
        : "आकाशीय वियोग: आकाशिक सर्वर तक पहुँचने में असमर्थ। अपना इंटरनेट कनेक्शन जांचें और पुनः प्रयास करें।";
    }

    return lang === 'en'
      ? "Divine Interference: An unexpected error occurred during the reading. Please re-scan your patterns."
      : "दिव्य हस्तक्षेप: पाठ के दौरान एक अप्रत्याशित त्रुटि हुई। कृपया अपने पैटर्न को फिर से स्कैन करें।";
  };

  useEffect(() => {
    if (state === 'analyzing' && images.palm && images.thumb) {
      (async () => {
        try {
          const data = await analyzeNadiPatterns(
            images.palm,
            images.thumb,
            { ...userInfo, ageRange: getAgeRange() },
            images.fullHand || undefined  // Pass full-hand image for finger ratio validation
          );

          // Add bundle/leaf info to the result
          const enrichedData = {
            ...data,
            bundleInfo: bundleInfo
          };

          // Save complete reading to database
          if (readingSessionId && bundleInfo) {
            await completeReading(
              readingSessionId,
              data,
              {
                bundleNumber: bundleInfo.bundleNumber,
                leafNumber: bundleInfo.leafNumber
              }
            );
            console.log('✅ Reading completed and saved to database');
          }

          // Save to reading history for tracking and comparison
          if (user?.id && currentBiometricHash) {
            await saveReadingToHistory(
              user.id,
              currentBiometricHash,
              data,
              { gender: userInfo.gender, ageRange: getAgeRange() }
            );
            console.log('✅ Reading saved to history for tracking');
          }

          setResult(enrichedData);
          setState('result');
          setError(null);
        } catch (err) {
          console.error("Analysis Error:", err);
          setError(getFriendlyErrorMessage(err));
          setState('idle');
        }
      })();
    }
  }, [state, images, userInfo, lang, bundleInfo]);

  const reset = () => {
    setState('idle');
    setImages({ fullHand: null, palm: null, thumb: null });
    setResult(null);
    setError(null);
    setBundleInfo(null);
    setThumbMetadata(null);
    setFullHandValidation(null);
    setReadingSessionId(null);
    setClassificationId(null);
    setCurrentBiometricHash(null);
  };

  return (
    <CosmicBackground density={160} useVideo={true}>
      <div className="min-h-screen relative text-slate-100 flex flex-col font-sans">
        {/* Background Orbs - Cyan/Blue theme to match app */}
        <div className="fixed inset-0 pointer-events-none opacity-40 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-900/20 blur-[200px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[200px] rounded-full"></div>
        </div>

        {/* Back Button - Hide when showing results (AnalysisDisplay has its own) */}
        {state !== 'result' && (
          <div className="relative z-10 flex justify-start items-center mb-6 px-6 pt-6">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              onClick={() => navigate("/")}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-4 py-2 rounded-md text-sm font-medium transition duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </motion.button>
          </div>
        )}

        {/* Header - Hide when showing results (AnalysisDisplay has its own) */}
        {state !== 'result' && (
          <header className="relative z-20 pt-8 px-6 flex flex-col items-center">
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-none mb-4 text-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">KarmAnk</span>
              <span className="text-white">™</span>
            </h1>
            <p className="text-cyan-300/70 uppercase tracking-[0.4em] text-[10px] font-black">
              {lang === 'en' ? 'NADI PALMISTRY SYSTEM' : lang === 'hi' ? 'नाडी हस्तरेखा प्रणाली' : 'NADI PALMISTRY SYSTEM'}
            </p>
          </header>
        )}

        <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 pb-24">
          {state === 'idle' && !showHistory && (
            <div className="text-center space-y-12 animate-in fade-in zoom-in duration-1000">
              {error && (
                <div className="p-8 bg-red-950/30 border border-red-500/30 rounded-[2.5rem] text-red-100 max-w-xl mx-auto mb-10 backdrop-blur-xl shadow-2xl">
                  <div className="flex flex-col items-center gap-4">
                     <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-xl animate-pulse">!</div>
                     <p className="text-lg font-light italic leading-relaxed">{error}</p>
                     <button
                       onClick={() => setError(null)}
                       className="mt-4 px-6 py-2 bg-red-500/20 hover:bg-red-500/40 border border-red-500/40 rounded-full text-[9px] font-black uppercase tracking-widest transition-all"
                     >
                       {lang === 'en' ? "Dismiss" : "खारिज करें"}
                     </button>
                  </div>
                </div>
              )}
              <button
                onClick={() => setState('onboarding')}
                className="px-20 py-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-[3rem] font-black text-2xl shadow-[0_0_50px_rgba(6,182,212,0.4)] hover:shadow-[0_0_80px_rgba(6,182,212,0.6)] hover:scale-105 active:scale-95 transition-all text-white uppercase tracking-widest"
              >
                {lang === 'en' ? 'Begin Palm Reading' : 'हस्तरेखा पढ़ना शुरू करें'}
              </button>
              <p className="text-cyan-500/60 text-[9px] uppercase tracking-widest font-black">{lang === 'en' ? 'Ancient Nadi Wisdom • Modern Precision' : 'प्राचीन नाडी ज्ञान • आधुनिक सटीकता'}</p>

              {/* History Button */}
              {user && (
                <button
                  onClick={() => setShowHistory(true)}
                  className="flex items-center gap-2 mx-auto px-6 py-3 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-600 rounded-2xl text-slate-300 hover:text-white transition-all mt-8"
                >
                  <History className="h-5 w-5" />
                  <span className="text-sm font-medium">{lang === 'en' ? 'View Reading History' : 'पठन इतिहास देखें'}</span>
                </button>
              )}
            </div>
          )}

          {/* Reading History Panel */}
          {state === 'idle' && showHistory && user && (
            <div className="w-full max-w-2xl animate-in slide-in-from-bottom-10 duration-500">
              <ReadingHistoryPanel
                userId={user.id}
                lang={lang}
                onClose={() => setShowHistory(false)}
              />
            </div>
          )}

          {state === 'onboarding' && (
            <div className="w-full max-w-2xl bg-gray-900/60 backdrop-blur-3xl p-12 md:p-16 rounded-3xl border border-cyan-500/20 shadow-2xl space-y-8 animate-in slide-in-from-bottom-10 duration-500">
              <h2 className="text-3xl font-black text-white text-center uppercase tracking-wide">{lang === 'en' ? 'Your Profile' : lang === 'hi' ? 'आपकी प्रोफ़ाइल' : lang === 'ta' ? 'உங்கள் சுயவிவரம்' : 'भवतः परिचयः'}</h2>
              <div className="space-y-5">
                {/* Language Selector */}
                <div>
                  <label className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    {lang === 'en' ? 'Language' : lang === 'hi' ? 'भाषा' : lang === 'ta' ? 'மொழி' : 'भाषा'}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {languages.map(l => (
                      <button
                        key={l.code}
                        onClick={() => setLang(l.code)}
                        className={`py-3 px-2 rounded-xl font-bold text-xs border-2 transition-all flex flex-col items-center gap-1 ${
                          lang === l.code
                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                            : 'border-slate-700 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-300'
                        }`}
                      >
                        <span className="text-lg">{l.flag}</span>
                        <span className="truncate w-full text-center">{l.native}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name Field */}
                <div>
                  <label className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2 block">{lang === 'en' ? 'Your Name' : lang === 'hi' ? 'आपका नाम' : lang === 'ta' ? 'உங்கள் பெயர்' : 'भवतः नाम'}</label>
                  <input
                    type="text"
                    value={userInfo.name || ''}
                    onChange={(e) => setUserInfo(p => ({ ...p, name: e.target.value }))}
                    placeholder={lang === 'en' ? 'Enter your name' : lang === 'hi' ? 'अपना नाम दर्ज करें' : lang === 'ta' ? 'உங்கள் பெயரை உள்ளிடவும்' : 'नाम प्रविष्टयतु'}
                    className="w-full py-4 bg-slate-950 border-2 border-slate-700 rounded-2xl px-6 text-white font-medium appearance-none outline-none focus:border-cyan-500 text-lg transition-all placeholder:text-slate-600"
                  />
                </div>

                {/* Gender Field */}
                <div>
                  <label className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2 block">{lang === 'en' ? 'Gender' : lang === 'hi' ? 'लिंग' : lang === 'ta' ? 'பாலினம்' : 'लिङ्गम्'}</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['male', 'female', 'other'].map(g => (
                      <button key={g} onClick={() => setUserInfo(p => ({ ...p, gender: g }))} className={`py-4 rounded-2xl font-bold uppercase text-xs border-2 transition-all ${userInfo.gender === g ? 'bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'border-slate-700 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-300'}`}>
                        {lang === 'en' ? g : lang === 'hi' ? (g === 'male' ? 'पुरुष' : g === 'female' ? 'महिला' : 'अन्य') : lang === 'ta' ? (g === 'male' ? 'ஆண்' : g === 'female' ? 'பெண்' : 'மற்றவை') : (g === 'male' ? 'पुरुषः' : g === 'female' ? 'स्त्री' : 'अन्यः')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date of Birth / Age Field */}
                <div>
                  <label className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {lang === 'en' ? 'Date of Birth / Age' : lang === 'hi' ? 'जन्म तिथि / आयु' : lang === 'ta' ? 'பிறந்த தேதி / வயது' : 'जन्मतिथिः / वयः'}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {/* DOB Input */}
                    <div className="relative">
                      <input
                        type="date"
                        value={userInfo.dob || ''}
                        onChange={(e) => setUserInfo(p => ({ ...p, dob: e.target.value, age: '' }))}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full py-4 bg-slate-950 border-2 border-slate-700 rounded-2xl px-6 text-white font-medium appearance-none outline-none focus:border-cyan-500 text-base transition-all [color-scheme:dark]"
                      />
                      <span className="absolute left-6 top-1 text-[9px] text-slate-500 uppercase">{lang === 'en' ? 'DOB' : lang === 'hi' ? 'जन्म तिथि' : 'DOB'}</span>
                    </div>
                    {/* Age Input (alternative) */}
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={userInfo.dob ? calculateAge(userInfo.dob) : (userInfo.age || '')}
                        onChange={(e) => setUserInfo(p => ({ ...p, age: e.target.value, dob: '' }))}
                        placeholder="25"
                        disabled={!!userInfo.dob}
                        className="w-full py-4 bg-slate-950 border-2 border-slate-700 rounded-2xl px-6 text-white font-medium appearance-none outline-none focus:border-cyan-500 text-base transition-all placeholder:text-slate-600 disabled:bg-slate-900 disabled:text-cyan-400"
                      />
                      <span className="absolute left-6 top-1 text-[9px] text-slate-500 uppercase">{lang === 'en' ? 'Age' : lang === 'hi' ? 'आयु' : 'Age'}</span>
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 text-sm">{lang === 'en' ? 'years' : lang === 'hi' ? 'वर्ष' : 'yrs'}</span>
                    </div>
                  </div>
                  <p className="text-slate-500 text-[10px] mt-2 italic">
                    {lang === 'en' ? 'Enter DOB for precise timing calculations, or just your age' : lang === 'hi' ? 'सटीक समय गणना के लिए जन्म तिथि दर्ज करें, या केवल आयु' : 'Enter DOB or age'}
                  </p>
                </div>

                <button onClick={() => setState('capturing_full_hand')} className="w-full py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all shadow-xl mt-4">
                  <span className="flex items-center justify-center gap-2">
                    <Layers className="w-5 h-5" />
                    {lang === 'en' ? 'Start Two-Layer Scan' : lang === 'hi' ? 'दो-स्तरीय स्कैन शुरू करें' : lang === 'ta' ? 'இரு-அடுக்கு ஸ்கேன் தொடங்கு' : 'द्विस्तरीय स्कैनं आरभतु'}
                  </span>
                </button>
                <p className="text-cyan-500/40 text-[8px] uppercase tracking-wider mt-2 text-center">{lang === 'en' ? 'Full Hand → Palm → Thumb (77% more accurate)' : lang === 'hi' ? 'पूर्ण हस्त → हथेली → अंगूठा (77% अधिक सटीक)' : 'Full Hand → Palm → Thumb (77% accurate)'}</p>
              </div>
            </div>
          )}

          {/* Layer 1: Full Hand Capture (MANDATORY) */}
          {state === 'capturing_full_hand' && (
            <div className="w-full max-w-lg animate-in slide-in-from-bottom-10 duration-500">
              {/* Progress indicator */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="flex items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold text-sm">1</div>
                  <span className="text-cyan-400 text-xs font-bold uppercase">{lang === 'en' ? 'Full Hand' : 'पूर्ण हस्त'}</span>
                </div>
                <div className="w-8 h-0.5 bg-slate-700"></div>
                <div className="flex items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-500 font-bold text-sm">2</div>
                  <span className="text-slate-500 text-xs font-bold uppercase">{lang === 'en' ? 'Palm' : 'हथेली'}</span>
                </div>
                <div className="w-8 h-0.5 bg-slate-700"></div>
                <div className="flex items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-500 font-bold text-sm">3</div>
                  <span className="text-slate-500 text-xs font-bold uppercase">{lang === 'en' ? 'Thumb' : 'अंगूठा'}</span>
                </div>
              </div>

              <FullHandCapture
                onCapture={handleFullHandCapture}
                lang={lang}
                onSkip={() => setState('capturing_palm')}
              />
            </div>
          )}

          {/* Layer 2: Palm and Thumb Capture */}
          {(state === 'capturing_palm' || state === 'capturing_thumb') && (
            <div className="w-full max-w-lg animate-in slide-in-from-bottom-10 duration-500">
              {/* Progress indicator */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="flex items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">✓</div>
                  <span className="text-emerald-400 text-xs font-bold uppercase">{lang === 'en' ? 'Full Hand' : 'पूर्ण हस्त'}</span>
                </div>
                <div className="w-8 h-0.5 bg-emerald-500"></div>
                <div className="flex items-center gap-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${state === 'capturing_palm' ? 'bg-cyan-500 text-white' : 'bg-emerald-500 text-white'}`}>
                    {state === 'capturing_palm' ? '2' : '✓'}
                  </div>
                  <span className={`text-xs font-bold uppercase ${state === 'capturing_palm' ? 'text-cyan-400' : 'text-emerald-400'}`}>{lang === 'en' ? 'Palm' : 'हथेली'}</span>
                </div>
                <div className={`w-8 h-0.5 ${state === 'capturing_thumb' ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                <div className="flex items-center gap-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${state === 'capturing_thumb' ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-500'}`}>3</div>
                  <span className={`text-xs font-bold uppercase ${state === 'capturing_thumb' ? 'text-cyan-400' : 'text-slate-500'}`}>{lang === 'en' ? 'Thumb' : 'अंगूठा'}</span>
                </div>
              </div>

              <CameraCapture
                mode={state === 'capturing_palm' ? 'palm' : 'thumb'}
                label={state === 'capturing_palm' ? (lang === 'en' ? "Palm Detail Scan" : "हथेली विस्तृत स्कैन") : (lang === 'en' ? "Thumb Impression" : "अंगूठे की छाप")}
                instruction={state === 'capturing_palm' ? `Align your ${userInfo.gender === 'male' ? 'Right' : 'Left'} palm within the guides.` : "Place thumb swirl in the center of the target."}
                onCapture={state === 'capturing_palm' ? handlePalmCapture : handleThumbCapture}
              />
            </div>
          )}

          {state === 'analyzing' && (
            <div className="text-center space-y-12 animate-pulse">
              <div className="relative">
                <div className="text-8xl mb-6 relative z-10">🔮</div>
                <div className="absolute inset-0 bg-cyan-500/20 blur-[60px] rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-4 max-w-xl mx-auto">
                <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 tracking-tight leading-tight">{(STATUS_MESSAGES[lang] || STATUS_MESSAGES.en)[statusIdx]}</h3>
                <p className="text-cyan-400/70 text-[10px] font-black uppercase tracking-[0.3em]">{lang === 'en' ? 'Decoding Sacred Patterns' : 'पवित्र पैटर्न को डिकोड किया जा रहा है'}</p>
              </div>
            </div>
          )}

          {state === 'result' && result && (
            <AnalysisDisplay
              data={result}
              onReset={reset}
              lang={lang}
              onLanguageChange={setLang}
              palmImage={images.palm}
              userName={userInfo.name}
            />
          )}
        </main>
      </div>
    </CosmicBackground>
  );
}
