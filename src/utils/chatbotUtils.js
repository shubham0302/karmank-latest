/**
 * Chatbot Utilities - World-Class Intelligence Layer
 * Provides context-aware responses, smart suggestions, and navigation
 */

import { TABS, TAB_INFO, NAVIGATION_FLOWS } from '../constants/tabs';

/**
 * Analyze user message for intent detection
 * @param {string} message - User's message
 * @returns {Object} Detected intent with confidence and entities
 */
export function analyzeIntent(message) {
  const lowerMessage = message.toLowerCase();

  // Intent patterns
  const intents = {
    navigation: {
      patterns: [
        /show me (.*)/i,
        /take me to (.*)/i,
        /go to (.*)/i,
        /open (.*)/i,
        /navigate to (.*)/i,
        /i want to see (.*)/i
      ],
      confidence: 0
    },
    question: {
      patterns: [
        /what is my (.*)/i,
        /tell me about (.*)/i,
        /how (.*)/i,
        /why (.*)/i,
        /when (.*)/i,
        /can you explain (.*)/i
      ],
      confidence: 0
    },
    remedies: {
      patterns: [
        /remedy/i,
        /rudraksha/i,
        /mantra/i,
        /chakra/i,
        /healing/i,
        /solution/i
      ],
      confidence: 0
    },
    forecast: {
      patterns: [
        /future/i,
        /prediction/i,
        /marriage/i,
        /career/i,
        /love/i,
        /relationship/i,
        /child/i
      ],
      confidence: 0
    },
    dasha: {
      patterns: [
        /dasha/i,
        /period/i,
        /planetary/i,
        /current phase/i,
        /cosmic cycle/i
      ],
      confidence: 0
    },
    traits: {
      patterns: [
        /personality/i,
        /characteristics/i,
        /traits/i,
        /strengths/i,
        /weaknesses/i
      ],
      confidence: 0
    }
  };

  // Calculate confidence for each intent
  Object.keys(intents).forEach(intentName => {
    const intent = intents[intentName];
    intent.patterns.forEach(pattern => {
      if (pattern.test(lowerMessage)) {
        intent.confidence += 1;
      }
    });
  });

  // Find highest confidence intent
  const detectedIntent = Object.keys(intents).reduce((max, key) =>
    intents[key].confidence > intents[max].confidence ? key : max
  , 'question');

  return {
    primary: detectedIntent,
    confidence: intents[detectedIntent].confidence,
    allIntents: intents
  };
}

/**
 * Extract entities (numbers, dates, names) from message
 * @param {string} message - User's message
 * @returns {Object} Extracted entities
 */
export function extractEntities(message) {
  const entities = {
    numbers: [],
    dates: [],
    tabs: []
  };

  // Extract numbers
  const numberMatches = message.match(/\b\d+\b/g);
  if (numberMatches) {
    entities.numbers = numberMatches.map(n => parseInt(n));
  }

  // Extract tab mentions
  Object.values(TABS).forEach(tab => {
    if (message.toLowerCase().includes(tab.toLowerCase())) {
      entities.tabs.push(tab);
    }
  });

  return entities;
}

/**
 * Generate smart suggestions based on context
 * @param {Object} userContext - User's numerology context
 * @param {Object} report - Current report
 * @param {string} currentTab - Current active tab
 * @returns {Array} Array of suggestion objects
 */
export function generateSmartSuggestions(userContext, report, currentTab) {
  const suggestions = [];

  // Context-aware suggestions
  if (currentTab === TABS.WELCOME) {
    suggestions.push(
      {
        text: "What are my personality traits?",
        icon: "✨",
        action: { type: 'navigate', target: TABS.TRAITS }
      },
      {
        text: "Show me my current dasha period",
        icon: "🔮",
        action: { type: 'navigate', target: TABS.DASHA }
      },
      {
        text: "What remedies should I follow?",
        icon: "🕉️",
        action: { type: 'navigate', target: TABS.REMEDIES }
      }
    );
  }

  if (currentTab === TABS.TRAITS) {
    suggestions.push(
      {
        text: "How can I improve these traits?",
        icon: "🌱",
        action: { type: 'navigate', target: TABS.REMEDIES }
      },
      {
        text: "When will these traits manifest?",
        icon: "⏰",
        action: { type: 'navigate', target: TABS.DASHA }
      }
    );
  }

  if (currentTab === TABS.FORECAST) {
    suggestions.push(
      {
        text: "What remedies can help?",
        icon: "🕉️",
        action: { type: 'navigate', target: TABS.REMEDIES }
      },
      {
        text: "Show my life cycles",
        icon: "♾️",
        action: { type: 'navigate', target: TABS.LIFECYCLE }
      }
    );
  }

  // Dasha-specific suggestions
  if (report?.dashaReport?.mahaDashaTimeline?.[0]) {
    const currentDasha = report.dashaReport.mahaDashaTimeline[0];
    suggestions.push({
      text: `Tell me about Dasha ${currentDasha.planet}`,
      icon: "🌟",
      action: { type: 'question', query: `What does Dasha ${currentDasha.planet} mean for me?` }
    });
  }

  return suggestions.slice(0, 4); // Return max 4 suggestions
}

