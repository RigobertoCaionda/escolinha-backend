import { Controller, Get, Query } from '@nestjs/common';
import { Public } from 'src/auth/decorators/skip-auth';
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
}
