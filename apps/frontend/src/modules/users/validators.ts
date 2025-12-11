import { z } from 'zod'

export const profileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
})

export const passwordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
})
