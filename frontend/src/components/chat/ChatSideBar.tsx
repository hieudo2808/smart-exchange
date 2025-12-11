export default function ChatSideBar() {
    return (
        <div className="chat-sidebar">

            <a href="/" className="back-link">← ホームへ戻る</a>

            <div className="history-title">チャット履歴</div>

            <div className="history-list">
                <div className="history-item selected">会話 1</div>
                <div className="history-item">会話 2</div>
            </div>
        </div>
    );
}
