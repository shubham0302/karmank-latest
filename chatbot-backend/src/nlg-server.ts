// NLG Server - Secure Backend for Natural Language Generation
// This server securely handles Gemini API calls without exposing the API key to the frontend
// Also handles numerology calculations to protect proprietary algorithms

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { calculateCompleteNumerology } from './services/numerology-calculator.js';
import { dataService } from './services/data-service.js';
import { DATA } from './data/proprietary-data.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 8080);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5178';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// Middleware
app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177', 'http://localhost:5178'],
  credentials: true,
}));
app.use(express.json());

// In-memory cache for NLG results (reduces API costs)
const cache = new Map<string, { text: string; timestamp: number }>();
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Clean expired cache entries every hour
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      cache.delete(key);
    }
  }
}, 60 * 60 * 1000);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'KarmAnk NLG Server' });
});

// NLG Generation Endpoint
app.post('/nlg/generate', async (req: Request, res: Response) => {
  try {
    const { prompt, cacheKey, nlgType } = req.body;

    // Validate input
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        error: 'invalid_input',
        message: 'Prompt is required'
      });
    }

    if (!nlgType || !['summary', 'lifecycle', 'childbirth', 'other'].includes(nlgType)) {
      return res.status(400).json({
        error: 'invalid_input',
        message: 'Valid nlgType is required (summary, lifecycle, childbirth, other)'
      });
    }

    // Check cache first
    if (cacheKey && typeof cacheKey === 'string') {
      const cached = cache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
        console.log(`✅ Cache hit for: ${nlgType} (${cacheKey})`);
        return res.json({
          success: true,
          text: cached.text,
          cached: true
        });
      }
    }

    // Validate API key
    if (!GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY not configured in backend');
      return res.status(500).json({
        error: 'server_configuration_error',
        message: 'API key is not configured on the server'
      });
    }

    // Call Gemini API
    console.log(`🔄 Generating NLG for: ${nlgType}`);

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
      console.warn('⚠️ No text generated from Gemini');
      return res.status(500).json({
        error: 'generation_failed',
        message: 'Failed to generate content'
      });
    }

    // Cache the result
    if (cacheKey && typeof cacheKey === 'string') {
      cache.set(cacheKey, {
        text: generatedText,
        timestamp: Date.now()
      });
      console.log(`💾 Cached result for: ${nlgType} (${cacheKey})`);
    }

    console.log(`✅ Generated NLG for: ${nlgType}`);

    return res.json({
      success: true,
      text: generatedText,
      cached: false
    });

  } catch (err: any) {
    console.error('❌ NLG generation error:', err.message);

    // Handle specific Gemini API errors
    if (err.response?.status === 429) {
      return res.status(429).json({
        error: 'rate_limit_exceeded',
        message: 'API rate limit exceeded. Please try again later.'
      });
    }

    if (err.response?.status === 403 || err.response?.status === 401) {
      return res.status(403).json({
        error: 'api_key_invalid',
        message: 'API key is invalid or expired.'
      });
    }

    if (err.response?.status === 400) {
      return res.status(400).json({
        error: 'bad_request',
        message: err.response?.data?.error?.message || 'Invalid request to Gemini API'
      });
    }

    return res.status(500).json({
      error: 'internal_error',
      message: 'An error occurred while generating content.'
    });
  }
});

// ============================================================================
// Numerology Calculation Endpoint - Secure Backend Logic
// ============================================================================

/**
 * Calculate numerology report
 * This endpoint keeps your proprietary calculation logic completely hidden
 */
app.post('/calculate/numerology', async (req: Request, res: Response) => {
  try {
    const { dob } = req.body;

    // Validate input
    if (!dob || typeof dob !== 'string') {
      return res.status(400).json({
        error: 'invalid_input',
        message: 'Date of birth (dob) is required in YYYY-MM-DD format'
      });
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dob)) {
      return res.status(400).json({
        error: 'invalid_format',
        message: 'DOB must be in YYYY-MM-DD format'
      });
    }

    console.log(`🔢 Calculating numerology for: ${dob}`);

    // Perform secure backend calculation
    const result = calculateCompleteNumerology(dob, DATA);

    console.log(`✅ Calculation complete for: ${dob}`);

    return res.json({
      success: true,
      data: result
    });

  } catch (err: any) {
    console.error('❌ Numerology calculation error:', err.message);

    return res.status(500).json({
      error: 'calculation_error',
      message: 'An error occurred while calculating numerology'
    });
  }
});

