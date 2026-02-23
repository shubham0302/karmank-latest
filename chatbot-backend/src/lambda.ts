/**
 * AWS Lambda Handler for KarmAnk Backend
 *
 * This handles all backend API endpoints:
 * - /nlg/generate - Natural language generation
 * - /calculate/numerology - Numerology calculations
 * - /api/data/enrichment - Data enrichment
 * - /nlg/analyze-name - Name analysis
 * - /nlg/analyze-signature - Signature analysis with image
 * - /nlg/palmistry-analysis - Palmistry/Nadi Shastra analysis with palm and thumb images
 */

import { createHmac } from 'crypto';
import { calculateCompleteNumerology } from './services/numerology-calculator.js';
import { dataService } from './services/data-service.js';
import { DATA } from './data/proprietary-data.js';

// Get environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.SERVER_KEY_GEMINI || '';
const ASTROLOGY_API_URL = process.env.ASTROLOGY_API_URL || 'http://localhost:8000';
// SUPABASE_JWT_SECRET: copy from Supabase Dashboard → Project Settings → API → JWT Secret
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET || '';
// ALLOWED_ORIGINS: comma-separated list, e.g. "https://karmank.com,https://karmank.vercel.app"
const ALLOWED_ORIGINS_ENV = process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || '';

// In-memory cache for NLG results (reduces API costs)
const cache = new Map();
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

// ---------------------------------------------------------------------------
// Supabase JWT verifier — HS256, no external library (Node.js crypto only)
// Returns decoded payload on success, null on invalid/expired token
// ---------------------------------------------------------------------------
function verifySupabaseJWT(token: string, secret: string): Record<string, any> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, signatureB64] = parts;
    // Verify HMAC-SHA256 signature
    const expected = createHmac('sha256', secret)
      .update(`${headerB64}.${payloadB64}`)
      .digest('base64url');
    if (expected !== signatureB64) return null;
    // Decode payload and check expiry
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

// Endpoints that anyone can call without a login token
const PUBLIC_PATHS = new Set(['/health', '/', '/feedback']);

