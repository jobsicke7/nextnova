import FNB from "@/components/fnb";
import GNB from "@/components/gnb";
import type { Metadata } from "next";
import { Providers } from "./providers";
import "@/styles/global.css";
export const metadata: Metadata = {
  title: "NEXTNOVA",
  description: "공부용 사이트",
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
    <html
      lang='en'
    >
      <body>
        <GNB />
        <Providers>{children}</Providers>
        <FNB />
      </body>
    </html>
  );
}
