"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session?.user?.name !== "jobsicke" && session?.user?.name !== "admin") {
            router.replace("/unauthorized");
        }
    }, [session, router]);

    if (!session) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <p>환영합니다, {session.user.name}님!</p>
        </div>
    );
}
