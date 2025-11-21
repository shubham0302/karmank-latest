import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import CosmicBackground from '../components/CosmicBackground';
import { useAuth } from '../contexts/AuthContext';

// --- ICONS (Inline SVGs for portability) ---

const BookOpenIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M5.5 2A3.5 3.5 0 002 5.5v9A3.5 3.5 0 005.5 18h9a3.5 3.5 0 003.5-3.5v-9A3.5 3.5 0 0014.5 2h-9zM10 12H5.5a.5.5 0 01-.5-.5V5.5a.5.5 0 01.5-.5H10v7zM10 12v7a.5.5 0 00.5.5h4.5a.5.5 0 00.5-.5V5.5a.5.5 0 00-.5-.5H10v7z" />
  </svg>
);

const LinkIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12.586 4.414a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 5.586l4.586-4.586z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M12.586 10.414a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 11.586l4.586-4.586z" clipRule="evenodd" />
  </svg>
);

const BriefcaseIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M6 3a1 1 0 00-1 1v1H4a2 2 0 00-2 2v7a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1V4a1 1 0 10-2 0v1H7V4a1 1 0 00-1-1zm4 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
  </svg>
);

const FlaskIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.121l1.027 1.027a4 4 0 01-2.171.102l-.47 1.861a6 6 0 003.67-.142l.556 1.111a1 1 0 00.894.553h.448a2 2 0 001.92-1.445l.478-1.435a1 1 0 00-.553-1.239l-4-2.01A3 3 0 019 8.172z" clipRule="evenodd" />
  </svg>
);

