import { z } from 'zod'

/**
 * Validation schemas for KarmAnk application
 * Prevents injection attacks, XSS, and data corruption
 */

// ============================================================================
// FAMILY MEMBER VALIDATION
// ============================================================================

export const FamilyMemberSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')
    .transform((val) => val.trim()),

  gender: z.enum(['Male', 'Female', 'Other'], {
    errorMap: () => ({ message: 'Gender must be Male, Female, or Other' })
  }),

  date_of_birth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine((date) => {
      const d = new Date(date)
      return d instanceof Date && !isNaN(d.getTime())
    }, 'Invalid date')
    .refine((date) => {
      const d = new Date(date)
      return d < new Date()
    }, 'Date of birth cannot be in the future')
    .refine((date) => {
      const d = new Date(date)
      const minDate = new Date('1900-01-01')
      return d >= minDate
    }, 'Date of birth cannot be before 1900'),

  birth_place: z
    .string()
    .min(1, 'Birth place is required')
    .max(200, 'Birth place must be less than 200 characters')
    .transform((val) => val.trim()),

  birth_time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Birth time must be in HH:MM format (24-hour)')
    .nullable()
    .optional(),

  relationship: z.enum(['self', 'spouse', 'child', 'parent', 'sibling', 'other'], {
    errorMap: () => ({ message: 'Invalid relationship type' })
  }).default('other'),

  display_order: z.number().int().min(1).optional()
})

export type FamilyMember = z.infer<typeof FamilyMemberSchema>

// ============================================================================
// NUMEROLOGY REQUEST VALIDATION
// ============================================================================

export const NumerologyRequestSchema = z.object({
  dob: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine((date) => {
      const d = new Date(date)
      return d instanceof Date && !isNaN(d.getTime())
    }, 'Invalid date')
    .refine((date) => {
      const d = new Date(date)
      return d < new Date()
    }, 'Date cannot be in the future')
    .refine((date) => {
      const d = new Date(date)
      const minDate = new Date('1900-01-01')
      return d >= minDate
    }, 'Date cannot be before 1900')
})

export type NumerologyRequest = z.infer<typeof NumerologyRequestSchema>

// ============================================================================
// ENRICHMENT DATA REQUEST VALIDATION
// ============================================================================

export const EnrichmentRequestSchema = z.object({
  basicNumber: z.number().int().min(1).max(9),
  destinyNumber: z.number().int().min(1).max(9),
  yogaIds: z.array(z.string()).default([]),
  kundliGrid: z.array(z.number().int().min(0)).length(10).optional(),
  recurringNumbers: z.array(z.number().int().min(1).max(9)).default([])
})

export type EnrichmentRequest = z.infer<typeof EnrichmentRequestSchema>

// ============================================================================
// EMAIL VALIDATION
// ============================================================================

export const EmailSchema = z
  .string()
  .email('Invalid email address')
  .min(5, 'Email is too short')
  .max(255, 'Email is too long')
  .toLowerCase()
  .transform((val) => val.trim())

// ============================================================================
// OTP VALIDATION
// ============================================================================

export const OTPSchema = z
  .string()
  .regex(/^\d{6}$/, 'OTP must be exactly 6 digits')

// ============================================================================
// SANITIZATION UTILITIES
// ============================================================================

/**
 * Sanitizes HTML to prevent XSS attacks
 * Converts dangerous characters to HTML entities
 */
export function sanitizeHTML(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Sanitizes input for safe display
 * Trims whitespace and removes control characters
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
}

/**
 * Validates and sanitizes a family member object
 * Throws ZodError if validation fails
 */
export function validateAndSanitizeFamilyMember(data: unknown): FamilyMember {
  const validated = FamilyMemberSchema.parse(data)

  return {
    ...validated,
    name: sanitizeInput(validated.name),
    birth_place: sanitizeInput(validated.birth_place)
  }
}

/**
 * Validates email with additional security checks
 */
export function validateEmail(email: unknown): string {
  const validated = EmailSchema.parse(email)

  // Additional security: block disposable email domains (optional)
  const disposableDomains = ['tempmail.com', 'throwaway.email', '10minutemail.com']
  const domain = validated.split('@')[1]

  if (disposableDomains.includes(domain)) {
    throw new Error('Disposable email addresses are not allowed')
  }

  return validated
}

/**
 * Safely handles validation errors for user display
 */
export function formatValidationError(error: unknown): string {
  if (error instanceof z.ZodError) {
    const firstError = error.errors[0]
    return firstError.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Invalid input data'
}
