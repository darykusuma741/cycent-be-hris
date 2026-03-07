import { ApiProperty } from '@nestjs/swagger';

export class UserParamIdDto {
  @ApiProperty({ default: 1, minimum: 1 })
  id!: number;
}

export class UserCreateDto {
  @ApiProperty({ default: '123456', minimum: 1 })
  password!: string;
  @ApiProperty({ default: 'testing@gmail.com', minimum: 1 })
  email!: string;
  @ApiProperty({ default: 'John Doe', minimum: 1 })
  name!: string;
}
