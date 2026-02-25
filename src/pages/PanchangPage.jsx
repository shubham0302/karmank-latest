import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft, ChevronLeft, ChevronRight, Info, Clock,
  Star, Sun, Moon, Calendar, CheckCircle, AlertTriangle, Compass,
  User, Sparkles, Zap, Shield, TrendingUp
} from "lucide-react";
import CosmicBackground from "../components/CosmicBackground";
import { useAuth } from "../contexts/AuthContext";
import { getFamilyMembers } from "../lib/database";
import { supabase } from "../lib/supabase";
import { localCache } from "../hooks/useLocalCache";

// ─── Vedic Data Tables ────────────────────────────────────────────────────────

const NAKSHATRAS = [
  { name: { en: "Ashwini", hi: "अश्विनी" }, deity: "Ashwini Kumaras", ruler: "Ketu", nature: "Deva", quality: "Kshipra", symbol: "🐴" },
  { name: { en: "Bharani", hi: "भरणी" }, deity: "Yama", ruler: "Venus", nature: "Manushya", quality: "Ugra", symbol: "⚖️" },
  { name: { en: "Krittika", hi: "कृत्तिका" }, deity: "Agni", ruler: "Sun", nature: "Rakshasa", quality: "Mishra", symbol: "🔥" },
  { name: { en: "Rohini", hi: "रोहिणी" }, deity: "Brahma", ruler: "Moon", nature: "Manushya", quality: "Sthira", symbol: "🐄" },
  { name: { en: "Mrigashira", hi: "मृगशिरा" }, deity: "Soma", ruler: "Mars", nature: "Deva", quality: "Mridu", symbol: "🦌" },
  { name: { en: "Ardra", hi: "आर्द्रा" }, deity: "Rudra", ruler: "Rahu", nature: "Manushya", quality: "Tikshna", symbol: "💎" },
  { name: { en: "Punarvasu", hi: "पुनर्वसु" }, deity: "Aditi", ruler: "Jupiter", nature: "Deva", quality: "Chara", symbol: "🏹" },
  { name: { en: "Pushya", hi: "पुष्य" }, deity: "Brihaspati", ruler: "Saturn", nature: "Deva", quality: "Laghu", symbol: "🌸" },
  { name: { en: "Ashlesha", hi: "आश्लेषा" }, deity: "Nagas", ruler: "Mercury", nature: "Rakshasa", quality: "Tikshna", symbol: "🐍" },
  { name: { en: "Magha", hi: "मघा" }, deity: "Pitrs", ruler: "Ketu", nature: "Rakshasa", quality: "Ugra", symbol: "👑" },
  { name: { en: "Purva Phalguni", hi: "पूर्वाफाल्गुनी" }, deity: "Bhaga", ruler: "Venus", nature: "Manushya", quality: "Ugra", symbol: "🛏️" },
  { name: { en: "Uttara Phalguni", hi: "उत्तराफाल्गुनी" }, deity: "Aryaman", ruler: "Sun", nature: "Manushya", quality: "Sthira", symbol: "🛏️" },
  { name: { en: "Hasta", hi: "हस्त" }, deity: "Savitar", ruler: "Moon", nature: "Deva", quality: "Laghu", symbol: "✋" },
  { name: { en: "Chitra", hi: "चित्रा" }, deity: "Tvashtar", ruler: "Mars", nature: "Rakshasa", quality: "Mridu", symbol: "💎" },
  { name: { en: "Swati", hi: "स्वाती" }, deity: "Vayu", ruler: "Rahu", nature: "Deva", quality: "Chara", symbol: "🌿" },
  { name: { en: "Vishakha", hi: "विशाखा" }, deity: "Indra & Agni", ruler: "Jupiter", nature: "Rakshasa", quality: "Mishra", symbol: "⚡" },
  { name: { en: "Anuradha", hi: "अनुराधा" }, deity: "Mitra", ruler: "Saturn", nature: "Deva", quality: "Mridu", symbol: "🌺" },
  { name: { en: "Jyeshtha", hi: "ज्येष्ठा" }, deity: "Indra", ruler: "Mercury", nature: "Rakshasa", quality: "Tikshna", symbol: "🏆" },
  { name: { en: "Mula", hi: "मूल" }, deity: "Nirriti", ruler: "Ketu", nature: "Rakshasa", quality: "Tikshna", symbol: "🦁" },
  { name: { en: "Purva Ashadha", hi: "पूर्वाषाढा" }, deity: "Apas", ruler: "Venus", nature: "Manushya", quality: "Ugra", symbol: "🐘" },
  { name: { en: "Uttara Ashadha", hi: "उत्तराषाढा" }, deity: "Vishvadevas", ruler: "Sun", nature: "Manushya", quality: "Sthira", symbol: "🏺" },
  { name: { en: "Shravana", hi: "श्रवण" }, deity: "Vishnu", ruler: "Moon", nature: "Deva", quality: "Chara", symbol: "👂" },
  { name: { en: "Dhanishtha", hi: "धनिष्ठा" }, deity: "Vasus", ruler: "Mars", nature: "Rakshasa", quality: "Chara", symbol: "🥁" },
  { name: { en: "Shatabhisha", hi: "शतभिषा" }, deity: "Varuna", ruler: "Rahu", nature: "Rakshasa", quality: "Sthira", symbol: "💊" },
  { name: { en: "Purva Bhadrapada", hi: "पूर्वाभाद्रपदा" }, deity: "Aja Ekapad", ruler: "Jupiter", nature: "Manushya", quality: "Ugra", symbol: "⚔️" },
  { name: { en: "Uttara Bhadrapada", hi: "उत्तराभाद्रपदा" }, deity: "Ahir Budhnya", ruler: "Saturn", nature: "Manushya", quality: "Sthira", symbol: "🐍" },
  { name: { en: "Revati", hi: "रेवती" }, deity: "Pushan", ruler: "Mercury", nature: "Deva", quality: "Mridu", symbol: "🐟" },
];

const TITHIS = [
  { name: { en: "Pratipada", hi: "प्रतिपदा" }, paksha: "Shukla", number: 1, quality: "Nanda", ruler: "Moon", auspicious: true, desc: "Good for new beginnings" },
  { name: { en: "Dwitiya", hi: "द्वितीया" }, paksha: "Shukla", number: 2, quality: "Bhadra", ruler: "Mars", auspicious: true, desc: "Auspicious for learning & travel" },
  { name: { en: "Tritiya", hi: "तृतीया" }, paksha: "Shukla", number: 3, quality: "Jaya", ruler: "Jupiter", auspicious: true, desc: "Favorable for most activities" },
  { name: { en: "Chaturthi", hi: "चतुर्थी" }, paksha: "Shukla", number: 4, quality: "Rikta", ruler: "Sun", auspicious: false, desc: "Ganesh worship; avoid new work" },
  { name: { en: "Panchami", hi: "पञ्चमी" }, paksha: "Shukla", number: 5, quality: "Nanda", ruler: "Moon", auspicious: true, desc: "Good for worship and remedies" },
  { name: { en: "Shashthi", hi: "षष्ठी" }, paksha: "Shukla", number: 6, quality: "Bhadra", ruler: "Mars", auspicious: true, desc: "Kartikeya worship; good for courage" },
  { name: { en: "Saptami", hi: "सप्तमी" }, paksha: "Shukla", number: 7, quality: "Jaya", ruler: "Jupiter", auspicious: true, desc: "Favorable for Sun worship" },
  { name: { en: "Ashtami", hi: "अष्टमी" }, paksha: "Shukla", number: 8, quality: "Rikta", ruler: "Sun", auspicious: false, desc: "Sacred to Shiva & Durga" },
  { name: { en: "Navami", hi: "नवमी" }, paksha: "Shukla", number: 9, quality: "Nanda", ruler: "Moon", auspicious: true, desc: "Favorable for Goddess worship" },
  { name: { en: "Dashami", hi: "दशमी" }, paksha: "Shukla", number: 10, quality: "Bhadra", ruler: "Mars", auspicious: true, desc: "Good for all works" },
  { name: { en: "Ekadashi", hi: "एकादशी" }, paksha: "Shukla", number: 11, quality: "Jaya", ruler: "Jupiter", auspicious: true, desc: "Most sacred — fasting & Vishnu worship" },
  { name: { en: "Dwadashi", hi: "द्वादशी" }, paksha: "Shukla", number: 12, quality: "Nanda", ruler: "Moon", auspicious: true, desc: "Charity and sacred learning" },
  { name: { en: "Trayodashi", hi: "त्रयोदशी" }, paksha: "Shukla", number: 13, quality: "Jaya", ruler: "Jupiter", auspicious: true, desc: "Pradosh Vrat — Shiva worship" },
  { name: { en: "Chaturdashi", hi: "चतुर्दशी" }, paksha: "Shukla", number: 14, quality: "Rikta", ruler: "Sun", auspicious: false, desc: "Shiva worship; avoid new works" },
  { name: { en: "Purnima", hi: "पूर्णिमा" }, paksha: "Shukla", number: 15, quality: "Poorna", ruler: "Moon", auspicious: true, desc: "Full Moon — very auspicious for all worship" },
  { name: { en: "Pratipada", hi: "प्रतिपदा" }, paksha: "Krishna", number: 1, quality: "Nanda", ruler: "Moon", auspicious: true, desc: "Good for moderate activities" },
  { name: { en: "Dwitiya", hi: "द्वितीया" }, paksha: "Krishna", number: 2, quality: "Bhadra", ruler: "Mars", auspicious: true, desc: "Moderate for work" },
  { name: { en: "Tritiya", hi: "तृतीया" }, paksha: "Krishna", number: 3, quality: "Jaya", ruler: "Jupiter", auspicious: true, desc: "Moderate auspiciousness" },
  { name: { en: "Chaturthi", hi: "चतुर्थी" }, paksha: "Krishna", number: 4, quality: "Rikta", ruler: "Sun", auspicious: false, desc: "Spiritual practice; avoid new ventures" },
  { name: { en: "Panchami", hi: "पञ्चमी" }, paksha: "Krishna", number: 5, quality: "Nanda", ruler: "Moon", auspicious: true, desc: "Moderate" },
  { name: { en: "Shashthi", hi: "षष्ठी" }, paksha: "Krishna", number: 6, quality: "Bhadra", ruler: "Mars", auspicious: true, desc: "Moderate" },
  { name: { en: "Saptami", hi: "सप्तमी" }, paksha: "Krishna", number: 7, quality: "Jaya", ruler: "Jupiter", auspicious: true, desc: "Moderate for Sun worship" },
  { name: { en: "Ashtami", hi: "अष्टमी" }, paksha: "Krishna", number: 8, quality: "Rikta", ruler: "Sun", auspicious: false, desc: "Kalashtami — Bhairava worship" },
  { name: { en: "Navami", hi: "नवमी" }, paksha: "Krishna", number: 9, quality: "Nanda", ruler: "Moon", auspicious: true, desc: "Moderate" },
  { name: { en: "Dashami", hi: "दशमी" }, paksha: "Krishna", number: 10, quality: "Bhadra", ruler: "Mars", auspicious: true, desc: "Good for day-to-day work" },
  { name: { en: "Ekadashi", hi: "एकादशी" }, paksha: "Krishna", number: 11, quality: "Jaya", ruler: "Jupiter", auspicious: true, desc: "Sacred — fasting & Vishnu worship" },
  { name: { en: "Dwadashi", hi: "द्वादशी" }, paksha: "Krishna", number: 12, quality: "Nanda", ruler: "Moon", auspicious: true, desc: "Charity and learning" },
  { name: { en: "Trayodashi", hi: "त्रयोदशी" }, paksha: "Krishna", number: 13, quality: "Jaya", ruler: "Jupiter", auspicious: true, desc: "Pradosh Vrat" },
  { name: { en: "Chaturdashi", hi: "चतुर्दशी" }, paksha: "Krishna", number: 14, quality: "Rikta", ruler: "Sun", auspicious: false, desc: "Maha Shivaratri — Shiva worship" },
  { name: { en: "Amavasya", hi: "अमावस्या" }, paksha: "Krishna", number: 15, quality: "Poorna", ruler: "Moon", auspicious: false, desc: "New Moon — Pitru Tarpan; avoid new starts" },
];

const YOGAS = [
  { name: { en: "Vishkambha", hi: "विष्कम्भ" }, nature: "Inauspicious", desc: "Obstructive; avoid new starts" },
  { name: { en: "Priti", hi: "प्रीति" }, nature: "Auspicious", desc: "Love & affection; good for relationships" },
  { name: { en: "Ayushman", hi: "आयुष्मान" }, nature: "Auspicious", desc: "Longevity; good for health matters" },
  { name: { en: "Saubhagya", hi: "सौभाग्य" }, nature: "Auspicious", desc: "Good fortune; favorable for all works" },
  { name: { en: "Shobhana", hi: "शोभन" }, nature: "Auspicious", desc: "Splendorous; auspicious day" },
  { name: { en: "Atiganda", hi: "अतिगण्ड" }, nature: "Inauspicious", desc: "Troublesome; avoid important activities" },
  { name: { en: "Sukarma", hi: "सुकर्मा" }, nature: "Auspicious", desc: "Good deeds; favorable for rituals" },
  { name: { en: "Dhriti", hi: "धृति" }, nature: "Auspicious", desc: "Determination; stable and firm" },
  { name: { en: "Shula", hi: "शूल" }, nature: "Inauspicious", desc: "Like a thorn; avoid new ventures" },
  { name: { en: "Ganda", hi: "गण्ड" }, nature: "Inauspicious", desc: "Troublesome; proceed with caution" },
  { name: { en: "Vriddhi", hi: "वृद्धि" }, nature: "Auspicious", desc: "Growth and prosperity" },
  { name: { en: "Dhruva", hi: "ध्रुव" }, nature: "Auspicious", desc: "Fixed and stable; good for permanence" },
  { name: { en: "Vyaghata", hi: "व्याघात" }, nature: "Inauspicious", desc: "Obstruction; delays likely" },
  { name: { en: "Harshana", hi: "हर्षण" }, nature: "Auspicious", desc: "Joy and happiness; favorable" },
  { name: { en: "Vajra", hi: "वज्र" }, nature: "Mixed", desc: "Strong like Vajra; mixed results" },
  { name: { en: "Siddhi", hi: "सिद्धि" }, nature: "Auspicious", desc: "Achievement and success" },
  { name: { en: "Vyatipata", hi: "व्यतीपात" }, nature: "Inauspicious", desc: "Calamitous; one of the 5 inauspicious yogas" },
  { name: { en: "Variyan", hi: "वरीयान" }, nature: "Auspicious", desc: "Excellence; very favorable" },
  { name: { en: "Parigha", hi: "परिघ" }, nature: "Inauspicious", desc: "Like a bar; obstructions likely" },
  { name: { en: "Shiva", hi: "शिव" }, nature: "Auspicious", desc: "Divine and auspicious; good for worship" },
  { name: { en: "Siddha", hi: "सिद्ध" }, nature: "Auspicious", desc: "Accomplished; favorable" },
  { name: { en: "Sadhya", hi: "साध्य" }, nature: "Auspicious", desc: "Achievable goals; favorable" },
  { name: { en: "Shubha", hi: "शुभ" }, nature: "Auspicious", desc: "Very favorable for all activities" },
  { name: { en: "Shukla", hi: "शुक्ल" }, nature: "Auspicious", desc: "Pure and bright; favorable" },
  { name: { en: "Brahma", hi: "ब्रह्म" }, nature: "Auspicious", desc: "Divine; excellent for spiritual work" },
  { name: { en: "Indra", hi: "इन्द्र" }, nature: "Auspicious", desc: "Powerful like Indra; favorable" },
  { name: { en: "Vaidhriti", hi: "वैधृति" }, nature: "Inauspicious", desc: "Ominous; one of the 5 inauspicious yogas" },
];

