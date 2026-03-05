import { z } from 'zod';

export const createProductSchema = z
  .object({
    name: z.string().min(3, 'Le nom doit faire au moins 3 caractères').max(255).trim(),
    price: z.number().positive('Le prix doit être positif'),
    category: z.string().min(1, 'La catégorie est requise').max(100).trim(),
  })
  .strict();

export const updateProductSchema = createProductSchema.partial().strict();

export const queryParamsSchema = z.object({
  sortBy: z.enum(['name', 'price', 'category']).optional(),
  order: z.enum(['asc', 'desc']).optional().default('asc'),
});
