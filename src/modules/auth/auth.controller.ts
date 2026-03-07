import { Body, Controller, Delete, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TransformResponseInterceptor } from '@common/interceptor/transform-response.interceptor';
import { AuthLoginDto } from './auth.model';
import { ValidationPipe } from '@common/validation/validation.pipe';
import { ApiConsumes } from '@nestjs/swagger';
import { AuthValidation } from './auth.validation';

@UseInterceptors(TransformResponseInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiConsumes('application/x-www-form-urlencoded')
  login(@Body(new ValidationPipe(AuthValidation.LOGIN)) request: AuthLoginDto) {
    return this.authService.login(request);
  }
}
