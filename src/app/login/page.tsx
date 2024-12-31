'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export default function Home() {
    const { data: session } = useSession();

    if (session) {
        return (
            <div>
                <p>환영합니다, {session.user?.name}님!</p>
                <img src={session.user?.image ?? ''} alt="프로필" />
                <button onClick={() => signOut()}>로그아웃</button>
            </div>
        );
    }

    return (
        <div>
            <button onClick={() => signIn('naver')}>
                네이버로 로그인
            </button>
        </div>
    );
}