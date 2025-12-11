import { test, expect } from '@playwright/test'

test('login com conta fixa leva à dashboard', async ({ page }) => {
  await page.request.post('/api/dev/seed-user')
  await page.goto('/login')
  await page.getByPlaceholder('Email').fill('teste@gmail.com')
  await page.getByPlaceholder('Senha').fill('teste12345')
  await Promise.all([
    page.waitForResponse(r => r.url().endsWith('/api/auth/login') && r.status() === 200),
    page.getByRole('button', { name: 'Continuar' }).click(),
  ])
  await page.goto('/dashboard')
  await expect(page.getByText('Olá, Teste')).toBeVisible()
})
