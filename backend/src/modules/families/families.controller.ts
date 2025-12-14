import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { FamiliesService } from './families.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('families')
export class FamiliesController {
  constructor(private readonly familiesService: FamiliesService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Request() req: any, @Body() data: Prisma.FamilyDetailsCreateWithoutUserInput) {
    return this.familiesService.create(req.user.sub, data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  findMyFamily(@Request() req: any) {
    return this.familiesService.findByUserId(req.user.sub);
  }

  // Admin only - TODO: Add AdminGuard
  @Get()
  findAll() {
    return this.familiesService.findAll();
  }
}
