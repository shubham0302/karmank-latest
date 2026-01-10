
import React from 'react';
import { AnalysisOutput, Language } from '../types';
import { SOPHISTICATED_MESSAGING, getRandomCorrelation } from '../../data/sophisticatedMessaging';

interface AnalysisDisplayProps {
  data: AnalysisOutput;
  onReset: () => void;
  lang: Language;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ data, onReset, lang }) => {
  const t = (obj: { en: string; hi: string } | undefined) => {
    if (!obj) return lang === 'en' ? 'Scanning records...' : 'अभिलेख स्कैन किए जा रहे हैं...';
    return obj[lang] || obj.en || '';
  };

  const k = data.kandas;
  const wealth = data.millionaireStatus;
  const progeny = data.progeny;

  const kandaList = [
    { title: lang === 'en' ? "General Essence (K1)" : "सामान्य परिचय (K1)", content: k.general, icon: "🕉️" },
    { title: lang === 'en' ? "Family & Speech (K2)" : "कुटुंब और वाणी (K2)", content: k.familySpeech, icon: "🗣️" },
    { title: lang === 'en' ? "Siblings (K3)" : "भाई और बहन (K3)", content: k.siblings, icon: "👥" },
    { title: lang === 'en' ? "Mother & Comforts (K4)" : "माता और सुख (K4)", content: k.assetsMother, icon: "🏠" },
    { title: lang === 'en' ? "Progeny & Wisdom (K5)" : "संतान और बुद्धि (K5)", content: k.progeny, icon: "👶" },
    { title: lang === 'en' ? "Debts & Enemies (K6)" : "ऋण और शत्रु (K6)", content: k.debtsEnemies, icon: "🛡️" },
    { title: lang === 'en' ? "Union & Marriage (K7)" : "विवाह और साथी (K7)", content: k.union, icon: "💍" },
    { title: lang === 'en' ? "Longevity & Vitality (K8)" : "आयु और स्वास्थ्य (K8)", content: k.longevityHealth, icon: "🌿" },
    { title: lang === 'en' ? "Father & Fortune (K9)" : "पिता और भाग्य (K9)", content: k.fatherFortune, icon: "⚖️" },
    { title: lang === 'en' ? "Career & Honor (K10)" : "करियर और सम्मान (K10)", content: k.career, icon: "🏆" },
    { title: lang === 'en' ? "Profits & Gains (K11)" : "लाभ और प्राप्ति (K11)", content: k.gains, icon: "💰" },
    { title: lang === 'en' ? "Travel & Spirit (K12)" : "विदेश और मोक्ष (K12)", content: k.expenditureTravel, icon: "✈️" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-32 animate-in fade-in slide-in-from-bottom-10 duration-1000 px-4 pb-48">
      {/* 1. Header & Identity */}
      <div className="text-center space-y-12 pt-10">
        {/* Bundle/Leaf Information - NEW */}
        {data.bundleInfo && (
          <div className="mb-8 space-y-4">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-900/30 to-red-900/30 border-2 border-amber-500/40 rounded-2xl shadow-[0_0_30px_rgba(217,119,6,0.3)]">
              <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
              <div className="text-left">
                <div className="text-[9px] font-black text-amber-500/80 uppercase tracking-[0.3em]">
                  {lang === 'en' ? 'Your Sacred Leaf' : 'आपकी पवित्र पत्ती'}
                </div>
                <div className="text-2xl font-black text-amber-400 tracking-tight">
                  Bundle {data.bundleInfo.bundleNumber} • Leaf {data.bundleInfo.leafNumber}
                </div>
                <div className="text-xs text-amber-500/60 font-medium italic">
                  {lang === 'en' ? `Recorded by Rishi ${data.bundleInfo.rishi}` : `ऋषि ${data.bundleInfo.rishi} द्वारा रिकॉर्ड किया गया`}
                </div>
              </div>
              {data.verificationConfidence && (
                <div className="ml-4 pl-4 border-l border-amber-500/30">
                  <div className="text-[9px] font-black text-emerald-500/80 uppercase tracking-[0.2em]">
                    {lang === 'en' ? 'Verified' : 'सत्यापित'}
                  </div>
                  <div className="text-xl font-black text-emerald-400">
                    {data.verificationConfidence}%
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="inline-block px-12 py-3 bg-amber-500/5 border border-amber-500/20 rounded-full text-[10px] font-black tracking-[0.6em] text-amber-500 uppercase">
           Verified Akashic Record • {data.nadiLeafCategory}
        </div>
        <h2 className="text-8xl md:text-[11rem] font-black gradient-text tracking-tighter uppercase italic leading-[0.8] drop-shadow-[0_20px_50px_rgba(251,191,36,0.2)]">
          {lang === 'en' ? "THE\nSCROLL" : "दिव्य\nहस्तलेख"}
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto pt-8">
          {[
            { label: lang === 'en' ? 'Union Epoch' : 'विवाह काल', val: data.marriage.ageRange, color: 'from-amber-400 to-orange-500', icon: '💍' },
            { label: lang === 'en' ? 'Legacy Count' : 'वंश संख्या', val: progeny.count, color: 'from-blue-400 to-indigo-500', icon: '👶' },
            { label: lang === 'en' ? 'Wealth Zenith' : 'धन शिखर', val: wealth.wealthPeakAge, color: 'from-emerald-400 to-teal-500', icon: '💰' },
            { label: lang === 'en' ? 'Cosmic Element' : 'मूल तत्व', val: t(data.handElement), color: 'from-purple-400 to-pink-500', icon: '🌀' },
          ].map((stat, i) => (
            <div key={i} className="relative group overflow-hidden bg-slate-900/40 p-8 rounded-[3rem] border border-slate-800 shadow-2xl transition-all hover:bg-slate-900/60 hover:scale-[1.02] hover:border-slate-700">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-125 duration-500">
                 <span className="text-6xl">{stat.icon}</span>
              </div>
              <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.4em] block mb-2">{stat.label}</span>
              <span className={`text-4xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent italic`}>{stat.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. ENHANCED: The Nadi Leaf Scroll (Life Story) */}
      <section className="relative px-4 md:px-0">
        <div className="bg-[#1a140b] rounded-[4rem] border-2 border-amber-900/30 shadow-[0_0_100px_rgba(0,0,0,1)] relative overflow-hidden group">
          {/* Decorative Scroll Caps */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#2a2215] to-transparent z-10"></div>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#2a2215] to-transparent z-10"></div>
          
          <div className="p-16 md:p-32 space-y-24 relative z-0">
             {/* The Destiny Path SVG */}
             <div className="absolute inset-0 pointer-events-none overflow-visible opacity-20 group-hover:opacity-30 transition-opacity duration-1000">
                <svg className="w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="none">
                  <path d="M50,300 C200,50 400,550 600,300 S800,150 950,450" fill="none" stroke="#d97706" strokeWidth="2" strokeDasharray="8 12" className="animate-[dash-scroll_30s_linear_infinite]" />
                  <circle cx="50" cy="300" r="6" fill="#d97706" className="animate-pulse" />
                  <circle cx="950" cy="450" r="6" fill="#ef4444" />
                </svg>
             </div>

             <div className="text-center space-y-12 max-w-5xl mx-auto relative">
                <div className="inline-flex items-center gap-6 mb-8">
                   <div className="h-px w-16 bg-amber-800"></div>
                   <h3 className="text-amber-500 font-black text-xs uppercase tracking-[1em]">{lang === 'en' ? "THE DECREED JOURNEY" : "विधाता का लेख"}</h3>
                   <div className="h-px w-16 bg-amber-800"></div>
                </div>

                <div className="relative">
                  <p className="text-3xl md:text-5xl font-light italic leading-[1.4] text-amber-50/90 text-justify md:text-center selection:bg-amber-500/30">
                    <span className="text-9xl font-black text-amber-600 float-left mr-6 mt-2 leading-[0.8] drop-shadow-lg">“</span>
                    {t(data.lifeStory)}
                    <span className="text-6xl font-black text-amber-600 inline-block align-bottom ml-2">”</span>
                  </p>
                </div>
             </div>

             {/* Integrated Visual Timeline Nodes */}
             <div className="relative border-t border-amber-900/40 pt-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                   {data.past.milestones.slice(0, 3).map((m, i) => (
                     <div key={i} className="relative p-8 bg-black/40 rounded-3xl border border-amber-900/20 backdrop-blur-sm group/node hover:border-amber-500/40 transition-all">
                        <div className="absolute top-[-20px] left-8 px-4 py-1 bg-amber-600 text-black font-black text-[9px] uppercase tracking-widest rounded-full shadow-lg">
                           {m.period}
                        </div>
                        <h4 className="text-xl font-black text-amber-100 italic mb-2">{t(m.event)}</h4>
                        <p className="text-amber-700/80 text-xs font-medium leading-relaxed uppercase tracking-tighter">{t(m.insight)}</p>
                     </div>
                   ))}
                </div>
             </div>

             <div className="flex flex-col items-center pt-8 opacity-40">
                <div className="w-1 h-16 bg-gradient-to-b from-amber-600 to-transparent"></div>
                <span className="text-[9px] text-amber-800 font-black uppercase tracking-[0.5em] mt-4">Unfolding Eternity</span>
             </div>
          </div>
        </div>
      </section>

      {/* 3. EXPANDED: Millionaire Status & Dhan Yoga Expansion */}
      <section className="relative p-1 bg-gradient-to-br from-yellow-500/40 via-emerald-500/30 to-slate-950 rounded-[5rem] shadow-[0_0_120px_rgba(16,185,129,0.1)]">
        <div className="bg-slate-950/95 backdrop-blur-3xl p-16 md:p-32 rounded-[4.8rem] space-y-24 overflow-hidden relative">
          {/* Background Coins/Sparkles effect */}
          <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-yellow-500/5 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full"></div>

          <div className="text-center space-y-10 relative">
            <div className="flex justify-center gap-6 mb-4">
               {wealth.dhanYogaDetected && (
                 <div className="px-10 py-3 bg-yellow-500/10 border-2 border-yellow-500/40 rounded-full text-yellow-400 font-black text-xs uppercase tracking-[0.5em] animate-[pulse_3s_infinite] shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                    DHAN YOGA ACTIVE
                 </div>
               )}
            </div>
            <h3 className="text-7xl md:text-9xl font-black text-white italic tracking-tighter uppercase leading-[0.85]">
              {lang === 'en' ? "The Vault of\nLakshmi" : "महालक्ष्मी का\nदिव्य कोष"}
            </h3>
            <p className="text-slate-500 text-xs uppercase tracking-[0.8em] font-black">{lang === 'en' ? "PROSPERITY SIGNATURE DECODING" : "समृद्धि संकेत विश्लेषण"}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            {/* Yoga Visualizer */}
            <div className="lg:col-span-4 flex flex-col p-12 bg-slate-900/40 rounded-[4rem] border border-yellow-500/20 shadow-inner group hover:border-yellow-500/50 transition-all duration-700">
               <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
                  <div className="relative">
                    <div className="w-48 h-48 rounded-full border border-yellow-500/20 flex items-center justify-center animate-[spin_20s_linear_infinite]">
                      <div className="w-40 h-40 rounded-full border-2 border-dashed border-yellow-500/40"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <span className="text-6xl font-black text-yellow-500 drop-shadow-[0_0_20px_rgba(234,179,8,0.6)]">{wealth.wealthPeakAge}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest block">{lang === 'en' ? "ZENITH EPOCH" : "शिखर काल"}</span>
                    <p className="text-yellow-100 font-light italic leading-relaxed text-sm">
                      {lang === 'en' ? "The alignment of Saturn & Jupiter marks your material peak." : "शनि और बृहस्पति का संयोग आपके धन शिखर को चिह्नित करता है।"}
                    </p>
                  </div>
               </div>
               <div className="mt-10 pt-10 border-t border-slate-800 flex justify-between items-center text-[10px] font-black tracking-widest uppercase">
                  <span className="text-emerald-500">Stability: High</span>
                  <span className="text-yellow-500">Growth: Exponential</span>
               </div>
            </div>

            {/* Analysis & Windfall Info */}
            <div className="lg:col-span-8 flex flex-col gap-10">
               <div className="flex-1 p-16 bg-gradient-to-br from-emerald-950/20 to-slate-900/40 rounded-[4.5rem] border border-emerald-500/10 relative group hover:border-emerald-500/30 transition-all duration-700">
                  <div className="absolute top-10 left-16 flex items-center gap-4">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,1)]"></div>
                     <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">{lang === 'en' ? "ORACLE INTERPRETATION" : "भविष्यवाणी व्याख्या"}</span>
                  </div>
                  <p className="text-3xl md:text-4xl font-light text-slate-100 italic leading-snug pt-6 first-letter:text-6xl first-letter:text-emerald-500 first-letter:font-black">
                    {t(wealth.analysis)}
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-10 bg-slate-900/60 rounded-[3rem] border border-slate-800 hover:border-yellow-500/20 transition-all">
                     <div className="flex items-center gap-4 mb-6">
                        <span className="text-3xl">🌪️</span>
                        <h4 className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.3em]">{lang === 'en' ? "POTENTIAL WINDFALLS" : "आकस्मिक धन प्राप्ति"}</h4>
                     </div>
                     <p className="text-slate-400 text-sm leading-relaxed italic">
                        {lang === 'en' ? "Sudden opportunities in land acquisition or digital ventures will materialize during your peak year." : "आपके शिखर वर्ष के दौरान भूमि अधिग्रहण या डिजिटल उपक्रमों में अचानक अवसर पैदा होंगे।"}
                     </p>
                  </div>
                  <div className="p-10 bg-slate-900/60 rounded-[3rem] border border-slate-800 hover:border-emerald-500/20 transition-all">
                     <div className="flex items-center gap-4 mb-6">
                        <span className="text-3xl">🌱</span>
                        <h4 className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em]">{lang === 'en' ? "PROSPERITY COUNSEL" : "समृद्धि परामर्श"}</h4>
                     </div>
                     <p className="text-slate-400 text-sm leading-relaxed italic">
                        {lang === 'en' ? "Material wealth is a vessel for your spiritual mission. Investment in education or charity triggers multi-fold gains." : "भौतिक संपदा आपके आध्यात्मिक मिशन का एक साधन है। शिक्षा या दान में निवेश बहुगुणित लाभ देता है।"}
                     </p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: ENHANCED PROGENY SECTION - The Echo of Lineage */}
      <section className="relative p-1 bg-gradient-to-br from-rose-500/30 via-indigo-500/20 to-slate-950 rounded-[5rem]">
         <div className="bg-slate-950/95 backdrop-blur-3xl p-16 md:p-32 rounded-[4.8rem] space-y-24 overflow-hidden relative">
            <div className="text-center space-y-8 relative z-10">
              <h3 className="text-7xl md:text-9xl font-black text-rose-100 italic tracking-tighter uppercase leading-[0.85]">
                {lang === 'en' ? "Echo of\nLineage" : "वंश की\nप्रतिध्वनि"}
              </h3>
              <p className="text-rose-500 text-xs uppercase tracking-[0.8em] font-black">{lang === 'en' ? "DESTINY OF THE NEXT GENERATION" : "अगली पीढ़ी का भाग्य"}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
               {/* Progeny Insight Cards */}
               <div className="p-12 bg-rose-950/20 rounded-[4rem] border border-rose-500/20 space-y-8 group hover:border-rose-500/40 transition-all duration-500 shadow-2xl">
                  <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center text-4xl shadow-inner border border-rose-500/20 group-hover:scale-110 transition-transform">🎓</div>
                  <div className="space-y-4">
                    <h4 className="text-rose-400 font-black text-xs uppercase tracking-widest">{lang === 'en' ? "EDUCATIONAL RADIANCE" : "शैक्षिक चमक"}</h4>
                    <p className="text-rose-50/80 text-xl font-light italic leading-relaxed">
                      {t(progeny.education)}
                    </p>
                  </div>
               </div>

               <div className="p-12 bg-indigo-950/20 rounded-[4rem] border border-indigo-500/20 space-y-8 group hover:border-indigo-500/40 transition-all duration-500 shadow-2xl">
                  <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center text-4xl shadow-inner border border-indigo-500/20 group-hover:scale-110 transition-transform">🎨</div>
                  <div className="space-y-4">
                    <h4 className="text-indigo-400 font-black text-xs uppercase tracking-widest">{lang === 'en' ? "DESTINED TALENTS" : "निर्धारित प्रतिभा"}</h4>
                    <p className="text-indigo-50/80 text-xl font-light italic leading-relaxed">
                      {t(progeny.talents)}
                    </p>
                  </div>
               </div>

               <div className="p-12 bg-teal-950/20 rounded-[4rem] border border-teal-500/20 space-y-8 group hover:border-teal-500/40 transition-all duration-500 shadow-2xl">
                  <div className="w-20 h-20 bg-teal-500/10 rounded-3xl flex items-center justify-center text-4xl shadow-inner border border-teal-500/20 group-hover:scale-110 transition-transform">🌟</div>
                  <div className="space-y-4">
                    <h4 className="text-teal-400 font-black text-xs uppercase tracking-widest">{lang === 'en' ? "OVERALL LIFE PATH" : "समग्र जीवन पथ"}</h4>
                    <p className="text-teal-50/80 text-xl font-light italic leading-relaxed">
                      {t(progeny.lifePath)}
                    </p>
                  </div>
               </div>
            </div>

            <div className="p-16 bg-white/5 rounded-[4rem] border border-white/10 text-center space-y-8">
               <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em]">{lang === 'en' ? "SAGA SUMMARY" : "गाथा सारांश"}</span>
               <p className="text-slate-200 text-3xl font-light italic leading-relaxed max-w-5xl mx-auto">
                 {t(progeny.details)}
               </p>
            </div>

            {/* Background decorative element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_rgba(244,63,94,0.05)_0%,_transparent_60%)] pointer-events-none"></div>
         </div>
      </section>

      {/* 4. PROTECTIVE WARNINGS */}
      <section className="space-y-16">
        <div className="text-center space-y-4">
          <h3 className="text-6xl font-black text-red-500 uppercase italic tracking-tighter leading-none">{lang === 'en' ? "Shield of Counsel" : "सुरक्षा कवच"}</h3>
          <p className="text-slate-500 text-[10px] uppercase tracking-[0.6em] font-black">{lang === 'en' ? "IDENTIFIED ADVERSARIES • MOTIVES • PROTECTION" : "पहचाने गए शत्रु • उद्देश्य • सुरक्षा"}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {data.warnings.map((w, i) => (
            <div key={i} className="relative p-12 bg-slate-900/40 rounded-[4rem] border border-red-500/10 hover:border-red-500/40 transition-all group overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transform group-hover:scale-150 duration-700">
                  <span className="text-8xl font-black text-red-500">!</span>
               </div>
               <div className="relative z-10 space-y-8">
                  <div className="space-y-2">
                    <span className="text-slate-600 text-[9px] font-black uppercase tracking-widest">{lang === 'en' ? "ADVERSARY PERSONA" : "विपक्षी व्यक्तित्व"}</span>
                    <h4 className="text-white font-black text-3xl italic tracking-tight leading-none">{t(w.who)}</h4>
                  </div>
                  <div className="py-6 border-y border-red-500/10">
                    <span className="text-red-500 text-[9px] font-black uppercase tracking-[0.3em] block mb-3">{lang === 'en' ? "THE MOTIVE" : "उद्देश्य"}</span>
                    <p className="text-red-100/70 text-base italic leading-relaxed">{t(w.why)}</p>
                  </div>
                  <div className="pt-2">
                    <p className="text-slate-500 text-sm font-light leading-relaxed">{t(w.advice)}</p>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. The 12 Kandas Grid */}
      <section className="space-y-16">
        <div className="text-center space-y-4">
          <h3 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-none">{lang === 'en' ? "Universal Chapters" : "वैश्विक अध्याय"}</h3>
          <p className="text-slate-500 text-[10px] uppercase tracking-[0.6em] font-black">{lang === 'en' ? "THE 12 KANDAS OF EXISTENCE" : "अस्तित्व के 12 कांड"}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kandaList.map((item, idx) => (
            <div key={idx} className="group p-10 bg-slate-900/20 rounded-[3rem] border border-slate-800/40 hover:bg-slate-900/40 hover:border-amber-500/20 transition-all relative overflow-hidden">
               <div className="absolute -top-4 -right-4 text-7xl opacity-5 group-hover:opacity-10 transform group-hover:rotate-12 transition-all">
                  {item.icon}
               </div>
               <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-950 text-amber-500 text-xs font-black border border-amber-500/20 shadow-inner group-hover:bg-amber-500 group-hover:text-black transition-all">K{idx + 1}</span>
                    <h4 className="font-black text-slate-100 uppercase text-[10px] tracking-widest group-hover:text-amber-500 transition-colors">{item.title}</h4>
                  </div>
                  <p className="text-slate-500 text-[12px] leading-relaxed italic group-hover:text-slate-200 transition-colors">{t(item.content)}</p>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Remedies (Neutralizers) */}
      <section className="relative p-1 bg-gradient-to-br from-emerald-600/30 to-slate-950 rounded-[6rem]">
         <div className="bg-slate-950/95 backdrop-blur-3xl p-16 md:p-32 rounded-[5.8rem] border border-white/5 space-y-24">
            <div className="text-center space-y-8">
              <h3 className="text-7xl font-black text-emerald-400 uppercase italic tracking-tighter leading-none">{lang === 'en' ? "Immutable Neutralizers" : "अपरिवर्तनीय उपचार"}</h3>
              <p className="text-emerald-500/50 text-[10px] uppercase tracking-[0.7em] font-black">{lang === 'en' ? "FIXED SPIRITUAL LAWS FOR BALANCE" : "संतुलन के लिए निश्चित आध्यात्मिक नियम"}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               {data.remedies.map((r, i) => (
                 <div key={i} className="flex flex-col gap-8 p-14 bg-slate-900/40 rounded-[4.5rem] border border-emerald-500/10 hover:border-emerald-500/40 transition-all group relative overflow-hidden">
                    <div className="absolute top-[-20px] right-[-20px] text-8xl opacity-5 group-hover:opacity-10 duration-700 select-none">✨</div>
                    <div className="flex items-center justify-between relative z-10">
                       <span className="px-8 py-3 bg-emerald-500/10 text-emerald-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-emerald-500/20">{t(r.type)}</span>
                       <span className="text-4xl">🔱</span>
                    </div>
                    <div className="space-y-6 relative z-10">
                       <h5 className="text-3xl font-black text-white italic leading-tight">{t(r.action)}</h5>
                       <div className="h-1 w-20 bg-emerald-500/30 rounded-full group-hover:w-full transition-all duration-700"></div>
                       <p className="text-slate-400 text-lg font-light italic leading-relaxed">{t(r.benefit)}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* 7. Final Prophecy Scroll */}
      <div className="relative group p-1 bg-gradient-to-r from-amber-600/60 via-red-600/60 to-purple-600/60 rounded-[6rem] shadow-[0_0_120px_rgba(217,119,6,0.3)]">
        <div className="bg-slate-950 p-24 md:p-40 rounded-[5.8rem] text-center space-y-16 relative overflow-hidden">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(245,158,11,0.05)_0%,_transparent_70%)]"></div>
           <h3 className="text-amber-500 font-black text-xs uppercase tracking-[1.5em] opacity-80 relative z-10">{lang === 'en' ? "THE ULTIMATE DECREE" : "अंतिम भविष्यवाण"}</h3>
           <p className="text-slate-100 text-5xl md:text-[7rem] font-black italic tracking-tighter leading-[0.85] drop-shadow-[0_0_50px_rgba(255,255,255,0.3)] relative z-10 max-w-6xl mx-auto">
             "{t(data.future)}"
           </p>
           <div className="flex justify-center gap-6 pt-12 relative z-10">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,1)] animate-pulse" 
                  style={{animationDelay: `${i*0.3}s`}}
                ></div>
              ))}
           </div>
        </div>
      </div>

      {/* Sophisticated Disclosure Section - NEW */}
      <section className="relative max-w-5xl mx-auto mt-24 mb-16">
        <div className="bg-gradient-to-br from-slate-900/60 to-slate-950/80 backdrop-blur-xl p-12 md:p-16 rounded-[3rem] border border-slate-700/50 shadow-2xl">
          {/* Correlation Insight */}
          <div className="text-center mb-12 pb-8 border-b border-slate-700/50">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full mb-6">
              <span className="text-amber-500 text-2xl">⚡</span>
              <span className="text-[9px] font-black text-amber-500 uppercase tracking-[0.3em]">
                {lang === 'en' ? 'Understanding Your Reading' : 'अपनी पठन को समझना'}
              </span>
            </div>
            <p className="text-slate-300 text-xl md:text-2xl font-light italic leading-relaxed max-w-3xl mx-auto">
              "{getRandomCorrelation(lang)}"
            </p>
          </div>

          {/* Methodology Explanation */}
          <div className="space-y-6">
            <h4 className="text-slate-400 font-black text-sm uppercase tracking-[0.4em] text-center">
              {SOPHISTICATED_MESSAGING.methodology[lang].title}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SOPHISTICATED_MESSAGING.methodology[lang].points.map((point, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-slate-800/30 rounded-2xl border border-slate-700/30">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-amber-500 text-xs font-black">{i + 1}</span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Credibility Markers */}
          <div className="mt-10 pt-8 border-t border-slate-700/50">
            <div className="flex flex-wrap justify-center gap-4">
              {Object.entries(SOPHISTICATED_MESSAGING.credibilityMarkers[lang]).map(([key, value]) => (
                <div key={key} className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-full">
                  <span className="text-slate-500 text-[10px] font-medium tracking-wider">✓ {value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Final Disclosure */}
          <div className="mt-10 text-center">
            <p className="text-slate-500 text-xs leading-relaxed max-w-2xl mx-auto italic">
              {SOPHISTICATED_MESSAGING.disclosure[lang].text}
            </p>
          </div>
        </div>
      </section>

      {/* Action Footer */}
      <div className="flex flex-col items-center space-y-16 pt-12 pb-32">
        <button
          onClick={onReset}
          className="group relative px-48 py-14 bg-white text-black rounded-full font-black text-xs uppercase tracking-[1em] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
        >
          <span className="relative z-10 group-hover:text-white transition-colors duration-500">{lang === 'en' ? "NEW CONSULTATION" : "नई परामर्श"}</span>
          <div className="absolute inset-0 bg-amber-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
        </button>
        <div className="flex flex-col items-center gap-4 opacity-40">
           <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.6em] italic text-center">
             Temporal Sync v9.0 • Akashic Ledger Integrity Verified
           </p>
           <div className="w-1 h-12 bg-gradient-to-b from-slate-500 to-transparent"></div>
        </div>
      </div>

      <style>{`
        @keyframes dash-scroll {
          from { stroke-dashoffset: 1000; }
          to { stroke-dashoffset: 0; }
        }
        .gradient-text {
          background: linear-gradient(135deg, #fbbf24 0%, #ef4444 50%, #d946ef 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
};

export default AnalysisDisplay;
