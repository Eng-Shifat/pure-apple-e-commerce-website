export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900">404</h1>
      <p className="text-gray-500 mt-2">Page not found.</p>
      <a href="/" className="mt-4 text-brand-600 hover:underline">
        Go Home
      </a>
    </div>
  );
}