'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { appointment, patient, doctor, specialty, AppointmentStatusType } from '@/lib/db/schema'
import { eq, and, gte, lte, desc, sql } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

/**
 * Classe AppointmentService
 * Implementa o padrão Service Layer para operações de Agendamento
 * Princípio OOP: Composição - Agendamento agrega Paciente e Médico
 */

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Não autorizado')
  return session.user.id
}

export async function getAppointments() {
  const userId = await getUserId()
  const appointments = await db
    .select({
      id: appointment.id,
      userId: appointment.userId,
      patientId: appointment.patientId,
      patientName: patient.name,
      patientPhone: patient.phone,
      doctorId: appointment.doctorId,
      doctorName: doctor.name,
      doctorCrm: doctor.crm,
      specialtyName: specialty.name,
      dateTime: appointment.dateTime,
      duration: appointment.duration,
      status: appointment.status,
      notes: appointment.notes,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
    })
    .from(appointment)
    .leftJoin(patient, eq(appointment.patientId, patient.id))
    .leftJoin(doctor, eq(appointment.doctorId, doctor.id))
    .leftJoin(specialty, eq(doctor.specialtyId, specialty.id))
    .where(eq(appointment.userId, userId))
    .orderBy(desc(appointment.dateTime))
  return appointments
}

export async function getAppointmentsByDate(date: Date) {
  const userId = await getUserId()
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  const appointments = await db
    .select({
      id: appointment.id,
      userId: appointment.userId,
      patientId: appointment.patientId,
      patientName: patient.name,
      patientPhone: patient.phone,
      doctorId: appointment.doctorId,
      doctorName: doctor.name,
      doctorCrm: doctor.crm,
      specialtyName: specialty.name,
      dateTime: appointment.dateTime,
      duration: appointment.duration,
      status: appointment.status,
      notes: appointment.notes,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
    })
    .from(appointment)
    .leftJoin(patient, eq(appointment.patientId, patient.id))
    .leftJoin(doctor, eq(appointment.doctorId, doctor.id))
    .leftJoin(specialty, eq(doctor.specialtyId, specialty.id))
    .where(
      and(
        eq(appointment.userId, userId),
        gte(appointment.dateTime, startOfDay),
        lte(appointment.dateTime, endOfDay)
      )
    )
    .orderBy(appointment.dateTime)
  return appointments
}

export async function getTodayAppointments() {
  return getAppointmentsByDate(new Date())
}

export async function getUpcomingAppointments(limit: number = 5) {
  const userId = await getUserId()
  const now = new Date()

  const appointments = await db
    .select({
      id: appointment.id,
      userId: appointment.userId,
      patientId: appointment.patientId,
      patientName: patient.name,
      patientPhone: patient.phone,
      doctorId: appointment.doctorId,
      doctorName: doctor.name,
      doctorCrm: doctor.crm,
      specialtyName: specialty.name,
      dateTime: appointment.dateTime,
      duration: appointment.duration,
      status: appointment.status,
      notes: appointment.notes,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
    })
    .from(appointment)
    .leftJoin(patient, eq(appointment.patientId, patient.id))
    .leftJoin(doctor, eq(appointment.doctorId, doctor.id))
    .leftJoin(specialty, eq(doctor.specialtyId, specialty.id))
    .where(and(eq(appointment.userId, userId), gte(appointment.dateTime, now)))
    .orderBy(appointment.dateTime)
    .limit(limit)
  return appointments
}

export async function getAppointmentById(id: number) {
  const userId = await getUserId()
  const result = await db
    .select({
      id: appointment.id,
      userId: appointment.userId,
      patientId: appointment.patientId,
      patientName: patient.name,
      doctorId: appointment.doctorId,
      doctorName: doctor.name,
      dateTime: appointment.dateTime,
      duration: appointment.duration,
      status: appointment.status,
      notes: appointment.notes,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
    })
    .from(appointment)
    .leftJoin(patient, eq(appointment.patientId, patient.id))
    .leftJoin(doctor, eq(appointment.doctorId, doctor.id))
    .where(and(eq(appointment.id, id), eq(appointment.userId, userId)))
  return result[0] || null
}

export async function createAppointment(data: {
  patientId: number
  doctorId: number
  dateTime: Date
  duration?: number
  notes?: string
}) {
  const userId = await getUserId()
  const result = await db
    .insert(appointment)
    .values({ ...data, userId, status: 'scheduled' })
    .returning()
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/appointments')
  return result[0]
}

export async function updateAppointment(
  id: number,
  data: {
    patientId?: number
    doctorId?: number
    dateTime?: Date
    duration?: number
    status?: AppointmentStatusType
    notes?: string
  }
) {
  const userId = await getUserId()
  const result = await db
    .update(appointment)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(appointment.id, id), eq(appointment.userId, userId)))
    .returning()
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/appointments')
  return result[0]
}

export async function updateAppointmentStatus(id: number, status: AppointmentStatusType) {
  return updateAppointment(id, { status })
}

export async function deleteAppointment(id: number) {
  const userId = await getUserId()
  await db.delete(appointment).where(and(eq(appointment.id, id), eq(appointment.userId, userId)))
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/appointments')
}

// Dashboard Statistics
export async function getDashboardStats() {
  const userId = await getUserId()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const endOfToday = new Date()
  endOfToday.setHours(23, 59, 59, 999)

  const [totalPatients] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(patient)
    .where(eq(patient.userId, userId))

  const [totalDoctors] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(doctor)
    .where(eq(doctor.userId, userId))

  const [todayAppointments] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(appointment)
    .where(
      and(
        eq(appointment.userId, userId),
        gte(appointment.dateTime, today),
        lte(appointment.dateTime, endOfToday)
      )
    )

  const [totalAppointments] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(appointment)
    .where(eq(appointment.userId, userId))

  return {
    totalPatients: totalPatients?.count || 0,
    totalDoctors: totalDoctors?.count || 0,
    todayAppointments: todayAppointments?.count || 0,
    totalAppointments: totalAppointments?.count || 0,
  }
}
