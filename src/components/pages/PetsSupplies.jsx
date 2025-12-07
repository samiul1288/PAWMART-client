// src/components/pages/PetsSupplies.jsx
import { Suspense, useState } from "react";
import { Await, Link, useLoaderData, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import LoadingSpinner from "../layout/LoadingSpinner";

// small helper
const fmtPrice = (p) => (Number(p) === 0 ? "Free for adoption" : `$${p}`);

// dropdown e use korar jonno category list
const CATEGORY_OPTIONS = [
  { value: "", label: "All categories" },
  { value: "Pets", label: "Pets" },
  { value: "Food", label: "Food" },
  { value: "Accessories", label: "Accessories" },
  { value: "Care Products", label: "Care Products" },
];

export default function PetsSupplies() {
  const { supplies } = useLoaderData();
  const { categoryName } = useParams();

  const initialCategory = categoryName ? decodeURIComponent(categoryName) : "";

  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState("");

  const title = initialCategory
    ? `Category: ${initialCategory}`
    : "Pets & Supplies";

  const subtitle = initialCategory
    ? "Showing listings filtered by category."
    : "Browse adoptable pets and essential pet products in one place.";

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // filter logic inside <Await> so that async data handle korte pari
  const renderWithFilters = (items = []) => {
    const term = searchTerm.trim().toLowerCase();
    const cat = categoryFilter.trim();

    const filtered = items.filter((item) => {
      // category filter
      if (cat && item.category !== cat) return false;

      // search filter
      if (!term) return true;

      const haystack = [
        item.name || "",
        item.category || "",
        item.location || "",
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });

    return <SuppliesGrid items={filtered} />;
  };

  return (
    <section className="container mx-auto px-3 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">{title}</h1>
          <p className="opacity-70">{subtitle}</p>
        </div>
        <Link to="/add-listing" className="btn btn-primary btn-sm md:btn-md">
          Add New Listing
        </Link>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-base-200/70 rounded-2xl p-3 md:p-4 border border-base-300/60">
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-xs uppercase tracking-wide opacity-70">
            Filters
          </span>
          <select
            className="select select-bordered select-sm w-full sm:w-auto"
            value={categoryFilter}
            onChange={handleCategoryChange}
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value || "all"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 items-center">
          <input
            type="text"
            className="input input-bordered input-sm w-full md:w-64"
            placeholder="Search by name, category or location..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Async data */}
      <Suspense fallback={<LoadingSpinner />}>
        <Await resolve={supplies}>{renderWithFilters}</Await>
      </Suspense>
    </section>
  );
}

function SuppliesGrid({ items }) {
  if (!items.length) {
    return (
      <div className="alert">
        <span>No listings found.</span>
      </div>
    );
  }

  return (
    <motion.div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { staggerChildren: 0.06, duration: 0.3 },
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
  const { _id, name, price, category, image, location } = item;

  const imgSrc =
    image?.trim() || "https://via.placeholder.com/400x300?text=PawMart+Listing";

  return (
    <motion.article
      className="card bg-base-200 shadow-md hover:shadow-xl transition-shadow duration-200 overflow-hidden group h-full"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -4, scale: 1.01 }}
    >
      {/* Image */}
      <figure className="w-full aspect-[4/3] bg-base-300">
        <img
          src={imgSrc}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/400x300?text=PawMart+Listing";
          }}
        />
      </figure>

      {/* Content */}
      <div className="card-body p-4 md:p-5 flex flex-col">
        <h2 className="card-title text-lg md:text-xl mb-1">{name}</h2>

        <p className="text-sm opacity-70">
          <span className="font-semibold">Category:</span> {category}
        </p>

        {location && (
          <p className="text-sm opacity-70">
            <span className="font-semibold">Location:</span> {location}
          </p>
        )}

        <p className="mt-1 text-sm md:text-base font-semibold text-primary">
          {fmtPrice(price)}
        </p>

        <div className="mt-auto pt-3 flex justify-end">
          <Link to={`/supplies/${_id}`} className="btn btn-primary btn-sm">
            See Details
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
