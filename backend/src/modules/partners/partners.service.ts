import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma, Partner } from '@prisma/client';

@Injectable()
export class PartnersService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.PartnerCreateInput): Promise<Partner> {
        return this.prisma.partner.create({ data });
    }

    async findAll(): Promise<Partner[]> {
        return this.prisma.partner.findMany();
    }

    async findOne(id: string): Promise<Partner | null> {
        return this.prisma.partner.findUnique({ where: { id } });
    }

    async update(id: string, data: Prisma.PartnerUpdateInput): Promise<Partner> {
        return this.prisma.partner.update({ where: { id }, data });
    }

    async remove(id: string): Promise<Partner> {
        return this.prisma.partner.delete({ where: { id } });
    }
}
