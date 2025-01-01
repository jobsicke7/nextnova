import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import NaverProvider from 'next-auth/providers/naver';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        NaverProvider({
            clientId: process.env.NAVER_CLIENT_ID!,
            clientSecret: process.env.NAVER_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid credentials');
                }

                const client = await clientPromise;
                const db = client.db();
                const user = await db.collection('users').findOne({ email: credentials.email });

                if (!user) {
                    throw new Error('User not found');
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                if (!isPasswordValid) {
                    throw new Error('Invalid password');
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name
                };
            }
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
    pages: {
        signIn: '/login',
        newUser: '/register', // signUp 대신 newUser 사용
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };