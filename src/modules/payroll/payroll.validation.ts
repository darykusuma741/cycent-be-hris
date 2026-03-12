import z, { ZodType } from 'zod';
import { CreatePayrollPeriodDto, GeneratePayrollDto } from './payroll.model';

export class PayrollValidation {
  // Validasi untuk GenerateAttendanceSheetDto bisa ditambahkan di sini jika diperlukan
  static readonly generatePayroll: ZodType<GeneratePayrollDto> = z.object({
    periodId: z.coerce.number().int().positive(),
  });

  static readonly createPayrollPeriod: ZodType<CreatePayrollPeriodDto> = z.object({
    name: z.string().min(1),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    attendancePeriodId: z.coerce.number().int().positive(),
  });
}
