import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while Firebase restores session
  if (loading) {
    return (
      <div className="p-10 text-center text-lg font-medium">
        Checking authentication...
      </div>
    );
  }

  // If no user, redirect to login and preserve intended route
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated → render protected content
  return children;
}
