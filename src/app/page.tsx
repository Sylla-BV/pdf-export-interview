'use client';

import PdfGenerator from '@/components/pdf-generator';

const Home = () => (
  <main className='animate-gradient-xy flex min-h-screen flex-col items-center justify-center gap-8 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-300 p-24'>
    <h1 className='text-4xl font-bold text-white'>PDF Generator</h1>
    <PdfGenerator />
  </main>
);

export default Home;
