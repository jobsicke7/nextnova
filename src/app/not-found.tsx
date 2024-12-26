import Link from 'next/link'
import styles from '@/styles/notfound.module.css'
export default function NotFound() {
    return (
        <div className={styles.container} suppressHydrationWarning={true}>
            <h2>Not Found</h2>
            <p>요청하신 경로를 찾을 수 없어요</p>
            <Link href="/" className={styles.button}>메인화면으로</Link>
        </div>
    )
}   