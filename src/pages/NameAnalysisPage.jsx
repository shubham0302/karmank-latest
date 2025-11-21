import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, BookOpen, Link as LinkIcon, Briefcase, FlaskConical,
  Loader2, AlertCircle, Wand2, MousePointerClick, XCircle,
  Sun, PenTool, Upload, Trash2, Sparkles, Download
} from 'lucide-react';
import jsPDF from 'jspdf';
import CosmicBackground from '../components/CosmicBackground';
import { useAuth } from '../contexts/AuthContext';

// --- PYTHAGOREAN CONSTANTS ---
const PYTHAGOREAN_CONSTANTS = {
  letterData: {
    A: { num: 1, meaning: "Ambition & Drive", repeat: "Amplifies ambition and aggression" },
    B: { num: 2, meaning: "Emotional Sensitivity", repeat: "Enhances empathy but increases mood swings" },
    C: { num: 3, meaning: "Creative Expression", repeat: "Success after overcoming difficulties" },
    D: { num: 4, meaning: "Structure & Discipline", repeat: "Overcomes limitations with patience" },
    E: { num: 5, meaning: "Freedom & Adventure", repeat: "Acquires fame through writing or oratory" },
    F: { num: 6, meaning: "Love & Responsibility", repeat: "Protection in all family matters" },
    G: { num: 7, meaning: "Wisdom & Analysis", repeat: "A clever analyst who understands motives" },
    H: { num: 8, meaning: "Power & Authority", repeat: "Strong potential for material progress" },
    I: { num: 9, meaning: "Compassion & Completion", repeat: "Signifies extreme sensitivity and suffering" },
    J: { num: 1, meaning: "Initiative & Independence", repeat: "Shifts focus quickly" },
    K: { num: 2, meaning: "Cooperation & Duality", repeat: "Emotional fluctuation" },
    L: { num: 3, meaning: "Communication & Joy", repeat: "Keen insight into motives" },
    M: { num: 4, meaning: "Stability & Foundation", repeat: "Never accepts defeat" },
    N: { num: 5, meaning: "Change & Versatility", repeat: "Cycles of luck" },
    O: { num: 6, meaning: "Harmony & Nurturing", repeat: "Can exaggerate problems" },
    P: { num: 7, meaning: "Spiritual Insight", repeat: "Power and success follow" },
    Q: { num: 8, meaning: "Material Success", repeat: "Manages others well" },
    R: { num: 9, meaning: "Humanitarian Service", repeat: "Needs discretion" },
    S: { num: 1, meaning: "Self-Reliance", repeat: "Gains through originality" },
    T: { num: 2, meaning: "Partnership & Balance", repeat: "Emotional intensity grows" },
    U: { num: 3, meaning: "Optimism & Expression", repeat: "Trouble expressing feelings" },
    V: { num: 4, meaning: "Practical Foundation", repeat: "Strong determination" },
    W: { num: 5, meaning: "Dynamic Energy", repeat: "Intense personal magnetism" },
    X: { num: 6, meaning: "Responsibility", repeat: "Passion for life increases" },
    Y: { num: 7, meaning: "Inner Wisdom", repeat: "Frustrations need outlets" },
    Z: { num: 8, meaning: "Executive Ability", repeat: "Wealth through inheritance" }
  }
};

const NUMBER_MEANINGS = {
  1: "Symbolizes leadership, independence, and pioneering spirit. You are a natural-born leader with strong willpower and determination. You thrive on challenges and prefer to forge your own path rather than follow others.",
  2: "Represents diplomacy, cooperation, and sensitivity. You are naturally empathetic and excel in partnerships. Your gentle nature and ability to mediate make you a peacemaker, though you may struggle with self-doubt.",
  3: "Embodies creativity, self-expression, and joy. You are optimistic, artistic, and thrive in social settings. Your charisma and communication skills make you a natural entertainer, though you may scatter your energy.",
  4: "Signifies stability, hard work, and practicality. You are disciplined, reliable, and excel at building solid foundations. Your methodical approach brings success, though you may resist change.",
  5: "Represents freedom, adventure, and versatility. You are dynamic, curious, and crave variety in life. Your adaptability and progressive thinking drive you forward, though you may struggle with commitment.",
  6: "Embodies love, responsibility, and nurturing. You are caring, protective, and drawn to service. Your sense of duty to family and community is strong, though you may become overly self-sacrificing.",
  7: "Symbolizes wisdom, spirituality, and analysis. You are introspective, philosophical, and seek deeper truths. Your analytical mind and intuition guide you, though you may become isolated.",
  8: "Represents power, authority, and material success. You are ambitious, business-minded, and excel at manifesting wealth. Your executive abilities are strong, though you may become overly focused on status.",
  9: "Embodies compassion, completion, and humanitarian service. You are selfless, wise, and drawn to helping humanity. Your broad perspective and generosity inspire others, though you may struggle with personal boundaries.",
  11: "A master number representing spiritual illumination and intuition. You are highly sensitive, visionary, and possess profound insights. Your mission is to inspire and enlighten others through your idealism and creativity.",
  22: "A master number embodying the master builder. You have the ability to turn dreams into reality on a grand scale. Your practical vision and organizational skills can create lasting legacies.",
  33: "A master number of compassion and teaching. You are the master teacher with a mission to uplift humanity through unconditional love and service. Your nurturing abilities are extraordinarily powerful."
};

