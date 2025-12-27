import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/lib/wagmi';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '多链钱包资产看板',
  description: '支持多链的钱包资产看板 DApp',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

