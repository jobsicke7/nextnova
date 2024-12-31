import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import NaverProvider from "next-auth/providers/naver";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb"; // MongoDB 연결 가져오기

// NextAuth 설정
export const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        NaverProvider({
            clientId: process.env.NAVER_CLIENT_ID!,
            clientSecret: process.env.NAVER_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async session({ session, user }) {
            if (session?.user) {
                session.user.id = user.id; // 사용자 ID를 세션에 추가
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET, // NextAuth 비밀키
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; // GET/POST 메서드로 핸들러 설정