const CORE_DEFINITIONS = {
  blueprint: {
    title: "The Blueprint (Expression Number)",
    def: "This number represents your natural talents, abilities, and the path you're meant to walk. It's derived from the full numerical value of your name and shows how you express yourself to the world."
  },
  soulUrge: {
    title: "The Core Drive (Soul Urge Number)",
    def: "This reveals your innermost desires, motivations, and what drives you at the deepest level. It comes from the vowels in your name and represents your heart's true yearning."
  },
  interface: {
    title: "The Interface (Personality Number)",
    def: "This number shows how others perceive you—your outer personality and first impression. Derived from the consonants in your name, it's the mask you wear in social situations."
  }
};

const STATIC_NARRATIVES = {
  blueprint: {
    1: "The Initiator. You walk through life with the blueprint of a pioneer—meant to lead, create, and forge new paths. Your natural talents revolve around independence and originality.",
    2: "The Diplomat. Your blueprint is one of harmony and partnership. You're designed to bring people together, mediate conflicts, and create peace wherever you go.",
    3: "The Creator. Your life's blueprint centers on creative expression and joy. You're meant to communicate, inspire, and bring beauty into the world through your artistic talents.",
    4: "The Builder. Your blueprint emphasizes structure, discipline, and practical achievement. You're designed to create lasting foundations and bring order to chaos.",
    5: "The Explorer. Your blueprint is one of freedom and adventure. You're meant to experience variety, embrace change, and liberate others through your progressive thinking.",
    6: "The Nurturer. Your blueprint revolves around love, responsibility, and service. You're designed to care for others, create harmony in relationships, and build community.",
    7: "The Seeker. Your blueprint is one of wisdom and spiritual understanding. You're meant to analyze, investigate, and uncover deeper truths about life and existence.",
    8: "The Executive. Your blueprint centers on power, authority, and material mastery. You're designed to achieve success, manage resources, and create abundance.",
    9: "The Humanitarian. Your blueprint is one of compassion and completion. You're meant to serve humanity, embrace all people, and bring healing to the world.",
    11: "The Illuminator. Your master blueprint is one of spiritual insight and inspiration. You're designed to be a beacon of light, inspiring others through your visionary ideals.",
    22: "The Master Builder. Your rare blueprint combines vision with practical execution. You're meant to manifest great achievements and create structures that benefit humanity.",
    33: "The Master Teacher. Your exceptional blueprint is one of unconditional love and service. You're designed to uplift humanity through compassionate teaching and healing."
  },
  soulUrge: {
    1: "Deep down, you crave total independence and the freedom to lead. Your soul yearns to stand out, make your own decisions, and be recognized for your unique contributions.",
    2: "At your core, you desire deep connections and harmonious relationships. Your soul seeks partnership, understanding, and the ability to bring people together.",
    3: "Your innermost desire is to express yourself creatively and bring joy to others. Your soul craves artistic outlets, social interaction, and opportunities to inspire.",
    4: "At your deepest level, you yearn for security, order, and tangible results. Your soul desires to build something lasting and create stability.",
    5: "Your core drive is freedom—to travel, experience new things, and live without restrictions. Your soul craves adventure, variety, and personal liberation.",
    6: "Deep within, you desire to love, nurture, and take responsibility for others. Your soul yearns to create harmony in relationships and serve your community.",
    7: "At your essence, you seek wisdom, spiritual understanding, and solitude for reflection. Your soul craves deeper truths and meaningful insights.",
    8: "Your innermost desire is for power, success, and material abundance. Your soul yearns to achieve recognition, build wealth, and exercise authority.",
    9: "Deep down, you desire to serve humanity and make the world a better place. Your soul craves opportunities to give selflessly and heal others.",
    11: "Your core drive is to illuminate and inspire. Your soul yearns to channel higher wisdom and lift others through your spiritual insights and idealism.",
    22: "At your essence, you desire to build something grand that serves humanity. Your soul craves the opportunity to manifest visionary projects on a large scale.",
    33: "Your deepest yearning is to teach, heal, and uplift through unconditional love. Your soul desires to serve as a beacon of compassion and wisdom."
  },
  interface: {
    1: "You appear confident, direct, and original. Others see you as a strong leader who knows what they want and isn't afraid to go after it.",
    2: "You come across as gentle, approachable, and diplomatic. Others perceive you as a peacemaker who is easy to talk to and naturally understanding.",
    3: "You project warmth, creativity, and charm. Others see you as expressive, fun-loving, and someone who lights up any room you enter.",
    4: "You appear practical, reliable, and grounded. Others perceive you as someone dependable, organized, and down-to-earth.",
    5: "You come across as dynamic, energetic, and exciting. Others see you as adventurous, adaptable, and always ready for something new.",
    6: "You project warmth, responsibility, and care. Others perceive you as nurturing, trustworthy, and someone who puts family and community first.",
    7: "You appear mysterious, intelligent, and reserved. Others see you as analytical, introspective, and someone with hidden depths.",
    8: "You project authority, ambition, and confidence. Others perceive you as powerful, successful, and someone who commands respect.",
    9: "You appear compassionate, wise, and selfless. Others see you as a humanitarian with a big heart and a generous spirit.",
    11: "You project sensitivity, idealism, and inspiration. Others perceive you as someone with unusual depth, vision, and spiritual awareness.",
    22: "You appear visionary yet practical. Others see you as someone capable of achieving great things and turning ambitious plans into reality.",
    33: "You project love, wisdom, and healing energy. Others perceive you as a natural teacher and guide with profound compassion."
  }
};

