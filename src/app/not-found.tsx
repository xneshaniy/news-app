import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-7xl font-bold text-gray-200 dark:text-gray-700 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
