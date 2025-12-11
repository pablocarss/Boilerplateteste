import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/core/session'
import { profileSchema } from '@/modules/users/validators'
import { updateProfile } from '@/modules/users/services'

export async function GET() {
  const u = await getCurrentUser()
  if (!u) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  return NextResponse.json(
    { id: u.id, name: u.name, email: u.email, avatarKey: u.avatarKey },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}

export async function PATCH(req: Request) {
  const u = await getCurrentUser()
  if (!u) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const body = await req.json()
  const parsed = profileSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 })
  try {
    const updated = await updateProfile(u.id, parsed.data)
    return NextResponse.json(
      { id: updated.id, name: updated.name, email: updated.email, avatarKey: updated.avatarKey },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (e: any) {
    if (e?.code === 'P2002') return NextResponse.json({ error: 'email_taken' }, { status: 409 })
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
