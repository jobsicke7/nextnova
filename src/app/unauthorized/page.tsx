import styles from '@/styles/main.module.css';

export default function UnauthorizedPage() {
    return (
        <div className={styles.container}>
            <h1>접근 권한이 없습니다</h1>
            <p>이 페이지에 접근하려면 로그인하세요.</p>
        </div>
    );

}
