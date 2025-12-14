import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Prisma } from '@prisma/client';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() req: any) {
        // In a real app, use LocalAuthGuard involves Passport.
        // For simplicity now, we validate manually or expect validated object.
        // Let's do simple manual validation for prototype speed.
        const user = await this.authService.validateUser(req.email, req.password);
        if (!user) {
            return { error: 'Invalid credentials' }; // Better: throw UnauthorizedException
        }
        return this.authService.login(user);
    }

    @Post('register')
    async register(@Body() createUserDto: Prisma.UserCreateInput) {
        return this.authService.register(createUserDto);
    }
}
