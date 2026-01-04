/**
 * LLM Prompt Engineering System
 * Builds intelligent prompts that help the LLM understand user numerology data
 * and respond in simple, layman language
 */

import { buildComprehensiveContext } from './dataContextBuilder';

/**
 * Build a comprehensive prompt for the LLM
 * @param {Object} params - Parameters for building the prompt
 * @param {string} params.userMessage - The user's question/message
 * @param {Object} params.userContext - User's basic context (name, gender, numbers)
 * @param {Object} params.report - Numerology report
 * @param {Object} params.dashaReport - Dasha report
 * @param {string} params.language - Language preference ('en', 'hi', 'en-hi')
 * @param {string} params.currentTab - Current active tab
 * @param {Array} params.conversationHistory - Previous messages
 * @returns {Object} - Structured prompt for the LLM
 */
export function buildLLMPrompt({
  userMessage,
  userContext,
  report,
  dashaReport,
  language = 'en',
  currentTab = 'Welcome',
  conversationHistory = []
}) {
  // Build comprehensive data context
  const dataContext = buildComprehensiveContext({
    userContext,
    report,
    dashaReport,
    language,
    currentTab
  });

  // Determine user intent and context
  const intent = analyzeUserIntent(userMessage);

  // Build system instructions
  const systemInstructions = buildSystemInstructions(language, intent);

  // Build user data context
  const contextSection = buildContextSection(dataContext, intent);

  // Build conversation context
  const conversationContext = buildConversationContext(conversationHistory);

  // Build examples for few-shot learning
  const examples = buildExamples(intent, language);

  return {
    system: systemInstructions,
    context: contextSection,
    conversationHistory: conversationContext,
    examples: examples,
    userQuestion: userMessage,
    instructions: buildResponseInstructions(intent, language)
  };
}

/**
 * Analyze user intent from their message
 */
function analyzeUserIntent(message) {
  const lowerMessage = message.toLowerCase();

  const intentPatterns = {
    // Specific question about numbers
    numbers: /what (is|does|means?)|tell me about|explain.*number|my (destiny|basic|birth|life path) number/i,

    // Personality and traits
    personality: /personality|character|traits?|strengths?|weaknesses?|who am i|about me/i,

    // Current situation
    current: /current|now|today|this (week|month|year)|right now|present/i,

    // Future predictions
    future: /future|will|when|predict|forecast|upcoming|next|going to/i,

    // Remedies and solutions
    remedies: /remedy|remedies|solution|help|fix|improve|better|heal|mantra|rudraksha/i,

    // Relationships
    relationships: /love|marriage|relationship|partner|spouse|compatibility/i,

    // Career and finance
    career: /career|job|work|business|money|finance|wealth|success/i,

    // Spiritual
    spiritual: /spiritual|meditation|yoga|chakra|enlightenment|divine/i,

    // Life events
    lifeEvents: /child|baby|birth|death|travel|relocation|moving/i,

    // General understanding
    general: /how|why|what|explain|understand|learn|know/i
  };

  const detectedIntents = [];
  for (const [intent, pattern] of Object.entries(intentPatterns)) {
    if (pattern.test(lowerMessage)) {
      detectedIntents.push(intent);
    }
  }

  return {
    primary: detectedIntents[0] || 'general',
    all: detectedIntents,
    isSpecific: detectedIntents.length > 0,
    needsDeepContext: ['personality', 'future', 'remedies', 'current'].includes(detectedIntents[0])
  };
}

/**
 * Build system instructions for the LLM
 */
