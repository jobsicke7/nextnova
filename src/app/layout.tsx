import FNB from "@/components/fnb";
import GNB from "@/components/gnb";
import { AuthProvider } from '../components/AuthProvider';
import type { Metadata } from "next";
import "@/styles/global.css";
export const metadata: Metadata = {
  title: "NEXTNOVA",
  description: "Welcome to NEXTNOVA",
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
        <AuthProvider>{children}</AuthProvider>
        <FNB />
      </body>
    </html>
  );
}
