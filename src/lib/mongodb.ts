import { MongoClient } from "mongodb";

// TypeScript가 global 객체를 확장하도록 선언
declare global {
    // 'global' 객체에 _mongoClientPromise 속성을 추가
    // (프로덕션 환경에서는 사용되지 않음)
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI가 환경 변수에 설정되지 않았습니다.');
}

const uri = process.env.MONGODB_URI;
let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(uri);
    clientPromise = client.connect();
}

export default clientPromise;