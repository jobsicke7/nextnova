"use client"
// components/AnnouncementForm.js
import { useState, useEffect } from "react";

export default function AnnouncementForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [announcements, setAnnouncements] = useState([]); // 게시글 목록 저장
    const [statusMessage, setStatusMessage] = useState(""); // 상태 메시지 저장

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

    // 공지사항 제출
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !description) return;

        try {
            const response = await fetch("https://api.jobsicke.xyz/announce", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, description }),
            });

            if (!response.ok) {
                throw new Error("공지 작성 실패..");
            }

            await fetchAnnouncements(); // 게시글 목록 업데이트
            setStatusMessage("공지 작성 완료!"); // 성공 메시지
            setTitle(""); // 입력 필드 초기화
            setDescription("");
        } catch (error) {
            console.error("Error:", error);
            setStatusMessage("공지 작성 실패.."); // 실패 메시지
        } finally {
            setTimeout(() => setStatusMessage(""), 3000); // 3초 후 상태 메시지 제거
        }
    };

    // 게시글 삭제
    const handleDelete = async (index) => {
        try {
            const response = await fetch(`https://api.jobsicke.xyz/announce/${index}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("F공지 삭제 실패..");
            }

            await fetchAnnouncements(); // 게시글 목록 업데이트
            setStatusMessage("공지 삭제 완료!");
        } catch (error) {
            console.error("Error deleting announcement:", error);
            setStatusMessage("공지 삭제 실패..");
        } finally {
            setTimeout(() => setStatusMessage(""), 3000); // 3초 후 상태 메시지 제거
        }
    };

    return (
        <div style={{ margin: "30px 10px", minHeight: "67.2vh", maxWidth: "100%", color: "white" }}>
            <h1>공지 작성</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="공지 제목을 작성하세요"
                    required
                    style={{ display: "block", margin: "10px 0", padding: "8px", width: "98%" }}
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="설명을 작성하세요"
                    required
                    style={{ display: "block", margin: "10px 0", padding: "8px", width: "98%", height: "100px" }}
                />
                <button
                    type="submit"
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#007BFF",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Submit
                </button>
            </form>
            {statusMessage && <p style={{ marginTop: "10px", color: "green" }}>{statusMessage}</p>}

            <div style={{ marginTop: "20px" }}>
                <h2>공지사항</h2>
                {announcements.length === 0 ? (
                    <p>작성된 공지가 없어요.</p>
                ) : (
                    announcements.map((announcement, index) => (
                        <div
                            key={index}
                            style={{
                                border: "1px solid rgb(242, 255, 0)",
                                borderRadius: "5px",
                                margin: "10px 0",
                                padding: "10px",
                                boxShadow: "0 4px 8px rgba(251, 255, 0, 0.3)",
                                backgroundColor: "rgb(21, 21, 21)"
                            }}
                        >
                            <h3 style={{ margin: "0 0 5px" }}>{announcement.title}</h3>
                            <p style={{ margin: 0 }}>{announcement.description}</p>
                            <button
                                onClick={() => handleDelete(index)}
                                style={{
                                    marginTop: "10px",
                                    padding: "5px 10px",
                                    backgroundColor: "#FF0000",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
