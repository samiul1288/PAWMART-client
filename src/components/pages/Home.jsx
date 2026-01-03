// src/components/pages/Home.jsx
import { Suspense, useEffect, useMemo, useState } from "react";
import { Await, Link, useLoaderData } from "react-router-dom";
import { motion } from "framer-motion";
import LoadingSpinner from "../layout/LoadingSpinner";
import fallbackImg from "../../assets/fallback-listing.svg";

const fmtPrice = (p) => (Number(p) === 0 ? "Free for adoption" : `$${p}`);

const SLIDES = [
  {
    tag: "Community",
    title: "Built for community & care",
    desc: "Support rescues and foster homes by connecting adopters with responsible posts.",
    cta1: { label: "Explore Listings", to: "/supplies" },
    cta2: { label: "Add Listing", to: "/add-listing" },
    img: "https://images.pexels.com/photos/5731862/pexels-photo-5731862.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    tag: "Light/Dark Ready",
    title: "Portfolio-ready UI & UX",
    desc: "Consistent spacing, reusable components, validation, loaders, and accessible contrast.",
    cta1: { label: "Go to Explore", to: "/supplies" },
    cta2: { label: "View Dashboard", to: "/my-orders" },
    img: "https://images.pexels.com/photos/5731913/pexels-photo-5731913.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    tag: "Secure Dashboard",
    title: "Protected routes, real data",
    desc: "Firebase token auth for orders and user-owned CRUD — no public CRUD pages.",
    cta1: { label: "My Listings", to: "/my-listings" },
    cta2: { label: "My Orders", to: "/my-orders" },
    img: "https://images.pexels.com/photos/7210267/pexels-photo-7210267.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
];

const CATEGORIES = [
  {
    label: "Pets",
    value: "Pets",
    desc: "Adopt lovable cats, dogs and more.",
    icon: "🐶",
  },
  {
    label: "Food",
    value: "Food",
    desc: "Nutritious food for healthy pets.",
    icon: "🍖",
  },
  {
    label: "Accessories",
    value: "Accessories",
    desc: "Toys, leashes, beds & more.",
    icon: "🎾",
  },
  {
    label: "Care Products",
    value: "Care Products",
    desc: "Grooming & pet care essentials.",
    icon: "🧴",
  },
];

export default function Home() {
  const { recentListings } = useLoaderData() || {};

  return (
    <section className="space-y-14">
      {/* 1) HERO / CAROUSEL (full width) */}
      <HeroCarousel />

      {/* 2) QUICK FEATURES */}
      <FeatureStrip />

      {/* 3) CATEGORIES */}
      <CategorySection />

      {/* 4) RECENT LISTINGS */}
      <section className="container mx-auto px-4 space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">
              Recent Listings
            </h2>
            <p className="opacity-70 text-sm md:text-base">
              Latest pets and pet products added by our community.
            </p>
          </div>
          <Link to="/supplies" className="btn btn-outline btn-sm md:btn-md">
            View All
          </Link>
        </div>

        <Suspense fallback={<ListingsSkeleton />}>
          <Await resolve={recentListings}>
            {(items) => <RecentListingsGrid items={items || []} />}
          </Await>
        </Suspense>
      </section>

      {/* 5) HIGHLIGHTS */}
      <Highlights />

      {/* 6) STATS */}
      <Stats />

      {/* 7) HOW IT WORKS */}
      <HowItWorks />

      {/* 8) TESTIMONIALS */}
      <Testimonials />

      {/* 9) FAQ */}
      <FAQ />

      {/* 10) NEWSLETTER */}
      <Newsletter />

      {/* 11) CTA */}
      <FinalCTA />

      {/* scroll hint spacing */}
      <div className="pb-8" />
    </section>
  );
}

/* ---------------- HERO CAROUSEL ---------------- */

function HeroCarousel() {
  const [i, setI] = useState(0);
  const slide = SLIDES[i];

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  const go = (dir) => {
    setI((p) => {
      const next = dir === "next" ? p + 1 : p - 1;
      return (next + SLIDES.length) % SLIDES.length;
    });
  };

  return (
    <section className="w-full bg-base-200/40 border-b border-base-300/60">
      <div className="container mx-auto px-4 py-10 md:py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[60vh]">
          {/* Left */}
          <motion.div
            key={slide.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-primary/10 text-primary">
              <span>✨</span>
              <span>{slide.tag}</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              {slide.title}
            </h1>

            <p className="text-sm md:text-base opacity-80 max-w-xl">
              {slide.desc}
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <Link to={slide.cta1.to} className="btn btn-primary">
                {slide.cta1.label}
              </Link>
              <Link to={slide.cta2.to} className="btn btn-outline">
                {slide.cta2.label}
              </Link>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => go("prev")}
                className="btn btn-sm btn-ghost"
              >
                ← Prev
              </button>
              <div className="flex gap-2">
                {SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setI(idx)}
                    className={[
                      "h-2.5 w-2.5 rounded-full transition",
                      idx === i ? "bg-primary" : "bg-base-300",
                    ].join(" ")}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() => go("next")}
                className="btn btn-sm btn-ghost"
              >
                Next →
              </button>
            </div>

            {/* Scroll hint */}
            <div className="pt-3 opacity-60 text-xs flex items-center gap-2">
              <span>↓</span>
              <span>Scroll to explore sections</span>
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            key={slide.img}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden border border-base-300/60 bg-base-300 aspect-[16/10]">
              <img
                src={slide.img}
                alt={slide.title}
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.src = fallbackImg)}
              />
            </div>

            {/* Right cards (aligned + icons) */}
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <MiniCard
                title="Fast Explore"
                desc="Search, filter, sort & paginate on Explore page."
                icon="🔎"
              />
              <MiniCard
                title="Protected Dashboard"
                desc="Add listings, manage orders, edit profile."
                icon="🛡️"
              />
              <div className="sm:col-span-2">
                <MiniCard
                  title="Light/Dark Ready"
                  desc="Accessible contrast and consistent UI components."
                  icon="🌗"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function MiniCard({ title, desc, icon }) {
  return (
    <div className="rounded-2xl border border-base-300/60 bg-base-100/70 p-4 shadow-sm h-full">
      <div className="flex items-start gap-3">
        <div className="text-2xl">{icon}</div>
        <div className="space-y-1">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm opacity-70">{desc}</p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- FEATURE STRIP ---------------- */

function FeatureStrip() {
  const items = useMemo(
    () => [
      {
        t: "Consistent Cards",
        d: "Same height, same radius, same layout.",
        icon: "🧩",
      },
      {
        t: "Loading States",
        d: "Skeletons/spinners during fetch.",
        icon: "⏳",
      },
      { t: "Clean Forms", d: "Validation, errors, success UX.", icon: "✅" },
      {
        t: "Responsive",
        d: "Mobile → Desktop with touch-friendly UI.",
        icon: "📱",
      },
    ],
    []
  );

  return (
    <section className="container mx-auto px-4">
      <div className="grid gap-4 md:grid-cols-4">
        {items.map((x) => (
          <div
            key={x.t}
            className="rounded-2xl border border-base-300/60 bg-base-200/50 p-4"
          >
            <div className="text-2xl">{x.icon}</div>
            <h3 className="font-semibold mt-2">{x.t}</h3>
            <p className="text-sm opacity-70 mt-1">{x.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- CATEGORIES ---------------- */

function CategorySection() {
  return (
    <section className="container mx-auto px-4 space-y-4">
      <div className="text-center space-y-1">
        <h2 className="text-2xl md:text-3xl font-semibold">
          Popular Categories
        </h2>
        <p className="opacity-70 text-sm md:text-base">
          Browse quickly by category.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((cat) => (
          <motion.div
            key={cat.value}
            whileHover={{ y: -4, scale: 1.02 }}
            className="rounded-2xl border border-base-300/60 bg-base-200/60 p-5 shadow-sm h-full"
          >
            <Link
              to={`/category-filtered-product/${encodeURIComponent(cat.value)}`}
              className="flex flex-col h-full"
            >
              <div className="text-3xl">{cat.icon}</div>
              <h3 className="font-semibold text-lg mt-2">{cat.label}</h3>
              <p className="text-sm opacity-70 mt-1">{cat.desc}</p>
              <span className="mt-auto pt-3 text-sm font-semibold text-primary">
                View {cat.label} →
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- RECENT LISTINGS ---------------- */

function RecentListingsGrid({ items }) {
  if (!items.length) {
    return (
      <div className="rounded-2xl border border-base-300/60 bg-base-200/50 p-5">
        <p className="text-sm opacity-80">
          No recent listings found. Want to add the first one?
        </p>
        <Link to="/add-listing" className="btn btn-primary btn-sm mt-3">
          Add Listing
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {items.map((item) => (
        <ListingCard key={item._id} item={item} />
      ))}
    </motion.div>
  );
}

function ListingCard({ item }) {
  const { _id, name, category, location, price, image } = item;

  return (
    <article className="rounded-2xl border border-base-300/60 bg-base-200/60 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="w-full aspect-[4/3] bg-base-300">
        <img
          src={image?.trim() || fallbackImg}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => (e.currentTarget.src = fallbackImg)}
        />
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="space-y-1">
          <h3 className="font-semibold text-base md:text-lg line-clamp-1">
            {name}
          </h3>
          <p className="text-xs opacity-70">
            <span className="font-semibold">Category:</span> {category}
          </p>
          <p className="text-xs opacity-70">
            <span className="font-semibold">Location:</span>{" "}
            {location || "Not specified"}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <span className="text-sm font-semibold text-primary">
            {fmtPrice(price)}
          </span>
          <Link to={`/supplies/${_id}`} className="btn btn-primary btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

/* ---------------- SKELETON ---------------- */

function ListingsSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-base-300/60 bg-base-200/60 overflow-hidden"
        >
          <div className="skeleton w-full aspect-[4/3]" />
          <div className="p-4 space-y-3">
            <div className="skeleton h-4 w-2/3" />
            <div className="skeleton h-3 w-1/2" />
            <div className="skeleton h-3 w-3/4" />
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

/* ---------------- HIGHLIGHTS ---------------- */

function Highlights() {
  const cards = [
    {
      t: "Trustworthy listings",
      d: "Clear metadata—category, location, date, and contact details.",
      icon: "🧾",
    },
    {
      t: "Fast discovery",
      d: "Search, filters, sorting and pagination—no endless scrolling pain.",
      icon: "⚡",
    },
    {
      t: "Dashboard tools",
      d: "Manage your listings & orders inside a dedicated dashboard layout.",
      icon: "📊",
    },
  ];

  return (
    <section className="container mx-auto px-4 space-y-4">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold">Why PawMart</h2>
        <p className="opacity-70 text-sm md:text-base">
          Designed with clean UX patterns: consistent cards, proper states,
          responsive layout, and dark mode contrast.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.t}
            className="rounded-2xl border border-base-300/60 bg-base-200/60 p-5"
          >
            <div className="text-3xl">{c.icon}</div>
            <h3 className="font-semibold text-lg mt-2">{c.t}</h3>
            <p className="text-sm opacity-70 mt-1">{c.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- STATS ---------------- */

function Stats() {
  const stats = [
    { k: "Listings", v: "Real-time", d: "Data from MongoDB API", icon: "🗂️" },
    { k: "Auth", v: "Firebase", d: "Token-based protected routes", icon: "🔐" },
    {
      k: "UI",
      v: "Light/Dark",
      d: "Accessible contrast maintained",
      icon: "🌗",
    },
    { k: "UX", v: "Responsive", d: "Mobile-first layout system", icon: "📱" },
  ];

  return (
    <section className="container mx-auto px-4">
      <div className="rounded-3xl border border-base-300/60 bg-base-200/50 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-semibold">
          Platform Statistics
        </h2>
        <p className="opacity-70 text-sm md:text-base mt-1">
          A quick snapshot of the platform’s core foundations.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-6">
          {stats.map((s) => (
            <div
              key={s.k}
              className="rounded-2xl border border-base-300/60 bg-base-100/70 p-4"
            >
              <div className="text-2xl">{s.icon}</div>
              <div className="mt-2 text-xs uppercase tracking-wide opacity-70">
                {s.k}
              </div>
              <div className="text-lg font-semibold">{s.v}</div>
              <div className="text-sm opacity-70 mt-1">{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- HOW IT WORKS ---------------- */

function HowItWorks() {
  const steps = [
    {
      t: "Explore",
      d: "Search and filter listings by category and location.",
      icon: "🔎",
    },
    {
      t: "View Details",
      d: "Check images, specs, and adoption/order info.",
      icon: "🧾",
    },
    {
      t: "Adopt/Order",
      d: "Place an order with validation & secure auth.",
      icon: "✅",
    },
  ];

  return (
    <section className="container mx-auto px-4 space-y-4">
      <h2 className="text-2xl md:text-3xl font-semibold">How it works</h2>
      <div className="grid gap-5 md:grid-cols-3">
        {steps.map((s) => (
          <div
            key={s.t}
            className="rounded-2xl border border-base-300/60 bg-base-200/60 p-5"
          >
            <div className="text-3xl">{s.icon}</div>
            <h3 className="font-semibold text-lg mt-2">{s.t}</h3>
            <p className="text-sm opacity-70 mt-1">{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- TESTIMONIALS ---------------- */

function Testimonials() {
  const data = [
    {
      n: "Ayesha",
      r: "Rescue Adopter",
      t: "The details page made adoption decisions easy—clear info and fast contact.",
    },
    {
      n: "Samiul",
      r: "Foster Parent",
      t: "Dashboard helped me manage posts and follow orders without confusion.",
    },
    {
      n: "PawCare BD",
      r: "Community Caregiver",
      t: "Love the clean UI and dark mode—feels like a real product.",
    },
  ];

  return (
    <section className="container mx-auto px-4 space-y-4">
      <h2 className="text-2xl md:text-3xl font-semibold">Testimonials</h2>
      <div className="grid gap-5 md:grid-cols-3">
        {data.map((x) => (
          <div
            key={x.n}
            className="rounded-2xl border border-base-300/60 bg-base-200/60 p-5"
          >
            <p className="text-sm opacity-80 leading-relaxed">“{x.t}”</p>
            <div className="mt-4">
              <div className="font-semibold">{x.n}</div>
              <div className="text-xs uppercase tracking-wide opacity-60">
                {x.r}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */

function FAQ() {
  const faqs = [
    {
      q: "Is adoption free?",
      a: "If a listing price is 0, it shows as Free for adoption. Orders are still tracked for transparency.",
    },
    {
      q: "Are dashboard routes public?",
      a: "No. Add Listing, My Listings, and My Orders are protected by Firebase auth.",
    },
    {
      q: "What happens if an image link breaks?",
      a: "The UI automatically falls back to a local fallback SVG image to keep layout consistent.",
    },
  ];

  return (
    <section className="container mx-auto px-4 space-y-4">
      <h2 className="text-2xl md:text-3xl font-semibold">FAQ</h2>

      <div className="grid gap-3">
        {faqs.map((f) => (
          <div
            key={f.q}
            className="collapse collapse-arrow rounded-2xl border border-base-300/60 bg-base-200/60"
          >
            <input type="checkbox" />
            <div className="collapse-title font-semibold">{f.q}</div>
            <div className="collapse-content">
              <p className="text-sm opacity-80">{f.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- NEWSLETTER ---------------- */

function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setEmail("");
  };

  return (
    <section className="container mx-auto px-4">
      <div className="rounded-3xl border border-base-300/60 bg-base-200/50 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-semibold">Newsletter</h2>
        <p className="opacity-70 text-sm md:text-base mt-1 max-w-2xl">
          Get updates on new listings, adoption tips, and pet care essentials.
        </p>

        <form
          onSubmit={submit}
          className="mt-5 flex flex-col sm:flex-row gap-3"
        >
          <input
            className="input input-bordered w-full"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <button
            className="btn btn-primary"
            disabled={loading || !email.trim()}
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
}

/* ---------------- FINAL CTA ---------------- */

function FinalCTA() {
  return (
    <section className="container mx-auto px-4">
      <div className="rounded-3xl border border-base-300/60 bg-base-100/70 p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-semibold">
            Ready to post your first listing?
          </h2>
          <p className="opacity-70 text-sm md:text-base max-w-2xl">
            Add a pet or pet product with clean validation and consistent UI.
            Keep the community updated with real info.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/add-listing" className="btn btn-primary">
            Add Listing
          </Link>
          <Link to="/supplies" className="btn btn-outline">
            Explore
          </Link>
        </div>
      </div>
    </section>
  );
}
