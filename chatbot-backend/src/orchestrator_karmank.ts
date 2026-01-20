// src/orchestrator_karmank.ts
/* KarmAnk Chatbot Orchestrator - Hybrid Learning Model
 - Controlled learning with user consent
 - Pattern recognition for common user queries
 - Strict information classification (user data only, no system internals)
 - Conversation metadata storage with PII redaction
 - Manual review pipeline for model improvement
 - Supabase authentication integration
*/

import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import axios from 'axios';
import pino from 'pino';
import { createClient } from 'redis';
import { Queue, Worker, Job, QueueEvents } from 'bullmq';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import crypto from 'crypto';

dotenv.config();

// Logger
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: { target: 'pino-pretty' },
});

// Config
const PORT = Number(process.env.PORT || 8080);
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const QUEUE_NAME = 'karmank-chat-queue';
const CACHE_TTL_SECONDS = Number(process.env.CACHE_TTL_SECONDS || '300');
const RATE_LIMIT_PER_MIN = Number(process.env.RATE_LIMIT_PER_MIN || '30');

// Supabase
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createSupabaseClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// LLM Config (Using Gemini as per KarmAnk project)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_API_URL = process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Learning Config
const LEARNING_ENABLED = process.env.LEARNING_ENABLED === 'true';
const PATTERN_UPDATE_INTERVAL_HOURS = Number(process.env.PATTERN_UPDATE_INTERVAL_HOURS || '168'); // Weekly

// Redis client + BullMQ setup
const redisClient = createClient({ url: REDIS_URL });
redisClient.on('error', (err) => logger.error({ err }, 'Redis error'));
await redisClient.connect();

const chatQueue = new Queue(QUEUE_NAME, { connection: { url: REDIS_URL } });
const queueEvents = new QueueEvents(QUEUE_NAME, { connection: { url: REDIS_URL } });

// Worker to process LLM jobs
const worker = new Worker(
  QUEUE_NAME,
  async (job: Job) => {
    const { prompt, userContext, conversationId } = job.data;

    try {
      // Call Gemini API
      const resp = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 500,
          }
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000,
        }
      );

      const aiResponse = resp.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I could not generate a response.';

      // Store interaction metadata if learning enabled and user consented
      if (LEARNING_ENABLED && job.data.userConsent) {
        await storeConversationMetadata(conversationId, prompt, aiResponse, userContext);
      }

      return aiResponse;
    } catch (err: any) {
      logger.error({ err }, 'LLM job failed');
      throw err;
    }
  },
  { connection: { url: REDIS_URL } }
);

worker.on('failed', (job, err) => logger.warn({ jobId: job?.id, err }, 'Chat job failed'));

// Express app
const app = express();
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(bodyParser.json());

// Attach logger to request
app.use((req, _res, next) => {
  (req as any).log = logger.child({ path: req.path });
  next();
});

// ============================================================================
// INFORMATION CLASSIFICATION & POLICY ENFORCEMENT
// ============================================================================

// Define what information is ALLOWED (user-specific numerology data only)
const ALLOWED_TOPICS = [
  'basic number', 'destiny number', 'life path', 'soul urge', 'expression number',
  'personality number', 'kundli', 'grid', 'yoga', 'dasha', 'maha dasha',
  'yearly dasha', 'monthly dasha', 'daily dasha', 'remedies', 'rudraksha',
  'mantra', 'gemstone', 'chakra', 'forecast', 'marriage', 'child birth',
  'compatibility', 'name analysis', 'asset vibration', 'career path',
  'traits', 'strengths', 'weaknesses', 'challenges', 'opportunities',
  'birth date', 'name meaning', 'number meaning', 'planetary influence',
  'cosmic compatibility', 'psychometric profile', 'destiny traits'
];