function buildSystemInstructions(language, intent) {
  const baseInstructions = `You are Ishira, an expert Vedic numerology AI assistant in the KarmAnk app.

YOUR ROLE:
- You have access to the user's complete numerology report with all their numbers, yogas, dashas, traits, and forecasts
- Your job is to answer questions about their numerology in simple, easy-to-understand language
- You are wise, compassionate, and helpful - like a trusted spiritual guide

COMMUNICATION STYLE:
- Use SIMPLE, LAYMAN language - avoid technical jargon
- Explain concepts like you're talking to a friend, not a scholar
- When you must use a numerology term, ALWAYS explain it in simple words
- Be warm and encouraging, not cold or robotic
- Use analogies and examples from everyday life
- Keep responses concise but complete (2-4 paragraphs ideal)

IMPORTANT RULES:
1. ALWAYS base your answers on the actual data provided in the context
2. DO NOT make up information - if something isn't in the context, say "I don't have that information"
3. DO NOT use numerology jargon without explaining it
4. DO NOT give medical, legal, or financial advice - stick to numerology insights
5. If asked about navigation ("show me", "take me to"), respond with a navigation action

LANGUAGE:
${language === 'hi' ? '- Respond in Hindi (Devanagari script)' : language === 'en-hi' ? '- Respond in Romanized Hindi (English alphabet)' : '- Respond in English'}

TONE:
- Positive and uplifting
- Practical and actionable
- Respectful of the user's journey
- Encouraging personal growth`;

  // Add intent-specific instructions
  if (intent.primary === 'remedies') {
    return baseInstructions + `\n\nFOR THIS QUERY:
- Focus on practical remedies the user can actually implement
- Explain WHY each remedy works (in simple terms)
- Prioritize the most important 2-3 remedies, not a long list`;
  }

  if (intent.primary === 'future') {
    return baseInstructions + `\n\nFOR THIS QUERY:
- Base predictions on dasha periods and forecasts in the data
- Explain what influences are active and what they mean
- Balance optimism with realism
- Always mention that free will plays a role`;
  }

  if (intent.primary === 'current') {
    return baseInstructions + `\n\nFOR THIS QUERY:
- Focus on current dasha periods (Maha, Yearly, Monthly, Daily)
- Explain what energies are active NOW
- Give practical advice for navigating the current period`;
  }

  return baseInstructions;
}

/**
 * Build context section with relevant user data
 */
function buildContextSection(dataContext, intent) {
  let contextText = `USER PROFILE:
Name: ${dataContext.user.name}
Gender: ${dataContext.user.gender}
Date of Birth: ${dataContext.user.dob}
Destiny Number: ${dataContext.user.destinyNumber} - ${dataContext.coreNumbers?.destiny?.meaning || 'Not available'}
Basic Number: ${dataContext.user.basicNumber} - ${dataContext.coreNumbers?.basic?.meaning || 'Not available'}

`;

  // Add relevant sections based on intent
  if (intent.needsDeepContext || intent.primary === 'personality') {
    // Add personality traits
    if (dataContext.traits?.coreTraits) {
      contextText += `PERSONALITY TRAITS:\n${dataContext.traits.coreTraits}\n\n`;
    }
    if (dataContext.traits?.strengths) {
      contextText += `Strengths: ${dataContext.traits.strengths}\n`;
    }
    if (dataContext.traits?.challenges) {
      contextText += `Challenges: ${dataContext.traits.challenges}\n\n`;
    }
  }

  if (intent.primary === 'current' || intent.primary === 'future') {
    // Add current dasha information
    if (dataContext.dashas?.current?.maha) {
      const maha = dataContext.dashas.current.maha;
      contextText += `CURRENT MAHA DASHA:
Planet/Number: ${maha.planet}
Period: ${maha.startDate} to ${maha.endDate}
Influence: ${maha.influence}

`;
    }

    if (dataContext.dashas?.current?.yearly) {
      const yearly = dataContext.dashas.current.yearly;
      contextText += `CURRENT YEARLY DASHA:
Planet/Number: ${yearly.planet}
Period: ${yearly.startDate} to ${yearly.endDate}

`;
    }
  }

  if (intent.primary === 'remedies') {
    // Add remedy information
    if (dataContext.remedies?.rudraksha?.length > 0) {
      contextText += `RECOMMENDED RUDRAKSHA:\n`;
      dataContext.remedies.rudraksha.slice(0, 3).forEach(r => {
        contextText += `- ${r.mukhi} Mukhi: ${r.benefit}\n`;
      });
      contextText += '\n';
    }

    if (dataContext.remedies?.mantras?.length > 0) {
      contextText += `RECOMMENDED MANTRAS:\n`;
      dataContext.remedies.mantras.slice(0, 2).forEach(m => {
        contextText += `- ${m.mantra}: ${m.purpose}\n`;
      });
      contextText += '\n';
    }
  }

  if (intent.all.includes('relationships') || intent.all.includes('career')) {
    // Add forecast information
    if (intent.all.includes('relationships') && dataContext.forecasts?.relationships) {
      contextText += `RELATIONSHIP FORECAST:\n${dataContext.forecasts.relationships}\n\n`;
    }
    if (intent.all.includes('career') && dataContext.forecasts?.career) {
      contextText += `CAREER FORECAST:\n${dataContext.forecasts.career}\n\n`;
    }
  }

  // Add yogas if relevant
  if (dataContext.yogas && dataContext.yogas.length > 0 && intent.needsDeepContext) {
    contextText += `ACTIVE YOGAS (Special Combinations):\n`;
    dataContext.yogas.slice(0, 3).forEach(yoga => {
      contextText += `- ${yoga.name}: ${yoga.description}\n`;
    });
    contextText += '\n';
  }

  // Add kundli analysis for deep queries
  if (intent.needsDeepContext && dataContext.kundliAnalysis) {
    if (dataContext.kundliAnalysis.strongNumbers?.length > 0) {
      contextText += `STRONG NUMBERS IN CHART: ${dataContext.kundliAnalysis.strongNumbers.map(n => n.number).join(', ')}\n`;
    }
    if (dataContext.kundliAnalysis.absentNumbers?.length > 0) {
      contextText += `ABSENT NUMBERS: ${dataContext.kundliAnalysis.absentNumbers.join(', ')}\n\n`;
    }
  }

  return contextText;
}

