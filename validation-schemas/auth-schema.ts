import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export const registerSchema = z
  .object({
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    username: z.string().min(3, { message: 'Username must be at least 3 characters' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
    firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
    lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
    confirmPassword: z
      .string()
      .min(6, { message: 'Confirm password must be at least 6 characters.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
