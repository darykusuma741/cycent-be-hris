import { ApiProperty } from '@nestjs/swagger';

export class RequestMyLeaveDto {
  @ApiProperty({ default: 'Sick', minimum: 1 })
  type!: string;

  @ApiProperty({ default: 'Feeling unwell', minimum: 1, required: false })
  reason?: string | null;

  @ApiProperty({ default: '2026-03-02', minimum: 1 })
  startDate!: Date;

  @ApiProperty({ default: '2026-03-03', minimum: 1 })
  endDate!: Date;
}

export class ApproveLeaveDto {
  @ApiProperty({ default: 1, minimum: 1 })
  leaveId!: number;
}

export class RejectLeaveDto {
  @ApiProperty({ default: 1, minimum: 1 })
  leaveId!: number;
}
