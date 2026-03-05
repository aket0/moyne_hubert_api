import { z } from 'zod';

export const createRatingSchema = z
  .object({
    userId: z.string().uuid('userId doit être un UUID valide'),
    productId: z.string().uuid('productId doit être un UUID valide'),
    score: z.number().int('La note doit être un entier').min(1).max(5),
  })
  .strict();

export const updateRatingSchema = createRatingSchema
  .pick({ score: true })
  .partial()
  .strict()
  .refine((data) => data.score !== undefined, {
    message: 'Au moins un champ est requis',
    path: ['score'],
  });