// 7 movable + 4 fixed Karanas
const KARANAS = [
  { name: { en: "Bava", hi: "बव" }, type: "movable", ruler: "Sun", auspicious: true },
  { name: { en: "Balava", hi: "बालव" }, type: "movable", ruler: "Moon", auspicious: true },
  { name: { en: "Kaulava", hi: "कौलव" }, type: "movable", ruler: "Mars", auspicious: true },
  { name: { en: "Taitila", hi: "तैतिल" }, type: "movable", ruler: "Mercury", auspicious: true },
  { name: { en: "Gara", hi: "गर" }, type: "movable", ruler: "Jupiter", auspicious: true },
  { name: { en: "Vanija", hi: "वणिज" }, type: "movable", ruler: "Venus", auspicious: true },
  { name: { en: "Vishti (Bhadra)", hi: "विष्टि (भद्रा)" }, type: "movable", ruler: "Saturn", auspicious: false },
  { name: { en: "Shakuni", hi: "शकुनि" }, type: "fixed", ruler: "Saturn", auspicious: false },
  { name: { en: "Chatushpada", hi: "चतुष्पाद" }, type: "fixed", ruler: "Sun", auspicious: false },
  { name: { en: "Naga", hi: "नाग" }, type: "fixed", ruler: "Moon", auspicious: false },
  { name: { en: "Kimstughna", hi: "किंस्तुघ्न" }, type: "fixed", ruler: "Mars", auspicious: true },
];

// 7 Choghadiya types (cycle order)
const CHOGHADIA_TYPES = [
  { id: "udveg", name: { en: "Udveg", hi: "उद्वेग" }, nature: "Inauspicious", planet: "Sun", desc: "Anxiety-inducing; avoid new work", color: "red" },
  { id: "char", name: { en: "Char", hi: "चर" }, nature: "Neutral", planet: "Venus", desc: "Mobile; good for travel & change", color: "blue" },
  { id: "labh", name: { en: "Labh", hi: "लाभ" }, nature: "Auspicious", planet: "Mercury", desc: "Profit; favorable for business & trade", color: "green" },
  { id: "amrit", name: { en: "Amrit", hi: "अमृत" }, nature: "Excellent", planet: "Moon", desc: "Nectar; best for all auspicious activities", color: "cyan" },
  { id: "kaal", name: { en: "Kaal", hi: "काल" }, nature: "Inauspicious", planet: "Saturn", desc: "Inauspicious; avoid all important work", color: "purple" },
  { id: "shubh", name: { en: "Shubh", hi: "शुभ" }, nature: "Auspicious", planet: "Jupiter", desc: "Auspicious; favorable for all works", color: "amber" },
  { id: "rog", name: { en: "Rog", hi: "रोग" }, nature: "Inauspicious", planet: "Mars", desc: "Disease; avoid health-sensitive activities", color: "orange" },
];

// Choghadiya start index (0=Udveg…6=Rog) by weekday (0=Sun…6=Sat)
const DAY_CHOG_START = [0, 3, 6, 2, 5, 1, 4];
const NIGHT_CHOG_START = [5, 1, 4, 0, 3, 6, 2];

// Hora planets in Chaldean order
const HORA_PLANETS = [
  { name: "Sun", hi: "सूर्य", symbol: "☀️", color: "amber" },
  { name: "Venus", hi: "शुक्र", symbol: "♀", color: "pink" },
  { name: "Mercury", hi: "बुध", symbol: "☿", color: "green" },
  { name: "Moon", hi: "चंद्र", symbol: "🌙", color: "blue" },
  { name: "Saturn", hi: "शनि", symbol: "♄", color: "purple" },
  { name: "Jupiter", hi: "गुरु", symbol: "♃", color: "amber" },
  { name: "Mars", hi: "मंगल", symbol: "♂", color: "red" },
];
// Day hora starting planet index by weekday
const DAY_HORA_START = [0, 3, 6, 2, 5, 1, 4];

const RASHI_NAMES = [
  { en: "Mesha (Aries)", hi: "मेष" }, { en: "Vrishabha (Taurus)", hi: "वृषभ" },
  { en: "Mithuna (Gemini)", hi: "मिथुन" }, { en: "Karka (Cancer)", hi: "कर्क" },
  { en: "Simha (Leo)", hi: "सिंह" }, { en: "Kanya (Virgo)", hi: "कन्या" },
  { en: "Tula (Libra)", hi: "तुला" }, { en: "Vrishchika (Scorpio)", hi: "वृश्चिक" },
  { en: "Dhanu (Sagittarius)", hi: "धनु" }, { en: "Makara (Capricorn)", hi: "मकर" },
  { en: "Kumbha (Aquarius)", hi: "कुम्भ" }, { en: "Meena (Pisces)", hi: "मीन" },
];

// ─── Lunar Month (Masa) Names — keyed by sidereal Sun sign index (0=Mesha=Chaitra) ──
const MASA_NAMES    = ['Chaitra','Vaishakha','Jyeshtha','Ashadha','Shravana','Bhadrapada','Ashwina','Kartika','Margashirsha','Pausha','Magha','Phalguna'];
const MASA_NAMES_HI = ['चैत्र','वैशाख','ज्येष्ठ','आषाढ़','श्रावण','भाद्रपद','आश्विन','कार्तिक','मार्गशीर्ष','पौष','माघ','फाल्गुन'];

// ─── Graha (Planet) Display Metadata ─────────────────────────────────────────
const GRAHA_INFO = {
  Sun:     { hi: 'सूर्य',  symbol: '☉', color: 'amber'   },
  Moon:    { hi: 'चंद्र',  symbol: '☽', color: 'slate'   },
  Mars:    { hi: 'मंगल',  symbol: '♂', color: 'red'     },
  Mercury: { hi: 'बुध',   symbol: '☿', color: 'emerald' },
  Jupiter: { hi: 'गुरु',  symbol: '♃', color: 'yellow'  },
  Venus:   { hi: 'शुक्र', symbol: '♀', color: 'pink'    },
  Saturn:  { hi: 'शनि',   symbol: '♄', color: 'blue'    },
  Rahu:    { hi: 'राहु',  symbol: '☊', color: 'purple'  },
  Ketu:    { hi: 'केतु',  symbol: '☋', color: 'orange'  },
};
const PLANET_ORDER = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'];

// ─── Special Yoga Tables (Vara index 0=Sun…6=Sat → Nakshatra indices) ─────────
// Sarvartha Siddhi Yoga: all wishes fulfilled; most auspicious for new starts
const SARVARTHA_SIDDHI_NAK = [
  [12, 4, 7, 6, 11, 20, 25],  // Sunday
  [3, 4, 6, 7, 16, 21],       // Monday
  [11, 20, 25, 0, 2],         // Tuesday
  [3, 16, 17, 4, 12, 2],      // Wednesday
  [4, 6, 7, 15, 16, 11, 20],  // Thursday
  [0, 16, 6, 1, 4, 21, 10],   // Friday
  [3, 16, 7, 14, 25, 21],     // Saturday
];
// Amrit Siddhi Yoga: nectar of success; excellent for business, travel, new ventures
const AMRIT_SIDDHI_NAK = [
  [12, 7], [4, 16, 6], [0, 2, 20], [16, 17, 11], [7, 20, 16], [1, 16, 23], [3, 14, 21],
];
// Ravi Yoga: inauspicious Sun combination — avoid important decisions
const RAVI_YOGA_NAK = [12, 13, 21, 2, 6, 5, 3]; // one nakshatra per weekday

// ─── Major Cities for City Selector ──────────────────────────────────────────
const MAJOR_CITIES = [
  // India — all use IST (UTC+5:30 = 5.5h) regardless of browser timezone
  { name: 'New Delhi',  lat: 28.6139, lon: 77.2090, tz: 5.5 },
  { name: 'Mumbai',     lat: 19.0760, lon: 72.8777, tz: 5.5 },
  { name: 'Kolkata',    lat: 22.5726, lon: 88.3639, tz: 5.5 },
  { name: 'Chennai',    lat: 13.0827, lon: 80.2707, tz: 5.5 },
  { name: 'Bengaluru',  lat: 12.9716, lon: 77.5946, tz: 5.5 },
  { name: 'Hyderabad',  lat: 17.3850, lon: 78.4867, tz: 5.5 },
  { name: 'Ahmedabad',  lat: 23.0225, lon: 72.5714, tz: 5.5 },
  { name: 'Pune',       lat: 18.5204, lon: 73.8567, tz: 5.5 },
  { name: 'Jaipur',     lat: 26.9124, lon: 75.7873, tz: 5.5 },
  { name: 'Lucknow',    lat: 26.8467, lon: 80.9462, tz: 5.5 },
  { name: 'Varanasi',   lat: 25.3176, lon: 82.9739, tz: 5.5 },
  { name: 'Ujjain',     lat: 23.1765, lon: 75.7885, tz: 5.5 },
  { name: 'Haridwar',   lat: 29.9457, lon: 78.1642, tz: 5.5 },
  { name: 'Tirupati',   lat: 13.6288, lon: 79.4192, tz: 5.5 },
  { name: 'Amritsar',   lat: 31.6340, lon: 74.8723, tz: 5.5 },
  { name: 'Mathura',    lat: 27.4924, lon: 77.6737, tz: 5.5 },
  // International diaspora — standard (non-DST) offsets
  { name: 'Dubai (UAE)',        lat: 25.2048, lon:  55.2708, tz:  4   },
  { name: 'Singapore',          lat:  1.3521, lon: 103.8198, tz:  8   },
  { name: 'London (UK)',        lat: 51.5074, lon:  -0.1278, tz:  0   },
  { name: 'New York (USA)',     lat: 40.7128, lon: -74.0060, tz: -5   },
  { name: 'Sydney (Australia)', lat:-33.8688, lon: 151.2093, tz: 10   },
];

const TARA_NAMES = [
  { name: "Janma", auspicious: false, meaning: "Birth star — avoid important work" },
  { name: "Sampat", auspicious: true, meaning: "Wealth star — auspicious for prosperity" },
  { name: "Vipat", auspicious: false, meaning: "Danger star — avoid risky activities" },
  { name: "Kshema", auspicious: true, meaning: "Safety star — favorable for all" },
  { name: "Pratyari", auspicious: false, meaning: "Enemy star — beware obstacles" },
  { name: "Sadhaka", auspicious: true, meaning: "Achievement star — work toward goals" },
  { name: "Naidhana", auspicious: false, meaning: "Loss star — avoid major decisions" },
  { name: "Mitra", auspicious: true, meaning: "Friend star — cooperation & support" },
  { name: "Param Mitra", auspicious: true, meaning: "Best friend — most auspicious day" },
];

// Rahu Kaal / Gulika Kaal yama index (0-indexed, each yama = 1/8 of day) by weekday
const RAHU_YAMA = [7, 1, 6, 4, 5, 3, 2];   // Sun→Sat
const GULIKA_YAMA = [6, 5, 4, 3, 2, 1, 0]; // Sun→Sat
const YAMA_GHANTA = [4, 3, 2, 1, 0, 7, 6]; // Sun→Sat

// ─── Astronomical Calculation Engine ─────────────────────────────────────────

function norm(deg) { return ((deg % 360) + 360) % 360; }
function r2d(r) { return r * 180 / Math.PI; }
function d2r(d) { return d * Math.PI / 180; }

function toJulianDay(date) {
  let y = date.getFullYear(), m = date.getMonth() + 1;
  const d = date.getDate();
  const h = (date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600) / 24;
  // Standard JD formula: January and February are treated as months 13 and 14
  // of the preceding year (Meeus, "Astronomical Algorithms", Chapter 7)
  if (m <= 2) { y -= 1; m += 12; }
  const A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + h + B - 1524.5;
}

