import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginDto {
  @ApiProperty({ default: 'testing@gmail.com', minimum: 1 })
  email!: string;

  @ApiProperty({ default: '123456', minimum: 1 })
  password!: string;
}
