import { Controller, Get, Post, Body, Param, UseGuards, Request, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FamiliesService } from './families.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentAnalysisService } from './document-analysis.service';
import { Express } from 'express';

import { AuthService } from '../auth/auth.service';

@Controller('families')
export class FamiliesController {
  constructor(
    private readonly familiesService: FamiliesService,
    private readonly documentAnalysisService: DocumentAnalysisService,
    private readonly authService: AuthService
  ) { }

  // Admin Create Endpoint
  @Post('admin-create')
  async adminCreate(@Body() body: any) {
    // 1. Create User
    const user = await this.authService.register({
      email: body.email,
      password: body.password || 'Aile2025!', // Default password or provided
      name: body.fatherName + ' ' + body.motherName,
      role: 'USER'
    });

    // 2. Create Family Details
    const family = await this.familiesService.create(user.id, {
      fatherName: body.fatherName,
      motherName: body.motherName,
      numberOfChildren: Number(body.numberOfChildren),
      childrenNames: body.childrenNames || [],
      address: body.address,
      city: body.city,
      phone: body.phone,
      status: 'APPROVED' // Auto-approve
    });

    // 3. Create Card (Auto-verify)
    await this.familiesService.updateVerification(family.id, {
      numberOfChildren: family.numberOfChildren,
      registryDocumentUrl: 'ADMIN-VERIFIED',
      status: 'APPROVED'
    });

    return { success: true, family, user };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Request() req: any, @Body() data: Prisma.FamilyDetailsCreateWithoutUserInput) {
    return this.familiesService.create(req.user.userId, data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  findMyFamily(@Request() req: any) {
    return this.familiesService.findByUserId(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('seed')
  async seed(@Request() req: any) {
    try {
      // Check if exists first
      let family = await this.familiesService.findByUserId(req.user.userId);

      if (family) {
        // Update existing details (Names + Verification)
        await this.familiesService.update(family.id, {
          fatherName: 'Mehdi',
          motherName: 'Samra',
          numberOfChildren: 3,
          childrenNames: ['Ali', 'Veli', 'Can'],
          status: 'APPROVED',
          registryDocumentUrl: 'http://mock-url/doc.pdf',
        });

        // Ensure card exists
        await this.familiesService.updateVerification(family.id, {
          registryDocumentUrl: 'http://mock-url/doc.pdf',
          numberOfChildren: 3,
          status: 'APPROVED'
        });
      } else {
        // Create new
        family = await this.familiesService.create(req.user.userId, {
          fatherName: 'Mehdi',
          motherName: 'Samra',
          address: 'Test Mah. Test Sok.',
          city: 'İstanbul',
          phone: '5551234567',
          numberOfChildren: 3,
          childrenNames: ['Ali', 'Veli', 'Can'],
          status: 'PENDING',
        });

        // Approve and Create Card
        await this.familiesService.updateVerification(family.id, {
          registryDocumentUrl: 'http://mock-url/doc.pdf',
          numberOfChildren: 3,
          status: 'APPROVED'
        });
      }

      return this.familiesService.findByUserId(req.user.userId);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  // Admin only - TODO: Add AdminGuard
  @Get()
  findAll() {
    return this.familiesService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(@Request() req: any, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Dosya yüklenmedi.');
    }

    const family = await this.familiesService.findByUserId(req.user.userId);
    if (!family) {
      throw new BadRequestException('Aile kaydı bulunamadı.');
    }

    // Analyze document
    const analysis = await this.documentAnalysisService.analyzeRegistryDocument(file.buffer);

    // Save file to uploads directory (simple local storage)
    const fs = require('fs');
    const path = require('path');
    const uploadsDir = path.join(process.cwd(), 'uploads');

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    // Create unique filename
    const filename = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadsDir, filename);

    fs.writeFileSync(filePath, file.buffer);

    // In a real scenario this would be a public URL or signed URL.
    // For local dev, we might serve it via static assets or just perform the analysis and verify.
    // We'll store the local path or a served URL.
    const fileUrl = `/uploads/${filename}`;

    // Update family status
    return this.familiesService.updateVerification(family.id, {
      registryDocumentUrl: fileUrl,
      numberOfChildren: analysis.childCount > family.numberOfChildren ? analysis.childCount : family.numberOfChildren,
      status: analysis.isVerified ? 'APPROVED' : 'PENDING'
    });
  }
}
