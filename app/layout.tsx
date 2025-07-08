import "./globals.css";
import Header from '@/components/shared/Header';

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'PromptHouse',
    description: 'Your Prompt Asset Management Platform',
};

export default function RootLayout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html lang="zh-CN">
            <body>
                <div className="relative flex min-h-screen flex-col">
                    <Header />
                    <main className="flex-1">{children}</main>
                </div>
            </body>
        </html>
    );
}
