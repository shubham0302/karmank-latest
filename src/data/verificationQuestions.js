/**
 * Nadi Shastra Verification Questions
 * Traditional questions used to confirm the correct palm leaf
 * These are asked after thumbprint classification to narrow down the exact leaf
 */

export const VERIFICATION_QUESTIONS = [
  // Father's Name Questions
  {
    id: 1,
    category: 'father_name',
    text: {
      en: "Does your father's name start with one of these letters: S, K, or R?",
      hi: "क्या आपके पिता का नाम S, K, या R से शुरू होता है?"
    }
  },
  {
    id: 2,
    category: 'father_name',
    text: {
      en: "Does your father's name start with A, M, or V?",
      hi: "क्या आपके पिता का नाम A, M, या V से शुरू होता है?"
    }
  },
  {
    id: 3,
    category: 'father_name',
    text: {
      en: "Does your father's name start with P, D, or G?",
      hi: "क्या आपके पिता का नाम P, D, या G से शुरू होता है?"
    }
  },

  // Mother's Name Questions
  {
    id: 4,
    category: 'mother_name',
    text: {
      en: "Does your mother's name start with L, S, or P?",
      hi: "क्या आपकी माता का नाम L, S, या P से शुरू होता है?"
    }
  },
  {
    id: 5,
    category: 'mother_name',
    text: {
      en: "Does your mother's name start with A, R, or K?",
      hi: "क्या आपकी माता का नाम A, R, या K से शुरू होता है?"
    }
  },

  // Birth Day Questions
  {
    id: 6,
    category: 'birth_day',
    text: {
      en: "Were you born on a Tuesday, Thursday, or Saturday?",
      hi: "क्या आपका जन्म मंगलवार, गुरुवार या शनिवार को हुआ था?"
    }
  },
  {
    id: 7,
    category: 'birth_day',
    text: {
      en: "Were you born on a Sunday, Monday, or Wednesday?",
      hi: "क्या आपका जन्म रविवार, सोमवार या बुधवार को हुआ था?"
    }
  },
  {
    id: 8,
    category: 'birth_day',
    text: {
      en: "Were you born on a Friday or during the weekend?",
      hi: "क्या आपका जन्म शुक्रवार को या सप्ताहांत में हुआ था?"
    }
  },

  // Siblings Questions
  {
    id: 9,
    category: 'siblings',
    text: {
      en: "Do you have 1 or 2 siblings?",
      hi: "क्या आपके 1 या 2 भाई-बहन हैं?"
    }
  },
  {
    id: 10,
    category: 'siblings',
    text: {
      en: "Do you have 3 or more siblings?",
      hi: "क्या आपके 3 या अधिक भाई-बहन हैं?"
    }
  },
  {
    id: 11,
    category: 'siblings',
    text: {
      en: "Are you the eldest child in your family?",
      hi: "क्या आप अपने परिवार में सबसे बड़े हैं?"
    }
  },

  // Marital Status
  {
    id: 12,
    category: 'marital_status',
    text: {
      en: "Are you currently married?",
      hi: "क्या आप वर्तमान में विवाहित हैं?"
    }
  },
  {
    id: 13,
    category: 'marital_status',
    text: {
      en: "Are you currently single or unmarried?",
      hi: "क्या आप वर्तमान में अविवाहित हैं?"
    }
  },

  // Children Questions
  {
    id: 14,
    category: 'children',
    text: {
      en: "Do you have children?",
      hi: "क्या आपके बच्चे हैं?"
    }
  },
  {
    id: 15,
    category: 'children',
    text: {
      en: "Do you have 1 or 2 children?",
      hi: "क्या आपके 1 या 2 बच्चे हैं?"
    }
  },

  // Profession/Career
  {
    id: 16,
    category: 'profession',
    text: {
      en: "Is your profession related to business or trade?",
      hi: "क्या आपका पेशा व्यापार या व्यवसाय से संबंधित है?"
    }
  },
  {
    id: 17,
    category: 'profession',
    text: {
      en: "Do you work in education, government, or a professional service?",
      hi: "क्या आप शिक्षा, सरकारी या पेशेवर सेवा में काम करते हैं?"
    }
  },
  {
    id: 18,
    category: 'profession',
    text: {
      en: "Are you self-employed or an entrepreneur?",
      hi: "क्या आप स्व-नियोजित या उद्यमी हैं?"
    }
  },
  {
    id: 19,
    category: 'profession',
    text: {
      en: "Do you work in technology, medicine, or engineering?",
      hi: "क्या आप प्रौद्योगिकी, चिकित्सा या इंजीनियरिंग में काम करते हैं?"
    }
  },

  // Location/Birth Place
  {
    id: 20,
    category: 'birth_location',
    text: {
      en: "Were you born in a city or urban area?",
      hi: "क्या आपका जन्म शहर या शहरी क्षेत्र में हुआ था?"
    }
  },
  {
    id: 21,
    category: 'birth_location',
    text: {
      en: "Were you born in a village or rural area?",
      hi: "क्या आपका जन्म गांव या ग्रामीण क्षेत्र में हुआ था?"
    }
  },
  {
    id: 22,
    category: 'birth_location',
    text: {
      en: "Were you born in the northern or eastern part of your country?",
      hi: "क्या आपका जन्म अपने देश के उत्तरी या पूर्वी भाग में हुआ था?"
    }
  },

  // Education
  {
    id: 23,
    category: 'education',
    text: {
      en: "Have you completed higher education (graduation or above)?",
      hi: "क्या आपने उच्च शिक्षा (स्नातक या उससे ऊपर) पूरी की है?"
    }
  },
  {
    id: 24,
    category: 'education',
    text: {
      en: "Did you study science or mathematics in your education?",
      hi: "क्या आपने अपनी शिक्षा में विज्ञान या गणित का अध्ययन किया?"
    }
  },

  // Health/Physical Attributes
  {
    id: 25,
    category: 'health',
    text: {
      en: "Do you have any birthmarks or moles on your face or neck?",
      hi: "क्या आपके चेहरे या गर्दन पर कोई जन्म चिह्न या तिल है?"
    }
  },
  {
    id: 26,
    category: 'health',
    text: {
      en: "Have you experienced any major health challenges in your life?",
      hi: "क्या आपने अपने जीवन में कोई बड़ी स्वास्थ्य चुनौती का अनुभव किया है?"
    }
  },

  // Family Property
  {
    id: 27,
    category: 'property',
    text: {
      en: "Does your family own land or property?",
      hi: "क्या आपके परिवार के पास जमीन या संपत्ति है?"
    }
  },
  {
    id: 28,
    category: 'property',
    text: {
      en: "Do you currently live in your own house?",
      hi: "क्या आप वर्तमान में अपने खुद के घर में रहते हैं?"
    }
  },

  // Spiritual/Religious
  {
    id: 29,
    category: 'spiritual',
    text: {
      en: "Do you regularly visit temples or perform spiritual practices?",
      hi: "क्या आप नियमित रूप से मंदिर जाते हैं या आध्यात्मिक अभ्यास करते हैं?"
    }
  },
  {
    id: 30,
    category: 'spiritual',
    text: {
      en: "Have you experienced any significant spiritual or religious events?",
      hi: "क्या आपने कोई महत्वपूर्ण आध्यात्मिक या धार्मिक घटना का अनुभव किया है?"
    }
  },

  // Life Events
  {
    id: 31,
    category: 'life_events',
    text: {
      en: "Have you changed your city or country of residence?",
      hi: "क्या आपने अपना शहर या निवास का देश बदला है?"
    }
  },
  {
    id: 32,
    category: 'life_events',
    text: {
      en: "Have you experienced a major career change or job switch?",
      hi: "क्या आपने किसी बड़े करियर परिवर्तन या नौकरी बदलाव का अनुभव किया है?"
    }
  },

  // Age-related
  {
    id: 33,
    category: 'age',
    text: {
      en: "Are you below 30 years of age?",
      hi: "क्या आपकी आयु 30 वर्ष से कम है?"
    }
  },
  {
    id: 34,
    category: 'age',
    text: {
      en: "Are you between 30 and 45 years of age?",
      hi: "क्या आपकी आयु 30 से 45 वर्ष के बीच है?"
    }
  },

  // Financial Status
  {
    id: 35,
    category: 'financial',
    text: {
      en: "Have you experienced financial difficulties or losses?",
      hi: "क्या आपने वित्तीय कठिनाइयों या नुकसान का अनुभव किया है?"
    }
  },
  {
    id: 36,
    category: 'financial',
    text: {
      en: "Have you received unexpected wealth or financial gains?",
      hi: "क्या आपको अप्रत्याशित धन या वित्तीय लाभ मिला है?"
    }
  }
];

