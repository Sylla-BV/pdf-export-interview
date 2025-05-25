import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Next.js Candidate Project',
  description: 'A Next.js project for interview candidates',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='antialiased'>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
