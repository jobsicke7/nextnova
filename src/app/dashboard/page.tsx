"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // 권한 확인 후 리다이렉트 처리
    useEffect(() => {
        if (status === "authenticated" && session?.user?.name !== "jobsicke") {
            router.replace("/unauthorized"); // 권한 없음 페이지로 이동
        }
    }, [session, status, router]);

    if (status === "loading") {
        return <p>Loading...</p>; // 세션 로딩 중 표시
    }

    if (status === "authenticated" && session?.user?.name === "jobsicke") {
        return (
            <div>
                <h1>Dashboard</h1>
                <p>환영합니다, {session.user.name}님!</p>
            </div>
        );
    }

    return null; // 권한이 없을 경우 아무것도 렌더링하지 않음
}
