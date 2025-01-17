"use client"
import { useEffect, useState } from "react";

export default function AnnouncementList() {
    const [announcements, setAnnouncements] = useState([]);

    // 서버에서 공지사항 가져오기
    const fetchAnnouncements = async () => {
        try {
            const response = await fetch("https://api.jobsicke.xyz/announce");
            if (!response.ok) {
                throw new Error("Failed to fetch announcements");
            }
            const data = await response.json();
            setAnnouncements(data);
        } catch (error) {
            console.error("Error fetching announcements:", error);
        }
    };

    // 페이지 로드 시 공지사항 가져오기
    useEffect(() => {
        fetchAnnouncements();
    }, []);

    return (
        <div style={{ minHeight: "71vh", maxWidth: "100%", color: "rgba(255, 255, 255, 1)" }}>
            <h1 style={{ margin: "3vh 10px" }}>공지사항</h1>
            {announcements.length === 0 ? (
                <p style={{ margin: "0 10px" }}>등록된 공지사항이 없습니다.</p>
            ) : (
                announcements.map((announcement, index) => (
                    <div
                        key={index}
                        style={{
                            border: "1px solid rgb(242, 255, 0)",
                            borderRadius: "5px",
                            margin: "20px 10px",
                            padding: "10px",
                            boxShadow: "0 4px 8px rgba(251, 255, 0, 0.3)",
                            backgroundColor: "rgb(21, 21, 21)"
                        }}
                    >
                        <h2 style={{ margin: "0 0 5px" }}>{announcement.title}</h2>
                        <p style={{ margin: 0 }}>{announcement.description}</p>
                    </div>
                ))
            )}
        </div>
    );
}
