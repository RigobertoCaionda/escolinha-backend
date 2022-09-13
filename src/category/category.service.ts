import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}
  async create(createCategoryDto: CreateCategoryDto) {
    let data = await this.prisma.category.create({ data: createCategoryDto });
    return { data };
  }

  async findAll() {
    const data = await this.prisma.category.findMany();
    return { data };
  }

  async findOne(id: number) {
    let category = await this.prisma.category.findUnique({
      where: {
        id,
      },
    });
    return { data: category };
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    let category = await this.prisma.category.findUnique({
      where: {
        id,
      },
    });
    if (!category) throw new NotFoundException('Categoria não encontrada!');
    return await this.prisma.category.update({
      data: updateCategoryDto,
      where: {
        id,
      },
    });
  }

  async remove(id: number) {
    let category = await this.prisma.category.findUnique({
      where: {
        id
      }
    });
    if(!category) throw new NotFoundException('Categoria não encontrada');
    return await this.prisma.category.delete({
      where: {
        id
      },
    });
  }
}
