/**
 * AWS Lambda Handler for KarmAnk Backend
 *
 * This handles all backend API endpoints:
 * - /nlg/generate - Natural language generation
 * - /calculate/numerology - Numerology calculations
 * - /api/data/enrichment - Data enrichment
 * - /nlg/analyze-name - Name analysis
 */

import { calculateCompleteNumerology } from './services/numerology-calculator.js';
import { dataService } from './services/data-service.js';

// Get environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.SERVER_KEY_GEMINI || '';

// In-memory cache for NLG results (reduces API costs)
const cache = new Map();
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

export const handler = async (event) => {
  // 1. Setup Headers for CORS (Allows your frontend to talk to AWS)
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400"
  };

  // 2. Browser Safety Check (Pre-flight)
  const method = event.requestContext?.http?.method || event.httpMethod;
  if (method === 'OPTIONS') {
     return {
       statusCode: 200,
       headers: headers,
       body: JSON.stringify({ message: 'CORS preflight successful' })
     };
  }

  try {
    // 3. Parse request
    const requestBody = JSON.parse(event.body || '{}');
    const path = event.rawPath || event.requestContext?.http?.path || '/';
    const method = event.requestContext?.http?.method || 'GET';

    console.log(`📥 Request: ${method} ${path}`);

    // 4. Route to appropriate handler

    // Health check endpoint
    if (path === '/health' || path === '/') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'ok',
          service: 'KarmAnk Backend API (AWS Lambda)',
          version: '1.0.0',
          endpoints: ['/health', '/nlg/generate', '/calculate/numerology', '/api/data/enrichment', '/nlg/analyze-name']
        })
      };
    }

    // NLG Generation Endpoint
    if (path === '/nlg/generate' && method === 'POST') {
      const { prompt, cacheKey } = requestBody;

      if (!prompt) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, message: 'Prompt is required' })
        };
      }

      // Check cache
      const cached = cache.get(cacheKey || prompt);
      if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
        console.log('✅ Returning cached response');
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, text: cached.text, cached: true })
        };
      }

      if (!GEMINI_API_KEY) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ success: false, message: 'API key not configured' })
        };
      }

      // Call Google Gemini 2.5 Flash (optimized for speed)
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.5,           // Lower = faster, more deterministic
            maxOutputTokens: 300,       // Reduced from 1000 for faster response
            topP: 0.95,
            topK: 40
          }
        })
      });

      const data: any = await response.json();

      // Log the full response for debugging
      console.log('📊 Gemini API Response:', JSON.stringify(data));
      console.log('📊 Response status:', response.status);

      const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!generatedText) {
        console.error('❌ Gemini API Error - Full response:', JSON.stringify(data));

        // Check for specific error messages from Gemini
        if (data.error) {
          throw new Error(`Gemini API Error: ${data.error.message || JSON.stringify(data.error)}`);
        }

        throw new Error('No content generated from Gemini API');
      }

      // Cache the result
      cache.set(cacheKey || prompt, { text: generatedText, timestamp: Date.now() });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, text: generatedText, cached: false })
      };
    }

    // Numerology Calculation Endpoint
    if (path === '/calculate/numerology' && method === 'POST') {
      const { dob } = requestBody;

      if (!dob) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'invalid_input', message: 'Date of birth is required' })
        };
      }

      const result = await calculateCompleteNumerology(dob);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, data: result })
      };
    }

    // Data Enrichment Endpoint
    if (path === '/api/data/enrichment' && method === 'POST') {
      const { basicNumber, destinyNumber, yogaIds, kundliGrid, recurringNumbers } = requestBody;

      if (!basicNumber || !destinyNumber) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'invalid_input', message: 'Basic and destiny numbers required' })
        };
      }

      const enrichmentData = dataService.getEnrichmentData({
        basicNumber,
        destinyNumber,
        yogaIds: yogaIds || [],
        kundliGrid: kundliGrid || [],
        recurringNumbers: recurringNumbers || []
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, data: enrichmentData })
      };
    }

    // Name Analysis Endpoint
    if (path === '/nlg/analyze-name' && method === 'POST') {
      const { name, language = 'en' } = requestBody;

      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'invalid_input', message: 'Name is required' })
        };
      }

      if (!GEMINI_API_KEY) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'server_configuration_error', message: 'API key not configured' })
        };
      }

      const prompt = `Analyze the numerological significance of the name "${name}".
Provide insights about:
1. The vibrational energy of the name
2. How the letters influence personality
3. Compatibility with life path
4. Strengths and challenges
5. Career and relationship insights

Respond in ${language === 'hi' ? 'Hindi' : 'English'} language.
Keep the response clear, concise, and actionable (about 200-300 words).`;

      const model = 'gemini-1.5-flash';
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data: any = await response.json();

      // Log the full response for debugging
      console.log('📊 Gemini API Response:', JSON.stringify(data));
      console.log('📊 Response status:', response.status);

      const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!generatedText) {
        console.error('❌ Gemini API Error - Full response:', JSON.stringify(data));

        // Check for specific error messages from Gemini
        if (data.error) {
          throw new Error(`Gemini API Error: ${data.error.message || JSON.stringify(data.error)}`);
        }

        throw new Error('No content generated from Gemini API');
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: { name, analysis: generatedText, language }
        })
      };
    }

    // 404 - Endpoint not found
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({
        error: 'not_found',
        message: `Endpoint ${path} not found`,
        availableEndpoints: ['/health', '/nlg/generate', '/calculate/numerology', '/api/data/enrichment', '/nlg/analyze-name']
      })
    };

  } catch (error) {
    console.error('❌ Error:', error);
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({
        error: 'server_error',
        message: error.message || 'Internal server error'
      })
    };
  }
};
