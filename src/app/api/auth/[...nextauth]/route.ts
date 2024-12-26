import NextAuth from "next-auth";
import NaverProvider from "next-auth/providers/naver";
import { MongoClient } from "mongodb";

// MongoDB 연결 설정
const clientPromise = new MongoClient(process.env.MONGODB_URI!).connect();

const handler = NextAuth({
    providers: [
        NaverProvider({
            clientId: process.env.NAVER_CLIENT_ID!,
            clientSecret: process.env.NAVER_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ account, profile }) {
            if (account?.provider === "naver" && profile?.response) {
                const userData = {
                    id: profile.response.id,
                    nickname: profile.response.nickname,
                    email: profile.response.email,
                };

                try {
                    const client = await clientPromise;
                    const db = client.db("your_database_name");
                    const usersCollection = db.collection("users");

                    // 기존 사용자 확인
                    const existingUser = await usersCollection.findOne({ id: userData.id });

                    if (!existingUser) {
                        // 새 사용자 등록
                        await usersCollection.insertOne(userData);
                    }
                } catch (error) {
                    console.error("Database Error:", error);
                    return false; // 인증 실패
                }
            }
            return true; // 인증 성공
        },
        async redirect({ url, baseUrl }) {
            // 인증 후 기본 URL로 리다이렉션
            return baseUrl;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
