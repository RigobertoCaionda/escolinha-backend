import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { Public } from 'src/auth/decorators/skip-auth';
import { DonatorService } from './donator.service';
import { CreateDonatorDto } from './dto/create-donator.dto';
import { UpdateDonatorDto } from './dto/update-donator.dto';
import { fileInterceptorOptionsHelper } from './helper/file_interceptor_options';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('donator')
export class DonatorController {
  constructor(private readonly donatorService: DonatorService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('image', null, fileInterceptorOptionsHelper),
  )
  create(@Body() createDonatorDto: CreateDonatorDto,
  @UploadedFiles() files: Array<Express.Multer.File>) {
    createDonatorDto.image = files;
    return this.donatorService.create(createDonatorDto);
  }

  @Get()
  findAll() {
    return this.donatorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.donatorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDonatorDto: UpdateDonatorDto) {
    return this.donatorService.update(+id, updateDonatorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.donatorService.remove(+id);
  }
}
