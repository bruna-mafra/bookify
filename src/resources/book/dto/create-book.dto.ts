import { z } from 'zod';

export const createBookSchema = z.object({
  title: z.string(),
  author: z.string(),
  publisher: z.string(),
  description: z.string().optional(),
  category: z.string(),
});

export type createBookDto = z.infer<typeof createBookSchema>;
