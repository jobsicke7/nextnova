import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import NaverProvider from 'next-auth/providers/naver';
import { MongoDBAdapter } from '../../../../../node_modules/@auth/mongodb-adapter'; // MongoDB Adapter 가져오기
import clientPromise from '../../../../lib/mongodb'; // MongoDB 연결 가져오기

export const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        NaverProvider({
            clientId: process.env.NAVER_CLIENT_ID!,
            clientSecret: process.env.NAVER_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        session: async ({ session, user }: { session: any; user: any }) => {
            if (session?.user) {
                session.user.id = user.id;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
