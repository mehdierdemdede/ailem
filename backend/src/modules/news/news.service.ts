import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma, News } from '@prisma/client';

@Injectable()
export class NewsService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.NewsCreateInput): Promise<News> {
        return this.prisma.news.create({ data });
    }

    async findAll(): Promise<News[]> {
        return this.prisma.news.findMany({
            orderBy: { publishedAt: 'desc' },
        });
    }

    async findOne(id: string): Promise<News | null> {
        return this.prisma.news.findUnique({ where: { id } });
    }

    async update(id: string, data: Prisma.NewsUpdateInput): Promise<News> {
        return this.prisma.news.update({ where: { id }, data });
    }

    async remove(id: string): Promise<News> {
        return this.prisma.news.delete({ where: { id } });
    }
}
