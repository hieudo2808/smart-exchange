import "../styles/ChatPage.css";
import ChatHeader from "../components/chat/ChatHeader";
import ChatSideBar from "../components/chat/ChatSideBar";
import ChatArea from "../components/chat/ChatArea";

export default function ChatPage() {
    return (
        <div className="chat-container">
            <ChatHeader />

            <div className="chat-body">
                <ChatSideBar />
                <ChatArea />
            </div>
        </div>
    );
}