const LoaderIcon = ({ className = "w-6 h-6 animate-spin" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const AlertCircleIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const WandIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M3.5 2.75a.75.75 0 00-1.5 0v1.5c0 .414.336.75.75.75h1.5a.75.75 0 000-1.5H3.5v-1.5zM5.05 5.05a.75.75 0 00-1.06-1.06L2.75 5.23a.75.75 0 001.06 1.06L5.05 5.05zM2 9.25a.75.75 0 00-.75.75v1.5a.75.75 0 001.5 0v-1.5A.75.75 0 002 9.25zM3.99 14.95a.75.75 0 00-1.06 1.06l1.24 1.24a.75.75 0 001.06-1.06L3.99 14.95zM9.25 18a.75.75 0 00.75-.75v-1.5a.75.75 0 00-1.5 0v1.5c0 .414.336.75.75.75zM14.95 16.01a.75.75 0 001.06-1.06l-1.24-1.24a.75.75 0 00-1.06 1.06l1.24 1.24zM18 10.75a.75.75 0 00-.75-.75h-1.5a.75.75 0 000 1.5h1.5c.414 0 .75-.336.75-.75zM16.01 3.99a.75.75 0 001.06-1.06l-1.24-1.24a.75.75 0 00-1.06 1.06l1.24 1.24zM12.06 7.94a.75.75 0 01.53 1.28l-2.25 2.25a.75.75 0 01-1.06 0l-2.25-2.25a.75.75 0 01.53-1.28H9.75v-2.5a.75.75 0 011.5 0v2.5h.81z" />
    </svg>
);

// --- ICONS FOR GOAL/BUSINESS CARDS ---
const GoalIcon = ({ name, className = "w-10 h-10 text-yellow-400 mb-3" }) => {
  const icons = {
    // --- Personal Goals ---
    Power: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.73-.626 1.18-.796M11.42 15.17L5.82 21M12 6.375l-1.06-1.06a4.5 4.5 0 00-6.364 6.364l10.94 10.94A4.5 4.5 0 0012 6.375z" /></svg>,
    Money: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0l.879-.659M7.5 14.25l6-6M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Luxury: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 7.756a4.5 4.5 0 10-8.5 0v8.5a.75.75 0 001.5 0v-8.5a3 3 0 116 0v8.5a.75.75 0 001.5 0v-8.5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75h.008v.008H12v-.008z" /></svg>,
    Relationships: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>,
    Harmony: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15L15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
    Health: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h3m3 0h3m3 0h3m3 0h3M3.75 6.75h3m3 0h3m3 0h3m3 0h3m-16.5 8.25h3m3 0h3m3 0h3m3 0h3" /></svg>,
    SpiritualGrowth: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-6.364-.386l1.591-1.591M3 12h2.25m.386-6.364l1.591 1.591M12 12a2.25 2.25 0 00-2.25 2.25c0 1.357 1.623 2.001 2.805 1.343a.75.75 0 01.99 0c1.182.658 2.805-.008 2.805-1.343A2.25 2.25 0 0012 12z" /></svg>,
    CareerSuccess: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>,
    RecognitionFame: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.31h5.4c.566 0 .791.731.391 1.056l-4.36 3.16a.563.563 0 00-.182.64l1.634 5.234a.563.563 0 01-.864.632l-4.36-3.16a.563.563 0 00-.656 0l-4.36 3.16a.563.563 0 01-.864-.632l1.634-5.234a.563.563 0 00-.182-.64l-4.36-3.16a.563.563 0 01.39-1.056h5.4a.563.563 0 00.475-.31l2.125-5.11z" /></svg>,
    CreativityInnovation: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-3.75 0m3.75 0a12.06 12.06 0 00-3.75 0m9.75-4.564A12.016 12.016 0 0112 21a12.016 12.016 0 01-7.5-3.086m15 0a12.016 12.016 0 00-7.5 3.086m7.5-3.086c-.511 1.657-1.14 3.226-1.85 4.75M3 12a9 9 0 019-9m9 9a9 9 0 01-9 9m-9-9H3m18 0h-3.86m-4.14 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>,
    Stability: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>,
    Freedom: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>,

    // --- Business Categories ---
    "Food & Creativity": <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 00-1.473-1.305" /></svg>,
    "Authority & Leadership": <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15 9H9m6 0a3 3 0 013 3v5.25m-3-8.25a3 3 0 00-3-3H9a3 3 0 00-3 3v5.25m6 0v3m-3-3v3m-3-3v3M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    "Money & Finance": <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0l.879-.659M7.5 14.25l6-6M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    "Travel & Exploration": <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.875L6 12z" /></svg>,
    "Education": <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>,
  };
  return icons[name] || <svg className={className} />;
};


// --- DATA: VEDIC CONSTANTS ---
const VEDIC_CONSTANTS = {
  numberDetails: {
    1: { name: "Surya (Sun)", description: "Carries a confident, ambitious, and driven leadership quality. They are inspiring but don't take orders easily.", coreVibration: "leadership-driven" },
    2: { name: "Chandra (Moon)", description: "Emotional and caring, needing constant motivation. They seek love, appreciation, and support.", coreVibration: "emotional" },
    3: { name: "Guru (Jupiter)", description: "Wise, disciplined, and family-oriented. They have strong values and resist temptation.", coreVibration: "wise" },
    4: { name: "Rahu (North Node)", description: "Adventurous and risk-taking, but prone to overthinking and mood swings. Plans may not always work out.", coreVibration: "unconventional" },
    5: { name: "Budh (Mercury)", description: "Logical and born for business. They are masters of money and value every penny.", coreVibration: "intellectual" },
    6: { name: "Shukra (Venus)", description: "Naturally charming, especially to the opposite gender. They love luxury, fashion, and good food, and can be blunt.", coreVibration: "harmonious" },
    7: { name: "Ketu (South Node)", description: "Lucky, with a natural inclination towards spirituality and deep, logical thinking. Travel is often meaningful.", coreVibration: "spiritual" },
    8: { name: "Shani (Saturn)", description: "Hard-working, though life may feel slow. They have a soft heart, strong self-respect, and a belief in justice.", coreVibration: "disciplined" },
    9: { name: "Mangal (Mars)", description: "Bold, confident, and full of energy. They are quick to act, love challenges, and feel a need to prove themselves.", coreVibration: "energetic" }
  },
};

// --- DATA: PYTHAGOREAN CONSTANTS ---
const PYTHAGOREAN_CONSTANTS = {
  letterData: {
    A: { num: 1, repeat: "Amplifies ambition" }, B: { num: 2, repeat: "Emotional depth" }, C: { num: 3, repeat: "Success after overcoming difficulties" }, D: { num: 4, repeat: "Overcomes limitations with patience" }, E: { num: 5, repeat: "Acquires fame through writing or oratory" }, F: { num: 6, repeat: "Protection in all family matters" }, G: { num: 7, repeat: "A clever analyst who understands motives" }, H: { num: 8, repeat: "Strong potential for material progress" }, I: { num: 9, repeat: "Signifies extreme sensitivity and suffering" },
    J: { num: 1, repeat: "Shifts focus quickly" }, K: { num: 2, repeat: "Emotional fluctuation" }, L: { num: 3, repeat: "Keen insight into motives" }, M: { num: 4, repeat: "Never accepts defeat" }, N: { num: 5, repeat: "Cycles of luck" }, O: { num: 6, repeat: "Can exaggerate problems" }, P: { num: 7, repeat: "Power and success follow" }, Q: { num: 8, repeat: "Manages others well" }, R: { num: 9, repeat: "Needs discretion" },
    S: { num: 1, repeat: "Easily hurt by betrayal" }, T: { num: 2, repeat: "Devotion amplified" }, U: { num: 3, repeat: "Worries unnecessarily" }, V: { num: 4, repeat: "Strong results from hard work" }, W: { num: 5, repeat: "Risk-taking amplified" }, X: { num: 6, repeat: "Conservative outlook" }, Y: { num: 7, repeat: "Keeps secrets" }, Z: { num: 8, repeat: "Steady effort" }
  },
  numberMeanings: {
    1: "🔥 THE ALPHA. You're not here to follow—you're here to dominate. Leadership, independence, and raw ambition. Number 1s are trailblazers who create empires from thin air. Your weakness? Your ego might write checks your patience can't cash. Stay humble or get humbled.",
    2: "🤝 THE DIPLOMAT. You're the glue that holds everything together. Cooperation, emotional intelligence, and strategic partnerships define you. Number 2s are the behind-the-scenes power players. Your Achilles' heel? Analysis paralysis and taking criticism too personally. Decide, then execute.",
    3: "🎨 THE COMMUNICATOR. You turn ideas into gold through creativity and charisma. Self-expression, innovation, and magnetic charm. Number 3s are the rockstars of numerology—everyone wants to work with you. The trap? Scattered focus and shiny object syndrome. Pick ONE thing and crush it.",
    4: "🏗️ THE BUILDER. While others dream, you execute. Stability, discipline, and rock-solid work ethic. Number 4s are the foundation every empire needs. Your challenge? You're so busy building you forget to pivot when the market changes. Adapt or die.",
    5: "⚡ THE DISRUPTOR. Freedom, adventure, and calculated risk-taking. Number 5s are the entrepreneurs who break every rule and win anyway. You're versatile, electric, and unstoppable. But beware: your fear of commitment might leave you with nothing to show for all that energy. Commit to ONE vision.",
    6: "💎 THE NURTURER. Love, luxury, and high-level service. Number 6s build brands people are obsessed with. You're the master of customer experience and community. The pitfall? You give so much you burn out. Protect your energy like it's your most valuable asset—because it is.",
    7: "🧠 THE STRATEGIST. You're the analyst who sees patterns no one else can. Introspection, research, and spiritual depth. Number 7s are the consultants and thought leaders who charge premium rates because they're THAT good. The risk? Isolation. Even geniuses need a team.",
    8: "💰 THE EXECUTIVE. Power, ambition, and material mastery. Number 8s are CEOs, moguls, and empire-builders. You understand leverage, scale, and the game of money. Your shadow side? Obsession with status can cost you your soul. Build wealth AND meaning.",
    9: "🌍 THE VISIONARY. Compassion, global impact, and humanitarian genius. Number 9s are the ones who change the world—not just their bank account. You're selfless, idealistic, and deeply magnetic. The danger? Martyrdom. You can't pour from an empty cup. Fill yourself first, then serve the world.",
    11: "⚡⚡ MASTER INTUITIVE. You're not just inspired—you're a channel for lightning-bolt ideas that reshape industries. 11s are spiritual entrepreneurs with direct access to universal intelligence. You're here to inspire movements, not just businesses. The catch? The pressure to 'save the world' can paralyze you. Execute imperfectly. Your vision is too big to wait for perfection.",
    22: "🏛️ MASTER ARCHITECT. You don't build businesses—you build legacies. Grand visions meet ruthless execution. 22s are practical idealists who turn impossible dreams into billion-dollar realities. You're the Elon Musk energy of numerology. The trap? Burnout from carrying too much responsibility. Delegate or crumble.",
    33: "🕊️ MASTER HEALER. You're not just successful—you're transformational. 33s are the coaches, teachers, and leaders who elevate everyone around them. You turn pain into purpose and wounds into wisdom. The challenge? Compassion fatigue. You can't heal the world if you're broken. Heal yourself first, then scale your impact."
  },
  vowels: ["A", "E", "I", "O", "U"],
  harmonyGroups: [[1, 5, 7], [2, 4, 8], [3, 6, 9]]
};

// --- DATA: KARMANK CONSTANTS ---
const KARMANK_CONSTANTS = {
  letterValues: {
    'A': 1, 'J': 1, 'S': 1, 'B': 2, 'K': 2, 'T': 2, 'C': 3, 'L': 3, 'U': 3,
    'D': 4, 'M': 4, 'V': 4, 'E': 5, 'N': 5, 'W': 5, 'F': 6, 'O': 6, 'X': 6,
    'G': 7, 'P': 7, 'Y': 7, 'H': 8, 'Q': 8, 'Z': 8, 'I': 9, 'R': 9
  },
  // Inverted map to find letters by value
  valueToLetters: {
    1: ['A', 'J', 'S'], 2: ['B', 'K', 'T'], 3: ['C', 'L', 'U'],
    4: ['D', 'M', 'V'], 5: ['E', 'N', 'W'], 6: ['F', 'O', 'X'],
    7: ['G', 'P', 'Y'], 8: ['H', 'Q', 'Z'], 9: ['I', 'R']
  },
  assetCompatibility: {
    1: { auspicious: [1, 2, 3], good: [4, 5], neutral: [6, 7], avoid: [8, 9] },
    2: { auspicious: [1, 2, 4], good: [5, 6], neutral: [3, 8], avoid: [7, 9] },
    3: { auspicious: [1, 3, 5], good: [2, 6], neutral: [4, 7], avoid: [8, 9] },
    4: { auspicious: [2, 4, 6], good: [1, 8], neutral: [5, 7], avoid: [3, 9] },
    5: { auspicious: [1, 3, 5], good: [6, 7], neutral: [2, 4], avoid: [8, 9] },
    6: { auspicious: [2, 4, 6], good: [3, 9], neutral: [1, 5], avoid: [7, 8] },
    7: { auspicious: [1, 5, 7], good: [6, 9], neutral: [2, 3], avoid: [4, 8] },
    8: { auspicious: [2, 4, 8], good: [1, 6], neutral: [3, 5], avoid: [7, 9] },
    9: { auspicious: [3, 6, 9], good: [2, 7], neutral: [1, 5], avoid: [4, 8] },
  },
  // --- UPDATED: Rich Goal Vibrations Object ---
  goalVibrations: {
    'Power': {
      numbers: [1, 8],
      icon: <GoalIcon name="Power" />,
      desc: "Authority and influence."
    },
    'Money': {
      numbers: [5, 8],
      icon: <GoalIcon name="Money" />,
      desc: "Wealth and financial flow."
    },
    'Luxury': {
      numbers: [6],
      icon: <GoalIcon name="Luxury" />,
      desc: "Comfort and high quality."
    },
    'Relationships': {
      numbers: [2, 6],
      icon: <GoalIcon name="Relationships" />,
      desc: "Love and partnership."
    },
    'Harmony': {
      numbers: [2, 6],
      icon: <GoalIcon name="Harmony" />,
      desc: "Peace and balance."
    },
    'Health': {
      numbers: [1, 5],
      icon: <GoalIcon name="Health" />,
      desc: "Vitality and wellness."
    },
    'Spiritual Growth': {
      numbers: [7, 9],
      icon: <GoalIcon name="SpiritualGrowth" />,
      desc: "Wisdom and enlightenment."
    },
    'Career Success': {
      numbers: [1, 8],
      icon: <GoalIcon name="CareerSuccess" />,
      desc: "Advancement and ambition."
    },
    'Recognition/Fame': {
      numbers: [1, 3, 9],
      icon: <GoalIcon name="RecognitionFame" />,
      desc: "Public acclaim."
    },
    'Creativity/Innovation': {
      numbers: [3, 5],
      icon: <GoalIcon name="CreativityInnovation" />,
      desc: "Ideas and artistry."
    },
    'Stability': {
      numbers: [4],
      icon: <GoalIcon name="Stability" />,
      desc: "Security and foundation."
    },
    'Freedom': {
      numbers: [5],
      icon: <GoalIcon name="Freedom" />,
      desc: "Adventure and independence."
    }
  },
  // --- NEW: Rich Business Category Object ---
  businessCategories: {
    'Food & Creativity': {
      numbers: [6, 3, 5],
      icon: <GoalIcon name="Food & Creativity" />,
      desc: "Restaurants, cafes, arts, design."
    },
    'Authority & Leadership': {
      numbers: [1, 8],
      icon: <GoalIcon name="Authority & Leadership" />,
      desc: "Consulting, management, CEO."
    },
    'Money & Finance': {
      numbers: [5, 8],
      icon: <GoalIcon name="Money & Finance" />,
      desc: "Banking, investing, accounting."
    },
    'Travel & Exploration': {
      numbers: [7, 5],
      icon: <GoalIcon name="Travel & Exploration" />,
      desc: "Tourism, logistics, import/export."
    },
    'Education': {
      numbers: [3, 7, 9],
      icon: <GoalIcon name="Education" />,
      desc: "Schools, coaching, training."
    }
  },
  personalInterpretations: {
    1: "Leadership, independence, pioneering spirit.",
    2: "Cooperation, diplomacy, sensitivity.",
    3: "Creativity, self-expression, communication.",
    4: "Stability, hard work, practicality.",
    5: "Freedom, adventure, change.",
    6: "Responsibility, nurturing, community.",
    7: "Analysis, introspection, wisdom.",
    8: "Ambition, power, material success.",
    9: "Humanitarianism, compassion, idealism."
  }
};

// --- HELPER: GEMINI API CALLER ---
/**
 * A reusable function to call the Gemini API with exponential backoff.
 * @param {string} prompt - The user prompt for the API.
 * @param {object} schema - Optional JSON schema for structured response.
 * @returns {Promise<string>} - The text response from the API.
 */
const fetchGeminiApi = async (prompt, schema = null) => {
  const apiKey = ""; // API key is injected by the environment
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: {
      parts: [{ text: "You are 'KarmAnk,' a world-class AI numerologist. Your voice is wise, mystical, empowering, and practical. You will receive a prompt with data and instructions. Synthesize this data into a unified, insightful report. Use simple Markdown for formatting (e.g., **bold** for emphasis and \n\n for new paragraphs)." }]
    }
  };

  if (schema) {
    payload.generationConfig = {
      responseMimeType: "application/json",
      responseSchema: schema
    };
  }

  let retries = 0;
  const maxRetries = 5;

  while (retries < maxRetries) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.status === 429 || response.status >= 500) {
        // Throttling or server error, wait and retry
        throw new Error(`APIError ${response.status}`);
      }

      if (!response.ok) {
        const errorBody = await response.json();
        console.error("Gemini API Error:", errorBody);
        throw new Error(`API call failed: ${errorBody.error?.message || response.statusText}`);
      }

      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error("Invalid response structure from API.");
      }

      return text;

    } catch (error) {
      if (error.message.includes("APIError")) {
        retries++;
        const delay = Math.pow(2, retries) * 1000 + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error("Fetch Gemini API Error:", error);
        throw error;
      }
    }
  }

  throw new Error("API call failed after maximum retries.");
};


