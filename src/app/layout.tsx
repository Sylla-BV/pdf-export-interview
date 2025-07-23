import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Next.js Candidate Project',
  description: 'A Next.js project for interview candidates',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang='en'>
    <body className='antialiased'>{children}</body>
  </html>
);

export default RootLayout;
