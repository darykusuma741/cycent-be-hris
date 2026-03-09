import z, { ZodType } from 'zod';
import { ShiftAssignmentDto, ShiftCreateDto } from './shift.model';

export class ShiftValidation {
  static create(): ZodType<ShiftCreateDto> {
    return z.object({
      name: z.string().min(2).max(100),
      startTime: z.string().min(5).max(5),
      endTime: z.string().min(5).max(5),
    });
  }

  static assign(): ZodType<ShiftAssignmentDto> {
    return z.object({
      employeeId: z.coerce.number(),
      shiftId: z.coerce.number(),
      startDateTime: z.coerce.date(),
      endDateTime: z.coerce.date(),
    });
  }
}
