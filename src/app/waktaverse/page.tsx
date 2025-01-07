import React from "react";
import styles from "./contact.module.css";
import style from "@/styles/main.module.css"
import Link from "next/link";

const ContactPage = () => {
    return (
        <div className={styles.contactContainer} style={{}}>
            <div className={styles.contactContainer}>
                <h1 className={styles.title}>왁타버스</h1>
                <p className={styles.subtitle}>NEXTNOVA Waktaverse가 제공하는 모든 서비스를 확인해보세요!</p>

                <div className={styles.contactMethods}>
                    <div className={styles.contactCard}>
                        <h3 className={styles.text}>왁타버스 뱅온정보</h3>
                        <Link href="/waktaverse/info" className={styles.contactLink}>서비스 이용하러 가기 {">"}</Link>
                    </div>
                    <div className={styles.contactCard}>
                        <h3 className={styles.text}>왁타버스 최근 노래</h3>
                        <Link href="/waktaverse/video" className={styles.contactLink}>서비스 이용하러 가기 {">"}</Link>
                    </div>
                    <div className={styles.contactCard}>
                        <h3 className={styles.text}>...</h3>
                        <Link href="/waktaverse" className={styles.contactLink}>서비스 이용하러 가기 {">"}</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
