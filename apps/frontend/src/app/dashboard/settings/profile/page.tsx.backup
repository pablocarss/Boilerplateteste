"use client"
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const profileSchema = z.object({ name: z.string().min(2), email: z.string().email() })
const passwordSchema = z.object({ currentPassword: z.string().min(8), newPassword: z.string().min(8) })

export default function ProfileSettings() {
  const [user, setUser] = useState<{ name: string; email: string; avatarKey?: string } | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const profileForm = useForm({ resolver: zodResolver(profileSchema), defaultValues: { name: '', email: '' } })
  const passForm = useForm({ resolver: zodResolver(passwordSchema), defaultValues: { currentPassword: '', newPassword: '' } })
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      const r = await fetch('/api/users/profile', { credentials: 'include' })
      if (!r.ok) return
      const u = await r.json()
      setUser(u)
      profileForm.reset({ name: u.name, email: u.email })
      if (u.avatarKey) {
        const a = await fetch(`/api/users/avatar?key=${encodeURIComponent(u.avatarKey)}`, { credentials: 'include' })
        if (a.ok) {
          const j = await a.json()
          setAvatarUrl(j.url)
        }
      }
    })()
  }, [profileForm])

  async function uploadAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    const fd = new FormData()
    fd.append('file', f)
    const r = await fetch('/api/users/avatar/upload', { method: 'POST', body: fd, credentials: 'include' })
    if (r.ok) {
      const j = await r.json()
      const a = await fetch(`/api/users/avatar?key=${encodeURIComponent(j.key)}`, { credentials: 'include' })
      if (a.ok) {
        const u = await a.json()
        setAvatarUrl(u.url)
      }
      setUser(prev => prev ? { ...prev, avatarKey: j.key } : prev)
      toast.success('Avatar atualizado')
      router.refresh()
    }
    else {
      toast.error('Falha ao enviar avatar')
    }
  }

  async function submitProfile(values: z.infer<typeof profileSchema>) {
    const optimistic = user ? { ...user, ...values } : null
    if (optimistic) setUser(optimistic)
    const r = await fetch('/api/users/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values), credentials: 'include' })
    if (r.ok) {
      const g = await fetch('/api/users/profile', { credentials: 'include' })
      if (g.ok) {
        const u = await g.json()
        setUser(u)
        profileForm.reset({ name: u.name, email: u.email })
      }
      toast.success('Perfil atualizado')
      router.refresh()
    }
    else {
      if (optimistic) setUser(optimistic)
      toast.error('Falha ao atualizar perfil')
    }
  }

  async function submitPassword(values: z.infer<typeof passwordSchema>) {
    await fetch('/api/users/password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) })
    passForm.reset()
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Meu perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={avatarUrl || ''} />
              <AvatarFallback>{user?.name?.[0] ?? 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <Input type="file" accept="image/*" onChange={uploadAvatar} />
            </div>
          </div>
          <form className="mt-6 space-y-4" onSubmit={profileForm.handleSubmit(submitProfile)}>
            <Input placeholder="Nome" {...profileForm.register('name')} />
            <Input placeholder="Email" type="email" {...profileForm.register('email')} />
            <Button type="submit" disabled={profileForm.formState.isSubmitting}>Salvar</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alterar senha</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={passForm.handleSubmit(submitPassword)}>
            <Input placeholder="Senha atual" type="password" {...passForm.register('currentPassword')} />
            <Input placeholder="Nova senha" type="password" {...passForm.register('newPassword')} />
            <Button type="submit">Atualizar senha</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
