import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { HandleUserRequestDto } from './dto/handle-user-request.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';

@Injectable()
export class DonationService {
  constructor(private prisma: PrismaService) {}
  async getOneUnresolvedRequest(id: number) {
    let data = await this.prisma.request.findUnique({
      where: {
        id
      },
      include: {
        donation: {
          include: {
            category: true,
            user: true
          }
        },
      }
    });
    return { data  };
  }

  async getUnresolvedRequests() {
    let data = await this.prisma.request.findMany({
      where: {
        isActive: false
      },
      include: {
        donation: {
          include: {
            category: true,
            user: true
          }
        },
      }
    });
    return { data  };
  }

  async handleUserRequest(data: HandleUserRequestDto) {
    const request = await this.prisma.request.findUnique({
      where: {
        id: data.requestId
      }
    });
    if (!request) throw new NotFoundException('Request não encontrada');
      const donation = await this.prisma.donation.findUnique({
        where: {
          id: request.donationId
        }
      });
      if (!donation) throw new NotFoundException('Donation não encontrada');
      
      await this.prisma.donation.update({
        data: {
          isActive: data.answer == 'Aceite' ? true : false
        },
        where: {
          id: donation.id
        }
      });
      return await this.prisma.request.update({
        data: { 
          answer: data.answer,
          isActive: true
         },
         where: {
          id: data.requestId
         }
      });
  }
  async create(createDonationDto: CreateDonationDto) {
    let newCreateDonationtDto: any = {
      name: createDonationDto.name,
      desc: createDonationDto.desc,
      categoryId: Number(createDonationDto.categoryId),
      isOpen: true,
      isActive: createDonationDto.role == 'administrador' ? true : false,
      userId: Number(createDonationDto.userId),
      createdAt: new Date(),
      closedAt: new Date() // Permitir nulo
    };
    // if(createDonationDto.role == 'administrador') {      
    //   newCreateDonationtDto.employeeId = Number(createDonationDto.userId)
    // }
    if (createDonationDto.images && createDonationDto.images.length > 0) {
      const imgData = [];
      createDonationDto.images.forEach((img) => {
        imgData.push({ url: img.filename });
      });
      for (let donation of imgData) {
        const imageExists = await this.prisma.image.findUnique({
          where: {
            url: donation.url,
          },
        });
        if (imageExists) throw new BadRequestException('Imagem já existe');
      }
      // if(createDonationDto.role == 'administrador') {
      //   createDonationDto.employeeId = Number(createDonationDto.userId);
      // }
      const donation = await this.prisma.donation.create({
        data: {
          name: createDonationDto.name,
          desc: createDonationDto.desc,
          isOpen: true,
          isActive: createDonationDto.role == 'administrador' ? true : false,
          userId: Number(createDonationDto.userId),
          createdAt: new Date(),
          categoryId: Number(createDonationDto.categoryId),
          closedAt: new Date(),
          image: {
            create: imgData
          },
        },
      });
      if(createDonationDto.role !== 'administrador') {
        await this.prisma.request.create({
          data: { 
            answer: '',
            isActive: false,
            donationId: donation.id
           }
        });
        
      }
      return { data: donation };
    }
    const donation = await this.prisma.donation.create({
      data: newCreateDonationtDto
    });
    if(createDonationDto.role !== 'administrador') {
      await this.prisma.request.create({
        data: { 
          answer: '',
          isActive: false,
          donationId: donation.id
         }
      });
      
    }
    return { data: donation };
  }

  async findAll({ take, skip }): Promise<any> {
    const total = await this.prisma.donation.findMany();
    const totalPages = total.length / take;
    let data = await this.prisma.donation.findMany({
      skip: parseInt(skip),
      take: parseInt(take),
      orderBy: {
        id: 'desc',
      },
      include: {
        image: true
      }
    });
    return { data, total: Math.ceil(totalPages) };
  }

  async findOne(id: number): Promise<{ data: CreateDonationDto }> {
    const donation = await this.prisma.donation.findUnique({
      where: {
        id,
      },
      include: {
        image: true
      }
    });
    return { data: donation };
  }

  update(id: number, updateDonationDto: UpdateDonationDto) {
    return `This action updates a #${id} donation`;
  }

  remove(id: number) {
    return `This action removes a #${id} donation`;
  }
}
