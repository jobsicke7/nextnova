import React from "react";
import styles from "./contact.module.css";
import style from "@/styles/main.module.css"
import Link from "next/link";

const ContactPage = () => {
    return (
        <div className={styles.contactContainer} style={{}}>
            <div className={styles.contactContainer}>
                <h1 className={styles.title}>서비스</h1>
                <p className={styles.subtitle}>NEXTNOVA가 제공하는 모든 서비스를 확인해보세요!</p>

                <div className={styles.contactMethods}>
                    <div className={styles.contactCard}>
                        <h3 className={styles.text}>달 위상 확인</h3>
                        <Link href="/service/moon" className={styles.contactLink}>서비스 이용하러 가기 {">"}</Link>
                    </div>
                    <div className={styles.contactCard}>
                        <h3 className={styles.text}>ISS 위치 확인</h3>
                        <Link href="/service/iss" className={styles.contactLink}>서비스 이용하러 가기 {">"}</Link>
                    </div>
                    <div className={styles.contactCard}>
                        <h3 className={styles.text}>우주 소식 확인</h3>
                        <Link href="/astroinfo" className={styles.contactLink}>서비스 이용하러 가기 {">"}</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
