import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/skip-auth';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/signup')
  async create(@Body() createAuthDto: CreateAuthDto, @Req() req) {
    const salt = 10;
    const passwordHash = await bcrypt.hash(createAuthDto.password, salt);
    createAuthDto.password = passwordHash;
    createAuthDto.isAdmin = req.user.role
    return this.authService.create(createAuthDto);
  }

  @Public()
  @Post('/signin')
  signin(@Body() body) {
    return this.authService.signin(body);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
