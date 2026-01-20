import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CosmicBackground from "../components/CosmicBackground";
import { GradientText, gradientUtils } from "../components/GradientText";
import {
  ArrowLeft,
  Sparkles,
  Book,
  Heart,
  Share2,
  ChevronDown,
  ChevronUp,
  Flame,
  Search,
  Calendar,
  Smile,
  BookOpen,
  Star,
  Shuffle,
} from "lucide-react";
import GITA_DATA, {
  CHAPTER_INFO,
  THEMES,
  MOODS,
  getChapterShlokas,
  searchByTheme,
  searchByMood,
} from "../data/gitaData";

export default function GitaGyanPage() {
  const navigate = useNavigate();

  // Navigation state
  const [viewMode, setViewMode] = useState("daily"); // 'browse', 'theme', 'mood', 'random', 'daily' - default to 'daily' instead of 'browse'
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [selectedShloka, setSelectedShloka] = useState(null);
  const [activeTab, setActiveTab] = useState("translation"); // 'translation', 'general', 'corporate', 'genz'

  // Language and UI state
  const [language, setLanguage] = useState("en"); // 'en' or 'hi'
  const [favorites, setFavorites] = useState([]);
  const [dailyStreak, setDailyStreak] = useState(0);

  // Search/Filter state
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState([1]);

  // Load favorites and streak from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("gitaFavorites");
    const savedStreak = localStorage.getItem("gitaDailyStreak");
    const lastVisit = localStorage.getItem("gitaLastVisit");

    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    const today = new Date().toDateString();
    if (lastVisit !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (lastVisit === yesterday) {
        const newStreak = savedStreak ? parseInt(savedStreak) + 1 : 1;
        setDailyStreak(newStreak);
        localStorage.setItem("gitaDailyStreak", newStreak.toString());
      } else {
        setDailyStreak(1);
        localStorage.setItem("gitaDailyStreak", "1");
      }
      localStorage.setItem("gitaLastVisit", today);
    } else if (savedStreak) {
      setDailyStreak(parseInt(savedStreak));
    }
  }, []);

  // Toggle favorite
  const toggleFavorite = (chapter, verse) => {
    const key = `${chapter}.${verse}`;
    const newFavorites = favorites.includes(key)
      ? favorites.filter((f) => f !== key)
      : [...favorites, key];
    setFavorites(newFavorites);
    localStorage.setItem("gitaFavorites", JSON.stringify(newFavorites));
  };

  // Share shloka
  const shareShloka = (chapter, verse) => {
    const shloka = GITA_DATA[chapter]?.[verse];
    if (!shloka) return;

    const text = `Bhagavad Gita ${chapter}.${verse}\n\n${shloka.shloka}\n\n${
      shloka.translations[language]
    }\n\n- Shared from KarmAnk™ Gita Gyan`;

    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      alert("Shloka copied to clipboard!");
    }
  };

  // Get shlokas based on view mode
  const displayedShlokas = useMemo(() => {
    if (viewMode === "theme" && selectedTheme) {
      return searchByTheme(selectedTheme);
    } else if (viewMode === "mood" && selectedMood) {
      return searchByMood(selectedMood);
    } else if (viewMode === "random") {
      // Get all shlokas and return a random one
      const allShlokas = [];
      Object.keys(GITA_DATA).forEach((chapterNum) => {
        const chapter = parseInt(chapterNum);
        Object.keys(GITA_DATA[chapter]).forEach((verseNum) => {
          const verse = parseInt(verseNum);
          allShlokas.push({
            id: `${chapter}.${verse}`,
            chapter,
            verse,
          });
        });
      });
      if (allShlokas.length > 0) {
        const randomIndex = Math.floor(Math.random() * allShlokas.length);
        return [allShlokas[randomIndex]];
      }
    } else if (viewMode === "daily") {
      // Get shloka of the day using date-based algorithm
      const allShlokas = [];
      Object.keys(GITA_DATA).forEach((chapterNum) => {
        const chapter = parseInt(chapterNum);
        Object.keys(GITA_DATA[chapter]).forEach((verseNum) => {
          const verse = parseInt(verseNum);
          allShlokas.push({
            id: `${chapter}.${verse}`,
            chapter,
            verse,
          });
        });
      });
      if (allShlokas.length > 0) {
        // Use today's date as seed for consistent daily shloka
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
        const index = dayOfYear % allShlokas.length;
        return [allShlokas[index]];
      }
    }
    return null;
  }, [viewMode, selectedTheme, selectedMood]);

  // Auto-select first shloka when theme/mood/random/daily is selected
  useEffect(() => {
    if (displayedShlokas && displayedShlokas.length > 0) {
      const firstShloka = displayedShlokas[0];
      setSelectedChapter(firstShloka.chapter);
      setSelectedShloka(firstShloka.verse);
    }
  }, [displayedShlokas]);

  // Toggle chapter expansion
  const toggleChapter = (chapter) => {
    setExpandedChapters((prev) =>
      prev.includes(chapter) ? prev.filter((c) => c !== chapter) : [...prev, chapter]
    );
  };

  return (
    <CosmicBackground density={160} useVideo={true}>
      <div className="min-h-screen relative px-3 sm:px-4 md:px-6 py-4 sm:py-6 pb-16 sm:pb-20">
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Back Button on Left */}
          <div className="flex justify-start items-center mb-6">
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

          {/* Futuristic Gate Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative w-full h-32 sm:h-40 md:h-48 mb-6 sm:mb-8 overflow-hidden rounded-xl border border-cyan-500/20"
          >
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

            {/* Animated particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -100, 0],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-1 sm:space-y-2 relative z-10 px-2">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-3xl sm:text-4xl md:text-5xl font-bold"
                >
                  <GradientText as="span" size="3xl" className="font-serif sm:size-4xl md:size-5xl">
                    Gita Gyan
                  </GradientText>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-[10px] sm:text-xs text-cyan-400/60 tracking-widest flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                  COSMIC WISDOM FOR MODERN LIFE
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="flex items-center justify-center gap-2 mt-2 sm:mt-3"
                >
                  <div className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
                  <div className="text-xs text-cyan-400/40">★</div>
                  <div className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Stats Bar with Language Toggle & Streak */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-gray-900/60 backdrop-blur-md p-4 rounded-xl border border-cyan-500/20"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30 rounded-full px-4 py-2">
                <Flame className="h-5 w-5 text-orange-400" />
                <span className="text-sm text-white font-semibold">{dailyStreak} day streak</span>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-full px-4 py-2">
                <Heart className="h-5 w-5 text-pink-400" />
                <span className="text-sm text-white font-semibold">{favorites.length} favorites</span>
              </div>
            </div>
            <button
              onClick={() => setLanguage(language === "en" ? "hi" : "en")}
              className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 border border-cyan-400/30 rounded-full px-5 py-2 text-sm text-white font-semibold transition-all duration-200 transform hover:scale-105"
            >
              {language === "en" ? "🕉️ हिन्दी" : "🕉️ English"}
            </button>
          </motion.div>

          {/* View Mode Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="flex flex-wrap gap-3 justify-center mb-8"
          >
            {/* Browse Chapters, Search by Theme, and Search by Mood buttons hidden as requested */}
            {/* <button
              onClick={() => {
                setViewMode("browse");
                setSelectedTheme(null);
                setSelectedMood(null);
              }}
              className={`group flex items-center gap-2 px-6 py-3 rounded-xl border transition-all duration-200 transform hover:scale-105 ${
                viewMode === "browse"
                  ? "bg-gradient-to-r from-cyan-600/30 to-purple-600/30 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/20"
                  : "bg-gray-900/60 backdrop-blur-md border-cyan-500/20 text-white/70 hover:border-cyan-400/50 hover:text-white"
              }`}
            >
              <Book className={`h-5 w-5 ${viewMode === "browse" ? "text-cyan-300" : "text-cyan-400/60 group-hover:text-cyan-400"}`} />
              <span className="font-semibold">Browse Chapters</span>
            </button> */}
            {/* <button
              onClick={() => {
                setViewMode("theme");
                setSelectedMood(null);
              }}
              className={`group flex items-center gap-2 px-6 py-3 rounded-xl border transition-all duration-200 transform hover:scale-105 ${
                viewMode === "theme"
                  ? "bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-purple-400 text-purple-300 shadow-lg shadow-purple-500/20"
                  : "bg-gray-900/60 backdrop-blur-md border-purple-500/20 text-white/70 hover:border-purple-400/50 hover:text-white"
              }`}
            >
              <Search className={`h-5 w-5 ${viewMode === "theme" ? "text-purple-300" : "text-purple-400/60 group-hover:text-purple-400"}`} />
              <span className="font-semibold">Search by Theme</span>
            </button> */}
            {/* <button
              onClick={() => {
                setViewMode("mood");
                setSelectedTheme(null);
              }}
              className={`group flex items-center gap-2 px-6 py-3 rounded-xl border transition-all duration-200 transform hover:scale-105 ${
                viewMode === "mood"
                  ? "bg-gradient-to-r from-pink-600/30 to-orange-600/30 border-pink-400 text-pink-300 shadow-lg shadow-pink-500/20"
                  : "bg-gray-900/60 backdrop-blur-md border-pink-500/20 text-white/70 hover:border-pink-400/50 hover:text-white"
              }`}
            >
              <Smile className={`h-5 w-5 ${viewMode === "mood" ? "text-pink-300" : "text-pink-400/60 group-hover:text-pink-400"}`} />
              <span className="font-semibold">Search by Mood</span>
            </button> */}
            <button
              onClick={() => {
                setViewMode("random");
                setSelectedTheme(null);
                setSelectedMood(null);
              }}
              className={`group flex items-center gap-2 px-6 py-3 rounded-xl border transition-all duration-200 transform hover:scale-105 ${
                viewMode === "random"
                  ? "bg-gradient-to-r from-orange-600/30 to-red-600/30 border-orange-400 text-orange-300 shadow-lg shadow-orange-500/20"
                  : "bg-gray-900/60 backdrop-blur-md border-orange-500/20 text-white/70 hover:border-orange-400/50 hover:text-white"
              }`}
            >
              <Shuffle className={`h-5 w-5 ${viewMode === "random" ? "text-orange-300" : "text-orange-400/60 group-hover:text-orange-400"}`} />
              <span className="font-semibold">Random Shloka</span>
            </button>
            <button
              onClick={() => {
                setViewMode("daily");
                setSelectedTheme(null);
                setSelectedMood(null);
              }}
              className={`group flex items-center gap-2 px-6 py-3 rounded-xl border transition-all duration-200 transform hover:scale-105 ${
                viewMode === "daily"
                  ? "bg-gradient-to-r from-amber-600/30 to-yellow-600/30 border-amber-400 text-amber-300 shadow-lg shadow-amber-500/20"
                  : "bg-gray-900/60 backdrop-blur-md border-amber-500/20 text-white/70 hover:border-amber-400/50 hover:text-white"
              }`}
            >
              <Calendar className={`h-5 w-5 ${viewMode === "daily" ? "text-amber-300" : "text-amber-400/60 group-hover:text-amber-400"}`} />
              <span className="font-semibold">Shloka of the Day</span>
            </button>
          </motion.div>

          {/* Theme Selector */}
          <AnimatePresence>
            {viewMode === "theme" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 overflow-hidden"
              >
                <div className="bg-gray-900/60 backdrop-blur-md border border-purple-500/20 rounded-2xl p-6 shadow-lg shadow-purple-500/10">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-lg">
                    <Search className="h-5 w-5 text-purple-400" />
                    Select a Theme
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {THEMES.map((theme) => (
                      <button
                        key={theme}
                        onClick={() => setSelectedTheme(theme)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 transform hover:scale-105 ${
                          selectedTheme === theme
                            ? "bg-gradient-to-r from-purple-600/40 to-pink-600/40 border-purple-400 text-purple-200 shadow-lg shadow-purple-500/20"
                            : "bg-gray-900/60 border-purple-500/20 text-white/70 hover:border-purple-400/50 hover:text-white"
                        }`}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mood Selector */}
          <AnimatePresence>
            {viewMode === "mood" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 overflow-hidden"
              >
                <div className="bg-gray-900/60 backdrop-blur-md border border-pink-500/20 rounded-2xl p-6 shadow-lg shadow-pink-500/10">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-lg">
                    <Smile className="h-5 w-5 text-pink-400" />
                    How are you feeling today?
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {MOODS.map((mood) => (
                      <button
                        key={mood}
                        onClick={() => setSelectedMood(mood)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 transform hover:scale-105 ${
                          selectedMood === mood
                            ? "bg-gradient-to-r from-pink-600/40 to-orange-600/40 border-pink-400 text-pink-200 shadow-lg shadow-pink-500/20"
                            : "bg-gray-900/60 border-pink-500/20 text-white/70 hover:border-pink-400/50 hover:text-white"
                        }`}
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            {/* Left: Chapter/Shloka List - HIDDEN as requested */}
            {/* {viewMode === "browse" && (
              <div className="lg:col-span-1 space-y-4">
                {Object.keys(CHAPTER_INFO).map((chapterNum) => {
                  const chapter = parseInt(chapterNum);
                  const info = CHAPTER_INFO[chapter];
                  const isExpanded = expandedChapters.includes(chapter);
                  const shlokas = getChapterShlokas(chapter);

                  return (
                    <motion.div
                      key={chapter}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: chapter * 0.05 }}
                      className="bg-gray-900/60 backdrop-blur-md border border-cyan-500/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-cyan-500/10 transition-shadow duration-300"
                    >
                      <button
                        onClick={() => toggleChapter(chapter)}
                        className="w-full px-5 py-4 flex items-center justify-between hover:bg-cyan-500/5 transition-all duration-200 group"
                      >
                        <div className="text-left">
                          <div className="text-white font-bold text-sm mb-1 flex items-center gap-2">
                            <span className="text-cyan-400">Chapter {chapter}</span>
                            <span className="text-cyan-400/40 text-xs">•</span>
                            <span className="text-white/60 text-xs">{shlokas.length} shlokas</span>
                          </div>
                          <div className="text-white/70 text-xs">{info.title[language]}</div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-cyan-400 group-hover:text-cyan-300" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-cyan-400 group-hover:text-cyan-300" />
                        )}
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-3 pb-3 space-y-1 max-h-60 overflow-y-auto">
                              {shlokas.map((shloka) => (
                                <button
                                  key={shloka.id}
                                  onClick={() => {
                                    setSelectedChapter(shloka.chapter);
                                    setSelectedShloka(shloka.verse);
                                  }}
                                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all duration-200 ${
                                    selectedChapter === shloka.chapter &&
                                    selectedShloka === shloka.verse
                                      ? "bg-auric-gold/20 text-auric-gold border border-auric-gold/30"
                                      : "text-white/60 hover:bg-white/5 hover:text-white/80"
                                  }`}
                                >
                                  Shloka {shloka.id}
                                  {favorites.includes(shloka.id) && (
                                    <Heart className="inline h-3 w-3 ml-2 fill-current text-red-400" />
                                  )}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )} */}

            {/* Shloka Detail */}
            <div className="lg:col-span-1 max-w-4xl mx-auto w-full">
              {selectedShloka && GITA_DATA[selectedChapter]?.[selectedShloka] ? (
                <div className="space-y-4">
                  <ShlokaDetailCard
                    chapter={selectedChapter}
                    verse={selectedShloka}
                    data={GITA_DATA[selectedChapter][selectedShloka]}
                    language={language}
                    isFavorite={favorites.includes(`${selectedChapter}.${selectedShloka}`)}
                    onToggleFavorite={() => toggleFavorite(selectedChapter, selectedShloka)}
                    onShare={() => shareShloka(selectedChapter, selectedShloka)}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                  />

                  {/* Random Shloka button */}
                  {viewMode === "random" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-center"
                    >
                      <button
                        onClick={() => {
                          // Force re-render by toggling view mode
                          setViewMode("browse");
                          setTimeout(() => setViewMode("random"), 10);
                        }}
                        className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 border border-orange-400/30 text-white font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg shadow-orange-500/20"
                      >
                        <Shuffle className="h-5 w-5" />
                        Get New Random Shloka
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative bg-gray-900/60 backdrop-blur-md border border-cyan-500/20 rounded-3xl p-12 flex flex-col items-center justify-center text-center min-h-[500px] overflow-hidden"
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 opacity-20">
                    {[...Array(30)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          scale: [0, 1, 0],
                          opacity: [0, 0.8, 0],
                        }}
                        transition={{
                          duration: 2 + Math.random() * 2,
                          repeat: Infinity,
                          delay: Math.random() * 2,
                        }}
                      />
                    ))}
                  </div>

                  <div className="relative z-10">
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <BookOpen className="h-20 w-20 text-cyan-400/40 mb-6" />
                    </motion.div>
                    <h3 className="text-white/80 text-2xl font-bold mb-3">Select a Shloka to Begin</h3>
                    <p className="text-white/50 text-sm max-w-md">
                      Choose from the chapters on the left, or search by theme/mood above to discover timeless wisdom
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-6">
                      <div className="h-px w-12 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
                      <Sparkles className="h-4 w-4 text-cyan-400/60" />
                      <div className="h-px w-12 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </CosmicBackground>
  );
}

// Shloka Detail Component
function ShlokaDetailCard({
  chapter,
  verse,
  data,
  language,
  isFavorite,
  onToggleFavorite,
  onShare,
  activeTab,
  setActiveTab,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-gray-900/60 backdrop-blur-md border border-cyan-500/20 rounded-3xl overflow-hidden shadow-2xl shadow-cyan-500/10"
    >
      {/* Header */}
      <div className="relative bg-gradient-to-r from-cyan-900/40 via-purple-900/40 to-pink-900/40 px-6 py-5 border-b border-cyan-500/20">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5"></div>
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400 font-bold text-xl">
                Chapter {chapter}, Shloka {verse}
              </div>
              <div className="h-1 w-1 rounded-full bg-cyan-400"></div>
            </div>
            <div className="text-white/70 text-sm">
              {CHAPTER_INFO[chapter]?.title[language]}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleFavorite}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-pink-400/50 transition-all duration-200 group"
            >
              <Heart
                className={`h-5 w-5 transition-all ${
                  isFavorite ? "fill-current text-pink-400 scale-110" : "text-white/50 group-hover:text-pink-400"
                }`}
              />
            </button>
            <button
              onClick={onShare}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/50 transition-all duration-200 group"
            >
              <Share2 className="h-5 w-5 text-white/50 group-hover:text-cyan-400 transition-colors" />
            </button>
          </div>
        </div>
      </div>

      {/* Sanskrit Shloka */}
      <div className="relative px-6 py-8 border-b border-cyan-500/20 bg-gradient-to-b from-cyan-500/5 to-transparent">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.05),transparent_70%)]"></div>
        <div className="relative text-center">
          <div className="inline-block px-6 py-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-cyan-400/20">
            <p className="text-white/95 text-xl md:text-2xl leading-relaxed font-serif whitespace-pre-line">
              {data.shloka}
            </p>
          </div>
          <p className="text-cyan-300/70 text-sm mt-6 italic tracking-wide">{data.transliteration}</p>
        </div>
      </div>

      {/* Themes */}
      {data.themes && data.themes.length > 0 && (
        <div className="px-6 py-4 border-b border-cyan-500/20">
          <div className="flex flex-wrap gap-2">
            {data.themes.map((theme) => (
              <span
                key={theme}
                className="px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-full text-xs font-medium text-purple-200"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="px-6 py-4 border-b border-cyan-500/20 bg-gray-900/40">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <TabButton
            active={activeTab === "translation"}
            onClick={() => setActiveTab("translation")}
            icon={<BookOpen className="h-4 w-4" />}
            label="Translation"
          />
          <TabButton
            active={activeTab === "general"}
            onClick={() => setActiveTab("general")}
            icon={<Sparkles className="h-4 w-4" />}
            label="Life Lesson"
          />
          <TabButton
            active={activeTab === "corporate"}
            onClick={() => setActiveTab("corporate")}
            icon={<Star className="h-4 w-4" />}
            label="Corporate"
          />
          <TabButton
            active={activeTab === "genz"}
            onClick={() => setActiveTab("genz")}
            icon={<Flame className="h-4 w-4" />}
            label="Gen-Z View"
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-6 py-6 min-h-[200px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-white/80 leading-relaxed"
          >
            {activeTab === "translation" && <p>{data.translations?.[language]}</p>}
            {activeTab === "general" && <p>{data.generalLife?.[language]}</p>}
            {activeTab === "corporate" && <p>{data.corporateLesson?.[language]}</p>}
            {activeTab === "genz" && <p>{data.genZPerspective?.[language]}</p>}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Tab Button Component
function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 transform hover:scale-105 ${
        active
          ? "bg-gradient-to-r from-cyan-600/30 to-purple-600/30 border border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/20"
          : "text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/20"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