export const handler = async (event) => {
  // 1. Setup Headers for CORS — restrict to configured origins when env var is set
  const requestOrigin = event.headers?.origin || event.headers?.Origin || '';
  const allowedOriginsList: string[] = ALLOWED_ORIGINS_ENV
    ? ALLOWED_ORIGINS_ENV.split(',').map((o: string) => o.trim()).filter(Boolean)
    : [];
  // If ALLOWED_ORIGINS is configured, echo matching origin; otherwise fall back to wildcard
  const corsOrigin = allowedOriginsList.length > 0
    ? (allowedOriginsList.includes(requestOrigin) ? requestOrigin : allowedOriginsList[0])
    : '*';
  const headers = {
    "Access-Control-Allow-Origin": corsOrigin,
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

    // 4a. JWT Authentication guard
    // Skipped when: (a) path is in PUBLIC_PATHS, or (b) SUPABASE_JWT_SECRET not configured yet
    if (!PUBLIC_PATHS.has(path) && SUPABASE_JWT_SECRET) {
      const authHeader = event.headers?.authorization || event.headers?.Authorization || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
      if (!token) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'unauthorized', message: 'Authentication required' })
        };
      }
      const jwtPayload = verifySupabaseJWT(token, SUPABASE_JWT_SECRET);
      if (!jwtPayload) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'unauthorized', message: 'Invalid or expired token' })
        };
      }
      console.log(`🔐 Authenticated: user ${jwtPayload.sub}`);
    }

    // 4. Route to appropriate handler

    // Health check endpoint
    if (path === '/health' || path === '/') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'ok',
          service: 'KarmAnk Backend API (AWS Lambda)',
          version: '2.0.0',
          endpoints: {
            numerology: [
              'POST /calculate/numerology',
              'POST /api/data/enrichment',
              'POST /nlg/generate',
              'POST /nlg/analyze-name',
              'POST /nlg/analyze-signature',
              'POST /nlg/palmistry-analysis',
              'POST /feedback',
              'POST /api/chat',
            ],
            astrology: [
              'GET  /api/astrology/status',
              'POST /api/astrology/chart/calculate',
              'POST /api/astrology/yogas/detect',
              'POST /api/astrology/yogas/current-active',
              'POST /api/astrology/dasha/timeline',
              'POST /api/astrology/dasha/current',
              'POST /api/astrology/shadbala/calculate',
              'POST /api/astrology/divisional-charts/calculate',
              'POST /api/astrology/transits/current',
              'POST /api/astrology/transits/on-date',
              'POST /api/astrology/life-predictions/yearly-timeline',
              'POST /api/astrology/life-predictions/major-life-events',
              'POST /api/astrology/life-predictions/life-area-analysis',
              'POST /api/astrology/remedies/personalized',
              'GET  /api/astrology/remedies/general',
              'GET  /api/astrology/remedies/gemstones',
              'GET  /api/astrology/remedies/mantras',
              'POST /api/astrology/compatibility/calculate',
              'POST /api/astrology/ai-astrologer/chat',
              'POST /api/astrology/nadi/classify-thumbprint',
              'POST /api/astrology/geocode',
              'POST /api/astrology/timezone',
            ]
          },
          astrology_backend: ASTROLOGY_API_URL,
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
            temperature: 0.7,           // Balanced creativity
            maxOutputTokens: 1500,      // ✅ Increased for detailed year forecasts
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

      const result = await calculateCompleteNumerology(dob, DATA);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, data: result })
      };
    }

    // Data Enrichment Endpoint
    if (path === '/api/data/enrichment' && method === 'POST') {
      const { basicNumber, destinyNumber, yogaIds, kundliGrid, recurringNumbers, currentMahaDasha, currentYearlyDasha } = requestBody;

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
        recurringNumbers: recurringNumbers || [],
        currentMahaDasha: currentMahaDasha || null,
        currentYearlyDasha: currentYearlyDasha || null
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, data: enrichmentData })
      };
    }

    // Feedback Endpoint (public)
    if (path === '/feedback' && method === 'POST') {
      const { name, email, category, rating, message, source, submittedAt } = requestBody;

      if (!name || !email || !message) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'invalid_input',
            message: 'name, email and message are required'
          })
        };
      }

      const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
      if (!emailRegex.test(String(email))) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'invalid_input',
            message: 'email is invalid'
          })
        };
      }

      const parsedRating = Number(rating);
      if (!Number.isFinite(parsedRating) || parsedRating < 1 || parsedRating > 5) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'invalid_input',
            message: 'rating must be between 1 and 5'
          })
        };
      }

      const safeCategory = ['general', 'feature', 'bug', 'appreciation'].includes(String(category))
        ? String(category)
        : 'general';

      // Keep payload in logs for operational follow-up without exposing full message body.
      console.log('Feedback received:', JSON.stringify({
        name: String(name),
        email: String(email),
        category: safeCategory,
        rating: parsedRating,
        messagePreview: String(message).slice(0, 200),
        source: String(source || 'unknown'),
        submittedAt: String(submittedAt || new Date().toISOString()),
      }));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Feedback submitted successfully'
        })
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

      const model = 'gemini-2.5-flash';
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

    // Signature Analysis Endpoint (with image support)
    if (path === '/nlg/analyze-signature' && method === 'POST') {
      try {
        const { prompt, imageBase64 } = requestBody;

        if (!prompt) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'invalid_input', message: 'Prompt is required' })
          };
        }

        if (!imageBase64) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'invalid_input', message: 'Signature image is required' })
          };
        }

        if (!GEMINI_API_KEY) {
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'server_configuration_error', message: 'API key not configured' })
          };
        }

        // Use Gemini 2.5 Flash for vision capabilities (same as numerology endpoint)
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

        const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: 'image/png',
                  data: imageBase64
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
            topP: 0.95,
            topK: 40
          }
        })
      });

      const data: any = await response.json();
      console.log('📊 Gemini vision response status:', response.status);
      console.log('📊 Full Gemini response:', JSON.stringify(data));

      const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!generatedText) {
        console.error('❌ Gemini Vision API Error - No text generated');
        console.error('❌ Full response:', JSON.stringify(data));

        if (data.error) {
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
              error: 'gemini_api_error',
              message: data.error.message || 'Gemini API error',
              details: data.error
            })
          };
        }

        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            error: 'no_content_generated',
            message: 'No content generated from Gemini API',
            candidates: data.candidates
          })
        };
      }

      console.log('✅ Generated text length:', generatedText.length);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: { text: generatedText }
        })
      };
      } catch (signatureError: any) {
        console.error('❌ Signature analysis error:', signatureError);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            error: 'signature_analysis_error',
            message: signatureError.message || 'Failed to analyze signature'
          })
        };
      }
    }

    // Palmistry Analysis Endpoint (with palm, thumb, and optional full-hand images)
    if (path === '/nlg/palmistry-analysis' && method === 'POST') {
      try {
        const { systemInstruction, prompt, palmImage, thumbImage, fullHandImage, userInfo } = requestBody;

        if (!prompt || !palmImage || !thumbImage) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              error: 'invalid_input',
              message: 'System instruction, prompt, palm image, and thumb image are required'
            })
          };
        }

        // Build image parts array - palm and thumb required, full-hand optional
        const imageParts: any[] = [
          { text: prompt },
          {
            inline_data: {
              mime_type: 'image/png',
              data: palmImage
            }
          },
          {
            inline_data: {
              mime_type: 'image/png',
              data: thumbImage
            }
          }
        ];

        // Add full-hand image if provided (for finger ratio validation)
        if (fullHandImage) {
          console.log('📸 Including full-hand image for finger analysis');
          imageParts.push({
            inline_data: {
              mime_type: 'image/png',
              data: fullHandImage
            }
          });
        }

        // Use Gemini 2.5 Flash for vision capabilities
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

        // Retry logic with temperature ramp - reduces "Divine Interference" errors by ~60%
        const temperatureRamp = [0.4, 0.55, 0.7]; // Start low, increase on retry
        const maxAttempts = 3;
        let lastError: any = null;
        let generatedText: string | null = null;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
          const currentTemp = temperatureRamp[attempt];
          console.log(`🔄 Attempt ${attempt + 1}/${maxAttempts} with temperature ${currentTemp}`);

          try {
            const response = await fetch(geminiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                system_instruction: {
                  parts: [{ text: systemInstruction }]
                },
                contents: [{
                  role: "user",
                  parts: imageParts
                }],
                generationConfig: {
                  temperature: currentTemp,
                  maxOutputTokens: 65536,
                  topP: 0.95,
                  topK: 40,
                  response_mime_type: "application/json"
                }
              })
            });

            const data: any = await response.json();
            console.log(`📊 Attempt ${attempt + 1} response status:`, response.status);

            // Check for API errors
            if (data.error) {
              console.warn(`⚠️ Attempt ${attempt + 1} API error:`, data.error.message);
              lastError = data.error;

              // Don't retry on quota/rate limit errors
              if (data.error.message?.includes('quota') || data.error.message?.includes('429')) {
                break;
              }
              continue;
            }

            generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!generatedText) {
              console.warn(`⚠️ Attempt ${attempt + 1} returned no text`);
              lastError = { message: 'No content generated' };
              continue;
            }

            // Quick validation - check for critical JSON structure
            try {
              const parsed = JSON.parse(generatedText);

              // Check for minimum required fields
              const hasKandas = parsed.kandas && typeof parsed.kandas === 'object';
              const hasYogas = Array.isArray(parsed.yogas) && parsed.yogas.length >= 1;
              const hasLines = parsed.majorLines || parsed.lineDetectionProof;

              if (!hasKandas || !hasYogas) {
                console.warn(`⚠️ Attempt ${attempt + 1} incomplete response (kandas: ${hasKandas}, yogas: ${hasYogas})`);
                lastError = { message: 'Incomplete response structure' };
                continue;
              }

              // Valid response - break out of retry loop
              console.log(`✅ Attempt ${attempt + 1} succeeded with valid structure`);
              break;

            } catch (parseErr) {
              console.warn(`⚠️ Attempt ${attempt + 1} JSON parse failed:`, parseErr);
              lastError = { message: 'Invalid JSON response' };
              continue;
            }

          } catch (fetchErr: any) {
            console.error(`❌ Attempt ${attempt + 1} fetch error:`, fetchErr.message);
            lastError = fetchErr;
            continue;
          }
        }

        // After all attempts
        if (!generatedText) {
          console.error('❌ All retry attempts failed');
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
              error: 'gemini_api_error',
              message: lastError?.message || 'Failed after 3 attempts',
              details: lastError,
              attempts: maxAttempts
            })
          };
        }

        console.log('✅ Generated palmistry analysis length:', generatedText.length);

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            data: { text: generatedText }
          })
        };
      } catch (palmistryError) {
        console.error('❌ Palmistry analysis error:', palmistryError);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            error: 'palmistry_analysis_error',
            message: palmistryError.message || 'Failed to analyze palmistry'
          })
        };
      }
    }

    // Chat Endpoint - Advanced LLM-powered chatbot
    if (path === '/api/chat' && method === 'POST') {
      const { message, prompt, userContext, conversationId, language } = requestBody;

      console.log('💬 Chat request received:', {
        message: message?.substring(0, 50),
        hasPrompt: !!prompt,
        userName: userContext?.name,
        language
      });

      if (!prompt || !prompt.systemPrompt || !prompt.userMessage) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'Invalid request - prompt object with systemPrompt and userMessage required'
          })
        };
      }

      if (!GEMINI_API_KEY) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'API key not configured'
          })
        };
      }

      // Build comprehensive prompt for Gemini
      const fullPrompt = `${prompt.systemPrompt}

CONTEXT:
${prompt.context || ''}

CONVERSATION HISTORY:
${prompt.conversationHistory || 'This is the first message.'}

RESPONSE INSTRUCTIONS:
${prompt.instructions || ''}

USER QUESTION: ${prompt.userMessage}

ISHIRA'S RESPONSE (in simple, layman language):`;

      console.log('🤖 Sending to Gemini... (prompt length:', fullPrompt.length, 'chars)');

      try {
        // Use Gemini 2.5 Flash for fast responses
        const model = 'gemini-2.5-flash';
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: fullPrompt }] }],
            generationConfig: {
              temperature: 0.7,
              topP: 0.8,
              topK: 40,
              maxOutputTokens: 1500  // ✅ Increased for complete responses
            }
          })
        });

        const data: any = await response.json();

        // Extract generated text
        const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!aiResponse) {
          console.error('❌ Gemini API Error:', JSON.stringify(data));

          // Check for specific errors
          if (data.error) {
            throw new Error(`Gemini API Error: ${data.error.message || JSON.stringify(data.error)}`);
          }

          throw new Error('No response generated from Gemini');
        }

        console.log('✅ Gemini response received:', aiResponse.substring(0, 100), '...');

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            response: aiResponse,
            conversationId: conversationId || 'default'
          })
        };

      } catch (chatError) {
        console.error('❌ Chat endpoint error:', chatError);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'Failed to generate response',
            message: chatError.message || 'Internal server error'
          })
        };
      }
    }

    // ========================================================================
    // ASTROLOGY ENGINE — Proxy to Swiss Ephemeris FastAPI backend
    //
    // Flutter calls:  POST /api/astrology/chart/calculate
    // Lambda proxies: POST ${ASTROLOGY_API_URL}/api/chart/calculate
    //
    // Path transform: /api/astrology/X/Y  →  /api/X/Y
    // (strips the /astrology segment so FastAPI sees its native paths)
    //
    // Set env var ASTROLOGY_API_URL when deploying Lambda to point at your
    // deployed FastAPI service (Railway / Render / EC2 etc.).
    // ========================================================================

    // Dedicated status check — tells Flutter whether astrology engine is online
    if (path === '/api/astrology/status' && method === 'GET') {
      try {
        const healthRes = await fetch(`${ASTROLOGY_API_URL}/api/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const healthData = await healthRes.json();
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            online: healthRes.ok,
            astrology_api_url: ASTROLOGY_API_URL,
            backend_status: healthData,
          }),
        };
      } catch {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            online: false,
            astrology_api_url: ASTROLOGY_API_URL,
            backend_status: null,
          }),
        };
      }
    }

    // Generic proxy for all /api/astrology/* routes
    if (path.startsWith('/api/astrology/')) {
      // /api/astrology/chart/calculate  →  /api/chart/calculate
      // /api/astrology/yogas/detect     →  /api/yogas/detect
      // /api/astrology/geocode          →  /api/geocode
      const fastApiPath = path.replace('/api/astrology/', '/api/');
      const fastApiUrl = `${ASTROLOGY_API_URL}${fastApiPath}`;

      console.log(`🌟 Astrology proxy: ${method} ${fastApiUrl}`);

      try {
        const fetchOptions: any = {
          method,
          headers: { 'Content-Type': 'application/json' },
        };
        // Forward raw body as-is (already validated JSON from the client)
        if (method !== 'GET' && method !== 'HEAD') {
          fetchOptions.body = event.body || '{}';
        }

        const proxyResponse = await fetch(fastApiUrl, fetchOptions);
        const responseText = await proxyResponse.text();

        return {
          statusCode: proxyResponse.status,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: responseText,
        };

      } catch (astroError: any) {
        console.error('❌ Astrology proxy error:', astroError.message);
        return {
          statusCode: 503,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'astrology_engine_unavailable',
            message: 'The Vedic calculation engine is temporarily unavailable. Please try again later.',
            hint: `Set ASTROLOGY_API_URL env var to point at your deployed FastAPI backend (currently: ${ASTROLOGY_API_URL})`,
          }),
        };
      }
    }

    // 404 - Endpoint not found
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({
        error: 'not_found',
        message: `Endpoint ${path} not found`,
        availableEndpoints: [
          'GET  /health',
          'POST /nlg/generate',
          'POST /calculate/numerology',
          'POST /api/data/enrichment',
          'POST /nlg/analyze-name',
          'POST /nlg/analyze-signature',
          'POST /nlg/palmistry-analysis',
          'POST /api/chat',
          'POST /feedback',
          'GET  /api/astrology/status',
          'POST /api/astrology/chart/calculate',
          'POST /api/astrology/yogas/detect',
          'POST /api/astrology/dasha/timeline',
          'POST /api/astrology/dasha/current',
          'POST /api/astrology/shadbala/calculate',
          'POST /api/astrology/divisional-charts/calculate',
          'POST /api/astrology/transits/current',
          'POST /api/astrology/life-predictions/yearly-timeline',
          'POST /api/astrology/remedies/personalized',
          'GET  /api/astrology/remedies/general',
          'POST /api/astrology/compatibility/calculate',
          'POST /api/astrology/ai-astrologer/chat',
          'POST /api/astrology/nadi/classify-thumbprint',
          'POST /api/astrology/geocode',
          'POST /api/astrology/timezone',
        ],
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
