import { Module } from '@nestjs/common';
import { OfficeController } from './office.controller';
import { OfficeService } from './office.service';

@Module({
  imports: [],
  controllers: [OfficeController],
  providers: [OfficeService],
})
export class OfficeModule {}
