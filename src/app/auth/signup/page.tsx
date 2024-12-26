"use client";

import { signIn } from "next-auth/react";
import styles from "./signup.module.css";

export default function SignupPage() {
    const handleSignup = () => {
        signIn("naver", { callbackUrl: "/auth/signin" });
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>회원가입</h1>
            <p className={styles.description}>네이버 로그인을 통해 회원가입을 진행하세요.</p>
            <button onClick={handleSignup} className={styles.button}>
                네이버로 회원가입
            </button>
        </div>
    );
}
