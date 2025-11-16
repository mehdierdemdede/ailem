import {Controller, Get} from '@nestjs/common';
import {HealthCheckService, HealthCheck} from '@nestjs/terminus';
import {PrismaHealthIndicator} from './prisma.indicator';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaIndicator: PrismaHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  readiness() {
    return this.health.check([() => this.prismaIndicator.isHealthy('database')]);
  }
}
