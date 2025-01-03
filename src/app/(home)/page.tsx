import RealTimeSpaceInfo from "@/components/RealTimeSpaceInfo";
import styles from '@/styles/main.module.css';
import StarrySky from "../../components/StarrySky";
export default function Home() {
  return (
    <div className={styles.container}>
      <h1>
        <RealTimeSpaceInfo />
        <StarrySky />
      </h1>
    </div>
  );
}
