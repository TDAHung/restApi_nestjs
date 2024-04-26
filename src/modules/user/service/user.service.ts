import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma.service';
import { User as UserModel } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    users = async (
        params: {
            skip?: number,
            take?: number,
            select?: Prisma.UserSelect
            cursor?: Prisma.UserWhereUniqueInput,
            where?: Prisma.UserWhereInput,
            orderBy?: Prisma.UserOrderByWithRelationInput
        }
    ): Promise<any> => {
        const { skip, take, cursor, select, where, orderBy } = params;
        return await this.prisma.user.findMany({
            skip,
            take,
            cursor,
            select,
            where,
            orderBy
        });
    }

    user = async (
        params: {
            select?: Prisma.UserSelect,
            where?: Prisma.UserWhereUniqueInput
        }
    ): Promise<any> => {
        try {
            const { where, select } = params;
            return await this.prisma.user.findUniqueOrThrow({
                select,
                where
            })
        } catch (error) {
            throw new HttpException({ message: 'User Not Found' }, HttpStatus.NOT_FOUND);
        }
    }

    delete = async (where: Prisma.UserWhereUniqueInput): Promise<UserModel> => {
        try {
            return await this.prisma.user.delete({
                where
            });
        } catch (error) {
            throw new HttpException({ message: 'User does not exist' }, HttpStatus.NOT_FOUND);
        }
    }
}
