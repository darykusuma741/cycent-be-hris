import { Module } from '@nestjs/common';
import { CommonModule } from '@common/common.module';
import { UsersModule } from '@modules/users/users.module';
import { AuthModule } from '@modules/auth/auth.module';
import { ApiModule } from '@modules/api.module';

@Module({
  imports: [CommonModule, ApiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
