// src/App.jsx
import { Outlet } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import LoadingSpinner from "./components/layout/LoadingSpinner.jsx";
import { Suspense } from "react";

export default function App() {
  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />

      {/* ✅ main container বাদ — page নিজের মতো container নেবে */}
      <main className="min-h-[calc(100vh-64px)]">
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
