import FNB from "@/components/fnb";
import GNB from "@/components/gnb";
import type { Metadata } from "next";
import "@/styles/global.css";
export const metadata: Metadata = {
  title: "NEXTNOVA",
  description: "당신만의 우주, NEXTNOVA",
  icons: {
    icon: "./favicon/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>{children}</>
  );
}
