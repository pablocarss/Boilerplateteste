import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, LogIn, UserPlus } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight">SaaS Boilerplate</h1>
          <p className="mt-4 text-muted-foreground">Landing page inicial com CTA para autenticação.</p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg"><LogIn className="mr-2 h-5 w-5" /> Entrar</Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline"><UserPlus className="mr-2 h-5 w-5" /> Registrar</Button>
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Assinaturas</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Integração com AbacatePay e webhooks.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Plugins</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Arquitetura extensível por plugins.</p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-10 flex items-center justify-center">
          <Link href="/login">
            <Button variant="link">Começar agora <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
