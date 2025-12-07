import { Outlet, NavLink } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import LoadingSpinner from "./components/layout/LoadingSpinner.jsx";
import { Suspense } from "react";

export default function App() {
  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />

      <main className="container mx-auto px-3 py-6">
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
