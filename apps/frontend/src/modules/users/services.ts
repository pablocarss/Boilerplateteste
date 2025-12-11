import { prisma } from '@/core/db'
import { hash, verify } from 'argon2'

export async function updateProfile(userId: string, data: { name?: string; email?: string; avatarKey?: string }) {
  return prisma.user.update({ where: { id: userId }, data })
}

export async function changePassword(userId: string, current: string, next: string) {
  const u = await prisma.user.findUnique({ where: { id: userId } })
  if (!u) throw new Error('not_found')
  const ok = await verify(u.password, current)
  if (!ok) throw new Error('invalid_current')
  const hashed = await hash(next)
  await prisma.user.update({ where: { id: userId }, data: { password: hashed } })
}
