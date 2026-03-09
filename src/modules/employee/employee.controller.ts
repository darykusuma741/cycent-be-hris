import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { TransformResponseInterceptor } from '@common/interceptor/transform-response.interceptor';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { Roles } from '@common/config/role.decorator';
import { RoleEnum } from '@common/config/role.enum';
import { AuthGuard } from '@common/guard/auth.guard';
import { ValidationPipe } from '@common/validation/validation.pipe';
import { EmployeeValidation } from './employee.validation';
import { EmployeeCreateDto } from './employee.model';
import { UserPayload } from '@common/guard/user.payload';

@ApiBearerAuth()
@Roles([RoleEnum.ADMIN])
@UseGuards(AuthGuard)
@UseInterceptors(TransformResponseInterceptor)
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get('all')
  findAll() {
    return this.employeeService.findAll();
  }

  @Post('create')
  @ApiConsumes('application/x-www-form-urlencoded')
  create(@Body(new ValidationPipe(EmployeeValidation.CREATE)) request: EmployeeCreateDto) {
    return this.employeeService.create(request);
  }

  @Get('my-data')
  @ApiConsumes('application/x-www-form-urlencoded')
  myData(@Req() requestUser: Request & { user?: UserPayload }) {
    return this.employeeService.myData(requestUser);
  }
}
