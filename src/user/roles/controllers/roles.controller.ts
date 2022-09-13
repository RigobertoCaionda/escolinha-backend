import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Public } from 'src/auth/decorators/skip-auth';
import { CreateRoleDto } from 'src/user/dto/create-role.dto';
import { FIlterDto } from 'src/user/dto/filter';
import { RolesService } from '../services/roles.service';

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Public()
  @Get()
  index(@Query() query: FIlterDto) {
    const { skip = 0, take = 10 } = query;
    return this.rolesService.index({
      skip,
      take,
    });
  }

  @Post('')
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: any) {
    return this.rolesService.update(parseInt(id), updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.delete(parseInt(id));
  }
}
