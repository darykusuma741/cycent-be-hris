import { Body, Controller, UseInterceptors } from '@nestjs/common';
import { TransformResponseInterceptor } from '@common/interceptor/transform-response.interceptor';
import { AttendanceService } from './attendance.service';

@UseInterceptors(TransformResponseInterceptor)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}
}
