import { useState, useRef } from "react";
import "../styles/ChatPage.css";
import ChatHeader from "../components/chat/ChatHeader";
import ChatSideBar from "../components/chat/ChatSideBar";
import ChatArea from "../components/chat/ChatArea";
import type { ChatSession, ChatUser } from "../services/chat.service";
import { useAuth } from "~/contexts/AuthContext";

export default function ChatPage() {
    const { user, loading } = useAuth();
    const [selectedChat, setSelectedChat] = useState<ChatSession | null>(null);
    const [receiver, setReceiver] = useState<ChatUser | null>(null);
    const sidebarRefreshRef = useRef<(() => void) | null>(null);

    const handleSelectChat = (chat: ChatSession, partner: ChatUser) => {
        setSelectedChat(chat);
        setReceiver(partner);
    };

    const handleChatCreated = (newChatId: string) => {
        if (selectedChat && receiver) {
            setSelectedChat({
                ...selectedChat,
                chatId: newChatId,
            });
        }
        sidebarRefreshRef.current?.();
    };

    if (!user || loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="text-xl font-semibold text-gray-600">Loading chat...</div>
            </div>
        );
    }

    return (
        <div className="chat-container">
            <ChatHeader />
            <div className="chat-body">
                <ChatSideBar
                    onSelectChat={handleSelectChat}
                    selectedChatId={selectedChat?.chatId}
                    onRefreshRef={(fn) => {
                        sidebarRefreshRef.current = fn;
                    }}
                />
                {selectedChat && receiver ? (
                    <ChatArea
                        chatId={selectedChat.chatId}
                        receiver={receiver}
                        onChatCreated={handleChatCreated}
                    />
                ) : (
                    <div
                        className="chat-area-placeholder"
                        style={{
                            flex: 1,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "#888",
                        }}
                    >
                        Chọn một cuộc trò chuyện để bắt đầu
                    </div>
                )}
            </div>
        </div>
    );
}
