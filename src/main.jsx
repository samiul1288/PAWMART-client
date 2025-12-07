// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter, defer } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import App from "./App.jsx";
import DebugRouteError from "./DebugRouteError.jsx";
import "./index.css";
import ToastProvider from "./components/ui/Toast.jsx";

// 🔹 API base URL: Netlify te VITE_API_URL set thakle oita use hobe,
// na thakle fallback hisebe localhost use korbe (local dev er jonno)
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ---------- Helper: safe JSON fetch ----------
async function safeJsonFetch(url, options) {
  const res = await fetch(url, options);
  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}\n${text}`);
  }

  if (
    contentType.includes("text/html") ||
    text.trim().startsWith("<!DOCTYPE")
  ) {
    throw new Error(
      `Server returned HTML instead of JSON for ${url}. Check VITE_API_URL and backend server.`
    );
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Failed to parse JSON from ${url}. Raw response:\n${text}`);
  }
}

// ---------- Router ----------
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <DebugRouteError />,
    children: [
      // HOME (recent listings)
      {
        index: true,
        loader: () =>
          defer({
            // 🔁 CREDENTIALS REMOVE: public GET, no cookies needed
            recentListings: safeJsonFetch(`${API}/api/listings?limit=6`),
          }),
        async lazy() {
          const m = await import("./components/pages/Home.jsx");
          return { Component: m.default };
        },
      },

      // PUBLIC: Supplies list
      {
        path: "supplies",
        loader: () =>
          defer({
            // 🔁 CREDENTIALS REMOVE
            supplies: safeJsonFetch(`${API}/api/listings`),
          }),
        async lazy() {
          const m = await import("./components/pages/PetsSupplies.jsx");
          return { Component: m.default };
        },
      },

      // PUBLIC: Category-filtered Supplies
      {
        path: "category-filtered-product/:categoryName",
        loader: ({ params }) =>
          defer({
            // 🔁 CREDENTIALS REMOVE
            supplies: safeJsonFetch(
              `${API}/api/listings?category=${encodeURIComponent(
                params.categoryName
              )}`
            ),
          }),
        async lazy() {
          const m = await import("./components/pages/PetsSupplies.jsx");
          return { Component: m.default };
        },
      },

      // PUBLIC: Listing Details
      {
        path: "supplies/:id",
        loader: ({ params }) =>
          safeJsonFetch(`${API}/api/listings/${params.id}`),
        async lazy() {
          const m = await import("./components/pages/ListingDetails.jsx");
          return { Component: m.default };
        },
      },

      // AUTH
      {
        path: "login",
        async lazy() {
          const m = await import("./components/pages/Login.jsx");
          return { Component: m.default };
        },
      },
      {
        path: "register",
        async lazy() {
          const m = await import("./components/pages/Register.jsx");
          return { Component: m.default };
        },
      },

      // PROTECTED: My Listings
      {
        path: "my-listings",
        async lazy() {
          const [PR, Page] = await Promise.all([
            import("./routes/PrivateRoute.jsx"),
            import("./components/pages/MyListings.jsx"),
          ]);
          return {
            element: (
              <PR.default>
                <Page.default />
              </PR.default>
            ),
          };
        },
      },

      // PROTECTED: Add Listing
      {
        path: "add-listing",
        async lazy() {
          const [PR, Page] = await Promise.all([
            import("./routes/PrivateRoute.jsx"),
            import("./components/pages/AddLisiting.jsx"), // jei file name chilo oitai rakhlam
          ]);
          return {
            element: (
              <PR.default>
                <Page.default />
              </PR.default>
            ),
          };
        },
      },

      // PROTECTED: My Orders
      {
        path: "my-orders",
        loader: async () => {
          const token = localStorage.getItem("idToken");
          if (!token) {
            throw new Error(
              "No token found. Please login to view your orders."
            );
          }

          // 🔹 Orders protected: Firebase token header e jacche
          return safeJsonFetch(`${API}/api/orders`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        },
        async lazy() {
          const [PR, Page] = await Promise.all([
            import("./routes/PrivateRoute.jsx"),
            import("./components/pages/MyOrders.jsx"),
          ]);
          return {
            element: (
              <PR.default>
                <Page.default />
              </PR.default>
            ),
          };
        },
      },

      // 404 Page
      {
        path: "*",
        async lazy() {
          const m = await import("./components/pages/NotFound.jsx");
          return { Component: m.default };
        },
      },
    ],
  },
]);

// ---------- Render ----------
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ToastProvider />
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
