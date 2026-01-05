// NLG Server - Lambda Version
// This is the Lambda-compatible version without the server.listen() call

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { calculateCompleteNumerology } from './services/numerology-calculator.js';
import { dataService } from './services/data-service.js';
import { DATA } from './data/proprietary-data.js';

dotenv.config();

export const app = express();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// Middleware - Allow all origins for Lambda
app.use(cors({
  origin: '*', // Lambda Function URL needs this
  credentials: true,
}));
app.use(express.json());

// In-memory cache for NLG results
const cache = new Map<string, { text: string; timestamp: number }>();
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'KarmAnk NLG Server (Lambda)' });
});

app.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'KarmAnk Backend API',
    version: '1.0.0',
    endpoints: ['/health', '/nlg/generate', '/calculate/numerology', '/api/data/enrichment', '/nlg/analyze-name']
  });
});

// NLG Generation Endpoint
app.post('/nlg/generate', async (req: Request, res: Response) => {
  try {
    const { prompt, cacheKey, nlgType } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt is required' });
    }

    // Check cache
    const cached = cache.get(cacheKey || prompt);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
      console.log('✅ Returning cached response');
      return res.json({ success: true, text: cached.text, cached: true });
    }

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ success: false, message: 'API key not configured' });
    }

    const model = 'gemini-1.5-flash';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

    const response = await axios.post(apiUrl, {
      contents: [{ parts: [{ text: prompt }] }]
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000
    });

    const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('No content generated');
    }

    // Cache the result
    cache.set(cacheKey || prompt, { text: generatedText, timestamp: Date.now() });

    return res.json({ success: true, text: generatedText, cached: false });
  } catch (err: any) {
    console.error('NLG Error:', err.message);
    return res.status(500).json({
      success: false,
      message: err.response?.data?.error?.message || 'Failed to generate text'
    });
  }
});

// Numerology Calculation Endpoint
app.post('/calculate/numerology', async (req: Request, res: Response) => {
  try {
    const { dob } = req.body;

    if (!dob) {
      return res.status(400).json({ error: 'invalid_input', message: 'Date of birth is required' });
    }

    const result = await calculateCompleteNumerology(dob, DATA);
    return res.json({ success: true, data: result });
  } catch (err: any) {
    console.error('Calculation error:', err.message);
    return res.status(500).json({
      error: 'calculation_error',
      message: err.message || 'Failed to calculate numerology'
    });
  }
});

// Data Enrichment Endpoint
app.post('/api/data/enrichment', async (req: Request, res: Response) => {
  try {
    const { basicNumber, destinyNumber, yogaIds, kundliGrid, recurringNumbers, currentMahaDasha, currentYearlyDasha } = req.body;

    if (!basicNumber || !destinyNumber) {
      return res.status(400).json({ error: 'invalid_input', message: 'Basic and destiny numbers required' });
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

    return res.json({ success: true, data: enrichmentData });
  } catch (err: any) {
    console.error('Enrichment error:', err.message);
    return res.status(500).json({
      error: 'enrichment_error',
      message: err.message || 'Failed to fetch enrichment data'
    });
  }
});

// Name Analysis Endpoint
app.post('/nlg/analyze-name', async (req: Request, res: Response) => {
  try {
    const { name, language = 'en' } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'invalid_input', message: 'Name is required' });
    }

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'server_configuration_error', message: 'API key not configured' });
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
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

    const response = await axios.post(apiUrl, {
      contents: [{ parts: [{ text: prompt }] }]
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000
    });

    const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('No content generated from Gemini API');
    }

    return res.json({
      success: true,
      data: { name, analysis: generatedText, language }
    });
  } catch (err: any) {
    console.error('Name analysis error:', err.message);
    return res.status(500).json({
      error: 'name_analysis_error',
      message: err.response?.data?.error?.message || 'Failed to analyze name'
    });
  }
});

// Export app for Lambda handler
export default app;
