// /app/components/GNB.tsx
import React from "react";
import styles from "../styles/gnb.module.css";
import Link from "next/link";

const GNB: React.FC = () => {
    return (
        <div className={styles.gnb}>
            <div className={styles.logo}>
                <Link href="/">잡식이라네</Link>
            </div>
            <ul className={styles.menu}>
                <li>
                    <Link href="/">About</Link>
                </li>
                <li>
                    <Link href="/notice">Notice</Link>
                </li>
                <li>
                    <Link href="/contact">Contact</Link>
                </li>
            </ul>
        </div>
    );
};

export default GNB;
