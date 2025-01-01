'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import style from '@/styles/main.module.css';
import styles from './register.module.css';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || '회원가입 중 오류가 발생했습니다');
            }

            router.push('/login?success=회원가입이 완료되었습니다');
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <div className={style.container}>
            <div className={styles.registerBox}>
                <h1 className={styles.title}>회원가입</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && (
                        <div className={styles.error}>{error}</div>
                    )}
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">이메일</label>
                        <input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="이메일을 입력하세요"
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="name">이름</label>
                        <input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="이름을 입력하세요"
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password">비밀번호</label>
                        <input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="비밀번호를 입력하세요"
                            required
                        />
                    </div>
                    <button type="submit" className={styles.registerButton}>
                        가입하기
                    </button>
                    <div className={styles.loginLink}>
                        <Link href="/login">이미 계정이 있으신가요? 로그인</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}