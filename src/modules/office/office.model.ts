import { ApiProperty } from '@nestjs/swagger';

export class OfficeCreateDto {
  @ApiProperty({ default: 'Office 1', minimum: 1 })
  name!: string;
  @ApiProperty({ default: -6.2, minimum: -90, maximum: 90 })
  latitude!: number;
  @ApiProperty({ default: 106.816666, minimum: -180, maximum: 180 })
  longitude!: number;
  @ApiProperty({ default: 100, minimum: 1 })
  radius!: number;
}

export class OfficeAssignmentCreateDto {
  @ApiProperty({ default: 3, minimum: 1 })
  officeId!: number;
  @ApiProperty({ default: 19, minimum: 1 })
  employeeId!: number;
}

export class FindNearbyOfficesDto {
  @ApiProperty({ default: -6.2, minimum: -90, maximum: 90 })
  latitude!: number;
  @ApiProperty({ default: 106.816666, minimum: -180, maximum: 180 })
  longitude!: number;
}
