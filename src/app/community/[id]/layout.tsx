import { Metadata } from "next";
import { fetchPostById } from "@/lib/api";
import "@/styles/global.css";

// 동적 메타데이터 설정
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const post = await fetchPostById(params.id);

  return {
    title: `NEXTNOVA | ${post?.title || "게시글"}`,
    description: `${post?.authorName || ""}`,
    icons: {
      icon: "/favicon/favicon.ico",
    },
  };
}

export default function CommunityPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>; // <html> 및 <body> 태그 제거
}
