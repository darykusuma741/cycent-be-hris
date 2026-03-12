import { ApiProperty } from '@nestjs/swagger';

export class GeneratePayrollDto {
  @ApiProperty({ default: 1, description: 'ID periode payroll' })
  periodId!: number;
}

export class CreatePayrollPeriodDto {
  @ApiProperty({ default: 'Maret 2026', minimum: 1 })
  name!: string;

  @ApiProperty({ default: '2026-03-01', minimum: 1 })
  startDate!: Date;

  @ApiProperty({ default: '2026-03-31', minimum: 1 })
  endDate!: Date;

  @ApiProperty({ default: 5, description: 'ID periode attendance' })
  attendancePeriodId!: number;
}
