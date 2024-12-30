import React from "react";
import styles from "./contact.module.css";
import style from "@/styles/main.module.css"

const ContactPage = () => {
    return (
        <div className={styles.contactContainer} style={{}}>
            <div className={styles.contactContainer}>
                <h1 className={styles.title}>Contact</h1>
                <p className={styles.subtitle}>왁타버스 작업 환영합니다:)</p>

                <div className={styles.contactMethods}>
                    <div className={styles.contactCard}>
                        <h3>Email</h3>
                        <a
                            href="mailto:contact@jobsicke.xyz"
                            className={styles.contactLink}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            contact@jobsicke.xyz
                        </a><br></br>
                        <a
                            href="mailto:jobsicke282@gmail.com"
                            className={styles.contactLink}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            jobsicke282@gmail.com
                        </a>
                    </div>
                    <div className={styles.contactCard}>
                        <h3>Wakzoo</h3>
                        <a
                            href="https://cafe.naver.com/steamindiegame"
                            className={styles.contactLink}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            잡식이라네
                        </a>
                    </div>
                    <div className={styles.contactCard}>
                        <h3>Discord</h3>
                        <a
                            href="https://discord.com/users/jobsicke282"
                            className={styles.contactLink}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            jobsicke282
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
