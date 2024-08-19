import { z } from 'zod';

export const authenticateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type AuthenticateUser = z.infer<typeof authenticateUserSchema>;
