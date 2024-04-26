import { UserService } from '../service/user.service';
import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Put, Query, Res, ValidationPipe } from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { Data, ResponseData } from '../../../global/globalClass';
import { HTTPMessage } from '../../../global/globalEnum';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UserService) { }

    @Get()
    async getAllUsers(
        @Query('page') paramsPage?: string,
        @Query('name') paramsSearchName?: string,
    ): Promise<ResponseData<UserModel[]>> {
        try {
            const search: string = paramsSearchName || '';
            if (paramsPage) {
                const itemsPerPage = 3;
                const skipUsers = (Number(paramsPage) - 1) * itemsPerPage;
                const currentPage = Number(paramsPage);
                return new ResponseData<UserModel[]>(
                    new Data<UserModel[]>(
                        await this.userService.users({
                            take: itemsPerPage,
                            skip: skipUsers,
                            select: {
                                id: true,
                                email: true,
                                username: true,
                                phone: true,
                                name: true,
                                status: true,
                                created_at: true,
                                updated_at: true,
                            },
                            where: {
                                OR: [
                                    {
                                        name: {
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
                return new ResponseData<UserModel[]>(
                    new Data<UserModel[]>(
                        await this.userService.users({
                            select: {
                                id: true,
                                email: true,
                                username: true,
                                phone: true,
                                name: true,
                                status: true,
                                created_at: true,
                                updated_at: true,
                            },
                            where: {
                                OR: [
                                    {
                                        name: {
                                            contains: search
                                        }
                                    }
                                ]
                            }
                        })
                    ),
                    HttpStatus.OK,
                    HTTPMessage.OK
                );
            }

        } catch (error) {
            return new ResponseData<UserModel[]>(
                null,
                HttpStatus.INTERNAL_SERVER_ERROR,
                error.message
            );
        }
    }

    @Get('/:id')
    async getUser(@Param('id') id: string): Promise<ResponseData<UserModel>> {
        try {
            return new ResponseData<UserModel>(
                new Data<UserModel>(
                    await this.userService.user({
                        where: {
                            id: Number(id)
                        },
                        select: {
                            id: true,
                            email: true,
                            username: true,
                            phone: true,
                            name: true,
                            status: true,
                            created_at: true,
                            updated_at: true,
                        }
                    })
                ),
                HttpStatus.OK,
                HTTPMessage.OK
            );
        }
        catch (error) {
            return new ResponseData<UserModel>(
                null,
                HttpStatus.NOT_FOUND,
                error.message
            );
        }
    }

    @Delete('/:id')
    async deleteUser(@Param('id') id: string) {
        try {
            return new ResponseData<UserModel>(
                new Data<UserModel>(
                    await this.userService.delete({
                        id: Number(id)
                    })
                ),
                HttpStatus.OK,
                HTTPMessage.OK
            );
        } catch (error) {
            return new ResponseData<UserModel>(
                null,
                HttpStatus.NOT_FOUND,
                error.message
            );
        }
    }

    @Put('/:id')
    async updateUserPut(
        @Param('id') id: string,
        // @Body(new ValidationPipe()) userData : UserDTO,
    ) {

    }

    @Patch('/:id')
    async updateUserPatch(
        @Param('id') id: string,
        // @Body(new ValidationPipe()) userData : UserDTO,
    ) {

    }
}
