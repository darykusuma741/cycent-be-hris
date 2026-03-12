import z, { ZodType } from 'zod';
import { CreatePeriodicDto, GenerateAttendanceSheetDto } from './attendance_sheet.model';

export class AttendanceSheetValidation {
  // Validasi untuk GenerateAttendanceSheetDto bisa ditambahkan di sini jika diperlukan
  static readonly generateAttendanceSheets: ZodType<GenerateAttendanceSheetDto> = z.object({
    periodId: z.coerce.number().int().positive(),
  });

  static readonly createPeriodicDto: ZodType<CreatePeriodicDto> = z.object({
    name: z.string().min(1),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
  });
}