function calcSunMoon(date) {
  const jd = toJulianDay(date);
  const T = (jd - 2451545.0) / 36525;

  // Sun
  const L0 = norm(280.46646 + 36000.76983 * T);
  const M_s = norm(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const Mr = d2r(M_s);
  const C = (1.914602 - 0.004817 * T) * Math.sin(Mr) + 0.019993 * Math.sin(2 * Mr) + 0.000289 * Math.sin(3 * Mr);
  const sunTropical = norm(L0 + C);

  // Moon (simplified, ~1° accuracy)
  const Lm = norm(218.3164477 + 481267.88123421 * T);
  const Mm = norm(134.9633964 + 477198.8675055 * T);
  const D  = norm(297.8501921 + 445267.1114034 * T);
  const Om = norm(125.0445479 - 1934.1362608 * T);
  const MmR = d2r(Mm), DR = d2r(D);
  // F = Moon's argument of latitude = L' − Ω (Meeus Ch. 47)
  // Terms 6, 14, 15 involve 2F, (2D-2F), (M'-2F) — must use F, not Ω
  const F  = norm(Lm - Om);
  const FR = d2r(F);
  const deltaL =
    6.288774 * Math.sin(MmR) +
    1.274027 * Math.sin(2 * DR - MmR) +
    0.658314 * Math.sin(2 * DR) +
    0.213618 * Math.sin(2 * MmR) -
    0.185116 * Math.sin(Mr) -
    0.114332 * Math.sin(2 * FR) +
    0.058793 * Math.sin(2 * DR - 2 * MmR) +
    0.057066 * Math.sin(2 * DR - Mr - MmR) +
    0.053322 * Math.sin(2 * DR + MmR) +
    0.045758 * Math.sin(2 * DR - Mr) -
    0.040923 * Math.sin(Mr - MmR) -
    0.034720 * Math.sin(DR) -
    0.030383 * Math.sin(Mr + MmR) +
    0.015327 * Math.sin(2 * DR - 2 * FR) +
    0.010980 * Math.sin(MmR - 2 * FR);
  const moonTropical = norm(Lm + deltaL);

  // Lahiri ayanamsa (approximate)
  const ayanamsa = 23.85 + 0.0136 * (date.getFullYear() - 2000 + date.getMonth() / 12);
  return { sun: norm(sunTropical - ayanamsa), moon: norm(moonTropical - ayanamsa), ayanamsa };
}

function buildApproxGrahas(date, sunLon, moonLon, ayanamsa) {
  const jd = toJulianDay(date);
  const T = (jd - 2451545.0) / 36525;

  const approx = {
    Sun: { lon: norm(sunLon), speed: 0.9856 },
    Moon: { lon: norm(moonLon), speed: 13.1764 },
    Mars: { lon: norm((355.433 + 19140.299 * T) - ayanamsa), speed: 0.524 },
    Mercury: { lon: norm((252.251 + 149472.675 * T) - ayanamsa), speed: 1.383 },
    Jupiter: { lon: norm((34.351 + 3034.906 * T) - ayanamsa), speed: 0.083 },
    Venus: { lon: norm((181.979 + 58517.816 * T) - ayanamsa), speed: 1.2 },
    Saturn: { lon: norm((50.077 + 1222.114 * T) - ayanamsa), speed: 0.033 },
    Rahu: { lon: norm((125.044 - 1934.136 * T) - ayanamsa), speed: -0.053 },
  };
  approx.Ketu = { lon: norm(approx.Rahu.lon + 180), speed: approx.Rahu.speed };

  const nSize = 360 / 27;
  return PLANET_ORDER.map((pName) => {
    const pl = approx[pName];
    if (!pl) return null;
    const lon = norm(pl.lon);
    const rashiIdx = Math.floor(lon / 30);
    const nakIdx = Math.floor(lon / nSize) % 27;
    return {
      name: pName,
      ...GRAHA_INFO[pName],
      lon,
      degInSign: lon % 30,
      rashi: RASHI_NAMES[rashiIdx],
      nakshatra: NAKSHATRAS[nakIdx],
      isRetrograde: pl.speed < 0,
      speed: pl.speed,
      source: 'approx',
    };
  }).filter(Boolean);
}

/**
 * Returns the current calendar date in IST (UTC+5:30) regardless of browser timezone.
 * Fixes the bug where browsers in non-IST timezones show the wrong Vara/weekday.
 */
function todayInIST() {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000; // shift to UTC
  const istMs = utcMs + 5.5 * 3600000;                           // shift to IST
  const ist   = new Date(istMs);
  // Return a local-timezone Date whose year/month/date match IST's date parts
  return new Date(ist.getFullYear(), ist.getMonth(), ist.getDate());
}

/**
 * Compute sunrise and sunset for a given date + location.
 * tzOffset (hours, e.g. 5.5 for IST) is the CIVIL timezone of the location,
 * NOT the browser timezone — this ensures correct results regardless of the
 * user's OS/browser timezone setting.
 */
function calcSunriseSunset(date, lat = 28.6139, lon = 77.209, tzOffset = 5.5) {
  const doy = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
  const decl = -23.45 * Math.cos(d2r((360 / 365) * (doy + 10)));
  const tanProd = Math.tan(d2r(lat)) * Math.tan(d2r(decl));
  if (Math.abs(tanProd) >= 1) {
    // Polar day/night — fallback
    const sr = new Date(date); sr.setHours(6, 0, 0, 0);
    const ss = new Date(date); ss.setHours(18, 0, 0, 0);
    return { sunrise: sr, sunset: ss };
  }
  const ha = r2d(Math.acos(-tanProd));
  // Use the location's civil timezone offset, NOT the browser's getTimezoneOffset()
  const tzOff = tzOffset;
  const solarNoon = 12 - lon / 15 + tzOff;
  const half = ha / 15;
  const srH = solarNoon - half, ssH = solarNoon + half;
  const sr = new Date(date); sr.setHours(Math.floor(srH), Math.round((srH % 1) * 60), 0, 0);
  const ss = new Date(date); ss.setHours(Math.floor(ssH), Math.round((ssH % 1) * 60), 0, 0);
  return { sunrise: sr, sunset: ss };
}

// ─── Panchang Enrichment Helpers ──────────────────────────────────────────────

/** Lunar month (Masa) name from sidereal Sun longitude (0° Mesha = Chaitra). */
function getMasa(sunLon) {
  const i = Math.floor(norm(sunLon) / 30);
  return { en: MASA_NAMES[i], hi: MASA_NAMES_HI[i] };
}

/** Approximate Vikram Samvat year (VS new year ≈ Chaitra Shukla Pratipada, Mar/Apr). */
function getVikramSamvat(date) {
  return date.getFullYear() + (date.getMonth() < 3 ? 56 : 57);
}

/** Shaka Samvat year (Indian national calendar, starts ~March 22). */
function getShakaSamvat(date) {
  const before = date.getMonth() < 2 || (date.getMonth() === 2 && date.getDate() < 22);
  return date.getFullYear() - (before ? 79 : 78);
}

/** Moon phase from elongation (0–360°). Returns percentage, waxing flag, and emoji. */
function getMoonPhase(elong) {
  const e = norm(elong);
  const pct = Math.round((1 - Math.cos(d2r(e))) / 2 * 100);
  const isWaxing = e < 180;
  let icon;
  if (e < 5 || e > 355)    icon = '🌑';
  else if (e < 85)          icon = isWaxing ? '🌒' : '🌘';
  else if (e < 95)          icon = isWaxing ? '🌓' : '🌗';
  else if (e < 175)         icon = isWaxing ? '🌔' : '🌖';
  else if (e < 185)         icon = '🌕';
  else if (e < 265)         icon = '🌖';
  else if (e < 275)         icon = '🌗';
  else                      icon = '🌘';
  return { pct, isWaxing, icon, label: isWaxing ? 'Waxing' : 'Waning' };
}

/** Detect special traditional yogas from weekday (dow 0=Sun) + Moon nakshatra index. */
function detectSpecialYogas(dow, nakIdx) {
  const yogas = [];
  if (SARVARTHA_SIDDHI_NAK[dow]?.includes(nakIdx))
    yogas.push({
      name: 'Sarvartha Siddhi Yoga', hi: 'सर्वार्थ सिद्धि योग', type: 'auspicious',
      desc: 'All wishes fulfilled — highly auspicious for new ventures & important activities',
    });
  if (AMRIT_SIDDHI_NAK[dow]?.includes(nakIdx))
    yogas.push({
      name: 'Amrit Siddhi Yoga', hi: 'अमृत सिद्धि योग', type: 'auspicious',
      desc: 'Nectar of success — excellent for starting new work, business, travel',
    });
  if (RAVI_YOGA_NAK[dow] === nakIdx)
    yogas.push({
      name: 'Ravi Yoga', hi: 'रवि योग', type: 'inauspicious',
      desc: 'Sun yoga — avoid important decisions & new beginnings today',
    });
  return yogas;
}

function buildTimings(date, sunrise, sunset) {
  const dow = date.getDay();
  const day = sunset - sunrise;
  const yama = day / 8;

  function periodOf(idx) {
    const s = new Date(sunrise.getTime() + idx * yama);
    const e = new Date(s.getTime() + yama);
    return { start: s, end: e };
  }

  const rahu = periodOf(RAHU_YAMA[dow] - 1);
  const gulika = periodOf(GULIKA_YAMA[dow]);
  const yamaGhanta = periodOf(YAMA_GHANTA[dow]);
  const noon = new Date((sunrise.getTime() + sunset.getTime()) / 2);
  const abhijit = { start: new Date(noon - 24 * 60000), end: new Date(noon + 24 * 60000) };
  const brahmaMuhurta = {
    start: new Date(sunrise.getTime() - 96 * 60000),
    end: new Date(sunrise.getTime() - 48 * 60000),
  };
  return { rahu, gulika, yamaGhanta, abhijit, brahmaMuhurta };
}

function buildChoghadia(date, sunrise, sunset) {
  const dow = date.getDay();
  const day = sunset - sunrise;
  const nightStart = sunset;
  const nextSunrise = new Date(sunrise.getTime() + 24 * 3600 * 1000);
  const night = nextSunrise - nightStart;
  const dayYama = day / 8, nightYama = night / 8;

  const dayStart = DAY_CHOG_START[dow];
  const nightStart2 = NIGHT_CHOG_START[dow];

  const dayPeriods = Array.from({ length: 8 }, (_, i) => ({
    ...CHOGHADIA_TYPES[(dayStart + i) % 7],
    start: new Date(sunrise.getTime() + i * dayYama),
    end: new Date(sunrise.getTime() + (i + 1) * dayYama),
    period: "day",
  }));
  const nightPeriods = Array.from({ length: 8 }, (_, i) => ({
    ...CHOGHADIA_TYPES[(nightStart2 + i) % 7],
    start: new Date(nightStart.getTime() + i * nightYama),
    end: new Date(nightStart.getTime() + (i + 1) * nightYama),
    period: "night",
  }));
  return [...dayPeriods, ...nightPeriods];
}

function buildHora(date, sunrise, sunset) {
  const dow = date.getDay();
  const day = sunset - sunrise;
  const nightStart = sunset;
  const nextSunrise = new Date(sunrise.getTime() + 24 * 3600 * 1000);
  const night = nextSunrise - nightStart;
  const dayHora = day / 12, nightHora = night / 12;
  const startIdx = DAY_HORA_START[dow];

  const dayH = Array.from({ length: 12 }, (_, i) => ({
    ...HORA_PLANETS[(startIdx + i) % 7],
    start: new Date(sunrise.getTime() + i * dayHora),
    end: new Date(sunrise.getTime() + (i + 1) * dayHora),
    period: "day", num: i + 1,
  }));
  const nightH = Array.from({ length: 12 }, (_, i) => ({
    ...HORA_PLANETS[(startIdx + 12 + i) % 7],
    start: new Date(nightStart.getTime() + i * nightHora),
    end: new Date(nightStart.getTime() + (i + 1) * nightHora),
    period: "night", num: i + 13,
  }));
  return [...dayH, ...nightH];
}

function buildLagna(date, sunrise, sunLon) {
  // Simplified: Lagna at sunrise ≈ Sun's sidereal rashi, then +1 sign per ~2h
  const baseLagna = Math.floor(sunLon / 30); // 0-11
  return Array.from({ length: 12 }, (_, i) => {
    const lagnaIdx = (baseLagna + i) % 12;
    const start = new Date(sunrise.getTime() + i * 2 * 3600 * 1000);
    const end = new Date(start.getTime() + 2 * 3600 * 1000);
    return { ...RASHI_NAMES[lagnaIdx], lagnaIdx, start, end };
  });
}

function getKarana(elongation) {
  const k = Math.floor(elongation / 6);
  if (k === 0) return KARANAS[10]; // Kimstughna
  if (k === 57) return KARANAS[7]; // Shakuni
  if (k === 58) return KARANAS[8]; // Chatushpada
  if (k === 59) return KARANAS[9]; // Naga
  return KARANAS[(k - 1) % 7];
}

function calcChandrabalam(moonRashi) {
  // Positions 1,3,6,7,10,11 (counted from birth rashi to moon rashi) = chandrabalam
  const good = new Set([1, 3, 6, 7, 10, 11]);
  return RASHI_NAMES.map((r, i) => {
    const count = ((moonRashi - i + 12) % 12) + 1;
    return { ...r, rashi: i, count, chandrabalam: good.has(count) };
  });
}

function calcTabalam(moonNakshatra) {
  return NAKSHATRAS.map((n, i) => {
    const count = ((moonNakshatra - i + 27) % 27) + 1;
    const tara = ((count - 1) % 9) + 1; // 1-9
    const taraData = TARA_NAMES[tara - 1];
    return {
      nakName: n.name, // nakshatra name as {en, hi}
      symbol: n.symbol,
      deity: n.deity,
      ruler: n.ruler,
      index: i,
      count,
      tara,
      taraName: taraData.name,       // e.g. "Janma"
      auspicious: taraData.auspicious,
      meaning: taraData.meaning,
    };
  });
}

// Tara scores 1-9: Janma=50, Sampat=90, Vipat=20, Kshema=85, Pratyari=25,
//                  Sadhaka=80, Naidhana=15, Mitra=85, ParamMitra=95
const TARA_SCORES = [50, 90, 20, 85, 25, 80, 15, 85, 95];

const BIRTH_WEEKDAY_PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
const BIRTH_WEEKDAY_EN     = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const BIRTH_WEEKDAY_HI     = ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];

