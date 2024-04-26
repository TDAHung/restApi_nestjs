import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Product, Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) { }

    product = async (
        productWhereUniqueInput: Prisma.ProductWhereUniqueInput,
    ): Promise<Product | null> => {
        const product = await this.prisma.product.findUnique({
            where: productWhereUniqueInput,
        });
        if (!product) {
            throw new Error(`Product ${productWhereUniqueInput} not found`);
        }
        return product;
    }

    products = async (
        params: {
            skip?: number,
            take?: number,
            select?: Prisma.ProductSelect,
            cursor?: Prisma.ProductWhereUniqueInput,
            include?: Prisma.ProductInclude,
            where?: Prisma.ProductWhereInput,
            orderBy?: Prisma.ProductOrderByWithRelationInput,
        }
    ): Promise<Product[]> => {
        const { skip, take, cursor, where, orderBy, include } = params;

        return await this.prisma.product.findMany({
            skip,
            take,
            cursor,
            where,
            include,
            orderBy,
        });
    }

    create = async (data: Prisma.ProductUncheckedCreateInput): Promise<Product> => {
        try {
            return await this.prisma.product.create({
                data,
            });
        } catch (error) {
            throw new HttpException({ message: "Can not create Product" }, HttpStatus.NOT_ACCEPTABLE);
        }
    }

    update = async (params: {
        where: Prisma.ProductWhereUniqueInput;
        data: Prisma.ProductUncheckedUpdateInput;
    }): Promise<Product> => {
        try {
            const { where, data } = params;
            return await this.prisma.product.update({
                data,
                where,
            });
        } catch (error) {
            throw new HttpException({ message: "Can not update Product" }, HttpStatus.NOT_ACCEPTABLE);
        }
    }

    delete = async (where: Prisma.ProductWhereUniqueInput): Promise<Product> => {
        try {
            return await this.prisma.product.delete({
                where,
            });
        } catch (error) {
            throw new HttpException(`Post with ${where} not found`, HttpStatus.NOT_FOUND);
        }
    }
}
