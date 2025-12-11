import { NextResponse } from 'next/server'
import { registerSchema } from '@/modules/auth/validators'
import { createUser, findUserByEmail } from '@/modules/auth/services'

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 })
  const { name, email, password } = parsed.data
  const exists = await findUserByEmail(email)
  if (exists) return NextResponse.json({ error: 'email_taken' }, { status: 409 })
  await createUser(name, email, password)
  return NextResponse.json({ ok: true }, { status: 201 })
}
