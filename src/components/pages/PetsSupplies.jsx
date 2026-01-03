// src/components/pages/PetsSupplies.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import fallbackImg from "../../assets/fallback-listing.svg";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// helper
const fmtPrice = (p) => (Number(p) === 0 ? "Free for adoption" : `$${p}`);

// Dropdown options
const CATEGORY_OPTIONS = [
  { value: "", label: "All categories" },
  { value: "Pets", label: "Pets" },
  { value: "Food", label: "Food" },
  { value: "Accessories", label: "Accessories" },
  { value: "Care Products", label: "Care Products" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price (Low → High)" },
  { value: "price_desc", label: "Price (High → Low)" },
];

export default function PetsSupplies() {
  const { categoryName } = useParams();
  const initialCategory = categoryName ? decodeURIComponent(categoryName) : "";

  // filters
  const [category, setCategory] = useState(initialCategory);
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("newest");

  // search (debounced)
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // price range
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const limit = 12;
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // data
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // ✅ keep category from route in sync
  useEffect(() => {
    const next = categoryName ? decodeURIComponent(categoryName) : "";
    setCategory(next);
    setPage(1);
  }, [categoryName]);

  // ✅ debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 450);
    return () => clearTimeout(t);
  }, [search]);

  // ✅ fetch listings from backend with query params
  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        setLoading(true);
        setErr("");

        const qs = new URLSearchParams();
        qs.set("page", String(page));
        qs.set("limit", String(limit));
        qs.set("sort", sort);

        if (debouncedSearch) qs.set("search", debouncedSearch);
        if (category) qs.set("category", category);
        if (location.trim()) qs.set("location", location.trim());

        if (minPrice !== "") qs.set("minPrice", String(minPrice));
        if (maxPrice !== "") qs.set("maxPrice", String(maxPrice));

        const res = await fetch(`${API}/api/listings?${qs.toString()}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data?.error || data?.message || "Failed to fetch listings"
          );
        }

        // ✅ support both array OR {data, meta}
        const list = Array.isArray(data) ? data : data?.data || [];
        const meta = Array.isArray(data) ? null : data?.meta || null;

        if (!ignore) {
          setItems(list);

          if (meta) {
            setTotalPages(meta.totalPages || 1);
            setTotalItems(meta.total || 0);
          } else {
            // fallback when server returns array (legacy)
            setTotalPages(1);
            setTotalItems(list.length);
          }
        }
      } catch (e) {
        if (!ignore) {
          setErr(e.message);
          setItems([]);
          setTotalPages(1);
          setTotalItems(0);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [category, location, sort, debouncedSearch, minPrice, maxPrice, page]);

  const title = category ? `Explore: ${category}` : "Explore";
  const subtitle = category
    ? "Browse listings filtered by category with search, sorting and pagination."
    : "Browse all listings with search, filters, sorting and pagination.";

  const disablePrev = page <= 1;
  const disableNext = page >= totalPages;

  const pageNumbers = useMemo(() => {
    // show up to 5 page buttons
    const maxBtns = 5;
    const start = Math.max(1, page - Math.floor(maxBtns / 2));
    const end = Math.min(totalPages, start + maxBtns - 1);
    const realStart = Math.max(1, end - maxBtns + 1);
    return Array.from({ length: end - realStart + 1 }, (_, i) => realStart + i);
  }, [page, totalPages]);

  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setPage(1);
    // category stays if route param exists
    if (!categoryName) setCategory("");
  };

  return (
    <section className="container mx-auto px-3 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">{title}</h1>
          <p className="opacity-70">{subtitle}</p>
          <p className="text-sm opacity-60 mt-1">
            Showing <span className="font-semibold">{items.length}</span> items
            {totalItems ? ` of ${totalItems}` : ""}.
          </p>
        </div>

        <Link to="/add-listing" className="btn btn-primary btn-sm md:btn-md">
          Add New Listing
        </Link>
      </div>

      {/* Filter bar */}
      <div className="bg-base-200/70 rounded-2xl p-3 md:p-4 border border-base-300/60 space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 w-full">
            {/* Category */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-semibold text-sm">
                  Category
                </span>
              </label>
              <select
                className="select select-bordered w-full"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value || "all"} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-semibold text-sm">
                  Location
                </span>
              </label>
              <input
                className="input input-bordered w-full"
                placeholder="e.g., Dhaka"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Min Price */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-semibold text-sm">
                  Min Price
                </span>
              </label>
              <input
                type="number"
                min="0"
                className="input input-bordered w-full"
                placeholder="0"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Max Price */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-semibold text-sm">
                  Max Price
                </span>
              </label>
              <input
                type="number"
                min="0"
                className="input input-bordered w-full"
                placeholder="500"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 w-full lg:w-auto">
            {/* Search */}
            <div className="form-control lg:min-w-[320px]">
              <label className="label py-1">
                <span className="label-text font-semibold text-sm">Search</span>
              </label>
              <input
                className="input input-bordered w-full"
                placeholder="Search by name, category, location..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
              <p className="text-xs opacity-60 mt-1">
                Auto-search after typing (debounced).
              </p>
            </div>

            {/* Sort */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-semibold text-sm">Sort</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-semibold text-sm">
                  Actions
                </span>
              </label>
              <button
                type="button"
                className="btn btn-outline w-full"
                onClick={resetFilters}
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {err ? (
        <div className="alert alert-error">
          <span>{err}</span>
        </div>
      ) : null}

      {/* Data */}
      {loading ? <GridSkeleton count={8} /> : <SuppliesGrid items={items} />}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
        <p className="text-sm opacity-70">
          Page <span className="font-semibold">{page}</span> of{" "}
          <span className="font-semibold">{totalPages}</span>
        </p>

        <div className="join">
          <button
            className="btn join-item"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={disablePrev}
          >
            Prev
          </button>

          {pageNumbers.map((n) => (
            <button
              key={n}
              className={`btn join-item ${n === page ? "btn-primary" : ""}`}
              onClick={() => setPage(n)}
            >
              {n}
            </button>
          ))}

          <button
            className="btn join-item"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={disableNext}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}

function SuppliesGrid({ items }) {
  if (!items.length) {
    return (
      <div className="alert">
        <span>No listings found. Try changing filters or search.</span>
      </div>
    );
  }

  return (
    <motion.div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 18 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { staggerChildren: 0.06, duration: 0.25 },
        },
      }}
    >
      {items.map((item) => (
        <SupplyCard key={item._id} item={item} />
      ))}
    </motion.div>
  );
}

function SupplyCard({ item }) {
  const { _id, name, price, category, image, location, status } = item;
  const imgSrc = image?.trim() || fallbackImg;

  return (
    <motion.article
      className="card bg-base-200 border border-base-300 rounded-2xl overflow-hidden h-full"
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -4, scale: 1.01 }}
    >
      <figure className="w-full aspect-[4/3] bg-base-300">
        <img
          src={imgSrc}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = fallbackImg;
          }}
        />
      </figure>

      <div className="card-body p-4 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <h2 className="card-title text-base md:text-lg line-clamp-1">
            {name}
          </h2>
          {status ? (
            <span className="text-xs px-2 py-1 rounded-full border border-base-300 opacity-80">
              {status}
            </span>
          ) : null}
        </div>

        <p className="text-sm opacity-70">
          <span className="font-semibold">Category:</span> {category}
        </p>

        <p className="text-sm opacity-70">
          <span className="font-semibold">Location:</span>{" "}
          {location || "Not specified"}
        </p>

        <p className="mt-2 text-sm font-semibold text-primary">
          {fmtPrice(price)}
        </p>

        <div className="mt-auto pt-3 flex justify-end">
          <Link to={`/supplies/${_id}`} className="btn btn-primary btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

function GridSkeleton({ count = 8 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="card bg-base-200 border border-base-300 rounded-2xl overflow-hidden"
        >
          <div className="skeleton w-full aspect-[4/3]" />
          <div className="p-4 space-y-3">
            <div className="skeleton h-4 w-3/4" />
            <div className="skeleton h-3 w-2/3" />
            <div className="skeleton h-3 w-1/2" />
            <div className="flex justify-between items-center pt-2">
              <div className="skeleton h-4 w-20" />
              <div className="skeleton h-9 w-28 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
