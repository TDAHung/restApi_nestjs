import { Module } from '@nestjs/common';
import { UsersController } from './controllers/user.controller';
import { UserService } from './service/user.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [UsersController],
  providers: [UserService, PrismaService]
})
export class UserModule { }
