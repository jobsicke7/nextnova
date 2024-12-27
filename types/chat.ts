export interface ChatMessage {
    id: string;
    userId: string;  // email을 userId로 사용
    naverId: string; // email
    message: string;
    createdAt: Date;
}

export interface ChatProps {
    initialMessages: ChatMessage[];
}