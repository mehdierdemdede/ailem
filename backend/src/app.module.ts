import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import validationSchema from './config/validation.schema';
import { HealthModule } from './common/infrastructure/health.module';
import { PrismaModule } from './database/prisma.module';
import { FamiliesModule } from './modules/families/families.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { PartnersModule } from './modules/partners/partners.module';
import { NewsModule } from './modules/news/news.module';
import { CardsModule } from './modules/cards/cards.module';

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
    FamiliesModule,
    UsersModule,
    PartnersModule,
    NewsModule,
    CardsModule,
  ],
})
export class AppModule { }
