import Image from "next/image";
import styles from "./members.module.css";

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
                                .filter((sns) => sns.platform !== "Wakzoo" && sns.platform !== "Twitch")
                                .map((sns) => (
                                    <div key={sns.platform} className={styles.snsItem}>
                                        {sns.platform in platformLogos && (
                                            <a
                                                href={`https://www.${sns.platform.toLowerCase()}.com/${sns.sns_id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Image
                                                    src={platformLogos[sns.platform as keyof typeof platformLogos]}
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
