import { UserPayload } from '@common/guard/user.payload';
import { PrismaService } from '@common/prisma/prisma.service';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AttendanceCheckInDto, AttendanceCheckOutDto } from './attendance.model';
import { AttendanceHelper } from '@common/attendance/attendance.helper';
import { log } from 'node:console';

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
        checkOutStatus: 'NOT_CHECKED_OUT',
        date: today,
        shiftId: request.shiftId,
      },
    });
  }

  async checkOut(request: AttendanceCheckOutDto) {
    const attendance = await this.prisma.attendance.findUnique({
      where: {
        id: request.attendanceId,
      },
      include: {
        shift: true,
      },
    });

    if (!attendance) throw new NotFoundException('Attendance not found');
    if (attendance.shift === null) throw new NotFoundException('Shift data not found for this attendance record');

    const checkOutTime = new Date(); // waktu check-out saat ini (Date object)
    const status = AttendanceHelper.determineCheckOutStatus(checkOutTime, attendance.shift.endTime); // tentukan status check-out (ONTIME, LEFT_EARLY, OVERTIME)
    const checkOutHours = AttendanceHelper.getCheckOutDuration(checkOutTime, attendance.shift.endTime); // hitung durasi jam untuk check-out (float dan formatted string)

    return await this.prisma.attendance.update({
      where: { id: request.attendanceId },
      data: {
        checkOutLatitude: request.latitude,
        checkOutLongitude: request.longitude,
        checkOut: checkOutTime,
        checkOutHours: checkOutHours.hours, // simpan jam sebagai float
        checkOutHoursFormatted: checkOutHours.formatted, // simpan string terformat
        checkOutStatus: status,
        checkOutOfficeId: request.officeId,
      },
    });
  }

  async attendanceToday(requestUser: Request & { user?: UserPayload }) {
    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const attendance = await this.prisma.attendance.findFirst({
      where: {
        employee: {
          userId: requestUser.user?.id,
        },
        checkIn: {
          gte: startOfToday,
          lte: endOfToday,
        },
        // checkOut: null, // belum checkout
      },
      include: {
        shift: true,
      },
      orderBy: {
        checkIn: 'desc',
      },
    });

    // if (!attendance) throw new NotFoundException('Data Not Found');

    return attendance;
  }
}
