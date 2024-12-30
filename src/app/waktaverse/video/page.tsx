import { MongoClient } from "mongodb";
import styles from "./video.module.css";

type VideoData = {
    video_id: string;
    title: string;
    thumbnail_url: string;
    upload_date: string;
    view_count: number;
    like_count: number;
    channel_name: string;
    channel_icon_url: string;
    view_count_increase: number;
    like_count_increase: number;
    fetched_at: string;
};

const MONGO_URI =
    "mongodb+srv://admin:MnXr3KDSK8IeYrUd@nextnova.bxjnh.mongodb.net/?retryWrites=true&w=majority&appName=nextnova";

// Fetch video data dynamically from MongoDB
async function fetchVideoData(): Promise<VideoData | null> {
    const client = new MongoClient(MONGO_URI);

    try {
        await client.connect();
        const db = client.db("youtube_data");
        const collection = db.collection<VideoData>("videos");
        const video = await collection.findOne({});
        return video || null;
    } finally {
        await client.close();
    }
}

export default async function VideoPage() {
    const videoData = await fetchVideoData();

    if (!videoData) {
        return <div>No video data available.</div>;
    }

    return (
        <div className={styles.container}>
            <div
                className={styles.background}
                style={{ backgroundImage: `url(${videoData.thumbnail_url})` }}
            ></div>

            <div className={styles.content}>
                <p className={styles.title1}>업데이트 : {new Date(videoData.fetched_at).toLocaleString()}</p>
                <h1 className={styles.title}>{videoData.title}</h1>

                <div className={styles.channelInfo}>
                    <img
                        src={videoData.channel_icon_url}
                        alt={`${videoData.channel_name} icon`}
                        className={styles.channelIcon}
                    />
                    <h2>{videoData.channel_name}</h2>
                </div>
                <br />
                <br />
                <div>
                    <div
                        style={{
                            marginBottom: "20px",
                            position: "relative",
                            paddingBottom: "56.25%",
                            height: 0,
                            overflow: "hidden",
                        }}
                    >
                        <iframe
                            src={`https://www.youtube.com/embed/${videoData.video_id}`}
                            title={videoData.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                borderRadius: "8px",
                            }}
                        ></iframe>
                    </div>
                    <br />
                    <br />
                    <div className={styles.info}>
                        <span>조회수: {videoData.view_count}</span>
                        <span className={styles.view}>(+{videoData.view_count_increase})</span>
                    </div>
                    <br />
                    <div className={styles.info1}>
                        <span>좋아요수: {videoData.like_count}</span>
                        <span className={styles.like}>(+{videoData.like_count_increase})</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
