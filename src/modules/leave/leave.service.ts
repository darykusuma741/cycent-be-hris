import { PrismaService } from '@common/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ApproveLeaveDto, RejectLeaveDto, RequestMyLeaveDto } from './leave.model';
import { UserPayload } from '@common/guard/user.payload';
import { log } from 'node:console';
import { stat } from 'node:fs';

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

    const leavePolicy = await this.prisma.leavePolicy.findUnique({
      where: {
        leaveType: request.type,
      },
    });

    if (!leavePolicy) throw new NotFoundException('Leave policy not found for the specified type');

    const startDate = new Date(request.startDate);
    const endDate = new Date(request.endDate);
    const totalLeaveDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24) + 1;
    const summedLeaveDays = await this.prisma.leave.aggregate({
      where: {
        employeeId: employee.id,
        leaveType: request.type,
        status: 'Approved',
      },
      _sum: {
        totalDays: true,
      },
    });

    const totalUsedLeaveDays = summedLeaveDays._sum.totalDays || 0;
    const remainingLeaveDays = leavePolicy.annualQuota - totalUsedLeaveDays;

    if (totalLeaveDays > remainingLeaveDays) {
      throw new NotFoundException(`Insufficient leave balance. You have ${remainingLeaveDays} ${request.type} leave days remaining.`);
    }

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
    if (status === 'Approved') {
      const leave = await this.prisma.leave.findUnique({
        where: { id: leaveId },
      });

      if (!leave) throw new NotFoundException('Leave request not found');

      const leavePolicy = await this.prisma.leavePolicy.findUnique({
        where: {
          leaveType: leave.leaveType,
        },
      });

      if (!leavePolicy) throw new NotFoundException('Leave policy not found for the specified type');

      const startDate = new Date(leave.startDate);
      const endDate = new Date(leave.endDate);
      const totalLeaveDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24) + 1;

      const summedLeaveDays = await this.prisma.leave.aggregate({
        where: {
          employeeId: leave.employeeId,
          leaveType: leave.leaveType,
          status: 'Approved',
        },
        _sum: {
          totalDays: true,
        },
      });

      const totalUsedLeaveDays = summedLeaveDays._sum.totalDays || 0;
      const remainingLeaveDays = leavePolicy.annualQuota - totalUsedLeaveDays;

      if (totalLeaveDays > remainingLeaveDays) {
        throw new NotFoundException(`Insufficient leave balance. The employee has ${remainingLeaveDays} ${leave.leaveType} leave days remaining.`);
      }
    }

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
