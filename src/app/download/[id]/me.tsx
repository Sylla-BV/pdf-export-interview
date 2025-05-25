// app/error.tsx
"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("❌ Error caught in boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
      <div className="bg-white border border-red-200 rounded-lg shadow-md p-6 max-w-md text-center">
        <h2 className="text-lg font-semibold text-red-700">Something went wrong</h2>
        <p className="text-sm text-gray-600 mt-2">
          We couldnt complete your request. Please try again.
        </p>
        <button
          onClick={reset}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-4 rounded transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
