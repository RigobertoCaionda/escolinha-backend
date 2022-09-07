import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateRoleDto } from 'src/user/dto/create-role.dto';

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

    async create(createRoleDto: CreateRoleDto) {
        const role = await this.prisma.role.create({ 
            data: {
              name: createRoleDto.name
            }
           });
          return { data: role };
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
