// app/astroinfo/page.tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import styles from './page.module.css';
import { Post } from '../../lib/types';
import dynamic from 'next/dynamic';
const MarkdownPreview = dynamic(
    () => import('@uiw/react-markdown-preview'),
    { ssr: false }
);
export default function CommunityPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const { data: session } = useSession();

    useEffect(() => {
        fetch('/api/astroinfo')
            .then(res => res.json())
            .then(data => {
                const sortedPosts = data.sort((a: Post, b: Post) => {
                    const isANotice = a.authorEmail === 'kr.nextnova@gmail.com';
                    const isBNotice = b.authorEmail === 'kr.nextnova@gmail.com';

                    if (isANotice && !isBNotice) return -1;
                    if (!isANotice && isBNotice) return 1;
                    if (isANotice && isBNotice) {
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    }
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                });
                setPosts(sortedPosts);
            });
    }, []);

    // 가장 최근 post 가져오기
    const recentPost = posts[0];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>최근 소식</h1>
            </div>
            {recentPost ? (
                <div className={styles.recentPost} data-color-mode="dark">
                    <Link href={`/astroinfo/${recentPost._id}`}>
                        <h2 className={styles.recentPostTitle}>{recentPost.title}</h2>
                        <MarkdownPreview source={recentPost.content} />
                        <span className={styles.recentPostMeta}>
                            작성자: {recentPost.authorName} | 조회수: {recentPost.views}
                        </span>
                    </Link>
                </div>
            ) : (
                <p>게시글이 없습니다.</p>
            )}
            <ul className={styles.postList}>
                {posts.slice(1).map(post => (
                    <li key={post._id} className={styles.postItem}>
                        {post.authorEmail.includes("@") && (
                            <Link href={`/astroinfo/${post._id}`}>
                                {post.authorEmail === 'kr.nextnova@gmail.com' && (
                                    <span className={styles.noticeTag}>관리자</span>
                                )}
                                <span className={styles.postTitle}>{post.title}</span>
                                <div className={styles.postMeta}>
                                    <span className={styles.author}>{post.authorName}</span>
                                    <span className={styles.viewCount}>조회수: {post.views}</span>
                                </div>
                            </Link>
                        )}
                        {!post.authorEmail.includes("@") && (
                            <Link href={`/astroinfo/${post._id}`}>
                                {post.authorEmail === 'APOD' && (
                                    <span className={styles.noticeTag}>APOD</span>
                                )}
                                <span className={styles.postTitle}>{post.title}</span>
                                <span className={styles.viewCount}>조회수: {post.views}</span>
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
            <div className={styles.header}>
                <h1>우주 소식</h1>
                {session?.user.email === "kr.nextnova@gmail.com" && (
                    <Link href="/astroinfo/write" className={styles.writeButton}>
                        글쓰기
                    </Link>
                )}
            </div>
            <ul className={styles.postList}>
                {posts.map(post => (
                    <li key={post._id} className={styles.postItem}>
                        {post.authorEmail.includes("@") && (
                            <Link href={`/astroinfo/${post._id}`}>
                                {post.authorEmail === 'kr.nextnova@gmail.com' && (
                                    <span className={styles.noticeTag}>관리자</span>
                                )}
                                <span className={styles.postTitle}>{post.title}</span>
                                <div className={styles.postMeta}>
                                    <span className={styles.author}>{post.authorName}</span>
                                    <span className={styles.viewCount}>조회수: {post.views}</span>
                                </div>
                            </Link>
                        )}
                        {!post.authorEmail.includes("@") && (
                            <Link href={`/astroinfo/${post._id}`}>
                                {post.authorEmail === 'APOD' && (
                                    <span className={styles.noticeTag}>APOD</span>
                                )}
                                <span className={styles.postTitle}>{post.title}</span>
                                <span className={styles.viewCount}>조회수: {post.views}</span>
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