// --- HELPER: VIBRATIONAL STATUS ---
/**
 * Calculates the vibrational status between Expression and Soul Urge.
 * @param {number} expr - Expression number.
 * @param {number} soul - Soul Urge number.
 * @returns {object} { title, color, desc }
 */
const getVibrationalStatus = (expr, soul) => {
  const e = reduceToSingleDigit(expr);
  const s = reduceToSingleDigit(soul);

  const group1 = [1, 5, 7];
  const group2 = [2, 4, 8];
  const group3 = [3, 6, 9];

  const getGroup = (n) => {
      if (group1.includes(n)) return 1;
      if (group2.includes(n)) return 2;
      if (group3.includes(n)) return 3;
      return 0;
  };

  if (e === s) return { title: "Perfect Resonance", color: "text-green-400", desc: "Your inner Core Drive matches your Blueprint. Frictionless flow." };
  if (getGroup(e) === getGroup(s)) return { title: "Harmonic Flow", color: "text-blue-400", desc: "Different numbers, but same 'family.' Easy energy." };

  // Conflict Cases
  if ((e === 5 && s === 4) || (e === 4 && s === 5)) return { title: "Conflict: Brake vs. Gas", color: "text-red-400", desc: "One part wants freedom (5), the other wants safety (4)." };
  if ((e === 1 && s === 2) || (e === 2 && s === 1)) return { title: "Conflict: Leader vs. Follower", color: "text-orange-400", desc: "One part wants to lead (1), the other seeks permission (2)." };

  return { title: "Dynamic Tension", color: "text-yellow-400", desc: "You are balancing opposing forces. This creates growth through challenge." };
};

// --- HELPER: CORE CALCULATION ENGINES ---

/**
 * Reduces a number to a single digit (1-9).
 * @param {number|string} num - The number to reduce.
 * @returns {number} The single-digit result.
 */
const reduceToSingleDigit = (num) => {
  let currentNumStr = String(num);
  while (currentNumStr.length > 1) {
    currentNumStr = String(currentNumStr.split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0));
  }
  return parseInt(currentNumStr, 10);
};

/**
 * Reduces a number, preserving Master Numbers (11, 22, 33).
 * @param {number} num - The number to reduce.
 * @returns {number} The reduced result.
 */
const reduceWestern = (num) => {
  if (num === 0) return 0;
  const masterNumbers = [11, 22, 33];
  while (num > 9 && !masterNumbers.includes(num)) {
    num = num.toString().split("").reduce((a, b) => a + parseInt(b), 0);
  }
  return num;
};

/**
 * Engine 1: Calculates the Vedic Profile from DOB.
 * @param {string} dob - "YYYY-MM-DD"
 * @returns {object} The vedicProfile object.
 */
const calculateVedicProfile = (dob) => {
  const date = new Date(dob + 'T00:00:00');
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const basicNumber = reduceToSingleDigit(day);
  const destinyNumber = reduceToSingleDigit(`${day}${month}${year}`);

  return {
    basicNumber,
    destinyNumber,
  };
};

/**
 * Engine 2: Calculates the Pythagorean Profile from Name.
 * @param {string} name - The user's full name.
 * @returns {object} The pythagoreanProfile object.
 */
const calculatePythagoreanProfile = (name) => {
  if (!name) return null;
  const { letterData, vowels, harmonyGroups } = PYTHAGOREAN_CONSTANTS;

  let expr = 0, soul = 0, pers = 0;
  const letters = name.toUpperCase().replace(/[^A-Z]/g, "").split("");
  if (letters.length === 0) return null;

  const repeatMap = {};
  letters.forEach(l => {
    if (!letterData[l]) return;
    const num = letterData[l].num;
    expr += num;
    if (vowels.includes(l)) soul += num;
    else pers += num;
    repeatMap[l] = (repeatMap[l] || 0) + 1;
  });

  const expression = reduceWestern(expr);
  const soulUrge = reduceWestern(soul);
  const personality = reduceWestern(pers);

  const repeats = Object.entries(repeatMap)
    .filter(([_, count]) => count > 1)
    .map(([letter, count]) => ({
      letter,
      count,
      meaning: letterData[letter].repeat
    }));

  const singleDigitExpr = reduceToSingleDigit(expression);
  const harmonyGroup = harmonyGroups.findIndex(g => g.includes(singleDigitExpr)) + 1;

  return {
    expression,
    soulUrge,
    personality,
    repeats,
    harmonyGroup,
  };
};

