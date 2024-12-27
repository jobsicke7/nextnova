'use client';

import React, { useState } from "react";
import styles from "../styles/gnb.module.css";
import Link from "next/link";
import Image from "next/image";
import SNB from "./snb";

const GNB: React.FC = () => {
    const [isSnbOpen, setIsSnbOpen] = useState(false);

    const handleClick = () => {
        setIsSnbOpen(true);
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
                        <Link href="/more">More</Link>
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