function calcPersonalPanchang(member, panchang) {
  if (!member || !member.date_of_birth) return null;

  const hasTime = !!member.birth_time;
  // Normalise birth_time: accept "H:MM", "HH:MM", "HH:MM:SS" — always produce "HH:MM"
  const rawTime = member.birth_time || "";
  const timeParts = rawTime.split(":");
  const th = String(parseInt(timeParts[0] || "12") || 0).padStart(2, "0");
  const tm = String(parseInt(timeParts[1] || "0")  || 0).padStart(2, "0");
  const timeStr = `${th}:${tm}`;
  const birthDt = new Date(`${member.date_of_birth}T${timeStr}:00`);
  if (isNaN(birthDt.getTime())) return null;

  // Use stored lat/lon if available, else fall back to India defaults
  const lat = member.latitude  || 20.5937;
  const lon = member.longitude || 78.9629;

  const { moon: birthMoon } = calcSunMoon(birthDt);
  const nSize = 360 / 27;
  const janmaNakIdx  = Math.floor(birthMoon / nSize);
  const janmaRashiIdx = Math.floor(birthMoon / 30);

  const janmaNakshatra = { ...NAKSHATRAS[janmaNakIdx], index: janmaNakIdx };
  const janmaRashi     = { ...RASHI_NAMES[janmaRashiIdx], index: janmaRashiIdx };

  const bwIdx = birthDt.getDay();
  const birthWeekday = {
    index: bwIdx,
    en: BIRTH_WEEKDAY_EN[bwIdx],
    hi: BIRTH_WEEKDAY_HI[bwIdx],
    planet: BIRTH_WEEKDAY_PLANETS[bwIdx],
  };

  // ── Personal Tarabalam (count from Janma Nak → today's Moon Nak) ──
  const todayNakIdx = panchang.nakshatra.index;
  const taraCount   = ((todayNakIdx - janmaNakIdx + 27) % 27) + 1;
  const taraNum     = ((taraCount - 1) % 9) + 1;
  const personalTarabalam = { ...TARA_NAMES[taraNum - 1], tara: taraNum, count: taraCount };

  // ── Personal Chandrabalam (position of today's Moon from Janma Rashi) ──
  const todayMoonRashiIdx = panchang.moonRashi.index;
  const chandraPos        = ((todayMoonRashiIdx - janmaRashiIdx + 12) % 12) + 1;
  const chandraFavorable  = [1, 3, 6, 7, 10, 11].includes(chandraPos);
  const personalChandrabalam = {
    favorable: chandraFavorable,
    position: chandraPos,
    todayMoonRashi: panchang.moonRashi.en,
    janmaRashiName: janmaRashi.en,
  };

  // ── Special markers ──
  const isJanmaVara       = panchang.vara.index === bwIdx;
  const isJanmaNakshatra  = todayNakIdx === janmaNakIdx;

  // ── Power Horas: ruled by birth weekday planet ──
  const powerHoras = panchang.hora.filter(h => h.name === birthWeekday.planet);

  // ── Best Choghadiya: auspicious + not already ended ──
  const now = Date.now();
  const bestChoghadiya = panchang.choghadia
    .filter(c => ["amrit", "shubh", "labh"].includes(c.id))
    .filter(c => c.end.getTime() > now - 60000) // keep current + future
    .slice(0, 4);

  // ── Overall Day Score (weighted) ──
  const taraScore   = TARA_SCORES[taraNum - 1];
  const chandraScore = chandraFavorable ? 95 : 20;
  const yogaScore   = panchang.yoga.nature === "Auspicious" ? 85
                    : panchang.yoga.nature === "Inauspicious" ? 20 : 55;
  const tithiScore  = panchang.tithi.auspicious ? 80 : 35;
  const overallScore = Math.round(
    taraScore   * 0.40 +
    chandraScore * 0.30 +
    yogaScore   * 0.20 +
    tithiScore  * 0.10
  );

  // Strength label
  const dayLabel = overallScore >= 75 ? "Excellent Day"
                 : overallScore >= 55 ? "Good Day"
                 : overallScore >= 35 ? "Average Day"
                 : "Challenging Day";
  const dayMessage = overallScore >= 75
    ? "Cosmic forces align strongly in your favour today. Start important work."
    : overallScore >= 55
    ? "Generally favourable conditions. Proceed with awareness."
    : overallScore >= 35
    ? "Mixed energies today. Focus on routine tasks and spiritual practice."
    : "Proceed with caution. Rest, reflect, and avoid major decisions.";

  return {
    janmaNakshatra,
    janmaRashi,
    birthWeekday,
    personalTarabalam,
    personalChandrabalam,
    isJanmaVara,
    isJanmaNakshatra,
    powerHoras,
    bestChoghadiya,
    overallScore,
    dayLabel,
    dayMessage,
    hasTime,
    approximated: !hasTime,
  };
}

function calculatePanchang(date, lat = 28.6139, lon = 77.209, tz = 5.5) {
  // Vedic standard: Tithi/Nakshatra/Yoga of the day = those prevailing at sunrise.
  // Compute sunrise first (no circular dependency — calcSunriseSunset uses only
  // day-of-year + lat/lon, not sun/moon positions), then use sunrise as the
  // astronomical reference for all 5 Panchang limbs.
  // tz = civil timezone offset in hours (e.g. 5.5 for IST). Passed explicitly so
  // calculations are independent of the user's browser/OS timezone setting.
  const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
  const { sunrise, sunset } = calcSunriseSunset(dayStart, lat, lon, tz);
  const { sun, moon, ayanamsa } = calcSunMoon(sunrise);
  const approxGrahas = buildApproxGrahas(sunrise, sun, moon, ayanamsa);

  let elong = moon - sun;
  if (elong < 0) elong += 360;

  const tithiIdx = Math.floor(elong / 12);
  const tithiProg = (elong % 12) / 12;

  const nSize = 360 / 27;
  const nakIdx = Math.floor(moon / nSize);
  const nakProg = (moon % nSize) / nSize;
  const pada = Math.floor(nakProg * 4) + 1;

  const yogaIdx = Math.floor(norm(sun + moon) / nSize);
  const karana = getKarana(elong);

  const dow = date.getDay();
  const vara = {
    index: dow,
    en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dow],
    hi: ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"][dow],
    ruler: ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"][dow],
    rulerHi: ["सूर्य", "चंद्र", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"][dow],
  };

  const timings = buildTimings(date, sunrise, sunset);
  const choghadia = buildChoghadia(date, sunrise, sunset);
  const hora = buildHora(date, sunrise, sunset);
  const lagna = buildLagna(date, sunrise, sun);
  const moonRashi = Math.floor(moon / 30);
  const sunRashi = Math.floor(sun / 30);
  const chandrabalam = calcChandrabalam(moonRashi);
  const tarabalam = calcTabalam(nakIdx);

  // Enrichment fields (computed from simplified positions; backend overrides with exact values)
  const moonPhase    = getMoonPhase(elong);
  const masa         = getMasa(sun);
  const vikramSamvat = getVikramSamvat(date);
  const shakaSamvat  = getShakaSamvat(date);
  const specialYogas = detectSpecialYogas(dow, nakIdx);

  return {
    tithi: { ...TITHIS[tithiIdx], progress: tithiProg, index: tithiIdx },
    nakshatra: { ...NAKSHATRAS[nakIdx], progress: nakProg, pada, index: nakIdx },
    yoga: { ...YOGAS[yogaIdx], index: yogaIdx },
    karana,
    vara,
    sunrise, sunset,
    timings,
    choghadia,
    hora,
    lagna,
    moonRashi: { ...RASHI_NAMES[moonRashi], index: moonRashi },
    sunRashi: { ...RASHI_NAMES[sunRashi], index: sunRashi },
    sunLon: sun, moonLon: moon,
    chandrabalam,
    tarabalam,
    // Enrichment
    moonPhase,
    masa,
    vikramSamvat,
    shakaSamvat,
    specialYogas,
    // End times — null until backend provides speed data
    tithiEndTime: null, nakEndTime: null, yogaEndTime: null, karanaEndTime: null,
    // Planet positions — approximated locally; backend replaces with exact Swiss Ephemeris values
    grahas: approxGrahas,
  };
}

// ─── Swiss Ephemeris Backend Integration ──────────────────────────────────────

const ASTROLOGY_DIRECT_BASE = (import.meta.env.VITE_ASTROLOGY_API_URL || '').replace(/\/+$/, '');
const BACKEND_API_BASE = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/+$/, '');

function getAstrologyChartEndpoints() {
  const endpoints = [];
  if (BACKEND_API_BASE) {
    endpoints.push(`${BACKEND_API_BASE}/api/astrology/chart/calculate`);
  } else {
    // Default Vercel adapter route when VITE_BACKEND_URL is missing
    endpoints.push('/api/api/astrology/chart/calculate');
  }
  // Alternative route shape used in some deployments
  endpoints.push('/api/astrology/chart/calculate');
  if (ASTROLOGY_DIRECT_BASE) endpoints.push(`${ASTROLOGY_DIRECT_BASE}/api/chart/calculate`);
  if (endpoints.length === 0) endpoints.push('http://localhost:8000/api/chart/calculate');
  return Array.from(new Set(endpoints));
}

function getChartPayload(data) {
  if (data?.planets) return data;
  if (data?.chart?.planets) return data.chart;
  if (data?.data?.planets) return data.data;
  if (data?.data?.chart?.planets) return data.data.chart;
  return null;
}

/** Fetch exact Sun/Moon longitudes from the Swiss Ephemeris backend at sunrise,
 *  then derive accurate Tithi/Nakshatra/Yoga/Karana.
 *  Returns null on any error so the caller can fall back to simplified formula. */
async function fetchPanchangFromBackend(date, lat, lon, tz = 5.5) {
  try {
    // Compute approximate sunrise to use as the astronomical reference moment.
    // Use the location's civil tz (not browser timezone) for accurate sunrise.
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
    const { sunrise } = calcSunriseSunset(dayStart, lat, lon, tz);

    // Build local ISO string with the location's civil timezone offset (not browser's)
    const pad = n => String(n).padStart(2, '0');
    const localISO = `${sunrise.getFullYear()}-${pad(sunrise.getMonth()+1)}-${pad(sunrise.getDate())}T${pad(sunrise.getHours())}:${pad(sunrise.getMinutes())}:${pad(sunrise.getSeconds())}`;
    const sign   = tz >= 0 ? '+' : '-';
    const absTz  = Math.abs(tz);
    const tzStr  = `${sign}${pad(Math.floor(absTz))}:${pad(Math.round((absTz % 1) * 60))}`;

    let authHeader = {};
    try {
      let accessToken = null;
      const { data: { session } } = await supabase.auth.getSession();
      accessToken = session?.access_token || null;
      if (!accessToken) {
        const { data: { session: refreshed } } = await supabase.auth.refreshSession();
        accessToken = refreshed?.access_token || null;
      }
      if (accessToken) {
        authHeader = { Authorization: `Bearer ${accessToken}` };
      }
    } catch {
      // Non-fatal: direct astrology backend may not require auth
    }

    const requestBody = JSON.stringify({
      birth_datetime: `${localISO}${tzStr}`,
      latitude: lat,
      longitude: lon,
      ayanamsa: 'LAHIRI',
    });

    let data = null;
    const endpoints = getAstrologyChartEndpoints();

    for (const endpoint of endpoints) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      try {
        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...authHeader },
          signal: controller.signal,
          body: requestBody,
        });
        if (!resp.ok) continue;
        const json = await resp.json();
        const payload = getChartPayload(json);
        if (payload?.planets) {
          data = payload;
          break;
        }
      } catch {
        // Try next endpoint candidate
      } finally {
        clearTimeout(timeout);
      }
    }
    if (!data) return null;

    // Use longitude_sidereal (Vedic) with fallback to longitude field
    const sunLon  = data?.planets?.Sun?.longitude_sidereal  ?? data?.planets?.Sun?.longitude;
    const moonLon = data?.planets?.Moon?.longitude_sidereal ?? data?.planets?.Moon?.longitude;
    if (sunLon == null || moonLon == null) return null;

    // Planetary speeds (degrees/day) for end-time computation
    const moonSpeed = Math.abs(data?.planets?.Moon?.speed ?? 13.2);
    const sunSpeed  = Math.abs(data?.planets?.Sun?.speed  ?? 0.985);
    const relSpeed  = Math.max(moonSpeed - sunSpeed, 0.5); // elongation rate deg/day

    // Derive all 5 limbs from exact Swiss Ephemeris sidereal longitudes
    let elong = moonLon - sunLon;
    if (elong < 0) elong += 360;

    const tithiIdx  = Math.floor(elong / 12);
    const tithiProg = (elong % 12) / 12;

    const nSize   = 360 / 27;
    const nakIdx  = Math.floor(moonLon / nSize);
    const nakProg = (moonLon % nSize) / nSize;
    const pada    = Math.floor(nakProg * 4) + 1;

    const yogaIdx = Math.floor(norm(sunLon + moonLon) / nSize);
    const karana  = getKarana(elong);

    const moonRashiIdx = Math.floor(norm(moonLon) / 30);
    const sunRashiIdx  = Math.floor(norm(sunLon)  / 30);

    // ── End times computed from speed (ms = degrees_remaining / speed_deg_per_day * ms_per_day) ──
    const msPerDay = 24 * 3600 * 1000;
    const tithiEndTime   = new Date(sunrise.getTime() + ((12 - elong % 12) / relSpeed) * msPerDay);
    const nakEndTime     = new Date(sunrise.getTime() + ((nSize - moonLon % nSize) / moonSpeed) * msPerDay);
    const yogaEndTime    = new Date(sunrise.getTime() + ((nSize - norm(sunLon + moonLon) % nSize) / (moonSpeed + sunSpeed)) * msPerDay);
    const karanaEndTime  = new Date(sunrise.getTime() + ((6 - elong % 6) / relSpeed) * msPerDay);

    // ── Build all-9-planet Graha Sthiti ──
    const grahas = PLANET_ORDER.map(pName => {
      const pl = data?.planets?.[pName];
      if (!pl) return null;
      const lon      = pl.longitude_sidereal ?? pl.longitude ?? 0;
      const normLon  = norm(lon);
      const rashiIdx = Math.floor(normLon / 30);
      const nakIdx2  = Math.floor(normLon / nSize) % 27;
      return {
        name: pName,
        ...GRAHA_INFO[pName],
        lon: normLon,
        degInSign: normLon % 30,
        rashi: RASHI_NAMES[rashiIdx],
        nakshatra: NAKSHATRAS[nakIdx2],
        isRetrograde: pl.is_retrograde ?? (pl.speed != null && pl.speed < 0),
        speed: pl.speed ?? 0,
        source: 'swiss',
      };
    }).filter(Boolean);

    // ── Enrichment fields re-derived from exact positions ──
    const specialYogas = detectSpecialYogas(sunrise.getDay(), nakIdx);

    return {
      tithi:      { ...TITHIS[tithiIdx],   progress: tithiProg, index: tithiIdx },
      nakshatra:  { ...NAKSHATRAS[nakIdx], progress: nakProg,   pada, index: nakIdx },
      yoga:       { ...YOGAS[yogaIdx],     index: yogaIdx },
      karana,
      sunLon,
      moonLon,
      moonRashi:    { ...RASHI_NAMES[moonRashiIdx], index: moonRashiIdx },
      sunRashi:     { ...RASHI_NAMES[sunRashiIdx],  index: sunRashiIdx },
      chandrabalam: calcChandrabalam(moonRashiIdx),
      tarabalam:    calcTabalam(nakIdx),
      moonPhase:    getMoonPhase(elong),
      specialYogas,
      // End times — exact, from Swiss Ephemeris speed data
      tithiEndTime, nakEndTime, yogaEndTime, karanaEndTime,
      // All 9 planet positions from Swiss Ephemeris
      grahas,
    };
  } catch (_) {
    return null; // network error / timeout — caller falls back to simplified formula
  }
}

