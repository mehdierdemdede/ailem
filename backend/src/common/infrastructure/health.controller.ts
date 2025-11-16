import {Controller, Get} from '@nestjs/common';
import {HealthCheck, HealthCheckService} from '@nestjs/terminus';
import {PrismaHealthIndicator} from '../../database/prisma.health-indicator';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prismaIndicator: PrismaHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  readiness() {
    return this.health.check([() => this.prismaIndicator.isHealthy('database')]);
  }
}
