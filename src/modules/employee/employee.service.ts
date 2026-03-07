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
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async findAll() {
    return this.prisma.employee.findMany({});
  }

  async create(req: EmployeeCreateDto) {
    return this.prisma.employee.create({
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
}
