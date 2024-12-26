'use client'
// /app/components/GNB.tsx
import React from "react";
import styles from "../styles/gnb.module.css";
import Link from "next/link";
import Image from "next/image";
const handleClick = () => {
    console.log("menu clicked");
};
const GNB: React.FC = () => {
    return (
        <div className={styles.gnb}>
            <div className={styles.logo}>
                <Link href="/">NEXTNOVA</Link>
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

                <Image
                    src="/icons/menu.svg"
                    alt="menu icon"
                    className={styles.menuIcon}
                    width={20}
                    height={20}
                    onClick={handleClick}
                />
            </ul>

        </div>
    );
};

export default GNB;
