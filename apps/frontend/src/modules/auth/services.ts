import { prisma } from '@/core/db'
import { redis } from '@/core/redis'
import { hash, verify } from 'argon2'

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } })
}

export async function createUser(name: string, email: string, password: string) {
  const hashed = await hash(password)
  return prisma.user.create({ data: { name, email, password: hashed } })
}

export async function verifyPassword(password: string, hashed: string) {
  return verify(hashed, password)
}

export async function createSession(userId: string, ttlSeconds: number) {
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000)
  const session = await prisma.session.create({ data: { userId, expiresAt } })
  await redis.set(`session:${session.id}`, userId, 'EX', ttlSeconds).catch(() => {})
  return { id: session.id, expiresAt }
}

export async function deleteSession(sessionId: string) {
  await prisma.session.delete({ where: { id: sessionId } }).catch(() => {})
  await redis.del(`session:${sessionId}`).catch(() => {})
}

export async function getUserBySession(sessionId: string) {
  const uid = await redis.get(`session:${sessionId}`).catch(() => null)
  if (uid) return prisma.user.findUnique({ where: { id: uid } })
  const s = await prisma.session.findUnique({ where: { id: sessionId } })
  if (!s) return null
  if (s.expiresAt.getTime() < Date.now()) return null
  return prisma.user.findUnique({ where: { id: s.userId } })
}
