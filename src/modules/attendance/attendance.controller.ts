import { Body, Controller, Delete, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { TransformResponseInterceptor } from '@common/interceptor/transform-response.interceptor';
import { AuthLoginDto } from './attendance.model';
import { ValidationPipe } from '@common/validation/validation.pipe';
import { ApiConsumes } from '@nestjs/swagger';
import { AuthValidation } from './attendance.validation';
import { AttendanceService } from './attendance.service';

@UseInterceptors(TransformResponseInterceptor)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}
}
