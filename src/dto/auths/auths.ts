import { IsNotEmpty, IsNumber, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class RegisterDTO {
    @IsNotEmpty()
    @IsString()
    email?: string;

    @Matches(/^[a-z0-9_-]{3,16}$/)
    username?: string;

    @MinLength(6)
    password?: string;

    @MinLength(10, { message: "this field must be more than 5 charaters" })
    @MaxLength(11)
    phone?: string;

    @IsNumber()
    status?: number;

    name?: string;
};

export interface LoginDTO {
    email?: string;
    password?: string;
}

export interface AuthTokenDTO {
    accessToken?: string;
    refreshToken?: string;
}
