import { Metadata } from "next";
import { fetchPostById } from "@/lib/astro";
import "@/styles/global.css";

// 동적 메타데이터 설정
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  // `fetchPostById`가 Promise를 반환하므로, `await`로 데이터를 가져옵니다.
  const post = await fetchPostById(params.id);

  return {
    title: `NEXTNOVA | ${post?.title || "천문 소식"}`,
    description: post?.authorName || "",
    icons: {
      icon: "/favicon/favicon.ico",
    },
  };
}

export default function CommunityPostLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string }; // Ensure `params` is typed correctly here as well
}) {
  return <>{children}</>;
}
