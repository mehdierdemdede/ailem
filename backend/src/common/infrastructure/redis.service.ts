import {Injectable, OnModuleDestroy, OnModuleInit} from '@nestjs/common';
import Redis from 'ioredis';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis | null = null;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const host = this.configService.get<string>('REDIS_HOST', 'localhost');
    const port = this.configService.get<number>('REDIS_PORT', 6379);
    this.client = new Redis({host, port});
  }

  onModuleDestroy() {
    this.client?.disconnect();
  }

  getClient(): Redis {
    if (!this.client) {
      throw new Error('Redis client not initialized');
    }
    return this.client;
  }

  async ping(): Promise<string> {
    const client = this.getClient();
    return client.ping();
  }
}
