import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Put, Query, ValidationPipe } from "@nestjs/common";
import { ProductService } from "../service/product.service";
import { HTTPMessage, } from "src/global/globalEnum";
import { ResponseData, Data } from "src/global/globalClass";
import { ProductDTO } from "src/dto/products/product.dto";
import { Product as ProductModel } from "@prisma/client";

@Controller('products')
export class ProductsController {
    constructor(private readonly productService: ProductService) { }

    @Get()
    async getAllProducts(
        @Query('search') paramsSearch?: string,
        @Query('page') paramsPage?: string,
    ): Promise<ResponseData<ProductModel[]>> {
        try {
            const search: string = paramsSearch || '';
            if (paramsPage) {
                const itemsPerPage: number = 3;
                const skipProducts: number = (Number(paramsPage) - 1) * itemsPerPage;
                const currentPage = Number(paramsPage);
                return new ResponseData<ProductModel[]>(
                    new Data<ProductModel[]>(
                        await this.productService.products({
                            take: itemsPerPage,
                            skip: skipProducts,
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true,
                                        phone: true
                                    }
                                }
                            },
                            where: {
                                OR: [
                                    {
                                        productName: {
                                            contains: search
                                        },
                                    },
                                ]
                            }
                        }),
                        itemsPerPage,
                        currentPage,
                    ),
                    HttpStatus.CREATED,
                    HTTPMessage.OK
                );
            } else {
                return new ResponseData<ProductModel[]>(
                    new Data<ProductModel[]>(
                        await this.productService.products({
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true,
                                        phone: true
                                    }
                                }
                            },
                            where: {
                                OR: [
                                    {
                                        productName: {
                                            contains: search
                                        }
                                    }
                                ]
                            }
                        }),
                    ),
                    HttpStatus.CREATED,
                    HTTPMessage.OK
                );
            }

        } catch (error) {
            return new ResponseData<ProductModel[]>(
                null,
                HttpStatus.NOT_FOUND,
                HTTPMessage.NOT_FOUND
            );
        }
    }

    @Get('/:id')
    async getProduct(@Param('id') id: number): Promise<ResponseData<ProductModel>> {
        try {
            return new ResponseData<ProductModel>(
                new Data<ProductModel>(
                    await this.productService.product({
                        id: Number(id)
                    })
                ),
                HttpStatus.CREATED,
                HTTPMessage.OK
            );
        } catch (error) {
            return new ResponseData<ProductModel>(
                null,
                HttpStatus.NOT_FOUND,
                HTTPMessage.NOT_FOUND,
            )
        }
    }

    @Post()
    async createProduct(
        @Body(new ValidationPipe()) productDto: ProductDTO
    ): Promise<ResponseData<ProductModel>> {
        const { categoryId, price, productName, userId } = productDto;
        const created_at: Date = new Date();
        const updated_at: Date = new Date();
        try {
            return new ResponseData<ProductModel>(
                new Data<ProductModel>(
                    await this.productService.create({
                        categoryId,
                        price,
                        productName,
                        userId,
                        created_at: created_at,
                        updated_at: updated_at,
                    }),
                ),
                HttpStatus.CREATED,
                HTTPMessage.OK
            );
        } catch (error) {
            return new ResponseData<ProductModel>(
                null,
                HttpStatus.NOT_ACCEPTABLE,
                error.message,
            );
        }
    }

    @Delete('/:id')
    async deleteProduct(
        @Param('id') id: number
    ): Promise<ResponseData<ProductModel>> {
        try {
            return new ResponseData<ProductModel>(
                new Data<ProductModel>(
                    await this.productService.delete({
                        id: Number(id)
                    })
                ),
                HttpStatus.CREATED,
                HTTPMessage.OK
            );
        } catch (error) {
            return new ResponseData<ProductModel>(
                null,
                HttpStatus.NOT_FOUND,
                HTTPMessage.NOT_FOUND
            );
        }
    }

    @Put('/:id')
    async updateProductPut(
        @Param('id') id: number,
        @Body(new ValidationPipe()) productDto: ProductDTO
    ): Promise<ResponseData<ProductModel>> {
        const { categoryId, price, productName, userId } = productDto;
        const updated_at: Date = new Date();
        try {
            return new ResponseData<ProductModel>(
                new Data<ProductModel>(
                    await this.productService.update({
                        where: { id: Number(id) },
                        data: {
                            categoryId,
                            price,
                            productName,
                            userId,
                            updated_at
                        }
                    })
                ),
                HttpStatus.CREATED,
                HTTPMessage.OK
            );
        } catch (error) {
            return new ResponseData<ProductModel>(
                null,
                HttpStatus.NOT_FOUND,
                HTTPMessage.NOT_FOUND
            );
        }
    }

    @Patch('/:id')
    async updateProductPatch(
        @Param('id') id: number,
        @Body(new ValidationPipe()) body: ProductDTO
    ): Promise<ResponseData<ProductModel>> {
        const { categoryId, price, productName } = body;
        try {
            return new ResponseData<ProductModel>(
                new Data<ProductModel>(
                    await this.productService.update({
                        where: { id: Number(id) },
                        data: {
                            categoryId,
                            price,
                            productName
                        }
                    }),
                ),
                HttpStatus.CREATED,
                HTTPMessage.OK
            );
        } catch (error) {
            return new ResponseData<ProductModel>(
                null,
                HttpStatus.NOT_FOUND,
                HTTPMessage.NOT_FOUND
            );
        }
    }
}
