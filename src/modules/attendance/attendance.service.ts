import { PrismaService } from '@common/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}
}
