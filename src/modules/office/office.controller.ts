import { Roles } from '@common/config/role.decorator';
import { RoleEnum } from '@common/config/role.enum';
import { AuthGuard } from '@common/guard/auth.guard';
import { TransformResponseInterceptor } from '@common/interceptor/transform-response.interceptor';
import { PrismaService } from '@common/prisma/prisma.service';
import { Body, Controller, Get, Injectable, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { OfficeService } from './office.service';
import { ValidationPipe } from '@common/validation/validation.pipe';
import { OfficeValidation } from './office.validation';
import { FindNearbyOfficesDto, OfficeAssignmentCreateDto, OfficeCreateDto } from './office.model';
import { UserPayload } from '@common/guard/user.payload';

@ApiBearerAuth()
@Roles([RoleEnum.ADMIN])
@UseGuards(AuthGuard)
@UseInterceptors(TransformResponseInterceptor)
@Controller('office')
export class OfficeController {
  constructor(private readonly officeService: OfficeService) {}

  @Get('all')
  findAll() {
    return this.officeService.getAll();
  }

  @Post('create')
  @ApiConsumes('application/x-www-form-urlencoded')
  create(@Body(new ValidationPipe(OfficeValidation.CREATE)) request: OfficeCreateDto) {
    return this.officeService.create(request);
  }

  @Post('office-assignment')
  @ApiConsumes('application/x-www-form-urlencoded')
  createAssignment(@Body(new ValidationPipe(OfficeValidation.OFFICE_ASSIGNMENT_CREATE)) request: OfficeAssignmentCreateDto) {
    return this.officeService.createAssignment(request);
  }

  @Post('find-nearby')
  @ApiConsumes('application/x-www-form-urlencoded')
  findNearby(@Req() requestUser: Request & { user?: UserPayload }, @Body(new ValidationPipe(OfficeValidation.FIND_NEARBY)) request: FindNearbyOfficesDto) {
    return this.officeService.findNearby(requestUser, request);
  }
}
