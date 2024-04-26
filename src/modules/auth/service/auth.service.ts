import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { Prisma, User as UserModel } from "@prisma/client";
import { LoginDTO } from "src/dto/auths/auths";
import { compare } from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) { }
    register = async (
        userRegisterData: Prisma.UserCreateInput
    ): Promise<UserModel> => {
        const { email } = userRegisterData;
        const user = await this.prisma.user.findUnique({
            where: {
                email
            }
        });
        if (user) {
            throw new HttpException('This email has been used', HttpStatus.BAD_REQUEST)
        }
        return await this.prisma.user.create({
            data: {
                ...userRegisterData,
            }
        });
    }

    login = async (data: LoginDTO): Promise<{ accessToken: string, refreshToken: string }> => {
        const { email, password } = data;
        const user = await this.prisma.user.findUnique({
            where: {
                email
            }
        });
        if (!user) {
            throw new HttpException({ message: "Account does not exist" }, HttpStatus.UNAUTHORIZED);
        }

        const verify = await compare(password, user.password);
        if (!verify) {
            throw new HttpException({ message: "Password does not correct" }, HttpStatus.UNAUTHORIZED);
        }

        const payload = { id: user.id, name: user.name, email: user.email };
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: process.env.ACCESS_TOKEN_KEY,
            expiresIn: '1h'
        })
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: process.env.REFRESH_TOKEN_KEY,
            expiresIn: '7d'
        })
        return {
            accessToken,
            refreshToken
        }
    }
};
