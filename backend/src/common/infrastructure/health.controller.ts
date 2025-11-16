import {Controller, Get, ServiceUnavailableException} from '@nestjs/common';
import {PrismaService} from '../../database/prisma.service';
import {RedisService} from './redis.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  @Get()
  async health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('db')
  async database() {
    try {
      await this.prismaService.$queryRaw`SELECT 1`;
      return {status: 'ok'};
    } catch (error) {
      throw new ServiceUnavailableException('Sistem şu anda geçici olarak kullanılamıyor.');
    }
  }

  @Get('redis')
  async redis() {
    try {
      const response = await this.redisService.ping();

      if (response !== 'PONG') {
        throw new Error('Redis ping yanıtı geçersiz.');
      }

      return {status: 'ok'};
    } catch (error) {
      throw new ServiceUnavailableException('Sistem şu anda geçici olarak kullanılamıyor.');
    }
  }
}
