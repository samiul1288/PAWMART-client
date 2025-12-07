import { useRouteError, isRouteErrorResponse } from "react-router-dom";
export default function DebugRouteError({ error }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Route Error</h1>
      <p className="text-gray-700 mb-2">
        Something went wrong while loading this page.
      </p>
      {error?.message && (
        <pre className="bg-gray-100 p-4 rounded text-sm text-red-500 whitespace-pre-wrap">
          {error.message}
        </pre>
      )}
      <a href="/" className="btn btn-outline mt-4">
        Go Home
      </a>
    </div>
  );
}
