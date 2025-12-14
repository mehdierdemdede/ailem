import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PartnersService } from './partners.service';
import { Prisma } from '@prisma/client';

@Controller('partners')
export class PartnersController {
    constructor(private readonly partnersService: PartnersService) { }

    @Post()
    create(@Body() data: Prisma.PartnerCreateInput) {
        return this.partnersService.create(data);
    }

    @Get()
    findAll() {
        return this.partnersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.partnersService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() data: Prisma.PartnerUpdateInput) {
        return this.partnersService.update(id, data);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.partnersService.remove(id);
    }
}
