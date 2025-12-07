import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GiftAssist - AI-Powered Gift Planning",
  description: "AI-powered gift planning with conversational assistant and price comparison",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
