import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {PrismaService} from './common/infrastructure/prisma.service';
import {RedisService} from './common/infrastructure/redis.service';
import {HealthModule} from './common/infrastructure/health.module';
import {AuthModule} from './modules/auth/presentation/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    HealthModule,
    AuthModule,
  ],
  providers: [PrismaService, RedisService],
})
export class AppModule {}
