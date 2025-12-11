import { getCurrentUser } from '@/core/session'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { deleteSession } from '@/modules/auth/services'
import { cookies } from 'next/headers'
import { UserHeader } from '@/components/shared/user-header'

export default async function Dashboard() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  async function Logout() {
    'use server'
    const c = await cookies()
    const id = c.get('session_id')?.value
    if (id) await deleteSession(id)
    c.set('session_id', '', { httpOnly: true, path: '/', expires: new Date(0) })
    redirect('/login')
  }
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex items-center justify-between">
        <UserHeader />
        <form action={Logout}>
          <Button type="submit" variant="outline">Sair</Button>
        </form>
      </div>
    </div>
  )
}
export const dynamic = 'force-dynamic'
export const revalidate = 0
