"use client";

import { signIn } from "next-auth/react";
import styles from "../signin/singin.module.css";

export default function SigninPage() {
    const handleSignin = () => {
        signIn("naver", { callbackUrl: "/" });
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>로그인</h1>
            <p className={styles.description}>네이버 계정으로 로그인하세요.</p>
            <button onClick={handleSignin} className={styles.button}>
                네이버로 로그인
            </button>
        </div>
    );
}
