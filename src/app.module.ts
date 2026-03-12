import { Module } from '@nestjs/common';
import { CommonModule } from '@common/common.module';
import { ApiModule } from '@modules/api.module';

@Module({
  imports: [CommonModule, ApiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
