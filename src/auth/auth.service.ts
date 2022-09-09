import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { RolesService } from 'src/user/roles/services/roles.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private rolesService: RolesService,
    private jwtService: JwtService,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    let role = await this.rolesService.show(createAuthDto.roleId);
    if (!role.data) throw new NotFoundException('Cargo não encontrado');
    let user = await this.findByEmail(createAuthDto.email);
    if (user.data) throw new BadRequestException('Email já existe');
    let data;
    return { data: createAuthDto.isAdmin }
    data = await this.prisma.user.create({ data: createAuthDto });
    return {
      token: this.jwtService.sign({
        id: data.id,
        name: data.name,
        role: role.data.name,
      }),
      data
    };
  }

  async findByEmail(email: string): Promise<any> {
    let user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    return { data: user };
  }

  async signin(body): Promise<any> {
    if (!body.email || !body.password)
      throw new UnauthorizedException('Email ou senha errados');
    const user = await this.prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) throw new UnauthorizedException('Email ou senha errados');
    const userExists = await bcrypt.compare(body.password, user.password);
    if (!userExists) throw new UnauthorizedException('Email ou senha errados');
    const role = await this.rolesService.show(user.roleId);

    return {
      token: this.jwtService.sign({
        id: user.id,
        name: user.name,
        role: role.data.name,
      }),
    };
  }
  
  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
