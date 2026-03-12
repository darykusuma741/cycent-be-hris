import { Module } from '@nestjs/common';
import { AttendanceSheetController } from './attendance_sheet.controller';
import { AttendanceSheetService } from './attendance_sheet.service';

@Module({
  controllers: [AttendanceSheetController],
  providers: [AttendanceSheetService],
  exports: [],
})
export class AttendanceSheetModule {}
