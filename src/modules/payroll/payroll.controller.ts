import { Roles } from '@common/config/role.decorator';
import { RoleEnum } from '@common/config/role.enum';
import { AuthGuard } from '@common/guard/auth.guard';
import { TransformResponseInterceptor } from '@common/interceptor/transform-response.interceptor';
import { Body, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { PayrollService } from './payroll.service';
import { ValidationPipe } from '@common/validation/validation.pipe';
import { PayrollValidation } from './payroll.validation';
import { CreatePayrollPeriodDto, GeneratePayrollDto } from './payroll.model';

@ApiBearerAuth()
@Roles([RoleEnum.ADMIN])
@UseGuards(AuthGuard)
@UseInterceptors(TransformResponseInterceptor)
@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post('create-period')
  @ApiConsumes('application/x-www-form-urlencoded')
  createPayrollPeriod(@Body(new ValidationPipe(PayrollValidation.createPayrollPeriod)) request: CreatePayrollPeriodDto) {
    return this.payrollService.createPayrollPeriod(request);
  }

  @Post('generate')
  @ApiConsumes('application/x-www-form-urlencoded')
  generatePayroll(@Body(new ValidationPipe(PayrollValidation.generatePayroll)) request: GeneratePayrollDto) {
    return this.payrollService.generatePayroll(request);
  }
}
