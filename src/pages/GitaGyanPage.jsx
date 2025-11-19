import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CosmicBackground from "../components/CosmicBackground";
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
  const [viewMode, setViewMode] = useState("browse"); // 'browse', 'theme', 'mood'
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
    }\n\n- Shared from KarmAnk Gita Gyan`;

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
    }
    return null;
  }, [viewMode, selectedTheme, selectedMood]);

  // Toggle chapter expansion
  const toggleChapter = (chapter) => {
    setExpandedChapters((prev) =>
      prev.includes(chapter) ? prev.filter((c) => c !== chapter) : [...prev, chapter]
    );
  };

  return (
    <CosmicBackground density={140} useVideo={true}>
      <div className="min-h-screen relative px-4 md:px-6 py-6 pb-20">
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-white/70 hover:text-auric-gold transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Home</span>
            </motion.button>

            {/* Language Toggle & Streak */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4"
            >
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2">
                <Flame className="h-4 w-4 text-orange-400" />
                <span className="text-sm text-white/80 font-medium">{dailyStreak} day streak</span>
              </div>
              <button
                onClick={() => setLanguage(language === "en" ? "hi" : "en")}
                className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-auric-gold/50 rounded-full px-4 py-2 text-sm text-white/80 hover:text-white transition-all duration-200"
              >
                {language === "en" ? "हिन्दी" : "English"}
              </button>
            </motion.div>
          </div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-6xl font-serif font-extrabold bg-[linear-gradient(90deg,#facc15_0%,#fbbf24_20%,#f9a8d4_60%,#c084fc_100%)] bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(0,255,255,.25)] mb-3">
              Gita Gyan
            </h1>
            <p className="text-white/70 text-sm md:text-base flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4 text-auric-gold" />
              Timeless wisdom for modern life
            </p>
          </motion.div>

          {/* View Mode Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-3 justify-center mb-8"
          >
            <button
              onClick={() => {
                setViewMode("browse");
                setSelectedTheme(null);
                setSelectedMood(null);
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-200 ${
                viewMode === "browse"
                  ? "bg-auric-gold/20 border-auric-gold text-auric-gold"
                  : "bg-white/5 border-white/10 text-white/70 hover:border-white/30"
              }`}
            >
              <Book className="h-4 w-4" />
              <span className="font-medium">Browse Chapters</span>
            </button>
            <button
              onClick={() => setViewMode("theme")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-200 ${
                viewMode === "theme"
                  ? "bg-auric-gold/20 border-auric-gold text-auric-gold"
                  : "bg-white/5 border-white/10 text-white/70 hover:border-white/30"
              }`}
            >
              <Search className="h-4 w-4" />
              <span className="font-medium">Search by Theme</span>
            </button>
            <button
              onClick={() => setViewMode("mood")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-200 ${
                viewMode === "mood"
                  ? "bg-auric-gold/20 border-auric-gold text-auric-gold"
                  : "bg-white/5 border-white/10 text-white/70 hover:border-white/30"
              }`}
            >
              <Smile className="h-4 w-4" />
              <span className="font-medium">Search by Mood</span>
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
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <h3 className="text-white/90 font-semibold mb-4 flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Select a Theme
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {THEMES.map((theme) => (
                      <button
                        key={theme}
                        onClick={() => setSelectedTheme(theme)}
                        className={`px-4 py-2 rounded-full text-sm border transition-all duration-200 ${
                          selectedTheme === theme
                            ? "bg-purple-500/30 border-purple-400 text-purple-200"
                            : "bg-white/5 border-white/10 text-white/70 hover:border-white/30"
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
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <h3 className="text-white/90 font-semibold mb-4 flex items-center gap-2">
                    <Smile className="h-4 w-4" />
                    How are you feeling today?
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {MOODS.map((mood) => (
                      <button
                        key={mood}
                        onClick={() => setSelectedMood(mood)}
                        className={`px-4 py-2 rounded-full text-sm border transition-all duration-200 ${
                          selectedMood === mood
                            ? "bg-pink-500/30 border-pink-400 text-pink-200"
                            : "bg-white/5 border-white/10 text-white/70 hover:border-white/30"
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Chapter/Shloka List */}
            <div className="lg:col-span-1 space-y-4">
              {viewMode === "browse" ? (
                // Browse by Chapter
                Object.keys(CHAPTER_INFO).map((chapterNum) => {
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
                      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggleChapter(chapter)}
                        className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/5 transition-colors duration-200"
                      >
                        <div className="text-left">
                          <div className="text-white/90 font-semibold text-sm mb-1">
                            Chapter {chapter}
                          </div>
                          <div className="text-white/70 text-xs">{info.title[language]}</div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-white/50" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-white/50" />
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
                })
              ) : (
                // Theme/Mood search results
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4"
                >
                  <h3 className="text-white/90 font-semibold mb-3 text-sm">
                    {displayedShlokas?.length || 0} Results
                  </h3>
                  <div className="space-y-1 max-h-[600px] overflow-y-auto">
                    {displayedShlokas?.map((shloka) => (
                      <button
                        key={shloka.id}
                        onClick={() => {
                          setSelectedChapter(shloka.chapter);
                          setSelectedShloka(shloka.verse);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all duration-200 ${
                          selectedChapter === shloka.chapter && selectedShloka === shloka.verse
                            ? "bg-auric-gold/20 text-auric-gold border border-auric-gold/30"
                            : "text-white/60 hover:bg-white/5 hover:text-white/80"
                        }`}
                      >
                        {shloka.id}
                        {favorites.includes(shloka.id) && (
                          <Heart className="inline h-3 w-3 ml-2 fill-current text-red-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right: Shloka Detail */}
            <div className="lg:col-span-2">
              {selectedShloka && GITA_DATA[selectedChapter]?.[selectedShloka] ? (
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
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center text-center min-h-[500px]"
                >
                  <BookOpen className="h-16 w-16 text-white/20 mb-4" />
                  <p className="text-white/50 text-lg">Select a shloka to begin</p>
                  <p className="text-white/30 text-sm mt-2">
                    Choose from the chapters on the left, or search by theme/mood above
                  </p>
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
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-auric-gold/20 via-purple-500/20 to-pink-500/20 px-6 py-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-auric-gold font-bold text-lg">
              Chapter {chapter}, Shloka {verse}
            </div>
            <div className="text-white/60 text-xs mt-1">
              {CHAPTER_INFO[chapter]?.title[language]}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleFavorite}
              className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
            >
              <Heart
                className={`h-5 w-5 ${
                  isFavorite ? "fill-current text-red-400" : "text-white/50"
                }`}
              />
            </button>
            <button
              onClick={onShare}
              className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
            >
              <Share2 className="h-5 w-5 text-white/50" />
            </button>
          </div>
        </div>
      </div>

      {/* Sanskrit Shloka */}
      <div className="px-6 py-6 border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
        <div className="text-center">
          <p className="text-white/90 text-lg md:text-xl leading-relaxed font-serif whitespace-pre-line">
            {data.shloka}
          </p>
          <p className="text-white/50 text-sm mt-4 italic">{data.transliteration}</p>
        </div>
      </div>

      {/* Themes */}
      {data.themes && data.themes.length > 0 && (
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex flex-wrap gap-2">
            {data.themes.map((theme) => (
              <span
                key={theme}
                className="px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-xs text-purple-200"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="px-6 py-3 border-b border-white/10 bg-white/5">
        <div className="flex gap-2 overflow-x-auto">
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
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
        active
          ? "bg-auric-gold/20 text-auric-gold border border-auric-gold/30"
          : "text-white/60 hover:text-white/80 hover:bg-white/5"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
