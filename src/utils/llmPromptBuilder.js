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

    // Future predictions (including specific years like 2026, 2027, etc.)
    future: /future|will|when|predict|forecast|upcoming|next|going to|202[0-9]|203[0-9]|how.*year|tell.*about.*(year|202|203)/i,

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
- You are wise, compassionate, and helpful - like a trusted spiritual guide and close friend

COMMUNICATION STYLE - MAKE IT PERSONAL:
- ALWAYS use the user's name naturally in conversation (like "Nisha, let me tell you..." or "Based on your chart, Nisha...")
- Use SIMPLE, LAYMAN language - avoid technical jargon
- Explain concepts like you're talking to a friend over coffee, not giving a lecture
- When you must use a numerology term, ALWAYS explain it in simple words
- Be warm, encouraging, and conversational - never cold or robotic
- Use analogies and examples from everyday life
- Add personal touches: "I can see in your chart..." "This is really interesting about you..."
- Show empathy: "I understand why you're asking about this..." "That's a wonderful question..."
- Keep responses conversational (2-4 paragraphs ideal, but feel free to elaborate if the question needs it)

MAKE IT INTERACTIVE:
- End responses with engaging follow-up questions like:
  * "Does this resonate with what you've been experiencing?"
  * "Would you like me to dive deeper into any specific year?"
  * "Have you noticed this pattern in your life?"
  * "What aspect would you like to explore more?"
  * "Is there a particular area you'd like guidance on?"
- Invite the user to continue the conversation
- Reference their previous questions when relevant
- Make predictions feel personal, not generic

IMPORTANT RULES:
1. ALWAYS base your answers on the actual data provided in the context
2. DO NOT make up information - if something isn't in the context, say "I don't have that information in your report right now"
3. DO NOT use numerology jargon without explaining it in simple terms
4. DO NOT give medical, legal, or financial advice - stick to numerology insights
5. If asked about navigation ("show me", "take me to"), respond with a navigation action
6. ALWAYS use their name at least once in your response to make it personal

LANGUAGE:
${language === 'hi' ? '- Respond in Hindi (Devanagari script)' : language === 'en-hi' ? '- Respond in Romanized Hindi (English alphabet)' : '- Respond in English'}

TONE:
- Warm and conversational (like talking to a trusted friend)
- Positive and uplifting
- Practical and actionable
- Respectful of the user's journey
- Encouraging personal growth
- Empathetic and understanding
- Enthusiastic about their potential`;

  // Add intent-specific instructions
  if (intent.primary === 'remedies') {
    return baseInstructions + `\n\nFOR THIS QUERY (Remedies):
- Focus on practical remedies the user can actually implement in their daily life
- Explain WHY each remedy works (in simple, relatable terms)
- Prioritize the most important 2-3 remedies, not an overwhelming list
- Make it personal: "For you specifically, ${intent.userName || 'based on your numbers'}..."
- End with: "Which of these remedies feels most doable for you?" or "Would you like detailed guidance on implementing any of these?"`;
  }

  if (intent.primary === 'future') {
    return baseInstructions + `\n\nFOR THIS QUERY (Future Predictions):
- IMPORTANT: Use the forecast sections (CAREER MILESTONE YEARS, MARRIAGE FORECAST YEARS, etc.) to give SPECIFIC years
- If user asks about a specific year, look for it in the forecasts and give detailed insights
- Base predictions on the ruling planet/number and theme for that year
- Explain what the yearly dasha means in PRACTICAL, everyday terms
- Balance optimism with realism - be honest but encouraging
- Always mention that free will plays a role: "These are favorable cosmic energies, but your choices matter!"
- Make it personal: Connect the forecast to their destiny/basic numbers
- End with interactive questions like:
  * "Does this timeline align with what you've been planning?"
  * "Would you like me to dive deeper into any specific year?"
  * "Which year are you most curious about?"
  * "How do you feel about these upcoming opportunities?"`;
  }

  if (intent.primary === 'current') {
    return baseInstructions + `\n\nFOR THIS QUERY (Current Period):
- Focus on current dasha periods (Maha, Yearly, Monthly, Daily)
- Explain what energies are active RIGHT NOW in their life
- Give practical, actionable advice for navigating the current period
- Make it relatable: "You might be noticing..." "This explains why you're feeling..."
- End with: "Does this match what you're experiencing?" or "What specific area would you like support with right now?"`;
  }

  if (intent.primary === 'relationships' || intent.primary === 'career') {
    return baseInstructions + `\n\nFOR THIS QUERY (${intent.primary === 'relationships' ? 'Relationships' : 'Career'}):
