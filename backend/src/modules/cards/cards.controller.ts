import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { CardsService } from './cards.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('cards')
export class CardsController {
    constructor(private readonly cardsService: CardsService) { }

    @UseGuards(AuthGuard('jwt'))
    @Post('generate')
    generate(@Request() req: any) {
        // In real app, check if user is head of family
        // Simplification: generate for the user's family
        // We need familyId. Fetch via FamiliesService or assume logic in CardsService.
        // Let's pass user ID to CardsService? No, CardsService takes familyId.
        // Need to find familyId from user. 
        // Ideally FamiliesService should trigger this, but let's keep it here for now.
        // Wait, I need FamiliesService here to find familyId from userId.
        throw new Error('Not implemented: Need familyId resolution.');
    }

    // Re-thinking: Card generation should probably happen automatically upon Approval.
    // Or explicitly by Admin.
    // Let's expose a GET endpoint for the user to see their card.

    @UseGuards(AuthGuard('jwt'))
    @Get('qr-token')
    async getQrToken(@Request() req: any) {
        return this.cardsService.generateQrToken(req.user.userId);
    }
}
