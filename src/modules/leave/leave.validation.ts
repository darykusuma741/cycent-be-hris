import z, { ZodType } from 'zod';
import { ApproveLeaveDto, RejectLeaveDto, RequestMyLeaveDto } from './leave.model';

export class LeaveValidation {
  static readonly requestMyLeaveDto: ZodType<RequestMyLeaveDto> = z.object({
    type: z.string().min(2).max(100),
    reason: z
      .string()
      .max(200)
      .optional()
      .transform((val) => (val === '' ? null : val)),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
  });

  static readonly approveLeaveDto: ZodType<ApproveLeaveDto> = z.object({
    leaveId: z.coerce.number().int().positive(),
  });
  static readonly rejectLeaveDto: ZodType<RejectLeaveDto> = z.object({
    leaveId: z.coerce.number().int().positive(),
  });
}
