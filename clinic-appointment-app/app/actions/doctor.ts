'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { doctor, specialty } from '@/lib/db/schema'
import { eq, asc, and } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

/**
 * Classe DoctorService
 * Implementa o padrão Service Layer para operações de Médico
 * Princípio OOP: Encapsulamento de lógica de negócio
 */

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Não autorizado')
  return session.user.id
}

export async function getDoctors() {
  const userId = await getUserId()
  const doctors = await db
    .select({
      id: doctor.id,
      userId: doctor.userId,
      name: doctor.name,
      crm: doctor.crm,
      specialtyId: doctor.specialtyId,
      specialtyName: specialty.name,
      phone: doctor.phone,
      email: doctor.email,
      active: doctor.active,
      createdAt: doctor.createdAt,
      updatedAt: doctor.updatedAt,
    })
    .from(doctor)
    .leftJoin(specialty, eq(doctor.specialtyId, specialty.id))
    .where(eq(doctor.userId, userId))
    .orderBy(asc(doctor.name))
  return doctors
}

export async function getActiveDoctors() {
  const userId = await getUserId()
  const doctors = await db
    .select({
      id: doctor.id,
      userId: doctor.userId,
      name: doctor.name,
      crm: doctor.crm,
      specialtyId: doctor.specialtyId,
      specialtyName: specialty.name,
      phone: doctor.phone,
      email: doctor.email,
      active: doctor.active,
      createdAt: doctor.createdAt,
      updatedAt: doctor.updatedAt,
    })
    .from(doctor)
    .leftJoin(specialty, eq(doctor.specialtyId, specialty.id))
    .where(and(eq(doctor.userId, userId), eq(doctor.active, true)))
    .orderBy(asc(doctor.name))
  return doctors
}

export async function getDoctorById(id: number) {
  const userId = await getUserId()
  const result = await db
    .select()
    .from(doctor)
    .where(and(eq(doctor.id, id), eq(doctor.userId, userId)))
  return result[0] || null
}

export async function createDoctor(data: {
  name: string
  crm: string
  specialtyId: number
  phone?: string
  email: string
}) {
  const userId = await getUserId()
  const result = await db.insert(doctor).values({ ...data, userId }).returning()
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/doctors')
  return result[0]
}

export async function updateDoctor(
  id: number,
  data: {
    name?: string
    crm?: string
    specialtyId?: number
    phone?: string
    email?: string
    active?: boolean
  }
) {
  const userId = await getUserId()
  const result = await db
    .update(doctor)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(doctor.id, id), eq(doctor.userId, userId)))
    .returning()
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/doctors')
  return result[0]
}

export async function deleteDoctor(id: number) {
  const userId = await getUserId()
  await db.delete(doctor).where(and(eq(doctor.id, id), eq(doctor.userId, userId)))
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/doctors')
}
