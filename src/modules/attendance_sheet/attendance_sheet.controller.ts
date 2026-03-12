import { Roles } from '@common/config/role.decorator';
import { RoleEnum } from '@common/config/role.enum';
import { TransformResponseInterceptor } from '@common/interceptor/transform-response.interceptor';
import { Body, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { AttendanceSheetService } from './attendance_sheet.service';
import { AttendanceSheetValidation } from './attendance_sheet.validation';
import { CreatePeriodicDto, GenerateAttendanceSheetDto } from './attendance_sheet.model';
import { AuthGuard } from '@common/guard/auth.guard';
import { ValidationPipe } from '@common/validation/validation.pipe';

@ApiBearerAuth()
@Roles([RoleEnum.ADMIN])
@UseGuards(AuthGuard)
@UseInterceptors(TransformResponseInterceptor)
@Controller('attendance-sheet')
export class AttendanceSheetController {
  constructor(private readonly attendanceSheetService: AttendanceSheetService) {}

  @Post('generate-attendance-sheets')
  @ApiConsumes('application/x-www-form-urlencoded')
  generateAttendanceSheets(@Body(new ValidationPipe(AttendanceSheetValidation.generateAttendanceSheets)) request: GenerateAttendanceSheetDto) {
    return this.attendanceSheetService.generateAttendanceSheets(request);
  }

  @Post('create-periodic')
  @ApiConsumes('application/x-www-form-urlencoded')
  createPeriodic(@Body(new ValidationPipe(AttendanceSheetValidation.createPeriodicDto)) request: CreatePeriodicDto) {
    return this.attendanceSheetService.createPeriodic(request);
  }
}
