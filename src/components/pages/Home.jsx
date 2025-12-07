// src/components/pages/Home.jsx
import { Suspense } from "react";
import { Await, Link, useLoaderData } from "react-router-dom";
import { motion } from "framer-motion";
import LoadingSpinner from "../layout/LoadingSpinner";

// ছোট হেল্পার: প্রাইস ফরম্যাট
const fmtPrice = (p) => (Number(p) === 0 ? "Free for adoption" : `$${p}`);
export default function Home() {
  const { recentListings } = useLoaderData() || {};

  return (
    <section className="container mx-auto px-3 py-8 space-y-12">
      {/* 1. Banner / Hero */}
      <HeroBanner />

      {/* 2. Category section */}
      <CategorySection />

      {/* 3. Recent Listings (last 6) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">
              Recent Listings
            </h2>
            <p className="opacity-70 text-sm md:text-base">
              Latest pets and pet products added by our community.
            </p>
          </div>
          <Link to="/supplies" className="btn btn-link px-0">
            View all
          </Link>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <Await resolve={recentListings}>
            {(items) => <RecentListingsGrid items={items || []} />}
          </Await>
        </Suspense>
      </section>

      {/* 4. Extra Sections */}
      <WhyAdoptSection />
      <PetHeroesSection />
    </section>
  );
}

/* -------------------- Hero Banner -------------------- */

