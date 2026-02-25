import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft, Home, Settings, Clock, Moon, Sun, Volume2, VolumeX,
  ChevronRight, ChevronDown, Search, BookOpen, Award, TrendingUp,
  Calendar, Target, Sparkles, Heart, CheckCircle, Info, X, BarChart2
} from "lucide-react";
import CosmicBackground from "../components/CosmicBackground";
import { useAuth } from "../contexts/AuthContext";
import { MANTRA_LIBRARY, MANTRA_CATEGORIES, getPopularMantras, getBeginnerMantras, searchMantras, getMantrasByCategory } from "../data/mantraLibrary";
import { useVedicAudio, VEDIC_AUDIO_PRESETS } from "../hooks/useVedicAudio";
import { getMuhurtas, getCurrentMuhurta, getNextAuspiciousMuhurta, getDayInfo, getMoonPhase, formatMuhurtaTime } from "../utils/muhurta";
import { mantraJaapService, initMantraJaapService, ACHIEVEMENTS } from "../services/mantraJaapService";
import { MalaVisualization } from "../components/mantra/MalaVisualization";
import { JaapStatsDashboard } from "../components/mantra/JaapStatsDashboard";
import { PronunciationGuide } from "../components/mantra/PronunciationGuide";

// Constants
const PRESETS = [11, 27, 54, 108, 1008];
const MALA_TYPES = [
  { id: 'rudraksha', name: 'Rudraksha', icon: '📿', color: '#8B4513', bestFor: 'Shiva mantras' },
  { id: 'tulsi', name: 'Tulsi', icon: '🌿', color: '#228B22', bestFor: 'Vishnu mantras' },
  { id: 'sphatik', name: 'Sphatik', icon: '💎', color: '#E0E0E0', bestFor: 'Devi mantras' },
  { id: 'lotus', name: 'Lotus Seed', icon: '🪷', color: '#FFB6C1', bestFor: 'Lakshmi mantras' }
];

const SANKALPA_PURPOSES = [
  { id: 'peace', name: { en: 'Inner Peace', hi: 'आंतरिक शांति' }, icon: '🕊️' },
  { id: 'health', name: { en: 'Health & Healing', hi: 'स्वास्थ्य एवं उपचार' }, icon: '💚' },
  { id: 'prosperity', name: { en: 'Prosperity', hi: 'समृद्धि' }, icon: '💰' },
  { id: 'wisdom', name: { en: 'Wisdom & Knowledge', hi: 'ज्ञान एवं विद्या' }, icon: '📚' },
  { id: 'protection', name: { en: 'Protection', hi: 'सुरक्षा' }, icon: '🛡️' },
  { id: 'relationships', name: { en: 'Relationships', hi: 'संबंध' }, icon: '❤️' },
  { id: 'moksha', name: { en: 'Liberation', hi: 'मोक्ष' }, icon: '🕉️' },
  { id: 'other', name: { en: 'Other', hi: 'अन्य' }, icon: '✨' }
];

// Helpers
function vibrate(ms = 30) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

function useBeadPositions(count = 108, radius = 130) {
  return useMemo(() => {
    const cx = radius;
    const cy = radius;
    const r = radius - 10;
    const arr = [];
    for (let i = 0; i < count; i++) {
      const t = (Math.PI * 2 * i) / count - Math.PI / 2;
      const x = cx + r * Math.cos(t);
      const y = cy + r * Math.sin(t);
      arr.push({ x, y });
    }
    return { cx, cy, r, points: arr };
  }, [count, radius]);
}

