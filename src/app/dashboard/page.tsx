"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from "@/styles/main.module.css";
export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();


    if (status === "loading") {
        return <p className={styles.container}></p>;
    }

    if (session?.user?.email === "jobsicke282@gmail.com" || session?.user?.email === "admin") {
        return (
            <div>
                <h1>Dashboard</h1>
                <p>환영합니다, {session.user.name}님!</p>
            </div>
        );
    }
    router.push("/unauthorized");
    return null;
}
