import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
}

/**
 * Validate email address
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (US format)
 */
export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^(\+?1)?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate date format (YYYY-MM-DD)
 */
export function validateDateFormat(date: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;
  
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
}

/**
 * Validate file size (in bytes)
 */
export function validateFileSize(sizeInBytes: number, maxSizeInMB: number = 10): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return sizeInBytes <= maxSizeInBytes;
}

/**
 * Validate file type
 */
export function validateFileType(mimeType: string): boolean {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ];
  return allowedTypes.includes(mimeType);
}

/**
 * Referral form validation schema
 */
export const referralFormSchema = z.object({
  // Patient information
  patientFirstName: z.string().min(1).max(100),
  patientLastName: z.string().min(1).max(100),
  dateOfBirth: z.string().optional(),
  gender: z.string().max(50).optional(),
  
  // Contact information
  patientPhone: z.string().optional(),
  patientEmail: z.string().email().optional(),
  
  // Clinical information
  admissionDiagnosis: z.string().optional(),
  acuityLevel: z.enum(['Low', 'Moderate', 'High', 'Critical']).optional(),
  specialNeeds: z.string().optional(),
  
  // Discharge information
  estimatedDischargeDate: z.string().optional(),
  estimatedDischargeTime: z.string().optional(),
  hoursOfCareNeeded: z.number().optional(),
  
  // Income/Payment
  incomeVerified: z.enum(['yes', 'no', 'pending']).optional(),
  monthlyIncome: z.number().optional(),
  paymentMethod: z.enum(['cash', 'ltc-insurance']).optional(),
});

export type ReferralFormData = z.infer<typeof referralFormSchema>;

/**
 * Validate referral form data
 */
export function validateReferralForm(data: unknown): { valid: boolean; errors?: Record<string, string> } {
  try {
    referralFormSchema.parse(data);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { valid: false, errors };
    }
    return { valid: false, errors: { general: 'Validation error' } };
  }
}

/**
 * Sanitize referral form data
 */
export function sanitizeReferralForm(data: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
