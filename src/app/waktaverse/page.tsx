import Image from "next/image";
import styles from "./members.module.css";

// 플랫폼 로고 URL 설정
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

// 텍스트에서 마크다운 링크를 HTML 링크로 변환하는 함수
const parseTextWithLinks = (text: string) => {
    const regex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
    return text.replace(regex, (match, p1, p2) => {
        return `<a href="${p2}" target="_blank" rel="noopener noreferrer">${p1}</a>`;
    });
};

// Info 부분에서 - 시작하는 텍스트를 제거하는 함수
const cleanInfoText = (info: string) => {
    return info.startsWith("-") ? info.slice(1).trim() : info;
};

const fetchMembers = async () => {
    const res = await fetch("https://api.wakscord.com/v2/member/list", {
        headers: {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
        },
    });

    const data = await res.json();
    return data.members;
};

const Page = async () => {
    const members: Member[] = await fetchMembers();

    return (
        <div className={styles.container}>
            <div className={styles.membersList}>
                {members.map((member) => (
                    <div key={member.member_id} className={styles.memberCard}>
                        {/* avatar_url이 없으면 none.png로 대체 */}
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
                                        {" "}
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
                                .filter((sns) => sns.platform !== "Wakzoo" && sns.platform !== "Twitch") // Wakzoo와 Twitch 제외
                                .map((sns) => (
                                    <div key={sns.platform} className={styles.snsItem}>
                                        {sns.platform === "Youtube" ? (
                                            <a
                                                href={`https://www.youtube.com/channel/${sns.sns_id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Image
                                                    src={platformLogos[sns.platform]}
                                                    alt={sns.platform}
                                                    width={5}
                                                    height={5}
                                                    className={styles.platformLogo}
                                                />
                                            </a>
                                        ) : (
                                            <a
                                                href={`https://www.${sns.platform.toLowerCase()}.com/${sns.sns_id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Image
                                                    src={platformLogos[sns.platform]}
                                                    alt={sns.platform}
                                                    width={5}
                                                    height={5}
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

export default Page;
