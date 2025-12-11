import { NextResponse } from 'next/server'
import { loginSchema } from '@/modules/auth/validators'
import { findUserByEmail, verifyPassword, createSession } from '@/modules/auth/services'

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 })
  const { email, password } = parsed.data
  const user = await findUserByEmail(email)
  if (!user) return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 })
  const ok = await verifyPassword(password, user.password)
  if (!ok) return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 })
  const ttl = 60 * 60 * 24 * 7
  const s = await createSession(user.id, ttl)
  const res = NextResponse.json({ ok: true })
  res.cookies.set('session_id', s.id, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: s.expiresAt,
  })
  return res
}
