import { Body, Controller, Get, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ShiftService } from './shift.service';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { Roles } from '@common/config/role.decorator';
import { RoleEnum } from '@common/config/role.enum';
import { AuthGuard } from '@common/guard/auth.guard';
import { TransformResponseInterceptor } from '@common/interceptor/transform-response.interceptor';
import { ValidationPipe } from '@common/validation/validation.pipe';
import { ShiftValidation } from './shift.validation';
import { ShiftAssignmentDto, ShiftCreateDto } from './shift.model';
import { UserPayload } from '@common/guard/user.payload';

@ApiBearerAuth()
@Roles([RoleEnum.ADMIN])
@UseGuards(AuthGuard)
@UseInterceptors(TransformResponseInterceptor)
@Controller('shifts')
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  @Post('create')
  @ApiConsumes('application/x-www-form-urlencoded')
  createShift(@Body(new ValidationPipe(ShiftValidation.create())) shiftData: ShiftCreateDto) {
    return this.shiftService.create(shiftData);
  }

  @Post('assign')
  @ApiConsumes('application/x-www-form-urlencoded')
  createShiftAssignment(@Body(new ValidationPipe(ShiftValidation.assign())) assignmentData: ShiftAssignmentDto) {
    return this.shiftService.createAssignment(assignmentData);
  }

  @Get('my-shift-today')
  getMyShiftToday(@Req() requestUser: Request & { user?: UserPayload }) {
    return this.shiftService.getMyShiftToday(requestUser);
  }
}
