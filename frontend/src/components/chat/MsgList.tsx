import MessageBubble from "./MessageBubble";
import type { Message } from "../../types/message";

export default function MsgList({ messages }: { messages: Message[] }) {
    return (
        <div className="msg-list">
            {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} />
            ))}
        </div>
    );
}
