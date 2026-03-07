import z, { ZodType } from 'zod';

export class UsersValidation {
  static readonly PARAM_ID: ZodType = z.object({
    id: z.coerce.number().min(1),
  });

  static readonly CREATE: ZodType = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(1),
  });
}
