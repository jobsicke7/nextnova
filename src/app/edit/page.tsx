"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AnnouncementForm from "../../components/AnnouncementForm";
import styles from "@/styles/main.module.css";
export default function AnnouncePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "loading") {
        return <p className={styles.container}></p>;
    }

    if (session?.user?.email === "jobsicke282@gmail.com" || session?.user?.email === "admin") {
        return (
            <div>
                <AnnouncementForm />
            </div>
        );
    }
    router.push("/unauthorized");
    return null;
}
