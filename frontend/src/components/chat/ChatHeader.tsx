import MenuButton from "./MenuButton";
import LanguageSwitcher from "../LanguageSwitcher";

export default function ChatHeader() {
    return (
        <div className="chat-header">
            <div className="logo">Smart Exchange</div>
            <div className="title">チャット</div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <LanguageSwitcher />
                <MenuButton />
            </div>
        </div>
    );
}
