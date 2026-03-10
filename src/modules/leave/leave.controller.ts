import { Roles } from '@common/config/role.decorator';
import { RoleEnum } from '@common/config/role.enum';
import { AuthGuard } from '@common/guard/auth.guard';
import { TransformResponseInterceptor } from '@common/interceptor/transform-response.interceptor';
import { Body, Controller, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { LeaveService } from './leave.service';
import { ValidationPipe } from '@common/validation/validation.pipe';
import { LeaveValidation } from './leave.validation';
import { ApproveLeaveDto, RejectLeaveDto, RequestMyLeaveDto } from './leave.model';
import { UserPayload } from '@common/guard/user.payload';

@ApiBearerAuth()
@Roles([RoleEnum.ADMIN])
@UseGuards(AuthGuard)
@UseInterceptors(TransformResponseInterceptor)
@Controller('leave')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post('request')
  @ApiConsumes('application/x-www-form-urlencoded')
  async requestLeave(@Req() requestUser: Request & { user?: UserPayload }, @Body(new ValidationPipe(LeaveValidation.requestMyLeaveDto)) request: RequestMyLeaveDto) {
    return await this.leaveService.requestLeave(requestUser, request);
  }

  @Post('approve')
  @ApiConsumes('application/x-www-form-urlencoded')
  async approveLeave(@Req() requestUser: Request & { user?: UserPayload }, @Body(new ValidationPipe(LeaveValidation.approveLeaveDto)) request: ApproveLeaveDto) {
    return await this.leaveService.approveLeave(requestUser, request);
  }

  @Post('reject')
  @ApiConsumes('application/x-www-form-urlencoded')
  async rejectLeave(@Req() requestUser: Request & { user?: UserPayload }, @Body(new ValidationPipe(LeaveValidation.rejectLeaveDto)) request: RejectLeaveDto) {
    return await this.leaveService.rejectLeave(requestUser, request);
  }
}
