import FNB from "@/components/fnb";
import GNB from "@/components/gnb";
import type { Metadata } from "next";
import "@/styles/global.css";
export const metadata: Metadata = {
  title: "잡식이라네",
  description: "공부용 사이트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
    >
      <body>
        <GNB />
        {children}
        <FNB />
      </body>
    </html>
  );
}
