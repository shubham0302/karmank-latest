import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, BookOpen, Link as LinkIcon, Briefcase, FlaskConical,
  Loader2, AlertCircle, Wand2, MousePointerClick, XCircle,
  Sun, PenTool, Upload, Trash2, Sparkles, Download, Activity,
  TrendingUp, Globe, Disc, CheckCircle2, Building2, Factory, Camera, DollarSign
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import CosmicBackground from '../components/CosmicBackground';
import FamilyMemberSelector from '../components/FamilyMemberSelector';
import { useAuth } from '../contexts/AuthContext';
import { useFamilyMembers } from '../hooks/useFamilyMembers';
import { ChevronDown } from 'lucide-react';
import { exportToPDF } from '../utils/pdfExport';

// --- PYTHAGOREAN CONSTANTS ---
const PYTHAGOREAN_CONSTANTS = {
  letterData: {
    A: {
      num: 1,
      meaning: "Ambition & Drive",
      repeat: "Amplifies ambition and aggression",
    },
    B: {
      num: 2,
      meaning: "Emotional Sensitivity",
      repeat: "Enhances empathy but increases mood swings",
    },
    C: {
      num: 3,
      meaning: "Creative Expression",
      repeat: "Success after overcoming difficulties",
    },
    D: {
      num: 4,
      meaning: "Structure & Discipline",
      repeat: "Overcomes limitations with patience",
    },
    E: {
      num: 5,
      meaning: "Freedom & Adventure",
      repeat: "Acquires fame through writing or oratory",
    },
    F: {
      num: 6,
      meaning: "Love & Responsibility",
      repeat: "Protection in all family matters",
    },
    G: {
      num: 7,
      meaning: "Wisdom & Analysis",
      repeat: "A clever analyst who understands motives",
    },
    H: {
      num: 8,
      meaning: "Power & Authority",
      repeat: "Strong potential for material progress",
    },
    I: {
      num: 9,
      meaning: "Compassion & Completion",
      repeat: "Signifies extreme sensitivity and suffering",
    },
    J: {
      num: 1,
      meaning: "Initiative & Independence",
      repeat: "Shifts focus quickly",
    },
    K: {
      num: 2,
      meaning: "Cooperation & Duality",
      repeat: "Emotional fluctuation",
    },
    L: {
      num: 3,
      meaning: "Communication & Joy",
      repeat: "Keen insight into motives",
    },
    M: {
      num: 4,
      meaning: "Stability & Foundation",
      repeat: "Never accepts defeat",
    },
    N: { num: 5, meaning: "Change & Versatility", repeat: "Cycles of luck" },
    O: {
      num: 6,
      meaning: "Harmony & Nurturing",
      repeat: "Can exaggerate problems",
    },
    P: {
      num: 7,
      meaning: "Spiritual Insight",
      repeat: "Power and success follow",
    },
    Q: { num: 8, meaning: "Material Success", repeat: "Manages others well" },
    R: { num: 9, meaning: "Humanitarian Service", repeat: "Needs discretion" },
    S: {
      num: 1,
      meaning: "Self-Reliance",
      repeat: "Gains through originality",
    },
    T: {
      num: 2,
      meaning: "Partnership & Balance",
      repeat: "Emotional intensity grows",
    },
    U: {
      num: 3,
      meaning: "Optimism & Expression",
      repeat: "Trouble expressing feelings",
    },
    V: {
      num: 4,
      meaning: "Practical Foundation",
      repeat: "Strong determination",
    },
    W: {
      num: 5,
      meaning: "Dynamic Energy",
      repeat: "Intense personal magnetism",
    },
    X: {
      num: 6,
      meaning: "Responsibility",
      repeat: "Passion for life increases",
    },
    Y: { num: 7, meaning: "Inner Wisdom", repeat: "Frustrations need outlets" },
    Z: {
      num: 8,
      meaning: "Executive Ability",
      repeat: "Wealth through inheritance",
    },
  },
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
  33: "A master number of compassion and teaching. You are the master teacher with a mission to uplift humanity through unconditional love and service. Your nurturing abilities are extraordinarily powerful.",
};

const CORE_DEFINITIONS = {
  blueprint: {
    title: "The Blueprint (Expression Number)",
    def: "This number represents your natural talents, abilities, and the path you're meant to walk. It's derived from the full numerical value of your name and shows how you express yourself to the world.",
  },
  soulUrge: {
    title: "The Core Drive (Soul Urge Number)",
    def: "This reveals your innermost desires, motivations, and what drives you at the deepest level. It comes from the vowels in your name and represents your heart's true yearning.",
  },
  interface: {
    title: "The Interface (Personality Number)",
    def: "This number shows how others perceive you—your outer personality and first impression. Derived from the consonants in your name, it's the mask you wear in social situations.",
  },
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
    33: "The Master Teacher. Your exceptional blueprint is one of unconditional love and service. You're designed to uplift humanity through compassionate teaching and healing.",
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
    33: "Your deepest yearning is to teach, heal, and uplift through unconditional love. Your soul desires to serve as a beacon of compassion and wisdom.",
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
    33: "You project love, wisdom, and healing energy. Others perceive you as a natural teacher and guide with profound compassion.",
  },
};

