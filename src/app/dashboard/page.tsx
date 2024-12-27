// app/dashboard/page.tsx
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
    // 여기까지 접근하면 이미 미들웨어를 통과한 상태
    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to the dashboard!</p>
        </div>
    );
}
