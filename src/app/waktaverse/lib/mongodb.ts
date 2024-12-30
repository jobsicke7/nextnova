import { MongoClient } from "mongodb";

const MONGO_URI = "mongodb+srv://admin:MnXr3KDSK8IeYrUd@nextnova.bxjnh.mongodb.net/?retryWrites=true&w=majority&appName=nextnova";
const client = new MongoClient(MONGO_URI);

export async function fetchVideoData() {
    try {
        await client.connect();
        const db = client.db("youtube_data");
        const collection = db.collection("videos");
        const video = await collection.findOne({});
        return video || null;
    } finally {
        await client.close();
    }
}
