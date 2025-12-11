import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/core/session'
import { passwordSchema } from '@/modules/users/validators'
import { changePassword } from '@/modules/users/services'

export async function POST(req: Request) {
  const u = await getCurrentUser()
  if (!u) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const body = await req.json()
  const parsed = passwordSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 })
  
  try {
    await changePassword(u.id, parsed.data.currentPassword, parsed.data.newPassword)
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    if (e?.message === 'invalid_current') {
      return NextResponse.json({ error: 'invalid_current' }, { status: 400 })
    }
    if (e?.message === 'not_found') {
      return NextResponse.json({ error: 'not_found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
