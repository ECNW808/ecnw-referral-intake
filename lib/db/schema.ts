import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  index,
} from 'drizzle-orm/pg-core';

// Facilities table
export const facilities = pgTable('facilities', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 2 }),
  zipCode: varchar('zip_code', { length: 10 }),
  magicToken: varchar('magic_token', { length: 255 }).notNull().unique(),
  magicTokenHash: varchar('magic_token_hash', { length: 255 }).notNull().unique(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Admin users table
export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }),
  role: varchar('role', { length: 50 }).default('admin'), // admin, viewer
  isActive: boolean('is_active').default(true),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Referrals table
export const referrals = pgTable('referrals', {
  id: serial('id').primaryKey(),
  facilityId: integer('facility_id').notNull(),
  
  // Patient info
  patientFirstName: varchar('patient_first_name', { length: 100 }).notNull(),
  patientLastName: varchar('patient_last_name', { length: 100 }).notNull(),
  dateOfBirth: varchar('date_of_birth', { length: 10 }),
  gender: varchar('gender', { length: 20 }),
  
  // Contact info
  patientPhone: varchar('patient_phone', { length: 20 }),
  patientEmail: varchar('patient_email', { length: 255 }),
  
  // Clinical info
  admissionDiagnosis: text('admission_diagnosis'),
  acuityLevel: varchar('acuity_level', { length: 50 }),
  specialNeeds: text('special_needs'),
  
  // Discharge info
  estimatedDischargeDate: varchar('estimated_discharge_date', { length: 10 }),
  estimatedDischargeTime: varchar('estimated_discharge_time', { length: 10 }),
  hoursOfCareNeeded: integer('hours_of_care_needed'),
  
  // Income/Payment
  incomeVerified: varchar('income_verified', { length: 20 }).default('pending'),
  monthlyIncome: integer('monthly_income'),
  paymentMethod: varchar('payment_method', { length: 50 }),
  
  // Status
  status: varchar('status', { length: 50 }).default('New'), // New, Contacted, Scheduled, Closed, Not a fit
  internalNotes: text('internal_notes'),
  
  // Metadata
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  facilityIdIdx: index('facility_id_idx').on(table.facilityId),
  statusIdx: index('status_idx').on(table.status),
  createdAtIdx: index('created_at_idx').on(table.createdAt),
}));

// Attachments table
export const attachments = pgTable('attachments', {
  id: serial('id').primaryKey(),
  referralId: integer('referral_id').notNull(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileSize: integer('file_size'),
  mimeType: varchar('mime_type', { length: 100 }),
  s3Key: varchar('s3_key', { length: 500 }).notNull(),
  uploadedBy: varchar('uploaded_by', { length: 50 }), // 'facility' or 'admin'
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  referralIdIdx: index('attachment_referral_id_idx').on(table.referralId),
}));

// Audit logs table
export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  referralId: integer('referral_id'),
  action: varchar('action', { length: 100 }).notNull(), // 'submission', 'status_change', 'note_added', etc.
  actor: varchar('actor', { length: 255 }), // email or 'system'
  actorType: varchar('actor_type', { length: 50 }), // 'facility', 'admin', 'system'
  details: jsonb('details'),
  ipAddress: varchar('ip_address', { length: 45 }),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  referralIdIdx: index('audit_log_referral_id_idx').on(table.referralId),
  createdAtIdx: index('audit_log_created_at_idx').on(table.createdAt),
}));

// Rate limit tracking
export const rateLimitTracking = pgTable('rate_limit_tracking', {
  id: serial('id').primaryKey(),
  ipAddress: varchar('ip_address', { length: 45 }).notNull().unique(),
  requestCount: integer('request_count').default(0),
  lastRequest: timestamp('last_request').defaultNow(),
  windowStart: timestamp('window_start').defaultNow(),
});

export type Facility = typeof facilities.$inferSelect;
export type AdminUser = typeof adminUsers.$inferSelect;
export type Referral = typeof referrals.$inferSelect;
export type Attachment = typeof attachments.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
