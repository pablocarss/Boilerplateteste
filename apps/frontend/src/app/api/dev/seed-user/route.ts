import { NextResponse } from 'next/server'
import { prisma } from '@/core/db'
import { hash } from 'argon2'

export async function POST() {
  if (process.env.NODE_ENV === 'production') return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const email = 'teste@gmail.com'
  const name = 'Teste'
  const password = 'teste12345'
  const hashed = await hash(password)
  const existing = await prisma.user.findUnique({ where: { email } })
  if (!existing) {
    await prisma.user.create({ data: { email, name, password: hashed } })
  } else {
    await prisma.user.update({ where: { email }, data: { name, password: hashed } })
  }
  return NextResponse.json({ ok: true })
}
