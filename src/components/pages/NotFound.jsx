import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-3">
      <div className="max-w-xl w-full text-center space-y-4">
        <h1 className="text-6xl font-extrabold">404</h1>
        <p className="text-xl font-semibold">Page not found</p>
        <p className="opacity-70">
          The page you are looking for doesn’t exist or was moved.
        </p>

        {/* ✅ No external image to avoid broken URLs in production */}
        <div className="bg-base-200 border border-base-300 rounded-2xl p-6">
          <p className="opacity-80">
            Try going back to Home or explore listings.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
          <Link to="/explore" className="btn btn-outline">
            Explore Listings
          </Link>
        </div>
      </div>
    </div>
  );
}
