import { pgTable, text, timestamp, boolean, serial, integer, date } from 'drizzle-orm/pg-core'

// ==========================================
// Better Auth Tables (Required)
// ==========================================
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// ==========================================
// Clinic Application Tables (OOP Domain Model)
// ==========================================

/**
 * Classe Specialty (Especialidade)
 * Representa as especialidades médicas da clínica
 * Princípio: Encapsulamento - agrupa dados relacionados
 */
export const specialty = pgTable('specialty', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

/**
 * Classe Doctor (Médico)
 * Representa os profissionais médicos
 * Princípio: Herança conceitual - Doctor é um tipo de usuário do sistema
 * Relacionamento: Agregação com Specialty (médico TEM especialidade)
 */
export const doctor = pgTable('doctor', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  name: text('name').notNull(),
  crm: text('crm').notNull().unique(),
  specialtyId: integer('specialtyId').notNull(),
  phone: text('phone'),
  email: text('email').notNull(),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

/**
 * Classe Patient (Paciente)
 * Representa os pacientes da clínica
 * Princípio: Abstração - encapsula todas as informações relevantes do paciente
 */
export const patient = pgTable('patient', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  name: text('name').notNull(),
  cpf: text('cpf').notNull().unique(),
  birthDate: date('birthDate').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  address: text('address'),
  healthInsurance: text('healthInsurance'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

/**
 * Classe Appointment (Agendamento)
 * Representa os agendamentos de consultas
 * Princípio: Composição - Appointment é composto por Patient e Doctor
 * Relacionamento: Associação com Patient e Doctor
 */
export const appointment = pgTable('appointment', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  patientId: integer('patientId').notNull(),
  doctorId: integer('doctorId').notNull(),
  dateTime: timestamp('dateTime').notNull(),
  duration: integer('duration').notNull().default(30),
  status: text('status').notNull().default('scheduled'),
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// ==========================================
// TypeScript Type Definitions (Interfaces OOP)
// ==========================================
export type User = typeof user.$inferSelect
export type Session = typeof session.$inferSelect
export type Account = typeof account.$inferSelect
export type Verification = typeof verification.$inferSelect
export type Specialty = typeof specialty.$inferSelect
export type Doctor = typeof doctor.$inferSelect
export type Patient = typeof patient.$inferSelect
export type Appointment = typeof appointment.$inferSelect

export type NewSpecialty = typeof specialty.$inferInsert
export type NewDoctor = typeof doctor.$inferInsert
export type NewPatient = typeof patient.$inferInsert
export type NewAppointment = typeof appointment.$inferInsert

// Appointment Status Enum (Princípio: Polimorfismo - diferentes estados)
export const AppointmentStatus = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
} as const

export type AppointmentStatusType = typeof AppointmentStatus[keyof typeof AppointmentStatus]
