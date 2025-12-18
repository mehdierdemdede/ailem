import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Card } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CardsService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) { }

    async generateQrToken(userId: string): Promise<{ token: string, validUntil: number }> {
        // Find family for user
        const family = await this.prisma.familyDetails.findUnique({
            where: { userId },
            include: { card: true }
        });

        if (!family || !family.card) {
            throw new Error('Card not found for this user');
        }

        const payload = {
            cardId: family.card.id,
            familyId: family.id,
            timestamp: Date.now()
        };

        const token = this.jwtService.sign(payload);
        // Valid for 60s
        const validUntil = Date.now() + 60000;

        return { token, validUntil };
    }

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
