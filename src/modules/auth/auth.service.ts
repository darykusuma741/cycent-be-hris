import { PrismaService } from '@common/prisma/prisma.service';
import { BcryptUtil } from '@common/security/bcrypt.util';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AuthLoginDto } from './auth.model';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from '@common/guard/user.payload';
import { RoleEnum } from '@common/config/role.enum';
import { late } from 'zod/v3';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(request: AuthLoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: request.email,
      },
      include: {
        employee: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await BcryptUtil.compare(request.password, user.password);

    if (!isPasswordValid) {
      throw new ConflictException('Invalid password');
    }

    let role: RoleEnum;
    if (Object.values(RoleEnum).includes(user.role as RoleEnum)) {
      role = user.role as RoleEnum;
    } else {
      role = RoleEnum.EMPLOYEE; // Default role jika tidak valid
    }

    const payload: UserPayload = { id: user.id, roles: [role] };
    const access_token = this.jwtService.sign(payload);
    return {
      access_token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        employee: user.employee,
      },
    };
  }
}