// Define what information is FORBIDDEN (system internals, development details)
const FORBIDDEN_KEYWORDS = [
  // System implementation
  'source code', 'code', 'implementation', 'algorithm', 'function', 'component',
  'git', 'github', 'repository', 'commit', 'branch', 'deploy', 'build',

  // Technical details
  'api', 'endpoint', 'database', 'table', 'schema', 'query', 'sql',
  'server', 'backend', 'frontend', 'framework', 'library', 'dependency',
  'docker', 'container', 'orchestrator', 'redis', 'supabase', 'vercel',

  // Security & credentials
  'api key', 'secret', 'token', 'password', 'credential', 'private key',
  'environment variable', 'env', 'config', 'authentication logic',

  // Development process
  'how do you work', 'how does this work', 'system architecture',
  'data structure', 'file structure', 'module', 'class', 'interface',
  'react', 'vite', 'typescript', 'javascript', 'npm', 'package',

  // Business logic internals
  'calculation logic', 'formula', 'how do you calculate', 'computation',
  'data mapping', 'transformation', 'processing pipeline'
];

function detectForbiddenRequest(message: string): { forbidden: boolean; reason?: string } {
  if (!message) return { forbidden: false };

  const lower = message.toLowerCase();

  // Check for direct forbidden keywords
  for (const keyword of FORBIDDEN_KEYWORDS) {
    if (lower.includes(keyword)) {
      return {
        forbidden: true,
        reason: `Questions about ${keyword} are not allowed. I can only help you understand your personal numerology insights.`
      };
    }
  }

  // Check for meta-questions about the system
  const metaPatterns = [
    /how (do|does) (you|this|the system|karmank)/i,
    /what (is|are) (your|the) (algorithm|code|implementation)/i,
    /show me (the|your) (code|logic|formula)/i,
    /explain (how|why) (you|the system) (calculate|compute|work)/i,
    /(source|technical|internal) (code|details|documentation)/i,
  ];

  for (const pattern of metaPatterns) {
    if (pattern.test(message)) {
      return {
        forbidden: true,
        reason: "I cannot share technical implementation details or system internals. I'm here to help you understand your personal numerology insights."
      };
    }
  }

  return { forbidden: false };
}

const REFUSAL_MESSAGE = `I cannot share technical details, system implementation, or internal workings of KarmAnk™.

I can help you understand:
✨ Your numerology numbers and their meanings
✨ Your dashas and planetary influences
✨ Your strengths, challenges, and opportunities
✨ Remedies and guidance for your life path
✨ Compatibility with others
✨ Career insights based on your profile

Please ask me about YOUR numerology insights, and I'll be happy to help!`;

// ============================================================================
// PII REDACTION
// ============================================================================

