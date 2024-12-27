'use client';

import dynamic from 'next/dynamic';
import { ChatProps } from '../../../types/chat';

const ChatComponent = dynamic(() => import("./ChatComponent"), {
    ssr: false
});

export default function ClientWrapper({ initialMessages }: ChatProps) {
    return <ChatComponent initialMessages={initialMessages} />;
}