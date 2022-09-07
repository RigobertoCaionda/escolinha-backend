import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from './env-helper/jwt.config';
import { PrismaService } from 'src/prisma.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesService } from 'src/user/roles/services/roles.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    RolesService,
    JwtStrategy,
    { provide: 'APP_GUARD', useClass: JwtAuthGuard }
  ],
  imports: [
    JwtModule.registerAsync(JwtConfig)
  ]
})
export class AuthModule {}
