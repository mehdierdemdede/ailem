import {Module} from '@nestjs/common';
import {PrismaModule} from '../../database/prisma.module';
import {HealthController} from './health.controller';
import {RedisService} from './redis.service';

@Module({
  imports: [PrismaModule],
  controllers: [HealthController],
  providers: [RedisService],
})
export class HealthModule {}
