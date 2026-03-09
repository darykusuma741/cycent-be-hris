import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { AttendanceModule } from './attendance/attendance.module';
import { OfficeModule } from './office/office.module';

@Module({
  imports: [AuthModule, UsersModule, EmployeeModule, AttendanceModule, OfficeModule],
  controllers: [],
  providers: [],
})
export class ApiModule {}
