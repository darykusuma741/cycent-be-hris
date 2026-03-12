import { PrismaService } from '@common/prisma/prisma.service';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePeriodicDto, GenerateAttendanceSheetDto } from './attendance_sheet.model';
import { log } from 'node:console';

@Injectable()
export class AttendanceSheetService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generate AttendanceSheet untuk setiap employee di periode tertentu
   * Termasuk rekap hari tidak masuk (exclude Sabtu & Minggu)
   */
  async generateAttendanceSheets(req: GenerateAttendanceSheetDto) {
    // Ambil periode
    const period = await this.prisma.attendancePeriod.findUnique({
      where: { id: req.periodId },
    });
    if (!period) throw new NotFoundException('Attendance period not found');

    // Ambil semua employee
    const employees = await this.prisma.employee.findMany();

    // Buat daftar semua tanggal kerja di periode (exclude Sabtu & Minggu)
    const workDates: Date[] = [];
    for (let d = new Date(period.startDate); d <= period.endDate; d.setDate(d.getDate() + 1)) {
      const day = d.getDay(); // 0 = Minggu, 6 = Sabtu
      if (day !== 0 && day !== 6) {
        workDates.push(new Date(d));
      }
    }

    for (const employee of employees) {
      // Ambil semua attendance employee di periode tersebut
      const attendances = await this.prisma.attendance.findMany({
        where: {
          employeeId: employee.id,
          date: {
            gte: period.startDate,
            lte: period.endDate,
          },
        },
      });

      // Hitung semua total
      let totalPresent = 0;
      let totalLate = 0;
      let totalEarlyLeave = 0;
      let totalOvertime = 0;
      let totalLeaveDays = 0;
      let totalAbsentDays = 0;
      let totalNotCheckedOut = 0;

      const absentDates: string[] = [];

      for (const date of workDates) {
        // cari attendance di tanggal ini
        const att = attendances.find((a) => a.date.toDateString() === date.toDateString());

        if (!att) {
          // kalau tidak ada attendance → Absent
          totalAbsentDays++;
          absentDates.push(date.toISOString().split('T')[0]);
        } else {
          // kalau ada attendance → hitung normal
          if (att.checkInStatus && att.checkInStatus !== 'Absent') totalPresent++;
          if (att.checkInStatus === 'LATE') totalLate++;
          if (att.checkOutStatus === 'LEFT_EARLY') totalEarlyLeave++;
          if (att.checkOutStatus === 'OVERTIME' && att.checkOutHours) totalOvertime += att.checkOutHours;
          if (att.checkOutStatus === 'NOT_CHECKED_OUT') totalNotCheckedOut++;
          if (att.checkInStatus === 'Leave') totalLeaveDays += att.checkInHours || 1;
        }
      }

      log('Employee:', employee.name);
      log('Total Present:', totalPresent);
      log('Total Late:', totalLate);
      log('Total Early Leave:', totalEarlyLeave);
      log('Total Overtime:', totalOvertime);
      log('Total Leave Days:', totalLeaveDays);
      log('Total Absent Days:', totalAbsentDays);
      log('Total Not Checked Out:', totalNotCheckedOut);
      log('---');

      // Gunakan upsert: update kalau sudah ada, create kalau belum ada
      await this.prisma.attendanceSheet.upsert({
        where: {
          employeeId_periodId: {
            employeeId: employee.id,
            periodId: period.id,
          },
        },
        update: {
          totalPresent,
          totalLate,
          totalEarlyLeave,
          totalOvertime,
          totalLeaveDays,
          totalAbsentDays,
          totalNotCheckedOut,
          absentDates: absentDates.join(', '),
        },
        create: {
          employeeId: employee.id,
          periodId: period.id,
          totalPresent,
          totalLate,
          totalEarlyLeave,
          totalOvertime,
          totalLeaveDays,
          totalAbsentDays,
          totalNotCheckedOut,
          absentDates: absentDates.join(', '),
        },
      });
    }

    return { message: 'Attendance sheets successfully generated' };
  }

  async createPeriodic(req: CreatePeriodicDto) {
    const startDate = new Date(req.startDate);
    const endDate = new Date(req.endDate);

    const existingPeriod = await this.prisma.attendancePeriod.findFirst({
      where: {
        OR: [
          { startDate: { lte: endDate, gte: startDate } },
          { endDate: { lte: endDate, gte: startDate } },
          { AND: [{ startDate: { lte: startDate } }, { endDate: { gte: endDate } }] },
        ],
      },
    });

    if (existingPeriod) {
      throw new ConflictException('Attendance period overlaps with an existing period');
    }

    return await this.prisma.attendancePeriod.create({
      data: {
        name: req.name,
        startDate,
        endDate,
      },
    });
  }
}
