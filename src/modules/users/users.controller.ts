import { Body, Controller, Delete, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { TransformResponseInterceptor } from '@common/interceptor/transform-response.interceptor';
import { UserCreateDto, UserParamIdDto } from './users.model';
import { ValidationPipe } from '@common/validation/validation.pipe';
import { UsersValidation } from './users.validation';
import { ApiConsumes } from '@nestjs/swagger';

@UseInterceptors(TransformResponseInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('all')
  findAll() {
    return this.usersService.findAll();
  }

  @Post('create')
  @ApiConsumes('application/x-www-form-urlencoded')
  create(@Body(new ValidationPipe(UsersValidation.CREATE)) request: UserCreateDto) {
    return this.usersService.create(request);
  }

  @Delete('delete/:id')
  delete(@Param(new ValidationPipe(UsersValidation.PARAM_ID)) request: UserParamIdDto) {
    return this.usersService.delete(request);
  }
}