function redactPII(text: string): string {
  if (!text) return text;
  let out = text;

  // Email addresses
  out = out.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL_REDACTED]');

  // Phone numbers (various formats)
  out = out.replace(/\b(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})\b/g, '[PHONE_REDACTED]');

  // Credit card / long number sequences
  out = out.replace(/\b\d{13,16}\b/g, '[NUMBER_REDACTED]');

  // Aadhaar numbers (12 digits)
  out = out.replace(/\b\d{4}\s?\d{4}\s?\d{4}\b/g, '[ID_REDACTED]');

  // IP addresses
  out = out.replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[IP_REDACTED]');

  // Full names (when preceded by "my name is" or "i am")
  out = out.replace(/(my name is|i am|i'm)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/gi, '$1 [NAME_REDACTED]');

  return out;
}

// Hash user identifiable data for anonymized analytics
function hashUserId(userId: string): string {
  return crypto.createHash('sha256').update(userId + process.env.HASH_SALT || 'karmank-salt').digest('hex').substring(0, 16);
}

// ============================================================================
// CONVERSATION METADATA STORAGE (For Learning Pipeline)
// ============================================================================

interface ConversationMetadata {
  conversation_id: string;
  user_id_hash: string; // Hashed, not original
  timestamp: string;
  user_message_redacted: string;
  bot_response_redacted: string;
  intent_detected?: string;
  user_context_summary?: string; // e.g., "destiny=5, basic=3"
  user_consent: boolean;
  feedback?: 'thumbs_up' | 'thumbs_down' | null;
  reviewed: boolean;
  approved_for_training: boolean;
}

async function storeConversationMetadata(
  conversationId: string,
  userMessage: string,
  botResponse: string,
  userContext: any
): Promise<void> {
  try {
    const metadata: ConversationMetadata = {
      conversation_id: conversationId,
      user_id_hash: hashUserId(userContext.userId || 'anonymous'),
      timestamp: new Date().toISOString(),
      user_message_redacted: redactPII(userMessage),
      bot_response_redacted: redactPII(botResponse),
      intent_detected: detectIntent(userMessage),
      user_context_summary: summarizeUserContext(userContext),
      user_consent: userContext.consent || false,
      feedback: null,
      reviewed: false,
      approved_for_training: false,
    };

    // Store in Supabase table: chat_conversation_metadata
    const { error } = await supabase
      .from('chat_conversation_metadata')
      .insert([metadata]);

    if (error) {
      logger.warn({ error }, 'Failed to store conversation metadata');
    }
  } catch (err) {
    logger.error({ err }, 'Error storing conversation metadata');
  }
}

// ============================================================================
// PATTERN LEARNING & INTENT DETECTION
// ============================================================================

// Intent categories for numerology queries
const INTENT_PATTERNS = {
  greeting: [/^(hi|hello|hey|namaste|namaskar|greetings|good morning|good afternoon|good evening)$/i, /^(hi|hello|hey|namaste|namaskar)\s/i, /^(hi|hello|hey|namaste|namaskar),/i],
  basic_number_query: [/what is my basic number/i, /basic number mean/i, /tell me about.*basic/i],
  destiny_number_query: [/what is my destiny/i, /destiny number/i, /life path/i],
  dasha_query: [/current dasha/i, /what dasha/i, /planetary period/i, /maha dasha/i],
  remedy_query: [/remedy/i, /remedies/i, /suggestion/i, /what should i do/i, /how to improve/i],
  compatibility_query: [/compatible/i, /compatibility/i, /relationship/i, /partner/i],
  forecast_query: [/future/i, /forecast/i, /prediction/i, /when will/i, /marriage/i, /child/i],
  traits_query: [/strength/i, /weakness/i, /trait/i, /personality/i, /characteristic/i],
  yoga_query: [/yoga/i, /combination/i, /special pattern/i],
  chakra_query: [/chakra/i, /energy center/i, /kundalini/i],
  general_guidance: [/help/i, /guide/i, /advice/i, /confused/i, /what does.*mean/i],
};

// ============================================================================
// LANGUAGE DETECTION
// ============================================================================

function detectLanguage(message: string): 'en' | 'hi' | 'hi-en' {
  if (!message) return 'en';

  const text = message.toLowerCase();

  // Devanagari script detection (Hindi)
  const hindiChars = /[\u0900-\u097F]/;
  const hasHindi = hindiChars.test(message);

  // Hindi keywords detection
  const hindiKeywords = [
    'मेरा', 'क्या', 'है', 'कैसे', 'बताओ', 'जानना', 'चाहता', 'हूं', 'हूँ',
    'नंबर', 'भाग्यांक', 'मूलांक', 'दशा', 'महादशा', 'उपाय', 'राशि',
    'कृपया', 'मुझे', 'बताइए', 'समझाइए'
  ];
  const hasHindiKeywords = hindiKeywords.some(word => text.includes(word));

  // English words detection
  const englishWords = /\b(what|how|tell|me|my|is|number|destiny|basic|dasha|remedy|please|help|can|you|about|know|want)\b/;
  const hasEnglish = englishWords.test(text);

  // Hinglish detection (mixed Hindi + English)
  if ((hasHindi || hasHindiKeywords) && hasEnglish) {
    return 'hi-en';
  }

  // Pure Hindi
  if (hasHindi || hasHindiKeywords) {
    return 'hi';
  }

  // Default to English
  return 'en';
}

function detectIntent(message: string): string {
  const lower = message.toLowerCase();

  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(lower)) {
        return intent;
      }
    }
  }

  return 'unknown';
}

function summarizeUserContext(context: any): string {
  if (!context) return '';

  const parts: string[] = [];
  if (context.destinyNumber) parts.push(`destiny=${context.destinyNumber}`);
  if (context.basicNumber) parts.push(`basic=${context.basicNumber}`);
  if (context.currentDasha) parts.push(`dasha=${context.currentDasha}`);

  return parts.join(', ');
}

