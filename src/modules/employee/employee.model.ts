import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class EmployeeCreateDto {
  @ApiProperty({ default: 'Dary Kusuma', minimum: 1 })
  name!: string;
  @ApiProperty({ default: 'Fullstack Developer', minimum: 0, nullable: true, required: false })
  position?: string;
  @ApiProperty({ default: 1, minimum: 0, nullable: true, required: false })
  userId?: number;
}
