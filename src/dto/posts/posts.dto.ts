import { MaxLength, MinLength } from "class-validator";

export class PostDTO {
    @MaxLength(255)
    image?: string;
}
