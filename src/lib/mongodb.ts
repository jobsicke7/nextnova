import { MongoClient } from "mongodb";

// TypeScript가 global 객체를 확장하도록 선언
declare global {
    // 'global' 객체에 _mongoClientPromise 속성을 추가
    // (프로덕션 환경에서는 사용되지 않음)
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI!;
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
    throw new Error("Please add your MongoDB URI to .env");
}

if (process.env.NODE_ENV === "development") {
    // 개발 환경에서 MongoClient를 전역 변수로 설정
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // 프로덕션 환경에서는 새로 MongoClient 인스턴스를 생성
    client = new MongoClient(uri);
    clientPromise = client.connect();
}

export default clientPromise;
