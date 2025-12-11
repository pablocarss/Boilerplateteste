"use client"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

const schema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(8) })

export default function RegisterPage() {
  const router = useRouter()
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { name: "", email: "", password: "" } })

  const onSubmit = async (values: z.infer<typeof schema>) => {
    const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) })
    if (res.ok) { router.push('/login'); return }
  }

  return (
    <div className="container mx-auto max-w-md px-6 py-24">
      <Card>
        <CardHeader>
          <CardTitle>Registrar</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <Input placeholder="Nome" {...form.register("name")} />
            <Input placeholder="Email" type="email" {...form.register("email")} />
            <Input placeholder="Senha" type="password" {...form.register("password" )} />
            <Button type="submit" className="w-full">Criar conta</Button>
          </form>
          <div className="mt-4 text-sm">
            Já tem conta? <Link href="/login" className="underline">Entrar</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
