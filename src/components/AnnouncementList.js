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
        <div>
            <h1>공지사항</h1>
            {announcements.length === 0 ? (
                <p>등록된 공지사항이 없습니다.</p>
            ) : (
                announcements.map((announcement, index) => (
                    <div
                        key={index}
                        style={{
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            margin: "10px 0",
                            padding: "10px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
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
