import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {TerminusModule} from '@nestjs/terminus';
import {configuration} from './config/configuration';
import {validationSchema} from './config/validation.schema';
import {HealthController} from './common/infrastructure/health.controller';
import {RedisService} from './common/infrastructure/redis.service';
import {PrismaModule} from './database/prisma.module';
import {AuthModule} from './modules/auth/presentation/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    TerminusModule,
    PrismaModule,
    AuthModule,
  ],
  controllers: [HealthController],
  providers: [RedisService],
})
export class AppModule {}
