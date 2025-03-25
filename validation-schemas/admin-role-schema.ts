import { z } from 'zod'

const permissionsSchema = z.object({
  create: z.string({ message: 'Create permission is required' }),
  read: z.string({ message: 'Read permission is required' }),
  update: z.string({ message: 'Update permission is required' }),
  delete: z.string({ message: 'Delete permission is required' }),
})

export const roleSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Role name must be at least 3 characters long' })
    .max(50, { message: 'Role name must not exceed 50 characters' }),
  permissions: z.record(permissionsSchema),
})
