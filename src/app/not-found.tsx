import Link from 'next/link'
import styles from '@/styles/notfound.module.css'
export default function NotFound() {
    return (
        <div className={styles.container} suppressHydrationWarning={true}>
            <h2>우주에서 길을 잃었군요..</h2>
            <p>이쪽으로 가면 지구로 돌아갈 수 있어요</p>
            <Link href="/" className={styles.button}>메인으로</Link>
        </div>
    )
}   