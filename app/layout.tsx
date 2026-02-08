import '@/app/globals.css';

import { headers } from 'next/headers';

import { Providers } from '@/app/providers';
import Header from '@/components/shared/Header';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PromptHouse',
  description: 'Your Prompt Asset Management Platform',
};

function RootLayoutClient({ children, shouldHideHeader }: { children: React.ReactNode; shouldHideHeader: boolean }) {
  return (
    <Providers>
      <div className="relative flex min-h-screen flex-col">
        {!shouldHideHeader && <Header />}
        <main className="flex-1">{children}</main>
      </div>
    </Providers>
  );
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const currentPath = headersList.get('x-invoke-path') ?? '';
  const isAuthPage = currentPath.startsWith('/auth/');
  const isErrorPage = currentPath === '/404' || currentPath === '/500';
  const shouldHideHeader = isAuthPage || isErrorPage;

  return (
    <html lang="zh-CN">
      <body>
        <RootLayoutClient shouldHideHeader={shouldHideHeader}>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
