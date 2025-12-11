import type { DisplayMessage as Message } from "./ChatArea";
import avatarUser from "../../assets/avatar-user.png";
import avatarOther from "../../assets/avatar-other.png";

export default function MessageBubble({ msg }: { msg: Message }) {
    console.log("MSG:", msg);

    const isUser = msg.sender === "user";
    return (
        <div className={`bubble-row ${isUser ? "right" : "left"}`}>
            <img
                src={isUser ? avatarUser : avatarOther}
                className="avatar"
            />
            <div className="bubble-wrapper">
                <div className="bubble">{msg.text}</div>
                <div className="timestamp">{msg.timestamp}</div>
            </div>
        </div>
    );
}

