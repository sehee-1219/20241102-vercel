import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Signal Board",
  description: "Supabase 기반 게시판으로 게시글과 댓글을 작성할 수 있습니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
