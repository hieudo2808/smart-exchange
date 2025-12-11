import { useEffect, useRef } from "react";

interface Props {
    onSend: (text: string) => void;
}

export default function MessageInput({ onSend }: Props) {
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        editorRef.current?.focus();
    }, []);

    const sendMessage = () => {
        const div = editorRef.current;
        if (!div) return;

        const text = div.innerText.trim();
        if (!text) return;

        onSend(text);

        div.innerHTML = "";
        div.focus();
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="input-container">
            <div
                ref={editorRef}
                className="editor input-placeholder"
                contentEditable
                suppressContentEditableWarning={true}
                onKeyDown={onKeyDown}
            />

            <button className="send-button" onClick={sendMessage}>
                提案をチェック
            </button>
        </div>
    );
}
