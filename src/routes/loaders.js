// src/routes/loaders.js
import { defer } from "react-router-dom";

const API = import.meta.env.VITE_API_URL; // e.g. http://localhost:5000/api

// Home -> recent 6 listings
export function homeLoader() {
  const recentPromise =+ fetch(`${API}/api/listings`).then((res) =>
    res.json()
  );

  return defer({
    recentListings: recentPromise,
  });
}

// All supplies
export function suppliesLoader() {
  const suppliesPromise = fetch(`${API}/listings`).then((res) => res.json());

  return defer({
    supplies: suppliesPromise,
  });
}

// Category filtered supplies
export function categorySuppliesLoader({ params }) {
  const category = params.categoryName;

  const suppliesPromise = fetch(
    `${API}/listings?category=${encodeURIComponent(category)}`
  ).then((res) => res.json());

  return defer({
    supplies: suppliesPromise,
  });
}
