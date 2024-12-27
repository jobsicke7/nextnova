import { GetServerSideProps } from 'next';
import { useState, useEffect } from 'react';
import { MongoClient } from 'mongodb';
import { getSession } from 'next-auth/react';
import styles from './chat.module.css';

interface Message {
    naverId: string;
    content: string;
    timestamp: string;
}

const ChatPage = ({ messages }: { messages: Message[] }) => {
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState<Message[]>(messages);

    const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    };

    const handleSendMessage = async () => {
        const res = await fetch('/api/sendMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if (res.ok) {
            const newMessage = await res.json();
            setChatMessages([newMessage, ...chatMessages]);
            setMessage('');
        }
    };

    return (
        <div className={styles.chatContainer}>
            <div className={styles.chatBox}>
                {chatMessages.map((msg, index) => (
                    <div key={index} className={styles.message}>
                        <span className={styles.naverId}>{msg.naverId}</span>
                        <span className={styles.timestamp}>{msg.timestamp}</span>
                        <p>{msg.content}</p>
                    </div>
                ))}
            </div>
            <div className={styles.inputContainer}>
                <input
                    type="text"
                    value={message}
                    onChange={handleMessageChange}
                    className={styles.input}
                />
                <button onClick={handleSendMessage} className={styles.sendButton}>
                    Send
                </button>
            </div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession({ req: context.req });

    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const db = client.db();
    const collection = db.collection('messages');
    const messages = await collection
        .find()
        .sort({ timestamp: -1 })
        .limit(20)
        .toArray();

    client.close();

    return {
        props: {
            messages: messages.map((msg: any) => ({
                naverId: msg.naverId,
                content: msg.content,
                timestamp: msg.timestamp,
            })),
        },
    };
};

export default ChatPage;
