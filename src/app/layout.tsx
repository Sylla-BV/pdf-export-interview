import type { Metadata } from 'next';
import './globals.css';
import { QueryClientProviderWrapper } from '@/lib/query-client';

export const metadata: Metadata = {
  title: 'PDF Export System',
  description: 'A PDF export system with temporary download links',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='antialiased'>
        <QueryClientProviderWrapper>
          {children}
        </QueryClientProviderWrapper>
      </body>
    </html>
  );
}