/**
 * Engine 3: Calculates the KarmAnk Profile (Synergy).
 * @param {string} name - The user's full name.
 * @param {number} destinyNumber - The calculated Vedic Destiny Number.
 */
const calculateKarmAnkProfile = (name, destinyNumber) => {
  const { letterValues, assetCompatibility, personalInterpretations } = KARMANK_CONSTANTS;

  const nameValue = name.toUpperCase().replace(/[^A-Z]/g, '').split('').reduce((acc, char) => {
    return acc + (letterValues[char] || 0);
  }, 0);

  const nameExpressionNumber = reduceToSingleDigit(nameValue);

  const destinyCompat = assetCompatibility[destinyNumber];
  let destinyStatus = 'Avoid';
  if (destinyCompat?.auspicious.includes(nameExpressionNumber)) {
      destinyStatus = 'Auspicious';
  } else if (destinyCompat?.good.includes(nameExpressionNumber)) {
      destinyStatus = 'Good';
  } else if (destinyCompat?.neutral.includes(nameExpressionNumber)) {
      destinyStatus = 'Neutral';
  }

  return {
    nameExpressionNumber,
    interpretation: personalInterpretations[nameExpressionNumber] || "",
    destinySynergy: {
      status: destinyStatus,
      target: destinyNumber
    },
  };
};


