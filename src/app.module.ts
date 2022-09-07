import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './auth/guards/roles.guard';
import { PrismaService } from './prisma.service';
import { UserModule } from './user/user.module';
import { EmployeeModule } from './employee/employee.module';
import { DonationModule } from './donation/donation.module';
import { DonatorModule } from './donator/donator.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [UserModule, AuthModule, EmployeeModule, DonationModule, DonatorModule, CategoryModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, { provide: APP_GUARD, useClass: RolesGuard }],
})
export class AppModule {}
