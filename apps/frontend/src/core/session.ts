import { cookies } from 'next/headers'
import { getUserBySession } from '@/modules/auth/services'

export async function getCurrentUser() {
  const c = await cookies()
  const id = c.get('session_id')?.value
  if (!id) return null
  return getUserBySession(id)
}
