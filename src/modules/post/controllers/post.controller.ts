import { Data, ResponseData } from 'src/global/globalClass';
import { PostService } from '../service/post.service';
import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Put, Query, ValidationPipe } from "@nestjs/common";
import { Post as PostModel } from '@prisma/client';
import { HTTPMessage } from 'src/global/globalEnum';
import { PostDTO } from 'src/dto/posts/posts.dto';

@Controller('posts')
export class PostsController {
    constructor(private readonly PostService: PostService) { }
    @Get()
    async getAllPosts(
        @Query('page') paramsPage: string,
        @Query('search') paramsSearch: string,
    ): Promise<ResponseData<PostModel[]>> {
        try {
            const search = paramsSearch || '';
            if (paramsPage) {
                const itemsPerPage: number = 3;
                const skipProducts: number = (Number(paramsPage) - 1) * itemsPerPage;
                const currentPage = Number(paramsPage);
                return new ResponseData<PostModel[]>(
                    new Data<PostModel[]>(
                        await this.PostService.posts({
                            take: itemsPerPage,
                            skip: skipProducts,
                            where: {
                                OR: [
                                    {
                                        image: {
                                            contains: search
                                        }
                                    }
                                ]
                            }
                        }),
                        itemsPerPage,
                        currentPage,
                    ),
                    HttpStatus.OK,
                    HTTPMessage.OK
                );
            } else {

                return new ResponseData<PostModel[]>(
                    new Data<PostModel[]>(
                        await this.PostService.posts({
                            where: {
                                OR: [
                                    {
                                        image: {
                                            contains: search
                                        }
                                    }
                                ]
                            }
                        }),
                    ),
                    HttpStatus.OK,
                    HTTPMessage.OK
                );
            }

        } catch (error) {
            return new ResponseData<PostModel[]>(
                null,
                HttpStatus.OK,
                error.message
            );
        }
    }

    @Get('/:id')
    async getPost(@Param('id') id: number): Promise<ResponseData<PostModel>> {
        try {
            return new ResponseData<PostModel>(
                new Data<PostModel>(
                    await this.PostService.post({
                        id: Number(id)
                    })
                ),
                HttpStatus.OK,
                HTTPMessage.OK
            );
        } catch (error) {
            return new ResponseData<PostModel>(
                null,
                HttpStatus.OK,
                error.message
            )
        }
    }

    @Post()
    async createPost(@Body(new ValidationPipe()) postDto: PostDTO) {
        const { image } = postDto;
        const created_at: Date = new Date();
        const updated_at: Date = new Date();
        try {
            return new ResponseData<PostModel>(
                new Data<PostModel>(
                    await this.PostService.create({
                        image,
                        created_at,
                        updated_at
                    })
                ),
                HttpStatus.OK,
                HTTPMessage.OK
            );
        } catch (error) {
            return new ResponseData<PostModel>(
                null,
                HttpStatus.OK,
                error.message
            );
        }
    }

    @Delete('/:id')
    async deletePost(@Param('id') id: number): Promise<ResponseData<PostModel>> {
        try {
            return new ResponseData<PostModel>(
                new Data<PostModel>(
                    await this.PostService.delete({
                        id: Number(id)
                    })
                ),
                HttpStatus.OK,
                HTTPMessage.OK,
            );
        } catch (error) {
            return new ResponseData<PostModel>(
                null,
                HttpStatus.OK,
                error.message,
            );
        }
    }

    @Put('/:id')
    async updatePutPost(
        @Param('id') id: number,
        @Body(new ValidationPipe()) body: PostDTO
    ): Promise<ResponseData<PostModel>> {
        const { image } = body;
        const updated_at: Date = new Date();
        try {
            return new ResponseData<PostModel>(
                new Data<PostModel>(
                    await this.PostService.update({
                        where: {
                            id: Number(id)
                        },
                        data: {
                            image,
                            updated_at
                        }
                    })
                ),
                HttpStatus.OK,
                HTTPMessage.OK
            );
        } catch (error) {
            return new ResponseData<PostModel>(
                null,
                HttpStatus.OK,
                error.message,
            );
        }
    }

    @Patch('/:id')
    async updatePatchPost(
        @Param('id') id: number,
        @Body(new ValidationPipe()) body: PostDTO
    ): Promise<ResponseData<PostModel>> {
        const { image } = body;
        try {
            return new ResponseData<PostModel>(
                new Data<PostModel>(
                    await this.PostService.update({
                        where: {
                            id: Number(id)
                        },
                        data: {
                            image
                        }
                    })
                ),
                HttpStatus.OK,
                HTTPMessage.OK
            );
        } catch (error) {
            return new ResponseData<PostModel>(
                null,
                HttpStatus.OK,
                error.message,
            );
        }
    }
}
