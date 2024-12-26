import NextAuth from "next-auth";

declare module "next-auth" {
    interface Profile {
        response?: {
            id: string;
            nickname: string;
            email: string;
        };
    }
}
