import NextAuth from "next-auth";
import NaverProvider from "next-auth/providers/naver";
import clientPromise from "../../../../lib/mongodb";

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

                const client = await clientPromise;
                const db = client.db("your_database_name");
                const usersCollection = db.collection("users");

                const existingUser = await usersCollection.findOne({ id: userData.id });

                if (!existingUser) {
                    await usersCollection.insertOne(userData);
                }
            }
            return true;
        },
        async session({ session, token }) {
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
