'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import styles from './page.module.css';
import { Post } from '../../lib/types';

export default function CommunityPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const { data: session } = useSession();

    useEffect(() => {
        fetch('/api/posts')
            .then(res => res.json())
            .then(data => setPosts(data));
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>커뮤니티</h1>
                {session && (
                    <Link href="/community/write" className={styles.writeButton}>
                        글쓰기
                    </Link>
                )}
            </div>
            <ul className={styles.postList}>
                {posts.map(post => (
                    <li key={post._id} className={styles.postItem}>
                        <Link href={`/community/${post._id}`}>
                            <span className={styles.postTitle}>{post.title}</span>
                            <span className={styles.viewCount}>조회수: {post.views}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
