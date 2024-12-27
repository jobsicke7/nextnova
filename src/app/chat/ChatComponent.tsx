'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import styles from '@/styles/chat.module.css';
import { ChatMessage, ChatProps } from '../../../types/chat';

export default function ChatComponent({ initialMessages }: ChatProps) {
    const { data: session } = useSession();
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

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
            userId: session.user.email, // email을 userId로 사용
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
            const response = await fetch('/api/messages');
            const newMessages = await response.json();
            setMessages(newMessages);
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