// Load learned patterns from database (updated periodically via manual review)
let LEARNED_RESPONSES: Map<string, string> = new Map();

async function loadLearnedPatterns() {
  try {
    // Fetch approved patterns from Supabase table: chat_learned_patterns
    const { data, error } = await supabase
      .from('chat_learned_patterns')
      .select('pattern, response')
      .eq('approved', true)
      .eq('active', true);

    if (error) {
      logger.warn({ error }, 'Failed to load learned patterns');
      return;
    }

    LEARNED_RESPONSES.clear();
    data?.forEach((row) => {
      LEARNED_RESPONSES.set(row.pattern.toLowerCase(), row.response);
    });

    logger.info({ count: LEARNED_RESPONSES.size }, 'Loaded learned patterns');
  } catch (err) {
    logger.error({ err }, 'Error loading learned patterns');
  }
}

// Periodically reload patterns (weekly by default)
setInterval(loadLearnedPatterns, PATTERN_UPDATE_INTERVAL_HOURS * 60 * 60 * 1000);
await loadLearnedPatterns(); // Initial load

// ============================================================================
// DETERMINISTIC RESPONSE GENERATION (User's Numerology Data)
// ============================================================================

async function generateDeterministicResponse(
  message: string,
  userContext: any
): Promise<{ found: boolean; response?: string }> {
  const lower = message.toLowerCase();
  const intent = detectIntent(message);

  // Check learned patterns first
  for (const [pattern, response] of LEARNED_RESPONSES.entries()) {
    if (lower.includes(pattern)) {
      return { found: true, response: interpolateResponse(response, userContext) };
    }
  }

  // Handle greetings (no report needed)
  if (intent === 'greeting') {
    const greetingResponses = [
      `Namaste! 🙏 I'm Ishira, your personal numerology guide. I can help you understand your destiny number, current dasha, remedies, and much more about your cosmic influences. What would you like to know?`,
      `Hello! ✨ I'm Ishira. I'm here to help you explore your numerology insights. Feel free to ask me about your numbers, dashas, or any guidance you seek!`,
      `Greetings! 🌟 I'm Ishira, here to illuminate your numerological path. Ask me anything about your destiny, strengths, or cosmic timing!`,
      `Namaste! I'm Ishira, your cosmic guide. 🪷 How may I help you understand your numerological blueprint today?`
    ];
    const randomIndex = Math.floor(Math.random() * greetingResponses.length);
    return { found: true, response: greetingResponses[randomIndex] };
  }

  // Intent-based deterministic responses (require report)
  if (!userContext || !userContext.report) {
    return { found: false };
  }

  const report = userContext.report;

  switch (intent) {
    case 'basic_number_query':
      if (report.basicNumber) {
        return {
          found: true,
          response: `Your Basic Number is **${report.basicNumber}**. ${report.basicNumberMeaning || 'This represents your core personality and natural tendencies.'}`
        };
      }
      break;

    case 'destiny_number_query':
      if (report.destinyNumber) {
        return {
          found: true,
          response: `Your Destiny Number is **${report.destinyNumber}**. ${report.destinyNumberMeaning || 'This reveals your life purpose and karmic path.'}`
        };
      }
      break;

    case 'dasha_query':
      if (report.currentMahaDasha) {
        return {
          found: true,
          response: `You are currently in **${report.currentMahaDasha.planet} Maha Dasha** (${report.currentMahaDasha.startYear} - ${report.currentMahaDasha.endYear}). ${report.currentMahaDasha.influence || 'This period influences your overall life direction.'}`
        };
      }
      break;

    case 'remedy_query':
      if (report.remedies && report.remedies.length > 0) {
        const remedyList = report.remedies.slice(0, 3).map((r: any) => `• ${r.remedy}`).join('\n');
        return {
          found: true,
          response: `Here are some remedies suggested for you:\n\n${remedyList}\n\nWould you like more details about any of these?`
        };
      }
      break;

    case 'traits_query':
      if (report.strengths || report.weaknesses) {
        const strengths = report.strengths ? `**Strengths:** ${report.strengths.slice(0, 3).join(', ')}` : '';
        const weaknesses = report.weaknesses ? `**Areas to work on:** ${report.weaknesses.slice(0, 3).join(', ')}` : '';
        return {
          found: true,
          response: `${strengths}\n\n${weaknesses}`
        };
      }
      break;
  }

  return { found: false };
}

