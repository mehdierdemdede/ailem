import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma, FamilyDetails, VerificationStatus } from '@prisma/client';

@Injectable()
export class FamiliesService {
  constructor(private prisma: PrismaService) { }

  async create(userId: string, data: Prisma.FamilyDetailsCreateWithoutUserInput): Promise<FamilyDetails> {
    if (data.numberOfChildren < 3) {
      throw new BadRequestException('Aile 3+ programı sadece 3 veya daha fazla çocuğu olan aileler içindir.');
    }

    return this.prisma.familyDetails.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async findAll(): Promise<FamilyDetails[]> {
    return this.prisma.familyDetails.findMany({
      include: { user: true },
    });
  }

  async findOne(id: string): Promise<FamilyDetails | null> {
    return this.prisma.familyDetails.findUnique({
      where: { id },
      include: { user: true, card: true },
    });
  }

  async findByUserId(userId: string): Promise<FamilyDetails | null> {
    return this.prisma.familyDetails.findUnique({
      where: { userId },
      include: { card: true },
    });
  }

  async updateStatus(id: string, status: VerificationStatus): Promise<FamilyDetails> {
    return this.prisma.familyDetails.update({
      where: { id },
      data: { status },
    });
  }

  async update(id: string, data: Prisma.FamilyDetailsUpdateInput): Promise<FamilyDetails> {
    return this.prisma.familyDetails.update({
      where: { id },
      data,
    });
  }

  async updateVerification(id: string, data: { registryDocumentUrl: string, numberOfChildren: number, status: VerificationStatus }): Promise<FamilyDetails> {
    const updatedFamily = await this.prisma.familyDetails.update({
      where: { id },
      data: {
        registryDocumentUrl: data.registryDocumentUrl,
        numberOfChildren: data.numberOfChildren,
        status: data.status
      }
    });

    // If status is APPROVED, ensure a Card exists
    if (data.status === 'APPROVED') {
      const existingCard = await this.prisma.card.findUnique({
        where: { familyId: id }
      });

      if (!existingCard) {
        // Generate Card Logic
        await this.createCardForFamily(id);
      }
    }

    return updatedFamily;
  }

  private async createCardForFamily(familyId: string) {
    const cardNumber = this.generateCardNumber();
    const qrCodeData = `AILE3PLUS-${familyId}-${Date.now()}`;
    const validUntil = new Date();
    validUntil.setFullYear(validUntil.getFullYear() + 1); // 1 Year validity

    await this.prisma.card.create({
      data: {
        familyId,
        cardNumber,
        qrCodeData,
        validUntil
      }
    });
  }

  private generateCardNumber(): string {
    // Simple generation logic: 4 groups of 4 digits
    const p1 = Math.floor(1000 + Math.random() * 9000);
    const p2 = Math.floor(1000 + Math.random() * 9000);
    const p3 = Math.floor(1000 + Math.random() * 9000);
    const p4 = Math.floor(1000 + Math.random() * 9000);
    return `${p1} ${p2} ${p3} ${p4}`;
  }
}
