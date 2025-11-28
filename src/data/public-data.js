// Public Data - Safe UI Labels and Non-Sensitive Information
// This file contains ONLY safe, non-proprietary data that can be exposed in frontend
// All interpretations, meanings, and proprietary content are now on the backend

/**
 * Number labels (planet names) - Safe to expose
 * These are just names, not interpretations
 */
export const numberLabels = {
  1: { en: "Surya (Sun)", hi: "सूर्य (सूरज)", "en-hi": "Surya (Sun)" },
  2: { en: "Chandra (Moon)", hi: "चन्द्र (चाँद)", "en-hi": "Chandra (Moon)" },
  3: { en: "Guru (Jupiter)", hi: "गुरु (बृहस्पति)", "en-hi": "Guru (Jupiter)" },
  4: { en: "Rahu (North Node)", hi: "राहु (उत्तर नोड)", "en-hi": "Rahu (North Node)" },
  5: { en: "Budh (Mercury)", hi: "बुध (बुध ग्रह)", "en-hi": "Budh (Mercury)" },
  6: { en: "Shukra (Venus)", hi: "शुक्र (शुक्र ग्रह)", "en-hi": "Shukra (Venus)" },
  7: { en: "Ketu (South Node)", hi: "केतु (दक्षिण नोड)", "en-hi": "Ketu (South Node)" },
  8: { en: "Shani (Saturn)", hi: "शनि (शनि ग्रह)", "en-hi": "Shani (Saturn)" },
  9: { en: "Mangal (Mars)", hi: "मंगल (मंगल ग्रह)", "en-hi": "Mangal (Mars)" }
};

/**
 * UI text labels - Safe to expose
 * Just navigation and category labels
 */
export const uiText = {
  basicNumber: { en: "Basic Number", hi: "मूल संख्या", "en-hi": "Basic Number" },
  destinyNumber: { en: "Destiny Number", hi: "भाग्य संख्या", "en-hi": "Destiny Number" },
  kundliGrid: { en: "Kundli Grid", hi: "कुंडली ग्रिड", "en-hi": "Kundli Grid" },
  yogas: { en: "Yogas", hi: "योग", "en-hi": "Yogas" },
  remedies: { en: "Remedies", hi: "उपाय", "en-hi": "Remedies" },
  dasha: { en: "Dasha", hi: "दशा", "en-hi": "Dasha" },
  compatibility: { en: "Compatibility", hi: "संगतता", "en-hi": "Compatibility" },
  education: { en: "Education", hi: "शिक्षा", "en-hi": "Education" },
  career: { en: "Career", hi: "करियर", "en-hi": "Career" }
};

/**
 * Destiny archetypes (titles only) - Safe to expose
 * Just the role names, not the detailed descriptions
 */
export const destinyArchetypes = {
  1: { en: "The Leader", hi: "नेता", "en-hi": "The Leader" },
  2: { en: "The Artist", hi: "कलाकार", "en-hi": "The Artist" },
  3: { en: "The Sage", hi: "ज्ञानी", "en-hi": "The Sage" },
  4: { en: "The Maverick", hi: "अनोखा", "en-hi": "The Maverick" },
  5: { en: "The Entrepreneur", hi: "उद्यमी", "en-hi": "The Entrepreneur" },
  6: { en: "The Charmer", hi: "मोहक", "en-hi": "The Charmer" },
  7: { en: "The Thinker", hi: "विचारक", "en-hi": "The Thinker" },
  8: { en: "The Worker", hi: "कर्मठ", "en-hi": "The Worker" },
  9: { en: "The Warrior", hi: "योद्धा", "en-hi": "The Warrior" }
};

/**
 * Helper function to get text in specified language
 * Same as the helper in utils but kept here for independence
 */
export function getText(obj, lang = 'en') {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang] || obj.en || '';
}