/**
 * Build conversation context from history
 */
function buildConversationContext(history) {
  if (!history || history.length === 0) {
    return 'This is the first message in the conversation.';
  }

  // Include last 5 messages for context
  const recentMessages = history.slice(-5);
  let contextText = 'RECENT CONVERSATION:\n';

  recentMessages.forEach(msg => {
    const role = msg.role === 'user' ? 'User' : 'Ishira';
    contextText += `${role}: ${msg.content}\n`;
  });

  return contextText;
}

/**
 * Build few-shot examples to guide the LLM
 */
function buildExamples(intent, language) {
  const examples = {
    en: {
      personality: [
        {
          user: "What does my destiny number 3 mean?",
          assistant: "Your Destiny Number 3 represents creativity and self-expression! Think of it like this - you're naturally talented at communicating ideas and bringing joy to others. Number 3 people are often the 'artists' of numerology - whether that's through actual art, writing, speaking, or just having a colorful personality. You're here to express yourself authentically and inspire others through your unique voice."
        }
      ],
      current: [
        {
          user: "What's happening in my life right now?",
          assistant: "Right now, you're in Dasha 6, which runs until December 2026. Dasha 6 is all about love, family, and responsibility - like the universe is asking you to focus on the people who matter most. You might find yourself taking care of others more, or feeling drawn to create harmony in your relationships. This is a beautiful time for deepening connections and finding balance between giving and receiving."
        }
      ],
      remedies: [
        {
          user: "How can I improve my situation?",
          assistant: "Based on your chart, I'd recommend starting with these three things:\n\n1. Wear a 5 Mukhi Rudraksha - it helps calm the mind and bring mental clarity (like having a peaceful anchor in a busy day)\n\n2. Chant 'Om Namah Shivaya' - even just 11 times in the morning can help align your energy\n\n3. Spend time near water on Fridays - this balances the Moon's influence in your chart\n\nStart with just one of these and see how you feel. Small, consistent steps work better than trying everything at once!"
        }
      ]
    }
  };

  const langExamples = examples[language === 'hi' || language === 'en-hi' ? 'en' : language] || examples.en;
  return langExamples[intent.primary] || langExamples.personality || [];
}

/**
 * Build response instructions
 */
function buildResponseInstructions(intent, language) {
  let instructions = `RESPONSE FORMAT:
- Start with a warm acknowledgment of their question
- Provide 2-4 paragraphs of clear, simple explanation
- Use bullet points if listing multiple items
- End with encouragement or a practical next step
- NO numerology jargon without explanation
- NO overly long responses (keep it conversational)`;

  if (intent.primary === 'remedies') {
    instructions += `\n\nFOR REMEDIES:
- List no more than 3 remedies
- Explain WHY each one works (in simple terms)
- Make them actionable and specific`;
  }

  return instructions;
}

/**
 * Format the complete prompt for the backend API
 */
export function formatPromptForAPI(promptObject) {
  return {
    systemPrompt: promptObject.system,
    context: promptObject.context,
    conversationHistory: promptObject.conversationHistory,
    examples: promptObject.examples,
    userMessage: promptObject.userQuestion,
    instructions: promptObject.instructions
  };
}

/**
 * Build a simple prompt for quick queries (fallback)
 */
export function buildSimplePrompt(userMessage, userContext, language = 'en') {
  return {
    system: `You are Ishira, a friendly Vedic numerology assistant. Respond in simple, layman language.`,
    context: `User: ${userContext.name}, Destiny: ${userContext.destinyNumber}, Basic: ${userContext.basicNumber}`,
    userQuestion: userMessage,
    language: language
  };
}

export default {
  buildLLMPrompt,
  formatPromptForAPI,
  buildSimplePrompt
};
