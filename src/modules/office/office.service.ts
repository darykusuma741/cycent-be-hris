import { PrismaService } from '@common/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { OfficeAssignmentCreateDto, OfficeCreateDto } from './office.model';
import { LocationHelper } from '@common/location/location.helper';

@Injectable()
export class OfficeService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return this.prisma.officeLocation.findMany({ include: { officeAssignments: { include: { employee: true } } } });
  }

  async create(request: OfficeCreateDto) {
    return this.prisma.officeLocation.create({
      data: {
        name: request.name,
        latitude: request.latitude,
        longitude: request.longitude,
        radius: request.radius,
      },
    });
  }

  async createAssignment(request: OfficeAssignmentCreateDto) {
    return this.prisma.officeAssignment.create({
      data: {
        date: new Date(),
        officeLocationId: request.officeId,
        employeeId: request.employeeId,
      },
    });
  }

  async findNearby(requestUser: Request & { user?: { id: number } }, request: { latitude: number; longitude: number }) {
    const offices = await this.prisma.officeLocation.findMany({
      include: {
        officeAssignments: {
          where: {
            employee: {
              userId: requestUser.user?.id,
            },
          },
          include: {
            employee: true,
          },
        },
      },
    });

    return offices.filter((office) => {
      const distance = LocationHelper.distanceInMeters(request.latitude, request.longitude, office.latitude, office.longitude);
      return distance <= office.radius;
    });
  }
}
