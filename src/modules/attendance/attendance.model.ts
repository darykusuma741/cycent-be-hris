import { ApiProperty } from '@nestjs/swagger';

export class AttendanceCheckInDto {
  @ApiProperty({ default: -6.2, minimum: -90, maximum: 90 })
  latitude!: number;
  @ApiProperty({ default: 106.816666, minimum: -180, maximum: 180 })
  longitude!: number;
  @ApiProperty({ default: 6, required: true })
  shiftId!: number;
  @ApiProperty({ default: 5, required: true })
  officeId!: number;
}
