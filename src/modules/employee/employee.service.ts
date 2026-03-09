import { PrismaService } from '@common/prisma/prisma.service';
import { BcryptUtil } from '@common/security/bcrypt.util';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { EmployeeCreateDto } from './employee.model';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from '@common/guard/user.payload';
import { RoleEnum } from '@common/config/role.enum';
import { log } from 'node:console';

@Injectable()
export class EmployeeService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.employee.findMany({});
  }

  async create(req: EmployeeCreateDto) {
    const employee = await this.prisma.employee.findUnique({
      where: { userId: req.userId },
    });

    if (employee) throw new ConflictException('User already has employee data');

    return await this.prisma.employee.create({
      data: {
        name: req.name,
        position: req.position,
        userId: req.userId,
      },
      include: {
        user: true,
      },
    });
  }

  async myData(requestUser: Request & { user?: UserPayload }) {
    if (!requestUser.user) {
      throw new NotFoundException('User not found');
    }

    const employee = await this.prisma.employee.findUnique({
      where: { userId: requestUser.user.id },
      include: { user: true },
    });

    if (!employee) {
      throw new NotFoundException('Employee data not found');
    }

    return employee;
  }
}
