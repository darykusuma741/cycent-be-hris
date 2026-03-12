import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { CreatePayrollPeriodDto, GeneratePayrollDto } from './payroll.model';

@Injectable()
export class PayrollService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Buat payroll period baru
   */
  async createPayrollPeriod(req: CreatePayrollPeriodDto) {
    const startDate = new Date(req.startDate);
    const endDate = new Date(req.endDate);

    // Cek apakah ada periode yang tumpang tindih
    const existingPeriod = await this.prisma.payrollPeriod.findFirst({
      where: {
        OR: [
          { startDate: { lte: endDate, gte: startDate } },
          { endDate: { lte: endDate, gte: startDate } },
          { AND: [{ startDate: { lte: startDate } }, { endDate: { gte: endDate } }] },
        ],
      },
    });

    if (existingPeriod) {
      throw new ConflictException('Payroll period overlaps with an existing period');
    }

    // Buat payroll period baru
    return await this.prisma.payrollPeriod.create({
      data: {
        name: req.name,
        startDate,
        endDate,
        attendancePeriodId: req.attendancePeriodId, // Hubungkan dengan AttendancePeriod
        isClosed: false,
      },
    });
  }

  /**
   * Generate payroll untuk semua employee di periode tertentu
   */
  async generatePayroll(req: GeneratePayrollDto) {
    // Ambil payroll period
    const period = await this.prisma.payrollPeriod.findUnique({
      where: { id: req.periodId },
    });
    if (!period) throw new NotFoundException('Payroll period not found');

    // Ambil semua attendanceSheet di periode tersebut
    const sheets = await this.prisma.attendanceSheet.findMany({
      where: {
        periodId: period.attendancePeriodId, // Hubungkan ke AttendancePeriod
      },
      include: {
        employee: true,
      },
    });

    for (const sheet of sheets) {
      // Ambil gaji pokok employee, tunjangan, dsb
      // Misal basicSalary disimpan di Employee (bisa diubah sesuai kebutuhan)
      const basicSalary = sheet.employee.salary || 0;
      const allowances = sheet.employee.allowances || 0;

      // Potongan bisa dari bolos, terlambat, izin lebih
      const lateDeduction = sheet.totalLate * 10000; // contoh: 10k per keterlambatan
      const earlyLeaveDeduction = sheet.totalEarlyLeave * 10000;
      const absentDeduction = sheet.totalAbsentDays * 50000; // contoh: 50k per absen
      const totalDeductions = lateDeduction + earlyLeaveDeduction + absentDeduction;

      // Overtime
      const overtimePay = sheet.totalOvertime * 20000; // contoh: 20k per jam lembur

      // Gaji bersih
      const netSalary = basicSalary + allowances + overtimePay - totalDeductions;

      // Upsert payroll
      await this.prisma.payroll.upsert({
        where: {
          employeeId_payrollPeriodId: {
            employeeId: sheet.employeeId,
            payrollPeriodId: req.periodId,
          },
        },
        update: {
          basicSalary,
          allowances,
          deductions: totalDeductions,
          overtimePay,
          netSalary,
          attendanceSheetId: sheet.id,
        },
        create: {
          employeeId: sheet.employeeId,
          payrollPeriodId: req.periodId,
          attendanceSheetId: sheet.id,
          basicSalary,
          allowances,
          deductions: totalDeductions,
          overtimePay,
          netSalary,
        },
      });
    }

    return { message: 'Payroll successfully generated' };
  }
}
