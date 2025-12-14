import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma, FamilyDetails, VerificationStatus } from '@prisma/client';

@Injectable()
export class FamiliesService {
  constructor(private prisma: PrismaService) { }

  async create(userId: string, data: Prisma.FamilyDetailsCreateWithoutUserInput): Promise<FamilyDetails> {
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
}
