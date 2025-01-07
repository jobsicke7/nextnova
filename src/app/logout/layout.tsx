import { Metadata } from "next";
import "@/styles/global.css";

// 동적 메타데이터 설정
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {

  return {
    title: `NEXTNOVA | 로그아웃`,
    description: "당신만의 우주, NEXTNOVA",
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