/**
 * Determine which tab to navigate to based on intent
 * @param {Object} intent - Detected intent
 * @param {Object} entities - Extracted entities
 * @returns {string|null} Tab name or null
 */
export function getTabFromIntent(intent, entities) {
  // If specific tab mentioned, use it
  if (entities.tabs.length > 0) {
    return entities.tabs[0];
  }

  // Map intent to tab
  const intentTabMap = {
    remedies: TABS.REMEDIES,
    forecast: TABS.FORECAST,
    dasha: TABS.DASHA,
    traits: TABS.TRAITS,
    lifecycle: TABS.LIFECYCLE
  };

  return intentTabMap[intent.primary] || null;
}

/**
 * Generate contextual response based on user data
 * @param {Object} userContext - User's numerology data
 * @param {string} query - User's question
 * @returns {string} Contextual response
 */
export function generateContextualResponse(userContext, query) {
  const lowerQuery = query.toLowerCase();

  // Destiny number specific responses
  if (lowerQuery.includes('destiny')) {
    return `Your destiny number is ${userContext.destinyNumber}, which represents ${getDestinyNumberMeaning(userContext.destinyNumber)}. Would you like to know more about how this influences your life?`;
  }

  // Basic number specific responses
  if (lowerQuery.includes('basic number') || lowerQuery.includes('birth number')) {
    return `Your basic number is ${userContext.basicNumber}, which shapes your personality and approach to life. This influences your daily decisions and natural tendencies.`;
  }

  // Dasha period responses
  if (lowerQuery.includes('current') && (lowerQuery.includes('period') || lowerQuery.includes('dasha'))) {
    if (userContext.currentDasha) {
      return `You're currently in Dasha ${userContext.currentDasha} period. This influences your life experiences and opportunities. Shall I show you the Advanced Dasha tab for detailed insights?`;
    }
  }

  return null; // Return null if no specific response
}

/**
 * Get destiny number meaning (simplified)
 */
function getDestinyNumberMeaning(number) {
  const meanings = {
    1: 'leadership, independence, and innovation',
    2: 'harmony, cooperation, and sensitivity',
    3: 'creativity, expression, and joy',
    4: 'stability, discipline, and hard work',
    5: 'freedom, adventure, and versatility',
    6: 'love, responsibility, and nurturing',
    7: 'wisdom, spirituality, and introspection',
    8: 'power, success, and material abundance',
    9: 'completion, compassion, and universal love'
  };
  return meanings[number] || 'unique cosmic influence';
}

/**
 * Validate and sanitize user message
 * @param {string} message - User input
 * @returns {Object} Validation result
 */
export function validateUserMessage(message) {
  if (!message || typeof message !== 'string') {
    return { valid: false, error: 'Message must be a string' };
  }

  const trimmed = message.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: 'Message cannot be empty' };
  }

  if (trimmed.length > 1000) {
    return { valid: false, error: 'Message too long (max 1000 characters)' };
  }

  // Check for malicious patterns
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+=/i, // Event handlers like onclick=
    /eval\(/i,
    /<iframe/i
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(trimmed)) {
      return { valid: false, error: 'Invalid message content' };
    }
  }

  return { valid: true, message: trimmed };
}

/**
 * Format conversation for export
 * @param {Array} messages - Conversation history
 * @param {Object} userContext - User context
 * @returns {string} Formatted text
 */
export function formatConversationForExport(messages, userContext) {
  let output = `KarmAnk AI Conversation\n`;
  output += `=======================\n\n`;
  output += `User: ${userContext.name}\n`;
  output += `Destiny Number: ${userContext.destinyNumber}\n`;
  output += `Basic Number: ${userContext.basicNumber}\n`;
  output += `Date: ${new Date().toLocaleDateString()}\n\n`;
  output += `Conversation:\n`;
  output += `-------------\n\n`;

  messages.forEach((msg, idx) => {
    const role = msg.role === 'user' ? 'You' : 'Ishira';
    const time = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : '';
    output += `[${time}] ${role}: ${msg.content}\n\n`;
  });

  return output;
}

/**
 * Calculate conversation quality score
 * @param {Array} messages - Conversation history
 * @returns {Object} Quality metrics
 */
export function calculateConversationQuality(messages) {
  const userMessages = messages.filter(m => m.role === 'user');
  const botMessages = messages.filter(m => m.role === 'assistant');

  return {
    totalMessages: messages.length,
    userEngagement: userMessages.length,
    averageUserMessageLength: userMessages.reduce((sum, m) => sum + m.content.length, 0) / userMessages.length || 0,
    averageBotMessageLength: botMessages.reduce((sum, m) => sum + m.content.length, 0) / botMessages.length || 0,
    conversationDepth: Math.min(messages.length / 10, 1), // 0-1 scale
    lastActivity: messages[messages.length - 1]?.timestamp || Date.now()
  };
}
