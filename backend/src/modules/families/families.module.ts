import { Module } from '@nestjs/common';
import { FamiliesService } from './families.service';
import { FamiliesController } from './families.controller';
import { PrismaModule } from 'src/database/prisma.module';
import { AuthModule } from '../auth/auth.module';

import { DocumentAnalysisService } from './document-analysis.service';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [FamiliesService, DocumentAnalysisService],
  controllers: [FamiliesController],
  exports: [FamiliesService],
})
export class FamiliesModule { }