// Sub-components
const MantraSelector = ({ isOpen, onClose, onSelect, currentMantraId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewMode, setViewMode] = useState('popular'); // popular, category, search

  const filteredMantras = useMemo(() => {
    if (searchQuery.length > 1) {
      return searchMantras(searchQuery);
    }
    if (selectedCategory) {
      return getMantrasByCategory(selectedCategory);
    }
    if (viewMode === 'beginner') {
      return getBeginnerMantras();
    }
    return getPopularMantras(20);
  }, [searchQuery, selectedCategory, viewMode]);

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-white/20 w-full max-w-2xl max-h-[80vh] overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-amber-400" />
              Mantra Library
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
              <X className="h-5 w-5 text-white/70" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
            <input
              type="text"
              placeholder="Search mantras..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
            />
          </div>

          {/* View Mode Tabs */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {['popular', 'beginner', 'category'].map((mode) => (
              <button
                key={mode}
                onClick={() => { setViewMode(mode); setSelectedCategory(null); }}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition ${
                  viewMode === mode && !selectedCategory
                    ? 'bg-amber-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {mode === 'popular' ? '🔥 Popular' : mode === 'beginner' ? '🌱 Beginner' : '📁 Categories'}
              </button>
            ))}
          </div>

          {/* Categories */}
          {viewMode === 'category' && (
            <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
              {MANTRA_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition ${
                    selectedCategory === cat.id
                      ? 'bg-amber-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {cat.icon} {cat.name.en}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mantra List */}
        <div className="overflow-y-auto max-h-[50vh] p-4 space-y-2">
          {filteredMantras.map((mantra) => (
            <motion.button
              key={mantra.id}
              onClick={() => { onSelect(mantra); onClose(); }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`w-full p-4 rounded-xl border text-left transition ${
                currentMantraId === mantra.id
                  ? 'bg-amber-500/20 border-amber-500/50'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium text-white">{mantra.name.en}</span>
                    {mantra.requiresDiksha && (
                      <span className="px-2 py-0.5 bg-red-500/20 text-red-300 text-xs rounded-full">
                        Diksha Required
                      </span>
                    )}
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      mantra.difficulty === 'beginner' ? 'bg-green-500/20 text-green-300' :
                      mantra.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {mantra.difficulty}
                    </span>
                  </div>
                  <p className="text-amber-300 font-devanagari text-sm mt-1">{mantra.devanagari}</p>
                  <p className="text-white/60 text-xs mt-1 line-clamp-2">{mantra.meaning.en}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-xs text-white/50">🙏 {mantra.devata}</span>
                    <span className="text-xs text-white/50">📿 {mantra.recommendedCounts[0]}</span>
                    <span className="text-xs text-white/50">🌟 {mantra.popularity}/10</span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-white/40" />
              </div>
            </motion.button>
          ))}

          {filteredMantras.length === 0 && (
            <div className="text-center py-8 text-white/50">
              No mantras found. Try a different search.
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const SankalpaFlow = ({ isOpen, onComplete, onSkip, selectedMantra }) => {
  const [step, setStep] = useState(1);
  const [purpose, setPurpose] = useState(null);
  const [customSankalpa, setCustomSankalpa] = useState('');

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 rounded-3xl border border-purple-500/30 w-full max-w-md p-6"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
      >
        {step === 1 && (
          <>
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🙏</div>
              <h2 className="text-xl font-semibold text-white mb-2">Set Your Sankalpa</h2>
              <p className="text-white/70 text-sm">
                A Sankalpa is a sacred intention that focuses your spiritual energy during jaap.
              </p>
            </div>

            {selectedMantra && (
              <div className="bg-white/10 rounded-xl p-3 mb-4">
                <p className="text-amber-300 font-devanagari text-center">{selectedMantra.devanagari}</p>
                <p className="text-white/60 text-xs text-center mt-1">{selectedMantra.viniyoga.en}</p>
              </div>
            )}

            <p className="text-white/80 text-sm mb-3">What is your intention for this jaap?</p>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {SANKALPA_PURPOSES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setPurpose(p); setStep(2); }}
                  className={`p-3 rounded-xl border text-left transition ${
                    purpose?.id === p.id
                      ? 'bg-purple-500/30 border-purple-400'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <span className="text-xl">{p.icon}</span>
                  <p className="text-white text-sm mt-1">{p.name.en}</p>
                  <p className="text-white/50 text-xs">{p.name.hi}</p>
                </button>
              ))}
            </div>

            <button
              onClick={onSkip}
              className="w-full text-center text-white/50 text-sm hover:text-white/70"
            >
              Skip for now
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">{purpose?.icon}</div>
              <h2 className="text-xl font-semibold text-white mb-2">{purpose?.name.en}</h2>
              <p className="text-purple-300">{purpose?.name.hi}</p>
            </div>

            <div className="mb-4">
              <label className="text-white/80 text-sm mb-2 block">
                Write your specific intention (optional):
              </label>
              <textarea
                value={customSankalpa}
                onChange={(e) => setCustomSankalpa(e.target.value)}
                placeholder="E.g., 'May this practice bring peace to my family...'"
                className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 resize-none"
                rows={3}
              />
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mb-4">
              <p className="text-amber-300 text-sm flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                Hold this intention silently in your heart as you begin your jaap.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-2 bg-white/10 text-white rounded-xl"
              >
                Back
              </button>
              <button
                onClick={() => onComplete({ purpose, customSankalpa })}
                className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-medium"
              >
                Begin Jaap 🙏
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

const MuhurtaWidget = ({ muhurtas, currentMuhurta, nextMuhurta }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const dayInfo = getDayInfo();
  const moonPhase = getMoonPhase();

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-amber-400" />
          <span className="text-white text-sm">
            {currentMuhurta ? currentMuhurta.name.en : 'Muhurta'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {currentMuhurta?.quality === 'excellent' && (
            <span className="text-xs text-green-400">✨ Excellent</span>
          )}
          <ChevronDown className={`h-4 w-4 text-white/50 transition ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
              {/* Day Info */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">{dayInfo.weekday.en}</span>
                <span className="text-amber-300">{dayInfo.weekday.hi}</span>
              </div>

              {/* Moon Phase */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60 flex items-center gap-1">
                  <Moon className="h-3 w-3" /> {moonPhase.name.en}
                </span>
                <span className={moonPhase.isAuspicious ? 'text-green-400' : 'text-yellow-400'}>
                  {moonPhase.illumination}% {moonPhase.isAuspicious ? '✓' : '○'}
                </span>
              </div>

              {/* Current/Next Muhurta */}
              {currentMuhurta && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-2">
                  <div className="flex items-center gap-1 text-green-400 text-xs">
                    <CheckCircle className="h-3 w-3" /> Active Now
                  </div>
                  <p className="text-white text-sm font-medium">{currentMuhurta.icon} {currentMuhurta.name.en}</p>
                  <p className="text-white/50 text-xs">
                    Until {formatMuhurtaTime(currentMuhurta.endTime)}
                  </p>
                </div>
              )}

              {nextMuhurta && !currentMuhurta && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2">
                  <div className="flex items-center gap-1 text-amber-400 text-xs">
                    <Clock className="h-3 w-3" /> Next Auspicious
                  </div>
                  <p className="text-white text-sm font-medium">{nextMuhurta.icon} {nextMuhurta.name.en}</p>
                  <p className="text-white/50 text-xs">
                    Starts at {formatMuhurtaTime(nextMuhurta.startTime)}
                  </p>
                </div>
              )}

              {/* Auspicious for today */}
              <div className="text-xs text-white/50 mt-2">
                <span className="text-white/70">Today's auspicious for:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {dayInfo.auspiciousFor.slice(0, 3).map((item, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white/10 rounded-full">{item}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AchievementPopup = ({ achievement, onClose }) => {
  if (!achievement) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gradient-to-br from-amber-900/90 to-orange-900/90 rounded-3xl border border-amber-500/50 p-8 text-center max-w-sm"
        initial={{ scale: 0.5, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 15 }}
      >
        <div className="text-6xl mb-4">{achievement.icon}</div>
        <div className="text-amber-300 text-sm uppercase tracking-wider mb-2">Achievement Unlocked</div>
        <h3 className="text-2xl font-bold text-white mb-1">{achievement.name.en}</h3>
        <p className="text-amber-200 text-sm">{achievement.name.hi}</p>
        <p className="text-white/70 text-sm mt-3">{achievement.description.en}</p>

        <button
          onClick={onClose}
          className="mt-6 px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-medium"
        >
          Continue 🙏
        </button>
      </motion.div>
    </motion.div>
  );
};

// Main Component
export default function MantraJaapPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();

  // State
  const [step, setStep] = useState('select'); // select, sankalpa, jaap, complete
  const [selectedMantra, setSelectedMantra] = useState(null);
  const [target, setTarget] = useState(108);
  const [count, setCount] = useState(0);
  const [mode, setMode] = useState('tap');
  const [showMantraSelector, setShowMantraSelector] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sankalpa, setSankalpa] = useState(null);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [status, setStatus] = useState('');

  // Profile & Stats
  const [profile, setProfile] = useState(null);
  const [streak, setStreak] = useState(0);
  const [newAchievements, setNewAchievements] = useState([]);
  const [currentAchievementPopup, setCurrentAchievementPopup] = useState(null);
  const [showStatsDashboard, setShowStatsDashboard] = useState(false);
  const [selectedMalaType, setSelectedMalaType] = useState('rudraksha');
  const [showPronunciationGuide, setShowPronunciationGuide] = useState(false);

  // Audio
  const audio = useVedicAudio(VEDIC_AUDIO_PRESETS.meditation);
  const [droneType, setDroneType] = useState('om');
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Muhurta
  const [muhurtas, setMuhurtas] = useState([]);
  const [currentMuhurta, setCurrentMuhurta] = useState(null);
  const [nextMuhurta, setNextMuhurta] = useState(null);

  // Recognition refs
  const recognitionRef = useRef(null);
  const lastHitRef = useRef(0);
  const [listening, setListening] = useState(false);

  // Mala visualization
  const bead = useBeadPositions(108, 140);

  // Initialize
  useEffect(() => {
    if (user?.id) {
      initMantraJaapService(user.id);
    }
    loadProfile();
    updateMuhurtas();

    // Planet → primary mantra mapping (from Remedies integration)
    const PLANET_MANTRA_MAP = {
      Sun: 'surya-mantra', Moon: 'chandra-mantra', Mars: 'mangal-mantra',
      Mercury: 'budh-mantra', Jupiter: 'guru-mantra', Venus: 'shukra-mantra',
      Saturn: 'shani-mantra', Rahu: 'rahu-mantra', Ketu: 'ketu-mantra',
    };

    // If navigated from Remedies page with a planet or mantraId
    const incomingMantraId = location.state?.mantraId
      || (location.state?.planet ? PLANET_MANTRA_MAP[location.state.planet] : null);

    const startMantra = incomingMantraId
      ? MANTRA_LIBRARY.find(m => m.id === incomingMantraId)
      : MANTRA_LIBRARY.find(m => m.id === 'gayatri');

    if (startMantra) setSelectedMantra(startMantra);

    // Update muhurtas every minute
    const interval = setInterval(updateMuhurtas, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const loadProfile = async () => {
    try {
      const p = await mantraJaapService.getProfile();
      setProfile(p);
      const s = await mantraJaapService.calculateStreak();
      setStreak(s.current);
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const updateMuhurtas = () => {
    const m = getMuhurtas();
    setMuhurtas(m);
    setCurrentMuhurta(getCurrentMuhurta());
    setNextMuhurta(getNextAuspiciousMuhurta());
  };

  // Handle mantra selection
  const handleMantraSelect = (mantra) => {
    setSelectedMantra(mantra);
    // Set recommended count
    if (mantra.recommendedCounts && mantra.recommendedCounts.length > 0) {
      setTarget(mantra.recommendedCounts[0]);
    }
  };

  // Start jaap
  const handleStartJaap = () => {
    setStep('sankalpa');
  };

  const handleSankalpaComplete = (sankalpaData) => {
    setSankalpa(sankalpaData);
    setStep('jaap');
    setSessionStartTime(new Date());
    setCount(0);

    if (audioEnabled) {
      audio.start(droneType, 0.03);
    }
  };

  const handleSankalpaSkip = () => {
    setSankalpa(null);
    setStep('jaap');
    setSessionStartTime(new Date());
    setCount(0);

    if (audioEnabled) {
      audio.start(droneType, 0.03);
    }
  };

  // Counting
  const incrementCount = useCallback(() => {
    setCount((prev) => {
      const next = prev + 1;
      vibrate(25);

      if (audioEnabled) {
        audio.playCountSound();
      }

      if (next >= target) {
        handleComplete();
      }

      return next;
    });
  }, [target, audioEnabled]);

  // Complete session
  const handleComplete = async () => {
    setStep('complete');
    audio.stop();
    audio.playCompletionBell();

    const endTime = new Date();
    const durationSeconds = sessionStartTime
      ? Math.round((endTime.getTime() - sessionStartTime.getTime()) / 1000)
      : 0;

    try {
      const result = await mantraJaapService.completeSession({
        mantra_id: selectedMantra?.id || 'custom',
        mantra_name: selectedMantra?.name.en || 'Custom Mantra',
        target_count: target,
        actual_count: count + 1, // Include the final count
        duration_seconds: durationSeconds,
        mode,
        completed: true,
        completion_percentage: 100,
        sankalpa: sankalpa?.customSankalpa || sankalpa?.purpose?.name.en,
        muhurta: currentMuhurta?.id,
        moon_phase: getMoonPhase().phase,
        started_at: sessionStartTime?.toISOString() || new Date().toISOString(),
        completed_at: endTime.toISOString()
      });

      setStreak(result.updatedStreak.current);

      if (result.newAchievements.length > 0) {
        setNewAchievements(result.newAchievements);
        setCurrentAchievementPopup(result.newAchievements[0]);
      }

      await loadProfile();
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  };

  // Reset
  const resetSession = () => {
    setStep('select');
    setCount(0);
    setSankalpa(null);
    setSessionStartTime(null);
    audio.stop();
    stopListening();
  };

  // Speech Recognition
  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setStatus("Speech recognition not supported. Try Chrome.");
      return;
    }

    const rec = new SR();
    rec.lang = 'hi-IN';
    rec.continuous = true;
    rec.interimResults = true;

    rec.onstart = () => setStatus("Listening...");
    rec.onerror = (e) => setStatus("Mic error: " + (e.error || "unknown"));
    rec.onend = () => {
      setStatus("Stopped");
      if (listening) {
        try { rec.start(); } catch {}
      }
    };

    rec.onresult = (event) => {
      const results = Array.from(event.results);
      const latest = results[results.length - 1];
      if (!latest) return;

      const now = Date.now();
      // Debounce
      if (now - lastHitRef.current > 800) {
        lastHitRef.current = now;
        incrementCount();
      }
    };

    recognitionRef.current = rec;
    try {
      rec.start();
      setListening(true);
    } catch (e) {
      setStatus("Unable to start mic");
    }
  };

  const stopListening = () => {
    setListening(false);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }
  };

  // Render helpers
  const progress = Math.min(1, count / target);
  const completedBeads = Math.round(108 * progress);

  // Achievement popup handler
  const handleAchievementClose = () => {
    const remaining = newAchievements.slice(1);
    setNewAchievements(remaining);
    setCurrentAchievementPopup(remaining[0] || null);
  };

  return (
    <CosmicBackground density={140}>
      <div className="min-h-screen relative px-4 md:px-6 py-6 overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/")}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400">
                  Mantra Jaap
                </h1>
                <p className="text-white/50 text-xs">Sacred Chanting Practice</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
                🔥 {streak} day{streak !== 1 ? 's' : ''}
              </div>
              <button
                onClick={() => setShowStatsDashboard(true)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition"
                title="View Statistics"
              >
                <BarChart2 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Muhurta Widget */}
          <div className="mb-4">
            <MuhurtaWidget
              muhurtas={muhurtas}
              currentMuhurta={currentMuhurta}
              nextMuhurta={nextMuhurta}
            />
          </div>

          {/* Main Content */}
          {step === 'select' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Mantra Selection */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl border border-white/20 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-medium flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    Selected Mantra
                  </h3>
                  <button
                    onClick={() => setShowMantraSelector(true)}
                    className="text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    Change <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                {selectedMantra ? (
                  <div className="bg-white/5 rounded-2xl p-4">
                    <h4 className="text-lg text-white font-medium">{selectedMantra.name.en}</h4>
                    <p className="text-amber-300 font-devanagari text-xl mt-1">{selectedMantra.devanagari}</p>
                    <p className="text-white/60 text-sm mt-2">{selectedMantra.meaning.en}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="text-xs px-2 py-1 bg-white/10 rounded-full text-white/70">
                        🙏 {selectedMantra.devata}
                      </span>
                      <span className="text-xs px-2 py-1 bg-white/10 rounded-full text-white/70">
                        📿 {selectedMantra.idealMala}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        selectedMantra.difficulty === 'beginner' ? 'bg-green-500/20 text-green-300' :
                        selectedMantra.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {selectedMantra.difficulty}
                      </span>
                      <button
                        onClick={() => setShowPronunciationGuide(true)}
                        className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full hover:bg-purple-500/30 transition"
                      >
                        🔊 Pronunciation
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowMantraSelector(true)}
                    className="w-full py-8 bg-white/5 rounded-2xl border-2 border-dashed border-white/20 text-white/50 hover:bg-white/10 transition"
                  >
                    <BookOpen className="h-8 w-8 mx-auto mb-2" />
                    Select a Mantra
                  </button>
                )}
              </div>

              {/* Target Selection */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl border border-white/20 p-5">
                <h3 className="text-white font-medium flex items-center gap-2 mb-3">
                  <Target className="h-4 w-4 text-amber-400" />
                  Jaap Count
                </h3>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((n) => (
                    <button
                      key={n}
                      onClick={() => setTarget(n)}
                      className={`px-4 py-2 rounded-full border transition ${
                        target === n
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-400"
                          : "bg-white/10 text-white/80 border-white/20 hover:bg-white/20"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                  <input
                    type="number"
                    min={1}
                    className="px-4 py-2 rounded-full border border-white/20 bg-white/10 text-white w-24"
                    value={target}
                    onChange={(e) => setTarget(Math.max(1, Number(e.target.value) || 108))}
                  />
                </div>
              </div>

              {/* Mode Selection */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl border border-white/20 p-5">
                <h3 className="text-white font-medium mb-3">Counting Mode</h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'tap', name: 'Tap', icon: '👆', desc: 'Tap to count' },
                    { id: 'self', name: 'Voice', icon: '🎤', desc: 'Mic recognition' },
                    { id: 'guided', name: 'Guided', icon: '🔊', desc: 'Follow audio' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id)}
                      className={`p-3 rounded-xl border text-center transition ${
                        mode === m.id
                          ? "bg-amber-500/20 border-amber-500/50"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-2xl">{m.icon}</span>
                      <p className="text-white text-sm mt-1">{m.name}</p>
                      <p className="text-white/50 text-xs">{m.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mala Type Selection */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl border border-white/20 p-5">
                <h3 className="text-white font-medium flex items-center gap-2 mb-3">
                  📿 Mala Type
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {MALA_TYPES.map((mala) => (
                    <button
                      key={mala.id}
                      onClick={() => setSelectedMalaType(mala.id)}
                      className={`p-2 rounded-xl border text-center transition ${
                        selectedMalaType === mala.id
                          ? "bg-amber-500/20 border-amber-500/50"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-xl">{mala.icon}</span>
                      <p className="text-white/70 text-xs mt-1">{mala.name}</p>
                    </button>
                  ))}
                </div>
                {selectedMalaType && (
                  <p className="text-white/50 text-xs mt-2 text-center">
                    Best for: {MALA_TYPES.find(m => m.id === selectedMalaType)?.bestFor}
                  </p>
                )}
              </div>

              {/* Audio Settings */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl border border-white/20 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-medium flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-amber-400" />
                    Ambient Sound
                  </h3>
                  <button
                    onClick={() => setAudioEnabled(!audioEnabled)}
                    className={`p-2 rounded-full ${audioEnabled ? 'bg-amber-500/20 text-amber-400' : 'bg-white/10 text-white/50'}`}
                  >
                    {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </button>
                </div>

                {audioEnabled && (
                  <div className="flex gap-2">
                    {[
                      { id: 'om', name: 'Om (432Hz)', icon: '🕉️' },
                      { id: 'tanpura', name: 'Tanpura', icon: '🎵' },
                      { id: 'nature', name: 'Nature', icon: '🌊' },
                      { id: 'tibetan_bowl', name: 'Singing Bowl', icon: '🔔' }
                    ].map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setDroneType(d.id)}
                        className={`flex-1 p-2 rounded-xl border text-center transition ${
                          droneType === d.id
                            ? "bg-amber-500/20 border-amber-500/50"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <span className="text-lg">{d.icon}</span>
                        <p className="text-white/70 text-xs mt-1">{d.name}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Start Button */}
              <button
                onClick={handleStartJaap}
                disabled={!selectedMantra}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Begin Jaap 🙏
              </button>
            </motion.div>
          )}

          {step === 'jaap' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Mantra Display */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl border border-white/20 p-4 text-center">
                <p className="text-amber-300 font-devanagari text-2xl">{selectedMantra?.devanagari}</p>
                <p className="text-white/50 text-sm mt-1">{selectedMantra?.transliteration}</p>
                {sankalpa && (
                  <p className="text-purple-300 text-xs mt-2 italic">
                    {sankalpa.purpose?.icon} {sankalpa.purpose?.name.en}
                  </p>
                )}
              </div>

              {/* Mala Counter */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl border border-white/20 p-5">
                <div className="flex items-center justify-center">
                  <MalaVisualization
                    count={count}
                    target={target}
                    malaType={selectedMalaType}
                    size={300}
                    onBeadClick={mode === 'tap' ? incrementCount : undefined}
                    showProgress={true}
                  />
                </div>

                {/* Controls */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                  {mode === 'tap' && (
                    <button
                      onClick={incrementCount}
                      className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg text-lg font-medium"
                    >
                      📿 Tap Bead
                    </button>
                  )}

                  {mode === 'self' && (
                    <>
                      {!listening ? (
                        <button
                          onClick={startListening}
                          className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                        >
                          🎤 Start Listening
                        </button>
                      ) : (
                        <button
                          onClick={stopListening}
                          className="px-6 py-3 rounded-full bg-red-500/20 border border-red-500/50 text-red-300"
                        >
                          ⏹️ Stop
                        </button>
                      )}
                    </>
                  )}

                  <button
                    onClick={resetSession}
                    className="px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white"
                  >
                    Reset
                  </button>

                  <button
                    onClick={() => setAudioEnabled(!audioEnabled)}
                    className="p-3 rounded-full bg-white/10 border border-white/20 text-white"
                  >
                    {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                  </button>
                </div>

                {status && (
                  <p className="text-center text-amber-300 text-sm mt-3">{status}</p>
                )}
              </div>
            </motion.div>
          )}

          {step === 'complete' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="bg-gradient-to-br from-amber-900/50 to-orange-900/50 backdrop-blur-md rounded-3xl border border-amber-500/30 p-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="text-6xl mb-4"
                >
                  🙏
                </motion.div>

                <h2 className="text-2xl font-bold text-amber-300 mb-2">
                  Jaap Complete!
                </h2>
                <p className="text-white/70">
                  {count + 1} chants of {selectedMantra?.name.en}
                </p>

                <div className="flex items-center justify-center gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-amber-400">{streak}</p>
                    <p className="text-white/50 text-xs">Day Streak</p>
                  </div>
                  <div className="w-px h-12 bg-white/20" />
                  <div className="text-center">
                    <p className="text-3xl font-bold text-amber-400">
                      {profile?.total_lifetime_jaaps || 0}
                    </p>
                    <p className="text-white/50 text-xs">Total Jaaps</p>
                  </div>
                </div>

                {sankalpa && (
                  <div className="mt-4 p-3 bg-white/10 rounded-xl">
                    <p className="text-purple-300 text-sm">
                      {sankalpa.purpose?.icon} Your intention: {sankalpa.purpose?.name.en}
                    </p>
                  </div>
                )}

                <div className="flex gap-3 mt-6 justify-center">
                  <button
                    onClick={resetSession}
                    className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-medium"
                  >
                    New Session
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="px-6 py-2 bg-white/10 border border-white/20 text-white rounded-full"
                  >
                    Home
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showMantraSelector && (
          <MantraSelector
            isOpen={showMantraSelector}
            onClose={() => setShowMantraSelector(false)}
            onSelect={handleMantraSelect}
            currentMantraId={selectedMantra?.id}
          />
        )}

        {step === 'sankalpa' && (
          <SankalpaFlow
            isOpen={true}
            onComplete={handleSankalpaComplete}
            onSkip={handleSankalpaSkip}
            selectedMantra={selectedMantra}
          />
        )}

        {currentAchievementPopup && (
          <AchievementPopup
            achievement={currentAchievementPopup}
            onClose={handleAchievementClose}
          />
        )}

        {showStatsDashboard && (
          <JaapStatsDashboard
            isOpen={showStatsDashboard}
            onClose={() => setShowStatsDashboard(false)}
            profile={profile}
            streak={streak}
          />
        )}

        {showPronunciationGuide && selectedMantra && (
          <PronunciationGuide
            isOpen={showPronunciationGuide}
            onClose={() => setShowPronunciationGuide(false)}
            mantraName={selectedMantra.id}
            devanagari={selectedMantra.devanagari}
            transliteration={selectedMantra.transliteration}
          />
        )}
      </AnimatePresence>
    </CosmicBackground>
  );
}
