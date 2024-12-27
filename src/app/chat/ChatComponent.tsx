'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import styles from '../chat/chat.module.css';
import { ChatMessage, ChatProps } from '../../../types/chat';

export default function ChatComponent({ initialMessages }: ChatProps) {
    const { data: session, status } = useSession();
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // 로딩 상태 처리
    if (status === "loading") {
        return <div>Loading...</div>;
    }

    // 인증되지 않은 상태 처리
    if (status === "unauthenticated") {
        return <div>Please sign in to access the chat.</div>;
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('ko-KR', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !session?.user?.email) return;

        const messageData = {
            userId: session.user.email,
            naverId: session.user.email,
            message: newMessage.trim(),
            createdAt: new Date(),
        };

        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(messageData),
            });

            if (response.ok) {
                const savedMessage = await response.json();
                setMessages(prev => [savedMessage, ...prev]);
                setNewMessage('');
                inputRef.current?.focus();
            }
        } catch (error) {
            console.error('메시지 전송 실패:', error);
        }
    };

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const response = await fetch('/api/messages');
                if (!response.ok) throw new Error('Failed to fetch messages');
                const newMessages = await response.json();
                setMessages(newMessages);
            } catch (error) {
                console.error('메시지 업데이트 실패:', error);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.messagesContainer}>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`${styles.messageBox} ${msg.userId === session?.user?.email ? styles.myMessage : ''
                            }`}
                    >
                        <div className={styles.messageInfo}>
                            {msg.naverId} • {formatDate(msg.createdAt)}
                        </div>
                        <div>{msg.message}</div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className={styles.inputContainer}>
                <input
                    type="text"
                    ref={inputRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className={styles.input}
                    placeholder="메시지를 입력하세요..."
                />
                <button type="submit" className={styles.sendButton}>
                    전송
                </button>
            </form>
        </div>
    );
}