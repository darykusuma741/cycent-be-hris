import { PrismaService } from '@common/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ApproveLeaveDto, RejectLeaveDto, RequestMyLeaveDto } from './leave.model';
import { UserPayload } from '@common/guard/user.payload';
import { log } from 'node:console';

type LeaveStatus = 'Approved' | 'Rejected';

@Injectable()
export class LeaveService {
  constructor(private readonly prisma: PrismaService) {}

  async requestLeave(requestUser: Request & { user?: UserPayload }, request: RequestMyLeaveDto) {
    const employee = await this.prisma.employee.findUnique({
      where: {
        userId: requestUser.user?.id,
      },
    });

    if (!employee) throw new NotFoundException('Employee not found');

    const totalLeaveDays = (new Date(request.endDate).getTime() - new Date(request.startDate).getTime()) / (1000 * 3600 * 24) + 1;
    log('Start Date:', request.startDate);
    log('End Date:', request.endDate);
    log('Start Date (ms):', new Date(request.startDate).getTime());
    log('End Date (ms):', new Date(request.endDate).getTime());
    log('Total Leave Days:', totalLeaveDays);

    const leave = await this.prisma.leave.create({
      data: {
        leaveType: request.type,
        reason: request.reason,
        startDate: request.startDate,
        endDate: request.endDate,
        employeeId: employee.id,
        status: 'Pending',
        totalDays: totalLeaveDays,
      },
    });
    return leave;
  }

  async updateLeaveStatus(requestUser: Request & { user?: UserPayload }, leaveId: number, status: LeaveStatus) {
    const leave = await this.prisma.leave.findUnique({
      where: { id: leaveId },
    });

    if (!leave) throw new NotFoundException('Leave request not found');

    const updatedLeave = await this.prisma.leave.update({
      where: { id: leaveId },
      data: {
        status,
        approvedBy: requestUser.user?.id,
      },
    });

    return updatedLeave;
  }

  async approveLeave(requestUser: Request & { user?: UserPayload }, request: ApproveLeaveDto) {
    return await this.updateLeaveStatus(requestUser, request.leaveId, 'Approved');
  }

  async rejectLeave(requestUser: Request & { user?: UserPayload }, request: RejectLeaveDto) {
    return await this.updateLeaveStatus(requestUser, request.leaveId, 'Rejected');
  }
}
