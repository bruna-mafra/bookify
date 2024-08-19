import { z } from 'zod';

export const createReviewSchema = z.object({
  userId: z.string(),
  rating: z.number(),
  comment: z.string(),
  bookId: z.string(),
});

export type createReviewDto = z.infer<typeof createReviewSchema>;