// --- SHAREABLE IDENTITY CARD COMPONENT ---
const ShareableIdentityCard = ({ name, pythagoreanProfile }) => {
  return (
    <div className="max-w-sm mx-auto my-8 bg-gradient-to-br from-gray-900 to-gray-800 border-4 border-double border-yellow-500/50 rounded-xl overflow-hidden shadow-2xl relative">
      {/* Decorative Corners */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-yellow-400 rounded-tl-xl"></div>
      <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-yellow-400 rounded-tr-xl"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-yellow-400 rounded-bl-xl"></div>
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-yellow-400 rounded-br-xl"></div>

      <div className="p-8 text-center relative z-10">
        <div className="mb-6">
           <WandIcon className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
           <h2 className="text-2xl font-serif font-bold text-yellow-100 tracking-widest uppercase">{name}</h2>
           <p className="text-xs text-yellow-500/80 tracking-[0.2em] mt-1">NUMEROLOGICAL BLUEPRINT</p>
        </div>

        <div className="flex justify-between items-center mb-8 px-2">
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-white">{pythagoreanProfile.expression}</span>
            <span className="text-[10px] uppercase text-yellow-500 font-bold mt-1">Blueprint</span>
          </div>
          <div className="w-px h-12 bg-yellow-500/30"></div>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-white">{pythagoreanProfile.soulUrge}</span>
            <span className="text-[10px] uppercase text-yellow-500 font-bold mt-1">Core Drive</span>
          </div>
          <div className="w-px h-12 bg-yellow-500/30"></div>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-white">{pythagoreanProfile.personality}</span>
            <span className="text-[10px] uppercase text-yellow-500 font-bold mt-1">Interface</span>
          </div>
        </div>

        <div className="border-t border-yellow-500/20 pt-4">
          <p className="text-xs text-gray-400 italic">"Destiny is calculated, not guessed."</p>
          <p className="text-[10px] text-yellow-600 mt-2 uppercase font-bold">Analyzed by KarmAnk</p>
        </div>
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-yellow-500/10 blur-3xl rounded-full pointer-events-none"></div>
    </div>
  );
};

// --- FUTURISTIC GATE COMPONENT ---
const FuturisticGate = ({ children }) => {
  return (
    <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-2xl border border-yellow-500/20 bg-gray-900/80 shadow-2xl">
      {/* INLINE STYLES for animations */}
      <style>{`
        @keyframes spin-slow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes spin-reverse-slower { 0% { transform: rotate(0deg); } 100% { transform: rotate(-360deg); } }
        @keyframes float-up { 0% { transform: translateY(20px); opacity: 0; } 50% { opacity: 0.5; } 100% { transform: translateY(-20px); opacity: 0; } }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-spin-reverse { animation: spin-reverse-slower 30s linear infinite; }
        .animate-float-1 { animation: float-up 4s ease-in-out infinite; animation-delay: 0s; }
        .animate-float-2 { animation: float-up 6s ease-in-out infinite; animation-delay: 2s; }
        .animate-float-3 { animation: float-up 5s ease-in-out infinite; animation-delay: 1s; }
      `}</style>

      {/* 1. The Cyber-Grid Floor (Perspective Effect) */}
      <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none"
           style={{
             backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(66, 153, 225, 0.1) 25%, rgba(66, 153, 225, 0.1) 26%, transparent 27%, transparent 74%, rgba(66, 153, 225, 0.1) 75%, rgba(66, 153, 225, 0.1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(66, 153, 225, 0.1) 25%, rgba(66, 153, 225, 0.1) 26%, transparent 27%, transparent 74%, rgba(66, 153, 225, 0.1) 75%, rgba(66, 153, 225, 0.1) 76%, transparent 77%, transparent)',
             backgroundSize: '50px 50px',
             transform: 'perspective(500px) rotateX(60deg) translateY(100px) scale(1.5)'
           }}>
      </div>

      {/* 2. The Floating Numbers (Atmosphere) */}
      <div className="absolute top-10 left-10 text-yellow-500/20 font-mono text-4xl animate-float-1">11</div>
      <div className="absolute bottom-20 right-10 text-blue-500/20 font-mono text-6xl animate-float-2">8</div>
      <div className="absolute top-1/2 right-1/4 text-purple-500/20 font-mono text-2xl animate-float-3">33</div>

      {/* 3. The Rotating Star Gate Rings */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        {/* Outer Ring - Gold */}
        <div className="w-[600px] h-[600px] rounded-full border border-dashed border-yellow-500/10 animate-spin-slow flex items-center justify-center">
           <div className="absolute top-0 w-2 h-2 bg-yellow-500 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.8)]"></div>
        </div>
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        {/* Inner Ring - Blue */}
        <div className="w-[400px] h-[400px] rounded-full border border-dotted border-blue-400/20 animate-spin-reverse"></div>
      </div>

      {/* 4. The Central Portal Glow */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* 5. CONTENT CONTAINER */}
      <div className="relative z-10 backdrop-blur-sm p-8 md:p-12 bg-gradient-to-b from-gray-900/50 to-transparent">
         {children}
      </div>
    </div>
  );
};

// --- CORE APP COMPONENT ---

export default function NameAnalysisPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [report, setReport] = useState(null);

  const [masterReportText, setMasterReportText] = useState(null);
  const [isLoadingReportText, setIsLoadingReportText] = useState(false);
  const [reportError, setReportError] = useState("");

  const [activeTab, setActiveTab] = useState('nameDeepDive');
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const AI_REPORT_SCHEMA = {
    type: "OBJECT",
    properties: {
      threefoldSelf: {
        type: "STRING",
        description: "The 3-4 paragraph 'Threefold Self' analysis for the Name Deep Dive, synthesizing Expression, Soul Urge, and Personality."
      },
      synergyAnalysis: {
        type: "STRING",
        description: "The 2-3 paragraph analysis of the 'Name & Destiny Synergy,' explaining the KarmAnk score. This field is optional."
      }
    },
    required: ["threefoldSelf"]
  };

  const generateMasterNarrative = async (masterReport) => {
    setIsLoadingReportText(true);
    setReportError("");
    setMasterReportText(null);

    const { profile, vedicProfile, pythagoreanProfile, karmAnkProfile } = masterReport;

    let masterPrompt = `
      **Task:** You are 'KarmAnk,' a world-class AI numerologist. Your task is to synthesize the provided data into a unified, insightful report for ${profile.name}.

      **Data Input:**
      1.  **Pythagorean Profile (Name):**
          - Expression (Potential): ${pythagoreanProfile.expression} (${PYTHAGOREAN_CONSTANTS.numberMeanings[pythagoreanProfile.expression]})
          - Soul Urge (Desire): ${pythagoreanProfile.soulUrge} (${PYTHAGOREAN_CONSTANTS.numberMeanings[pythagoreanProfile.soulUrge]})
          - Personality (Image): ${pythagoreanProfile.personality} (${PYTHAGOREAN_CONSTANTS.numberMeanings[pythagoreanProfile.personality]})
    `;

    if (vedicProfile) {
      masterPrompt += `
      2.  **Vedic Profile (DOB):**
          - Destiny Number (Life Path): ${vedicProfile.destinyNumber} (${VEDIC_CONSTANTS.numberDetails[vedicProfile.destinyNumber].name})
      `;
    }

    if (karmAnkProfile) {
      masterPrompt += `
      3.  **KarmAnk Profile (Synergy):**
          - Name Number: ${karmAnkProfile.nameExpressionNumber} (${karmAnkProfile.interpretation})
          - Destiny Synergy: ${karmAnkProfile.destinySynergy.status} (with Destiny ${karmAnkProfile.destinySynergy.target})
      `;
    }

    masterPrompt += `
      **Your Goal:** Generate a JSON object matching the provided schema.

      ---
      **Section 1: \`threefoldSelf\` (For the Name Deep Dive)**
      **Instructions:** (This section is mandatory) Write a 3-4 paragraph "Threefold Self" analysis.
      -   Focus *only* on the **Pythagorean Profile**.
      -   Explain the roles of Expression (${pythagoreanProfile.expression}), Soul Urge (${pythagoreanProfile.soulUrge}), and Personality (${pythagoreanProfile.personality}).
      -   **Synthesize them:** Explain how they interact (e.g., "Your ${pythagoreanProfile.expression} Expression shows a powerful path, but your ${pythagoreanProfile.soulUrge} Soul Urge reveals you secretly crave X, which might conflict...").
      -   Conclude by mentioning their amplified traits from this data: ${JSON.stringify(pythagoreanProfile.repeats)}
      ---
    `;

    if (vedicProfile) {
      masterPrompt += `
      **Section 2: \`synergyAnalysis\` (For the Synergy Tab)**
      **Instructions:** (This section is optional) Write a 2-3 paragraph "Synergy Analysis."
      -   **Address the 'Two Number Dilemma'**: Start by explaining *why* we have two name numbers. Say: "Your name is complex. We analyze it in two ways: 1) Your 'Psychological Blueprint' (your Pythagorean numbers ${pythagoreanProfile.expression}, ${pythagoreanProfile.soulUrge}, etc.) and 2) Your 'Karmic Synergy' (your KarmAnk number ${karmAnkProfile.nameExpressionNumber})."
      -   **Analyze the Synergy:** Explain their **Destiny Synergy (${karmAnkProfile.destinySynergy.status})**.
      -   **Synthesize the Conflict/Harmony:** Explain what this means. (e.g., "This 'Good' score means your name's vibration (${karmAnkProfile.nameExpressionNumber}) is actively helping your life's path (Destiny ${vedicProfile.destinyNumber})." OR "This 'Avoid' score reveals a conflict: your deep intuition (from your Expression ${pythagoreanProfile.expression}) might feel 'stuck' because your name's vibration (${karmAnkProfile.nameExpressionNumber}) is creating friction with your destiny...").
      -   **Conclude:** If the score is 'Neutral' or 'Avoid', point them to the 'Life Goal Alignment' tool below the analysis for suggestions.
      `;
    }

    try {
      const jsonText = await fetchGeminiApi(masterPrompt, AI_REPORT_SCHEMA);
      const parsedReport = JSON.parse(jsonText);
      setMasterReportText(parsedReport);
    } catch (e) {
      console.error("Error generating master narrative:", e);
      setReportError("I'm having trouble channeling the complete insight. Please try analyzing again in a moment.");
    } finally {
      setIsLoadingReportText(false);
    }
  };

  const handleGenerateReport = () => {
    if (!fullName) {
      setError("Please enter your full name.");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      const pythagoreanProfile = calculatePythagoreanProfile(fullName);

      let vedicProfile = null;
      let karmAnkProfile = null;

      if (dateOfBirth) {
        vedicProfile = calculateVedicProfile(dateOfBirth);
        karmAnkProfile = calculateKarmAnkProfile(fullName, vedicProfile.destinyNumber);
      }

      const masterReport = {
        profile: {
          name: fullName,
          dob: dateOfBirth,
        },
        vedicProfile,
        pythagoreanProfile,
        karmAnkProfile
      };

      setReport(masterReport);
      setActiveTab('nameDeepDive');

      generateMasterNarrative(masterReport);

    } catch (e) {
      console.error("Error generating report:", e);
      setError("An error occurred while calculating your report. Please check the inputs and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const NlgDisplay = ({ title, text, isLoading, error }) => {
    return (
      <div className="bg-gray-800/60 p-6 rounded-lg shadow-lg border border-yellow-400/20">
        <h3 className="text-2xl font-bold text-yellow-400 mb-4 font-serif tracking-wider">{title}</h3>
        {isLoading && (
          <div className="flex justify-center items-center h-24">
            <LoaderIcon className="w-8 h-8 text-yellow-400" />
            <p className="ml-4 text-yellow-200/70">Channeling your insights...</p>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-900/50 text-red-300 rounded-lg">
            <AlertCircleIcon className="w-6 h-6 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        {!isLoading && !error && text && (
          <div className="prose prose-invert prose-strong:text-yellow-300 text-gray-300 max-w-none">
            {text.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4 last:mb-0">
                {paragraph.split('**').map((part, i) =>
                  i % 2 === 1 ? <strong key={i} className="font-bold text-yellow-300">{part}</strong> : part
                )}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderActiveTab = () => {
    if (!report) return null;

    const nlgProps = {
      isLoading: isLoadingReportText,
      error: reportError
    };

    switch (activeTab) {
      case 'nameDeepDive':
        return <NameDeepDiveTab
                  report={report}
                  nlgProps={{...nlgProps, text: masterReportText?.threefoldSelf, title: "Your Vibrational Blueprint"}}
                />;
      case 'synergy':
        return <SynergyTab
                  report={report}
                  nlgProps={{...nlgProps, text: masterReportText?.synergyAnalysis, title: "Name & Destiny Synergy"}}
                />;
      case 'simulator':
        return <NameSandboxTab birthName={report.profile.name} />;
      case 'business':
        return <BusinessTab />;
      default:
        return <NameDeepDiveTab
                  report={report}
                  nlgProps={{...nlgProps, text: masterReportText?.threefoldSelf, title: "📖 Your Name's Threefold Self"}}
                />;
    }
  };

  const NameDeepDiveTab = ({ report, nlgProps }) => {
    const { pythagoreanProfile } = report;
    const vibration = getVibrationalStatus(pythagoreanProfile.expression, pythagoreanProfile.soulUrge);

    return (
      <div className="space-y-6">
        {/* Updated Labels: Blueprint / Core Drive / Interface */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { label: "The Blueprint", val: pythagoreanProfile.expression, sub: "Your Operating System" },
            { label: "The Core Drive", val: pythagoreanProfile.soulUrge, sub: "Your Fuel Source" },
            { label: "The Interface", val: pythagoreanProfile.personality, sub: "Your User Experience" }
          ].map((item, i) => (
            <div key={i} className="bg-gray-800/60 p-6 rounded-lg shadow-lg border border-yellow-400/20 text-center">
              <p className="text-sm text-yellow-500 uppercase tracking-widest">{item.label}</p>
              <p className="text-6xl font-bold my-2">{item.val}</p>
              <p className="text-gray-300">{item.sub}</p>
            </div>
          ))}
        </div>

        {/* NEW: Vibrational Friction Bar */}
        <div className="bg-gray-900/80 border border-gray-700 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
               <p className="text-xs text-gray-500 uppercase tracking-widest">Internal Architecture</p>
               <h4 className={`text-xl font-bold ${vibration.color}`}>{vibration.title}</h4>
           </div>
           <p className="text-sm text-gray-400 md:max-w-xs md:text-right">{vibration.desc}</p>
        </div>

        <NlgDisplay {...nlgProps} />

        {pythagoreanProfile.repeats.length > 0 && (
          <div className="bg-gray-800/60 p-6 rounded-lg shadow-lg border border-yellow-400/20">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4 font-serif tracking-wider">Amplified Traits</h3>
            <div className="space-y-3">
              {pythagoreanProfile.repeats.map(item => (
                <div key={item.letter} className="p-3 bg-gray-900/50 rounded-md">
                  <p className="font-bold text-lg text-yellow-300">Letter "{item.letter}" ({item.count}x)</p>
                  <p className="text-gray-300">{item.meaning}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NEW: Shareable Card */}
        <div className="mt-8">
          <h3 className="text-center text-yellow-200/70 text-sm mb-4">SAVE YOUR IDENTITY CARD</h3>
          <ShareableIdentityCard name={report.profile.name} pythagoreanProfile={pythagoreanProfile} />
        </div>
      </div>
    );
  };

  const GoalCard = ({ goal, icon, desc, isSelected, onSelect, disabled }) => {
    const baseClasses = "flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 transform hover:scale-105 cursor-pointer";
    const selectedClasses = "bg-yellow-900/50 border-yellow-400 ring-2 ring-yellow-400 shadow-lg";
    const defaultClasses = "bg-gray-900/50 border-gray-700 hover:bg-gray-800";
    const disabledClasses = "opacity-40 cursor-not-allowed hover:scale-100";

    return (
      <button
        onClick={onSelect}
        disabled={disabled}
        className={`${baseClasses} ${isSelected ? selectedClasses : defaultClasses} ${disabled ? disabledClasses : ""}`}
      >
        {icon}
        <p className="font-bold text-center text-yellow-300">{goal}</p>
        <p className="text-xs text-center text-gray-400">{desc}</p>
      </button>
    );
  };

  const SynergyTab = ({ report, nlgProps }) => {
    const { karmAnkProfile, vedicProfile, profile } = report;
    const [selectedGoals, setSelectedGoals] = useState([]);
    const [goalResults, setGoalResults] = useState(null);

    if (!vedicProfile || !karmAnkProfile) {
      return (
        <div className="bg-gray-800/60 p-6 rounded-lg shadow-lg border border-yellow-400/20 text-center">
          <p className="text-yellow-400">Please provide a Date of Birth on the main page to unlock Synergy and Goal Alignment analysis.</p>
        </div>
      );
    }

    const handleGoalToggle = (goal) => {
      setGoalResults(null);
      setSelectedGoals(prev => {
        if (prev.includes(goal)) {
          return prev.filter(g => g !== goal);
        }
        if (prev.length < 2) {
          return [...prev, goal];
        }
        return prev;
      });
    };

    const handleGoalAnalysis = () => {
      const idealNumbers = [...new Set(selectedGoals.flatMap(goal => KARMANK_CONSTANTS.goalVibrations[goal].numbers))].sort((a,b) => a-b);
      const alignment = idealNumbers.includes(karmAnkProfile.nameExpressionNumber) ? 'Supportive' : 'Misaligned';
      setGoalResults({ idealNumbers, alignment, goals: selectedGoals });
    };

    const getSynergyColorClasses = (status) => {
      switch (status) {
        case 'Auspicious': return 'bg-blue-600 border-blue-400 text-white';
        case 'Good': return 'bg-green-600 border-green-400 text-white';
        case 'Neutral': return 'bg-yellow-600 border-yellow-400 text-gray-900';
        case 'Avoid': return 'bg-red-600 border-red-400 text-white';
        default: return 'bg-gray-600 border-gray-400 text-white';
      }
    };

    return (
      <div className="space-y-6">
        <div className={`p-6 rounded-lg shadow-lg text-center ${getSynergyColorClasses(karmAnkProfile.destinySynergy.status)}`}>
            <p className="text-sm uppercase tracking-widest font-semibold opacity-80">Name vs. Life Path Synergy</p>
            <p className="text-5xl font-bold my-2">{karmAnkProfile.destinySynergy.status}</p>
            <p className="opacity-90">Name ({karmAnkProfile.nameExpressionNumber}) vs. Destiny ({vedicProfile.destinyNumber})</p>
        </div>

        <NlgDisplay {...nlgProps} />

        <div className="bg-gray-800/60 p-6 rounded-lg shadow-lg border border-yellow-400/20">
          <h3 className="text-2xl font-bold text-yellow-400 mb-4 font-serif tracking-wider">Life Goal Alignment & Harmonizer</h3>
          <label className="block text-center text-lg font-medium text-gray-200 mb-6">What do you want to manifest? <span className="text-sm text-gray-400">(Select up to two)</span></label>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {Object.entries(KARMANK_CONSTANTS.goalVibrations).map(([goalName, goalData]) => (
              <GoalCard
                key={goalName}
                goal={goalName}
                icon={goalData.icon}
                desc={goalData.desc}
                isSelected={selectedGoals.includes(goalName)}
                onSelect={() => handleGoalToggle(goalName)}
                disabled={selectedGoals.length >= 2 && !selectedGoals.includes(goalName)}
              />
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleGoalAnalysis}
              disabled={selectedGoals.length === 0}
              className="bg-green-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-200"
            >
              Analyze Goal Alignment
            </button>
          </div>

          {goalResults && (
            <div className="mt-8">
              <div className={`text-center p-4 rounded-lg mb-8 ${ goalResults.alignment === 'Supportive' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300' }`}>
                <h2 className="text-2xl font-bold">Your Name Vibration is {goalResults.alignment}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
                <div>
                  <h4 className="font-semibold text-gray-300 mb-2">Your Name Number</h4>
                  <div className="p-4 bg-gray-900/50 rounded-lg"><p className="text-4xl font-bold text-yellow-400">{karmAnkProfile.nameExpressionNumber}</p></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-300 mb-2">Ideal Numbers for Your Goals</h4>
                  <div className="p-4 bg-gray-900/50 rounded-lg"><p className="text-4xl font-bold text-yellow-400">{goalResults.idealNumbers.join(', ')}</p></div>
                </div>
              </div>

              {goalResults.alignment === 'Misaligned' && (
                <GoalHarmonizer
                  currentNameNumber={karmAnkProfile.nameExpressionNumber}
                  idealGoalNumbers={goalResults.idealNumbers}
                  goals={goalResults.goals}
                  currentName={profile.name}
                  destinyNumber={vedicProfile.destinyNumber}
                />
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const GoalHarmonizer = ({ currentNameNumber, idealGoalNumbers, goals, currentName, destinyNumber }) => {

    const harmonizerAnalysis = useMemo(() => {
      const { assetCompatibility, valueToLetters, goalVibrations } = KARMANK_CONSTANTS;
      const destinyCompat = assetCompatibility[destinyNumber];
      const destinyCompatibleNumbers = [...destinyCompat.auspicious, ...destinyCompat.good];

      let suggestions = [];

      goals.forEach(goal => {
        const goalNumbers = (goalVibrations[goal] || {}).numbers || [];
        goalNumbers.forEach(idealNum => {
          const isDestinyCompatible = destinyCompatibleNumbers.includes(idealNum);

          const diff = idealNum - currentNameNumber;
          const addValue = (diff + 9) % 9 === 0 ? 9 : (diff + 9) % 9;
          const removeValue = (-diff + 9) % 9 === 0 ? 9 : (-diff + 9) % 9;

          const addLetters = valueToLetters[addValue] || [];

          const removeLetters = currentName.toUpperCase().split('')
            .filter(char => KARMANK_CONSTANTS.letterValues[char] === removeValue)
            .filter((v, i, a) => a.indexOf(v) === i);

          suggestions.push({
            goal: goal,
            target: idealNum,
            isDestinyCompatible,
            add: { value: addValue, letters: addLetters },
            remove: { value: removeValue, letters: removeLetters }
          });
        });
      });

      const uniqueSuggestions = suggestions.reduce((acc, sug) => {
        const key = `${sug.goal}-${sug.target}`;
        if (!acc[key]) {
          acc[key] = sug;
        }
        if (sug.isDestinyCompatible) {
          acc[key] = sug;
        }
        return acc;
      }, {});

      return Object.values(uniqueSuggestions);

    }, [currentNameNumber, idealGoalNumbers, goals, currentName, destinyNumber]);

    return (
      <div className="mt-8 bg-gray-800/60 p-6 rounded-lg shadow-lg border border-yellow-400/20">
        <h3 className="text-2xl font-bold text-yellow-400 mb-4 font-serif tracking-wider flex items-center gap-2">
          <WandIcon /> Goal Harmonizer
        </h3>
        <p className="text-gray-400 mb-6">Your name's vibration is misaligned with your chosen goals. Here are algorithmic suggestions to harmonize it. Suggestions marked with a 🌟 are also compatible with your Life Path (Destiny Number).</p>

        <div className="space-y-6">
          {harmonizerAnalysis.map((sug, index) => (
            <div key={index} className="bg-gray-900/50 p-4 rounded-lg">
              <h4 className="font-bold text-lg text-yellow-300 mb-3">Suggestions for Goal: "{sug.goal}" (Target: {sug.target})</h4>
              <div className="p-3 bg-gray-800/50 rounded-md border-l-4 border-yellow-500">
                {sug.isDestinyCompatible && (
                   <p className="font-semibold text-green-400 mb-2">🌟 This target is **Highly Recommended** as it aligns with both your Goal and your Destiny!</p>
                )}
                {!sug.isDestinyCompatible && (
                   <p className="font-semibold text-yellow-500 mb-2">⚠️ This target aligns with your goal, but is not in ideal harmony with your Life Path. Proceed with consideration.</p>
                )}
                <ul className="list-disc list-inside text-sm text-gray-300 pl-2 mt-2">
                  <li>
                    **Add** a letter with value **{sug.add.value}**
                    (e.g., {sug.add.letters.join(', ')})
                  </li>
                  {sug.remove.letters.length > 0 && (
                    <li>
                      **Remove** a letter with value **{sug.remove.value}**
                      (from your name: {sug.remove.letters.join(', ')})
                    </li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const NameSandboxTab = ({ birthName }) => {
    const [testName, setTestName] = useState(birthName);
    const birthProfile = useMemo(() => calculatePythagoreanProfile(birthName), [birthName]);
    const testProfile = useMemo(() => calculatePythagoreanProfile(testName), [testName]);

    const ComparisonCard = ({ label, birthVal, testVal, meaning }) => {
      const hasChanged = birthVal !== testVal;
      return (
        <div className={`p-4 rounded-lg border ${hasChanged ? 'bg-gray-800 border-yellow-500/50' : 'bg-gray-900/30 border-gray-700/30'}`}>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">{label}</p>
          <div className="flex items-center justify-between">
            <div className="opacity-50"><span className="text-2xl font-bold">{birthVal}</span></div>
            <div className="px-4">{hasChanged ? <span className="text-yellow-400 text-xl">→</span> : <span className="text-gray-600">=</span>}</div>
            <div><span className={`text-3xl font-bold ${hasChanged ? 'text-yellow-400' : 'text-gray-300'}`}>{testVal || "-"}</span></div>
          </div>
          {hasChanged && <p className="mt-2 text-xs text-yellow-200/70 italic">Shift: {meaning[testVal]?.split('.')[0]}</p>}
        </div>
      );
    };

    return (
      <div className="space-y-6">
        <div className="bg-gray-800/60 p-6 rounded-lg shadow-lg border border-yellow-400/20">
          <div className="flex items-center gap-3 mb-6">
              <WandIcon className="text-yellow-400 w-6 h-6" />
              <h3 className="text-2xl font-bold text-yellow-400 font-serif tracking-wider">The Name Sandbox</h3>
          </div>
          <p className="text-gray-400 mb-8">Test how changing your name shifts your numerological vibration.</p>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Birth */}
            <div className="relative p-6 rounded-xl bg-gray-900/80 border border-gray-700">
              <div className="absolute -top-3 left-4 bg-gray-800 px-2 text-xs font-bold text-gray-500 uppercase">Birth Name (Fixed)</div>
              <div className="text-xl font-medium text-gray-400 mb-6">{birthName}</div>
              <div className="space-y-4 opacity-60 grayscale">
                 <div className="flex justify-between border-b border-gray-700 pb-2"><span>Blueprint</span> <span className="font-bold">{birthProfile?.expression}</span></div>
                 <div className="flex justify-between border-b border-gray-700 pb-2"><span>Core Drive</span> <span className="font-bold">{birthProfile?.soulUrge}</span></div>
                 <div className="flex justify-between border-b border-gray-700 pb-2"><span>Interface</span> <span className="font-bold">{birthProfile?.personality}</span></div>
              </div>
            </div>
            {/* Right: Test */}
            <div className="relative p-6 rounded-xl bg-gradient-to-br from-gray-800 to-indigo-900/40 border border-yellow-500/30 ring-1 ring-yellow-500/10">
               <div className="absolute -top-3 right-4 bg-yellow-600 text-white px-2 text-xs font-bold uppercase shadow-lg">Simulation Mode</div>
              <input type="text" value={testName} onChange={(e) => setTestName(e.target.value)}
                className="w-full bg-gray-900/50 border-b-2 border-yellow-400 text-xl font-bold text-white px-2 py-1 mb-6 focus:outline-none focus:bg-gray-800 transition-colors placeholder-gray-600" placeholder="Type variation..." />
              <div className="space-y-3">
                <ComparisonCard label="The Blueprint" birthVal={birthProfile?.expression} testVal={testProfile?.expression} meaning={PYTHAGOREAN_CONSTANTS.numberMeanings}/>
                <ComparisonCard label="The Core Drive" birthVal={birthProfile?.soulUrge} testVal={testProfile?.soulUrge} meaning={PYTHAGOREAN_CONSTANTS.numberMeanings}/>
                <ComparisonCard label="The Interface" birthVal={birthProfile?.personality} testVal={testProfile?.personality} meaning={PYTHAGOREAN_CONSTANTS.numberMeanings}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const BusinessTab = () => {
    const [businessName, setBusinessName] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [businessReport, setBusinessReport] = useState(null);
    const [error, setError] = useState("");

    const handleAnalyzeBusiness = () => {
      if (!businessName) {
        setError("Please enter a business name.");
        setBusinessReport(null);
        return;
      }
      if (!selectedCategory) {
        setError("Please select a business category.");
        setBusinessReport(null);
        return;
      }
      setError("");

      const nameValue = businessName.toUpperCase().replace(/[^A-Z]/g, '').split('').reduce((acc, char) => {
        return acc + (KARMANK_CONSTANTS.letterValues[char] || 0);
      }, 0);
      const nameNum = reduceToSingleDigit(nameValue);

      const categoryData = KARMANK_CONSTANTS.businessCategories[selectedCategory];
      const idealNumbers = categoryData.numbers;
      const alignment = idealNumbers.includes(nameNum) ? 'Supportive' : 'Misaligned';

      const pythagorean = calculatePythagoreanProfile(businessName);

      setBusinessReport({
        nameExpressionNumber: nameNum,
        pythagorean,
        alignment,
        idealNumbers,
        category: selectedCategory
      });
    };

    const getStatusColorClasses = (status) => {
      switch (status) {
        case 'Supportive': return 'bg-green-900/50 text-green-300';
        case 'Misaligned': return 'bg-red-900/50 text-red-300';
        default: return 'bg-gray-700/50 text-gray-300';
      }
    };

    const handleCategorySelect = (categoryName) => {
        setBusinessReport(null);
        setSelectedCategory(prev => (prev === categoryName ? null : categoryName));
    };

    return (
      <div className="space-y-6">
        <div className="bg-gray-800/60 p-6 rounded-lg shadow-lg border border-yellow-400/20">
          <h3 className="text-2xl font-bold text-yellow-400 mb-4 font-serif tracking-wider">Business & Brand Analysis</h3>

          <div className="mb-4">
            <label htmlFor="businessName" className="block text-sm font-medium text-yellow-500 mb-2">Business Name</label>
            <input
              type="text"
              id="businessName"
              value={businessName}
              onChange={e => setBusinessName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500"
              placeholder="e.g., Apex Global Innovations"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-yellow-500 mb-2">Business Category (Select one)</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.entries(KARMANK_CONSTANTS.businessCategories).map(([categoryName, categoryData]) => (
                <GoalCard
                  key={categoryName}
                  goal={categoryName}
                  icon={categoryData.icon}
                  desc={categoryData.desc}
                  isSelected={selectedCategory === categoryName}
                  onSelect={() => handleCategorySelect(categoryName)}
                  disabled={false}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleAnalyzeBusiness}
            disabled={!businessName || !selectedCategory}
            className="w-full bg-yellow-500 text-indigo-900 font-bold px-8 py-3 rounded-lg hover:bg-yellow-600 transition duration-200 shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            Analyze Business Name
          </button>
          {error && <p className="text-center text-red-400 mt-4">{error}</p>}
        </div>

        {businessReport && (
          <div className="space-y-6">
            <div className={`p-6 rounded-lg text-center ${getStatusColorClasses(businessReport.alignment)}`}>
              <h3 className="text-xl font-bold mb-2">KarmAnk Category Alignment</h3>
              <p>Your name number ({businessReport.nameExpressionNumber}) is **{businessReport.alignment}** with the ideal numbers ({businessReport.idealNumbers.join(', ')}) for a "{businessReport.category}" business.</p>
            </div>

            {businessReport.alignment === 'Misaligned' && (
              <BusinessHarmonizer
                currentNameNumber={businessReport.nameExpressionNumber}
                idealCategoryNumbers={businessReport.idealNumbers}
                category={businessReport.category}
                currentName={businessName}
              />
            )}

            <div className="bg-gray-800/60 p-6 rounded-lg shadow-lg border border-yellow-400/20">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4 font-serif tracking-wider">Pythagorean Brand Profile</h3>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-500 uppercase tracking-widest">Brand Mission</p>
                  <p className="text-5xl font-bold my-2">{businessReport.pythagorean.expression}</p>
                  <p className="text-gray-400 text-xs">{PYTHAGOREAN_CONSTANTS.numberMeanings[businessReport.pythagorean.expression]}</p>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-500 uppercase tracking-widest">Core Values</p>
                  <p className="text-5xl font-bold my-2">{businessReport.pythagorean.soulUrge}</p>
                  <p className="text-gray-400 text-xs">{PYTHAGOREAN_CONSTANTS.numberMeanings[businessReport.pythagorean.soulUrge]}</p>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-500 uppercase tracking-widest">Public Image</p>
                  <p className="text-5xl font-bold my-2">{businessReport.pythagorean.personality}</p>
                  <p className="text-gray-400 text-xs">{PYTHAGOREAN_CONSTANTS.numberMeanings[businessReport.pythagorean.personality]}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const BusinessHarmonizer = ({ currentNameNumber, idealCategoryNumbers, category, currentName }) => {

    const harmonizerAnalysis = useMemo(() => {
      const { valueToLetters } = KARMANK_CONSTANTS;
      let suggestions = [];

      idealCategoryNumbers.forEach(idealNum => {
        const diff = idealNum - currentNameNumber;
        const addValue = (diff + 9) % 9 === 0 ? 9 : (diff + 9) % 9;
        const removeValue = (-diff + 9) % 9 === 0 ? 9 : (-diff + 9) % 9;

        const addLetters = valueToLetters[addValue] || [];

        const removeLetters = currentName.toUpperCase().split('')
          .filter(char => KARMANK_CONSTANTS.letterValues[char] === removeValue)
          .filter((v, i, a) => a.indexOf(v) === i);

        suggestions.push({
          target: idealNum,
          add: { value: addValue, letters: addLetters },
          remove: { value: removeValue, letters: removeLetters }
        });
      });

      return suggestions;

    }, [currentNameNumber, idealCategoryNumbers, category, currentName]);

    return (
      <div className="mt-6 bg-gray-800/60 p-6 rounded-lg shadow-lg border border-yellow-400/20">
        <h3 className="text-2xl font-bold text-yellow-400 mb-4 font-serif tracking-wider flex items-center gap-2">
          <WandIcon /> Business Name Harmonizer
        </h3>
        <p className="text-gray-400 mb-6">Your name's vibration is misaligned with the "{category}" category. Here are algorithmic suggestions to harmonize it for better brand synergy.</p>

        <div className="space-y-6">
          {harmonizerAnalysis.map((sug, index) => (
            <div key={index} className="bg-gray-900/50 p-4 rounded-lg">
              <h4 className="font-bold text-lg text-yellow-300 mb-3">Suggestion to align with Target Number {sug.target}:</h4>
              <div className="p-3 bg-gray-800/50 rounded-md border-l-4 border-yellow-500">
                <ul className="list-disc list-inside text-sm text-gray-300 pl-2 mt-2">
                  <li>
                    **Add** a letter with value **{sug.add.value}**
                    (e.g., {sug.add.letters.join(', ')})
                  </li>
                  {sug.remove.letters.length > 0 && (
                    <li>
                      **Remove** a letter with value **{sug.remove.value}**
                      (from your name: {sug.remove.letters.join(', ')})
                    </li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const memoizedTabs = useMemo(() => {
    const baseTabs = [
      { id: 'nameDeepDive', label: 'Name Deep Dive', icon: BookOpenIcon },
      { id: 'simulator', label: 'Simulator', icon: FlaskIcon },
      { id: 'business', label: 'Business', icon: BriefcaseIcon },
    ];

    if (report && report.vedicProfile) {
      baseTabs.splice(1, 0, { id: 'synergy', label: 'Synergy', icon: LinkIcon });
    }

    return baseTabs;
  }, [report]);

  return (
    <CosmicBackground density={140} useVideo={true}>
      <div className="min-h-screen relative px-4 md:px-6 py-6">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handleBackToHome}
              className="flex items-center gap-2 text-white/70 hover:text-auric-gold transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Home</span>
            </button>

            <div className="flex items-center gap-3">
              <span className="text-sm text-white/70 hidden md:block">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/50 px-4 py-2 rounded-md text-sm font-medium transition duration-200"
              >
                Sign Out
              </button>
            </div>
          </div>

          <header className="text-center mb-8">
            <h1 className="text-5xl font-extrabold text-yellow-400 font-serif tracking-widest">
              Name Analysis
            </h1>
            <p className="text-yellow-200/70">Your World-Class Numerology Architect</p>
          </header>

          {!report ? (
            <div className="mt-12">
              <FuturisticGate>
                <div className="text-center mb-8">
                  <h2 className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500 font-bold tracking-[0.2em] uppercase">
                    Initialize Sequence
                  </h2>
                  <p className="text-blue-300/60 text-xs mt-2 tracking-wider">ENTER THE DATA STREAM</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleGenerateReport(); }} className="space-y-6 max-w-md mx-auto relative">
                  {/* Decorative Input Borders */}
                  <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="relative w-full px-4 py-4 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500/50 text-white placeholder-gray-500 font-medium outline-none text-center tracking-wide"
                      placeholder="FULL LEGAL NAME"
                    />
                  </div>

                  <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={e => setDateOfBirth(e.target.value)}
                      className="relative w-full px-4 py-4 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500/50 text-white outline-none text-center tracking-wide uppercase"
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full group relative px-8 py-4 bg-black rounded-lg leading-none flex items-center justify-center"
                  >
                    <div className="absolute inset-0 w-full h-full rounded-lg bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 opacity-80 group-hover:opacity-100 blur-md transition-opacity duration-500"></div>
                    <div className="absolute inset-0.5 bg-gray-900 rounded-lg"></div>

                    <span className="relative flex items-center gap-3 text-yellow-100 font-bold tracking-widest uppercase text-sm group-hover:text-white transition-colors">
                      {isLoading ? <LoaderIcon className="w-4 h-4" /> : <><WandIcon className="w-4 h-4 animate-pulse" /> Reveal Analysis</>}
                    </span>
                  </button>

                  {error && <p className="text-center text-red-400 mt-4 font-semibold">{error}</p>}
                </form>
              </FuturisticGate>
            </div>
          ) : (
            <div>
              <div className="mb-4 border-b border-yellow-400/20 flex flex-wrap justify-center">
                {memoizedTabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 px-5 font-medium transition-colors duration-300 flex items-center gap-2 ${activeTab === tab.id ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-yellow-200/70 hover:text-yellow-300'}`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
              <div className="mt-6">
                {renderActiveTab()}
              </div>

              <button
                onClick={() => { setReport(null); setMasterReportText(null); setFullName(""); setDateOfBirth(""); setError(""); }}
                className="mt-8 block mx-auto bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-700 transition"
              >
                Analyze Another Name
              </button>
            </div>
          )}

          <footer className="text-center mt-12 text-sm text-gray-500">
            <p>This Name Analysis tool is based on your provided architectural design. All insights are for entertainment and informational purposes only.</p>
          </footer>
        </div>
      </div>
    </CosmicBackground>
  );
}
