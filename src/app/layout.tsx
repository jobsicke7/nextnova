import type { Metadata } from "next";

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
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
