"use client"
import { useEffect, useState } from 'react'

export function UserHeader() {
  const [name, setName] = useState<string>('')
  useEffect(() => {
    ;(async () => {
      const r = await fetch(`/api/users/profile?t=${Date.now()}`, { credentials: 'include', cache: 'no-store' })
      if (!r.ok) return
      const j = await r.json()
      setName(j.name)
    })()
  }, [])
  return <h1 className="text-2xl font-semibold">Olá, {name}</h1>
}
