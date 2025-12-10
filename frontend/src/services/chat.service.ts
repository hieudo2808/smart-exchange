import { axiosInstance } from "./axios.config";
import { ChatMessage } from "../contexts/ChatContext";

class ChatService {
    async getMessages(chatId: string, limit = 50): Promise<ChatMessage[]> {
        return axiosInstance.get(`/chats/${chatId}/messages`, {
            params: { limit },
        });
    }
}

export const chatService = new ChatService();