function interpolateResponse(template: string, context: any): string {
  let result = template;

  // Replace placeholders like {{destinyNumber}}, {{basicNumber}}
  if (context.report) {
    result = result.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return context.report[key] || match;
    });
  }

  return result;
}

// ============================================================================
// REDIS UTILITIES
// ============================================================================

async function redisGet(key: string) {
  try {
    const v = await redisClient.get(key);
    return v ? JSON.parse(v) : null;
  } catch (err) {
    logger.warn({ err, key }, 'redis get failed');
    return null;
  }
}

async function redisSet(key: string, value: any, ttlSec = CACHE_TTL_SECONDS) {
  try {
    await redisClient.set(key, JSON.stringify(value), { EX: ttlSec });
  } catch (err) {
    logger.warn({ err, key }, 'redis set failed');
  }
}

async function isRateLimited(userId: string): Promise<boolean> {
  try {
    const key = `rl:chat:${userId}`;
    const cur = await redisClient.incr(key);
    if (cur === 1) {
      await redisClient.expire(key, 60); // 60 seconds window
    }
    return cur > RATE_LIMIT_PER_MIN;
  } catch (err) {
    logger.warn({ err }, 'rate-limit fallback');
    return false; // fail open
  }
}

// ============================================================================
// AUTHENTICATION MIDDLEWARE (Supabase)
// ============================================================================

async function authenticateUser(authHeader: string): Promise<{ userId: string; email: string } | null> {
  try {
    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) return null;

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      logger.warn({ error }, 'Authentication failed');
      return null;
    }

    return { userId: user.id, email: user.email || '' };
  } catch (err) {
    logger.error({ err }, 'Authentication error');
    return null;
  }
}

// ============================================================================
// ENQUEUE LLM JOB
// ============================================================================

async function enqueueChatJob(
  prompt: string,
  userContext: any,
  conversationId: string,
  userConsent: boolean
) {
  const job = await chatQueue.add(
    'chat',
    { prompt, userContext, conversationId, userConsent },
    { attempts: 2, backoff: { type: 'exponential', delay: 2000 } }
  );

  const result = await job.waitUntilFinished(queueEvents, 30000);
  return result;
}

// ============================================================================
// EXPRESS ROUTES
// ============================================================================

app.get('/health', (_req: Request, res: Response) => {
  res.json({ ok: true, learning: LEARNING_ENABLED });
});

