import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Card } from '@prisma/client';

@Injectable()
export class CardsService {
    constructor(private prisma: PrismaService) { }

    async generateCard(familyId: string): Promise<Card> {
        const existing = await this.prisma.card.findUnique({ where: { familyId } });
        if (existing) return existing;

        const cardNumber = `CARD-${Date.now()}-${familyId.slice(-4).toUpperCase()}`;
        const qrCodeData = cardNumber; // Simplifying for prototype

        return this.prisma.card.create({
            data: {
                familyId,
                cardNumber,
                qrCodeData,
                validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            },
        });
    }

    async findByFamily(familyId: string): Promise<Card | null> {
        return this.prisma.card.findUnique({ where: { familyId } });
    }
}
