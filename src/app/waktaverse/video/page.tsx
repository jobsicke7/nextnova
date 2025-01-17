"use client";

import { useState, useEffect } from "react";
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

export default function VideoPage() {
    const [videoData, setVideoData] = useState<VideoData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadVideoData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/fetchVideo");
            if (!response.ok) {
                throw new Error("Failed to fetch video data");
            }
            const data = await response.json();
            setVideoData(data.video);
        } catch (error) {
            console.error("Error fetching video data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadVideoData();
    }, []);

    if (isLoading) {
        return <div className={styles.container}>
            <button className={styles.refreshButton} onClick={loadVideoData}>
                새로고침
            </button>

            <div
                className={styles.background}
                style={{ backgroundImage: `url(${videoData?.thumbnail_url})` }}
            ></div>

            <div className={styles.content}>
                <p className={styles.title1}>
                    업데이트 : {videoData?.fetched_at ? new Date(videoData.fetched_at).toLocaleString() : ''}
                </p>
                <h1 className={styles.title}>{videoData?.title}</h1>

                <div className={styles.channelInfo}>
                    <img
                        src={videoData?.channel_icon_url}
                        alt={`${videoData?.channel_name} icon`}
                        className={styles.channelIcon}
                    />
                    <h2>{videoData?.channel_name}</h2>
                </div>
                <br></br>
                <br></br>
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
                        src={`https://www.youtube.com/embed/${videoData?.video_id}`}
                        title={videoData?.title}
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
                <br></br>
                <br></br>
                <div className={styles.info}>
                    <span>조회수: {videoData?.view_count}</span>
                    <span className={styles.view}>
                        (+{videoData?.view_count_increase})
                    </span>
                </div>
                <br></br>
                <div className={styles.info1}>
                    <span>좋아요수: {videoData?.like_count}</span>
                    <span className={styles.like}>
                        (+{videoData?.like_count_increase})
                    </span>
                </div>
            </div>
        </div>;
    }

    if (!videoData) {
        return <div>No video data available.</div>;
    }

    return (
        <div className={styles.container}>
            <button className={styles.refreshButton} onClick={loadVideoData}>
                새로고침
            </button>

            <div
                className={styles.background}
                style={{ backgroundImage: `url(${videoData.thumbnail_url})` }}
            ></div>

            <div className={styles.content}>
                <p className={styles.title1}>
                    업데이트 : {new Date(videoData.fetched_at).toLocaleString()}
                </p>
                <h1 className={styles.title}>{videoData.title}</h1>

                <div className={styles.channelInfo}>
                    <img
                        src={videoData.channel_icon_url}
                        alt={`${videoData.channel_name} icon`}
                        className={styles.channelIcon}
                    />
                    <h2>{videoData.channel_name}</h2>
                </div>
                <br></br>
                <br></br>
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
                <br></br>
                <br></br>
                <div className={styles.info}>
                    <span>조회수: {videoData.view_count}</span>
                    <span className={styles.view}>
                        (+{videoData.view_count_increase})
                    </span>
                </div>
                <br></br>
                <div className={styles.info1}>
                    <span>좋아요수: {videoData.like_count}</span>
                    <span className={styles.like}>
                        (+{videoData.like_count_increase})
                    </span>
                </div>
            </div>
        </div>
    );
}
