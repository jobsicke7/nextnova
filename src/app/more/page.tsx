
import styles from '@/styles/main.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <div className={styles.container}>
      <Link href="/waktaverse/info">왁타버스 뱅온정보</Link>
      <Link href="/dashboard">대시보드</Link>
      <Link href="/edit">edit</Link>
    </div>
  );
}
