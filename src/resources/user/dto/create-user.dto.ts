import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  password: z.string().min(1),
  cpf: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
});

export type createUserDto = z.infer<typeof createUserSchema>;
