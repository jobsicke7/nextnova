'use client';

import React, { useState } from "react";
import styles from "../styles/gnb.module.css";
import Link from "next/link";
import Image from "next/image";
import SNB from "@/components/snb"

const GNB: React.FC = () => {
    const [isSnbOpen, setIsSnbOpen] = useState(false);

    const handleClick = () => {
        console.log("menu clicked");
        setIsSnbOpen(true);
    };

    return (
        <>
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
                        <Link href="/edit">Contact</Link>
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

            <SNB
                isOpen={isSnbOpen}
                onClose={() => setIsSnbOpen(false)}
            />
        </>
    );
};

export default GNB;