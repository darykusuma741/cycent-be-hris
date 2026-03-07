import { PrismaService } from '@common/prisma/prisma.service';
import { BcryptUtil } from '@common/security/bcrypt.util';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserCreateDto, UserParamIdDto } from './users.model';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async create(request: UserCreateDto) {
    const result = await this.prisma.user.findFirst({
      where: { email: request.email },
    });

    if (result) throw new ConflictException('Email already exists');

    const hashedPassword = await BcryptUtil.hash(request.password);

    return await this.prisma.user.create({
      data: {
        name: request.name,
        email: request.email,
        password: hashedPassword,
      },
    });
  }

  async delete(request: UserParamIdDto) {
    const result = await this.prisma.user.findUnique({
      where: { id: request.id },
    });

    if (!result) throw new NotFoundException('User not found');

    return await this.prisma.user.delete({
      where: { id: request.id },
    });
  }
}
