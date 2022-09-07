import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RolesService {
    constructor(private prisma: PrismaService) {}

    async index({ skip, take }): Promise<any> {
        let total =  await this.prisma.role.findMany();
        let data = await this.prisma.role.findMany({
            skip,
            take,
            orderBy: {
                id: 'asc'
            } 
        });
        return { data, total: total.length };
    }

    async show(id: number): Promise<any> {
        let role = await this.prisma.role.findUnique({
           where: {
               id
           }
       });
       return { data: role };
   }
}
