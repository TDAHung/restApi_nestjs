import { AuthService } from '../service/auth.service';
import { Body, Controller, HttpStatus, Post } from "@nestjs/common";
import { User as UserModel } from "@prisma/client";
import { hash } from 'bcrypt';
import { AuthTokenDTO, LoginDTO, RegisterDTO } from "src/dto/auths/auths";
import { Data, ResponseData } from 'src/global/globalClass';
import { HTTPMessage } from 'src/global/globalEnum';

@Controller('auths')
export class AuthsController {

    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() body: RegisterDTO): Promise<ResponseData<UserModel>> {
        try {
            const { email, username, phone, name, status, password } = body;
            const hashPassword: string = await hash(password, 10);
            const created_at: Date = new Date();
            const updated_at: Date = new Date();
            return new ResponseData<UserModel>(
                new Data<UserModel>(
                    await this.authService.register({
                        email,
                        username,
                        password: hashPassword,
                        phone,
                        name,
                        status,
                        created_at,
                        updated_at,
                    })
                ),
                HttpStatus.OK,
                HTTPMessage.OK,
            );
        } catch (error) {
            return new ResponseData<UserModel>(
                null,
                HttpStatus.NOT_FOUND,
                error.message,
            );
        }
    }

    @Post('login')
    async login(@Body() body: LoginDTO): Promise<ResponseData<AuthTokenDTO>> {
        try {
            return new ResponseData<AuthTokenDTO>(
                new Data<AuthTokenDTO>(
                    await this.authService.login(body),
                ),
                HttpStatus.OK,
                HTTPMessage.OK
            );
        } catch (error) {
            return new ResponseData<AuthTokenDTO>(
                null,
                HttpStatus.UNAUTHORIZED,
                error.message,
            );
        }
    }
};
