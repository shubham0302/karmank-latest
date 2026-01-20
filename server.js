/**
 * Local development server for API endpoints
 * This runs the Vercel serverless functions locally during development
 */

import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set NODE_ENV to development for local testing
process.env.NODE_ENV = 'development';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Import and use the calculate API
app.post('/api/calculate', async (req, res) => {
  try {
    // Dynamically import the TypeScript handler
    const { default: handler } = await import('./api/calculate.ts');

    // Create mock Vercel request/response objects
    const mockReq = {
      body: req.body,
      headers: req.headers,
      method: req.method,
    };

    const mockRes = {
      status: (code) => {
        res.status(code);
        return mockRes;
      },
      json: (data) => {
        res.json(data);
      },
      setHeader: (name, value) => {
        res.setHeader(name, value);
        return mockRes;
      },
    };

    await handler(mockReq, mockRes);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n🚀 API Development Server running at http://localhost:${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/calculate\n`);
});
