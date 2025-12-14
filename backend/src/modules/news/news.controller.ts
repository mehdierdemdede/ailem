import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NewsService } from './news.service';
import { Prisma } from '@prisma/client';

@Controller('news')
export class NewsController {
    constructor(private readonly newsService: NewsService) { }

    @Post()
    create(@Body() data: Prisma.NewsCreateInput) {
        return this.newsService.create(data);
    }

    @Get()
    findAll() {
        return this.newsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.newsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() data: Prisma.NewsUpdateInput) {
        return this.newsService.update(id, data);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.newsService.remove(id);
    }
}
