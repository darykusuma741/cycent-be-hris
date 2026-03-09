import z, { ZodType } from 'zod';

export class OfficeValidation {
  static readonly CREATE: ZodType = z.object({
    name: z.string().min(2).max(100),
    latitude: z.coerce.number().min(-90).max(90),
    longitude: z.coerce.number().min(-180).max(180),
    radius: z.coerce.number().min(1),
  });

  static readonly OFFICE_ASSIGNMENT_CREATE: ZodType = z.object({
    officeId: z.coerce.number(),
    employeeId: z.coerce.number(),
  });

  static readonly FIND_NEARBY: ZodType = z.object({
    latitude: z.coerce.number().min(-90).max(90),
    longitude: z.coerce.number().min(-180).max(180),
  });
}
