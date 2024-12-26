"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";

interface Message {
    userId: string;
    message: string;
    timestamp: string;
}

export default function ChatPage() {
    const { data: session, status } = useSession();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") {
            signIn(); // 로그인 페이지로 리다이렉트
        }

        async function fetchMessages() {
            const response = await fetch("/api/chat");
            const data = await response.json();
            setMessages(data);
        }

        fetchMessages();

        // 주기적으로 메시지 가져오기
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [status]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: session?.user?.email || "Unknown User",
                message: newMessage,
            }),
        });

        if (response.ok) {
            setNewMessage(""); // 입력창 초기화
            const data = await response.json();
            console.log("Message sent:", data);
        }
    };

    return (
        <div className="chat-container">
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className="message">
                        <strong>{msg.userId}</strong>
                        <p>{msg.message}</p>
                        <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                    </div>
                ))}
            </div>
            <div className="input-bar">
                <input
                    type="text"
                    placeholder="메시지를 입력하세요..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={handleSendMessage}>전송</button>
            </div>
        </div>
    );
}
