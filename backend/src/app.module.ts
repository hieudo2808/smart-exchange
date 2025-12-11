import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./users/users.module";
import { ChatModule } from "./chat/chat.module";

@Module({
    imports: [PrismaModule, UsersModule, AuthModule, ChatModule],
})
export class AppModule {}
