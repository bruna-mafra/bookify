import { z } from 'zod';

export const updateBookSchema = z
  .object({
    title: z.string(),
    author: z.string(),
    publisher: z.string(),
    ownerId: z.string(),
    publicatedAt: z.date(),
    description: z.string(),
    price: z.number(),
    condition: z.string(),
  })
  .optional();

export type updateBookDto = z.infer<typeof updateBookSchema>;
