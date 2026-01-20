// Minimal Lambda handler for testing
// This verifies basic Lambda functionality and CORS

export const handler = async (event) => {
  console.log('📥 Event received:', JSON.stringify(event));

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400"
  };

  const method = event.requestContext?.http?.method || event.httpMethod || 'GET';
  const path = event.rawPath || event.requestContext?.http?.path || '/';

  console.log(`📍 Method: ${method}, Path: ${path}`);

  // Handle OPTIONS (CORS preflight)
  if (method === 'OPTIONS') {
    console.log('✅ Responding to OPTIONS preflight');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS preflight successful' })
    };
  }

  // Simple health check
  if (path === '/health' || path === '/') {
    console.log('✅ Health check successful');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'ok',
        message: 'Lambda is working!',
        timestamp: new Date().toISOString(),
        nodeVersion: process.version
      })
    };
  }

  // Echo endpoint for testing
  if (path === '/echo') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Echo successful',
        method,
        path,
        body: event.body,
        headers: event.headers
      })
    };
  }

  // 404 for unknown paths
  return {
    statusCode: 404,
    headers,
    body: JSON.stringify({
      error: 'Not found',
      path,
      method
    })
  };
};
