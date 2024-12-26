import clientPromise from "./mongodb";

// 메시지 저장 및 조회 함수
export async function saveMessage(userId: string, message: string) {
    const client = await clientPromise;
    const db = client.db("your_database_name");
    const messagesCollection = db.collection("messages");

    const messageData = {
        userId,
        message,
        timestamp: new Date(), // 보낸 시간
    };

    const result = await messagesCollection.insertOne(messageData);
    return result;
}

export async function getMessages() {
    const client = await clientPromise;
    const db = client.db("your_database_name");
    const messagesCollection = db.collection("messages");

    // 최신 메시지 기준으로 정렬하여 반환
    const messages = await messagesCollection
        .find({})
        .sort({ timestamp: -1 })
        .toArray();
    return messages;
}
