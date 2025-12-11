import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AppException } from "../common/exceptions/app.exception";
import { ExceptionCode } from "../common/constants/exception-code.constant";

@Injectable()
export class ChatService {
    constructor(private readonly prisma: PrismaService) {}

    private sortUserIds(userA: string, userB: string) {
        return userA < userB ? [userA, userB] : [userB, userA];
    }

    async ensureChatAccess(chatId: string, userId: string) {
        const chat = await this.prisma.chat.findUnique({
            where: { chatId },
        });

        if (!chat) {
            throw new AppException(ExceptionCode.NOT_FOUND, "Chat not found");
        }

        if (chat.userOneId !== userId && chat.userTwoId !== userId) {
            throw new AppException(ExceptionCode.FORBIDDEN, "You are not a member of this chat");
        }

        return chat;
    }

    async findOrCreateChat(currentUserId: string, partnerUserId: string, chatId?: string) {
        if (chatId) {
            return this.ensureChatAccess(chatId, currentUserId);
        }

        const [userOneId, userTwoId] = this.sortUserIds(currentUserId, partnerUserId);

        const existingChat = await this.prisma.chat.findFirst({
            where: { userOneId, userTwoId },
        });

        if (existingChat) {
            return existingChat;
        }

        return this.prisma.chat.create({
            data: {
                userOneId,
                userTwoId,
            },
        });
    }

    async saveMessage(chatId: string, senderId: string, content: string) {
        const message = await this.prisma.message.create({
            data: {
                chatId,
                senderId,
                content,
            },
        });

        await this.prisma.chat.update({
            where: { chatId },
            data: { updateAt: new Date() },
        });

        return message;
    }

    async getMessages(chatId: string, userId: string, limit = 50) {
        await this.ensureChatAccess(chatId, userId);
        return this.prisma.message.findMany({
            where: { chatId },
            orderBy: { createdAt: "desc" },
            take: limit,
            include: {
                sender: {
                    select: {
                        userId: true,
                        email: true,
                        fullName: true,
                    },
                },
            },
        });
    }
}
