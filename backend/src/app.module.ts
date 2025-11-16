import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import configuration from './config/configuration';
import validationSchema from './config/validation.schema';
import {HealthModule} from './common/infrastructure/health.module';
import {PrismaModule} from './database/prisma.module';
import {AuthModule} from './modules/auth/presentation/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
  ],
})
export class AppModule {}
