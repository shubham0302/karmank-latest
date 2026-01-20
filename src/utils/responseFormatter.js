/**
 * Response Formatter - Converts LLM responses to layman-friendly format
 * Ensures technical terms are explained and responses are accessible
 */

/**
 * Format LLM response for better readability
 * @param {string} response - Raw LLM response
 * @param {string} language - Language preference
 * @returns {string} - Formatted response
 */
export function formatResponse(response, language = 'en') {
  if (!response) return '';

  let formatted = response;

  // Replace technical terms with explanations
  formatted = replaceTechnicalTerms(formatted, language);

  // Add emoji for better engagement (subtle)
  formatted = addContextualEmojis(formatted);

  // Format lists and structure
  formatted = formatStructure(formatted);

  // Clean up formatting
  formatted = cleanFormatting(formatted);

  return formatted;
}

/**
 * Replace technical numerology terms with simple explanations
 */
function replaceTechnicalTerms(text, language) {
  const termReplacements = {
    // Numerology terms
    'Destiny Number': 'Destiny Number (your life purpose)',
    'Basic Number': 'Basic Number (your core personality)',
    'Life Path Number': 'Life Path Number (your soul\'s journey)',
    'Soul Urge': 'Soul Urge (your inner desires)',
    'Expression Number': 'Expression Number (how you show up in the world)',

    // Dasha terms
    'Maha Dasha': 'Maha Dasha (major life period)',
    'Yearly Dasha': 'Yearly Dasha (this year\'s energy)',
    'Monthly Dasha': 'Monthly Dasha (this month\'s influence)',
    'Pratyantara': 'Pratyantara (short-term period)',

    // Yoga terms
    'Kalsarpa Yoga': 'Kalsarpa Yoga (a special planetary pattern)',
    'Rajyoga': 'Rajyoga (combination for success)',
    'Budhaditya Yoga': 'Budhaditya Yoga (intelligence and wisdom combination)',

    // Spiritual terms
    'Rudraksha': 'Rudraksha (sacred healing bead)',
    'Beej Mantra': 'Beej Mantra (seed sound for meditation)',
    'Shakti': 'Shakti (divine feminine energy)',

    // Kundli terms
    'Kundli Grid': 'Kundli Grid (your numerology chart)',
    'Lo Shu Grid': 'Lo Shu Grid (ancient Chinese numerology square)',
  };

  let result = text;

  // Only replace first occurrence of each term to avoid over-explanation
  Object.entries(termReplacements).forEach(([term, replacement]) => {
    const regex = new RegExp(`\\b${term}\\b(?! \\()`, 'i'); // Don't replace if already explained
    result = result.replace(regex, replacement);
  });

  return result;
}

/**
 * Add contextual emojis for better engagement
 */
function addContextualEmojis(text) {
  // Only add if not already present
  if (!text.includes('✨') && !text.includes('🌟')) {
    // Add emoji to section headers
    text = text.replace(/\n(Remedies|Suggestions):/gi, '\n✨ $1:');
    text = text.replace(/\n(Current (Period|Phase|Dasha)):/gi, '\n🔮 $1:');
    text = text.replace(/\n(Strengths|Positive):/gi, '\n💪 $1:');
    text = text.replace(/\n(Challenges|Difficulties):/gi, '\n🌱 $1:');
    text = text.replace(/\n(Future|Upcoming):/gi, '\n🌟 $1:');
  }

  return text;
}

/**
 * Format structure for better readability
 */
function formatStructure(text) {
  let formatted = text;

  // Ensure proper spacing around headers
  formatted = formatted.replace(/\n([A-Z][A-Z\s]+:)/g, '\n\n$1');

  // Format numbered lists
  formatted = formatted.replace(/(\d+)\.\s+/g, '\n$1. ');

  // Format bullet points
  formatted = formatted.replace(/^- /gm, '• ');

  // Remove excessive newlines (max 2)
  formatted = formatted.replace(/\n{3,}/g, '\n\n');

  return formatted;
}

/**
 * Clean up formatting issues
 */
function cleanFormatting(text) {
  return text
    .trim()
    .replace(/\s+$/gm, '') // Remove trailing spaces
    .replace(/^\s+/gm, ''); // Remove leading spaces (except indentation)
}

/**
 * Simplify complex sentences
 * @param {string} response - Response text
 * @returns {string} - Simplified text
 */
export function simplifyLanguage(response) {
  // Replace complex words with simpler alternatives
  const simplifications = {
    'utilize': 'use',
    'commence': 'start',
    'terminate': 'end',
    'facilitate': 'help',
    'manifest': 'show up',
    'alignment': 'being in sync',
    'vibration': 'energy',
    'emanate': 'come from',
    'propitious': 'favorable',
    'inauspicious': 'unfavorable',
    'malefic': 'challenging',
    'benefic': 'positive',
    'ameliorate': 'improve',
    'mitigate': 'reduce',
    'exacerbate': 'worsen',
  };

  let result = response;
  Object.entries(simplifications).forEach(([complex, simple]) => {
    const regex = new RegExp(`\\b${complex}\\b`, 'gi');
    result = result.replace(regex, simple);
  });

  return result;
}

