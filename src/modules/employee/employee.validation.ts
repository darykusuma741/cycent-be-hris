import z, { ZodType } from 'zod';

export class EmployeeValidation {
  static readonly CREATE: ZodType = z.object({
    name: z.string().min(2).max(100),
    position: z
      .string()
      .max(100)
      .optional()
      .transform((val) => (val === '' ? null : val)),
    userId: z.coerce.number().optional(),
  });
}
