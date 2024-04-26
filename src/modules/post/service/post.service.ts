import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { Prisma, Post } from "@prisma/client";

@Injectable()
export class PostService {
    constructor(private prisma: PrismaService) { }

    post = async (
        postWhereUniqueInput: Prisma.PostWhereUniqueInput
    ): Promise<Post | null> => {
        const post = await this.prisma.post.findUnique({
            where: postWhereUniqueInput,
        });
        if (!post) throw new HttpException({ message: 'Record does not exist' }, HttpStatus.NOT_FOUND);
        return post;
    }

    posts = async (
        params: {
            skip?: number,
            take?: number,
            select?: Prisma.PostSelect,
            cursor?: Prisma.PostWhereUniqueInput,
            where?: Prisma.PostWhereInput,
            orderBy?: Prisma.PostOrderByWithRelationInput;
        }
    ): Promise<Post[] | null> => {
        const { skip, take, cursor, where, orderBy } = params;
        return await this.prisma.post.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy
        });
    }

    create = async (
        data: Prisma.PostUncheckedCreateInput
    ): Promise<Post | null> => {
        try {
            return await this.prisma.post.create({
                data
            });
        } catch (error) {
            throw new HttpException({ message: error.message }, HttpStatus.NOT_ACCEPTABLE);
        }
    }

    delete = async (
        where: Prisma.PostWhereUniqueInput
    ): Promise<Post | null> => {
        try {
            return await this.prisma.post.delete({
                where,
            });
        } catch (error) {
            throw new HttpException({ message: error.message }, HttpStatus.NOT_FOUND);
        }
    }

    update = async (
        params: {
            where: Prisma.PostWhereUniqueInput,
            data: Prisma.PostUncheckedUpdateInput
        }
    ): Promise<Post | null> => {
        try {
            const { where, data } = params;
            return await this.prisma.post.update({
                where,
                data
            });
        } catch (error) {
            throw new HttpException({ message: error.message }, HttpStatus.NOT_FOUND);
        }
    }
}
