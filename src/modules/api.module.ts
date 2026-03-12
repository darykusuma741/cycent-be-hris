import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { AttendanceModule } from './attendance/attendance.module';
import { OfficeModule } from './office/office.module';
import { ShiftModule } from './shift/shift.module';
import { LeaveModule } from './leave/leave.module';
import { AttendanceSheetModule } from './attendance_sheet/attendance_sheet.module';
import { PayrollModule } from './payroll/payroll.module';

@Module({
  imports: [AuthModule, UsersModule, EmployeeModule, AttendanceModule, OfficeModule, ShiftModule, LeaveModule, AttendanceSheetModule, PayrollModule],
  controllers: [],
  providers: [],
})
export class ApiModule {}
