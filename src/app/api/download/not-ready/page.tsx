export default function NotReady() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Export Not Ready</h1>
        <p className="mt-2 text-gray-600">The PDF export is still being processed. Please try again later.</p>
      </div>
    </div>
  );
}
