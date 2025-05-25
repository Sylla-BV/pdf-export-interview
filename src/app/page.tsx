import HomePage from './home';
export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-100 px-4 py-10'>
      <div className='mb-10 w-full max-w-3xl text-center'>
        <h1 className='text-4xl font-bold text-gray-800'>Sylla PDF Export Tool</h1>
        <p className='mt-2 text-sm text-gray-600'>
          Generate a temporary PDF download link that expires in 120 seconds. Built with QStash +
          PostgreSQL + Next.js.
        </p>
      </div>

      <HomePage />

      <footer className='mt-16 text-xs text-gray-400'>
        &copy; {new Date().getFullYear()} Sylla. All rights reserved.
      </footer>
    </main>
  );
}
