import React from "react";
import styles from "../styles/fnb.module.css";
import Link from "next/link";


const FNB: React.FC = () => {
  return (
    <div className={styles.fnb}>
      <div className={styles.links}>
        <Link href="https://nextomo.vercel.app/">NEXTNOVA</Link>
        <Link href="/">개인정보처리방침</Link>
        <Link href="/">이용약관</Link>
      </div>
      <p className={styles.copy}>© 2024 잡식이라네. All rights reserved.</p>
    </div>
  );
};

export default FNB;
