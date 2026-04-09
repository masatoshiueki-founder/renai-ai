import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "恋愛相談AI",
  description: "AIがあなたの恋愛のお悩みにアドバイスします",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
