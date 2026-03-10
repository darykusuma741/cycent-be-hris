import { PrismaClient } from '@generated/prisma/client';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL as string,
    });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    await this.ensureDefaultLeavePolicy();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private async ensureDefaultLeavePolicy() {
    const defaultPolicies = [
      { leaveType: 'Annual', annualQuota: 12 }, // Contoh kebijakan cuti tahunan
      { leaveType: 'Sick', annualQuota: 10 }, // Contoh kebijakan cuti sakit
      { leaveType: 'Permission', annualQuota: 5 }, // Contoh kebijakan cuti izin
    ];

    for (const policy of defaultPolicies) {
      await this.leavePolicy.upsert({
        where: { leaveType: policy.leaveType },
        update: {},
        create: policy,
      });
    }

    console.log('Default LeavePolicy ensured!');
  }
}
