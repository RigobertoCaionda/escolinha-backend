import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateDonatorDto } from './dto/create-donator.dto';
import { UpdateDonatorDto } from './dto/update-donator.dto';

@Injectable()
export class DonatorService {
  constructor(private prisma: PrismaService) {}
  async create(createDonatorDto: CreateDonatorDto) {
    let newCreateDonatorDto = {
      donatedItem: createDonatorDto.donatedItem,
      donationId: Number(createDonatorDto.donationId),
      userId: Number(createDonatorDto.userId),
      cash: Number(createDonatorDto.cash),
      image: ''
    };
    if (createDonatorDto.image && createDonatorDto.image.length > 0) {
      const imgData = [];
      createDonatorDto.image.forEach((img) => {
        imgData.push({ url: img.filename });
      });
      
      const donator = await this.prisma.donator.create({ 
        data: {
          donatedItem: createDonatorDto.donatedItem,
          donationId: Number(createDonatorDto.donationId),
          userId: Number(createDonatorDto.userId),
          image: imgData[0].url
        }
       });
       await this.prisma.request.create({
        data: { 
          answer: '',
          isActive: false,
          donationId: createDonatorDto.donationId
         }
       });
      return { data: donator };
    }
    let data = await this.prisma.donator.create({ data: newCreateDonatorDto });
    return { data };
  }

  findAll() {
    return `This action returns all donator`;
  }

  findOne(id: number) {
    return `This action returns a #${id} donator`;
  }

  update(id: number, updateDonatorDto: UpdateDonatorDto) {
    return `This action updates a #${id} donator`;
  }

  remove(id: number) {
    return `This action removes a #${id} donator`;
  }
}
