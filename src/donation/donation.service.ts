import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { HandleUserRequestDto } from './dto/handle-user-request.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';

@Injectable()
export class DonationService {
  constructor(private prisma: PrismaService) {}
  async deleteUserRequest(id: number) {
    let request = await this.prisma.request.findUnique({
      where: {
        id
      }
    });
    if(!request) throw new NotFoundException('Pedido não encontrado');
    return this.prisma.request.delete({
      where: {
        id
      }
    });
  }

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
        user: true
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
        user: true
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
            donationId: donation.id,
            userId: Number(createDonationDto.userId)
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
          donationId: donation.id,
          userId: Number(createDonationDto.userId)
         }
      });
      
    }
    return { data: donation };
  }

  async findAll({ take, skip, search, categoryId }): Promise<any> {
    let total;
   if(categoryId) {
    total = await this.prisma.donation.findMany({
      where: {
        isActive: true,
        AND: {
          name: {
            contains: search
          },
          AND: {
            categoryId: Number(categoryId)
          }
        }
      }
    });
   }
   if(!categoryId) {
    total = await this.prisma.donation.findMany({
      where: {
        isActive: true,
        AND: {
          name: {
            contains: search
          }
        }
      }
    });
   }
    const totalPages = total.length / take;
    let data;
    if(categoryId) {
      data = await this.prisma.donation.findMany({
        skip: parseInt(skip),
        take: parseInt(take),
        orderBy: {
          id: 'desc',
        },
        include: {
          image: true,
          category: true
        },
        where: {
          isActive: true,
          AND: {
            name: {
              contains: search
            },
            AND: {
              categoryId: Number(categoryId)
            }
          }
        }
      });
    }

    if(!categoryId) {
      data = await this.prisma.donation.findMany({
        skip: parseInt(skip),
        take: parseInt(take),
        orderBy: {
          id: 'desc',
        },
        include: {
          image: true,
          category: true
        },
        where: {
          isActive: true,
          AND: {
            name: {
              contains: search
            }
          }
        }
      });
    }
    return { data, total: Math.ceil(totalPages) };
  }

  async findOne(id: number): Promise<{ data: CreateDonationDto }> {
    const donation = await this.prisma.donation.findUnique({
      where: {
        id,
      },
      include: {
        image: true,
        category: true
      }
    });
    return { data: donation };
  }

  async update(id: number, updateDonationDto: any) {
    let donation = await this.prisma.donation.findUnique({
      where: {
        id: Number(id)
      }
    });
    if(!donation) throw new NotFoundException('Essa corrente de doação não existe');
    if (updateDonationDto.categoryId) {
      updateDonationDto.categoryId = Number(updateDonationDto.categoryId)
      let category = await this.prisma.category.findUnique({
        where: {
          id: updateDonationDto.categoryId
        },
      });
      if (!category) throw new NotFoundException('Categoria não encontrada');
    }
    if(updateDonationDto.isActive == 'true') {
      updateDonationDto.isActive = true
    }
    if(updateDonationDto.isActive == 'false') {
      updateDonationDto.isActive = false
    }
    return await this.prisma.donation.update({
      data: updateDonationDto,
      where: {
        id,
      },
    });
  }

  async remove(id: number) {
    let donation = await this.prisma.donation.findUnique({
      where: {
        id
      }
    });
    await this.prisma.image.deleteMany({
      where: {
        id: donation.id
      }
    });
    if(!donation) throw new NotFoundException('Doação não encontrada');
    return await this.prisma.donation.delete({
      where: {
        id,
      },
    });
  }
}
