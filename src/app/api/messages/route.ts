import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";

// 메시지 가져오기
export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("your_database_name");
        const messagesCollection = db.collection("messages");

        // 최신순 메시지 반환
        const messages = await messagesCollection
            .find({})
            .sort({ timestamp: -1 }) // 최신순 정렬
            .toArray();

        return NextResponse.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }
}

// 메시지 저장하기
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, message, nickname } = body;

        if (!userId || !message || !nickname) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("your_database_name");
        const messagesCollection = db.collection("messages");

        const newMessage = {
            userId,
            message,
            nickname,
            timestamp: new Date(),
        };

        await messagesCollection.insertOne(newMessage);

        return NextResponse.json({ success: true, message: newMessage });
    } catch (error) {
        console.error("Error saving message:", error);
        return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
    }
}