const KARMANK_CONSTANTS = {
  numberDetails: {
    1: { name: "Surya (Sun)", description: "Carries a confident, ambitious, and driven leadership quality. They are inspiring but don't take orders easily." },
    2: { name: "Chandra (Moon)", description: "Emotional and caring, needing constant motivation. They seek love, appreciation, and support." },
    3: { name: "Guru (Jupiter)", description: "Wise, disciplined, and family-oriented. They have strong values and resist temptation." },
    4: { name: "Rahu (North Node)", description: "Adventurous and risk-taking, but prone to overthinking and mood swings. Plans may not always work out." },
    5: { name: "Budh (Mercury)", description: "Logical and born for business. They are masters of money and value every penny." },
    6: { name: "Shukra (Venus)", description: "Naturally charming, especially to the opposite gender. They love luxury, fashion, and good food, and can be blunt." },
    7: { name: "Ketu (South Node)", description: "Lucky, with a natural inclination towards spirituality and deep, logical thinking. Travel is often meaningful." },
    8: { name: "Shani (Saturn)", description: "Hard-working, though life may feel slow. They have a soft heart, strong self-respect, and a belief in justice." },
    9: { name: "Mangal (Mars)", description: "Bold, confident, and full of energy. They are quick to act, love challenges, and feel a need to prove themselves." }
  }
};

// --- HELPER FUNCTIONS ---

function reduceToSingleDigit(num) {
  if (num === 11 || num === 22 || num === 33) return num;
  while (num > 9) {
    num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    if (num === 11 || num === 22 || num === 33) return num;
  }
  return num;
}

function getZodiacSign(dobString) {
  if (!dobString) return { name: "Unknown", element: "—", symbol: "?" };
  const [, month, day] = dobString.split('-').map(Number);
  const zodiacData = [
    { sign: "Capricorn", start: [12, 22], end: [1, 19], element: "Earth", symbol: "♑" },
    { sign: "Aquarius", start: [1, 20], end: [2, 18], element: "Air", symbol: "♒" },
    { sign: "Pisces", start: [2, 19], end: [3, 20], element: "Water", symbol: "♓" },
    { sign: "Aries", start: [3, 21], end: [4, 19], element: "Fire", symbol: "♈" },
    { sign: "Taurus", start: [4, 20], end: [5, 20], element: "Earth", symbol: "♉" },
    { sign: "Gemini", start: [5, 21], end: [6, 20], element: "Air", symbol: "♊" },
    { sign: "Cancer", start: [6, 21], end: [7, 22], element: "Water", symbol: "♋" },
    { sign: "Leo", start: [7, 23], end: [8, 22], element: "Fire", symbol: "♌" },
    { sign: "Virgo", start: [8, 23], end: [9, 22], element: "Earth", symbol: "♍" },
    { sign: "Libra", start: [9, 23], end: [10, 22], element: "Air", symbol: "♎" },
    { sign: "Scorpio", start: [10, 23], end: [11, 21], element: "Water", symbol: "♏" },
    { sign: "Sagittarius", start: [11, 22], end: [12, 21], element: "Fire", symbol: "♐" }
  ];

  for (const z of zodiacData) {
    const [startMonth, startDay] = z.start;
    const [endMonth, endDay] = z.end;
    if (
      (month === startMonth && day >= startDay) ||
      (month === endMonth && day <= endDay) ||
      (startMonth > endMonth && (month === startMonth || month === endMonth))
    ) {
      return { name: z.sign, element: z.element, symbol: z.symbol };
    }
  }
  return { name: "Unknown", element: "—", symbol: "?" };
}

function calculateProfile(name, dob) {
  const upperName = name.toUpperCase().replace(/[^A-Z]/g, "");
  const vowels = "AEIOU";
  let expression = 0, soulUrge = 0, personality = 0;
  const letterCounts = {};

  for (let char of upperName) {
    const data = PYTHAGOREAN_CONSTANTS.letterData[char];
    if (data) {
      expression += data.num;
      if (vowels.includes(char)) {
        soulUrge += data.num;
      } else {
        personality += data.num;
      }
      letterCounts[char] = (letterCounts[char] || 0) + 1;
    }
  }

  const amplifiedTraits = Object.entries(letterCounts)
    .filter(([_, count]) => count > 2)
    .map(([char, count]) => ({
      letter: char,
      count,
      meaning: PYTHAGOREAN_CONSTANTS.letterData[char].meaning,
      effect: PYTHAGOREAN_CONSTANTS.letterData[char].repeat
    }));

  expression = reduceToSingleDigit(expression);
  soulUrge = reduceToSingleDigit(soulUrge);
  personality = reduceToSingleDigit(personality);

  let destinyNumber = null;
  let basicNumber = null;
  if (dob) {
    const digits = dob.replace(/\D/g, '');
    const dayDigits = dob.split('-')[2];
    basicNumber = reduceToSingleDigit(parseInt(dayDigits));
    destinyNumber = reduceToSingleDigit(digits.split('').reduce((sum, d) => sum + parseInt(d), 0));
  }

  const zodiac = getZodiacSign(dob);

  return {
    name,
    dob,
    expression,
    soulUrge,
    personality,
    destinyNumber,
    basicNumber,
    amplifiedTraits,
    zodiac
  };
}

function getVibrationalStatus(expression, soulUrge) {
  const diff = Math.abs(expression - soulUrge);
  if (diff === 0) return { label: "Perfect Alignment", percent: 100, color: "text-green-400", bgColor: "bg-green-500" };
  if (diff <= 2) return { label: "High Synergy", percent: 80, color: "text-cyan-400", bgColor: "bg-cyan-500" };
  if (diff <= 4) return { label: "Moderate Friction", percent: 60, color: "text-yellow-400", bgColor: "bg-yellow-500" };
  if (diff <= 6) return { label: "Significant Tension", percent: 40, color: "text-orange-400", bgColor: "bg-orange-500" };
  return { label: "Major Conflict", percent: 20, color: "text-red-400", bgColor: "bg-red-500" };
}

