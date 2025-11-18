import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CosmicBackground from '../components/CosmicBackground';
import { Crown, ArrowLeft, ArrowRight, GraduationCap, Sparkles, Brain, Target, TrendingUp } from 'lucide-react';
import {
  BIG_FIVE_QUESTIONS,
  RIASEC_QUESTIONS,
  ADVANCED_RIASEC_QUESTIONS,
  APTITUDE_QUESTIONS,
  BIG_FIVE_INFO,
  RIASEC_INFO,
  STREAM_RECOMMENDATIONS,
  CAREER_CLUSTERS
} from '../data/careerPathData';
import { calculateNumerology } from '../utils/calculators';
import { DATA } from '../data/data';
import {
  Chart,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js';

// Register Chart.js components
Chart.register(
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale
);

// ============================================================
// CUSTOM CHART COMPONENTS
// ============================================================

function RadarChart({ data, options }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: 'radar',
      data: data,
      options: options,
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, options]);

  return <canvas ref={canvasRef} />;
}

function BarChart({ data, options }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: options,
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, options]);

  return <canvas ref={canvasRef} />;
}

export default function CareerPathPage() {
  const navigate = useNavigate();

  // Core state
  const [currentScreen, setCurrentScreen] = useState(0);
  const [userData, setUserData] = useState({
    name: '',
    dob: '',
    class: '',
    schoolName: '',
    city: '',
    state: '',
    email: '',
    phone: ''
  });
  const [path, setPath] = useState(null); // 'stream' for 9-10th, 'career' for 11-12th

  // Test responses
  const [bigFiveAnswers, setBigFiveAnswers] = useState({});
  const [riasecAnswers, setRiasecAnswers] = useState({});
  const [aptitudeAnswers, setAptitudeAnswers] = useState({});

  // Results
  const [bigFiveScores, setBigFiveScores] = useState(null);
  const [riasecScores, setRiasecScores] = useState(null);
  const [aptitudeScores, setAptitudeScores] = useState(null);
  const [numerologyReport, setNumerologyReport] = useState(null);

  // ============================================================
  // SCREEN CONFIGURATIONS
  // ============================================================

  const streamSelectorScreens = [
    'welcome',           // 0: WelcomeScreen with intake form
    'personality',       // 1: Big Five Test (30 questions)
    'interests',         // 2: RIASEC Test (36 questions, 6 per type)
    'aptitude',          // 3: Section-Adaptive Aptitude (30 questions)
    'dashboard'          // 4: Final Dashboard with stream recommendation
  ];

  const careerPlannerScreens = [
    'welcome',           // 0: WelcomeScreen with intake form
    'personality',       // 1: Big Five Test (30 questions)
    'interests_advanced',// 2: Advanced RIASEC (30 forced-choice questions)
    'aptitude',          // 3: Section-Adaptive Aptitude (30 questions)
    'dashboard'          // 4: Final Dashboard with career clusters
  ];

  const screens = path === 'stream' ? streamSelectorScreens : careerPlannerScreens;
  const totalScreens = screens.length;
  const currentScreenName = screens[currentScreen];

  // ============================================================
  // NAVIGATION HANDLERS
  // ============================================================

  const handleNext = () => {
    if (currentScreen < totalScreens - 1) {
      setCurrentScreen(currentScreen + 1);
    }
  };

  const handleBack = () => {
    if (currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
    } else {
      navigate('/');
    }
  };

  const handleWelcomeSubmit = (formData) => {
    setUserData(formData);

    // Calculate numerology report
    const numReport = calculateNumerology(formData.dob);
    setNumerologyReport(numReport);

    // Determine path based on class
    const classNum = parseInt(formData.class);
    if (classNum <= 10) {
      setPath('stream');
    } else {
      setPath('career');
    }

    handleNext();
  };

  // ============================================================
  // SCORING FUNCTIONS
  // ============================================================

  const calculateBigFiveScores = (answers) => {
    const scores = {
      Openness: 0,
      Conscientiousness: 0,
      Extraversion: 0,
      Agreeableness: 0,
      Neuroticism: 0,
    };

    const counts = {
      Openness: 0,
      Conscientiousness: 0,
      Extraversion: 0,
      Agreeableness: 0,
      Neuroticism: 0,
    };

    for (const question of BIG_FIVE_QUESTIONS) {
      const { id, trait, keyed } = question;
      const answerNum = parseInt(answers[id], 10);

      if (answerNum) {
        counts[trait]++;

        if (keyed === "+") {
          scores[trait] += answerNum;
        } else if (keyed === "-") {
          scores[trait] += (6 - answerNum); // Reverse scoring
        }
      }
    }

    // Normalize to 0-100 scale
    const normalizedScores = {};
    for (const trait in scores) {
      const maxScore = counts[trait] * 5; // max per question is 5
      normalizedScores[trait] = Math.round((scores[trait] / maxScore) * 100);
    }

    return normalizedScores;
  };

  const calculateRiasecScores = (answers, isAdvanced = false) => {
    if (isAdvanced) {
      // Advanced RIASEC scoring (Path B)
      const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

      for (const question of ADVANCED_RIASEC_QUESTIONS) {
        const answer = answers[question.id];
        if (answer === 'A') {
          scores[question.optionA.type]++;
        } else if (answer === 'B') {
          scores[question.optionB.type]++;
        }
      }

      // Normalize to percentages
      const total = Object.values(scores).reduce((sum, val) => sum + val, 0);
      const normalizedScores = {};
      for (const type in scores) {
        normalizedScores[type] = total > 0 ? Math.round((scores[type] / total) * 100) : 0;
      }

      return normalizedScores;
    } else {
      // Standard RIASEC scoring (Path A)
      const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

      for (const question of RIASEC_QUESTIONS) {
        const answerNum = parseInt(answers[question.id], 10);
        if (answerNum === 3) scores[question.type] += 1; // Like
        else if (answerNum === 2) scores[question.type] += 0.5; // Neutral
        // Dislike (1) adds 0
      }

      // Normalize to percentages
      const maxPossible = 10; // 10 questions per type
      const normalizedScores = {};
      for (const type in scores) {
        normalizedScores[type] = Math.round((scores[type] / maxPossible) * 100);
      }

      return normalizedScores;
    }
  };

  const calculateAptitudeScores = (answers) => {
    const scores = { math: 0, logic: 0, verbal: 0 };
    const breakdown = { math: { easy: 0, medium: 0, hard: 0 }, logic: { easy: 0, medium: 0, hard: 0 }, verbal: { easy: 0, medium: 0, hard: 0 } };

    // Score each section
    ['math', 'logic', 'verbal'].forEach(section => {
      APTITUDE_QUESTIONS[section].forEach(question => {
        if (answers[question.id] === question.answer) {
          if (question.difficulty === 'easy') {
            scores[section] += 1;
            breakdown[section].easy++;
          } else if (question.difficulty === 'medium') {
            scores[section] += 2;
            breakdown[section].medium++;
          } else if (question.difficulty === 'hard') {
            scores[section] += 3;
            breakdown[section].hard++;
          }
        }
      });
    });

    return { scores, breakdown };
  };

  // ============================================================
  // RENDER SCREENS
  // ============================================================

  const renderScreen = () => {
    switch (currentScreenName) {
      case 'welcome':
        return <WelcomeScreen onSubmit={handleWelcomeSubmit} />;

      case 'personality':
        return (
          <PersonalityTestScreen
            answers={bigFiveAnswers}
            setAnswers={setBigFiveAnswers}
            onComplete={(answers) => {
              const scores = calculateBigFiveScores(answers);
              setBigFiveScores(scores);
              handleNext();
            }}
          />
        );

      case 'interests':
        return (
          <InterestsTestScreen
            answers={riasecAnswers}
            setAnswers={setRiasecAnswers}
            onComplete={(answers) => {
              const scores = calculateRiasecScores(answers, false);
              setRiasecScores(scores);
              handleNext();
            }}
          />
        );

      case 'interests_advanced':
        return (
          <AdvancedInterestsTestScreen
            answers={riasecAnswers}
            setAnswers={setRiasecAnswers}
            onComplete={(answers) => {
              const scores = calculateRiasecScores(answers, true);
              setRiasecScores(scores);
              handleNext();
            }}
          />
        );

      case 'aptitude':
        return (
          <AptitudeTestScreen
            answers={aptitudeAnswers}
            setAnswers={setAptitudeAnswers}
            onComplete={(answers) => {
              const scores = calculateAptitudeScores(answers);
              setAptitudeScores(scores);
              handleNext();
            }}
          />
        );

      case 'dashboard':
        return (
          <DashboardScreen
            userData={userData}
            path={path}
            bigFiveScores={bigFiveScores}
            riasecScores={riasecScores}
            aptitudeScores={aptitudeScores}
            numerologyReport={numerologyReport}
          />
        );

      default:
        return null;
    }
  };

  // ============================================================
  // MAIN RENDER
  // ============================================================

  return (
    <CosmicBackground density={140} useVideo={true}>
      <div className="min-h-screen relative px-4 md:px-6 py-6 overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <Crown className="h-8 w-8 text-auric-gold" />
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-white">
                KarmAnk • Career Path
              </h1>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              onClick={handleBack}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-4 py-2 rounded-md text-sm font-medium transition duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </motion.button>
          </div>

          {/* Progress Bar */}
          {currentScreen > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-auric-gold to-nebula-violet"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentScreen + 1) / totalScreens) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-xs text-white/60 mt-2 text-center">
                Step {currentScreen + 1} of {totalScreens}
              </p>
            </motion.div>
          )}

          {/* Screen Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </CosmicBackground>
  );
}

// ============================================================
// WELCOME SCREEN (Screen 0)
// ============================================================

function WelcomeScreen({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    class: '',
    schoolName: '',
    city: '',
    state: '',
    email: '',
    phone: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.dob && formData.class && formData.schoolName && formData.city) {
      onSubmit(formData);
    }
  };

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-violet-900/40 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl"
      >
        <div className="flex items-center justify-center mb-6">
          <GraduationCap className="h-16 w-16 text-auric-gold" />
        </div>

        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-4 bg-gradient-to-r from-auric-gold via-pink-300 to-purple-400 bg-clip-text text-transparent">
          Discover Your Educational & Career Path
        </h2>

        <p className="text-white/80 text-center mb-6 text-sm md:text-base">
          Welcome to the 3-Pillar Profiler: A comprehensive psychometric assessment measuring your <span className="text-auric-gold font-semibold">Personality</span>, <span className="text-pink-300 font-semibold">Interests</span>, and <span className="text-purple-400 font-semibold">Aptitude</span>. Aligned with Vedic numerology to guide you toward your cosmic destiny.
        </p>

        {/* Important Instructions */}
        <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 border border-amber-400/40 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <div className="w-10 h-10 rounded-full bg-amber-400/30 flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-amber-300 font-bold text-lg mb-3">Important Instructions for Accurate Results</h3>
              <ul className="space-y-2 text-white/90 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold mt-0.5">•</span>
                  <span><strong>Complete Focus:</strong> Take this assessment in a quiet environment without distractions. This is crucial for accurate results.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold mt-0.5">•</span>
                  <span><strong>Be Honest:</strong> Answer questions truthfully based on how you actually think and behave, not how you wish to be.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold mt-0.5">•</span>
                  <span><strong>Take Your Time:</strong> Read each question carefully. Don't rush - the assessment takes approximately 30-40 minutes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold mt-0.5">•</span>
                  <span><strong>First Instinct:</strong> Your initial response is usually the most accurate. Avoid overthinking your answers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold mt-0.5">•</span>
                  <span><strong>Complete in One Sitting:</strong> Finish the entire assessment without breaks for the most reliable results.</span>
                </li>
              </ul>
              <p className="mt-4 text-amber-200 text-sm italic border-t border-amber-400/30 pt-3">
                Your career path depends on accurate assessment results. Conscious and attentive participation will provide the most beneficial guidance for your educational and professional journey.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Personal Information Section */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="text-auric-gold">●</span> Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-auric-gold transition"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Date of Birth <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-auric-gold transition"
                  required
                />
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Email Address <span className="text-white/50 text-xs">(Optional)</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-auric-gold transition"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Phone Number <span className="text-white/50 text-xs">(Optional)</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-auric-gold transition"
                  placeholder="+91 98765 43210"
                  pattern="[0-9+\s-]*"
                />
              </div>
            </div>
          </div>

          {/* Academic Information Section */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="text-pink-300">●</span> Academic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Current Class/Grade <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-auric-gold transition"
                  required
                >
                  <option value="" className="bg-gray-900">Select your class</option>
                  <option value="9" className="bg-gray-900">Class 9</option>
                  <option value="10" className="bg-gray-900">Class 10</option>
                  <option value="11" className="bg-gray-900">Class 11</option>
                  <option value="12" className="bg-gray-900">Class 12</option>
                </select>
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  School Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-auric-gold transition"
                  placeholder="Enter your school name"
                  required
                />
              </div>
            </div>
          </div>

          {/* Location Information Section */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="text-purple-400">●</span> Location Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  City <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-auric-gold transition"
                  placeholder="Enter your city"
                  required
                />
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  State/UT <span className="text-white/50 text-xs">(Optional)</span>
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-auric-gold transition"
                >
                  <option value="" className="bg-gray-900">Select your state</option>
                  {indianStates.map((state) => (
                    <option key={state} value={state} className="bg-gray-900">{state}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-auric-gold to-yellow-500 text-gray-900 font-semibold py-4 rounded-lg shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2"
          >
            Begin Assessment
            <ArrowRight className="h-5 w-5" />
          </motion.button>

          <p className="text-white/50 text-xs text-center">
            Fields marked with <span className="text-red-400">*</span> are required
          </p>
        </form>

        <div className="mt-8 pt-6 border-t border-white/20">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <Brain className="h-6 w-6 text-auric-gold mx-auto mb-2" />
              <p className="text-xs text-white/70">Personality</p>
              <p className="text-xs text-white/50 mt-1">Big Five Model</p>
            </div>
            <div>
              <Target className="h-6 w-6 text-pink-300 mx-auto mb-2" />
              <p className="text-xs text-white/70">Interests</p>
              <p className="text-xs text-white/50 mt-1">RIASEC Model</p>
            </div>
            <div>
              <TrendingUp className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <p className="text-xs text-white/70">Aptitude</p>
              <p className="text-xs text-white/50 mt-1">Math, Logic, Verbal</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================
// PERSONALITY TEST SCREEN (Big Five - 30 Questions)
// ============================================================

function PersonalityTestScreen({ answers, setAnswers, onComplete }) {
  const [currentPage, setCurrentPage] = useState(0);
  const questionsPerPage = 6;
  const totalPages = Math.ceil(BIG_FIVE_QUESTIONS.length / questionsPerPage);

  const currentQuestions = BIG_FIVE_QUESTIONS.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );

  const handleAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      onComplete(answers);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const allAnswered = currentQuestions.every(q => answers[q.id]);
  const progress = ((currentPage + 1) / totalPages) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-violet-900/40 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <Brain className="h-8 w-8 text-auric-gold" />
          <h2 className="text-2xl font-serif font-bold text-white">
            Personality Assessment
          </h2>
        </div>

        <div className="bg-amber-500/10 border border-amber-400/30 rounded-lg p-4 mb-6">
          <p className="text-white/90 text-sm mb-2">
            <strong className="text-amber-300">Instructions:</strong> Rate each statement on a scale from 1 (Strongly Disagree) to 5 (Strongly Agree).
          </p>
          <p className="text-white/70 text-xs">
            ⚠️ Be honest and answer based on how you truly are, not how you wish to be. There are no right or wrong answers.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-auric-gold"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-xs text-white/60 mt-2 text-center">
            Page {currentPage + 1} of {totalPages} ({Object.keys(answers).length} / {BIG_FIVE_QUESTIONS.length} answered)
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-8">
          {currentQuestions.map((question) => (
            <div key={question.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white mb-4 font-medium">{question.text}</p>
              <div className="flex justify-between items-center gap-2">
                <span className="text-xs text-white/50 hidden sm:block">Strongly<br/>Disagree</span>
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleAnswer(question.id, value)}
                    className={`flex-1 py-3 rounded-lg font-medium transition ${
                      answers[question.id] === value
                        ? 'bg-auric-gold text-gray-900'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {value}
                  </button>
                ))}
                <span className="text-xs text-white/50 hidden sm:block">Strongly<br/>Agree</span>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 0}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={!allAnswered}
            className="flex items-center gap-2 bg-gradient-to-r from-auric-gold to-yellow-500 text-gray-900 font-semibold px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition"
          >
            {currentPage < totalPages - 1 ? 'Next' : 'Submit'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================
// INTERESTS TEST SCREEN (RIASEC - 36 Questions, Path A)
// ============================================================

function InterestsTestScreen({ answers, setAnswers, onComplete }) {
  const [currentPage, setCurrentPage] = useState(0);
  const questionsPerPage = 12;

  // Select 6 random questions per type (total 36)
  const selectedQuestions = useMemo(() => {
    const types = ['R', 'I', 'A', 'S', 'E', 'C'];
    const selected = [];

    types.forEach(type => {
      const typeQuestions = RIASEC_QUESTIONS.filter(q => q.type === type);
      // Shuffle and take first 6
      const shuffled = [...typeQuestions].sort(() => 0.5 - Math.random());
      selected.push(...shuffled.slice(0, 6));
    });

    return selected;
  }, []);

  const totalPages = Math.ceil(selectedQuestions.length / questionsPerPage);

  const currentQuestions = selectedQuestions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );

  const handleAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      onComplete(answers);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const allAnswered = currentQuestions.every(q => answers[q.id]);
  const progress = ((currentPage + 1) / totalPages) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-pink-900/40 via-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <Target className="h-8 w-8 text-pink-300" />
          <h2 className="text-2xl font-serif font-bold text-white">
            Interest Assessment
          </h2>
        </div>

        <div className="bg-amber-500/10 border border-amber-400/30 rounded-lg p-4 mb-6">
          <p className="text-white/90 text-sm mb-2">
            <strong className="text-amber-300">Instructions:</strong> How much would you enjoy each activity? Rate from 1 (Dislike) to 3 (Like).
          </p>
          <p className="text-white/70 text-xs">
            ⚠️ Answer based on your genuine interests, not what others expect. Think about what naturally excites you.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-pink-300"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-xs text-white/60 mt-2 text-center">
            Page {currentPage + 1} of {totalPages}
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-4 mb-8">
          {currentQuestions.map((question) => (
            <div key={question.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white mb-3">{question.text}</p>
              <div className="flex gap-3">
                {[
                  { value: 1, label: 'Dislike' },
                  { value: 2, label: 'Neutral' },
                  { value: 3, label: 'Like' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(question.id, option.value)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                      answers[question.id] === option.value
                        ? 'bg-pink-300 text-gray-900'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 0}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={!allAnswered}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-300 to-purple-400 text-gray-900 font-semibold px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition"
          >
            {currentPage < totalPages - 1 ? 'Next' : 'Submit'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================
// ADVANCED INTERESTS TEST SCREEN (Forced-Choice, Path B)
// ============================================================

function AdvancedInterestsTestScreen({ answers, setAnswers, onComplete }) {
  const [currentPage, setCurrentPage] = useState(0);
  const questionsPerPage = 6;

  // Select 2 questions per pairing (15 pairings × 2 = 30 questions)
  const selectedQuestions = useMemo(() => {
    const pairings = ['R-I', 'R-A', 'R-S', 'R-E', 'R-C', 'I-A', 'I-S', 'I-E', 'I-C', 'A-S', 'A-E', 'A-C', 'S-E', 'S-C', 'E-C'];
    const selected = [];

    pairings.forEach(pairing => {
      const pairingQuestions = ADVANCED_RIASEC_QUESTIONS.filter(q => q.pairing === pairing);
      selected.push(...pairingQuestions.slice(0, 2));
    });

    return selected;
  }, []);

  const totalPages = Math.ceil(selectedQuestions.length / questionsPerPage);

  const currentQuestions = selectedQuestions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );

  const handleAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      onComplete(answers);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const allAnswered = currentQuestions.every(q => answers[q.id]);
  const progress = ((currentPage + 1) / totalPages) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-pink-900/40 via-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <Target className="h-8 w-8 text-pink-300" />
          <h2 className="text-2xl font-serif font-bold text-white">
            Advanced Interest Assessment
          </h2>
        </div>

        <div className="bg-amber-500/10 border border-amber-400/30 rounded-lg p-4 mb-6">
          <p className="text-white/90 text-sm mb-2">
            <strong className="text-amber-300">Instructions:</strong> Choose which activity you would prefer between each pair. Select Option A or Option B.
          </p>
          <p className="text-white/70 text-xs">
            ⚠️ Make your choice based on what you would genuinely prefer to do, not what seems more impressive or desirable.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-pink-300"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-xs text-white/60 mt-2 text-center">
            Page {currentPage + 1} of {totalPages}
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-8">
          {currentQuestions.map((question, index) => (
            <div key={question.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white/60 text-xs mb-3">Question {currentPage * questionsPerPage + index + 1}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={() => handleAnswer(question.id, 'A')}
                  className={`p-4 rounded-lg text-left transition ${
                    answers[question.id] === 'A'
                      ? 'bg-pink-300 text-gray-900 border-2 border-pink-400'
                      : 'bg-white/10 text-white hover:bg-white/20 border-2 border-transparent'
                  }`}
                >
                  <span className="text-xs font-semibold mb-1 block">Option A</span>
                  <span className="text-sm">{question.optionA.text}</span>
                </button>

                <button
                  onClick={() => handleAnswer(question.id, 'B')}
                  className={`p-4 rounded-lg text-left transition ${
                    answers[question.id] === 'B'
                      ? 'bg-pink-300 text-gray-900 border-2 border-pink-400'
                      : 'bg-white/10 text-white hover:bg-white/20 border-2 border-transparent'
                  }`}
                >
                  <span className="text-xs font-semibold mb-1 block">Option B</span>
                  <span className="text-sm">{question.optionB.text}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 0}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={!allAnswered}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-300 to-purple-400 text-gray-900 font-semibold px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition"
          >
            {currentPage < totalPages - 1 ? 'Next' : 'Submit'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================
// APTITUDE TEST SCREEN (Section-Adaptive - 30 Questions)
// ============================================================

function AptitudeTestScreen({ answers, setAnswers, onComplete }) {
  const [currentSection, setCurrentSection] = useState('math'); // math, logic, verbal
  const [questionQueue, setQuestionQueue] = useState([]); // Queue of questions to ask
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sectionPerformance, setSectionPerformance] = useState({
    math: { easy: { correct: 0, total: 0 }, medium: { correct: 0, total: 0 }, hard: { correct: 0, total: 0 } },
    logic: { easy: { correct: 0, total: 0 }, medium: { correct: 0, total: 0 }, hard: { correct: 0, total: 0 } },
    verbal: { easy: { correct: 0, total: 0 }, medium: { correct: 0, total: 0 }, hard: { correct: 0, total: 0 } }
  });

  // Initialize question queue for current section
  useEffect(() => {
    // Start with 3 easy questions for the current section
    const easyQuestions = APTITUDE_QUESTIONS[currentSection]
      .filter(q => q.difficulty === 'easy')
      .slice(0, 3);
    setQuestionQueue(easyQuestions);
    setCurrentQuestionIndex(0);
  }, [currentSection]);

  const currentQuestion = questionQueue[currentQuestionIndex];
  const totalQuestionsInSection = questionQueue.length;

  const handleAnswer = (answerId, value) => {
    setAnswers({ ...answers, [answerId]: value });
  };

  const handleNext = () => {
    if (!currentQuestion) return;

    // Check if current answer is correct
    const isCorrect = answers[currentQuestion.id] === currentQuestion.answer;
    const difficulty = currentQuestion.difficulty;

    // Update section performance
    const updatedPerf = { ...sectionPerformance };
    updatedPerf[currentSection][difficulty].total += 1;
    if (isCorrect) {
      updatedPerf[currentSection][difficulty].correct += 1;
    }
    setSectionPerformance(updatedPerf);

    // Check if we've reached the end of current question queue
    if (currentQuestionIndex < totalQuestionsInSection - 1) {
      // Move to next question in queue
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Determine if we should continue in this section or move to next
      const perf = updatedPerf[currentSection];
      const totalAnswered = perf.easy.total + perf.medium.total + perf.hard.total;

      // Section complete: exactly 10 questions answered
      if (totalAnswered >= 10) {
        // Move to next section
        if (currentSection === 'math') {
          setCurrentSection('logic');
        } else if (currentSection === 'logic') {
          setCurrentSection('verbal');
        } else {
          // All sections complete
          onComplete(answers);
        }
      } else {
        // Add more questions to queue based on performance
        let nextDifficulty = 'easy';
        let questionsToAdd = 1; // Default to adding 1 question at a time

        // Determine next difficulty and how many questions to add
        if (perf.easy.total === 3 && perf.easy.correct >= 2) {
          // Student did well on easy, move to medium
          if (perf.medium.total === 0) {
            nextDifficulty = 'medium';
            questionsToAdd = Math.min(3, 10 - totalAnswered); // Add up to 3 medium questions
          } else if (perf.medium.total === 3 && perf.medium.correct >= 2) {
            // Student did well on medium, move to hard
            nextDifficulty = 'hard';
            questionsToAdd = 10 - totalAnswered; // Fill remaining with hard (up to 4)
          } else if (perf.medium.total === 3 && perf.medium.correct < 2) {
            // Student struggled on medium, give more medium
            nextDifficulty = 'medium';
            questionsToAdd = 10 - totalAnswered; // Fill remaining with medium
          } else {
            // Continue with medium
            nextDifficulty = 'medium';
            questionsToAdd = Math.min(3 - perf.medium.total, 10 - totalAnswered);
          }
        } else if (perf.easy.total === 3 && perf.easy.correct < 2) {
          // Student struggled on easy, give more easy questions
          nextDifficulty = 'easy';
          questionsToAdd = 10 - totalAnswered; // Fill all remaining with easy
        } else if (perf.hard.total > 0) {
          // Already in hard difficulty
          nextDifficulty = 'hard';
          questionsToAdd = 10 - totalAnswered;
        }

        const nextQuestions = APTITUDE_QUESTIONS[currentSection]
          .filter(q => q.difficulty === nextDifficulty)
          .filter(q => !questionQueue.find(qq => qq.id === q.id)) // Don't repeat questions
          .slice(0, questionsToAdd);

        if (nextQuestions.length > 0) {
          setQuestionQueue([...questionQueue, ...nextQuestions]);
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          // No more questions available in this difficulty, try to fill with any available
          const anyQuestions = APTITUDE_QUESTIONS[currentSection]
            .filter(q => !questionQueue.find(qq => qq.id === q.id))
            .slice(0, 10 - totalAnswered);

          if (anyQuestions.length > 0) {
            setQuestionQueue([...questionQueue, ...anyQuestions]);
            setCurrentQuestionIndex(currentQuestionIndex + 1);
          } else {
            // No more questions available at all, move to next section
            if (currentSection === 'math') {
              setCurrentSection('logic');
            } else if (currentSection === 'logic') {
              setCurrentSection('verbal');
            } else {
              onComplete(answers);
            }
          }
        }
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
    // Note: Cannot go back to previous section in adaptive test
  };

  const totalAnswered = Object.keys(answers).length;
  const totalQuestions = 30; // Approximate total
  const progress = Math.min((totalAnswered / totalQuestions) * 100, 100);

  const sectionTitles = {
    math: 'Mathematical Aptitude',
    logic: 'Logical Reasoning',
    verbal: 'Verbal Ability'
  };

  const sectionIcons = {
    math: '∑',
    logic: '⚙️',
    verbal: '📖'
  };

  if (!currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-violet-900/40 via-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
          <p className="text-white text-center">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-violet-900/40 via-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="h-8 w-8 text-purple-400" />
          <h2 className="text-2xl font-serif font-bold text-white">
            Aptitude Assessment
          </h2>
        </div>

        <div className="bg-amber-500/10 border border-amber-400/30 rounded-lg p-4 mb-6">
          <p className="text-white/90 text-sm mb-2">
            <strong className="text-amber-300">Instructions:</strong> This is an adaptive test with exactly 10 questions per section. The difficulty adjusts based on your performance.
          </p>
          <ul className="text-white/70 text-xs space-y-1 ml-4 list-disc">
            <li>Start with 3 Easy questions</li>
            <li>If you get 2+ correct → 3 Medium questions</li>
            <li>If you get 2+ Medium correct → 4 Hard questions</li>
            <li>If you struggle, you'll receive more questions at that difficulty to reach 10 total</li>
            <li><strong>Total: Exactly 10 questions per section (Math, Logic, Verbal)</strong></li>
          </ul>
          <p className="text-white/70 text-xs mt-2">
            ⚠️ Read each question thoroughly and choose the best answer. Your first instinct is often correct - avoid second-guessing yourself.
          </p>
        </div>

        {/* Section Tabs */}
        <div className="flex gap-2 mb-6">
          {['math', 'logic', 'verbal'].map((section) => (
            <div
              key={section}
              className={`flex-1 py-2 px-3 rounded-lg text-center text-sm font-medium transition ${
                currentSection === section
                  ? 'bg-purple-400 text-gray-900'
                  : 'bg-white/10 text-white/50'
              }`}
            >
              {sectionIcons[section]} {sectionTitles[section]}
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-purple-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-xs text-white/60 mt-2 text-center">
            {totalAnswered} / {totalQuestions} answered
          </p>
        </div>

        {/* Question */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10 mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-white/60">
              Question {currentQuestionIndex + 1} of {totalQuestionsInSection}
            </span>
            <span className={`text-xs px-2 py-1 rounded ${
              currentQuestion.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' :
              currentQuestion.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
              'bg-red-500/20 text-red-300'
            }`}>
              {currentQuestion.difficulty.toUpperCase()}
            </span>
          </div>

          <p className="text-white text-lg mb-6 font-medium">{currentQuestion.question}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(currentQuestion.id, option)}
                className={`p-4 rounded-lg text-left transition ${
                  answers[currentQuestion.id] === option
                    ? 'bg-purple-400 text-gray-900 border-2 border-purple-500'
                    : 'bg-white/10 text-white hover:bg-white/20 border-2 border-transparent'
                }`}
              >
                <span className="font-medium">{String.fromCharCode(65 + index)}. </span>
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentSection === 'math' && currentQuestionIndex === 0}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={!answers[currentQuestion.id]}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-400 to-indigo-500 text-white font-semibold px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition"
          >
            {currentSection === 'verbal' && currentQuestionIndex === totalQuestionsInSection - 1 ? 'Submit' : 'Next'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================
// DASHBOARD SCREEN (Final Results)
// ============================================================

function DashboardScreen({ userData, path, bigFiveScores, riasecScores, aptitudeScores, numerologyReport }) {
  // Get top 3 RIASEC types
  const topRiasecTypes = Object.entries(riasecScores || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([type]) => type);

  // Numerology-RIASEC mapping and alignment calculation
  const calculateNumerologyAlignment = () => {
    if (!numerologyReport) return { percentage: 0, insights: [] };

    const basicNum = numerologyReport.basicNumber;
    const destinyNum = numerologyReport.destinyNumber;

    // Numerology to RIASEC mapping
    const numerologyRIASECMap = {
      1: ['E', 'R'], // Leadership, Independent -> Enterprising, Realistic
      2: ['S', 'A'], // Cooperative, Sensitive -> Social, Artistic
      3: ['A', 'E'], // Creative, Expressive -> Artistic, Enterprising
      4: ['C', 'R'], // Organized, Practical -> Conventional, Realistic
      5: ['E', 'I'], // Dynamic, Versatile -> Enterprising, Investigative
      6: ['S', 'A'], // Caring, Harmonious -> Social, Artistic
      7: ['I', 'R'], // Analytical, Introspective -> Investigative, Realistic
      8: ['E', 'R'], // Ambitious, Authoritative -> Enterprising, Realistic
      9: ['S', 'A']  // Humanitarian, Compassionate -> Social, Artistic
    };

    const basicPreferred = numerologyRIASECMap[basicNum] || [];
    const destinyPreferred = numerologyRIASECMap[destinyNum] || [];
    const allNumerologyTypes = [...new Set([...basicPreferred, ...destinyPreferred])];

    // Calculate alignment
    const matchCount = topRiasecTypes.filter(type => allNumerologyTypes.includes(type)).length;
    const alignmentPercentage = Math.round((matchCount / topRiasecTypes.length) * 100);

    return {
      percentage: alignmentPercentage,
      basicPreferred,
      destinyPreferred,
      matches: topRiasecTypes.filter(type => allNumerologyTypes.includes(type))
    };
  };

  const numerologyAlignment = calculateNumerologyAlignment();

  // Get recommendation
  const getRecommendation = () => {
    if (path === 'stream') {
      // Stream recommendation based on RIASEC
      const top = topRiasecTypes[0];
      if (['R', 'I'].includes(top)) return STREAM_RECOMMENDATIONS.Science;
      if (['E', 'C'].includes(top)) return STREAM_RECOMMENDATIONS.Commerce;
      if (['A', 'S'].includes(top)) return STREAM_RECOMMENDATIONS.Humanities;
      return STREAM_RECOMMENDATIONS.Science; // default
    } else {
      // Career cluster recommendation
      const matchingClusters = [];

      Object.entries(CAREER_CLUSTERS).forEach(([key, cluster]) => {
        const overlap = cluster.riasecCodes.filter(code => topRiasecTypes.includes(code)).length;
        if (overlap > 0) {
          matchingClusters.push({ key, cluster, overlap });
        }
      });

      matchingClusters.sort((a, b) => b.overlap - a.overlap);
      return matchingClusters.slice(0, 3);
    }
  };

  const recommendation = getRecommendation();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-auric-gold via-pink-300 to-purple-400 rounded-2xl p-8"
      >
        <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-900" />
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2 text-center">
          {userData.name}'s Psychometric Profile
        </h2>
        <p className="text-gray-800 text-sm text-center mb-6">
          Complete 3-Pillar Assessment Report
        </p>

        {/* Student Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-900/20 rounded-lg p-6">
          <div>
            <p className="text-gray-700 text-xs font-medium mb-1">Full Name</p>
            <p className="text-gray-900 font-semibold">{userData.name}</p>
          </div>
          <div>
            <p className="text-gray-700 text-xs font-medium mb-1">Date of Birth</p>
            <p className="text-gray-900 font-semibold">{new Date(userData.dob).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
          </div>
          <div>
            <p className="text-gray-700 text-xs font-medium mb-1">Current Class</p>
            <p className="text-gray-900 font-semibold">Class {userData.class}</p>
          </div>
          <div>
            <p className="text-gray-700 text-xs font-medium mb-1">School</p>
            <p className="text-gray-900 font-semibold">{userData.schoolName}</p>
          </div>
          <div>
            <p className="text-gray-700 text-xs font-medium mb-1">City</p>
            <p className="text-gray-900 font-semibold">{userData.city}{userData.state ? `, ${userData.state}` : ''}</p>
          </div>
          {userData.email && (
            <div>
              <p className="text-gray-700 text-xs font-medium mb-1">Email</p>
              <p className="text-gray-900 font-semibold text-sm">{userData.email}</p>
            </div>
          )}
          {userData.phone && (
            <div>
              <p className="text-gray-700 text-xs font-medium mb-1">Phone</p>
              <p className="text-gray-900 font-semibold">{userData.phone}</p>
            </div>
          )}
          <div>
            <p className="text-gray-700 text-xs font-medium mb-1">Assessment Date</p>
            <p className="text-gray-900 font-semibold">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
      </motion.div>

      {/* Futuristic Dashboard Grid - 3 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: RIASEC Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-gray-900 via-cyan-900/20 to-black backdrop-blur-xl border border-cyan-400/30 rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300"
          style={{
            boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)',
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Target className="h-6 w-6 text-cyan-400" />
            <h3 className="text-lg font-serif font-bold text-white">Interest Hexagon</h3>
          </div>
          <p className="text-white/60 text-xs mb-4">RIASEC Model Visualization</p>

          <div className="aspect-square">
            <RadarChart
              data={{
                labels: ['Realistic', 'Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional'],
                datasets: [{
                  label: 'Your Interests',
                  data: [
                    riasecScores?.R || 0,
                    riasecScores?.I || 0,
                    riasecScores?.A || 0,
                    riasecScores?.S || 0,
                    riasecScores?.E || 0,
                    riasecScores?.C || 0
                  ],
                  backgroundColor: 'rgba(0, 255, 255, 0.2)',
                  borderColor: 'rgba(0, 255, 255, 0.8)',
                  borderWidth: 2,
                  pointBackgroundColor: 'rgba(0, 255, 255, 1)',
                  pointBorderColor: '#fff',
                  pointHoverBackgroundColor: '#fff',
                  pointHoverBorderColor: 'rgba(0, 255, 255, 1)',
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#00FFFF',
                    bodyColor: '#FFFFFF',
                    borderColor: '#00FFFF',
                    borderWidth: 1,
                  }
                },
                scales: {
                  r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                      stepSize: 20,
                      color: 'rgba(255, 255, 255, 0.5)',
                      backdropColor: 'transparent'
                    },
                    grid: {
                      color: 'rgba(0, 255, 255, 0.2)',
                    },
                    pointLabels: {
                      color: '#00FFFF',
                      font: {
                        size: 11,
                        weight: 'bold'
                      }
                    }
                  }
                }
              }}
            />
          </div>

          <div className="mt-4 bg-cyan-400/10 border border-cyan-400/30 rounded-lg p-3">
            <h4 className="text-cyan-300 font-semibold text-sm mb-2">Top 3 Interest Types:</h4>
            <div className="space-y-1">
              {topRiasecTypes.slice(0, 3).map((type, index) => (
                <div key={type} className="flex items-center justify-between text-xs">
                  <span className="text-white/80">{index + 1}. {RIASEC_INFO[type].title}</span>
                  <span className="text-cyan-400 font-bold">{riasecScores?.[type]}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Column 2: Big Five Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-black backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300"
          style={{
            boxShadow: '0 0 15px rgba(138, 43, 226, 0.3)',
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Brain className="h-6 w-6 text-purple-400" />
            <h3 className="text-lg font-serif font-bold text-white">Personality Spectrum</h3>
          </div>
          <p className="text-white/60 text-xs mb-4">Big Five Trait Rankings</p>

          <div className="aspect-[4/3]">
            <BarChart
              data={{
                labels: ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism'],
                datasets: [{
                  label: 'Trait Score',
                  data: [
                    bigFiveScores?.Openness || 0,
                    bigFiveScores?.Conscientiousness || 0,
                    bigFiveScores?.Extraversion || 0,
                    bigFiveScores?.Agreeableness || 0,
                    bigFiveScores?.Neuroticism || 0
                  ],
                  backgroundColor: [
                    'rgba(138, 43, 226, 0.7)',
                    'rgba(147, 51, 234, 0.7)',
                    'rgba(168, 85, 247, 0.7)',
                    'rgba(192, 132, 252, 0.7)',
                    'rgba(216, 180, 254, 0.7)'
                  ],
                  borderColor: [
                    'rgba(138, 43, 226, 1)',
                    'rgba(147, 51, 234, 1)',
                    'rgba(168, 85, 247, 1)',
                    'rgba(192, 132, 252, 1)',
                    'rgba(216, 180, 254, 1)'
                  ],
                  borderWidth: 2
                }]
              }}
              options={{
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#a855f7',
                    bodyColor: '#FFFFFF',
                    borderColor: '#a855f7',
                    borderWidth: 1,
                  }
                },
                scales: {
                  x: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                      color: 'rgba(255, 255, 255, 0.5)',
                    },
                    grid: {
                      color: 'rgba(138, 43, 226, 0.2)',
                    }
                  },
                  y: {
                    ticks: {
                      color: '#a855f7',
                      font: {
                        size: 10,
                        weight: 'bold'
                      }
                    },
                    grid: {
                      display: false
                    }
                  }
                }
              }}
            />
          </div>

          <div className="mt-4 space-y-2">
            {Object.entries(bigFiveScores || {}).map(([trait, score]) => (
              <div key={trait} className="bg-purple-400/10 border border-purple-400/30 rounded-lg p-2">
                <p className="text-white/70 text-xs">
                  {score >= 60 ? BIG_FIVE_INFO[trait].high : BIG_FIVE_INFO[trait].low}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Column 3: Primary Code Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gray-900 via-yellow-900/20 to-black backdrop-blur-xl border border-yellow-400/30 rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300"
          style={{
            boxShadow: '0 0 15px rgba(255, 255, 0, 0.3)',
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="h-6 w-6 text-yellow-400" />
            <h3 className="text-lg font-serif font-bold text-white">Career DNA</h3>
          </div>
          <p className="text-white/60 text-xs mb-6">Your Primary RIASEC Code</p>

          <div className="text-center mb-6">
            <div className="inline-block bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl p-6 mb-4">
              <p className="text-gray-900 text-4xl font-bold tracking-wider">
                {topRiasecTypes.slice(0, 3).join('-')}
              </p>
            </div>
            <p className="text-white/80 text-sm">
              {topRiasecTypes.slice(0, 3).map(type => RIASEC_INFO[type].title).join(' · ')}
            </p>
          </div>

          <div className="space-y-4">
            {topRiasecTypes.slice(0, 3).map((type, index) => (
              <div key={type} className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-400 text-gray-900 flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold mb-1">{RIASEC_INFO[type].title}</p>
                    <p className="text-white/70 text-xs mb-2">{RIASEC_INFO[type].description}</p>
                    <p className="text-yellow-400 text-xs">
                      <span className="font-semibold">Key Traits:</span> {RIASEC_INFO[type].traits}
                    </p>
                    <p className="text-white/60 text-xs mt-1">
                      <span className="font-semibold">Careers:</span> {RIASEC_INFO[type].careers}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Aptitude Scores - Futuristic */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-gray-900 via-green-900/20 to-black backdrop-blur-xl border border-green-400/30 rounded-2xl p-8 hover:shadow-[0_0_30px_rgba(0,255,0,0.3)] transition-all duration-300"
      >
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="h-6 w-6 text-green-400" />
          <h3 className="text-xl font-serif font-bold text-white">Cognitive Aptitude Matrix</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(aptitudeScores?.scores || {}).map(([section, score]) => (
            <div
              key={section}
              className="relative bg-gradient-to-br from-green-900/40 via-emerald-900/20 to-black rounded-xl p-6 border border-green-400/30 overflow-hidden group hover:scale-105 transition-transform duration-300"
              style={{
                boxShadow: '0 0 10px rgba(0, 255, 0, 0.2)',
              }}
            >
              {/* Animated Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/10 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-green-400 font-bold text-lg capitalize">
                    {section === 'math' ? '∑ Mathematical' : section === 'logic' ? '⚙️ Logical' : '📖 Verbal'}
                  </h4>
                  <div className="w-12 h-12 rounded-full bg-green-400/20 border-2 border-green-400 flex items-center justify-center">
                    <span className="text-green-400 font-bold text-xs">
                      {Math.round((score / 60) * 100)}%
                    </span>
                  </div>
                </div>

                <div className="text-center mb-4">
                  <p className="text-green-300 text-5xl font-bold mb-1">{score}</p>
                  <p className="text-white/60 text-xs">points / 60 max</p>
                </div>

                {/* Score Breakdown with Progress Bars */}
                <div className="space-y-2 bg-black/30 rounded-lg p-3 border border-green-400/20">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/70">Easy</span>
                      <span className="text-green-400 font-semibold">
                        {aptitudeScores?.breakdown?.[section]?.easy || 0}/10 (+1 each)
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${((aptitudeScores?.breakdown?.[section]?.easy || 0) / 10) * 100}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/70">Medium</span>
                      <span className="text-green-400 font-semibold">
                        {aptitudeScores?.breakdown?.[section]?.medium || 0}/10 (+2 each)
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-yellow-400 to-amber-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${((aptitudeScores?.breakdown?.[section]?.medium || 0) / 10) * 100}%` }}
                        transition={{ duration: 1, delay: 0.6 }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/70">Hard</span>
                      <span className="text-green-400 font-semibold">
                        {aptitudeScores?.breakdown?.[section]?.hard || 0}/10 (+3 each)
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-red-400 to-orange-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${((aptitudeScores?.breakdown?.[section]?.hard || 0) / 10) * 100}%` }}
                        transition={{ duration: 1, delay: 0.7 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recommendation - Futuristic */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative bg-gradient-to-br from-gray-900 via-orange-900/30 to-black backdrop-blur-xl border border-orange-400/40 rounded-2xl p-8 overflow-hidden"
        style={{
          boxShadow: '0 0 20px rgba(255, 165, 0, 0.3)',
        }}
      >
        {/* Animated Background Gradient */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'linear-gradient(90deg, rgba(255,165,0,0) 0%, rgba(255,165,0,0.2) 50%, rgba(255,165,0,0) 100%)',
            backgroundSize: '200% 100%',
            animation: 'gradientPulse 3s ease infinite',
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-gray-900" />
            </div>
            <h3 className="text-2xl font-serif font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
              {path === 'stream' ? 'Recommended Educational Stream' : 'Top Career Clusters'}
            </h3>
          </div>

          {path === 'stream' ? (
            <div className="bg-gradient-to-r from-orange-400/20 to-amber-500/20 border border-orange-400/40 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 flex items-center justify-center text-gray-900 font-bold text-2xl">
                  ⭐
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-orange-300 mb-2">{recommendation.title}</h4>
                  <p className="text-white/90 mb-4">{recommendation.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-black/30 rounded-lg p-4 border border-orange-400/30">
                      <p className="text-orange-400 text-xs font-semibold mb-2">BEST FOR</p>
                      <p className="text-white/90 text-sm">{recommendation.bestFor}</p>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4 border border-orange-400/30">
                      <p className="text-orange-400 text-xs font-semibold mb-2">CORE SUBJECTS</p>
                      <p className="text-white/90 text-sm">{recommendation.subjects}</p>
                    </div>
                  </div>

                  <div className="mt-4 bg-black/30 rounded-lg p-4 border border-orange-400/30">
                    <p className="text-orange-400 text-xs font-semibold mb-2">CAREER PATHWAYS</p>
                    <p className="text-white/90 text-sm">{recommendation.careers}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendation.map(({ key, cluster, overlap }, index) => (
                <div
                  key={key}
                  className="bg-gradient-to-r from-orange-400/10 to-amber-500/10 border border-orange-400/30 rounded-xl p-5 hover:scale-[1.02] transition-transform duration-300"
                  style={{
                    boxShadow: '0 0 10px rgba(255, 165, 0, 0.2)',
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 flex items-center justify-center text-gray-900 font-bold text-xl">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-orange-300 mb-2">{cluster.title}</h4>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {cluster.riasecCodes.map(code => (
                          <span
                            key={code}
                            className="px-2 py-1 bg-orange-400/20 border border-orange-400/40 rounded-md text-orange-300 text-xs font-semibold"
                          >
                            {code}
                          </span>
                        ))}
                      </div>
                      <p className="text-white/80 text-sm mb-2">
                        <span className="text-orange-400 font-semibold">Match Strength:</span> {overlap} of your top 3 interests align with this cluster
                      </p>
                      <p className="text-white/70 text-xs">
                        <span className="text-orange-400 font-semibold">Fields:</span> {cluster.fields.join(' • ')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes gradientPulse {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Numerology Integration - Futuristic */}
      {numerologyReport && DATA.educationalGuidance[numerologyReport.basicNumber] && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative bg-gradient-to-br from-gray-900 via-indigo-900/30 to-black backdrop-blur-xl border border-indigo-400/40 rounded-2xl p-8 overflow-hidden"
          style={{
            boxShadow: '0 0 25px rgba(99, 102, 241, 0.4)',
          }}
        >
          {/* Animated Cosmic Background */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.3) 0%, rgba(0, 0, 0, 0) 70%)',
              animation: 'pulse 4s ease-in-out infinite',
            }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 flex items-center justify-center animate-pulse">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-serif font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Vedic Numerology Cosmic Alignment
              </h3>
            </div>

            {/* Alignment Percentage - Enhanced */}
            <div className="bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 border-2 border-indigo-400/40 rounded-xl p-8 mb-6 relative overflow-hidden">
              {/* Glowing Border Animation */}
              <div className="absolute inset-0 rounded-xl border-2 border-indigo-400/60 animate-pulse" />

              <div className="relative z-10">
                <p className="text-white text-center text-lg mb-6 font-semibold">
                  Your cosmic numerology aligns with your psychometric profile
                </p>

                <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                  {/* Circular Progress with Glow */}
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-indigo-400/20 blur-2xl" />
                    <div className="relative w-32 h-32">
                      <svg className="transform -rotate-90 w-32 h-32">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="rgba(99, 102, 241, 0.2)"
                          strokeWidth="12"
                          fill="none"
                        />
                        <motion.circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="url(#gradient)"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 56}`}
                          strokeLinecap="round"
                          initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - numerologyAlignment.percentage / 100) }}
                          transition={{ duration: 2, delay: 0.8, ease: "easeInOut" }}
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="50%" stopColor="#a855f7" />
                            <stop offset="100%" stopColor="#ec4899" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <span className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
                            {numerologyAlignment.percentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Alignment Details */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 border border-indigo-400/50 rounded-lg mb-4">
                      <p className="text-2xl font-bold text-white">
                        {numerologyAlignment.percentage >= 67 ? '🌟 Strong Cosmic Support' : numerologyAlignment.percentage >= 34 ? '✨ Moderate Alignment' : '🔮 Explore New Paths'}
                      </p>
                    </div>

                    {numerologyAlignment.matches.length > 0 && (
                      <div className="bg-indigo-400/10 border border-indigo-400/30 rounded-lg p-4">
                        <p className="text-white/90 text-sm mb-2">
                          <span className="text-indigo-300 font-semibold">Numerology Favors:</span>
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                          {numerologyAlignment.matches.map(type => (
                            <span
                              key={type}
                              className="px-3 py-1 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 border border-indigo-400/40 rounded-full text-indigo-300 text-sm font-semibold"
                            >
                              {RIASEC_INFO[type].title}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Educational Guidance - Enhanced Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Number / Student Profile */}
              <div
                className="bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-black rounded-xl p-6 border border-indigo-400/30 hover:scale-[1.02] transition-transform duration-300"
                style={{
                  boxShadow: '0 0 15px rgba(99, 102, 241, 0.2)',
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                    {numerologyReport.basicNumber}
                  </div>
                  <h4 className="text-indigo-300 font-bold text-lg">
                    Student Profile · Basic Number
                  </h4>
                </div>

                <div className="space-y-4">
                  <div className="bg-black/30 rounded-lg p-4 border border-indigo-400/20">
                    <p className="text-indigo-400 text-xs font-semibold mb-2 uppercase tracking-wide">Learning Style</p>
                    <p className="text-white/90 text-sm">
                      {DATA.educationalGuidance[numerologyReport.basicNumber].learningStyle?.en ||
                       DATA.educationalGuidance[numerologyReport.basicNumber].learningStyle}
                    </p>
                  </div>

                  <div className="bg-black/30 rounded-lg p-4 border border-green-400/20">
                    <p className="text-green-400 text-xs font-semibold mb-2 uppercase tracking-wide">Natural Strengths</p>
                    <p className="text-white/90 text-sm">
                      {DATA.educationalGuidance[numerologyReport.basicNumber].strengths?.en ||
                       DATA.educationalGuidance[numerologyReport.basicNumber].strengths}
                    </p>
                  </div>

                  <div className="bg-black/30 rounded-lg p-4 border border-yellow-400/20">
                    <p className="text-yellow-400 text-xs font-semibold mb-2 uppercase tracking-wide">Potential Challenges</p>
                    <p className="text-white/90 text-sm">
                      {DATA.educationalGuidance[numerologyReport.basicNumber].challenges?.en ||
                       DATA.educationalGuidance[numerologyReport.basicNumber].challenges}
                    </p>
                  </div>
                </div>
              </div>

              {/* Destiny Number / Educational Path */}
              {DATA.educationalGuidance[numerologyReport.destinyNumber] && (
                <div
                  className="bg-gradient-to-br from-pink-900/40 via-purple-900/20 to-black rounded-xl p-6 border border-pink-400/30 hover:scale-[1.02] transition-transform duration-300"
                  style={{
                    boxShadow: '0 0 15px rgba(236, 72, 153, 0.2)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                      {numerologyReport.destinyNumber}
                    </div>
                    <h4 className="text-pink-300 font-bold text-lg">
                      Educational Path · Destiny Number
                    </h4>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-black/30 rounded-lg p-4 border border-pink-400/20">
                      <p className="text-pink-400 text-xs font-semibold mb-2 uppercase tracking-wide">Ideal Education Stream</p>
                      <p className="text-white/90 text-sm">
                        {DATA.educationalGuidance[numerologyReport.destinyNumber].educationStream?.en ||
                         DATA.educationalGuidance[numerologyReport.destinyNumber].educationStream}
                      </p>
                    </div>

                    <div className="bg-black/30 rounded-lg p-4 border border-purple-400/20">
                      <p className="text-purple-400 text-xs font-semibold mb-2 uppercase tracking-wide">Potential Career Paths</p>
                      <p className="text-white/90 text-sm">
                        {DATA.educationalGuidance[numerologyReport.destinyNumber].careerPath?.en ||
                         DATA.educationalGuidance[numerologyReport.destinyNumber].careerPath}
                      </p>
                    </div>

                    <div className="bg-black/30 rounded-lg p-4 border border-cyan-400/20">
                      <p className="text-cyan-400 text-xs font-semibold mb-2 uppercase tracking-wide">Guidance for Parents</p>
                      <p className="text-white/90 text-sm">
                        {DATA.educationalGuidance[numerologyReport.destinyNumber].parentalGuidance?.en ||
                         DATA.educationalGuidance[numerologyReport.destinyNumber].parentalGuidance}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Note Section */}
            <div className="mt-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-l-4 border-purple-400 rounded-lg p-4">
              <p className="text-white/90 text-sm">
                <span className="text-purple-400 font-bold">⚡ Fusion Note:</span> This unique assessment combines cutting-edge psychometric science with 5,000-year-old Vedic numerology wisdom. The alignment percentage shows how well your cosmic numbers support your measured interests and personality. Use both insights together for comprehensive career guidance.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Footer Actions - Futuristic */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <button
          onClick={() => window.print()}
          className="group relative bg-gradient-to-r from-cyan-900/40 to-blue-900/40 hover:from-cyan-800/60 hover:to-blue-800/60 text-cyan-300 border-2 border-cyan-400/50 px-8 py-4 rounded-xl font-semibold transition-all duration-300 overflow-hidden"
          style={{
            boxShadow: '0 0 15px rgba(0, 255, 255, 0.2)',
          }}
        >
          <span className="relative z-10 flex items-center gap-2">
            <span>🖨️</span>
            Print Report
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </button>

        <button
          onClick={() => window.location.reload()}
          className="group relative bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-orange-900/40 hover:from-purple-800/60 hover:via-pink-800/60 hover:to-orange-800/60 text-white border-2 border-purple-400/50 px-8 py-4 rounded-xl font-bold transition-all duration-300 overflow-hidden"
          style={{
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)',
          }}
        >
          <span className="relative z-10 flex items-center gap-2 bg-gradient-to-r from-purple-300 via-pink-300 to-orange-300 bg-clip-text text-transparent">
            <span>🔄</span>
            Take Another Assessment
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-pink-400/10 to-orange-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </button>
      </motion.div>
    </div>
  );
}
