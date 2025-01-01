'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import style from '@/styles/main.module.css';
import styles from './login.module.css';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Home() {
    const { data: session } = useSession();
    const router = useRouter();

    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (id === '나윱' && password === '1234') {
            router.push('/dashboard');
        } else {
            setError('아이디 또는 비밀번호가 올바르지 않습니다.');
        }
    };

    if (session) {
        return (
            <div className={style.container}>
                <p>환영합니다, {session.user?.name}님!</p>
                <img src={session.user?.image ?? ''} alt="프로필" style={{ width: 100 }} />
                <button onClick={() => signOut()}>로그아웃</button>
            </div>
        );
    }

    return (
        <div className={style.container}>
            <div className={styles.loginBox}>
                <h1 className={styles.title}>로그인</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="id">아이디</label>
                        <input
                            id="id"
                            type="text"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            placeholder="아이디를 입력하세요"
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password">비밀번호</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호를 입력하세요"
                            required
                        />
                    </div>
                    {error && <p className={styles.error}>{error}</p>}
                    <button type="submit" className={styles.loginButton}>
                        로그인
                    </button>
                </form>
            </div>
            <button onClick={() => signIn('naver')} className={styles.oauthButton}>
                네이버로 로그인
            </button>
        </div>
    );
}
