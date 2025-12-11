import type { Message } from "../../types/message";
import avatarUser from "../../assets/avatar-user.png";
import avatarOther from "../../assets/avatar-other.png";

export default function MessageBubble({ msg }: { msg: Message }) {
    const isUser = msg.sender === "user";

    return (
        <div className={`bubble-row ${isUser ? "right" : "left"}`}>
            <img src={isUser ? avatarUser : avatarOther} className="avatar" />

            <div className="bubble-wrapper">
                <div className="bubble">{msg.text}</div>
                <div className="timestamp">{msg.timestamp}</div>
            </div>
        </div>
    );
}
