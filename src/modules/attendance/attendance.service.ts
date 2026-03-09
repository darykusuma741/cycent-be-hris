import { UserPayload } from '@common/guard/user.payload';
import { PrismaService } from '@common/prisma/prisma.service';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AttendanceCheckInDto } from './attendance.model';
import { AttendanceHelper } from '@common/attendance/attendance.helper';
import { log } from 'node:console';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async checkIn(requestUser: Request & { user?: UserPayload }, request: AttendanceCheckInDto) {
    const employee = await this.prisma.employee.findUnique({
      where: {
        userId: requestUser.user?.id,
      },
    });

    if (!employee) throw new NotFoundException('Employee not found');

    const shift = await this.prisma.shift.findUnique({
      where: {
        id: request.shiftId,
      },
    });

    if (!shift) throw new NotFoundException('Shift not found');

    const checkInTime = new Date(); // waktu check-in saat ini (Date object)
    const today = new Date(checkInTime.getFullYear(), checkInTime.getMonth(), checkInTime.getDate()); // tanggal hari ini tanpa waktu

    const exisTingAttendance = await this.prisma.attendance.findFirst({
      where: { employeeId: employee.id, date: today },
    });

    if (exisTingAttendance) {
      throw new ConflictException('Attendance already exists for today');
    }

    log('Checkin Time:', checkInTime);
    log('Checkin Time (HH:mm):', checkInTime.toTimeString().slice(0, 5)); // "HH:mm" string
    log('Shift start time:', shift.startTime); // "HH:mm" string
    log('Shift end time:', shift.endTime); // "HH:mm" string

    const status = AttendanceHelper.determineCheckInStatus(checkInTime, shift.startTime); // tentukan status check-in (EARLY, ONTIME, LATE)
    const checkInHours = AttendanceHelper.getCheckInDuration(checkInTime, shift.startTime); // hitung durasi jam untuk check-in (float dan formatted string)
    log('Determined status:', status);
    log('Calculated check-in hours:', checkInHours);

    return await this.prisma.attendance.create({
      data: {
        employeeId: employee.id,
        checkInLatitude: request.latitude,
        checkInLongitude: request.longitude,
        checkIn: checkInTime,
        checkInHours: checkInHours.hours, // simpan jam sebagai float
        checkInHoursFormatter: checkInHours.formatted, // simpan string terformat
        checkInStatus: status,
        checkInOfficeId: request.officeId,
        date: today,
        shiftId: request.shiftId,
      },
    });
  }
}
