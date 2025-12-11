import MenuButton from "./MenuButton";

export default function ChatHeader() {
    return (
        <div className="chat-header">
            <div className="logo">Smart Exchange</div>
            <div className="title">チャット</div>
            <MenuButton />
        </div>
    );
}
