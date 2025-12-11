import Link from 'next/link'
import { LogOut, Home, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-background">
      <div className="p-4 text-xl font-semibold">App</div>
      <nav className="space-y-1 px-2">
        <Link href="/dashboard" className="flex items-center gap-2 rounded px-3 py-2 hover:bg-muted">
          <Home className="h-4 w-4" />
          <span>Início</span>
        </Link>
        <div className="mt-4 px-3 text-xs font-medium text-muted-foreground">Configurações</div>
        <Link href="/dashboard/settings/profile" className="flex items-center gap-2 rounded px-3 py-2 hover:bg-muted">
          <User className="h-4 w-4" />
          <span>Meu perfil</span>
        </Link>
      </nav>
      <div className="mt-auto p-4">
        <form action={async () => { 'use server' }}>
          <Button variant="ghost" className="w-full justify-start" type="submit">
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </form>
      </div>
    </aside>
  )
}
