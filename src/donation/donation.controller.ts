import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseInterceptors, UploadedFiles, Res, Req, Put } from '@nestjs/common';
import { Public } from 'src/auth/decorators/skip-auth';
import { FIlterDto } from 'src/user/dto/filter';
import { DonationService } from './donation.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { fileInterceptorOptionsHelper } from './helper/file_interceptor_options';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { HandleUserRequestDto } from './dto/handle-user-request.dto';

@Controller('donation')
export class DonationController {
  constructor(private readonly donationService: DonationService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', null, fileInterceptorOptionsHelper),
  )
  create(@Body() createDonationDto: CreateDonationDto, 
  @UploadedFiles() files: Array<Express.Multer.File>, @Req() req) {
    createDonationDto.role = req.user.role;
    createDonationDto.images = files;
    return this.donationService.create(createDonationDto);
  }

  @Public()
  @Get('/unresolved/:id')
  getOneRequest(@Param('id', ParseIntPipe) id: number) {
    return this.donationService.getOneUnresolvedRequest(id);
  }

  @Public()
  @Get('/unresolved')
  getRequests() {
    return this.donationService.getUnresolvedRequests();
  }

  @Public()
  @Put('/accept-request')
  acceptRequest(@Body() handleUserRequestDto: HandleUserRequestDto) {
    return this.donationService.handleUserRequest(handleUserRequestDto);
  }

  @Public()
  @Get()
  findAll(@Query() query: FIlterDto) {
    const { skip = 0, take = 5, search, categoryId } = query;
    return this.donationService.findAll({ skip, take, search, categoryId });
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.donationService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDonationDto: UpdateDonationDto) {
    return this.donationService.update(+id, updateDonationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.donationService.remove(+id);
  }

  @Public()
  @Get('/uploads/:img')
  getImagePath(@Param('img') image: string, @Res() res: Response) {
    res.sendFile(image, { root: 'public' });
  }
}
