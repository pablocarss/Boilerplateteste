import { test, expect } from '@playwright/test'

test('troca nome e email, faz logout e login com email novo', async ({ page, request }) => {
  await request.post('/api/dev/seed-user')
  await page.goto('/login')
  await page.getByPlaceholder('Email').fill('teste@gmail.com')
  await page.getByPlaceholder('Senha').fill('teste12345')
  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.waitForURL('**/dashboard')

  const newName = `Nome Atualizado ${Date.now()}`
  const newEmail = `novo${Date.now()}@gmail.com`

  await page.goto('/dashboard/settings/profile')
  await page.getByPlaceholder('Nome').fill(newName)
  await page.getByPlaceholder('Email').fill(newEmail)
  await page.getByRole('button', { name: 'Salvar' }).click()

  // Aguarda perfil refletir mudanças
  await page.waitForFunction(async (expectedName, expectedEmail) => {
    const r = await fetch('/api/users/profile', { credentials: 'include' })
    if (!r.ok) return false
    const j = await r.json()
    return j.name === expectedName && j.email === expectedEmail
  }, newName, newEmail)

  // Vai ao dashboard (sem assert visual ainda)
  await page.goto('/dashboard')

  // Logout
  await Promise.all([
    page.waitForNavigation({ url: /\/login$/ }),
    page.getByRole('main').getByRole('button', { name: 'Sair' }).click(),
  ])

  // Login com email novo
  await page.getByPlaceholder('Email').fill(newEmail)
  await page.getByPlaceholder('Senha').fill('teste12345')
  await Promise.all([
    page.waitForResponse(r => r.url().endsWith('/api/auth/login') && r.status() === 200),
    page.getByRole('button', { name: 'Continuar' }).click(),
  ])
  await page.goto('/dashboard')
  await page.waitForFunction(async (expectedName) => {
    const r = await fetch('/api/users/profile', { credentials: 'include' })
    if (!r.ok) return false
    const j = await r.json()
    return j.name === expectedName
  }, newName)
  await expect(page.locator('main h1')).toContainText(newName)
})