- Connect their numbers to REAL-LIFE situations and patterns
- Use the forecast data to give specific timeframes when available
- Explain compatibility or career fit in simple, practical terms
- Share insights like: "Here's what I see in your chart that's really interesting..."
- End with follow-up questions to keep them engaged`;
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
      contextText += `CURRENT YEARLY DASHA (${yearly.year}):
Planet/Number: ${yearly.planet}
Period: ${yearly.startDate} to ${yearly.endDate}
Theme: ${yearly.theme}

`;
    }
  }

  // ✅ ALWAYS ADD UPCOMING YEARS IF AVAILABLE (moved outside intent check)
  // This ensures year forecasts are available for ANY query mentioning years
  if (dataContext.dashas?.upcoming?.upcomingYears?.length > 0) {
    contextText += `UPCOMING YEARLY FORECASTS:\n`;
    dataContext.dashas.upcoming.upcomingYears.forEach(yearData => {
      contextText += `\nYear ${yearData.year}:
- Ruling Planet/Number: ${yearData.planet}
- Theme: ${yearData.theme}
- Meaning: ${yearData.meaning}
- Period: ${yearData.startDate} to ${yearData.endDate}
`;
    });
    contextText += `\n`;
  }

  // ✅ ADD SPECIFIC LIFE EVENT FORECASTS
  if (dataContext.forecasts?.specificForecasts) {
    const sf = dataContext.forecasts.specificForecasts;

    // Career milestone years
    if (sf.careerMilestones?.length > 0) {
      contextText += `CAREER MILESTONE YEARS:
High probability years for job opportunities, promotions, and career advancement:
${sf.careerMilestones.join(', ')}

`;
    }

    // Marriage forecast years
    if (sf.marriageYears?.highProbability?.length > 0 || sf.marriageYears?.moderate?.length > 0) {
      contextText += `MARRIAGE FORECAST YEARS:
`;
      if (sf.marriageYears.highProbability?.length > 0) {
        contextText += `High Probability: ${sf.marriageYears.highProbability.join(', ')}\n`;
      }
      if (sf.marriageYears.moderate?.length > 0) {
        contextText += `Moderate Probability: ${sf.marriageYears.moderate.join(', ')}\n`;
      }
      if (sf.marriageYears.lowProbability?.length > 0) {
        contextText += `Lower Probability: ${sf.marriageYears.lowProbability.join(', ')}\n`;
      }
      contextText += `\n`;
    }

    // Child birth forecast years
    if (sf.childBirthYears?.highProbability?.length > 0 || sf.childBirthYears?.moderate?.length > 0) {
      contextText += `CHILD BIRTH FORECAST YEARS:
`;
      if (sf.childBirthYears.highProbability?.length > 0) {
        contextText += `High Probability: ${sf.childBirthYears.highProbability.join(', ')}\n`;
      }
      if (sf.childBirthYears.moderate?.length > 0) {
        contextText += `Moderate Probability: ${sf.childBirthYears.moderate.join(', ')}\n`;
      }
      contextText += `\n`;
    }

    // Travel forecast years
    if (sf.travelYears) {
      contextText += `TRAVEL & RELOCATION FORECAST:
`;
      if (sf.travelYears.hasTravelYoga !== undefined) {
        contextText += `Travel Profile: ${sf.travelYears.travelProfile}\n`;
      }
      if (sf.travelYears.favorable?.length > 0) {
        contextText += `Favorable Years: ${sf.travelYears.favorable.join(', ')}\n`;
      }
      if (sf.travelYears.unfavorable?.length > 0) {
        contextText += `Unfavorable Years (delays/documentation issues): ${sf.travelYears.unfavorable.join(', ')}\n`;
      }
      contextText += `\n`;
    }

    // Property purchase forecast years
    if (sf.propertyYears?.favorable?.length > 0 || sf.propertyYears?.unfavorable?.length > 0) {
      contextText += `PROPERTY PURCHASE FORECAST:
