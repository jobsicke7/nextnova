import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import clientPromise from "../../../lib/mongodb";
import { ChatMessage } from "../../../types/chat";
import { WithId, Document } from 'mongodb';

const ChatComponent = dynamic(() => import("./ChatComponent"), {
  ssr: false
});

export default async function ChatPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const client = await clientPromise;
  const db = client.db("chatDB");

  const messages = await db
    .collection("messages")
    .find({})
    .sort({ createdAt: -1 })
    .limit(50)
    .toArray();

  // MongoDB 문서를 ChatMessage 형식으로 변환
  const formattedMessages: ChatMessage[] = messages.map((msg: WithId<Document>) => ({
    id: msg._id.toString(),
    userId: msg.userId as string,
    naverId: msg.naverId as string,
    message: msg.message as string,
    createdAt: msg.createdAt as Date
  }));

  return <ChatComponent initialMessages={formattedMessages} />;
}