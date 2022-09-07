import { Module } from '@nestjs/common';
import { DonatorService } from './donator.service';
import { DonatorController } from './donator.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [DonatorController],
  providers: [DonatorService, PrismaService]
})
export class DonatorModule {}
