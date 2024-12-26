import { NextResponse } from "next/server";
import { saveMessage, getMessages } from "../../../../lib/message";

// POST 요청: 메시지 저장
export async function POST(request: Request) {
    try {
        const { userId, message } = await request.json();
        if (!userId || !message) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        const result = await saveMessage(userId, message);
        return NextResponse.json({ success: true, messageId: result.insertedId });
    } catch (error) {
        return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
    }
}

// GET 요청: 메시지 조회
export async function GET() {
    try {
        const messages = await getMessages();
        return NextResponse.json(messages);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }
}
