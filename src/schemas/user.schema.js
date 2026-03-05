import { z } from 'zod';

export const createUserSchema = z
  .object({
    firstName: z.string().min(1, 'Le prénom est requis').max(100).trim(),
    lastName: z.string().min(1, 'Le nom est requis').max(100).trim(),
    email: z.string().email('Email invalide').max(255).trim().toLowerCase(),
  })
  .strict();

export const updateUserSchema = createUserSchema.partial().strict();
