import { useState, useEffect, useRef } from "react";
import MsgList from "./MsgList";
import MessageInput from "./MessageInput";
import "../../styles/ChatPage.css";

import type { Message } from "../../types/message"; // dùng interface chung

export default function ChatArea() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            sender: "other",
            text: "お疲れ様です。確認をお願いします。",
            timestamp: "10:22",
        }
    ]);

    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        listRef.current?.scrollTo({
            top: listRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages]);

    const handleSend = (text: string) => {
        const newMsg: Message = {
            id: Date.now().toString(),
            sender: "user",
            text,
            timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        setMessages(prev => [...prev, newMsg]);
    };

    return (
        <div className="chat-area-wrapper">
            <div className="chat-area" ref={listRef}>
                <MsgList messages={messages} />
            </div>
            <MessageInput onSend={handleSend} />
        </div>
    );
}
