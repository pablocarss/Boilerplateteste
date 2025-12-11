import { NextResponse } from 'next/server'
import { deleteSession } from '@/modules/auth/services'

export async function POST(req: Request) {
  const cookie = req.headers.get('cookie') || ''
  const id = cookie.split(';').map(s => s.trim()).find(s => s.startsWith('session_id='))?.split('=')[1]
  if (id) await deleteSession(id)
  const res = NextResponse.json({ ok: true })
  res.cookies.set('session_id', '', { httpOnly: true, path: '/', expires: new Date(0) })
  return res
}
