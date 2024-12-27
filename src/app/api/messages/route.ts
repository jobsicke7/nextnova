import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("chatDB");

        const messages = await db
            .collection("messages")
            .find({})
            .sort({ createdAt: -1 })
            .limit(50)
            .toArray();

        return NextResponse.json(messages);
    } catch (error) {
        return NextResponse.json(
            { error: "메시지를 불러오는데 실패했습니다." },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session?.user) {
            return NextResponse.json(
                { error: "인증되지 않은 사용자입니다." },
                { status: 401 }
            );
        }

        const client = await clientPromise;
        const db = client.db("chatDB");

        const data = await req.json();
        const messageData = {
            ...data,
            _id: new ObjectId(),
            createdAt: new Date(),
        };

        await db.collection("messages").insertOne(messageData);

        return NextResponse.json(messageData);
    } catch (error) {
        return NextResponse.json(
            { error: "메시지 저장에 실패했습니다." },
            { status: 500 }
        );
    }
}