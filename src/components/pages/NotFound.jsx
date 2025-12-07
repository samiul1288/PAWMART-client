import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-6">
      {/* Image Box */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <img
          src="https://copilot.microsoft.com/th/id/BCO.aa7c34bc-7a45-4f36-a758-314ff360ccd6.https://seosherpa.com/wp-content/uploads/2020/12/404-error-page-social-share.png"
          alt="404 Illustration"
          className="mx-auto w-80"
        />
      </div>

      {/* Text */}
      <h2 className="text-2xl font-bold mt-6">404 — Page not found</h2>
      <p className="text-gray-600 mt-2">
        The page you are looking for doesn’t exist.
      </p>

      {/* Button */}
      <Link
        to="/"
        className="mt-6 inline-block px-6 py-3 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 transition"
      >
        Go Home
      </Link>
    </div>
  );
}
