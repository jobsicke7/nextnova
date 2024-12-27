import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import clientPromise from "../../../lib/mongodb";
import { ChatMessage } from "../../../types/chat";
import { WithId, Document } from 'mongodb';
import ClientWrapper from './ClientWrapper';

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

  const formattedMessages: ChatMessage[] = messages.map((msg: WithId<Document>) => ({
    id: msg._id.toString(),
    userId: msg.userId as string,
    naverId: msg.naverId as string,
    message: msg.message as string,
    createdAt: msg.createdAt as Date
  }));

  return <ClientWrapper initialMessages={formattedMessages} />;
}