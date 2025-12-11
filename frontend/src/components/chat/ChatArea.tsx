import { useState, useEffect, useRef } from "react";
import MsgList from "./MsgList";
import MessageInput from "./MessageInput";
import { useSocket } from "../../contexts/SocketContext";
import { useAuth } from "../../contexts/AuthContext";
import { chatService } from "../../services/chat.service";
import type { ChatUser } from "../../services/chat.service";
import "../../styles/ChatPage.css";

export interface DisplayMessage {
    id: string;
    sender: "user" | "other";
    text: string;
    timestamp: string;
}

interface Props {
    chatId: string;
    receiver: ChatUser;
    onChatCreated?: (newChatId: string) => void;
}

export default function ChatArea({ chatId, receiver, onChatCreated }: Props) {
    const { user } = useAuth();
    const { socket } = useSocket();
    const [messages, setMessages] = useState<DisplayMessage[]>([]);
    const listRef = useRef<HTMLDivElement>(null);
    const currentChatIdRef = useRef(chatId);
    const displayedMessageIds = useRef<Set<string>>(new Set());

    useEffect(() => {
        currentChatIdRef.current = chatId;
    }, [chatId]);

    useEffect(() => {
        displayedMessageIds.current.clear();
    }, [chatId, receiver.userId]);

    useEffect(() => {
        if (socket && chatId) {
            socket.emit("join_chat", { chatId });
        }
    }, [socket, chatId]);

    useEffect(() => {
        if (chatId) {
            chatService.getMessages(chatId).then((data) => {
                const formatted = data
                    .map<DisplayMessage>((m) => ({
                        id: m.messageId,
                        sender: m.senderId === user?.id ? "user" : "other",
                        text: m.content,
                        timestamp: new Date(m.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        }),
                    }))
                    .reverse();
                formatted.forEach(m => displayedMessageIds.current.add(m.id));
                setMessages(formatted);
            });
        } else {
            setMessages([]);
        }
    }, [chatId, user?.id]);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMsg: any) => {
            if (displayedMessageIds.current.has(newMsg.messageId)) {
                return;
            }

            const isCurrentChat =
                newMsg.chatId === currentChatIdRef.current ||
                (newMsg.senderId === receiver.userId && !currentChatIdRef.current) ||
                (newMsg.receiverId === receiver.userId && !currentChatIdRef.current);

            if (isCurrentChat) {
                displayedMessageIds.current.add(newMsg.messageId);
                
                const formattedMsg: DisplayMessage = {
                    id: newMsg.messageId,
                    sender: newMsg.senderId === user?.id ? "user" : "other",
                    text: newMsg.content,
                    timestamp: new Date(newMsg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                };
                setMessages((prev) => [...prev, formattedMsg]);

                if (!currentChatIdRef.current && newMsg.chatId) {
                    currentChatIdRef.current = newMsg.chatId;
                    onChatCreated?.(newMsg.chatId);
                }
            }
        };

        socket.on("message_received", handleNewMessage);

        return () => {
            socket.off("message_received", handleNewMessage);
        };
    }, [socket, user?.id, receiver.userId, onChatCreated]);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = (text: string) => {
        if (!socket || !user) return;

        socket.emit("send_message", {
            chatId: chatId || undefined,
            receiverId: receiver.userId,
            content: text,
        });
    };

    return (
        <div className="chat-area-wrapper">
            <div
                className="chat-header-info"
                style={{ padding: "10px 20px", borderBottom: "1px solid #eee", fontWeight: "bold" }}
            >
                Đang chat với: {receiver.fullName}
            </div>
            <div className="chat-area" ref={listRef}>
                <MsgList messages={messages} />
            </div>
            <MessageInput onSend={handleSend} />
        </div>
    );
}
