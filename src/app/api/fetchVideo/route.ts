import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const MONGO_URI =
    "mongodb+srv://admin:jslove0619qq%40%40@logininfo.fhmwa.mongodb.net/?retryWrites=true&w=majority&appName=logininfo";

export async function GET() {
    const client = new MongoClient(MONGO_URI);

    try {
        await client.connect();
        const db = client.db("youtube_data");
        const collection = db.collection("videos");
        const video = await collection.findOne({});
        return NextResponse.json({ video });
    } catch (error) {
        console.error("Failed to fetch video data:", error);
        return NextResponse.json({ error: "Failed to fetch video data." }, { status: 500 });
    } finally {
        await client.close();
    }
}