const KARMANK_CONSTANTS = {
  numberDetails: {
    1: {
      name: "Surya (Sun)",
      description:
        "Carries a confident, ambitious, and driven leadership quality. They are inspiring but don't take orders easily.",
    },
    2: {
      name: "Chandra (Moon)",
      description:
        "Emotional and caring, needing constant motivation. They seek love, appreciation, and support.",
    },
    3: {
      name: "Guru (Jupiter)",
      description:
        "Wise, disciplined, and family-oriented. They have strong values and resist temptation.",
    },
    4: {
      name: "Rahu (North Node)",
      description:
        "Adventurous and risk-taking, but prone to overthinking and mood swings. Plans may not always work out.",
    },
    5: {
      name: "Budh (Mercury)",
      description:
        "Logical and born for business. They are masters of money and value every penny.",
    },
    6: {
      name: "Shukra (Venus)",
      description:
        "Naturally charming, especially to the opposite gender. They love luxury, fashion, and good food, and can be blunt.",
    },
    7: {
      name: "Ketu (South Node)",
      description:
        "Lucky, with a natural inclination towards spirituality and deep, logical thinking. Travel is often meaningful.",
    },
    8: {
      name: "Shani (Saturn)",
      description:
        "Hard-working, though life may feel slow. They have a soft heart, strong self-respect, and a belief in justice.",
    },
    9: {
      name: "Mangal (Mars)",
      description:
        "Bold, confident, and full of energy. They are quick to act, love challenges, and feel a need to prove themselves.",
    },
    11: {
      name: "Master Chandra (Moon)",
      description:
        "Highly intuitive and spiritually aware. Master number 11 combines the emotional sensitivity of 2 with heightened spiritual insight and inspirational leadership.",
    },
    22: {
      name: "Master Builder",
      description:
        "Visionary builder with the power to turn dreams into reality. Master number 22 combines the practical energy of 4 with the ability to manifest grand visions.",
    },
    33: {
      name: "Master Teacher",
      description:
        "The master healer and teacher. Master number 33 combines the nurturing energy of 6 with profound wisdom and the calling to serve humanity through compassionate guidance.",
    },
  },
  letterValues: {
    A: 1,
    J: 1,
    S: 1,
    B: 2,
    K: 2,
    T: 2,
    C: 3,
    L: 3,
    U: 3,
    D: 4,
    M: 4,
    V: 4,
    E: 5,
    N: 5,
    W: 5,
    F: 6,
    O: 6,
    X: 6,
    G: 7,
    P: 7,
    Y: 7,
    H: 8,
    Q: 8,
    Z: 8,
    I: 9,
    R: 9,
  },
  valueToLetters: {
    1: ["A", "J", "S"],
    2: ["B", "K", "T"],
    3: ["C", "L", "U"],
    4: ["D", "M", "V"],
    5: ["E", "N", "W"],
    6: ["F", "O", "X"],
    7: ["G", "P", "Y"],
    8: ["H", "Q", "Z"],
    9: ["I", "R"],
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
  goalVibrations: {
    Power: { numbers: [1, 8], desc: "Authority and influence" },
    Money: { numbers: [5, 8], desc: "Wealth and financial flow" },
    Luxury: { numbers: [6], desc: "Comfort and high quality" },
    Relationships: { numbers: [2, 6], desc: "Love and partnership" },
    Health: { numbers: [1, 5], desc: "Vitality and wellness" },
    Spiritual: { numbers: [7, 9], desc: "Wisdom and enlightenment" },
    Fame: { numbers: [1, 3, 9], desc: "Public acclaim" },
    Freedom: { numbers: [5], desc: "Adventure and independence" },
  },
  businessCategories: {
    "Food & Creative": { numbers: [6, 3, 5], desc: "Restaurants, cafes, arts" },
    "Authority/CEO": { numbers: [1, 8], desc: "Consulting, management" },
    Finance: { numbers: [5, 8], desc: "Banking, investing" },
    Travel: { numbers: [7, 5], desc: "Tourism, logistics" },
    Education: { numbers: [3, 7, 9], desc: "Schools, coaching" },
  },
};

// --- HELPER FUNCTIONS ---

function reduceToSingleDigit(num) {
  if (num === 11 || num === 22 || num === 33) return num;
  while (num > 9) {
    num = num
      .toString()
      .split("")
      .reduce((sum, digit) => sum + parseInt(digit), 0);
    if (num === 11 || num === 22 || num === 33) return num;
  }
  return num;
}

function getZodiacSign(dobString) {
  if (!dobString) return { name: "Unknown", element: "—", symbol: "?" };
  const [, month, day] = dobString.split("-").map(Number);
  const zodiacData = [
    {
      sign: "Capricorn",
      start: [12, 22],
      end: [1, 19],
      element: "Earth",
      symbol: "♑",
    },
    {
      sign: "Aquarius",
      start: [1, 20],
      end: [2, 18],
      element: "Air",
      symbol: "♒",
    },
    {
      sign: "Pisces",
      start: [2, 19],
      end: [3, 20],
      element: "Water",
      symbol: "♓",
    },
    {
      sign: "Aries",
      start: [3, 21],
      end: [4, 19],
      element: "Fire",
      symbol: "♈",
    },
    {
      sign: "Taurus",
      start: [4, 20],
      end: [5, 20],
      element: "Earth",
      symbol: "♉",
    },
    {
      sign: "Gemini",
      start: [5, 21],
      end: [6, 20],
      element: "Air",
      symbol: "♊",
    },
    {
      sign: "Cancer",
      start: [6, 21],
      end: [7, 22],
      element: "Water",
      symbol: "♋",
    },
    {
      sign: "Leo",
      start: [7, 23],
      end: [8, 22],
      element: "Fire",
      symbol: "♌",
    },
    {
      sign: "Virgo",
      start: [8, 23],
      end: [9, 22],
      element: "Earth",
      symbol: "♍",
    },
    {
      sign: "Libra",
      start: [9, 23],
      end: [10, 22],
      element: "Air",
      symbol: "♎",
    },
    {
      sign: "Scorpio",
      start: [10, 23],
      end: [11, 21],
      element: "Water",
      symbol: "♏",
    },
    {
      sign: "Sagittarius",
      start: [11, 22],
      end: [12, 21],
      element: "Fire",
      symbol: "♐",
    },
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
  let expression = 0,
    soulUrge = 0,
    personality = 0;
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
      effect: PYTHAGOREAN_CONSTANTS.letterData[char].repeat,
    }));

  expression = reduceToSingleDigit(expression);
  soulUrge = reduceToSingleDigit(soulUrge);
  personality = reduceToSingleDigit(personality);

  let destinyNumber = null;
  let basicNumber = null;
  let karmicStatus = "Neutral";

  // For Synergy tab calculations, we need the single digit version
  const expressionSingle = reduceToSingleDigit(expression);

  if (dob) {
    const digits = dob.replace(/\D/g, "");
    const dayDigits = dob.split("-")[2];
    basicNumber = reduceToSingleDigit(parseInt(dayDigits));
    destinyNumber = reduceToSingleDigit(
      digits.split("").reduce((sum, d) => sum + parseInt(d), 0)
    );

    // Calculate karmic status - reduce master numbers to single digits for compatibility lookup
    const expressionForCompatibility =
      expressionSingle === 11
        ? 2
        : expressionSingle === 22
        ? 4
        : expressionSingle === 33
        ? 6
        : expressionSingle;
    const compat = KARMANK_CONSTANTS.assetCompatibility[destinyNumber];
    if (compat) {
      if (compat.auspicious.includes(expressionForCompatibility))
        karmicStatus = "Auspicious";
      else if (compat.good.includes(expressionForCompatibility))
        karmicStatus = "Good";
      else if (compat.avoid.includes(expressionForCompatibility))
        karmicStatus = "Conflict";
    }
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
    zodiac,
    karmicStatus,
    expressionSingle,
  };
}

function getVibrationalStatus(expression, soulUrge) {
  const diff = Math.abs(expression - soulUrge);
  if (diff === 0)
    return {
      label: "Perfect Alignment",
      percent: 100,
      color: "text-green-400",
      bgColor: "bg-green-500",
    };
  if (diff <= 2)
    return {
      label: "High Synergy",
      percent: 80,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500",
    };
  if (diff <= 4)
    return {
      label: "Moderate Friction",
      percent: 60,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500",
    };
  if (diff <= 6)
    return {
      label: "Significant Tension",
      percent: 40,
      color: "text-orange-400",
      bgColor: "bg-orange-500",
    };
  return {
    label: "Major Conflict",
    percent: 20,
    color: "text-red-400",
    bgColor: "bg-red-500",
  };
}

function calculateHarmonicAdjustments(
  currentNameNumber,
  targetNumbers,
  currentName
) {
  const { valueToLetters, letterValues } = KARMANK_CONSTANTS;
  let suggestions = [];
  const safeName = currentName.toUpperCase().replace(/[^A-Z]/g, "");

  // Reduce master numbers to single digits for harmonic calculations
  const baseNumber =
    currentNameNumber === 11
      ? 2
      : currentNameNumber === 22
      ? 4
      : currentNameNumber === 33
      ? 6
      : currentNameNumber;

  targetNumbers.forEach((idealNum) => {
    const diff = idealNum - baseNumber;
    const addValue = (diff + 9) % 9 === 0 ? 9 : (diff + 9) % 9;
    const removeValue = (-diff + 9) % 9 === 0 ? 9 : (-diff + 9) % 9;

    const addLetters = valueToLetters[addValue] || [];
    const removeLetters = safeName
      .split("")
      .filter((char) => letterValues[char] === removeValue)
      .filter((v, i, a) => a.indexOf(v) === i);

    suggestions.push({
      target: idealNum,
      add: { value: addValue, letters: addLetters },
      remove: { value: removeValue, letters: removeLetters },
    });
  });
  return suggestions;
}

