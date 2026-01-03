// client/src/routes/loaders.js
import { defer } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ✅ Home: recent listings promise
export function homeLoader() {
  const recentPromise = fetch(`${API}/api/listings?limit=8`).then((res) =>
    res.json()
  );
  return defer({ recentListings: recentPromise });
}

// ✅ Explore: supports query string (optional)
export function suppliesLoader({ request }) {
  const url = new URL(request.url);
  const qs = url.searchParams.toString();
  const listPromise = fetch(`${API}/api/listings?${qs}`).then((res) =>
    res.json()
  );
  return defer({ listings: listPromise });
}

// ✅ Listing Details (public)
export async function listingDetailsLoader({ params }) {
  const res = await fetch(`${API}/api/listings/${params.id}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Response(data?.error || "Listing not found", {
      status: res.status,
    });
  }
  return data;
}
