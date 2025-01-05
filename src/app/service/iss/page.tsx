import styles from '@/styles/main.module.css';
import StarrySky from "../../../components/StarrySky";
export default function Home() {
    return (
        <div className={styles.container}>
            <h1>
                ISS 위치 정보 기능 개발중..
                <StarrySky />
            </h1>
        </div>
    );
}