/**
 * Add practical examples to abstract concepts
 * @param {string} response - Response text
 * @returns {string} - Enhanced response with examples
 */
export function addPracticalExamples(response) {
  // This would typically be done by the LLM, but we can enhance
  // specific patterns if they appear without examples

  const patterns = [
    {
      pattern: /you are (creative|artistic)/i,
      example: ' - for example, you might enjoy writing, painting, or finding creative solutions to problems'
    },
    {
      pattern: /you (need|should) (focus on|work on) (balance|harmony)/i,
      example: ' - like finding time for both work and relaxation, or balancing giving to others with self-care'
    },
    {
      pattern: /this (is a|will be a) (good|favorable) time for/i,
      example: ' - meaning the energies support you in this area right now'
    }
  ];

  let result = response;
  patterns.forEach(({ pattern, example }) => {
    if (pattern.test(result) && !result.includes('for example')) {
      result = result.replace(pattern, (match) => match + example);
    }
  });

  return result;
}

/**
 * Format response based on message type
 * @param {string} response - Raw response
 * @param {string} messageType - Type of message (question, greeting, navigation, etc.)
 * @param {string} language - Language preference
 * @returns {string} - Formatted response
 */
export function formatByMessageType(response, messageType, language = 'en') {
  let formatted = formatResponse(response, language);

  switch (messageType) {
    case 'greeting':
      // Keep greetings short and friendly
      return formatted.split('\n\n')[0]; // Just first paragraph

    case 'navigation':
      // Navigation responses should be brief confirmations
      return formatted;

    case 'question':
      // Full formatting for questions
      formatted = simplifyLanguage(formatted);
      formatted = addPracticalExamples(formatted);
      return formatted;

    case 'remedy':
      // Ensure remedies are actionable
      return formatRemedyResponse(formatted);

    default:
      return simplifyLanguage(formatted);
  }
}

/**
 * Special formatting for remedy responses
 */
function formatRemedyResponse(response) {
  // Ensure remedies have clear action items
  let formatted = response;

  // Number the remedies if they aren't already
  if (!formatted.match(/\d+\./)) {
    const lines = formatted.split('\n');
    let counter = 1;
    formatted = lines.map(line => {
      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return `${counter++}. ${line.trim().substring(1).trim()}`;
      }
      return line;
    }).join('\n');
  }

  return formatted;
}

/**
 * Truncate response if too long (for mobile)
 * @param {string} response - Response text
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated response
 */
export function truncateResponse(response, maxLength = 800) {
  if (response.length <= maxLength) {
    return response;
  }

  // Try to truncate at a sentence boundary
  const truncated = response.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('.');
  const lastQuestion = truncated.lastIndexOf('?');
  const lastExclamation = truncated.lastIndexOf('!');

  const lastSentence = Math.max(lastPeriod, lastQuestion, lastExclamation);

  if (lastSentence > maxLength * 0.7) {
    return truncated.substring(0, lastSentence + 1) + '\n\n(Tap to read more...)';
  }

  return truncated + '...\n\n(Tap to read more...)';
}

/**
 * Highlight key insights in the response
 * @param {string} response - Response text
 * @returns {Object} - Response with highlighted sections
 */
export function highlightKeyInsights(response) {
  // Extract key insights (sentences with important keywords)
  const insightKeywords = [
    'important', 'key', 'significant', 'focus on', 'remember',
    'main', 'critical', 'essential', 'primary', 'should'
  ];

  const sentences = response.split(/[.!?]+/);
  const insights = sentences.filter(sentence => {
    return insightKeywords.some(keyword =>
      sentence.toLowerCase().includes(keyword)
    );
  });

  return {
    fullResponse: response,
    keyInsights: insights.slice(0, 3), // Top 3 insights
    hasInsights: insights.length > 0
  };
}

/**
 * Convert response to speech-friendly format (for TTS)
 * @param {string} response - Response text
 * @returns {string} - Speech-friendly text
 */
export function toSpeechFormat(response) {
  return response
    .replace(/\n+/g, '. ') // Convert newlines to pauses
    .replace(/•/g, '') // Remove bullet points
    .replace(/\d+\./g, '') // Remove numbering
    .replace(/[*_~`]/g, '') // Remove markdown formatting
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
}

/**
 * Format error messages in a friendly way
 * @param {Error|string} error - Error object or message
 * @returns {string} - User-friendly error message
 */
export function formatErrorMessage(error) {
  const errorMessage = typeof error === 'string' ? error : error.message;

  const friendlyErrors = {
    'network': '🙏 I\'m having trouble connecting. Please check your internet and try again.',
    'timeout': '⏱️ This is taking longer than expected. Please try again.',
    'auth': '🔐 Please log in again to continue.',
    'not found': '🔍 I couldn\'t find that information. Could you rephrase your question?',
    'rate limit': '⏸️ Please wait a moment before sending another message.',
  };

  for (const [key, message] of Object.entries(friendlyErrors)) {
    if (errorMessage.toLowerCase().includes(key)) {
      return message;
    }
  }

  return '🙏 Something went wrong. Please try again in a moment.';
}

export default {
  formatResponse,
  simplifyLanguage,
  formatByMessageType,
  truncateResponse,
  highlightKeyInsights,
  toSpeechFormat,
  formatErrorMessage
};
