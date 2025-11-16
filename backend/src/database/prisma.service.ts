import {INestApplication, Injectable} from '@nestjs/common';
import {Prisma, PrismaClient} from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'beforeExit'>
{
  constructor() {
    super();
    this.$connect();
  }

  async enableShutdownHooks(app: INestApplication): Promise<void> {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
