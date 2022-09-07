import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { PrismaService } from 'src/prisma.service';
import { RolesService } from 'src/user/roles/services/roles.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from './env-helper/jwt.config';

@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService, PrismaService, RolesService, JwtStrategy],
  imports: [
    JwtModule.registerAsync(JwtConfig)
  ]
})
export class EmployeeModule {}
