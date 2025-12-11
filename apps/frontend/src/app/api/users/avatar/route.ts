import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/core/session'
import { minio, bucket } from '@/core/minio'

export async function GET(req: Request) {
  const u = await getCurrentUser()
  if (!u) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const url = new URL(req.url)
  const key = url.searchParams.get('key') || u.avatarKey
  if (!key) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  const signed = await minio.presignedGetObject(bucket, key, 600).catch(() => null)
  if (!signed) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  return NextResponse.json({ url: signed }, { headers: { 'Cache-Control': 'no-store' } })
}
