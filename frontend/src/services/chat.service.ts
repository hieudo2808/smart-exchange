import { axiosInstance } from "./axios.config";

export interface ChatUser {
    userId: string;
    fullName: string;
    email: string;
}

export interface LastMessage {
    content: string;
    createdAt: string;
}

export interface ChatSession {
    chatId: string;
    userOne: ChatUser;
    userTwo: ChatUser;
    messages: LastMessage[];
    updateAt: string;
}

export interface ChatMessage {
    messageId: string;
    senderId: string;
    content: string;
    createdAt: string;
}

class ChatService {
    // Get chat list
    async getMyChats(): Promise<ChatSession[]> {
        return axiosInstance.get("/chats");
    }

    async getMessages(chatId: string): Promise<ChatMessage[]> {
        return axiosInstance.get(`/chats/${chatId}/messages`);
    }

    async getAllUsers(): Promise<ChatUser[]> {
        return axiosInstance.get("/users");
    }
}

export const chatService = new ChatService();