`;
      if (sf.propertyYears.favorable?.length > 0) {
        contextText += `Favorable Years: ${sf.propertyYears.favorable.join(', ')}\n`;
      }
      if (sf.propertyYears.unfavorable?.length > 0) {
        contextText += `Unfavorable Years (high risk/delays): ${sf.propertyYears.unfavorable.join(', ')}\n`;
      }
      contextText += `\n`;
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
          assistant: "Ah, Destiny Number 3! This is such a vibrant energy to have. Let me tell you what makes you special.\n\nYour Destiny Number 3 represents creativity and self-expression - think of it like this: you're naturally talented at communicating ideas and bringing joy to others. Number 3 people are often the 'artists' of numerology, whether that's through actual art, writing, speaking, or just having a colorful, magnetic personality that draws people in.\n\nWhat's really beautiful about your number is that you're here to express yourself authentically and inspire others through your unique voice. You probably find that you light up when you're creating something or sharing ideas, right?\n\nHave you noticed this creative side in your daily life? I'd love to hear how it shows up for you!"
        }
      ],
      current: [
        {
          user: "What's happening in my life right now?",
          assistant: "Great question! Let me look at what's active in your chart right now.\n\nYou're currently in Dasha 6, which runs until December 2026. Here's what that means for you: Dasha 6 is all about love, family, and responsibility - it's like the universe is gently asking you to focus on the people who matter most in your life.\n\nYou might have noticed yourself feeling more drawn to taking care of others, or wanting to create harmony in your relationships. This is actually a beautiful time for deepening connections and finding balance between giving and receiving. It's less about grand adventures and more about cultivating meaningful bonds.\n\nDoes this resonate with what you've been experiencing lately? I'm curious - have you felt this pull towards family or relationships recently?"
        }
      ],
      remedies: [
        {
          user: "How can I improve my situation?",
          assistant: "I'm glad you're taking proactive steps! Based on your chart, here's what I recommend specifically for you:\n\n✨ **5 Mukhi Rudraksha** - Wear this as a necklace or bracelet. It helps calm the mind and bring mental clarity - think of it like having a peaceful anchor during a busy day. It balances Mercury's energy in your chart.\n\n🕉️ **Chant 'Om Namah Shivaya'** - Even just 11 times in the morning can help align your energy. It's simple, doesn't take long, and many people feel a sense of peace afterward.\n\n💧 **Spend time near water on Fridays** - Visit a lake, river, or even sit by a fountain. This balances the Moon's influence and can be surprisingly refreshing for your spirit.\n\nHere's my suggestion: start with just ONE of these and give it a week or two. Small, consistent steps work way better than trying to do everything at once.\n\nWhich one feels most doable for you right now?"
        }
      ],
      future: [
        {
          user: "When will I get married?",
          assistant: "What a beautiful question! Let me look at your marriage forecast.\n\nBased on your dasha timeline, I can see some really promising years ahead for you:\n\n💫 **High Probability Years: 2026, 2028, 2030**\n\nHere's what makes these years special:\n\n**2026** - This year is ruled by dasha number 6, which is THE number for love, relationships, and commitment. It's like the universe is rolling out the red carpet for partnerships. With your Destiny Number 1, this combines leadership with harmony - a powerful match!\n\n**2028** - Governed by dasha number 7, bringing deep spiritual connection and understanding. This is less about fireworks and more about finding someone who truly 'gets' you on a soul level.\n\n**2030** - Dasha 8 in a favorable pattern, indicating solid foundations and long-term commitment. This is about building something that lasts.\n\n**Moderate Probability: 2027, 2029** - These years have supportive energy but might require more patience.\n\nWhat's interesting is that ages 26-30 appear to be your most favorable window. Does this align with what you've been feeling or planning? Are you currently in a relationship, or are you open to meeting someone new?"
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
  let instructions = `RESPONSE FORMAT - MAKE IT CONVERSATIONAL:
- Start with a warm, personal acknowledgment using their name (e.g., "Great question, Nisha!" or "I'm so glad you asked about this!")
- Share insights like you're talking to a friend: "Here's what I see in your chart..." or "This is really interesting about you..."
- Provide 2-4 paragraphs of clear, simple explanation with real-life examples
- Use bullet points or emojis (✨💫🌟) to make it visually engaging when listing items
- Add personal observations: "I notice that..." "What's fascinating about your chart is..."
- ALWAYS end with an engaging follow-up question to continue the conversation:
  * "Does this resonate with what you've been experiencing?"
  * "Would you like to explore this further?"
  * "What part of this are you most curious about?"
  * "How does this align with your current situation?"
  * "Is there a specific aspect you'd like me to dive deeper into?"
- NO numerology jargon without immediate, simple explanation
- NO robotic or generic responses - make every answer feel tailored to THEM
- Keep it conversational and warm, like a trusted friend sharing wisdom`;

  if (intent.primary === 'remedies') {
    instructions += `\n\nFOR REMEDIES:
- List no more than 3 remedies with enthusiasm: "Here's what I recommend for you specifically..."
- Explain WHY each one works using relatable analogies
- Make them actionable: "Start by..." "Try this..."
- End with: "Which of these feels most doable for you?" or "Would you like step-by-step guidance for any of these?"`;
  }

  if (intent.primary === 'future') {
    instructions += `\n\nFOR FUTURE PREDICTIONS:
- Give SPECIFIC years from the forecast data
- Paint a picture: "Imagine 2028 - here's what the cosmic energies suggest..."
- Connect to their personal numbers: "This is especially powerful for you because..."
- End with: "Which year excites you most?" or "Would you like detailed guidance for any particular year?"`;
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