/**
 * Generate deterministic verification questions based on user data
 * This ensures the same user always gets the same questions
 */
export function generateVerificationQuestions(palmImageHash, thumbImageHash, userInfo) {
  // Create a deterministic seed from the inputs
  const seed = hashString(palmImageHash + thumbImageHash + userInfo.gender + userInfo.ageRange);

  // Shuffle questions deterministically
  const shuffled = deterministicShuffle([...VERIFICATION_QUESTIONS], seed);

  // Select 7 questions from different categories
  const selected = [];
  const usedCategories = new Set();

  for (const question of shuffled) {
    if (selected.length >= 7) break;

    // Try to use each category only once for variety
    if (!usedCategories.has(question.category) || selected.length >= 5) {
      selected.push(question);
      usedCategories.add(question.category);
    }
  }

  return selected;
}

/**
 * Generate bundle and leaf numbers deterministically
 */
export function generateBundleAndLeaf(palmImageHash, thumbImageHash) {
  // SIMPLIFIED: Return static bundle info to avoid confusion
  // The detailed Nadi analysis is provided by the AI, not by bundle/leaf numbers
  return {
    bundleNumber: 1,
    leafNumber: 1,
    rishi: 'Traditional Nadi',
    totalLeaves: 1
  };
}

/**
 * Simple string hash function (djb2 algorithm)
 */
function hashString(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Deterministic shuffle using seed
 */
function deterministicShuffle(array, seed) {
  const arr = [...array];
  let currentSeed = seed;

  for (let i = arr.length - 1; i > 0; i--) {
    // Generate pseudo-random number from seed
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    const randomIndex = Math.floor((currentSeed / 233280) * (i + 1));

    // Swap elements
    [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
  }

  return arr;
}

/**
 * Calculate confidence score based on answers
 */
export function calculateConfidence(questionsAnswered, totalQuestions) {
  // Start at 45%, increase by ~8% per question
  const baseConfidence = 45;
  const increasePerQuestion = 8;
  const noise = (questionsAnswered * 3) % 5; // Add slight variation

  return Math.min(99, baseConfidence + (questionsAnswered * increasePerQuestion) + noise);
}