function HeroBanner() {
  return (
    <div className="grid lg:grid-cols-2 gap-8 items-center">
      {/* Left text */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-4"
      >
        <p className="inline-flex items-center gap-2 text-xs md:text-sm px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">
          🐾 Welcome to Pawmart
        </p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
          Find Your
          <span className="text-primary"> Furry Friend </span>
          Today!
        </h1>
        <p className="text-sm md:text-base opacity-80 max-w-xl">
          PawMart connects local pet owners, rescuers, and pet shops with loving
          families. Adopt, don&apos;t shop — because every pet deserves a safe,
          happy home.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link to="/supplies" className="btn btn-primary">
            Browse Pets &amp; Supplies
          </Link>
          <Link to="/add-listing" className="btn btn-outline">
            Add a Listing
          </Link>
        </div>

        <ul className="mt-3 text-xs md:text-sm opacity-80 space-y-1">
          <li>• Trusted local adopters and pet lovers</li>
          <li>• Verified listings with clear details</li>
          <li>• Easy order and adoption request process</li>
        </ul>
      </motion.div>

      {/* Right pseudo-carousel (3 images) */}
      <motion.div
        className="grid gap-4 md:grid-cols-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="rounded-2xl overflow-hidden bg-base-300 aspect-[4/3]">
          <img
            src="https://images.pexels.com/photos/5731862/pexels-photo-5731862.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Happy pet adoption"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden bg-base-300 aspect-[4/3]">
            <img
              src="https://images.pexels.com/photos/5731913/pexels-photo-5731913.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Pet care products"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded-2xl overflow-hidden bg-base-300 aspect-[4/3] hidden md:block">
            <img
              src="https://images.pexels.com/photos/7210267/pexels-photo-7210267.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Pet food and accessories"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* -------------------- Category Section -------------------- */

// 🔹 Home.jsx

const categories = [
  {
    label: "Pets",
    value: "Pets",            // DB value
    description: "Adopt lovable cats, dogs and more.",
    emoji: "🐶",
  },
  {
    label: "Pet Food",
    value: "Food",            // DB value == model enum
    description: "Nutritious food for happy, healthy pets.",
    emoji: "🍖",
  },
  {
    label: "Accessories",
    value: "Accessories",     // DB value
    description: "Leashes, toys, beds and more.",
    emoji: "🎾",
  },
  {
    label: "Pet Care Products",
    value: "Care Products",   // DB value
    description: "Shampoo, grooming tools and health care.",
    emoji: "🧴",
  },
];

function CategorySection() {
  return (
    <section className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-semibold mb-1">
          Browse by Category
        </h2>
        <p className="opacity-70 text-sm md:text-base">
          Quickly jump into the type of pet or product you are looking for.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat) => (
          <motion.div
            key={cat.value}
            whileHover={{ y: -4, scale: 1.02 }}
            className="card bg-base-200 border border-base-300 rounded-2xl shadow-sm cursor-pointer"
          >
            <Link
              // ✅ এখানে এখন DB value পাঠাচ্ছি
              to={`/category-filtered-product/${encodeURIComponent(
                cat.value
              )}`}
              className="card-body items-start space-y-2"
            >
              <span className="text-3xl">{cat.emoji}</span>
              {/* UI তে সুন্দর label */}
              <h3 className="card-title text-lg">{cat.label}</h3>
              <p className="text-sm opacity-80">{cat.description}</p>
              <span className="text-xs font-semibold text-primary mt-1">
                View {cat.label}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}


/* -------------------- Recent Listings -------------------- */

function RecentListingsGrid({ items }) {
  if (!items.length) {
    return (
      <p className="text-sm opacity-70">
        No listings yet. Be the first to{" "}
        <Link to="/add-listing" className="link link-primary">
          add a listing
        </Link>
        .
      </p>
    );
  }

  return (
    <motion.div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {items.map((item) => (
        <RecentCard key={item._id} item={item} />
      ))}
    </motion.div>
  );
}

function RecentCard({ item }) {
  const { _id, name, category, location, price, image } = item;
  const imgSrc =
    image?.trim() || "https://via.placeholder.com/400x300?text=PawMart+Listing";

  return (
    <article className="card bg-base-200 shadow-md overflow-hidden h-full">
      <figure className="w-full aspect-[4/3] bg-base-300">
        <img
          src={imgSrc}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/400x300?text=PawMart+Listing";
          }}
        />
      </figure>
      <div className="card-body p-4 md:p-5 flex flex-col">
        <h3 className="card-title text-base md:text-lg mb-1">{name}</h3>
        <p className="text-xs opacity-70">
          <span className="font-semibold">Category:</span> {category}
        </p>
        {location && (
          <p className="text-xs opacity-70">
            <span className="font-semibold">Location:</span> {location}
          </p>
        )}
        <p className="mt-1 text-sm font-semibold text-primary">
          {fmtPrice(price)}
        </p>
        <div className="mt-auto pt-3 flex justify-end">
          <Link to={`/supplies/${_id}`} className="btn btn-primary btn-sm">
            See Details
          </Link>
        </div>
      </div>
    </article>
  );
}

/* -------------------- Extra Sections -------------------- */

function WhyAdoptSection() {
  return (
    <section className="bg-base-200/60 rounded-2xl p-6 md:p-8 space-y-3">
      <h2 className="text-2xl font-semibold">Why Adopt from PawMart?</h2>
      <p className="opacity-80 text-sm md:text-base">
        Every year, thousands of pets wait for a second chance at happiness.
        When you adopt from PawMart, you are not just bringing home a pet – you
        are saving a life and creating space for another rescue.
      </p>
      <div className="grid md:grid-cols-3 gap-4 text-sm">
        <div>
          <h3 className="font-semibold mb-1">💚 Give a Second Chance</h3>
          <p className="opacity-80">
            Rescued pets are loyal, loving and incredibly grateful for a safe
            home.
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-1">🤝 Support Local Rescuers</h3>
          <p className="opacity-80">
            Connect with local families, shelters and caregivers in your area.
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-1">💸 Transparent &amp; Fair</h3>
          <p className="opacity-80">
            Clear information about health, vaccination and adoption terms.
          </p>
        </div>
      </div>
    </section>
  );
}

function PetHeroesSection() {
  const heroes = [
    {
      name: "Ayesha & Milo",
      role: "Rescue Adopter",
      story:
        "Adopted a street pup and now volunteers every weekend to help other dogs.",
    },
    {
      name: "Samiul & Coco",
      role: "Foster Parent",
      story:
        "Provides temporary homes for abandoned kittens until they find a family.",
    },
    {
      name: "Paw Care BD",
      role: "Community Caregiver",
      story:
        "Local group that vaccinates and feeds street dogs and cats regularly.",
    },
  ];

  return (
    <section className="space-y-4">
      <h2 className="text-2xl md:text-3xl font-semibold">
        Meet Our Pet Heroes
      </h2>
      <p className="opacity-80 text-sm md:text-base max-w-2xl">
        Behind every successful adoption, there is a hero – a person or group
        who chose kindness. Here are a few of our community members making a
        difference.
      </p>

      <div className="grid gap-5 md:grid-cols-3">
        {heroes.map((h) => (
          <div
            key={h.name}
            className="bg-base-200/70 rounded-2xl p-5 border border-base-300 space-y-2"
          >
            <h3 className="font-semibold text-lg">{h.name}</h3>
            <p className="text-xs uppercase tracking-wide opacity-70">
              {h.role}
            </p>
            <p className="text-sm opacity-80">{h.story}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
