import { test, expect } from '@playwright/test'

test('atualiza nome e envia avatar no Meu perfil', async ({ page }) => {
  await page.request.post('/api/dev/seed-user')
  await page.goto('/login')
  await page.getByPlaceholder('Email').fill('teste@gmail.com')
  await page.getByPlaceholder('Senha').fill('teste12345')
  await Promise.all([
    page.waitForResponse(r => r.url().endsWith('/api/auth/login') && r.status() === 200),
    page.getByRole('button', { name: 'Continuar' }).click(),
  ])

  await page.goto('/dashboard/settings/profile')
  await page.getByPlaceholder('Nome').fill('Novo Nome')
  await page.getByRole('button', { name: 'Salvar' }).click()
  await page.waitForFunction(() => fetch('/api/users/profile').then(r => r.json()).then(j => j.name === 'Novo Nome'))
  await page.goto('/dashboard')

  await page.goto('/dashboard/settings/profile')
  const buffer = Buffer.from('fake_png')
  await Promise.all([
    page.waitForResponse(r => r.url().endsWith('/api/users/avatar/upload') && r.status() === 200),
    page.locator('input[type="file"]').setInputFiles({ name: 'avatar.png', mimeType: 'image/png', buffer }),
  ])
})
