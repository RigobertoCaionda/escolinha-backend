import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { RolesService } from 'src/user/roles/services/roles.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    private prisma: PrismaService,
    private rolesService: RolesService,
    private jwtService: JwtService
    ) {
    
  }
  async create(createEmployeeDto: CreateEmployeeDto) {
    let role = await this.rolesService.show(createEmployeeDto.roleId);
    if (!role.data) throw new NotFoundException('Cargo não encontrado');
    let employee = await this.findByEmail(createEmployeeDto.email);
    if (employee.data) throw new BadRequestException('Email já existe');
    let data = await this.prisma.employee.create({ data: createEmployeeDto });
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
    let employee = await this.prisma.employee.findUnique({
      where: {
        email,
      },
    });
    return { data: employee };
  }
 
  findAll() {
    return `This action returns all employee`;
  }

  findOne(id: number) {
    return `This action returns a #${id} employee`;
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} employee`;
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }
}
