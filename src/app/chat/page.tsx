"use client"; // 페이지 전체를 클라이언트 컴포넌트로 선언

import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import styles from "./chat.module.css";

interface Message {
    _id: string;
    userId: string;
    nickname: string;
    message: string;
    timestamp: string;
}

export default function ChatPage() {
    const { data: session, status } = useSession();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") {
            window.location.href = "/api/auth/signin"; // 인증되지 않은 경우 로그인 페이지로 리다이렉트
        }

        if (status === "authenticated") {
            fetchMessages();
        }
    }, [status]);

    const fetchMessages = async () => {
        try {
            const res = await fetch("/api/messages");
            const data = await res.json();
            setMessages(data);
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        }
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: session?.user?.email,
                    nickname: session?.user?.name,
                    message: input,
                }),
            });

            if (res.ok) {
                fetchMessages(); // 메시지 목록 다시 가져오기
                setInput(""); // 입력 필드 초기화
            }
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    if (status === "loading") {
        return <div>로딩 중...</div>; // 세션 로드 중 표시
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>채팅</h1>
                <button onClick={() => signOut()} className={styles.signOutButton}>
                    로그아웃
                </button>
            </div>

            <div className={styles.chatBox}>
                {messages.map((msg) => (
                    <div key={msg._id} className={styles.message}>
                        <span className={styles.nickname}>{msg.nickname}:</span>
                        <span className={styles.text}>{msg.message}</span>
                        <span className={styles.timestamp}>
                            {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                    </div>
                ))}
            </div>

            <div className={styles.inputBox}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className={styles.input}
                    placeholder="메시지를 입력하세요"
                />
                <button onClick={sendMessage} className={styles.sendButton}>
                    전송
                </button>
            </div>
        </div>
    );
}
