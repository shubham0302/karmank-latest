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

import { calculateCompleteNumerology } from './services/numerology-calculator.js';
import { dataService } from './services/data-service.js';
import { DATA } from './data/proprietary-data.js';

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
          endpoints: ['/health', '/nlg/generate', '/calculate/numerology', '/api/data/enrichment', '/nlg/analyze-name', '/nlg/analyze-signature']
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

    // Palmistry Analysis Endpoint (with palm and thumb images)
    if (path === '/nlg/palmistry-analysis' && method === 'POST') {
      try {
        const { systemInstruction, prompt, palmImage, thumbImage, userInfo } = requestBody;

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

        // Use Gemini 2.5 Flash for vision capabilities
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: systemInstruction }]
            },
            contents: [{
              role: "user",
              parts: [
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
              ]
            }],
            generationConfig: {
              temperature: 0.4, // Lower temperature for more consistent palmistry readings
              maxOutputTokens: 8192, // Large output for comprehensive analysis
              topP: 0.95,
              topK: 40,
              response_mime_type: "application/json" // Request JSON response
            }
          })
        });

        const data: any = await response.json();
        console.log('📊 Gemini palmistry response status:', response.status);

        const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!generatedText) {
          console.error('❌ Gemini Palmistry API Error - No text generated');
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

    // 404 - Endpoint not found
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({
        error: 'not_found',
        message: `Endpoint ${path} not found`,
        availableEndpoints: ['/health', '/nlg/generate', '/calculate/numerology', '/api/data/enrichment', '/nlg/analyze-name', '/nlg/analyze-signature', '/api/chat']
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