// ─── UI Helpers ───────────────────────────────────────────────────────────────

function fmt(date) {
  if (!date) return "--";
  return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function isNow(start, end) {
  const now = Date.now();
  return now >= start.getTime() && now <= end.getTime();
}

const CHOG_COLORS = {
  amrit: "from-cyan-500/30 to-blue-600/20 border-cyan-400/40 text-cyan-300",
  shubh: "from-amber-500/30 to-yellow-600/20 border-amber-400/40 text-amber-300",
  labh: "from-emerald-500/30 to-green-600/20 border-emerald-400/40 text-emerald-300",
  char: "from-blue-500/30 to-indigo-600/20 border-blue-400/40 text-blue-300",
  udveg: "from-red-500/20 to-rose-600/10 border-red-400/30 text-red-300",
  kaal: "from-purple-500/20 to-violet-600/10 border-purple-400/30 text-purple-300",
  rog: "from-orange-500/20 to-red-600/10 border-orange-400/30 text-orange-300",
};

const HORA_COLORS = {
  amber: "from-amber-500/30 border-amber-400/40 text-amber-300",
  pink: "from-pink-500/30 border-pink-400/40 text-pink-300",
  green: "from-emerald-500/30 border-emerald-400/40 text-emerald-300",
  blue: "from-blue-500/30 border-blue-400/40 text-blue-300",
  purple: "from-purple-500/30 border-purple-400/40 text-purple-300",
  red: "from-red-500/30 border-red-400/40 text-red-300",
};

function AngaCard({ emoji, label, name, nameHi, badge, badgeColor, progress, sub, children }) {
  const badgeCls = {
    green: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    amber: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    red: "bg-red-500/20 text-red-300 border-red-500/30",
    blue: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    purple: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    cyan: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  }[badgeColor] || "bg-white/10 text-white/60 border-white/20";

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="relative rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{emoji}</span>
            <span className="text-[10px] text-white/40 uppercase tracking-wider">{label}</span>
          </div>
          {badge && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${badgeCls}`}>{badge}</span>
          )}
        </div>
        <div className="text-lg font-semibold text-white">{name}</div>
        {nameHi && <div className="text-sm text-white/50">{nameHi}</div>}
        {sub && <div className="text-xs text-white/40 mt-0.5">{sub}</div>}
        {progress !== undefined && (
          <div className="w-full bg-white/10 rounded-full h-1 mt-2">
            <div className="h-1 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"
              style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>
        )}
        {children && <div className="mt-3 pt-3 border-t border-white/10 text-xs text-white/50">{children}</div>}
      </div>
    </motion.div>
  );
}

function TimingPill({ emoji, label, timeStr, active, color = "red" }) {
  const colors = {
    red: active ? "bg-red-500/20 border-red-400/50 text-red-300" : "bg-red-500/10 border-red-500/20",
    amber: active ? "bg-amber-500/20 border-amber-400/50 text-amber-300" : "bg-amber-500/10 border-amber-500/20",
    green: active ? "bg-emerald-500/20 border-emerald-400/50 text-emerald-300" : "bg-emerald-500/10 border-emerald-500/20",
    purple: active ? "bg-purple-500/20 border-purple-400/50 text-purple-300" : "bg-purple-500/10 border-purple-500/20",
    cyan: active ? "bg-cyan-500/20 border-cyan-400/50 text-cyan-300" : "bg-cyan-500/10 border-cyan-500/20",
  };
  return (
    <div className={`rounded-xl border px-4 py-3 text-center ${colors[color]}`}>
      <div className="text-xl mb-1">{emoji}</div>
      <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">{label}</div>
      <div className="text-sm font-semibold text-white/90">{timeStr}</div>
      {active && <div className={`text-[10px] mt-1 font-medium ${colors[color].includes('red') ? 'text-red-400' : 'text-emerald-400'}`}>● Active now</div>}
    </div>
  );
}

// ─── Tab components ────────────────────────────────────────────────────────────

function OverviewTab({ p }) {
  const now = new Date();
  const { timings } = p;
  return (
    <div className="space-y-5">

      {/* Vedic Date Banner */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
        <span className="text-amber-300/80 font-medium">{p.masa?.en} · {p.masa?.hi}</span>
        <span className="text-white/20">·</span>
        <span className="text-white/50">{p.tithi.paksha} Paksha · Day {p.tithi.number}</span>
        <span className="text-white/20">·</span>
        <span className="text-white/40">Vikram Samvat {p.vikramSamvat}</span>
        <span className="text-white/20">·</span>
        <span className="text-white/40">Shaka {p.shakaSamvat}</span>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="text-base">{p.moonPhase?.icon}</span>
          <span className="text-white/40">{p.moonPhase?.pct}% · {p.moonPhase?.label}</span>
        </span>
      </div>

      {/* Special Yogas (if any) */}
      {p.specialYogas?.length > 0 && (
        <div>
          <SectionHead text="विशेष योग — Special Yogas Today" />
          <div className="flex flex-wrap gap-3">
            {p.specialYogas.map((y, i) => (
              <div key={i} className={`flex-1 min-w-[180px] rounded-xl border p-3 ${
                y.type === 'auspicious'
                  ? 'bg-emerald-500/10 border-emerald-400/30'
                  : 'bg-red-500/10 border-red-400/30'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">{y.type === 'auspicious' ? '✨' : '⚠️'}</span>
                  <div>
                    <div className={`text-sm font-semibold ${y.type === 'auspicious' ? 'text-emerald-300' : 'text-red-300'}`}>{y.name}</div>
                    <div className="text-[10px] text-white/30">{y.hi}</div>
                  </div>
                </div>
                <div className="text-xs text-white/50">{y.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5 Panchang Angams */}
      <div>
        <SectionHead text="पञ्चाङ्ग के पाँच अंग — Five Limbs" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <AngaCard emoji="🌙" label="Tithi · तिथि"
            name={p.tithi.name.en} nameHi={`${p.tithi.name.hi} · ${p.tithi.paksha} Paksha`}
            badge={p.tithi.quality} badgeColor={p.tithi.auspicious ? "green" : "amber"}
            progress={p.tithi.progress} sub={`Lunar Day ${p.tithi.number} · Ruler: ${p.tithi.ruler}`}
          >
            {p.tithi.desc}
            {p.tithiEndTime && <div className="mt-1 text-amber-400/70 font-medium">Ends {fmt(p.tithiEndTime)}</div>}
          </AngaCard>

          <AngaCard emoji="☀️" label="Vara · वार"
            name={p.vara.en} nameHi={p.vara.hi}
            badge={p.vara.ruler} badgeColor="purple"
          >
            Planetary Ruler: {p.vara.ruler} · {p.vara.rulerHi}
          </AngaCard>

          <AngaCard emoji="⭐" label="Nakshatra · नक्षत्र"
            name={p.nakshatra.name.en} nameHi={`${p.nakshatra.name.hi} · Pada ${p.nakshatra.pada}`}
            badge={p.nakshatra.quality} badgeColor="cyan"
            progress={p.nakshatra.progress} sub={`Deity: ${p.nakshatra.deity} · Ruler: ${p.nakshatra.ruler}`}
          >
            Nature: {p.nakshatra.nature} · Quality: {p.nakshatra.quality}
            {p.nakEndTime && <div className="mt-1 text-cyan-400/70 font-medium">Ends {fmt(p.nakEndTime)}</div>}
          </AngaCard>

          <AngaCard emoji="🕉️" label="Yoga · योग"
            name={p.yoga.name.en} nameHi={p.yoga.name.hi}
            badge={p.yoga.nature}
            badgeColor={p.yoga.nature === "Auspicious" ? "green" : p.yoga.nature === "Inauspicious" ? "red" : "amber"}
          >
            {p.yoga.desc}
            {p.yogaEndTime && <div className="mt-1 text-purple-400/70 font-medium">Ends {fmt(p.yogaEndTime)}</div>}
          </AngaCard>

          <AngaCard emoji="🌀" label="Karana · करण"
            name={p.karana.name.en} nameHi={p.karana.name.hi}
            badge={p.karana.type} badgeColor={p.karana.auspicious ? "green" : "amber"}
          >
            Ruler: {p.karana.ruler} · {p.karana.auspicious ? "Auspicious" : "Proceed with caution"}
            {p.karanaEndTime && <div className="mt-1 text-amber-400/70 font-medium">Ends {fmt(p.karanaEndTime)}</div>}
          </AngaCard>

          <AngaCard emoji="🌕" label="Chandra Rashi · चंद्र राशि"
            name={p.moonRashi.en} nameHi={p.moonRashi.hi}
            badge="Moon" badgeColor="blue"
          >
            Sun in {p.sunRashi.en} ({p.sunLon.toFixed(1)}°) · Moon at {p.moonLon.toFixed(1)}°
          </AngaCard>
        </div>
      </div>

      {/* Key Timings */}
      <div>
        <SectionHead text="काल विभाग — Key Timings" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <TimingPill emoji="🌅" label="Sunrise · सूर्योदय" timeStr={fmt(p.sunrise)} active={false} color="amber" />
          <TimingPill emoji="🌇" label="Sunset · सूर्यास्त" timeStr={fmt(p.sunset)} active={false} color="amber" />
          <TimingPill emoji="✨" label="Brahma Muhurta" timeStr={`${fmt(timings.brahmaMuhurta.start)} – ${fmt(timings.brahmaMuhurta.end)}`}
            active={isNow(timings.brahmaMuhurta.start, timings.brahmaMuhurta.end)} color="cyan" />
          <TimingPill emoji="🌟" label="Abhijit Muhurta" timeStr={`${fmt(timings.abhijit.start)} – ${fmt(timings.abhijit.end)}`}
            active={isNow(timings.abhijit.start, timings.abhijit.end)} color="green" />
          <TimingPill emoji="⚠️" label="Rahu Kaal · राहुकाल" timeStr={`${fmt(timings.rahu.start)} – ${fmt(timings.rahu.end)}`}
            active={isNow(timings.rahu.start, timings.rahu.end)} color="red" />
        </div>
      </div>

      {/* Inauspicious Periods */}
      <div>
        <SectionHead text="अशुभ काल — Inauspicious Periods" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { emoji: "⚠️", label: "Rahu Kaal", t: timings.rahu, color: "red" },
            { emoji: "🚫", label: "Gulika Kaal", t: timings.gulika, color: "purple" },
            { emoji: "❌", label: "Yama Ghanta", t: timings.yamaGhanta, color: "amber" },
          ].map(({ emoji, label, t, color }) => (
            <div key={label} className={`rounded-xl border p-4 ${isNow(t.start, t.end)
              ? "bg-red-500/15 border-red-400/40" : "bg-white/5 border-white/10"}`}>
              <div className="flex items-center gap-2 mb-1">
                <span>{emoji}</span>
                <span className="text-sm font-medium text-white/80">{label}</span>
                {isNow(t.start, t.end) && <span className="ml-auto text-xs text-red-400 font-medium">Active</span>}
              </div>
              <div className="text-base font-semibold text-white">{fmt(t.start)} – {fmt(t.end)}</div>
              <div className="text-xs text-white/40 mt-1">Avoid important activities</div>
            </div>
          ))}
        </div>
      </div>

      {/* Auspicious Periods */}
      <div>
        <SectionHead text="शुभ काल — Auspicious Periods" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { emoji: "🌅", label: "Brahma Muhurta", t: timings.brahmaMuhurta, desc: "Best for meditation & spiritual practice" },
            { emoji: "🌟", label: "Abhijit Muhurta", t: timings.abhijit, desc: "Midday — auspicious for all important works" },
          ].map(({ emoji, label, t, desc }) => (
            <div key={label} className={`rounded-xl border p-4 ${isNow(t.start, t.end)
              ? "bg-emerald-500/15 border-emerald-400/40" : "bg-white/5 border-white/10"}`}>
              <div className="flex items-center gap-2 mb-1">
                <span>{emoji}</span>
                <span className="text-sm font-medium text-white/80">{label}</span>
                {isNow(t.start, t.end) && <span className="ml-auto text-xs text-emerald-400 font-medium">Active</span>}
              </div>
              <div className="text-base font-semibold text-white">{fmt(t.start)} – {fmt(t.end)}</div>
              <div className="text-xs text-white/40 mt-1">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChoghadiaTab({ p }) {
  const day = p.choghadia.filter(c => c.period === "day");
  const night = p.choghadia.filter(c => c.period === "night");

  return (
    <div className="space-y-5">
      <div className="text-xs text-white/40 bg-white/5 rounded-lg px-4 py-2 border border-white/10 leading-relaxed">
        <span className="text-white/60 font-medium">Choghadiya</span> divides the day into 8 equal parts (from sunrise to sunset) and night into 8 parts (sunset to next sunrise). Each part is ruled by a planet and classified by its quality for undertaking activities.
      </div>

      <div>
        <SectionHead text="दिन का चौघड़िया — Day Choghadiya" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {day.map((c, i) => (
            <ChogCard key={i} c={c} />
          ))}
        </div>
      </div>
      <div>
        <SectionHead text="रात का चौघड़िया — Night Choghadiya" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {night.map((c, i) => (
            <ChogCard key={i} c={c} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ChogCard({ c }) {
  const active = isNow(c.start, c.end);
  const cls = CHOG_COLORS[c.id] || "from-white/10 border-white/10 text-white/70";
  const natureBadge = {
    Excellent: "bg-cyan-500/20 text-cyan-300 border-cyan-400/30",
    Auspicious: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
    Neutral: "bg-blue-500/20 text-blue-300 border-blue-400/30",
    Inauspicious: "bg-red-500/20 text-red-300 border-red-400/30",
  }[c.nature] || "bg-white/10 text-white/50";

  return (
    <motion.div whileHover={{ scale: 1.01 }}
      className={`relative rounded-xl border bg-gradient-to-br ${cls} p-3 ${active ? "ring-1 ring-white/30" : ""}`}>
      {active && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full animate-pulse" />
      )}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{c.name.en}</span>
          <span className="text-xs text-white/40">{c.name.hi}</span>
        </div>
        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${natureBadge}`}>{c.nature}</span>
      </div>
      <div className="text-xs text-white/60">{fmt(c.start)} – {fmt(c.end)}</div>
      <div className="text-[10px] text-white/40 mt-0.5">Ruled by {c.planet} · {c.desc}</div>
    </motion.div>
  );
}

function HoraTab({ p }) {
  const day = p.hora.filter(h => h.period === "day");
  const night = p.hora.filter(h => h.period === "night");

  return (
    <div className="space-y-5">
      <div className="text-xs text-white/40 bg-white/5 rounded-lg px-4 py-2 border border-white/10 leading-relaxed">
        <span className="text-white/60 font-medium">Hora</span> divides the day into 12 planetary hours (sunrise to sunset) and night into 12 (sunset to next sunrise). Each hora is ruled by one of the 7 visible planets in Chaldean order. Activities align best with their ruling planet.
      </div>
      <div>
        <SectionHead text="दिन का होरा — Day Hora" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {day.map((h, i) => <HoraCard key={i} h={h} />)}
        </div>
      </div>
      <div>
        <SectionHead text="रात का होरा — Night Hora" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {night.map((h, i) => <HoraCard key={i} h={h} />)}
        </div>
      </div>
    </div>
  );
}

function HoraCard({ h }) {
  const active = isNow(h.start, h.end);
  const cls = HORA_COLORS[h.color] || "from-white/10 border-white/10 text-white/70";
  return (
    <motion.div whileHover={{ scale: 1.02 }}
      className={`relative rounded-xl border bg-gradient-to-br ${cls} p-3 text-center ${active ? "ring-1 ring-white/30" : ""}`}>
      {active && <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
      <div className="text-xl mb-1">{h.symbol}</div>
      <div className="text-sm font-semibold text-white">{h.name}</div>
      <div className="text-[10px] text-white/50">{h.hi}</div>
      <div className="text-[10px] text-white/40 mt-1">{fmt(h.start)}–{fmt(h.end)}</div>
    </motion.div>
  );
}

function LagnaTab({ p }) {
  return (
    <div className="space-y-5">
      <div className="text-xs text-white/40 bg-white/5 rounded-lg px-4 py-2 border border-white/10 leading-relaxed">
        <span className="text-white/60 font-medium">Lagna</span> (Ascendant) is the Rashi rising on the eastern horizon. It changes approximately every 2 hours as the Earth rotates. The Lagna at any given time colors events started during that period. <span className="text-white/30">Values shown are simplified — exact Lagna depends on precise latitude.</span>
      </div>
      <div>
        <SectionHead text="लग्न — Rising Signs Throughout the Day" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {p.lagna.map((l, i) => {
            const active = isNow(l.start, l.end);
            return (
              <motion.div key={i} whileHover={{ scale: 1.02 }}
                className={`rounded-xl border p-4 ${active
                  ? "bg-purple-500/20 border-purple-400/40 ring-1 ring-purple-400/30"
                  : "bg-white/5 border-white/10"}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">{l.en}</div>
                    <div className="text-xs text-white/50">{l.hi}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-white/60">{fmt(l.start)}</div>
                    <div className="text-[10px] text-white/30">to {fmt(l.end)}</div>
                  </div>
                </div>
                {active && (
                  <div className="mt-2 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
                    <span className="text-xs text-purple-300 font-medium">Current Lagna</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ChandraTabaTab({ p }) {
  const { chandrabalam, tarabalam } = p;
  const moonRashi = p.moonRashi;

  return (
    <div className="space-y-6">
      {/* Chandrabalam */}
      <div>
        <div className="text-xs text-white/40 bg-white/5 rounded-lg px-4 py-2 border border-white/10 leading-relaxed mb-4">
          <span className="text-white/60 font-medium">Chandrabalam</span> — Moon strength for each Janma Rashi. Today Moon is in <span className="text-cyan-300">{moonRashi.en}</span>. Positions 1, 3, 6, 7, 10, 11 from birth Rashi to Moon Rashi are favorable.
        </div>
        <SectionHead text="चंद्रबल — Chandrabalam by Birth Rashi" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {chandrabalam.map((c, i) => (
            <motion.div key={i} whileHover={{ scale: 1.02 }}
              className={`rounded-xl border p-3 ${c.chandrabalam
                ? "bg-emerald-500/15 border-emerald-400/30"
                : "bg-red-500/10 border-red-500/20"}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">{c.en.split(" ")[0]}</div>
                  <div className="text-xs text-white/50">{c.hi}</div>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${c.chandrabalam ? "bg-emerald-500/30 text-emerald-300" : "bg-red-500/20 text-red-300"}`}>
                  {c.count}
                </div>
              </div>
              <div className={`text-[10px] mt-1 font-medium ${c.chandrabalam ? "text-emerald-400" : "text-red-400"}`}>
                {c.chandrabalam ? "✓ Chandrabalam" : "✗ Not favorable"}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tarabalam */}
      <div>
        <div className="text-xs text-white/40 bg-white/5 rounded-lg px-4 py-2 border border-white/10 leading-relaxed mb-4">
          <span className="text-white/60 font-medium">Tarabalam</span> — Star strength for each Janma Nakshatra. Today Moon Nakshatra is <span className="text-purple-300">{p.nakshatra.name.en}</span>. Count from your birth star to today's Moon star; the Tara type determines auspiciousness.
        </div>
        <SectionHead text="ताराबल — Tarabalam by Birth Nakshatra" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {tarabalam.map((t, i) => (
            <motion.div key={i} whileHover={{ scale: 1.01 }}
              className={`rounded-xl border p-3 ${t.auspicious
                ? "bg-emerald-500/10 border-emerald-500/20"
                : "bg-red-500/10 border-red-500/20"}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{t.nakName.en}</div>
                  <div className="text-[10px] text-white/40">{t.nakName.hi}</div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className={`text-xs font-bold px-2 py-0.5 rounded ${t.auspicious ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"}`}>
                    Tara {t.tara}
                  </div>
                  <div className={`text-[10px] mt-0.5 ${t.auspicious ? "text-emerald-400" : "text-red-400"}`}>
                    {t.taraName}
                  </div>
                </div>
              </div>
              <div className={`text-xs font-medium mt-1 ${t.auspicious ? "text-emerald-300" : "text-red-300"}`}>{t.taraName}</div>
              <div className="text-[10px] text-white/40 mt-0.5">{t.meaning}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Score ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score }) {
  const r = 36, circ = 2 * Math.PI * r;
  const pct  = Math.min(1, score / 100);
  const dash = circ * pct;
  const color = score >= 75 ? "#34d399" : score >= 55 ? "#fbbf24" : score >= 35 ? "#f97316" : "#f87171";
  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      <svg className="absolute inset-0 -rotate-90" width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
        <circle cx="48" cy="48" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
      </svg>
      <div className="text-center">
        <div className="text-2xl font-bold text-white leading-none">{score}</div>
        <div className="text-[9px] text-white/40 mt-0.5">/100</div>
      </div>
    </div>
  );
}

// ─── Personal Tab ─────────────────────────────────────────────────────────────
function PersonalTab({ p, member, personal, loading, navigate }) {
  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 gap-3 text-white/40">
        <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        Loading your profile…
      </div>
    );
  }

  // No profile / missing DOB
  if (!member || !member.date_of_birth) {
    return (
      <div className="max-w-sm mx-auto py-12 text-center space-y-5">
        <div className="text-5xl">🧬</div>
        <div>
          <div className="text-white/80 font-semibold text-lg mb-2">Link Your Birth Profile</div>
          <p className="text-sm text-white/40 leading-relaxed">
            Your personalised Panchang — Janma Nakshatra, Tarabalam, Chandrabalam and daily
            cosmic score — is derived from your birth details.
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-left space-y-2">
          <p className="text-xs text-white/50 font-medium">To link your profile:</p>
          <ol className="text-xs text-white/40 space-y-1 list-decimal list-inside">
            <li>Go to <span className="text-amber-300">Family Members</span> and add yourself</li>
            <li>Set your <span className="text-white/60">Date of Birth</span> (required)</li>
            <li>Add <span className="text-white/60">Birth Time</span> for exact Janma Nakshatra</li>
            <li>Return here — this tab will populate automatically</li>
          </ol>
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate("/family-members")}
            className="px-5 py-2.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 text-sm font-medium hover:bg-amber-500/30 transition">
            Add My Birth Details →
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 text-sm hover:bg-white/10 transition">
            Profile
          </button>
        </div>
        {member && !member.date_of_birth && (
          <p className="text-[10px] text-amber-400/60">
            Profile found but Date of Birth is missing — please edit your family member entry.
          </p>
        )}
      </div>
    );
  }

  // Calculation error
  if (!personal) {
    return (
      <div className="text-center py-16 text-white/40">
        Could not calculate personal readings. Please check your profile data.
      </div>
    );
  }

  const { janmaNakshatra, janmaRashi, birthWeekday, personalTarabalam,
    personalChandrabalam, isJanmaVara, isJanmaNakshatra,
    powerHoras, bestChoghadiya, overallScore, dayLabel, dayMessage,
    hasTime, approximated } = personal;

  const scoreColor = overallScore >= 75 ? "emerald"
    : overallScore >= 55 ? "amber"
    : overallScore >= 35 ? "orange" : "red";

  const scoreBg = {
    emerald: "from-emerald-500/20 to-emerald-600/10 border-emerald-400/30",
    amber:   "from-amber-500/20 to-amber-600/10 border-amber-400/30",
    orange:  "from-orange-500/20 to-orange-600/10 border-orange-400/30",
    red:     "from-red-500/20 to-red-600/10 border-red-400/30",
  }[scoreColor];

  return (
    <div className="space-y-5">
      {/* Approximation notice */}
      {approximated && (
        <div className="flex items-start justify-between gap-2 bg-amber-500/10 border border-amber-400/20 rounded-xl px-4 py-3 text-xs text-amber-300/80">
          <div className="flex items-start gap-2">
            <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
            <span>Birth time not set — Moon position approximated to noon (±½ nakshatra error). Add birth time for exact Janma Nakshatra.</span>
          </div>
          <button
            onClick={() => navigate("/family-members")}
            className="shrink-0 text-[10px] text-amber-300 underline underline-offset-2 hover:text-amber-200 transition whitespace-nowrap">
            Add time →
          </button>
        </div>
      )}

      {/* Birth profile snapshot */}
      <div>
        <SectionHead text="आपका जन्म विवरण — Your Birth Profile" />
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/40 to-cyan-500/30 border border-white/20 flex items-center justify-center">
              <User className="h-5 w-5 text-white/70" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{member.name}</div>
              <div className="text-xs text-white/40">
                {member.date_of_birth}
                {member.birth_time ? ` · ${member.birth_time}` : " · Birth time not set"}
                {member.birth_place ? ` · ${member.birth_place}` : ""}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Janma Nakshatra", value: janmaNakshatra.name.en, sub: janmaNakshatra.name.hi, emoji: janmaNakshatra.symbol },
              { label: "Janma Rashi", value: janmaRashi.en.split(" ")[0], sub: janmaRashi.hi, emoji: "🌙" },
              { label: "Birth Weekday", value: birthWeekday.en, sub: birthWeekday.hi, emoji: "☀️", extra: birthWeekday.planet },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-3 text-center">
                <div className="text-xl mb-1">{item.emoji}</div>
                <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">{item.label}</div>
                <div className="text-xs font-semibold text-white">{item.value}</div>
                <div className="text-[10px] text-white/50">{item.sub}</div>
                {item.extra && <div className="text-[10px] text-purple-300 mt-0.5">Ruler: {item.extra}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overall day score */}
      <div>
        <SectionHead text="आज का कॉस्मिक स्कोर — Your Day Score" />
        <div className={`rounded-2xl border bg-gradient-to-br ${scoreBg} p-5`}>
          <div className="flex items-center gap-5">
            <ScoreRing score={overallScore} />
            <div className="flex-1">
              <div className="text-lg font-bold text-white mb-1">{dayLabel}</div>
              <p className="text-sm text-white/60 leading-relaxed">{dayMessage}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {[
                  { label: `Tara: ${personalTarabalam.taraName || personalTarabalam.name}`, good: personalTarabalam.auspicious },
                  { label: `Chandra: ${personalChandrabalam.favorable ? "Favorable" : "Unfavorable"}`, good: personalChandrabalam.favorable },
                  { label: `Yoga: ${p.yoga.nature}`, good: p.yoga.nature === "Auspicious" },
                  { label: `Tithi: ${p.tithi.auspicious ? "Auspicious" : "Mixed"}`, good: p.tithi.auspicious },
                ].map((f, i) => (
                  <span key={i} className={`text-[10px] px-2 py-0.5 rounded-full border ${
                    f.good ? "bg-emerald-500/15 border-emerald-400/30 text-emerald-300"
                           : "bg-red-500/10 border-red-400/20 text-red-300"}`}>
                    {f.good ? "✓" : "✗"} {f.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Tarabalam + Chandrabalam */}
      <div>
        <SectionHead text="व्यक्तिगत बल — Personal Strength Today" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Tarabalam */}
          <div className={`rounded-xl border p-4 ${personalTarabalam.auspicious
            ? "bg-emerald-500/10 border-emerald-400/30"
            : "bg-red-500/10 border-red-400/25"}`}>
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-purple-300" />
              <span className="text-xs font-medium text-white/70">ताराबल · Personal Tarabalam</span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold text-white">{personalTarabalam.taraName || personalTarabalam.name}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                personalTarabalam.auspicious ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"}`}>
                Tara {personalTarabalam.tara}
              </span>
            </div>
            <p className="text-xs text-white/50">{personalTarabalam.meaning}</p>
            <div className="text-[10px] text-white/30 mt-2">
              Counted {personalTarabalam.count} nakshatra(s) from your Janma Nakshatra ({janmaNakshatra.name.en}) to today ({p.nakshatra.name.en})
            </div>
          </div>

          {/* Chandrabalam */}
          <div className={`rounded-xl border p-4 ${personalChandrabalam.favorable
            ? "bg-emerald-500/10 border-emerald-400/30"
            : "bg-red-500/10 border-red-400/25"}`}>
            <div className="flex items-center gap-2 mb-2">
              <Moon className="h-4 w-4 text-cyan-300" />
              <span className="text-xs font-medium text-white/70">चंद्रबल · Personal Chandrabalam</span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold text-white">
                {personalChandrabalam.favorable ? "Favorable" : "Unfavorable"}
              </span>
              <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                personalChandrabalam.favorable ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"}`}>
                Position {personalChandrabalam.position}
              </span>
            </div>
            <p className="text-xs text-white/50">
              {personalChandrabalam.favorable
                ? "Moon is in a harmonious position from your Janma Rashi today."
                : "Moon is in an unfavourable position from your Janma Rashi today."}
            </p>
            <div className="text-[10px] text-white/30 mt-2">
              Today Moon in {personalChandrabalam.todayMoonRashi} · Your Janma Rashi: {personalChandrabalam.janmaRashiName} · Count: {personalChandrabalam.position}th
            </div>
          </div>
        </div>
      </div>

      {/* Special Day Alerts */}
      {(isJanmaVara || isJanmaNakshatra) && (
        <div>
          <SectionHead text="विशेष दिन — Special Markers" />
          <div className="space-y-2">
            {isJanmaNakshatra && (
              <div className="flex items-start gap-3 bg-purple-500/20 border border-purple-400/40 rounded-xl px-4 py-3">
                <Sparkles className="h-4 w-4 text-purple-300 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-purple-200">Janma Nakshatra Day!</div>
                  <p className="text-xs text-white/50 mt-0.5">
                    Today's Moon is in your birth Nakshatra ({janmaNakshatra.name.en}). This is a sensitive and powerful day. Avoid new ventures, but ideal for introspection, worship, and connecting with your roots.
                  </p>
                </div>
              </div>
            )}
            {isJanmaVara && (
              <div className="flex items-start gap-3 bg-amber-500/20 border border-amber-400/40 rounded-xl px-4 py-3">
                <Sun className="h-4 w-4 text-amber-300 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-amber-200">Janma Vara — Your Birth Weekday!</div>
                  <p className="text-xs text-white/50 mt-0.5">
                    Today is {birthWeekday.en}, the same weekday you were born. Activities aligned with {birthWeekday.planet} — your ruling planet — are especially favoured. Perform {birthWeekday.planet} worship for blessings.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Power Horas */}
      {powerHoras.length > 0 && (
        <div>
          <SectionHead text={`शक्ति होरा — Your Power Horas (${birthWeekday.planet} Hours)`} />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {powerHoras.map((h, i) => {
              const active = isNow(h.start, h.end);
              return (
                <div key={i} className={`rounded-xl border p-3 text-center ${
                  active ? "bg-amber-500/25 border-amber-400/50 ring-1 ring-amber-400/30"
                         : "bg-white/5 border-white/10"}`}>
                  <div className="text-xl mb-1">{h.symbol}</div>
                  <div className="text-xs font-semibold text-white capitalize">{h.period} Hora {h.num}</div>
                  <div className="text-[10px] text-white/40 mt-0.5">{fmt(h.start)} – {fmt(h.end)}</div>
                  {active && <div className="text-[10px] text-amber-400 font-medium mt-1">● Active now</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Best Choghadiya for user */}
      {bestChoghadiya.length > 0 && (
        <div>
          <SectionHead text="आपके लिए शुभ चौघड़िया — Best Choghadiya For You" />
          <div className="space-y-2">
            {bestChoghadiya.map((c, i) => {
              const active = isNow(c.start, c.end);
              const cls = CHOG_COLORS[c.id] || "from-white/10 border-white/10 text-white/70";
              return (
                <div key={i} className={`relative rounded-xl border bg-gradient-to-br ${cls} p-3 ${active ? "ring-1 ring-white/30" : ""}`}>
                  {active && <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full animate-pulse" />}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-semibold">{c.name.en}</span>
                      <span className="text-xs text-white/40 ml-2">{c.name.hi}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      {c.nature}
                    </span>
                  </div>
                  <div className="text-xs text-white/60 mt-1">{fmt(c.start)} – {fmt(c.end)} · {c.period === "day" ? "☀️ Day" : "🌙 Night"}</div>
                  <div className="text-[10px] text-white/40">{c.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function SectionHead({ text }) {
  return (
    <div className="text-xs uppercase tracking-widest text-white/30 mb-3 flex items-center gap-2">
      <span className="w-6 h-px bg-white/15" />
      {text}
      <span className="flex-1 h-px bg-white/15" />
    </div>
  );
}

// ─── Graha Sthiti Components ──────────────────────────────────────────────────

const GRAHA_COLOR_CLASSES = {
  amber:   { bg: 'from-amber-500/20 to-amber-600/10 border-amber-400/30',  text: 'text-amber-300'   },
  slate:   { bg: 'from-slate-500/20 to-slate-600/10 border-slate-400/30',  text: 'text-slate-300'   },
  red:     { bg: 'from-red-500/20 to-red-600/10 border-red-400/30',         text: 'text-red-300'     },
  emerald: { bg: 'from-emerald-500/20 to-emerald-600/10 border-emerald-400/30', text: 'text-emerald-300' },
  yellow:  { bg: 'from-yellow-500/20 to-yellow-600/10 border-yellow-400/30', text: 'text-yellow-300'  },
  pink:    { bg: 'from-pink-500/20 to-pink-600/10 border-pink-400/30',      text: 'text-pink-300'    },
  blue:    { bg: 'from-blue-500/20 to-blue-600/10 border-blue-400/30',      text: 'text-blue-300'    },
  purple:  { bg: 'from-purple-500/20 to-purple-600/10 border-purple-400/30', text: 'text-purple-300' },
  orange:  { bg: 'from-orange-500/20 to-orange-600/10 border-orange-400/30', text: 'text-orange-300' },
};

function fmtDeg(dec) {
  const d = Math.floor(Math.abs(dec));
  const m = Math.round((Math.abs(dec) - d) * 60);
  return `${d}° ${String(m).padStart(2,'0')}'`;
}

function GrahaCard({ g }) {
  const cls = GRAHA_COLOR_CLASSES[g.color] || GRAHA_COLOR_CLASSES.slate;
  return (
    <motion.div whileHover={{ scale: 1.02, y: -2 }}
      className={`rounded-xl border bg-gradient-to-br ${cls.bg} p-4 relative overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/3 to-transparent pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`text-xl font-bold ${cls.text}`}>{g.symbol}</span>
            <div>
              <div className="text-sm font-semibold text-white">{g.name}</div>
              <div className="text-[10px] text-white/40">{g.hi}</div>
            </div>
          </div>
          {g.isRetrograde && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-400/30 font-medium">
              ℞ Retro
            </span>
          )}
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/50">Sign</span>
            <span className="text-xs font-medium text-white">{g.rashi?.en} <span className="text-white/40">{g.rashi?.hi}</span></span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/50">Degree</span>
            <span className={`text-xs font-semibold ${cls.text}`}>{fmtDeg(g.degInSign)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/50">Nakshatra</span>
            <span className="text-xs text-white/70">{g.nakshatra?.name?.en}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function GrahaTab({ p, permission, onGrant, onDeny, backendStatus, onRetry }) {
  // ── Permission not yet asked ──────────────────────────────────────────────
  if (permission === null || permission === undefined) {
    return (
      <div className="max-w-md mx-auto py-10 space-y-4">
        <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-6 text-center space-y-4">
          <div className="text-4xl">🪐</div>
          <div className="text-base font-semibold text-white">Enable Exact Planetary Positions?</div>
          <p className="text-xs text-white/60 leading-relaxed">
            KarmAnk can connect to the local Swiss Ephemeris engine (port 8000) for precise
            sidereal positions of all 9 grahas — accurate to arc-minutes.
          </p>
          <p className="text-[10px] text-white/30 leading-relaxed">
            This requires the astrology backend to be running on your device.
            If offline, simplified Panchang data remains unaffected.
          </p>
          <div className="flex gap-3 justify-center pt-1">
            <button
              onClick={onGrant}
              className="flex-1 max-w-[160px] px-4 py-2.5 rounded-xl bg-amber-500/25 border border-amber-400/50 text-amber-300 text-sm font-semibold hover:bg-amber-500/40 transition">
              ✓ Enable
            </button>
            <button
              onClick={onDeny}
              className="flex-1 max-w-[160px] px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white/40 text-sm hover:bg-white/10 transition">
              Not now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Permission denied ─────────────────────────────────────────────────────
  if (permission === 'denied') {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="text-4xl">🔒</div>
        <div className="text-sm text-white/50 font-medium">Swiss Ephemeris Disabled</div>
        <p className="text-xs text-white/30 max-w-xs mx-auto">
          Exact planetary positions are turned off. Re-enable anytime to see precise Graha Sthiti.
        </p>
        <button
          onClick={onGrant}
          className="px-5 py-2 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-medium hover:bg-amber-500/30 transition">
          Enable Swiss Ephemeris →
        </button>
      </div>
    );
  }

  // ── Loading (in-flight request, max 5 seconds) ────────────────────────────
  if (backendStatus === 'loading') {
    return (
      <div className="text-center py-16 space-y-3">
        <div className="text-4xl animate-spin" style={{ animationDuration: '3s' }}>🪐</div>
        <div className="text-sm text-white/50 font-medium">Connecting to Swiss Ephemeris…</div>
        <div className="text-xs text-white/30 max-w-xs mx-auto">
          Fetching precise sidereal positions of all 9 Grahas…
        </div>
        <button
          onClick={onDeny}
          className="text-[10px] text-white/20 hover:text-white/40 transition underline underline-offset-2 mt-2">
          Cancel
        </button>
      </div>
    );
  }

  // ── Backend failed / unreachable ──────────────────────────────────────────
  const hasGrahas = Array.isArray(p.grahas) && p.grahas.length > 0;
  const hasApproxGrahas = hasGrahas && p.grahas.some((g) => g?.source === 'approx');
  const showApproxNotice = backendStatus === 'failed' || hasApproxGrahas;

  if (!hasGrahas) {
    return (
      <div className="max-w-md mx-auto py-10 space-y-4">
        <div className="rounded-2xl border border-red-400/20 bg-red-500/8 p-6 text-center space-y-4">
          <div className="text-4xl">🌐</div>
          <div className="text-sm font-semibold text-white/70">Astrology Backend Unavailable</div>
          <p className="text-xs text-white/40 leading-relaxed">
            Could not reach the Swiss Ephemeris engine on port 8000.
            Make sure the backend is running, then tap Retry.
          </p>
          <div className="bg-black/30 rounded-xl px-4 py-3 text-left space-y-1">
            <p className="text-[10px] text-white/30 font-medium">To start the backend:</p>
            <p className="text-[10px] text-amber-300/60 font-mono">start-astrology-backend.bat</p>
            <p className="text-[10px] text-white/20">or run the Python FastAPI server on port 8000</p>
          </div>
          <div className="flex gap-3 justify-center pt-1">
            <button
              onClick={onRetry}
              className="flex-1 max-w-[140px] px-4 py-2.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 text-sm font-semibold hover:bg-amber-500/35 transition">
              ↺ Retry
            </button>
            <button
              onClick={onDeny}
              className="flex-1 max-w-[140px] px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 text-sm hover:bg-white/10 transition">
              Disable
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Data available ────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      <SectionHead text="ग्रह स्थिति — Planetary Positions · Swiss Ephemeris" />
      {showApproxNotice && (
        <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 flex items-center justify-between gap-3">
          <p className="text-xs text-amber-200/90">
            Showing approximate Graha positions. Start astrology backend for Swiss Ephemeris precision.
          </p>
          <button
            onClick={onRetry}
            className="shrink-0 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-200 text-[11px] font-medium hover:bg-amber-500/35 transition">
            Retry
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {p.grahas.map(g => <GrahaCard key={g.name} g={g} />)}
      </div>
      <div className="flex items-center justify-between text-[10px] text-white/20 mt-1">
        <span>Sidereal · Lahiri ayanamsa · Positions at sunrise</span>
        <button
          onClick={onDeny}
          className="hover:text-white/40 transition underline underline-offset-2">
          Disable
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

const TABS = [
  { id: "personal",  label: "My Panchang", hi: "मेरा पञ्चाङ्ग" },
  { id: "overview",  label: "Overview",    hi: "सारांश"         },
  { id: "choghadia", label: "Choghadia",   hi: "चौघड़िया"       },
  { id: "hora",      label: "Hora",        hi: "होरा"           },
  { id: "lagna",     label: "Lagna",       hi: "लग्न"           },
  { id: "chandra",   label: "Chandrabalam & Tarabalam", hi: "चंद्र · तारा" },
  { id: "graha",     label: "Grahas",      hi: "ग्रह"           },
];

const TAB_ID_SET = new Set(TABS.map((t) => t.id));

function normalizePanchangTab(input) {
  if (!input) return null;
  const raw = String(input).trim().toLowerCase();
  const mapped = raw === 'grah' ? 'graha' : raw;
  return TAB_ID_SET.has(mapped) ? mapped : null;
}

export default function PanchangPage() {
  const navigate = useNavigate();
  const routeLocation = useLocation();
  // Initialize date from IST so the correct weekday/vara shows regardless of browser timezone
  const [selectedDate, setSelectedDate] = useState(todayInIST);
  const [activeTab, setActiveTab] = useState("personal");
  // tz = civil timezone offset in hours; hardcode 5.5 (IST) as default for India
  const [location, setLocation] = useState({ lat: 28.6139, lon: 77.209, name: "New Delhi", tz: 5.5 });
  const [showCityPicker, setShowCityPicker] = useState(false);
  // Swiss Ephemeris backend permission ('granted' | 'denied' | null = not asked yet)
  const [backendPermission, setBackendPermission] = useState(
    () => localStorage.getItem('panchang_backend_permission') // null if never asked
  );
  // Swiss Ephemeris backend override state
  const [backendOverride, setBackendOverride] = useState(null);
  const [dataSource, setDataSource] = useState('simplified');
  // 'idle' = not tried | 'loading' = in-flight | 'success' | 'failed'
  const [backendStatus, setBackendStatus] = useState('idle');
  const [backendRetry, setBackendRetry] = useState(0);

  // Fetch all family members so user can switch profiles inside My Panchang
  const { user } = useAuth();
  const [allMembers, setAllMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) { setProfileLoading(false); return; }
    setProfileLoading(true);
    getFamilyMembers(user.id).then(({ data }) => {
      const members = data || [];
      setAllMembers(members);
      // Default to 'self' member or first member
      const self = members.find(m => m.relationship === 'self') || members[0];
      if (self) setSelectedMemberId(prev => prev || self.id);
      setProfileLoading(false);
    });
  }, [user?.id]);

  const selectedMember = allMembers.find(m => m.id === selectedMemberId) || null;

  const [locationPermission, setLocationPermission] = useState('prompt'); // 'prompt'|'granted'|'denied'

  useEffect(() => {
    const queryTab = new URLSearchParams(routeLocation.search).get('tab');
    const stateTab = routeLocation.state?.tab;
    const normalized = normalizePanchangTab(queryTab || stateTab);
    if (normalized) setActiveTab(normalized);
  }, [routeLocation.search, routeLocation.state]);

  function requestLocation() {
    if (!navigator.geolocation) { setLocationPermission('denied'); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // Approximate civil tz from longitude (rounded to nearest 0.5h); clamp for IST region
        const approxTz = Math.round((pos.coords.longitude / 15) * 2) / 2;
        // For Indian longitudes (68–97°E), always use IST = 5.5 regardless of approximation
        const isIndianLon = pos.coords.longitude >= 68 && pos.coords.longitude <= 97;
        const tz = isIndianLon ? 5.5 : approxTz;
        setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude, name: "My Location", tz });
        setLocationPermission('granted');
      },
      () => setLocationPermission('denied')
    );
  }

  // Auto-request location on mount (silent — user sees no dialog if already granted)
  useEffect(() => {
    requestLocation();
  }, []);

  // Simplified panchang — instant, synchronous (shown immediately)
  const simplifiedPanchang = useMemo(
    () => calculatePanchang(selectedDate, location.lat, location.lon, location.tz),
    [selectedDate, location.lat, location.lon, location.tz]
  );

  function grantBackendPermission() {
    localStorage.setItem('panchang_backend_permission', 'granted');
    setBackendPermission('granted');
  }

  function denyBackendPermission() {
    localStorage.setItem('panchang_backend_permission', 'denied');
    setBackendPermission('denied');
    setBackendOverride(null);
    setDataSource('simplified');
    setBackendStatus('idle');
  }

  function retryBackendConnection() {
    setBackendRetry(r => r + 1);
  }

  // Async Swiss Ephemeris upgrade — only runs when user has granted permission
  useEffect(() => {
    if (backendPermission !== 'granted') { setBackendStatus('idle'); return; }

    // Check localStorage cache — panchang for a given date + location is immutable
    const dateStr = selectedDate.toISOString().split('T')[0];
    const cacheKey = localCache.panchangKey(dateStr, location.lat, location.lon);
    const cached = localCache.get(cacheKey);
    if (cached) {
      setBackendOverride(cached);
      setDataSource('swiss-ephemeris');
      setBackendStatus('success');
      return;
    }

    setBackendOverride(null);
    setDataSource('simplified');
    setBackendStatus('loading');
    let cancelled = false;
    fetchPanchangFromBackend(selectedDate, location.lat, location.lon, location.tz)
      .then(data => {
        if (cancelled) return;
        const hasBackendGrahas = Array.isArray(data?.grahas) && data.grahas.length > 0;
        if (data && hasBackendGrahas) {
          // 30-day TTL — old dates accumulate otherwise; the data itself never changes
          localCache.set(cacheKey, data, 30 * 24 * 60 * 60 * 1000);
          setBackendOverride(data);
          setDataSource('swiss-ephemeris');
          setBackendStatus('success');
        } else {
          setBackendOverride(null);
          setBackendStatus('failed');
        }
      })
      .catch(() => { if (!cancelled) setBackendStatus('failed'); });
    return () => { cancelled = true; };
  }, [selectedDate, location.lat, location.lon, location.tz, backendPermission, backendRetry]);

  // Merged panchang — backend values override simplified when available
  const panchang = useMemo(() => {
    if (!backendOverride) return simplifiedPanchang;
    const hasBackendGrahas = Array.isArray(backendOverride.grahas) && backendOverride.grahas.length > 0;
    return {
      ...simplifiedPanchang,
      ...backendOverride,
      // Keep local graha approximation when backend returns partial chart payloads.
      grahas: hasBackendGrahas ? backendOverride.grahas : simplifiedPanchang.grahas,
    };
  }, [simplifiedPanchang, backendOverride]);

  // Personal panchang — recalculates whenever selected member or date changes
  const personal = useMemo(
    () => calcPersonalPanchang(selectedMember, panchang),
    [selectedMember, panchang]
  );

  const isToday = selectedDate.toDateString() === todayInIST().toDateString();

  function changeDate(delta) {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + delta);
    setSelectedDate(d);
  }

  const dateStr = selectedDate.toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <CosmicBackground density={120} useVideo={true}>
      <div className="min-h-screen px-4 md:px-6 py-6 relative">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => navigate("/")}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400">
                Panchang
              </h1>
              <p className="text-xs text-white/40">Vedic Daily Almanac · पञ्चाङ्ग</p>
            </div>
            {/* City selector */}
            <div className="ml-auto relative">
              <button
                onClick={() => setShowCityPicker(v => !v)}
                className="text-xs text-white/40 hover:text-white/70 flex items-center gap-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-2.5 py-1.5 transition"
              >
                <Compass className="h-3 w-3 shrink-0" />
                <span className="max-w-[100px] truncate">{location.name}</span>
                <ChevronRight className="h-3 w-3 rotate-90 shrink-0" />
              </button>
              {showCityPicker && (
                <div className="absolute right-0 top-9 z-50 w-56 bg-gray-900/95 backdrop-blur-md border border-white/15 rounded-xl shadow-2xl overflow-hidden">
                  <div className="p-2 border-b border-white/10">
                    <div className="text-[10px] text-white/30 uppercase tracking-wider px-1">Select Location</div>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <button
                      onClick={() => { requestLocation(); setShowCityPicker(false); }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-white/10 flex items-center gap-2 transition"
                    >
                      <Compass className={`h-3 w-3 ${locationPermission === 'denied' ? 'text-red-400' : 'text-cyan-300'}`} />
                      <span className={locationPermission === 'denied' ? 'text-red-300' : 'text-cyan-300'}>
                        {locationPermission === 'denied' ? 'Location denied — tap to retry' : locationPermission === 'granted' ? '✓ GPS Location active' : 'Use GPS Location'}
                      </span>
                    </button>
                    <div className="h-px bg-white/10 mx-3" />
                    {MAJOR_CITIES.map(city => (
                      <button key={city.name}
                        onClick={() => { setLocation({ lat: city.lat, lon: city.lon, name: city.name, tz: city.tz }); setShowCityPicker(false); }}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-white/10 transition ${location.name === city.name ? 'text-amber-300' : 'text-white/60'}`}
                      >
                        {city.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Date Navigator */}
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl px-4 py-3 mb-5 backdrop-blur-sm"
          >
            <button onClick={() => changeDate(-1)}
              className="p-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="text-center">
              <div className="text-sm font-medium text-white">{dateStr}</div>
              {isToday
                ? <div className="text-xs text-cyan-400 mt-0.5 font-medium">Today</div>
                : <button onClick={() => setSelectedDate(todayInIST())}
                    className="text-xs text-white/30 hover:text-white/60 mt-0.5 underline underline-offset-2 transition">
                    Go to today
                  </button>}
            </div>
            <button onClick={() => changeDate(1)}
              className="p-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition">
              <ChevronRight className="h-5 w-5" />
            </button>
          </motion.div>

          {/* Quick summary strip */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-2 mb-5"
          >
            {[
              { label: panchang.tithi.name.en, sub: panchang.tithi.paksha, icon: "🌙" },
              { label: panchang.nakshatra.name.en, sub: `Pada ${panchang.nakshatra.pada}`, icon: "⭐" },
              { label: panchang.yoga.name.en, sub: panchang.yoga.nature, icon: "🕉️" },
              { label: panchang.vara.en, sub: panchang.vara.ruler, icon: "☀️" },
              { label: `${panchang.moonPhase.pct}%`, sub: panchang.moonPhase.label, icon: panchang.moonPhase.icon },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1">
                <span className="text-sm">{s.icon}</span>
                <span className="text-xs text-white/80 font-medium">{s.label}</span>
                <span className="text-[10px] text-white/40">{s.sub}</span>
              </div>
            ))}
            {/* Personal score pill (if profile loaded) */}
            {personal && (
              <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 border ${
                personal.overallScore >= 75 ? "bg-emerald-500/15 border-emerald-400/30 text-emerald-300"
                : personal.overallScore >= 55 ? "bg-amber-500/15 border-amber-400/30 text-amber-300"
                : "bg-red-500/15 border-red-400/30 text-red-300"}`}>
                <User className="h-3 w-3" />
                <span className="text-xs font-medium">Your score: {personal.overallScore}/100</span>
              </div>
            )}
          </motion.div>

          {/* Tabs */}
          <div className="overflow-x-auto pb-1 mb-5">
            <div className="flex gap-1.5 min-w-max">
              {TABS.map((tab) => (
                <button key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition whitespace-nowrap ${
                    activeTab === tab.id
                      ? tab.id === "personal"
                        ? "bg-gradient-to-r from-purple-500/40 to-cyan-500/20 border border-purple-400/50 text-purple-200"
                        : "bg-gradient-to-r from-amber-500/30 to-orange-500/20 border border-amber-400/40 text-amber-300"
                      : tab.id === "personal"
                        ? "bg-purple-500/10 border border-purple-400/25 text-purple-300/70 hover:text-purple-200 hover:bg-purple-500/20"
                        : "bg-white/5 border border-white/10 text-white/50 hover:text-white/80 hover:bg-white/10"
                  }`}>
                  {tab.id === "personal" && <User className="h-3 w-3 inline mr-1 -mt-0.5" />}
                  <span>{tab.label}</span>
                  <span className="hidden sm:inline text-[10px] opacity-60 ml-1">· {tab.hi}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div key={activeTab}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {activeTab === "personal" && (
                <>
                  {/* Member switcher — shown when user has multiple family members */}
                  {allMembers.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
                      {allMembers.map(m => (
                        <button
                          key={m.id}
                          onClick={() => setSelectedMemberId(m.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition shrink-0 ${
                            m.id === selectedMemberId
                              ? 'bg-purple-500/30 border-purple-400/60 text-purple-200'
                              : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/70'
                          }`}>
                          <User className="h-3 w-3" />
                          <span>{m.name}</span>
                          {m.relationship && m.relationship !== 'self' && (
                            <span className="text-[10px] opacity-60 ml-0.5 capitalize">· {m.relationship}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                  <PersonalTab p={panchang} member={selectedMember} personal={personal} loading={profileLoading} navigate={navigate} />
                </>
              )}
              {activeTab === "overview"  && <OverviewTab p={panchang} />}
              {activeTab === "choghadia" && <ChoghadiaTab p={panchang} />}
              {activeTab === "hora"      && <HoraTab p={panchang} />}
              {activeTab === "lagna"     && <LagnaTab p={panchang} />}
              {activeTab === "chandra"   && <ChandraTabaTab p={panchang} />}
              {activeTab === "graha"     && <GrahaTab p={panchang} permission={backendPermission} onGrant={grantBackendPermission} onDeny={denyBackendPermission} backendStatus={backendStatus} onRetry={retryBackendConnection} />}
            </motion.div>
          </AnimatePresence>

          {/* Footer */}
          <div className="mt-10 text-center text-[10px] text-white/20 flex items-center justify-center gap-2 flex-wrap">
            <span>Calculated for {location.name} ({location.lat.toFixed(2)}°N, {location.lon.toFixed(2)}°E)</span>
            <span>·</span>
            {dataSource === 'swiss-ephemeris' ? (
              <span className="inline-flex items-center gap-1 text-amber-400/70 font-medium">
                <Star className="h-2.5 w-2.5" />
                Swiss Ephemeris · Lahiri ayanamsa
              </span>
            ) : (
              <span>Simplified astronomical formula · Lahiri ayanamsa</span>
            )}
          </div>
        </div>
      </div>
    </CosmicBackground>
  );
}
