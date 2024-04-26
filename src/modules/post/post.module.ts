import { Module } from "@nestjs/common";
import { PostsController } from "./controllers/post.controller";
import { PostService } from "./service/post.service";
import { PrismaService } from "src/prisma.service";

@Module({
    controllers: [PostsController],
    providers: [PostService, PrismaService]
})

export class PostModule { };
