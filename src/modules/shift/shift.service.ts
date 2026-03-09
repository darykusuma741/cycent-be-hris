import { PrismaService } from '@common/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ShiftAssignmentDto, ShiftCreateDto } from './shift.model';
import { UserPayload } from '@common/guard/user.payload';

@Injectable()
export class ShiftService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.shift.findMany({});
  }

  async create(shiftData: ShiftCreateDto) {
    return this.prisma.shift.create({
      data: {
        name: shiftData.name,
        startTime: shiftData.startTime,
        endTime: shiftData.endTime,
      },
    });
  }

  async createAssignment(assignmentData: ShiftAssignmentDto) {
    return this.prisma.shiftAssignment.create({
      data: {
        employeeId: assignmentData.employeeId,
        shiftId: assignmentData.shiftId,
        startDateTime: assignmentData.startDateTime,
        endDateTime: assignmentData.endDateTime,
      },
    });
  }

  async getMyShiftToday(requestUser: Request & { user?: UserPayload }) {
    if (!requestUser.user) {
      throw new Error('User not found');
    }

    const today = new Date();
    // const today = new Date('2026-02-01');
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    return this.prisma.shiftAssignment.findMany({
      where: {
        employee: {
          userId: requestUser.user.id,
        },
        OR: [
          {
            startDateTime: { gte: startOfDay, lt: endOfDay }, // shift yang mulai hari ini
          },
          {
            startDateTime: { lt: startOfDay },
            endDateTime: { gt: startOfDay }, // shift malam yang mulai kemarin
          },
        ],
      },
      include: {
        employee: true,
        shift: true,
      },
    });
  }
}
