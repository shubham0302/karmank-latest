import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import CosmicBackground from '../components/CosmicBackground';
import CameraCapture from '../components/palmistry/CameraCapture';
import AnalysisDisplay from '../components/palmistry/AnalysisDisplay';
import VerificationQuestions from '../components/palmistry/VerificationQuestions';
import { analyzeNadiPatterns } from '../services/palmistryService';
import {
  generateVerificationQuestions,
  generateBundleAndLeaf,
  calculateConfidence
} from '../data/verificationQuestions';
import { SOPHISTICATED_MESSAGING, getRandomTagline } from '../data/sophisticatedMessaging';
import { preprocessThumbprint } from '../services/thumbprintPreprocessor';
import {
  saveThumbprintClassification,
  createReadingSession,
  updateReadingProgress,
  saveVerificationQuestion,
  completeReading,
  generateBiometricHash
} from '../services/nadiReadingService';

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
  ]
};

export default function PalmistryPage() {
  const navigate = useNavigate();
  const [state, setState] = useState('idle');
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('nadi_lang') || 'en';
  });

  const [userInfo, setUserInfo] = useState(() => {
    const saved = localStorage.getItem('nadi_user_info');
    return saved ? JSON.parse(saved) : { gender: 'male', ageRange: '26-35' };
  });

  const [images, setImages] = useState({ palm: null, thumb: null });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [statusIdx, setStatusIdx] = useState(0);

  // Quality assessment state
  const [thumbMetadata, setThumbMetadata] = useState(null);
  const [qualityWarning, setQualityWarning] = useState(null);

  // Reading session tracking
  const [readingSessionId, setReadingSessionId] = useState(null);
  const [classificationId, setClassificationId] = useState(null);

  // Verification state
  const [verificationState, setVerificationState] = useState({
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    confidence: 0,
    bundleInfo: null
  });

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('nadi_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('nadi_user_info', JSON.stringify(userInfo));
  }, [userInfo]);

  const handlePalmCapture = (image) => {
    setImages(prev => ({ ...prev, palm: image }));
    setState('capturing_thumb');
  };

  const handleThumbCapture = async (image) => {
    setImages(prev => ({ ...prev, thumb: image }));

    // Preprocess thumbprint for quality assessment
    try {
      const metadata = await preprocessThumbprint(image);
      setThumbMetadata(metadata);

      // Check if quality is acceptable
      if (!metadata.quality.isAcceptable) {
        setQualityWarning({
          score: metadata.quality.score,
          recommendations: metadata.quality.recommendations
        });
        // Allow user to continue anyway after seeing warning
        setTimeout(() => setQualityWarning(null), 5000);
      }

      console.log('📊 Thumbprint Analysis:', {
        quality: metadata.quality.score,
        pattern: metadata.estimatedPattern,
        features: metadata.features
      });

      // Generate deterministic bundle/leaf numbers and questions
      const palmHash = images.palm;
      const thumbHash = image;

      const bundleInfo = generateBundleAndLeaf(palmHash, thumbHash);
      const questions = generateVerificationQuestions(palmHash, thumbHash, userInfo);

      // Generate biometric hash and save to database
      const biometricHash = await generateBiometricHash(thumbHash);
      const savedClassification = await saveThumbprintClassification(
        metadata,
        bundleInfo.bundleNumber,
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
        bundleInfo.bundleNumber,
        lang
      );

      if (session) {
        setReadingSessionId(session.id);
        console.log('✅ Reading session created:', session.id);
      }

      setVerificationState({
        questions,
        currentQuestionIndex: 0,
        answers: [],
        confidence: 45,
        bundleInfo
      });

      setState('classification');
    } catch (err) {
      console.error('Thumbprint preprocessing error:', err);
      // Continue anyway - preprocessing is optional enhancement
      const palmHash = images.palm;
      const thumbHash = image;

      const bundleInfo = generateBundleAndLeaf(palmHash, thumbHash);
      const questions = generateVerificationQuestions(palmHash, thumbHash, userInfo);

      setVerificationState({
        questions,
        currentQuestionIndex: 0,
        answers: [],
        confidence: 45,
        bundleInfo
      });

      setState('classification');
    }
  };

  const handleVerificationAnswer = async (answer) => {
    const currentQuestion = verificationState.questions[verificationState.currentQuestionIndex];
    const newAnswers = [...verificationState.answers, answer];
    const newQuestionIndex = verificationState.currentQuestionIndex + 1;
    const oldConfidence = verificationState.confidence;
    const newConfidence = calculateConfidence(newQuestionIndex, verificationState.questions.length);

    // Save verification question to database
    if (readingSessionId) {
      await saveVerificationQuestion(
        readingSessionId,
        verificationState.currentQuestionIndex,
        currentQuestion.question,
        currentQuestion.type || 'general',
        answer,
        oldConfidence,
        newConfidence
      );

      // Update reading progress
      await updateReadingProgress(readingSessionId, {
        questionsAnswered: newQuestionIndex,
        confidenceScore: newConfidence,
        currentStep: newQuestionIndex >= verificationState.questions.length ? 'analyzing' : 'verification'
      });
    }

    setVerificationState(prev => ({
      ...prev,
      answers: newAnswers,
      currentQuestionIndex: newQuestionIndex,
      confidence: newConfidence
    }));

    // Check if verification complete
    if (newQuestionIndex >= verificationState.questions.length) {
      // Move to analyzing state
      setState('analyzing');
    } else {
      // Stay in verification state (will show next question)
    }
  };

  useEffect(() => {
    let interval;
    if (state === 'analyzing') {
      interval = window.setInterval(() => {
        setStatusIdx(prev => (prev + 1) % STATUS_MESSAGES[lang].length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [state, lang]);

  // Auto-transition from classification to verification
  useEffect(() => {
    if (state === 'classification') {
      const timer = setTimeout(() => {
        setState('verification');
      }, 3000); // 3 second delay to show bundle info
      return () => clearTimeout(timer);
    }
  }, [state]);

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
          const data = await analyzeNadiPatterns(images.palm, images.thumb, userInfo);

          // Add bundle/leaf info to the result
          const enrichedData = {
            ...data,
            bundleInfo: verificationState.bundleInfo,
            verificationConfidence: verificationState.confidence
          };

          // Save complete reading to database
          if (readingSessionId && verificationState.bundleInfo) {
            await completeReading(
              readingSessionId,
              data,
              {
                bundleNumber: verificationState.bundleInfo.bundleNumber,
                leafNumber: verificationState.bundleInfo.leafNumber
              }
            );
            console.log('✅ Reading completed and saved to database');
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
  }, [state, images, userInfo, lang, verificationState.bundleInfo, verificationState.confidence]);

  const reset = () => {
    setState('idle');
    setImages({ palm: null, thumb: null });
    setResult(null);
    setError(null);
    setVerificationState({
      questions: [],
      currentQuestionIndex: 0,
      answers: [],
      confidence: 0,
      bundleInfo: null
    });
  };

  return (
    <CosmicBackground density={160} useVideo={true}>
      <div className="min-h-screen relative text-slate-100 flex flex-col font-sans">
        {/* Background Orbs */}
        <div className="fixed inset-0 pointer-events-none opacity-40 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-900/20 blur-[200px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/20 blur-[200px] rounded-full"></div>
        </div>

        {/* Back Button */}
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

        <header className="relative z-20 pt-8 px-6 flex flex-col items-center">
          <div className="flex bg-slate-900/90 p-2 rounded-2xl border border-slate-800 mb-10 shadow-2xl">
            <button onClick={() => setLang('en')} className={`px-8 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${lang === 'en' ? 'bg-amber-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>ENGLISH</button>
            <button onClick={() => setLang('hi')} className={`px-8 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${lang === 'hi' ? 'bg-amber-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>हिन्दी</button>
          </div>

          <div className="mb-4 px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{getRandomTagline(lang)}</span>
          </div>

          <h1 className="text-7xl md:text-8xl font-black italic tracking-tighter leading-none mb-4">
            {lang === 'en' ? 'KARMIC' : 'कार्मिक'}<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-red-600">{lang === 'en' ? 'BLUEPRINT' : 'खाका'}</span>
          </h1>
          <p className="text-slate-500 uppercase tracking-[0.4em] text-[10px] font-black italic">
            {SOPHISTICATED_MESSAGING.pageSubtitle[lang]}
          </p>
        </header>

        <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 pb-24">
          {state === 'idle' && (
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
                className="px-24 py-10 bg-gradient-to-r from-amber-600 to-red-700 rounded-[4rem] font-black text-3xl shadow-[0_0_50px_rgba(217,119,6,0.4)] hover:shadow-[0_0_80px_rgba(217,119,6,0.6)] hover:scale-105 active:scale-95 transition-all text-white uppercase italic tracking-widest"
              >
                Consult the Records
              </button>
              <p className="text-slate-600 text-[9px] uppercase tracking-widest font-black">Optimized for Speed and Accuracy</p>
            </div>
          )}

          {state === 'onboarding' && (
            <div className="w-full max-w-2xl bg-slate-900/60 backdrop-blur-3xl p-16 rounded-[4rem] border border-amber-500/20 shadow-2xl space-y-12 animate-in slide-in-from-bottom-10 duration-500">
              <h2 className="text-4xl font-black text-white text-center uppercase italic tracking-tighter">Seeker Identity</h2>
              <div className="space-y-8">
                <div className="grid grid-cols-3 gap-4">
                  {['male', 'female', 'other'].map(g => (
                    <button key={g} onClick={() => setUserInfo(p => ({ ...p, gender: g }))} className={`py-6 rounded-3xl font-black uppercase text-xs border-2 transition-all ${userInfo.gender === g ? 'bg-amber-600 border-amber-600 text-white shadow-[0_0_20px_rgba(217,119,6,0.4)]' : 'border-slate-800 text-slate-500 hover:border-slate-600'}`}>{g}</button>
                  ))}
                </div>
                <div className="relative">
                  <select value={userInfo.ageRange} onChange={(e) => setUserInfo(p => ({ ...p, ageRange: e.target.value }))} className="w-full py-7 bg-slate-950 border-2 border-slate-800 rounded-3xl px-10 text-white font-bold appearance-none outline-none focus:border-amber-600 text-lg transition-all">
                    {["18-25", "26-35", "36-45", "46-60", "Over 60"].map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                  <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">▼</div>
                </div>
                <button onClick={() => setState('capturing_palm')} className="w-full py-9 bg-white text-black rounded-[2.5rem] font-black uppercase tracking-[0.4em] hover:bg-amber-500 hover:text-white transition-all shadow-xl">Initiate Scan</button>
              </div>
            </div>
          )}

          {(state === 'capturing_palm' || state === 'capturing_thumb') && (
            <CameraCapture
              mode={state === 'capturing_palm' ? 'palm' : 'thumb'}
              label={state === 'capturing_palm' ? "Varna & Palm Scan" : "Thumb Impression"}
              instruction={state === 'capturing_palm' ? `Align your ${userInfo.gender === 'male' ? 'Right' : 'Left'} palm within the guides.` : "Place thumb swirl in the center of the target."}
              onCapture={state === 'capturing_palm' ? handlePalmCapture : handleThumbCapture}
            />
          )}

          {state === 'classification' && (
            <div className="text-center space-y-16 animate-in fade-in zoom-in duration-700">
              <div className="relative">
                <div className="text-9xl mb-8 relative z-10">🔍</div>
                <div className="absolute inset-0 bg-amber-500/20 blur-[60px] rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-4">
                <h3 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-red-600 uppercase italic tracking-tighter leading-tight max-w-2xl">
                  {lang === 'en'
                    ? 'Thumbprint Pattern Identified'
                    : 'अंगूठे का पैटर्न पहचाना गया'}
                </h3>
                <p className="text-slate-400 text-lg font-light">
                  {lang === 'en'
                    ? `Bundle ${verificationState.bundleInfo?.bundleNumber} located • ${verificationState.bundleInfo?.totalLeaves} potential leaves`
                    : `बंडल ${verificationState.bundleInfo?.bundleNumber} स्थित • ${verificationState.bundleInfo?.totalLeaves} संभावित पत्तियां`}
                </p>
                {thumbMetadata && (
                  <div className="mt-6 p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50 max-w-md mx-auto">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 font-medium">Pattern:</span>
                      <span className="text-amber-400 font-bold capitalize">{thumbMetadata.estimatedPattern}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-slate-500 font-medium">Quality Score:</span>
                      <span className={`font-bold ${thumbMetadata.quality.score >= 70 ? 'text-green-400' : thumbMetadata.quality.score >= 50 ? 'text-yellow-400' : 'text-orange-400'}`}>
                        {thumbMetadata.quality.score}%
                      </span>
                    </div>
                  </div>
                )}
                {qualityWarning && (
                  <div className="mt-4 p-4 bg-orange-950/30 border border-orange-500/30 rounded-xl max-w-md mx-auto">
                    <p className="text-orange-400 text-xs font-bold mb-2">⚠️ Quality Notice</p>
                    <ul className="text-orange-300 text-xs space-y-1">
                      {qualityWarning.recommendations.map((rec, i) => (
                        <li key={i}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mt-8">
                  {lang === 'en' ? 'Preparing Verification Questions...' : 'सत्यापन प्रश्न तैयार हो रहे हैं...'}
                </p>
              </div>
            </div>
          )}

          {state === 'verification' && verificationState.questions.length > 0 && (
            <VerificationQuestions
              question={verificationState.questions[verificationState.currentQuestionIndex]}
              questionNumber={verificationState.currentQuestionIndex + 1}
              totalQuestions={verificationState.questions.length}
              confidence={verificationState.confidence}
              bundleInfo={verificationState.bundleInfo}
              onAnswer={handleVerificationAnswer}
              lang={lang}
            />
          )}

          {state === 'analyzing' && (
            <div className="text-center space-y-16 animate-pulse">
              <div className="relative">
                <div className="text-9xl mb-8 relative z-10">👁️</div>
                <div className="absolute inset-0 bg-amber-500/20 blur-[60px] rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-4">
                <h3 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-red-600 uppercase italic tracking-tighter leading-tight max-w-2xl">{STATUS_MESSAGES[lang][statusIdx]}</h3>
                <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em]">Neural Reasoning Active • High Speed Mode</p>
              </div>
            </div>
          )}

          {state === 'result' && result && <AnalysisDisplay data={result} onReset={reset} lang={lang} />}
        </main>
      </div>
    </CosmicBackground>
  );
}
