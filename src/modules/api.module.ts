import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';

@Module({
  imports: [AuthModule, UsersModule, EmployeeModule],
  controllers: [],
  providers: [],
})
export class ApiModule {}
