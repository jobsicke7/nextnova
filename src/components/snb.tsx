'use client';

import { useState, useEffect } from 'react';
import styles from '../styles/snb.module.css';
import Link from 'next/link';
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
interface SNBProps {
    isOpen: boolean;
    onClose: () => void;
}

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    onClose: () => void;
}

const NavLink = ({ href, children, onClose }: NavLinkProps) => {
    return (
        <Link
            href={href}
            className={styles.navItem}
            onClick={(e) => {
                onClose();
            }}
        >
            {children}
        </Link>
    );
};

const SNB = ({ isOpen, onClose }: SNBProps) => {
    const { data: session } = useSession();
    const router = useRouter();
    const handleAuth = () => {
        if (session) {
            signOut();
        } else {
            router.push("/login");
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
                    <NavLink href="/about" onClose={onClose}>About</NavLink>
                    <NavLink href="/notice" onClose={onClose}>Notice</NavLink>
                    <NavLink href="/service" onClose={onClose}>Service</NavLink>
                    <button
                        className={`${styles.loginButton} ${session ? styles.logoutButton : ""}`}
                        onClick={() => {
                            handleAuth();
                            onClose();
                        }}
                    >
                        {session ? "로그아웃" : "로그인"}
                    </button>
                </nav>
            </div>
        </>
    );
};

export default SNB;