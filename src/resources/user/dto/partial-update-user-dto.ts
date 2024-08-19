import { z } from 'zod';

export const partialUpdateUserSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  password: z.string().min(1).optional(),
});

export type partialUpdateUserDto = z.infer<typeof partialUpdateUserSchema>;
