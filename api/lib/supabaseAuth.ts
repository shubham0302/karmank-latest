import { createClient } from "@supabase/supabase-js";

// Lazy initialization of Supabase client to avoid errors when env vars are missing
let supabase: any = null;

function getSupabaseClient() {
  if (!supabase) {
    // Try both naming conventions: VITE_* for local dev and plain names for Vercel
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase credentials not configured");
    }

    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
}

/**
 * Verifies the Supabase JWT token from the Authorization header
 * @param request - The request object
 * @returns Object with user data or error
 */
export async function verifyAuth(request: any) {
  try {
    // Extract token from Authorization header
    const authHeader =
      request.headers.authorization || request.headers.Authorization;
    if (!authHeader) {
      return { error: "Missing authorization header", status: 401 };
    }

    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return { error: "Invalid authorization header format", status: 401 };
    }

    // Get Supabase client and verify token
    const client = getSupabaseClient();
    const { data, error } = await client.auth.getUser(token);

    if (error || !data.user) {
      return { error: "Invalid or expired token", status: 401 };
    }

    return { user: data.user, status: 200 };
  } catch (error) {
    console.error("Auth verification error:", error);
    return { error: "Authentication failed", status: 401 };
  }
}

/**
 * Validates date of birth format (YYYY-MM-DD)
 * @param dob - Date of birth string
 * @returns true if valid, false otherwise
 */
export function validateDOB(dob: string): boolean {
  const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dobRegex.test(dob)) return false;

  const date = new Date(dob + "T00:00:00");
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Validates name (not empty, reasonable length)
 * @param name - Name string
 * @returns true if valid, false otherwise
 */
export function validateName(name: string): boolean {
  return (
    typeof name === "string" && name.trim().length > 0 && name.length <= 100
  );
}

/**
 * Validates gender
 * @param gender - Gender string
 * @returns true if valid, false otherwise
 */
export function validateGender(gender: string): boolean {
  return ["male", "female", "other"].includes(gender);
}
