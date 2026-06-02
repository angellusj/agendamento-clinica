'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { patient } from '@/lib/db/schema'
import { eq, asc, and, ilike, or } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

/**
 * Classe PatientService
 * Implementa o padrão Service Layer para operações de Paciente
 * Princípio OOP: Abstração das operações de persistência
 */

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Não autorizado')
  return session.user.id
}

export async function getPatients() {
  const userId = await getUserId()
  return db
    .select()
    .from(patient)
    .where(eq(patient.userId, userId))
    .orderBy(asc(patient.name))
}

export async function searchPatients(search: string) {
  const userId = await getUserId()
  return db
    .select()
    .from(patient)
    .where(
      and(
        eq(patient.userId, userId),
        or(
          ilike(patient.name, `%${search}%`),
          ilike(patient.cpf, `%${search}%`),
          ilike(patient.phone, `%${search}%`)
        )
      )
    )
    .orderBy(asc(patient.name))
}

export async function getPatientById(id: number) {
  const userId = await getUserId()
  const result = await db
    .select()
    .from(patient)
    .where(and(eq(patient.id, id), eq(patient.userId, userId)))
  return result[0] || null
}

export async function createPatient(data: {
  name: string
  cpf: string
  birthDate: string
  phone: string
  email?: string
  address?: string
  healthInsurance?: string
}) {
  const userId = await getUserId()
  const result = await db.insert(patient).values({ ...data, userId }).returning()
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/patients')
  return result[0]
}

export async function updatePatient(
  id: number,
  data: {
    name?: string
    cpf?: string
    birthDate?: string
    phone?: string
    email?: string
    address?: string
    healthInsurance?: string
  }
) {
  const userId = await getUserId()
  const result = await db
    .update(patient)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(patient.id, id), eq(patient.userId, userId)))
    .returning()
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/patients')
  return result[0]
}

export async function deletePatient(id: number) {
  const userId = await getUserId()
  await db.delete(patient).where(and(eq(patient.id, id), eq(patient.userId, userId)))
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/patients')
}
