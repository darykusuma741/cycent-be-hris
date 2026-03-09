import { ApiProperty } from '@nestjs/swagger';

export class ShiftCreateDto {
  @ApiProperty({ default: 'Night Shift', minimum: 1 })
  name!: string;
  @ApiProperty({ default: '17:00' })
  startTime!: string;
  @ApiProperty({ default: '08:00' })
  endTime!: string;
}

export class ShiftAssignmentDto {
  @ApiProperty({ default: 19, description: 'ID of the employee being assigned to the shift' })
  employeeId!: number;
  @ApiProperty({ default: 1, description: 'ID of the shift being assigned' })
  shiftId!: number;
  @ApiProperty({ default: '2026-02-28T20:00:00.000Z', description: 'Start date and time of the shift assignment' })
  startDateTime!: Date;
  @ApiProperty({ default: '2026-03-31T03:00:00.000Z', description: 'End date and time of the shift assignment' })
  endDateTime!: Date;
}
