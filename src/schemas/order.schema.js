import { z } from 'zod';

export const createOrderSchema = z
  .object({
    userId: z.string().uuid('userId doit être un UUID valide'),
    productIds: z
      .array(z.string().uuid('Chaque productId doit être un UUID valide'))
      .min(1, 'Une commande doit contenir au moins un produit'),
  })
  .strict();

export const updateOrderSchema = createOrderSchema.partial().strict();
