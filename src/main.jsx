import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import App from "./App.jsx";

import Home from "./components/pages/Home.jsx";
import PetsSupplies from "./components/pages/PetsSupplies.jsx";
import About from "./components/pages/About.jsx";
import Contact from "./components/pages/Contact.jsx";
import Help from "./components/pages/Help.jsx";
import Login from "./components/pages/Login.jsx";
import Register from "./components/pages/Register.jsx";
import ListingDetails from "./components/pages/ListingDetails.jsx";
import AddListing from "./components/pages/AddListing.jsx";
import MyListings from "./components/pages/MyListings.jsx";
import MyOrders from "./components/pages/MyOrders.jsx";
import NotFound from "./components/pages/NotFound.jsx";

import PrivateRoute from "./routes/PrivateRoute.jsx";
import { homeLoader, listingDetailsLoader } from "./routes/loaders.js";

import AuthProvider from "./context/AuthContext.jsx"; // ✅ default export provider

import DashboardLayout from "./components/dashboard/DashboardLayout.jsx";
import DashboardHome from "./components/dashboard/DashboardHome.jsx";
import Profile from "./components/dashboard/Profile.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home />, loader: homeLoader },
      { path: "explore", element: <PetsSupplies /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "help", element: <Help /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },

      {
        path: "supplies/:id",
        element: <ListingDetails />,
        loader: listingDetailsLoader,
      },

      {
        path: "add-listing",
        element: (
          <PrivateRoute>
            <AddListing />
          </PrivateRoute>
        ),
      },

      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        ),
        children: [
          { index: true, element: <DashboardHome /> },
          { path: "profile", element: <Profile /> },
          { path: "my-listings", element: <MyListings /> },
          { path: "my-orders", element: <MyOrders /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
