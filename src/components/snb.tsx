'use client';

import { useState } from 'react';
import styles from '../styles/snb.module.css';
import Link from 'next/link';

interface SNBProps {
    isOpen: boolean;
    onClose: () => void;
}

const SNB = ({ isOpen, onClose }: SNBProps) => {
    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className={styles.overlay}
                    onClick={onClose}
                />
            )}

            {/* Side Navigation */}
            <div className={`${styles.sidenav} ${isOpen ? styles.open : ''}`}>
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
                    <Link href="/" className={styles.navItem}>About</Link>
                    <Link href="/notice" className={styles.navItem}>Notice</Link>
                    <Link href="/contact" className={styles.navItem}>Contact</Link>
                    <Link href="/more" className={styles.navItem}>More</Link>
                </nav>
            </div>
        </>
    );
};

export default SNB;