// Main chat endpoint
app.post('/chat', async (req: Request, res: Response) => {
  const log = (req as any).log;

  try {
    const { message, userContext, conversationId, userConsent = false } = req.body || {};
    const authHeader = String(req.headers.authorization || '');

    // Authenticate user
    const user = await authenticateUser(authHeader);
    if (!user) {
      return res.status(401).json({ error: 'unauthorized', message: 'Please log in to use the chatbot.' });
    }

    // Rate limiting
    const rateLimited = await isRateLimited(user.userId);
    if (rateLimited) {
      return res.status(429).json({
        error: 'rate_limited',
        message: 'You are asking too many questions. Please wait a moment and try again.'
      });
    }

    // Policy check - CRITICAL: Block all forbidden requests
    const policyCheck = detectForbiddenRequest(message);
    if (policyCheck.forbidden) {
      log.warn({ userId: user.userId, message }, 'Forbidden request blocked');
      return res.json({
        type: 'text',
        text: policyCheck.reason || REFUSAL_MESSAGE,
        blocked: true
      });
    }

    // Cache key
    const normalized = (message || '').trim().toLowerCase().replace(/\s+/g, ' ').slice(0, 300);
    const cacheKey = `chat:${user.userId}:${hashUserId(normalized)}`;

    // Try cache
    const cached = await redisGet(cacheKey);
    if (cached) {
      return res.json({ type: 'text', text: cached, cached: true });
    }

    // Try deterministic response from user's numerology data
    const contextWithUser = { ...userContext, userId: user.userId, consent: userConsent };
    const deterministicResponse = await generateDeterministicResponse(message, contextWithUser);

    if (deterministicResponse.found && deterministicResponse.response) {
      await redisSet(cacheKey, deterministicResponse.response);
      return res.json({ type: 'text', text: deterministicResponse.response, source: 'deterministic' });
    }

    // Detect language from user's message
    const detectedLanguage = detectLanguage(message);
    logger.info({ detectedLanguage, message: message.substring(0, 50) }, 'Language detected');

    // Build language instruction for the prompt
    let languageInstruction = '';
    if (detectedLanguage === 'hi') {
      languageInstruction = '\n7. IMPORTANT: Respond in PURE HINDI (हिंदी) using Devanagari script. Do not mix English words.';
    } else if (detectedLanguage === 'hi-en') {
      languageInstruction = '\n7. IMPORTANT: Respond in HINGLISH (Hindi-English mix). Use Roman script with Hindi and English words mixed naturally.';
    } else {
      languageInstruction = '\n7. IMPORTANT: Respond in ENGLISH only.';
    }

    // Fallback to LLM with controlled prompt
    const systemPrompt = `You are Ishira, KarmAnk™'s personal numerology guide. You help users understand their numerology insights with warmth and wisdom.

STRICT RULES:
1. ONLY discuss the user's personal numerology data (numbers, dashas, traits, remedies, compatibility)
2. NEVER discuss system internals, code, algorithms, technical implementation, or how KarmAnk works
3. NEVER share API keys, secrets, or configuration details
4. Keep responses warm, insightful, and user-friendly (max 200 words)
5. If asked about system details, politely redirect to personal numerology insights
6. Your name is Ishira - use it when introducing yourself${languageInstruction}

User's context: ${JSON.stringify(contextWithUser.report || {})}

User's question: "${message}"

Provide a helpful, personal response based ONLY on their numerology data:`;

    try {
      const aiText = await enqueueChatJob(
        systemPrompt,
        contextWithUser,
        conversationId || crypto.randomUUID(),
        userConsent
      );

      await redisSet(cacheKey, aiText);
      return res.json({ type: 'text', text: aiText, source: 'ai' });
    } catch (err) {
      logger.warn({ err }, 'LLM job failed');
      const fallback = "I'm having trouble understanding that right now. Could you rephrase your question about your numerology insights?";
      await redisSet(cacheKey, fallback, 60); // Short cache for errors
      return res.json({ type: 'text', text: fallback, source: 'fallback' });
    }

  } catch (err) {
    logger.error({ err }, 'Chat handler error');
    return res.status(500).json({ error: 'internal_error', message: 'Something went wrong. Please try again.' });
  }
});

// Feedback endpoint (thumbs up/down)
app.post('/chat/feedback', async (req: Request, res: Response) => {
  try {
    const { conversationId, feedback } = req.body;
    const authHeader = String(req.headers.authorization || '');

    const user = await authenticateUser(authHeader);
    if (!user) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    if (!conversationId || !['thumbs_up', 'thumbs_down'].includes(feedback)) {
      return res.status(400).json({ error: 'invalid_input' });
    }

    // Update feedback in metadata table
    const { error } = await supabase
      .from('chat_conversation_metadata')
      .update({ feedback })
      .eq('conversation_id', conversationId);

    if (error) {
      logger.warn({ error }, 'Failed to update feedback');
      return res.status(500).json({ error: 'update_failed' });
    }

    return res.json({ success: true });
  } catch (err) {
    logger.error({ err }, 'Feedback handler error');
    return res.status(500).json({ error: 'internal_error' });
  }
});

