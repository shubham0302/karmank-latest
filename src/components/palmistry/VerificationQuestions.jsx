import React from 'react';
import { motion } from 'framer-motion';

/**
 * Verification Questions Component
 * Displays the traditional Nadi verification process
 */
export default function VerificationQuestions({
  question,
  questionNumber,
  totalQuestions,
  confidence,
  bundleInfo,
  onAnswer,
  lang = 'en'
}) {
  const handleAnswer = (answer) => {
    onAnswer(answer);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in duration-700">
      {/* Bundle Information Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/60 backdrop-blur-3xl p-8 rounded-[3rem] border border-amber-500/30 shadow-2xl"
      >
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-amber-500/10 border border-amber-500/30 rounded-full">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-black text-amber-500 uppercase tracking-[0.3em]">
              {lang === 'en' ? 'Leaf Verification Process' : 'पत्ती सत्यापन प्रक्रिया'}
            </span>
          </div>

          <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
            {lang === 'en' ? 'Bundle' : 'बंडल'}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-red-600">
              {bundleInfo.bundleNumber}
            </span>
          </h2>

          <p className="text-slate-400 text-sm font-medium">
            {lang === 'en'
              ? `Recorded by Rishi ${bundleInfo.rishi} • ${bundleInfo.totalLeaves} leaves remaining`
              : `ऋषि ${bundleInfo.rishi} द्वारा रिकॉर्ड किया गया • ${bundleInfo.totalLeaves} पत्तियां शेष`
            }
          </p>

          {/* Progress Bar */}
          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-slate-400">
              <span>
                {lang === 'en' ? 'Match Confidence' : 'मिलान विश्वास'}
              </span>
              <span className="text-amber-500">{confidence}%</span>
            </div>
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${confidence}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-amber-600 to-red-600 shadow-[0_0_20px_rgba(217,119,6,0.4)]"
              />
            </div>
            <div className="text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
              {lang === 'en'
                ? `Question ${questionNumber} of ${totalQuestions}`
                : `प्रश्न ${questionNumber} का ${totalQuestions}`
              }
            </div>
          </div>
        </div>
      </motion.div>

      {/* Question Card */}
      <motion.div
        key={question.id}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-3xl p-12 rounded-[3rem] border border-amber-500/20 shadow-2xl"
      >
        <div className="space-y-8">
          {/* Question Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="text-8xl">🔮</div>
              <div className="absolute inset-0 bg-amber-500/20 blur-[60px] rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Question Text */}
          <div className="text-center space-y-4">
            <div className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">
              {lang === 'en' ? 'As Written in the Sacred Leaf' : 'पवित्र पत्ती में लिखे अनुसार'}
            </div>
            <h3 className="text-2xl md:text-3xl font-light text-white leading-relaxed px-4">
              {question.text[lang]}
            </h3>
          </div>

          {/* Answer Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer('yes')}
              className="py-6 px-8 bg-gradient-to-r from-green-600/20 to-emerald-600/20 hover:from-green-600/40 hover:to-emerald-600/40 border-2 border-green-500/50 rounded-2xl text-white font-black text-lg uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(34,197,94,0.2)] hover:shadow-[0_0_40px_rgba(34,197,94,0.4)]"
            >
              ✓ {lang === 'en' ? 'Yes' : 'हाँ'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer('no')}
              className="py-6 px-8 bg-gradient-to-r from-red-600/20 to-rose-600/20 hover:from-red-600/40 hover:to-rose-600/40 border-2 border-red-500/50 rounded-2xl text-white font-black text-lg uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(239,68,68,0.2)] hover:shadow-[0_0_40px_rgba(239,68,68,0.4)]"
            >
              ✗ {lang === 'en' ? 'No' : 'नहीं'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer('skip')}
              className="py-6 px-8 bg-gradient-to-r from-slate-600/20 to-slate-700/20 hover:from-slate-600/40 hover:to-slate-700/40 border-2 border-slate-500/50 rounded-2xl text-white font-black text-lg uppercase tracking-wider transition-all"
            >
              → {lang === 'en' ? 'Skip' : 'छोड़ें'}
            </motion.button>
          </div>

          {/* Help Text */}
          <div className="text-center mt-6">
            <p className="text-slate-500 text-xs font-medium italic">
              {lang === 'en'
                ? 'Answer truthfully as these details were written in your leaf thousands of years ago'
                : 'सच्चाई से उत्तर दें क्योंकि ये विवरण हजारों साल पहले आपकी पत्ती में लिखे गए थे'
              }
            </p>
          </div>
        </div>
      </motion.div>

      {/* Mystical Indicators */}
      <div className="flex justify-center gap-2 opacity-50">
        {Array.from({ length: totalQuestions }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all ${
              i < questionNumber - 1
                ? 'bg-amber-500 shadow-[0_0_10px_rgba(217,119,6,0.6)]'
                : i === questionNumber - 1
                ? 'bg-amber-500 animate-pulse scale-125'
                : 'bg-slate-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
