import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getLoggedUserInfo(id: number) {
    let user = await this.prisma.user.findUnique({
      where: {
        id
      },
      include: {
        role: true
      }
    });
    return {  data: user }
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
    let data = await this.prisma.user.findMany({
      include: {
        role: true
      }
    });
    return { data };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    let user = await this.prisma.user.findUnique({
      where: {
        id
      }
    });
    if(!user) throw new NotFoundException('Usuário não encontrado');
    return await this.prisma.user.delete({
      where: {
        id
      },
    });
  }
}
