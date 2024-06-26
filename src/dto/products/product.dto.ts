import { IsNotEmpty, IsNumber, MinLength } from "class-validator";

export class ProductDTO {
    @IsNotEmpty()
    @IsNumber()
    categoryId?: number;

    @MinLength(5, { message: "this field must be more than 5 charaters" })
    productName?: string;

    @IsNumber()
    price?: number;

    @IsNumber()
    userId?: number
};
