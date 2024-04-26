import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthsController } from './controllers/auth.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
    controllers: [AuthsController],
    providers: [AuthService, PrismaService, JwtService]
})

export class AuthModule { };
