import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/core/session'
import { minio, bucket } from '@/core/minio'
import crypto from 'node:crypto'

export async function POST(req: Request) {
  const u = await getCurrentUser()
  if (!u) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const form = await req.formData()
  const file = form.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'no_file' }, { status: 400 })
  const buf = Buffer.from(await file.arrayBuffer())
  const key = `avatars/${u.id}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`
  const exists = await minio.bucketExists(bucket).catch(() => false)
  if (!exists) await minio.makeBucket(bucket, 'us-east-1').catch(() => {})
  await minio.putObject(bucket, key, buf, buf.length, { 'Content-Type': file.type || 'application/octet-stream' })
  const stat = await minio.statObject(bucket, key).catch(() => null)
  if (!stat) return NextResponse.json({ error: 'upload_failed' }, { status: 500 })
  await minio.removeObject(bucket, u.avatarKey || '').catch(() => {})
  await (await import('@/modules/users/services')).updateProfile(u.id, { avatarKey: key })
  return NextResponse.json({ ok: true, key })
}
