import { Module } from "@nestjs/common";
import { ProductsController } from "./controllers/product.controller";
import { ProductService } from "./service/product.service";
import { PrismaService } from "src/prisma.service";

@Module({
    controllers: [ProductsController],
    providers: [ProductService, PrismaService]
})

export class ProductModule { };
