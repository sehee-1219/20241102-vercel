import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Signal Board",
  description: "Supabase-backed board with posts and comments.",
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
