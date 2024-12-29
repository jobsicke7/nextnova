"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import styles from "./members.module.css";
import { RefreshCw } from "lucide-react";

const platformLogos = {
    Afreeca: "/images/afreeca-logo.svg",
    Youtube: "/images/youtube-logo.svg",
    Instagram: "/images/instagram-logo.svg",
    X: "/images/x-logo.svg",
};

interface Member {
    member_id: string;
    name: string;
    avatar_url: string;
    next_streaming: {
        status: string;
        info: string;
        link: string;
    } | null;
    sns: {
        platform: string;
        sns_id: string;
        name: string | null;
    }[];
    streaming: {
        platform: string;
        livestreaming_url: string;
        title: string;
        category: string;
        streaming: boolean;
    }[];
}

const parseTextWithLinks = (text: string) => {
    const regex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
    return text.replace(regex, (match, p1, p2) => {
        return `<a href="${p2}" target="_blank" rel="noopener noreferrer">${p1}</a>`;
    });
};

const cleanInfoText = (info: string) => {
    return info.startsWith("-") ? info.slice(1).trim() : info;
};

const MembersPage = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMembers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/members');
            if (!res.ok) {
                throw new Error('Failed to fetch members');
            }
            const data = await res.json();
            setMembers(data.members);
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to load members data');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button
                    onClick={fetchMembers}
                    disabled={isLoading}
                    className={styles.refreshButton}
                >
                    <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>새로고침</span>
                </button>
            </div>

            {error && (
                <div className="text-center text-red-500 mb-4">
                    {error}
                </div>
            )}

            <div className={styles.membersList}>
                {members.map((member) => (
                    <div key={member.member_id} className={styles.memberCard}>
                        <img
                            src={member.avatar_url || "/images/none.svg"}
                            alt={member.name}
                            className={styles.avatar}
                        />
                        <h3>{member.name}</h3>

                        <div className={styles.streamInfo}>
                            {member.next_streaming ? (
                                <>
                                    <p>다음 방송: {member.next_streaming.status}</p>
                                    <p>
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: parseTextWithLinks(cleanInfoText(member.next_streaming.info || "")),
                                            }}
                                        />
                                    </p>
                                </>
                            ) : (
                                <p>비정기 방송</p>
                            )}
                        </div>

                        <div className={styles.snsLinks}>
                            {member.sns
                                .filter((sns) => sns.platform !== "Wakzoo" && sns.platform !== "Twitch")
                                .map((sns, index) => (
                                    <div key={`${member.member_id}-${sns.platform}-${sns.sns_id}-${index}`}>
                                        {sns.platform in platformLogos && (
                                            <a
                                                href={`https://www.${sns.platform.toLowerCase()}.com/${sns.sns_id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Image
                                                    src={platformLogos[sns.platform as keyof typeof platformLogos]}
                                                    alt={sns.platform}
                                                    width={20}
                                                    height={20}
                                                    className={styles.platformLogo}
                                                />
                                            </a>
                                        )}
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MembersPage;