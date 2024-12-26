import React from "react";
import styles from "../styles/fnb.module.css";
import Link from "next/link";


const FNB: React.FC = () => {
  return (
    <div className={styles.fnb}>
      <div className={styles.links}>
        <Link href="https://nextomo.vercel.app/">NEXTOMO</Link>
        <Link href="/services/terms">개인정보처리방침</Link>
        <Link href="/services/privacy">이용약관</Link>
      </div>
      <p className={styles.copy}>© 2024 잡식이라네. All rights reserved.</p>
    </div>
  );
};

export default FNB;