// --- OLD PDF GENERATION FUNCTION (keeping for backward compatibility) ---
function generatePDF(report) {
  const { pythagoreanProfile, profile } = report;
  const doc = new jsPDF();

  // Colors matching the screen (converting Tailwind colors to RGB)
  const colors = {
    black: [0, 0, 0],
    cyan: [34, 211, 238], // cyan-400
    purple: [192, 132, 252], // purple-400
    yellow: [250, 204, 21], // yellow-400
    green: [74, 222, 128], // green-400
    gray: [156, 163, 175], // gray-400
    white: [255, 255, 255],
  };

  // Background - Black
  doc.setFillColor(...colors.black);
  doc.rect(0, 0, 210, 297, "F");

  let yPos = 20;

  // Title
  doc.setFontSize(24);
  doc.setTextColor(...colors.cyan);
  doc.text("KarmAnk", 105, yPos, { align: "center" });

  yPos += 8;
  doc.setFontSize(10);
  doc.setTextColor(...colors.gray);
  doc.text("NAME ANALYSIS SYSTEM", 105, yPos, { align: "center" });

  yPos += 15;

  // Name
  doc.setFontSize(18);
  doc.setTextColor(...colors.cyan);
  doc.text(profile.name, 105, yPos, { align: "center" });

  yPos += 15;

  // Core Numbers Section
  doc.setFontSize(14);
  doc.setTextColor(...colors.white);
  doc.text("Core Numbers", 20, yPos);
  yPos += 10;

  // Blueprint
  doc.setFontSize(12);
  doc.setTextColor(...colors.cyan);
  doc.text("Blueprint (Expression)", 20, yPos);
  doc.setFontSize(24);
  doc.text(String(pythagoreanProfile.expression), 30, yPos + 10);

  doc.setFontSize(10);
  doc.setTextColor(...colors.gray);
  const blueprintText = doc.splitTextToSize(
    NUMBER_MEANINGS[pythagoreanProfile.expression],
    170
  );
  doc.text(blueprintText, 20, yPos + 18);
  yPos += 18 + blueprintText.length * 5 + 5;

  // Core Drive
  doc.setFontSize(12);
  doc.setTextColor(...colors.purple);
  doc.text("Core Drive (Soul Urge)", 20, yPos);
  doc.setFontSize(24);
  doc.text(String(pythagoreanProfile.soulUrge), 30, yPos + 10);

  doc.setFontSize(10);
  doc.setTextColor(...colors.gray);
  const soulUrgeText = doc.splitTextToSize(
    NUMBER_MEANINGS[pythagoreanProfile.soulUrge],
    170
  );
  doc.text(soulUrgeText, 20, yPos + 18);
  yPos += 18 + soulUrgeText.length * 5 + 5;

  // Interface
  doc.setFontSize(12);
  doc.setTextColor(...colors.yellow);
  doc.text("Interface (Personality)", 20, yPos);
  doc.setFontSize(24);
  doc.text(String(pythagoreanProfile.personality), 30, yPos + 10);

  doc.setFontSize(10);
  doc.setTextColor(...colors.gray);
  const personalityText = doc.splitTextToSize(
    NUMBER_MEANINGS[pythagoreanProfile.personality],
    170
  );
  doc.text(personalityText, 20, yPos + 18);
  yPos += 18 + personalityText.length * 5 + 5;

  // Check if we need a new page
  if (yPos > 250) {
    doc.addPage();
    doc.setFillColor(...colors.black);
    doc.rect(0, 0, 210, 297, "F");
    yPos = 20;
  }

  // Zodiac
  if (
    pythagoreanProfile.zodiac &&
    pythagoreanProfile.zodiac.name !== "Unknown"
  ) {
    doc.setFontSize(12);
    doc.setTextColor(...colors.yellow);
    doc.text("Zodiac Sign", 20, yPos);
    doc.setFontSize(10);
    doc.setTextColor(...colors.white);
    doc.text(
      `${pythagoreanProfile.zodiac.symbol} ${pythagoreanProfile.zodiac.name} (${pythagoreanProfile.zodiac.element})`,
      20,
      yPos + 7
    );
    yPos += 15;
  }

  // Vibrational Alignment
  const vibrationalStatus = getVibrationalStatus(
    pythagoreanProfile.expression,
    pythagoreanProfile.soulUrge
  );
  doc.setFontSize(12);
  doc.setTextColor(...colors.white);
  doc.text("Vibrational Alignment", 20, yPos);
  doc.setFontSize(10);

  // Color based on status
  const statusColor = vibrationalStatus.label.includes("Perfect")
    ? colors.green
    : vibrationalStatus.label.includes("High")
    ? colors.cyan
    : vibrationalStatus.label.includes("Moderate")
    ? colors.yellow
    : colors.gray;
  doc.setTextColor(...statusColor);
  doc.text(vibrationalStatus.label, 20, yPos + 7);
  yPos += 15;

  // Amplified Traits
  if (pythagoreanProfile.amplifiedTraits.length > 0) {
    if (yPos > 230) {
      doc.addPage();
      doc.setFillColor(...colors.black);
      doc.rect(0, 0, 210, 297, "F");
      yPos = 20;
    }

    doc.setFontSize(12);
    doc.setTextColor(...colors.yellow);
    doc.text("High-Intensity Zones", 20, yPos);
    yPos += 8;

    pythagoreanProfile.amplifiedTraits.forEach((trait) => {
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
      yPos += effectText.length * 4 + 5;
    });
  }

  // Vedic Numbers (if available)
  if (profile.destinyNumber) {
    if (yPos > 230) {
      doc.addPage();
      doc.setFillColor(...colors.black);
      doc.rect(0, 0, 210, 297, "F");
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(...colors.white);
    doc.text("Vedic Numerology", 20, yPos);
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
    yPos += 12 + destinyDesc.length * 5 + 8;

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
  doc.text(
    "Generated by KarmAnk - Vedic Numerology & Name Analysis",
    105,
    285,
    { align: "center" }
  );

  // Save the PDF
  doc.save(`${profile.name.replace(/\s+/g, "_")}_Numerology_Report.pdf`);
}

// --- SECURE BACKEND API FUNCTION ---
// ✅ API key is now secure on backend, not exposed in frontend
async function fetchGeminiAnalysis(prompt, imageBase64 = null) {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

  // Use different endpoint for image analysis (signature)
  if (imageBase64) {
    const url = `${BACKEND_URL}/nlg/analyze-signature`;

    const payload = {
      prompt: prompt,
      imageBase64: imageBase64
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Signature analysis failed');
    }

    const data = await response.json();
    return data.data?.text || data.text || '';
  }

  // Text-only analysis
  const url = `${BACKEND_URL}/nlg/generate`;

  const payload = {
    prompt: prompt,
    language: 'en' // Can be made dynamic if needed
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Backend API request failed');
  }

  const data = await response.json();
  // Backend returns: { success: true, data: { text: "..." } }
  return data.data?.text || data.text || '';
}

// --- UI COMPONENTS ---

const TabButton = ({ active, onClick, children, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-base transition-all duration-200 ${
      active
        ? "bg-cyan-500/20 border border-cyan-500/50"
        : "bg-gray-800/50 hover:bg-gray-700/50 border border-transparent"
    }`}
  >
    {Icon && <Icon className="w-3 h-3 sm:w-4 sm:h-4" />}
    <span
      className={
        active
          ? "text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500"
          : "text-gray-400 hover:text-gray-200"
      }
    >
      {children}
    </span>
  </button>
);

const FuturisticGate = () => (
  <div className="relative w-full h-32 sm:h-40 mb-6 sm:mb-8 overflow-hidden rounded-xl border border-cyan-500/20">
    <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/40 via-gray-950 to-black" />
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
        linear-gradient(to right, rgba(34, 211, 238, 0.1) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
      `,
        backgroundSize: "40px 40px",
        transform: "perspective(500px) rotateX(60deg)",
        transformOrigin: "center bottom",
      }}
    />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center space-y-1 sm:space-y-2 relative z-10 px-2">
        <div className="text-2xl sm:text-4xl font-bold">
          <GradientText as="span" size="3xl" className="font-serif sm:size-4xl">
            KarmAnk
          </GradientText>
          <sup className={`text-lg sm:text-2xl -top-2 ${gradientUtils.text}`}>™</sup>
        </div>
        <div className="text-xs sm:text-sm text-cyan-400/60 tracking-widest">
          NAME ANALYSIS SYSTEM
        </div>
        <div className="flex items-center justify-center gap-2 mt-2 sm:mt-3">
          <div className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
          <div className="text-xs text-cyan-400/40">★</div>
          <div className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
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
            <div className="text-3xl font-bold text-yellow-400">
              {personality}
            </div>
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

  const distinctTraits = letters
    .reduce((acc, char) => {
      const meaning = PYTHAGOREAN_CONSTANTS.letterData[char]?.meaning;
      if (meaning && !acc.some((t) => t.meaning === meaning)) {
        acc.push({ char, meaning });
      }
      return acc;
    }, [])
    .slice(0, 5);

  const traitsList = distinctTraits.map((t) => `**${t.meaning}**`).join(", ");

  const narrativeParagraphs = [
    `Using the Pythagorean method, the name **${profile.name}** carries a unique vibrational signature. Each letter holds a specific frequency, and together they compose a symphony of traits: ${traitsList}.`,
    `Your **Blueprint** (Expression Number **${
      pythagoreanProfile.expression
    }**) reveals: ${
      STATIC_NARRATIVES.blueprint[pythagoreanProfile.expression]
    }`,
    `Your **Core Drive** (Soul Urge Number **${
      pythagoreanProfile.soulUrge
    }**) whispers: ${STATIC_NARRATIVES.soulUrge[pythagoreanProfile.soulUrge]}`,
    `Your **Interface** (Personality Number **${
      pythagoreanProfile.personality
    }**) projects: ${
      STATIC_NARRATIVES.interface[pythagoreanProfile.personality]
    }`,
  ];

  const renderMarkdown = (text) => {
    return text.split("**").map((part, i) =>
      i % 2 === 0 ? (
        part
      ) : (
        <strong key={i} className="text-cyan-300">
          {part}
        </strong>
      )
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

  const vibrationalStatus = getVibrationalStatus(
    pythagoreanProfile.expression,
    pythagoreanProfile.soulUrge
  );

  const cards = [
    {
      id: "blueprint",
      label: "Blueprint",
      sublabel: "Expression",
      val: pythagoreanProfile.expression,
      color: "text-cyan-400",
      bgGradient: "from-cyan-900/40 to-cyan-800/20",
      borderColor: "border-cyan-700/50",
      text: STATIC_NARRATIVES.blueprint[pythagoreanProfile.expression],
    },
    {
      id: "soulUrge",
      label: "Core Drive",
      sublabel: "Soul Urge",
      val: pythagoreanProfile.soulUrge,
      color: "text-purple-400",
      bgGradient: "from-purple-900/40 to-purple-800/20",
      borderColor: "border-purple-700/50",
      text: STATIC_NARRATIVES.soulUrge[pythagoreanProfile.soulUrge],
    },
    {
      id: "interface",
      label: "Interface",
      sublabel: "Personality",
      val: pythagoreanProfile.personality,
      color: "text-yellow-400",
      bgGradient: "from-yellow-900/40 to-yellow-800/20",
      borderColor: "border-yellow-700/50",
      text: STATIC_NARRATIVES.interface[pythagoreanProfile.personality],
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {/* Definition Modal */}
      {activeDefinition && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 rounded-xl backdrop-blur-md p-3 sm:p-6 animate-in zoom-in duration-200">
          <div className="text-center relative max-w-sm sm:max-w-md h-full overflow-y-auto scrollbar-none">
            <button
              onClick={() => setActiveDefinition(null)}
              className="absolute top-0 right-0 text-gray-500 hover:text-white p-1 sm:p-2 transition-colors"
            >
              <XCircle className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            {/* The Big Number */}
            <div
              className={`text-6xl sm:text-8xl font-bold mb-2 font-mono ${activeDefinition.color}`}
            >
              {activeDefinition.val}
            </div>

            {/* The Title */}
            <h4 className="text-yellow-400 font-bold uppercase tracking-widest mb-4 sm:mb-6 text-lg sm:text-xl">
              {CORE_DEFINITIONS[activeDefinition.id].title}
            </h4>

            {/* The "System" Definition (Educational) */}
            <div className="bg-gray-800/50 p-5 rounded-xl mb-6 border border-gray-700 text-left">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-gray-400" />
                <p className="text-xs text-gray-400 uppercase tracking-widest">
                  What is this?
                </p>
              </div>
              <p className="text-gray-300 text-sm italic leading-relaxed">
                "{CORE_DEFINITIONS[activeDefinition.id].def}"
              </p>
            </div>

            {/* The Personal Interpretation */}
            <div className="bg-gray-900/80 p-6 rounded-xl border border-yellow-500/20 text-left shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <p className="text-xs text-yellow-500 uppercase tracking-widest">
                  Your Analysis
                </p>
              </div>
              <p className="text-white text-lg leading-relaxed font-medium">
                {activeDefinition.text}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 2: Cards + Vibrational Alignment + Chronos Narrative */}
      <div className="pdf-page-break-after space-y-8">
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
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${vibrationalStatus.color}`}>
                {vibrationalStatus.label}
              </span>
              <span className={`text-xs font-mono ${vibrationalStatus.color} bg-gray-800/50 px-2 py-0.5 rounded`}>
                {vibrationalStatus.percent}%
              </span>
            </div>
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
      </div>

      {/* PAGE 3: High-Intensity Zones + Professional Alignment */}
      <div className="pdf-page-break-after space-y-8">
        {/* High-Intensity Zones */}
        {pythagoreanProfile.amplifiedTraits.length > 0 && (
          <div className="bg-gray-900/50 p-6 rounded-xl border border-yellow-500/20">
            <h3 className="text-lg font-bold text-yellow-400 mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              High-Intensity Zones
            </h3>
            <div className="space-y-4">
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

        {/* Professional Alignment */}
        <div className="bg-gray-900/60 p-6 rounded-xl border border-green-500/20">
        <h3 className="text-xl font-bold text-green-400 mb-6 flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Professional Alignment
        </h3>

        <div className="space-y-5">
          {/* Career Strengths based on Expression Number */}
          <div className="bg-gray-950/50 p-4 rounded-lg border border-cyan-500/30">
            <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-2">
              Career Strengths (Expression {pythagoreanProfile.expression})
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              {pythagoreanProfile.expression === 1 &&
                "Leadership roles, entrepreneurship, innovation, and pioneering ventures. You excel when working independently and driving new initiatives."}
              {pythagoreanProfile.expression === 2 &&
                "Diplomacy, counseling, teamwork, mediation, and partnership-based roles. You thrive in collaborative environments and excel at bringing people together."}
              {pythagoreanProfile.expression === 3 &&
                "Creative fields, communication, entertainment, marketing, and artistic expression. Your natural charisma and creativity make you shine in public-facing roles."}
              {pythagoreanProfile.expression === 4 &&
                "Organization, project management, engineering, accounting, and systematic work. You excel at building solid foundations and maintaining structure."}
              {pythagoreanProfile.expression === 5 &&
                "Sales, travel, media, public relations, and dynamic environments. Your adaptability and communication skills thrive in fast-paced, varied work."}
              {pythagoreanProfile.expression === 6 &&
                "Healthcare, teaching, counseling, hospitality, and service industries. Your nurturing nature excels in roles that help and support others."}
              {pythagoreanProfile.expression === 7 &&
                "Research, analysis, technology, spirituality, and specialized expertise. You thrive in roles requiring deep knowledge and independent thinking."}
              {pythagoreanProfile.expression === 8 &&
                "Business leadership, finance, executive roles, and high-stakes negotiations. Your natural authority excels in positions of power and resource management."}
              {pythagoreanProfile.expression === 9 &&
                "Humanitarian work, arts, global ventures, healing professions, and transformative roles. You excel when your work serves a higher purpose."}
              {pythagoreanProfile.expression === 11 &&
                "Inspirational leadership, spiritual teaching, counseling, and visionary roles. Your intuitive gifts excel in guiding and uplifting others."}
              {pythagoreanProfile.expression === 22 &&
                "Master building, large-scale projects, architecture, international business, and legacy creation. You excel at manifesting grand visions into reality."}
              {pythagoreanProfile.expression === 33 &&
                "Master healing, education, spiritual guidance, and compassionate service. You excel when combining wisdom with selfless service to humanity."}
            </p>
          </div>

          {/* Inner Motivation based on Soul Urge */}
          <div className="bg-gray-950/50 p-4 rounded-lg border border-purple-500/30">
            <h4 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-2">
              Inner Motivation (Soul Urge {pythagoreanProfile.soulUrge})
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              {pythagoreanProfile.soulUrge === 1 &&
                "You are driven by the need for independence, achievement, and being first. Your satisfaction comes from pioneering new paths and maintaining autonomy."}
              {pythagoreanProfile.soulUrge === 2 &&
                "You seek harmony, partnership, and peaceful connections. Your fulfillment comes from creating balance and fostering meaningful relationships."}
              {pythagoreanProfile.soulUrge === 3 &&
                "You crave creative expression, joy, and social interaction. Your happiness comes from sharing your talents and bringing light to others."}
              {pythagoreanProfile.soulUrge === 4 &&
                "You desire stability, order, and tangible results. Your satisfaction comes from building something lasting and seeing concrete progress."}
              {pythagoreanProfile.soulUrge === 5 &&
                "You long for freedom, variety, and adventure. Your fulfillment comes from experiencing life's diversity and maintaining flexibility."}
              {pythagoreanProfile.soulUrge === 6 &&
                "You seek to nurture, heal, and create harmony in your environment. Your joy comes from caring for others and beautifying your world."}
              {pythagoreanProfile.soulUrge === 7 &&
                "You desire truth, wisdom, and spiritual understanding. Your satisfaction comes from deep contemplation and uncovering hidden knowledge."}
              {pythagoreanProfile.soulUrge === 8 &&
                "You are driven by material success, power, and tangible achievement. Your fulfillment comes from mastering the material world and wielding influence."}
              {pythagoreanProfile.soulUrge === 9 &&
                "You seek to serve humanity, create transformation, and contribute to the greater good. Your joy comes from selfless giving and universal love."}
              {pythagoreanProfile.soulUrge === 11 &&
                "You are driven by spiritual insight, inspiration, and illuminating others. Your fulfillment comes from channeling higher wisdom and uplifting consciousness."}
              {pythagoreanProfile.soulUrge === 22 &&
                "You desire to build something of lasting global significance. Your satisfaction comes from manifesting ambitious visions that benefit humanity."}
              {pythagoreanProfile.soulUrge === 33 &&
                "You seek to heal and uplift humanity through compassionate service. Your joy comes from selfless devotion to the welfare of all beings."}
            </p>
          </div>

          {/* Professional Recommendations */}
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <h4 className="text-green-400 font-bold mb-2 flex items-center gap-2">
              <Wand2 className="w-4 h-4" />
              Alignment Recommendations
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              For optimal career satisfaction, seek roles that align your
              Expression Number's natural talents (
              {pythagoreanProfile.expression}) with your Soul Urge's inner
              desires ({pythagoreanProfile.soulUrge}).
              {vibrationalStatus.percent >= 80 &&
                " Your high natural alignment suggests you'll find fulfillment in careers that allow authentic self-expression."}
              {vibrationalStatus.percent < 80 &&
                vibrationalStatus.percent >= 60 &&
                " Consider roles that bridge your outer capabilities with your inner motivations for greater satisfaction."}
              {vibrationalStatus.percent < 60 &&
                " Focus on finding work environments that honor both your professional strengths and personal values to reduce internal friction."}
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

const SandboxTab = ({ profile }) => {
  const [testName, setTestName] = useState(profile.name);
  const birthProfile = useMemo(() => profile, [profile]);

  // Update testName when profile changes (when family member is selected)
  useEffect(() => {
    setTestName(profile.name);
  }, [profile.name]);

  const testProfile = useMemo(() => {
    if (!testName.trim()) return birthProfile;
    return calculateProfile(testName, null);
  }, [testName, birthProfile]);

  const ComparisonCard = ({ id, label, v1, v2 }) => {
    const hasChanged = v1 !== v2;
    // Lookup specific narrative for new number
    const narrative = STATIC_NARRATIVES[id]?.[v2] || NUMBER_MEANINGS[v2];

    return (
      <div className="p-5 bg-gray-900/60 rounded-xl border border-gray-800 mb-4 hover:border-yellow-500/30 transition-all group">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs uppercase text-gray-500 font-bold tracking-widest">
            {label}
          </span>
          <div className="flex items-center gap-3 font-mono">
            <span className="text-gray-600 text-lg">{v1}</span>
            <ArrowRight
              className={`w-4 h-4 ${
                hasChanged ? "text-yellow-500" : "text-gray-700"
              }`}
            />
            <span
              className={`text-2xl font-bold ${
                hasChanged ? "text-yellow-400" : "text-gray-400"
              }`}
            >
              {v2}
            </span>
          </div>
        </div>

        {/* Contextual Insight */}
        {hasChanged ? (
          <div className="mt-3 pt-3 border-t border-gray-800/50 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider">
                Vibrational Shift
              </p>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed font-light pl-5 border-l-2 border-cyan-900">
              {narrative}
            </p>
          </div>
        ) : (
          <p className="text-xs text-gray-600 italic text-right mt-2">
            No shift detected.
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gray-900/60 p-6 rounded-xl border border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-cyan-500/10 p-2 rounded-lg">
            <Wand2 className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500">
              Name Simulator
            </h3>
            <p className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500">
              Test nicknames or business aliases to see how they shift your
              vibration.
            </p>
          </div>
        </div>

        <input
          type="text"
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
          className="w-full bg-black border border-gray-700 rounded-lg px-3 sm:px-4 py-3 sm:py-4 text-base sm:text-xl text-white font-mono mb-6 sm:mb-8 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none placeholder-gray-700 text-center uppercase tracking-wider"
          placeholder="ENTER NEW NAME"
        />

        <div className="space-y-2">
          <ComparisonCard
            id="blueprint"
            label="The Blueprint (Expression)"
            v1={birthProfile.expression}
            v2={testProfile.expression}
          />
          <ComparisonCard
            id="soulUrge"
            label="The Core Drive (Soul Urge)"
            v1={birthProfile.soulUrge}
            v2={testProfile.soulUrge}
          />
          <ComparisonCard
            id="interface"
            label="The Interface (Personality)"
            v1={birthProfile.personality}
            v2={testProfile.personality}
          />
        </div>
      </div>
    </div>
  );
};

const SynergyTab = ({ report }) => {
  const { pythagoreanProfile, profile } = report;
  const [selectedGoals, setSelectedGoals] = useState([]);

  const toggleGoal = (goal) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    } else if (selectedGoals.length < 2) {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const suggestions = useMemo(() => {
    if (selectedGoals.length === 0 || !pythagoreanProfile.expressionSingle)
      return [];
    const targetNums = selectedGoals.flatMap(
      (g) => KARMANK_CONSTANTS.goalVibrations[g].numbers
    );
    return calculateHarmonicAdjustments(
      pythagoreanProfile.expressionSingle,
      targetNums,
      profile.name
    );
  }, [selectedGoals, pythagoreanProfile.expressionSingle, profile.name]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Cosmic Alignment Status - Hide in PDF */}
      {profile.destinyNumber && (
        <div className="bg-gray-900/60 p-6 rounded-xl border border-gray-800 print:hidden">
          <div className="text-center">
            <h4 className="text-xs uppercase tracking-widest mb-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500">
              Cosmic Alignment
            </h4>
            <div className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500">
              {pythagoreanProfile.karmicStatus}
            </div>
            <div className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500">
              Name ({pythagoreanProfile.expression}) vs Destiny (
              {profile.destinyNumber})
            </div>
          </div>
        </div>
      )}

      {/* DOB Required Message - Hide in PDF */}
      {!profile.destinyNumber && (
        <div className="p-6 bg-yellow-900/20 border border-yellow-500/50 rounded-xl print:hidden">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-400" />
            <div>
              <h4 className="text-yellow-400 font-bold mb-1">
                Date of Birth Required
              </h4>
              <p className="text-gray-300 text-sm">
                To unlock Cosmic Alignment Status and Vedic Synergy insights,
                please include your date of birth when generating the report.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Goal Harmonizer - Hide in PDF */}
      <div className="bg-gray-900/60 p-6 rounded-xl border border-gray-800 print:hidden">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-cyan-400" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500">
            Goal Harmonizer
          </span>
        </h3>
        <p className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 mb-4">
          Select up to 2 goals to receive harmonic adjustment suggestions for
          your name.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 mb-6">
          {Object.entries(KARMANK_CONSTANTS.goalVibrations).map(
            ([key, data]) => (
              <button
                key={key}
                onClick={() => toggleGoal(key)}
                disabled={
                  !selectedGoals.includes(key) && selectedGoals.length >= 2
                }
                className={`p-2 sm:p-3 rounded-lg border text-left transition-all ${
                  selectedGoals.includes(key)
                    ? "bg-cyan-900/40 border-cyan-500 text-cyan-100"
                    : "bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                }`}
              >
                <div className="text-[10px] sm:text-xs font-bold uppercase mb-1">{key}</div>
                <div className="text-[8px] sm:text-[10px] text-gray-500">{data.desc}</div>
              </button>
            )
          )}
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">
              Harmonic Adjustments
            </h4>
            {suggestions.map((s, i) => (
              <div
                key={i}
                className="bg-black/40 p-4 rounded-lg border-l-2 border-cyan-500"
              >
                <div className="text-sm font-bold text-cyan-400 mb-1">
                  Target Vibration: {s.target}
                </div>
                <div className="text-xs text-gray-400">
                  To align, try <strong className="text-white">adding</strong>{" "}
                  letters with value {s.add.value} ({s.add.letters.join(", ")})
                  {s.remove.letters.length > 0 && (
                    <span>
                      {" "}
                      or <strong className="text-white">removing</strong>{" "}
                      letters with value {s.remove.value} (
                      {s.remove.letters.join(", ")})
                    </span>
                  )}
                  .
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PAGE 4: Name-Destiny Synergy */}
      {profile.destinyNumber && (
        <div className="bg-gray-900/60 p-6 rounded-xl border border-green-500/20 pdf-page-break-after">
          <h3 className="text-xl font-bold text-green-400 mb-6 flex items-center gap-2">
            <LinkIcon className="w-5 h-5" />
            Name-Destiny Synergy
          </h3>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-950/50 p-4 rounded-lg border border-cyan-500/30">
              <div className="text-sm text-gray-400 mb-2">Pythagorean Expression</div>
              <div className="text-4xl font-bold text-cyan-400 mb-2">{pythagoreanProfile.expression}</div>
              <p className="text-sm text-gray-300">{NUMBER_MEANINGS[pythagoreanProfile.expression].slice(0, 150)}...</p>
            </div>

            <div className="bg-gray-950/50 p-3 sm:p-4 rounded-lg border border-green-500/30">
              <div className="text-xs sm:text-sm text-gray-400 mb-2">
                Vedic Destiny (Bhagyank)
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-green-400 mb-2">
                {profile.destinyNumber}
              </div>
              <div className="text-xs sm:text-sm text-green-300 mb-1">
                {KARMANK_CONSTANTS.numberDetails[profile.destinyNumber].name}
              </div>
              <p className="text-xs sm:text-sm text-gray-300">
                {
                  KARMANK_CONSTANTS.numberDetails[profile.destinyNumber]
                    .description
                }
              </p>
            </div>
          </div>

          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <h4 className="text-green-400 font-bold mb-2">Synergy Insight</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your Pythagorean Expression Number (
              {pythagoreanProfile.expression}) represents how you naturally
              express yourself through your name, while your Vedic Destiny
              Number ({profile.destinyNumber} -{" "}
              {KARMANK_CONSTANTS.numberDetails[profile.destinyNumber].name})
              reflects your life path from birth. When these energies align
              harmoniously, you experience greater ease in manifesting your
              purpose.
            </p>
          </div>

          {profile.basicNumber && (
            <div className="mt-6 bg-gray-950/50 p-4 rounded-lg border border-rose-500/30">
              <div className="text-sm text-gray-400 mb-2">
                Vedic Basic (Moolank)
              </div>
              <div className="text-3xl font-bold text-rose-400 mb-2">
                {profile.basicNumber}
              </div>
              <div className="text-sm text-rose-300 mb-1">
                {KARMANK_CONSTANTS.numberDetails[profile.basicNumber].name}
              </div>
              <p className="text-sm text-gray-300">
                {
                  KARMANK_CONSTANTS.numberDetails[profile.basicNumber]
                    .description
                }
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SignatureTab = () => {
  const fileInputRef = useRef(null);
  const [hasSignature, setHasSignature] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearSignature = () => {
    setUploadedImage(null);
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
      // Extract base64 from uploaded image (remove data:image/png;base64, prefix)
      const imageBase64 = uploadedImage.split(',')[1];

      const prompt = `Analyze this signature from a graphological (handwriting analysis) perspective. Provide insights about:
1. Overall personality traits revealed by the signature style
2. Confidence and self-expression level (based on size, slant, pressure)
3. Emotional stability (based on baseline, rhythm, flow)
4. Leadership qualities (based on dominant strokes, emphasis)
5. Creative tendencies (based on uniqueness, flair, artistic elements)

Provide a detailed, insightful analysis in 4-6 sentences. Focus on what the handwriting reveals about the person's character.`;

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
      <div className="bg-gray-900/60 p-6 rounded-xl border border-yellow-500/20 relative">
        <div className="blur-xs opacity-70 pointer-events-none">
          <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
            <PenTool className="w-5 h-5" />
            The Signature Alchemist
          </h3>

        <div className="border border-dashed border-gray-700 rounded-xl bg-gray-950 mb-4 overflow-hidden">
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
              <div className="p-8 text-center">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {uploadedImage ? (
                  <img
                    src={uploadedImage}
                    alt="Uploaded signature"
                    className="max-h-48 mx-auto"
                  />
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
        <ComingSoonOverlay />
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
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {analysis}
          </p>
        </div>
      )}
    </div>
  );
};

const BusinessTab = () => {
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState(null);
  const [result, setResult] = useState(null);

  // Business categories with icons
  const businessCategories = {
    "Food & Creative": {
      numbers: [6, 3, 5],
      icon: Disc,
      desc: "Restaurants, cafes, arts, fashion.",
    },
    "Authority/CEO": {
      numbers: [1, 8],
      icon: Briefcase,
      desc: "Consulting, management, leadership.",
    },
    Finance: {
      numbers: [5, 8],
      icon: TrendingUp,
      desc: "Banking, investing, fintech.",
    },
    "Travel & Logistics": {
      numbers: [5, 7],
      icon: Globe,
      desc: "Tourism, transport, import/export.",
    },
    Education: {
      numbers: [3, 7, 9],
      icon: BookOpen,
      desc: "Schools, coaching, training.",
    },
    "Real Estate": {
      numbers: [4, 8],
      icon: Building2,
      desc: "Construction, architecture, property.",
    },
    Manufacturing: {
      numbers: [4, 8],
      icon: Factory,
      desc: "Industrial, production, hardware.",
    },
    "Media & Ent": {
      numbers: [3, 5, 6],
      icon: Camera,
      desc: "Film, music, social media, ads.",
    },
  };

  const analyzeBusiness = () => {
    if (!businessName || !category) return;

    // Calculate business name number
    const upperName = businessName.toUpperCase().replace(/[^A-Z]/g, "");
    let nameSum = 0;
    for (let char of upperName) {
      nameSum += KARMANK_CONSTANTS.letterValues[char] || 0;
    }
    const num = reduceToSingleDigit(nameSum);

    // Get target numbers for selected category
    const targetNums = businessCategories[category].numbers;
    const isAligned = targetNums.includes(num);

    // Calculate harmonic adjustments
    let suggestions = [];
    targetNums.forEach((idealNum) => {
      let addValue = idealNum - num;
      if (addValue <= 0) addValue += 9;
      const addLetters = KARMANK_CONSTANTS.valueToLetters[addValue] || [];
      suggestions.push({
        target: idealNum,
        add: { value: addValue, letters: addLetters },
      });
    });

    setResult({ num, isAligned, suggestions });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gray-900/60 p-6 rounded-xl border border-gray-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-cyan-500/10 p-2 rounded-lg">
            <DollarSign className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500">
              Business Validator
            </h3>
            <p className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500">
              Ensure your brand name resonates with your industry frequency.
            </p>
          </div>
        </div>

        <input
          type="text"
          placeholder="ENTER BRAND NAME"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          className="w-full bg-black border border-gray-700 rounded-lg px-3 sm:px-4 py-3 sm:py-4 text-base sm:text-xl text-white font-mono mb-6 sm:mb-8 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none placeholder-gray-700 text-center uppercase tracking-wider"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 mb-8">
          {Object.entries(businessCategories).map(([key, data]) => {
            const IconComponent = data.icon;
            return (
              <button
                key={key}
                onClick={() => setCategory(key)}
                className={`p-2 sm:p-3 rounded-lg border text-left transition-all group ${
                  category === key
                    ? "bg-cyan-900/40 border-cyan-500 text-cyan-100"
                    : "bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-600 hover:bg-gray-800"
                }`}
              >
                <div
                  className={`${
                    category === key
                      ? "text-cyan-400"
                      : "text-gray-600 group-hover:text-gray-400"
                  } mb-2 transition-colors`}
                >
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="text-[10px] sm:text-xs font-bold uppercase mb-1">{key}</div>
                <div className="text-[8px] sm:text-[10px] text-gray-600 leading-tight">
                  {data.desc}
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={analyzeBusiness}
          disabled={!businessName || !category}
          className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-900/20"
        >
          ANALYZE BRAND VIBRATION
        </button>
      </div>

      {result && (
        <div
          className={`p-6 rounded-xl border ${
            result.isAligned
              ? "bg-cyan-900/20 border-cyan-500"
              : "bg-orange-900/20 border-orange-500"
          }`}
        >
          <div className="flex items-start gap-4">
            {result.isAligned ? (
              <CheckCircle2 className="w-8 h-8 text-cyan-400 flex-shrink-0" />
            ) : (
              <XCircle className="w-8 h-8 text-orange-400 flex-shrink-0" />
            )}
            <div>
              <h4
                className={`text-lg font-bold mb-1 ${
                  result.isAligned ? "text-cyan-400" : "text-orange-400"
                }`}
              >
                {result.isAligned
                  ? "Perfect Brand Alignment"
                  : "Vibrational Misalignment"}
              </h4>
              <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                Your brand resonates at <strong>Number {result.num}</strong>.{" "}
                {result.isAligned
                  ? " This frequency naturally attracts success in your selected industry."
                  : " This frequency creates friction with your industry's natural rhythm."}
              </p>
            </div>
          </div>

          {!result.isAligned && (
            <div className="bg-black/40 p-5 rounded-lg mt-2 border-l-2 border-orange-500">
              <div className="text-xs font-bold uppercase text-orange-400 mb-3">
                Correction Protocols
              </div>
              <div className="space-y-3">
                {result.suggestions.slice(0, 2).map((s, i) => (
                  <div key={i} className="text-sm text-gray-300">
                    <span className="text-gray-500 block text-xs mb-1">
                      OPTION {i + 1}: SHIFT TO {s.target}
                    </span>
                    To reach vibration <strong>{s.target}</strong>, add a letter
                    with value <strong>{s.add.value}</strong> (e.g.,{" "}
                    <strong>{s.add.letters.join(", ")}</strong>) to your brand
                    name.
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.isAligned && (
            <div className="bg-cyan-900/20 p-4 rounded-lg border border-cyan-500/30 mt-4">
              <p className="text-sm text-cyan-200">
                Your business name is vibrationally aligned with the {category}{" "}
                industry. This harmony will support your business growth and
                success.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- MAIN COMPONENT ---

export default function NameAnalysisPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { members, getFamilyMembersData } = useFamilyMembers();

  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [selectedFamilyMemberId, setSelectedFamilyMemberId] = useState(null);
  const [report, setReport] = useState(null);
  const [activeTab, setActiveTab] = useState("deepDive");
  const [memberDropdownOpen, setMemberDropdownOpen] = useState(false);
  const [downloadDropdownOpen, setDownloadDropdownOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Fetch family members and auto-select first one
  useEffect(() => {
    const loadMembers = async () => {
      const result = await getFamilyMembersData();
      if (result.members && result.members.length > 0) {
        const firstMember = result.members[0];
        setSelectedFamilyMemberId(firstMember.id);
        setName(firstMember.name);
        setDateOfBirth(firstMember.date_of_birth);
        // Auto-generate report for first family member
        try {
          const profile = calculateProfile(
            firstMember.name,
            firstMember.date_of_birth
          );
          setReport({
            profile,
            pythagoreanProfile: profile,
          });
        } catch (error) {
          // Error generating initial report - user can manually generate
        }
      }
    };
    loadMembers();
  }, []);

  const handleBackToHome = () => navigate("/");

  const handleFamilyMemberSelect = (memberId) => {
    setSelectedFamilyMemberId(memberId);
  };

  const handleFamilyMemberDetailsChange = (details) => {
    setName(details.name);
    setDateOfBirth(details.dob);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const handleGenerate = () => {
    if (!selectedFamilyMemberId || !name.trim()) {
      alert("Please select a family member first");
      return;
    }

    const profile = calculateProfile(name.trim(), dateOfBirth || null);
    setReport({
      profile,
      pythagoreanProfile: profile,
    });
  };

  const handleReset = () => {
    setReport(null);
    setName("");
    setDateOfBirth("");
    setActiveTab("deepDive");
  };

  const tabs = [
    { id: "deepDive", label: "Deep Dive", icon: BookOpen },
    { id: "sandbox", label: "Sandbox", icon: FlaskConical },
    { id: "synergy", label: "Synergy", icon: LinkIcon },
    { id: "business", label: "Business", icon: Briefcase },
    { id: "signature", label: "Signature", icon: PenTool },
  ];

  const handleExportPDF = async () => {
    if (!report || isDownloading) return;

    setIsDownloading(true);
    setDownloadDropdownOpen(false);

    try {
      // Switch to Deep Dive tab first
      setActiveTab('deepDive');

      // Wait for tab to render
      await new Promise(resolve => setTimeout(resolve, 500));

      // Export using the same method as numerology
      const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `KarmAnk_${sanitizedName}_Name_Analysis_${new Date().toISOString().split('T')[0]}.pdf`;

      await exportToPDF('report-content', fileName, { userName: name });

      console.log('✅ PDF exported successfully');
    } catch (error) {
      console.error('❌ PDF export failed:', error);
      alert('Failed to export PDF. Please try again.');
    }

    setIsDownloading(false);
  };

  return (
    <CosmicBackground density={140} useVideo={true}>
      <div className="min-h-screen relative px-3 sm:px-4 md:px-6 py-4 sm:py-6">
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Top Navigation - Back Button on Left, Controls on Right */}
          <div className="flex justify-between items-center gap-2 mb-4 sm:mb-6 flex-wrap sm:flex-nowrap">
            <button
              onClick={handleBackToHome}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition duration-200"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Back</span>
              <span className="sm:hidden">Back</span>
            </button>

            <div className="flex items-center gap-4">
              {/* Download Dropdown */}
              {report && (
                <div className="relative">
                  <button
                    onClick={() => setDownloadDropdownOpen(!downloadDropdownOpen)}
                    disabled={isDownloading}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-400/50 rounded-lg text-green-300 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Downloading...</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                        <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </button>
                  {downloadDropdownOpen && !isDownloading && (
                    <div className="absolute top-full right-0 mt-2 bg-gray-900 border border-green-400/50 rounded-lg shadow-lg z-50 min-w-48">
                      <button
                        onClick={handleExportPDF}
                        className="w-full text-left px-4 py-3 hover:bg-green-400/10 transition flex items-center gap-2 text-white"
                      >
                        <Download className="h-4 w-4 text-green-400" />
                        <span>Full Report (PDF)</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Member Selector Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setMemberDropdownOpen(!memberDropdownOpen)}
                  disabled={isLoadingMemberChange}
                  className="flex items-center gap-2 px-2 sm:px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 rounded-lg text-cyan-300 text-xs sm:text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed truncate"
                >
                  <span className="truncate max-w-[100px] sm:max-w-none">
                    {(selectedFamilyMemberId &&
                      members.find((m) => m.id === selectedFamilyMemberId)
                        ?.name) ||
                      "Member"}
                  </span>
                  <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                </button>
                {memberDropdownOpen && !isLoadingMemberChange && (
                  <div className="absolute top-full right-0 mt-2 bg-gray-900 border border-cyan-400/50 rounded-lg shadow-lg z-50 min-w-56 sm:min-w-64 max-h-64 overflow-y-auto">
                    {members.map((member) => (
                      <button
                        key={member.id}
                        onClick={() => {
                          setIsLoadingMemberChange(true);
                          setMemberDropdownOpen(false);

                          try {
                            setSelectedFamilyMemberId(member.id);
                            setName(member.name);
                            setDateOfBirth(member.date_of_birth);
                            // Auto-generate report when member is selected
                            const profile = calculateProfile(
                              member.name,
                              member.date_of_birth
                            );
                            setReport({
                              profile,
                              pythagoreanProfile: profile,
                            });
                          } finally {
                            setIsLoadingMemberChange(false);
                          }
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-cyan-400/10 transition ${
                          selectedFamilyMemberId === member.id
                            ? "bg-cyan-400/20 border-l-2 border-l-cyan-400"
                            : ""
                        }`}
                      >
                        <div className="font-semibold text-white">
                          {member.name}
                        </div>
                        <div className="text-xs text-white/60">
                          {member.gender} • DOB:{" "}
                          {new Date(member.date_of_birth).toLocaleDateString()}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <FuturisticGate />

          {/* Member Change Loading Overlay */}
          {isLoadingMemberChange && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
              <div className="bg-gray-900/90 border border-cyan-400/50 rounded-xl p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400 mb-4"></div>
                <p className="text-cyan-300 font-medium">Loading {name}'s analysis...</p>
              </div>
            </div>
          )}

          {!report ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-900/60 backdrop-blur-md p-8 rounded-xl border border-cyan-500/20 shadow-2xl">
                <h3 className="text-lg font-semibold text-center text-cyan-300 mb-4">
                  {name || "Select a member to begin"}
                </h3>

                <div className="text-center text-white/70 text-sm">
                  Loading your analysis...
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
                {tabs.map((tab) => (
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
              <div id="report-content">
                {/* Deep Dive Tab - Always render for PDF, hide if not active on screen */}
                <div className={activeTab !== 'deepDive' ? 'hidden print:block' : ''}>
                  <NameDeepDiveTab report={report} />
                </div>

                {/* Synergy Tab - Always render for PDF, hide if not active on screen */}
                <div className={activeTab !== 'synergy' ? 'hidden print:block' : ''}>
                  <SynergyTab report={report} />
                </div>

                {/* Other tabs - only render when active */}
                {activeTab === 'sandbox' && <SandboxTab profile={report.profile} />}
                {activeTab === 'business' && <BusinessTab />}
                {activeTab === 'signature' && <SignatureTab />}
              </div>
            </div>
          )}
        </div>
      </div>
    </CosmicBackground>
  );
}