// ============================================================================
// Data Enrichment Endpoint - Secure Protected Data Access
// ============================================================================

/**
 * Get enrichment data for numerology calculation
 * This endpoint provides protected interpretations, yogas, remedies, etc.
 */
app.post('/api/data/enrichment', async (req: Request, res: Response) => {
  try {
    const {
      basicNumber,
      destinyNumber,
      yogaIds,
      kundliGrid,
      recurringNumbers
    } = req.body;

    // Validate input
    if (typeof basicNumber !== 'number' || typeof destinyNumber !== 'number') {
      return res.status(400).json({
        error: 'invalid_input',
        message: 'basicNumber and destinyNumber are required as numbers'
      });
    }

    if (!Array.isArray(yogaIds)) {
      return res.status(400).json({
        error: 'invalid_input',
        message: 'yogaIds must be an array'
      });
    }

    console.log(`🔐 Fetching enrichment data for Basic: ${basicNumber}, Destiny: ${destinyNumber}`);

    // Get enrichment data from data service
    const enrichmentData = dataService.getEnrichmentData({
      basicNumber,
      destinyNumber,
      yogaIds,
      kundliGrid: kundliGrid || [],
      recurringNumbers: recurringNumbers || []
    });

    console.log(`✅ Enrichment data fetched successfully`);

    return res.json({
      success: true,
      data: enrichmentData
    });

  } catch (err: any) {
    console.error('❌ Enrichment data error:', err.message);

    return res.status(500).json({
      error: 'enrichment_error',
      message: 'An error occurred while fetching enrichment data'
    });
  }
});

// ============================================================================
// Name Analysis Endpoint - Secure Gemini API Access
// ============================================================================

/**
 * Analyze name using Gemini API (secure backend call)
 * This endpoint protects your Gemini API key from frontend exposure
 */
app.post('/nlg/analyze-name', async (req: Request, res: Response) => {
  try {
    const { name, language = 'en' } = req.body;

    // Validate input
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({
        error: 'invalid_input',
        message: 'Name is required'
      });
    }

    if (!GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY not configured');
      return res.status(500).json({
        error: 'server_configuration_error',
        message: 'API key not configured on server'
      });
    }

    console.log(`🔮 Analyzing name: ${name} (language: ${language})`);

    // Create prompt for name analysis
    const prompt = `Analyze the numerological significance of the name "${name}".
Provide insights about:
1. The vibrational energy of the name
2. How the letters influence personality
3. Compatibility with life path
4. Strengths and challenges
5. Career and relationship insights

Respond in ${language === 'hi' ? 'Hindi' : 'English'} language.
Keep the response clear, concise, and actionable (about 200-300 words).`;

    // Call Gemini API (API key secure on backend)
    const model = 'gemini-1.5-flash';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

    const response = await axios.post(apiUrl, {
      contents: [{
        parts: [{ text: prompt }]
      }]
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000
    });

    // Extract generated text
    const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('No content generated from Gemini API');
    }

    console.log(`✅ Name analysis complete for: ${name}`);

    return res.json({
      success: true,
      data: {
        name,
        analysis: generatedText,
        language
      }
    });

  } catch (err: any) {
    console.error('❌ Name analysis error:', err.message);

    return res.status(500).json({
      error: 'name_analysis_error',
      message: err.response?.data?.error?.message || 'Failed to analyze name'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║   🔒 KarmAnk NLG Server (Secure)                         ║
║   Port: ${PORT}                                              ║
║   Frontend: ${FRONTEND_URL}                   ║
║   API Key: ${GEMINI_API_KEY ? '✅ Configured' : '❌ Missing'}                            ║
║   Cache: In-memory (7 day TTL)                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down NLG server...');
  process.exit(0);
});
