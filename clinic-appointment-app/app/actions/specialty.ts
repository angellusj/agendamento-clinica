'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { specialty } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

/**
 * Classe SpecialtyService
 * Implementa o padrão Service Layer para operações de Especialidade
 * Princípio OOP: Separação de responsabilidades
 */

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Não autorizado')
  return session.user.id
}

export async function getSpecialties() {
  await getUserId()
  return db.select().from(specialty).orderBy(asc(specialty.name))
}

export async function getSpecialtyById(id: number) {
  await getUserId()
  const result = await db.select().from(specialty).where(eq(specialty.id, id))
  return result[0] || null
}

export async function createSpecialty(data: { name: string; description?: string }) {
  await getUserId()
  const result = await db.insert(specialty).values(data).returning()
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/specialties')
  return result[0]
}

export async function updateSpecialty(id: number, data: { name?: string; description?: string }) {
  await getUserId()
  const result = await db.update(specialty).set(data).where(eq(specialty.id, id)).returning()
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/specialties')
  return result[0]
}

export async function deleteSpecialty(id: number) {
  await getUserId()
  await db.delete(specialty).where(eq(specialty.id, id))
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/specialties')
}
