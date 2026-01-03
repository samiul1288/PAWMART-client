import { useEffect, useMemo, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import fallbackImg from "../../assets/fallback-listing.svg";
import useAuth from "../../hooks/useAuth";
import { toastSuccess, toastError } from "../ui/Toast";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Stars({ value = 0 }) {
  const v = Math.round(Number(value) || 0);
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < v ? "opacity-100" : "opacity-30"}>
          ⭐
        </span>
      ))}
    </div>
  );
}

export default function ListingDetails() {
  const listing = useLoaderData();
  const { user } = useAuth();

  const images = useMemo(() => {
    const arr = Array.isArray(listing?.images) ? listing.images : [];
    const single = listing?.image?.trim() ? [listing.image.trim()] : [];
    const merged = [...arr, ...single].filter(Boolean);
    return merged.length ? Array.from(new Set(merged)) : [fallbackImg];
  }, [listing]);

  const [active, setActive] = useState(0);

  // reviews
  const [reviews, setReviews] = useState([]);
  const [rLoading, setRLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [form, setForm] = useState({ rating: 5, comment: "", userName: "" });

  // related
  const [related, setRelated] = useState([]);
  const [relLoading, setRelLoading] = useState(true);

  const loadReviews = async () => {
    try {
      setRLoading(true);
      const res = await fetch(`${API}/api/reviews/${listing?._id}`);
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch {
      setReviews([]);
    } finally {
      setRLoading(false);
    }
  };

  const loadRelated = async () => {
    try {
      setRelLoading(true);
      const qs = new URLSearchParams();
      if (listing?.category) qs.set("category", listing.category);
      qs.set("limit", "8");
      qs.set("sort", "newest");

      const res = await fetch(`${API}/api/listings?${qs.toString()}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.data || [];
      setRelated(list.filter((x) => x?._id !== listing?._id).slice(0, 4));
    } catch {
      setRelated([]);
    } finally {
      setRelLoading(false);
    }
  };

  useEffect(() => {
    if (!listing?._id) return;
    loadReviews();
    loadRelated();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listing?._id]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return toastError("Login required to post a review.");
    if (!form.comment.trim()) return toastError("Comment is required.");

    try {
      setPosting(true);
      const token = localStorage.getItem("idToken");

      const res = await fetch(`${API}/api/reviews/${listing._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          rating: Number(form.rating),
          comment: form.comment.trim(),
          userName: form.userName.trim() || user.displayName || user.email,
        }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data?.error || data?.message || "Failed to post review"
        );

      toastSuccess("Review posted!");
      setForm({ rating: 5, comment: "", userName: "" });
      await loadReviews();
    } catch (err) {
      toastError(err.message);
    } finally {
      setPosting(false);
    }
  };

  const posted = listing?.createdAt
    ? new Date(listing.createdAt).toLocaleDateString()
    : "—";

  return (
    <section className="container mx-auto px-3 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold">{listing?.name}</h1>

        <div className="flex flex-wrap gap-3 items-center text-sm opacity-80">
          <span className="px-3 py-1 rounded-full bg-base-200 border border-base-300">
            {listing?.category}
          </span>
          {listing?.location && <span>📍 {listing.location}</span>}
          <span>🗓️ {posted}</span>
          <span className="flex items-center gap-2">
            <Stars value={listing?.avgRating || 0} />
            <span>({listing?.reviewCount || 0})</span>
          </span>
        </div>
      </div>

      {/* Gallery + Key Info */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-3">
          <div className="bg-base-200 border border-base-300 rounded-2xl overflow-hidden">
            <img
              src={images[active] || fallbackImg}
              alt="Listing media"
              className="w-full aspect-[16/10] object-cover"
              onError={(e) => (e.currentTarget.src = fallbackImg)}
            />
          </div>

          <div className="grid grid-cols-4 gap-3">
            {images.slice(0, 8).map((img, i) => (
              <button
                key={i}
                className={[
                  "rounded-xl overflow-hidden border",
                  i === active ? "border-primary" : "border-base-300",
                ].join(" ")}
                onClick={() => setActive(i)}
              >
                <img
                  src={img}
                  alt={`thumb-${i}`}
                  className="w-full aspect-[4/3] object-cover"
                  onError={(e) => (e.currentTarget.src = fallbackImg)}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="card bg-base-200 border border-base-300 rounded-2xl">
            <div className="card-body space-y-2">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <span>📌</span> Key Information
              </h3>

              <div className="text-sm opacity-85 space-y-1">
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  {listing?.status || "Available"}
                </p>
                <p>
                  <span className="font-semibold">Price:</span>{" "}
                  {Number(listing?.price)
                    ? `$${listing.price}`
                    : "Free for adoption"}
                </p>
                <p>
                  <span className="font-semibold">Location:</span>{" "}
                  {listing?.location || "—"}
                </p>
              </div>

              <div className="pt-2">
                <p className="text-xs uppercase tracking-wide opacity-70 mb-1">
                  Rules / Notes
                </p>
                <ul className="text-sm opacity-85 list-disc pl-5 space-y-1">
                  <li>Meet in a safe public place if possible.</li>
                  <li>Verify pet health and vaccination details.</li>
                  <li>Be respectful and follow community guidelines.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="card bg-base-200 border border-base-300 rounded-2xl">
            <div className="card-body">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <span>🧾</span> Overview
              </h3>
              <p className="opacity-85 text-sm whitespace-pre-line">
                {listing?.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span>💬</span> Reviews & Ratings
        </h2>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {rLoading ? (
              <div className="card bg-base-200 border border-base-300 rounded-2xl">
                <div className="card-body">
                  <span className="loading loading-spinner" />
                </div>
              </div>
            ) : reviews.length ? (
              <div className="space-y-3">
                {reviews.map((r) => (
                  <div
                    key={r._id}
                    className="card bg-base-200 border border-base-300 rounded-2xl"
                  >
                    <div className="card-body">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold">
                          {r.userName || r.userEmail || "User"}
                        </p>
                        <Stars value={r.rating} />
                      </div>
                      <p className="text-sm opacity-85">{r.comment}</p>
                      <p className="text-xs opacity-60">
                        {new Date(r.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert">
                <span>No reviews yet. Be the first to review!</span>
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <form
              onSubmit={submitReview}
              className="card bg-base-200 border border-base-300 rounded-2xl"
            >
              <div className="card-body space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <span>✍️</span> Write a review
                </h3>

                <input
                  className="input input-bordered"
                  value={form.userName}
                  onChange={(e) =>
                    setForm({ ...form, userName: e.target.value })
                  }
                  placeholder="Your name (optional)"
                  disabled={posting}
                />

                <select
                  className="select select-bordered"
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: e.target.value })}
                  disabled={posting}
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} Star
                    </option>
                  ))}
                </select>

                <textarea
                  className="textarea textarea-bordered min-h-[120px]"
                  value={form.comment}
                  onChange={(e) =>
                    setForm({ ...form, comment: e.target.value })
                  }
                  placeholder="Write your experience..."
                  disabled={posting}
                  required
                />

                <button className="btn btn-primary" disabled={posting}>
                  {posting ? "Posting..." : "Submit Review"}
                </button>

                {!user && (
                  <p className="text-xs opacity-70">
                    Please{" "}
                    <Link className="link" to="/login">
                      login
                    </Link>{" "}
                    to post a review.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Related */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span>🔁</span> Related Listings
        </h2>

        {relLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="card bg-base-200 border border-base-300 rounded-2xl"
              >
                <div className="skeleton w-full aspect-[4/3]" />
                <div className="p-4 space-y-3">
                  <div className="skeleton h-4 w-2/3" />
                  <div className="skeleton h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : related.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((x) => (
              <article
                key={x._id}
                className="card bg-base-200 border border-base-300 rounded-2xl overflow-hidden"
              >
                <figure className="w-full aspect-[4/3] bg-base-300">
                  <img
                    src={x.image || fallbackImg}
                    alt={x.name}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.src = fallbackImg)}
                  />
                </figure>
                <div className="card-body p-4">
                  <h3 className="font-semibold line-clamp-1">{x.name}</h3>
                  <p className="text-sm opacity-80 line-clamp-2">
                    {x.description}
                  </p>
                  <div className="pt-3 flex justify-end">
                    <Link
                      className="btn btn-primary btn-sm"
                      to={`/supplies/${x._id}`}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="alert">
            <span>No related items found.</span>
          </div>
        )}
      </div>
    </section>
  );
}