// --- PDF GENERATION FUNCTION ---
function generatePDF(report) {
  const { pythagoreanProfile, profile } = report;
  const doc = new jsPDF();

  // Colors matching the screen (converting Tailwind colors to RGB)
  const colors = {
    black: [0, 0, 0],
    cyan: [34, 211, 238],       // cyan-400
    purple: [192, 132, 252],    // purple-400
    yellow: [250, 204, 21],     // yellow-400
    green: [74, 222, 128],      // green-400
    gray: [156, 163, 175],      // gray-400
    white: [255, 255, 255]
  };

  // Background - Black
  doc.setFillColor(...colors.black);
  doc.rect(0, 0, 210, 297, 'F');

  let yPos = 20;

  // Title
  doc.setFontSize(24);
  doc.setTextColor(...colors.cyan);
  doc.text('AETHERNUMERIS', 105, yPos, { align: 'center' });

  yPos += 8;
  doc.setFontSize(10);
  doc.setTextColor(...colors.gray);
  doc.text('PYTHAGOREAN NAME ANALYSIS SYSTEM', 105, yPos, { align: 'center' });

  yPos += 15;

  // Name
  doc.setFontSize(18);
  doc.setTextColor(...colors.cyan);
  doc.text(profile.name, 105, yPos, { align: 'center' });

  yPos += 15;

  // Core Numbers Section
  doc.setFontSize(14);
  doc.setTextColor(...colors.white);
  doc.text('Core Numbers', 20, yPos);
  yPos += 10;

  // Blueprint
  doc.setFontSize(12);
  doc.setTextColor(...colors.cyan);
  doc.text('Blueprint (Expression)', 20, yPos);
  doc.setFontSize(24);
  doc.text(String(pythagoreanProfile.expression), 30, yPos + 10);

  doc.setFontSize(10);
  doc.setTextColor(...colors.gray);
  const blueprintText = doc.splitTextToSize(NUMBER_MEANINGS[pythagoreanProfile.expression], 170);
  doc.text(blueprintText, 20, yPos + 18);
  yPos += 18 + (blueprintText.length * 5) + 5;

  // Core Drive
  doc.setFontSize(12);
  doc.setTextColor(...colors.purple);
  doc.text('Core Drive (Soul Urge)', 20, yPos);
  doc.setFontSize(24);
  doc.text(String(pythagoreanProfile.soulUrge), 30, yPos + 10);

  doc.setFontSize(10);
  doc.setTextColor(...colors.gray);
  const soulUrgeText = doc.splitTextToSize(NUMBER_MEANINGS[pythagoreanProfile.soulUrge], 170);
  doc.text(soulUrgeText, 20, yPos + 18);
  yPos += 18 + (soulUrgeText.length * 5) + 5;

  // Interface
  doc.setFontSize(12);
  doc.setTextColor(...colors.yellow);
  doc.text('Interface (Personality)', 20, yPos);
  doc.setFontSize(24);
  doc.text(String(pythagoreanProfile.personality), 30, yPos + 10);

  doc.setFontSize(10);
  doc.setTextColor(...colors.gray);
  const personalityText = doc.splitTextToSize(NUMBER_MEANINGS[pythagoreanProfile.personality], 170);
  doc.text(personalityText, 20, yPos + 18);
  yPos += 18 + (personalityText.length * 5) + 5;

  // Check if we need a new page
  if (yPos > 250) {
    doc.addPage();
    doc.setFillColor(...colors.black);
    doc.rect(0, 0, 210, 297, 'F');
    yPos = 20;
  }

  // Zodiac
  if (pythagoreanProfile.zodiac && pythagoreanProfile.zodiac.name !== "Unknown") {
    doc.setFontSize(12);
    doc.setTextColor(...colors.yellow);
    doc.text('Zodiac Sign', 20, yPos);
    doc.setFontSize(10);
    doc.setTextColor(...colors.white);
    doc.text(`${pythagoreanProfile.zodiac.symbol} ${pythagoreanProfile.zodiac.name} (${pythagoreanProfile.zodiac.element})`, 20, yPos + 7);
    yPos += 15;
  }

  // Vibrational Alignment
  const vibrationalStatus = getVibrationalStatus(pythagoreanProfile.expression, pythagoreanProfile.soulUrge);
  doc.setFontSize(12);
  doc.setTextColor(...colors.white);
  doc.text('Vibrational Alignment', 20, yPos);
  doc.setFontSize(10);

  // Color based on status
  const statusColor = vibrationalStatus.label.includes('Perfect') ? colors.green :
                     vibrationalStatus.label.includes('High') ? colors.cyan :
                     vibrationalStatus.label.includes('Moderate') ? colors.yellow :
                     colors.gray;
  doc.setTextColor(...statusColor);
  doc.text(vibrationalStatus.label, 20, yPos + 7);
  yPos += 15;

  // Amplified Traits
  if (pythagoreanProfile.amplifiedTraits.length > 0) {
    if (yPos > 230) {
      doc.addPage();
      doc.setFillColor(...colors.black);
      doc.rect(0, 0, 210, 297, 'F');
      yPos = 20;
    }

    doc.setFontSize(12);
    doc.setTextColor(...colors.yellow);
    doc.text('High-Intensity Zones', 20, yPos);
    yPos += 8;

    pythagoreanProfile.amplifiedTraits.forEach(trait => {
      doc.setFontSize(10);
      doc.setTextColor(...colors.yellow);
      doc.text(`${trait.letter} (appears ${trait.count}x)`, 20, yPos);
      doc.setTextColor(...colors.white);
      doc.text(trait.meaning, 50, yPos);
      yPos += 5;
      doc.setFontSize(9);
      doc.setTextColor(...colors.gray);
      const effectText = doc.splitTextToSize(trait.effect, 170);
      doc.text(effectText, 20, yPos);
      yPos += (effectText.length * 4) + 5;
    });
  }

  // Vedic Numbers (if available)
  if (profile.destinyNumber) {
    if (yPos > 230) {
      doc.addPage();
      doc.setFillColor(...colors.black);
      doc.rect(0, 0, 210, 297, 'F');
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(...colors.white);
    doc.text('Vedic Numerology', 20, yPos);
    yPos += 10;

    const destinyData = KARMANK_CONSTANTS.numberDetails[profile.destinyNumber];
    doc.setFontSize(11);
    doc.setTextColor(...colors.green);
    doc.text(`Destiny Number (Bhagyank): ${profile.destinyNumber}`, 20, yPos);
    doc.setFontSize(10);
    doc.setTextColor(...colors.white);
    doc.text(destinyData.name, 20, yPos + 6);
    doc.setTextColor(...colors.gray);
    const destinyDesc = doc.splitTextToSize(destinyData.description, 170);
    doc.text(destinyDesc, 20, yPos + 12);
    yPos += 12 + (destinyDesc.length * 5) + 8;

    const basicData = KARMANK_CONSTANTS.numberDetails[profile.basicNumber];
    doc.setFontSize(11);
    doc.setTextColor(...colors.cyan);
    doc.text(`Basic Number (Moolank): ${profile.basicNumber}`, 20, yPos);
    doc.setFontSize(10);
    doc.setTextColor(...colors.white);
    doc.text(basicData.name, 20, yPos + 6);
    doc.setTextColor(...colors.gray);
    const basicDesc = doc.splitTextToSize(basicData.description, 170);
    doc.text(basicDesc, 20, yPos + 12);
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(...colors.gray);
  doc.text('Generated by KarmAnk - Vedic Numerology & Name Analysis', 105, 285, { align: 'center' });

  // Save the PDF
  doc.save(`${profile.name.replace(/\s+/g, '_')}_Numerology_Report.pdf`);
}

// --- GEMINI API FUNCTION ---
async function fetchGeminiAnalysis(prompt, imageBase64 = null) {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  if (!GEMINI_API_KEY) throw new Error("Gemini API key not configured");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;

  const parts = [{ text: prompt }];
  if (imageBase64) {
    parts.push({
      inline_data: {
        mime_type: "image/png",
        data: imageBase64
      }
    });
  }

  const payload = {
    contents: [{ parts }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Gemini API request failed');
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

// --- UI COMPONENTS ---

const TabButton = ({ active, onClick, children, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
      active
        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
    }`}
  >
    {Icon && <Icon className="w-4 h-4" />}
    {children}
  </button>
);

const FuturisticGate = () => (
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
        <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500">
          AETHERNUMERIS
        </div>
        <div className="text-sm text-cyan-400/60 tracking-widest">
          PYTHAGOREAN NAME ANALYSIS SYSTEM
        </div>
      </div>
    </div>
  </div>
);

const ShareableIdentityCard = ({ name, pythagoreanProfile }) => {
  const { expression, soulUrge, personality, zodiac } = pythagoreanProfile;

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-black p-6 rounded-xl border border-cyan-500/30 shadow-2xl">
      <div className="text-center space-y-4">
        <div className="text-2xl font-bold text-cyan-300">{name}</div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-gray-400 mb-1">Blueprint</div>
            <div className="text-3xl font-bold text-cyan-400">{expression}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Core Drive</div>
            <div className="text-3xl font-bold text-purple-400">{soulUrge}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Interface</div>
            <div className="text-3xl font-bold text-yellow-400">{personality}</div>
          </div>
        </div>
        {zodiac && (
          <div className="text-sm text-gray-400">
            {zodiac.symbol} {zodiac.name} • {zodiac.element}
          </div>
        )}
      </div>
    </div>
  );
};

const ArtisticNarrative = ({ report }) => {
  const { pythagoreanProfile, profile } = report;
  const name = profile.name.toUpperCase().replace(/[^A-Z]/g, "");
  const letters = name.split("");

  const distinctTraits = letters.reduce((acc, char) => {
    const meaning = PYTHAGOREAN_CONSTANTS.letterData[char]?.meaning;
    if (meaning && !acc.some(t => t.meaning === meaning)) {
      acc.push({ char, meaning });
    }
    return acc;
  }, []).slice(0, 5);

  const traitsList = distinctTraits.map(t => `**${t.meaning}**`).join(", ");

  const narrativeParagraphs = [
    `Using the Pythagorean method, the name **${profile.name}** carries a unique vibrational signature. Each letter holds a specific frequency, and together they compose a symphony of traits: ${traitsList}.`,
    `Your **Blueprint** (Expression Number **${pythagoreanProfile.expression}**) reveals: ${STATIC_NARRATIVES.blueprint[pythagoreanProfile.expression]}`,
    `Your **Core Drive** (Soul Urge Number **${pythagoreanProfile.soulUrge}**) whispers: ${STATIC_NARRATIVES.soulUrge[pythagoreanProfile.soulUrge]}`,
    `Your **Interface** (Personality Number **${pythagoreanProfile.personality}**) projects: ${STATIC_NARRATIVES.interface[pythagoreanProfile.personality]}`
  ];

  const renderMarkdown = (text) => {
    return text.split('**').map((part, i) =>
      i % 2 === 0 ? part : <strong key={i} className="text-cyan-300">{part}</strong>
    );
  };

  return (
    <div className="bg-gray-900/50 p-6 md:p-8 rounded-xl border border-cyan-500/20">
      <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-blue-400 mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-cyan-400" />
        The Chronos Narrative
      </h3>
      <div className="space-y-4 text-gray-300 leading-relaxed">
        {narrativeParagraphs.map((para, idx) => (
          <p key={idx}>{renderMarkdown(para)}</p>
        ))}
      </div>
    </div>
  );
};

// --- TAB COMPONENTS ---

const NameDeepDiveTab = ({ report }) => {
  const { pythagoreanProfile, profile } = report;
  const [activeDefinition, setActiveDefinition] = useState(null);

  const vibrationalStatus = getVibrationalStatus(pythagoreanProfile.expression, pythagoreanProfile.soulUrge);

  const cards = [
    {
      id: 'blueprint',
      label: 'Blueprint',
      sublabel: 'Expression',
      val: pythagoreanProfile.expression,
      color: 'text-cyan-400',
      bgGradient: 'from-cyan-900/40 to-cyan-800/20',
      borderColor: 'border-cyan-700/50'
    },
    {
      id: 'soulUrge',
      label: 'Core Drive',
      sublabel: 'Soul Urge',
      val: pythagoreanProfile.soulUrge,
      color: 'text-purple-400',
      bgGradient: 'from-purple-900/40 to-purple-800/20',
      borderColor: 'border-purple-700/50'
    },
    {
      id: 'interface',
      label: 'Interface',
      sublabel: 'Personality',
      val: pythagoreanProfile.personality,
      color: 'text-yellow-400',
      bgGradient: 'from-yellow-900/40 to-yellow-800/20',
      borderColor: 'border-yellow-700/50'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {/* Definition Modal */}
      {activeDefinition && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 rounded-xl backdrop-blur-md p-6">
          <div className="text-center relative max-w-md">
            <button
              onClick={() => setActiveDefinition(null)}
              className="absolute -top-4 -right-4 text-gray-400 hover:text-white transition-colors"
            >
              <XCircle className="w-8 h-8" />
            </button>
            <div className={`text-8xl font-bold mb-2 font-mono ${activeDefinition.color}`}>
              {activeDefinition.val}
            </div>
            <h4 className="text-2xl font-bold text-white mb-4">
              {CORE_DEFINITIONS[activeDefinition.id].title}
            </h4>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              {CORE_DEFINITIONS[activeDefinition.id].def}
            </p>
            <div className="bg-gray-900/60 p-4 rounded-lg border border-gray-700">
              <p className="text-white leading-relaxed">
                {NUMBER_MEANINGS[activeDefinition.val]}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Cards Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        {cards.map(card => (
          <div
            key={card.id}
            onClick={() => setActiveDefinition(card)}
            className={`cursor-pointer hover:scale-[1.02] transition-all duration-200 text-center p-4 bg-gradient-to-br ${card.bgGradient} border ${card.borderColor} rounded-xl relative group`}
          >
            <MousePointerClick className="absolute top-2 right-2 w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
            <p className={`text-xs ${card.color} mb-0.5`}>{card.label}</p>
            <p className="text-xs text-gray-400 mb-2">({card.sublabel})</p>
            <p className={`text-6xl font-bold ${card.color}`}>{card.val}</p>
          </div>
        ))}

        {/* Zodiac Card */}
        <div className="bg-gray-900/60 p-4 rounded-xl border border-gray-700 text-center">
          <Sun className="w-4 h-4 text-yellow-400 mx-auto mb-2" />
          <p className="text-xs text-gray-400 mb-1">Zodiac</p>
          <p className="text-2xl mb-1">{pythagoreanProfile.zodiac.symbol}</p>
          <p className="text-sm text-white font-medium">{pythagoreanProfile.zodiac.name}</p>
          <p className="text-xs text-gray-500">{pythagoreanProfile.zodiac.element}</p>
        </div>
      </div>

      {/* Vibrational Friction Bar */}
      <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Vibrational Alignment</span>
          <span className={`text-sm font-bold ${vibrationalStatus.color}`}>
            {vibrationalStatus.label}
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full ${vibrationalStatus.bgColor} transition-all duration-1000 ease-out`}
            style={{ width: `${vibrationalStatus.percent}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Measures the harmony between your outer expression and inner desires.
        </p>
      </div>

      {/* Artistic Narrative */}
      <ArtisticNarrative report={report} />

      {/* High-Intensity Zones */}
      {pythagoreanProfile.amplifiedTraits.length > 0 && (
        <div className="bg-gray-900/50 p-6 rounded-xl border border-yellow-500/20">
          <h3 className="text-lg font-bold text-yellow-400 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            High-Intensity Zones
          </h3>
          <div className="space-y-3">
            {pythagoreanProfile.amplifiedTraits.map((trait, idx) => (
              <div key={idx} className="bg-gray-950/50 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-yellow-400">{trait.letter}</span>
                  <span className="text-sm text-gray-400">appears {trait.count}× in your name</span>
                </div>
                <p className="text-sm text-white mb-1">{trait.meaning}</p>
                <p className="text-xs text-gray-500 italic">{trait.effect}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Identity Card */}
      <ShareableIdentityCard name={profile.name} pythagoreanProfile={pythagoreanProfile} />

      {/* Download PDF Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => generatePDF(report)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg shadow-cyan-500/20"
        >
          <Download className="w-5 h-5" />
          Download PDF Report
        </button>
      </div>
    </div>
  );
};

const SandboxTab = ({ profile }) => {
  const [comparisonName, setComparisonName] = useState('');
  const [comparisonProfile, setComparisonProfile] = useState(null);

  const handleCompare = () => {
    if (!comparisonName.trim()) return;
    const compared = calculateProfile(comparisonName, null);
    setComparisonProfile(compared);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gray-900/60 p-6 rounded-xl border border-purple-500/20">
        <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
          <FlaskConical className="w-5 h-5" />
          Name Comparison Lab
        </h3>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={comparisonName}
            onChange={(e) => setComparisonName(e.target.value)}
            placeholder="Enter another name to compare..."
            className="flex-1 px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
          />
          <button
            onClick={handleCompare}
            className="px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/50 rounded-lg font-medium transition-all duration-200"
          >
            Compare
          </button>
        </div>

        {comparisonProfile && (
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-950/50 p-4 rounded-lg border border-cyan-500/30">
              <h4 className="text-cyan-400 font-bold mb-3">{profile.name}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Expression:</span>
                  <span className="text-white font-bold">{profile.expression}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Soul Urge:</span>
                  <span className="text-white font-bold">{profile.soulUrge}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Personality:</span>
                  <span className="text-white font-bold">{profile.personality}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-950/50 p-4 rounded-lg border border-purple-500/30">
              <h4 className="text-purple-400 font-bold mb-3">{comparisonProfile.name}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Expression:</span>
                  <span className="text-white font-bold">{comparisonProfile.expression}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Soul Urge:</span>
                  <span className="text-white font-bold">{comparisonProfile.soulUrge}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Personality:</span>
                  <span className="text-white font-bold">{comparisonProfile.personality}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SynergyTab = ({ report }) => {
  const { pythagoreanProfile, profile } = report;

  if (!profile.destinyNumber) {
    return (
      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-6 text-center">
        <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
        <p className="text-yellow-300">
          Date of birth required for Vedic numerology synergy analysis.
        </p>
      </div>
    );
  }

  const destinyData = KARMANK_CONSTANTS.numberDetails[profile.destinyNumber];
  const basicData = KARMANK_CONSTANTS.numberDetails[profile.basicNumber];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gray-900/60 p-6 rounded-xl border border-green-500/20">
        <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
          <LinkIcon className="w-5 h-5" />
          Name-Destiny Synergy
        </h3>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-950/50 p-4 rounded-lg border border-cyan-500/30">
            <div className="text-sm text-gray-400 mb-2">Pythagorean Expression</div>
            <div className="text-4xl font-bold text-cyan-400 mb-2">{pythagoreanProfile.expression}</div>
            <p className="text-sm text-gray-300">{NUMBER_MEANINGS[pythagoreanProfile.expression].slice(0, 150)}...</p>
          </div>

          <div className="bg-gray-950/50 p-4 rounded-lg border border-green-500/30">
            <div className="text-sm text-gray-400 mb-2">Vedic Destiny (Bhagyank)</div>
            <div className="text-4xl font-bold text-green-400 mb-2">{profile.destinyNumber}</div>
            <div className="text-sm text-green-300 mb-1">{destinyData.name}</div>
            <p className="text-sm text-gray-300">{destinyData.description}</p>
          </div>
        </div>

        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
          <h4 className="text-green-400 font-bold mb-2">Synergy Insight</h4>
          <p className="text-gray-300 text-sm leading-relaxed">
            Your Pythagorean Expression Number ({pythagoreanProfile.expression}) represents how you naturally express yourself through your name,
            while your Vedic Destiny Number ({profile.destinyNumber} - {destinyData.name}) reflects your life path from birth.
            When these energies align harmoniously, you experience greater ease in manifesting your purpose.
          </p>
        </div>

        <div className="mt-6 bg-gray-950/50 p-4 rounded-lg border border-rose-500/30">
          <div className="text-sm text-gray-400 mb-2">Vedic Basic (Moolank)</div>
          <div className="text-3xl font-bold text-rose-400 mb-2">{profile.basicNumber}</div>
          <div className="text-sm text-rose-300 mb-1">{basicData.name}</div>
          <p className="text-sm text-gray-300">{basicData.description}</p>
        </div>
      </div>
    </div>
  );
};

const SignatureTab = () => {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [mode, setMode] = useState('draw');
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (canvasRef.current && mode === 'draw') {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [mode]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.strokeStyle = '#FACC15';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    setAnalysis(null);
    setError(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
        setHasSignature(true);
        setAnalysis(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeSignature = async () => {
    setLoading(true);
    setError(null);
    try {
      let imageBase64;
      if (mode === 'draw') {
        imageBase64 = canvasRef.current.toDataURL('image/png').split(',')[1];
      } else {
        imageBase64 = uploadedImage.split(',')[1];
      }

      const prompt = `Analyze this signature from a numerological and graphological perspective. Provide insights about:
1. Overall personality traits revealed
2. Confidence and self-expression level
3. Emotional stability
4. Leadership qualities
5. Creative tendencies
Keep the response concise and insightful (3-4 sentences).`;

      const result = await fetchGeminiAnalysis(prompt, imageBase64);
      setAnalysis(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gray-900/60 p-6 rounded-xl border border-yellow-500/20">
        <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
          <PenTool className="w-5 h-5" />
          The Signature Alchemist
        </h3>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => {
              setMode('draw');
              setHasSignature(false);
              setAnalysis(null);
              setUploadedImage(null);
            }}
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${
              mode === 'draw'
                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <PenTool className="w-4 h-4 inline mr-2" />
            DRAW
          </button>
          <button
            onClick={() => {
              setMode('upload');
              setHasSignature(false);
              setAnalysis(null);
            }}
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${
              mode === 'upload'
                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Upload className="w-4 h-4 inline mr-2" />
            UPLOAD
          </button>
        </div>

        <div className="border border-dashed border-gray-700 rounded-xl bg-gray-950 mb-4 overflow-hidden">
          {mode === 'draw' ? (
            <canvas
              ref={canvasRef}
              width={600}
              height={200}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="w-full cursor-crosshair"
              style={{ touchAction: 'none' }}
            />
          ) : (
            <div className="p-8 text-center">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
              {uploadedImage ? (
                <img src={uploadedImage} alt="Uploaded signature" className="max-h-48 mx-auto" />
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/50 rounded-lg font-medium transition-all"
                >
                  <Upload className="w-5 h-5 inline mr-2" />
                  Choose Image
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={clearSignature}
            disabled={!hasSignature}
            className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4 inline mr-2" />
            Clear
          </button>
          <button
            onClick={analyzeSignature}
            disabled={!hasSignature || loading}
            className="flex-1 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/50 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 inline mr-2" />
                Analyze
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {analysis && (
        <div className="bg-gray-900/60 p-6 rounded-xl border border-yellow-500/20">
          <h4 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Signature Analysis
          </h4>
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{analysis}</p>
        </div>
      )}
    </div>
  );
};

const BusinessTab = ({ report }) => {
  const { pythagoreanProfile } = report;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gray-900/60 p-6 rounded-xl border border-blue-500/20">
        <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Professional Alignment
        </h3>
        <p className="text-gray-300 mb-6">
          Based on your Expression Number ({pythagoreanProfile.expression}), here are fields where your name vibration aligns naturally:
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-blue-400 font-bold mb-2">Career Strengths</h4>
            <p className="text-gray-300 text-sm">
              {NUMBER_MEANINGS[pythagoreanProfile.expression]}
            </p>
          </div>

          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
            <h4 className="text-purple-400 font-bold mb-2">Inner Motivation</h4>
            <p className="text-gray-300 text-sm">
              {STATIC_NARRATIVES.soulUrge[pythagoreanProfile.soulUrge]}
            </p>
          </div>
        </div>

        <div className="mt-6 bg-gray-950/50 p-4 rounded-lg border border-gray-700">
          <h4 className="text-white font-bold mb-3">Professional Recommendations</h4>
          <p className="text-gray-400 text-sm leading-relaxed">
            Your combination of Expression {pythagoreanProfile.expression} and Soul Urge {pythagoreanProfile.soulUrge} suggests
            you'll find fulfillment in careers that allow you to express your natural talents while satisfying your inner drives.
            Consider fields that balance both your outer capabilities and inner desires for optimal professional satisfaction.
          </p>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

export default function NameAnalysisPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [report, setReport] = useState(null);
  const [activeTab, setActiveTab] = useState('deepDive');

  const handleBackToHome = () => navigate('/');

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleGenerate = () => {
    if (!name.trim()) {
      alert('Please enter a name');
      return;
    }

    const profile = calculateProfile(name.trim(), dateOfBirth || null);
    setReport({
      profile,
      pythagoreanProfile: profile
    });
  };

  const handleReset = () => {
    setReport(null);
    setName('');
    setDateOfBirth('');
    setActiveTab('deepDive');
  };

  const tabs = [
    { id: 'deepDive', label: 'Deep Dive', icon: BookOpen },
    { id: 'sandbox', label: 'Sandbox', icon: FlaskConical },
    { id: 'synergy', label: 'Synergy', icon: LinkIcon },
    { id: 'signature', label: 'Signature', icon: PenTool },
    { id: 'business', label: 'Business', icon: Briefcase }
  ];

  return (
    <CosmicBackground density={140} useVideo={true}>
      <div className="min-h-screen relative px-4 md:px-6 py-6">
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
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

          <FuturisticGate />

          {!report ? (
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
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="YOUR FULL NAME"
                      className="relative w-full px-6 py-5 bg-gray-950 border border-gray-800 rounded-lg focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 text-gray-300 text-center tracking-widest uppercase outline-none placeholder-gray-600"
                    />
                  </div>

                  <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="relative w-full px-6 py-5 bg-gray-950 border border-gray-800 rounded-lg focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 text-gray-300 text-center tracking-widest uppercase outline-none"
                      style={{ colorScheme: 'dark' }}
                    />
                    <p className="text-xs text-cyan-400/60 mt-2 text-center">(Optional)</p>
                  </div>

                  <button
                    onClick={handleGenerate}
                    className="w-full py-4 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg shadow-cyan-500/20"
                  >
                    INITIATE ANALYSIS
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-2 justify-center">
                {tabs.map(tab => (
                  <TabButton
                    key={tab.id}
                    active={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    icon={tab.icon}
                  >
                    {tab.label}
                  </TabButton>
                ))}
              </div>

              {/* Tab Content */}
              <div>
                {activeTab === 'deepDive' && <NameDeepDiveTab report={report} />}
                {activeTab === 'sandbox' && <SandboxTab profile={report.profile} />}
                {activeTab === 'synergy' && <SynergyTab report={report} />}
                {activeTab === 'signature' && <SignatureTab />}
                {activeTab === 'business' && <BusinessTab report={report} />}
              </div>

              {/* Reset Button */}
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  New Analysis
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </CosmicBackground>
  );
}
