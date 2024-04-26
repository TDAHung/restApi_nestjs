import { UserService } from './../service/user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './user.controller';
import { PrismaService } from '../../../prisma.service';
import { HTTPMessage } from '../../../global/globalEnum';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UserService, PrismaService]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const users = await controller.getAllUsers();
      expect(users.responseData).toEqual(users.responseData);
      expect(users.message).toBe(HTTPMessage.OK);
    })
  });
});
