/**
 * Authentication Middleware for Backend API
 * Verifies Supabase JWT tokens to ensure requests are authenticated
 *
 * CRITICAL SECURITY COMPONENT - DO NOT MODIFY WITHOUT REVIEW
 */

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service key for token verification
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

/**
 * Verify authentication middleware
 * Checks for valid JWT token in Authorization header
 * Attaches user object to request if valid
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export async function verifyAuth(req, res, next) {
  try {
    // Extract Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Missing authentication token',
        error: 'MISSING_AUTH_HEADER'
      });
    }

    // Check for Bearer token format
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication format. Expected: Bearer <token>',
        error: 'INVALID_AUTH_FORMAT'
      });
    }

    // Extract token
    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Empty authentication token',
        error: 'EMPTY_TOKEN'
      });
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication token',
        error: 'TOKEN_VERIFICATION_FAILED'
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found for provided token',
        error: 'USER_NOT_FOUND'
      });
    }

    // ✅ Token is valid - attach user to request
    req.user = user;
    req.userId = user.id;

    // Log successful authentication (optional, remove in production for performance)
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Authenticated request from user: ${user.email} (${user.id})`);
    }

    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed due to server error',
      error: 'AUTH_SERVER_ERROR'
    });
  }
}

/**
 * Optional: Rate limiting middleware
 * Prevents abuse by limiting requests per user
 *
 * @param {Object} options - Rate limit options
 * @param {number} options.maxRequests - Max requests per window
 * @param {number} options.windowMs - Time window in milliseconds
 */
export function createRateLimiter(options = {}) {
  const {
    maxRequests = 100,
    windowMs = 60000 // 1 minute
  } = options;

  const requests = new Map();

  return (req, res, next) => {
    const userId = req.userId;

    if (!userId) {
      // If no user ID (shouldn't happen after verifyAuth), allow request
      return next();
    }

    const now = Date.now();
    const userRequests = requests.get(userId) || [];

    // Filter out old requests outside the window
    const recentRequests = userRequests.filter(timestamp => now - timestamp < windowMs);

    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: `Rate limit exceeded. Maximum ${maxRequests} requests per ${windowMs / 1000} seconds.`,
        error: 'RATE_LIMIT_EXCEEDED'
      });
    }

    // Add current request
    recentRequests.push(now);
    requests.set(userId, recentRequests);

    // Clean up old entries periodically
    if (Math.random() < 0.01) { // 1% chance to clean up
      for (const [uid, timestamps] of requests.entries()) {
        const valid = timestamps.filter(t => now - t < windowMs);
        if (valid.length === 0) {
          requests.delete(uid);
        } else {
          requests.set(uid, valid);
        }
      }
    }

    next();
  };
}

/**
 * Middleware to check if user has specific role
 * Use after verifyAuth middleware
 *
 * @param {string[]} allowedRoles - Array of allowed role names
 */
export function requireRole(allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user?.user_metadata?.role || 'user';

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        error: 'FORBIDDEN'
      });
    }

    next();
  };
}

export default {
  verifyAuth,
  createRateLimiter,
  requireRole
};
