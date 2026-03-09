import { Body, Controller, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { TransformResponseInterceptor } from '@common/interceptor/transform-response.interceptor';
import { AttendanceService } from './attendance.service';
import { UserPayload } from '@common/guard/user.payload';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { Roles } from '@common/config/role.decorator';
import { RoleEnum } from '@common/config/role.enum';
import { AuthGuard } from '@common/guard/auth.guard';
import { ValidationPipe } from '@common/validation/validation.pipe';
import { AttendanceValidation } from './attendance.validation';
import { AttendanceCheckInDto, AttendanceCheckOutDto } from './attendance.model';

@ApiBearerAuth()
@Roles([RoleEnum.ADMIN])
@UseGuards(AuthGuard)
@UseInterceptors(TransformResponseInterceptor)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-in')
  @ApiConsumes('application/x-www-form-urlencoded')
  checkIn(
    @Body(new ValidationPipe(AttendanceValidation.CheckIn)) request: AttendanceCheckInDto, // Replace 'any' with the appropriate DTO or validation class
    @Req() requestUser: Request & { user?: UserPayload },
  ) {
    return this.attendanceService.checkIn(requestUser, request);
  }

  @Post('check-out')
  @ApiConsumes('application/x-www-form-urlencoded')
  checkOut(@Body(new ValidationPipe(AttendanceValidation.CheckOut)) request: AttendanceCheckOutDto) {
    return this.attendanceService.checkOut(request);
  }
}