// Consent management endpoint
app.post('/chat/consent', async (req: Request, res: Response) => {
  try {
    const { consent } = req.body; // boolean
    const authHeader = String(req.headers.authorization || '');

    const user = await authenticateUser(authHeader);
    if (!user) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    // Store user's consent preference (create user_chat_preferences table)
    const { error } = await supabase
      .from('user_chat_preferences')
      .upsert({
        user_id: user.userId,
        learning_consent: consent,
        updated_at: new Date().toISOString()
      });

    if (error) {
      logger.warn({ error }, 'Failed to update consent');
      return res.status(500).json({ error: 'update_failed' });
    }

    return res.json({ success: true, consent });
  } catch (err) {
    logger.error({ err }, 'Consent handler error');
    return res.status(500).json({ error: 'internal_error' });
  }
});

// Get user's consent status
app.get('/chat/consent', async (req: Request, res: Response) => {
  try {
    const authHeader = String(req.headers.authorization || '');

    const user = await authenticateUser(authHeader);
    if (!user) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    const { data, error } = await supabase
      .from('user_chat_preferences')
      .select('learning_consent')
      .eq('user_id', user.userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
      logger.warn({ error }, 'Failed to get consent');
      return res.status(500).json({ error: 'fetch_failed' });
    }

    return res.json({ consent: data?.learning_consent || false });
  } catch (err) {
    logger.error({ err }, 'Get consent handler error');
    return res.status(500).json({ error: 'internal_error' });
  }
});

// ============================================================================
// NLG (Natural Language Generation) Endpoints - Secure API
// ============================================================================

/**
 * Generate NLG content (Summary, Life Cycle, Childbirth Forecast)
 * This endpoint securely calls Gemini API from backend
 * Supports caching to reduce API costs
 */
app.post('/nlg/generate', async (req: Request, res: Response) => {
  try {
    const { prompt, cacheKey, nlgType } = req.body;

    // Validate input
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'invalid_input', message: 'Prompt is required' });
    }

    if (!nlgType || !['summary', 'lifecycle', 'childbirth', 'other'].includes(nlgType)) {
      return res.status(400).json({ error: 'invalid_input', message: 'Valid nlgType is required (summary, lifecycle, childbirth, other)' });
    }

    // Check cache first if cacheKey provided
    if (cacheKey && typeof cacheKey === 'string') {
      try {
        const cached = await redisGet(cacheKey);
        if (cached) {
          logger.info({ cacheKey, nlgType }, 'NLG cache hit');
          return res.json({
            success: true,
            text: cached,
            cached: true
          });
        }
      } catch (err) {
        logger.warn({ err, cacheKey }, 'Cache check failed');
      }
    }

    // Call Gemini API
    logger.info({ nlgType }, 'Calling Gemini API for NLG generation');

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const payload = {
      contents: [{
        role: "user",
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      }
    };

    const response = await axios.post(geminiUrl, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
    });

    const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      logger.warn({ response: response.data }, 'No text generated from Gemini');
      return res.status(500).json({
        error: 'generation_failed',
        message: 'Failed to generate content'
      });
    }

    // Cache the result if cacheKey provided
    if (cacheKey && typeof cacheKey === 'string') {
      try {
        // Cache for 7 days (604800 seconds) for stable predictions
        await redisSet(cacheKey, generatedText, 604800);
        logger.info({ cacheKey, nlgType }, 'NLG result cached');
      } catch (err) {
        logger.warn({ err, cacheKey }, 'Failed to cache NLG result');
      }
    }

    return res.json({
      success: true,
      text: generatedText,
      cached: false
    });

  } catch (err: any) {
    logger.error({ err }, 'NLG generation error');

    // Handle specific Gemini API errors
    if (err.response?.status === 429) {
      return res.status(429).json({
        error: 'rate_limit_exceeded',
        message: 'API rate limit exceeded. Please try again later.'
      });
    }

    if (err.response?.status === 403) {
      return res.status(403).json({
        error: 'api_key_invalid',
        message: 'API key is invalid or expired.'
      });
    }

    return res.status(500).json({
      error: 'internal_error',
      message: 'An error occurred while generating content.'
    });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down...');
  await worker.close();
  await chatQueue.close();
  await redisClient.quit();
  process.exit(0);
});

app.listen(PORT, () => logger.info({ port: PORT, learning: LEARNING_ENABLED }, 'KarmAnk Chatbot Orchestrator listening'));
