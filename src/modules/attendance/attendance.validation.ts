import z, { ZodType } from 'zod';
import { AttendanceCheckInDto } from './attendance.model';

export class AttendanceValidation {
  static readonly CheckIn: ZodType<AttendanceCheckInDto> = z.object({
    latitude: z.coerce.number().min(-90).max(90),
    longitude: z.coerce.number().min(-180).max(180),
    shiftId: z.coerce.number().min(1).default(1),
    officeId: z.coerce.number().min(1).default(1),
  });
}
