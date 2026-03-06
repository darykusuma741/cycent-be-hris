import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';

@Global()
@Module({
  imports: [WinstonModule],
  providers: [],
  exports: [],
})
export class CommonModule {}
