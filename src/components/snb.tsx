'use client';

import { useState, useEffect } from 'react';
import styles from '../styles/snb.module.css';
import Link from 'next/link';
import { useSession, signIn, signOut } from "next-auth/react";
interface SNBProps {
    isOpen: boolean;
    onClose: () => void;
}

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    onClose: () => void;
}

// NavLink 컴포넌트 생성
const NavLink = ({ href, children, onClose }: NavLinkProps) => {
    return (
        <Link
            href={href}
            className={styles.navItem}
            onClick={(e) => {
                // 기본 Link 동작은 유지하면서 SNB를 닫음
                onClose();
            }}
        >
            {children}
        </Link>
    );
};

const SNB = ({ isOpen, onClose }: SNBProps) => {
    const { data: session } = useSession(); // 로그인 세션 확인
    const handleAuth = () => {
        if (session) {
            signOut(); // 로그아웃 처리
        } else {
            signIn(); // 로그인 페이지로 이동
        }
    };
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <>
            {isOpen && (
                <div
                    className={styles.overlay}
                    onClick={onClose}
                />
            )}

            <div
                className={styles.sidenav}
                style={{
                    transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 0.3s ease-in-out'
                }}
            >
                <div className={styles.header}>
                    <h2 className={styles.title}>메뉴</h2>
                    <button
                        onClick={onClose}
                        className={styles.closeButton}
                    >
                        ✕
                    </button>
                </div>

                <nav className={styles.nav}>
                    <NavLink href="/" onClose={onClose}>About</NavLink>
                    <NavLink href="/notice" onClose={onClose}>Notice</NavLink>
                    <NavLink href="/contact" onClose={onClose}>Contact</NavLink>
                    <NavLink href="/more" onClose={onClose}>More</NavLink>
                    <button
                        className={`${styles.loginButton} ${session ? styles.logoutButton : ""
                            }`}
                        onClick={handleAuth}
                    >
                        {session ? "로그아웃" : "로그인"}
                    </button>
                </nav>
            </div>
        </>
    );
};

export default SNB;