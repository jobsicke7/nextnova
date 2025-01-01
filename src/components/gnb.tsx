'use client';

import React, { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import styles from "../styles/gnb.module.css";
import Link from "next/link";
import Image from "next/image";
import SNB from "./snb";

const GNB: React.FC = () => {
    const { data: session } = useSession(); // 로그인 세션 확인
    const [isSnbOpen, setIsSnbOpen] = useState(false);

    const handleClick = () => {
        setIsSnbOpen(true);
    };

    const handleAuth = () => {
        if (session) {
            signOut(); // 로그아웃 처리
        } else {
            signIn(); // 로그인 페이지로 이동
        }
    };

    return (
        <>
            <div className={styles.gnb}>
                <div className={styles.logo}>
                    <Link href="/" className={styles.logoLink}>
                        <Image
                            src="/icons/supernova.svg"
                            alt="supernova icon"
                            className={styles.supernovaIcon}
                            width={24}
                            height={24}
                        />
                        NEXTNOVA
                    </Link>
                </div>

                <ul className={styles.menu}>
                    <li className={styles.link}>
                        <Link href="/">About</Link>
                    </li>
                    <li className={styles.link}>
                        <Link href="/notice">Notice</Link>
                    </li>
                    <li className={styles.link}>
                        <Link href="/contact">Contact</Link>
                    </li>
                    <li className={styles.link}>
                        <button
                            className={`${styles.loginButton} ${session ? styles.logoutButton : ""
                                }`}
                            onClick={handleAuth}
                        >
                            {session ? "로그아웃" : "로그인"}
                        </button>
                    </li>
                    <Image
                        src="/icons/menu.svg"
                        alt="menu icon"
                        className={styles.menuIcon}
                        width={30}
                        height={30}
                        onClick={handleClick}
                    />
                </ul>
            </div>
            <SNB
                isOpen={isSnbOpen}
                onClose={() => setIsSnbOpen(false)}
            />
        </>
    );
};

export default GNB;
