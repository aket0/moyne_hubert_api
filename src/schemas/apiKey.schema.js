import { z } from 'zod';

export const createApiKeySchema = z
  .object({
    name: z.string().min(1, 'Le nom est requis').max(100).trim().optional(),
    masterSecret: z.string().min(1, 'masterSecret requis'),
  })
  .strict();
