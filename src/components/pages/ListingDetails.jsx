// src/components/pages/ListingDetails.jsx
import { useLoaderData, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-hot-toast";
import Modal from "../ui/Modal";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const fmtPrice = (p) => (Number(p) === 0 ? "Free for adoption" : `$${p}`);
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB") : "Not specified";

export default function ListingDetails() {
  const listing = useLoaderData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [orderOpen, setOrderOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({
    buyerName: "",
    email: "",
    quantity: 1,
    address: "",
    phone: "",
    date: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setOrderForm((prev) => ({
        ...prev,
        buyerName: user.displayName || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  if (!listing) {
    return (
      <section className="container mx-auto px-3 py-10">
        <div className="alert alert-error">
          <span>Listing not found.</span>
        </div>
      </section>
    );
  }

  const {
    _id,
    name,
    category,
    price = 0,
    image,
    description,
    email,
    location: loc,
    date,
  } = listing;

  const handleBack = () => {
    navigate(-1);
  };

  // 👉 Adopt / Order button click → show form modal (if logged in)
  const handleAdoptClick = () => {
    if (!user) {
      toast.error("Please login to place an order.");
      navigate("/login", { state: { from: location } });
      return;
    }
    setOrderOpen(true);
  };

  // 👉 Final submit order
  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to place an order.");
      navigate("/login", { state: { from: location } });
      return;
    }

    if (!orderForm.address.trim()) {
      toast.error("Address is required");
      return;
    }
    if (!orderForm.phone.trim()) {
      toast.error("Phone is required");
      return;
    }

    try {
      setSubmitting(true);
      const token = await user.getIdToken();

      const itemPrice = Number(price) || 0;
      const qty = Number(orderForm.quantity) || 1;
      const total = itemPrice * qty;

      const payload = {
        items: [
          {
            listingId: _id,
            qty,
            price: itemPrice,
          },
        ],
        total, // 0 হলে free adoption
        // extra fields – document / schema অনুজায়ী
        buyerName: orderForm.buyerName,
        email: orderForm.email,
        address: orderForm.address,
        phone: orderForm.phone,
        additionalNotes: orderForm.notes,
        date: orderForm.date || null,
        productName: name,
      };

      const res = await fetch(`${API}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();

      if (!res.ok) {
        console.error("❌ Order API error:", text);
        let msg = "Failed to place order.";
        try {
          const json = JSON.parse(text);
          if (json.error) msg = json.error;
        } catch {
          // ignore
        }
        toast.error(msg);
        return;
      }

      toast.success("Order placed successfully!");
      setOrderOpen(false);
      navigate("/my-orders");
    } catch (err) {
      console.error("❌ Order request failed:", err);
      toast.error("Could not reach server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="container mx-auto px-3 py-8">
      {/* Top bar: back button */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <button onClick={handleBack} className="btn btn-ghost btn-sm">
          ← Back
        </button>

        {user && (
          <span className="text-xs md:text-sm opacity-70">
            Viewing as <span className="font-semibold">{user.email}</span>
          </span>
        )}
      </div>

      {/* Main card */}
      <div className="card lg:card-side bg-base-200 shadow-xl overflow-hidden">
        {/* Left: Image */}
        <figure className="lg:w-1/2 w-full bg-base-300">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full max-h-[480px] object-contain p-4"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm opacity-60">
              No image provided
            </div>
          )}
        </figure>

        {/* Right: Details */}
        <div className="card-body lg:w-1/2 p-6 space-y-3">
          <h1 className="card-title text-2xl md:text-3xl mb-2">{name}</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <DetailItem label="Category" value={category} />
            <DetailItem label="Location" value={loc || "Not specified"} />
            <DetailItem label="Owner Email" value={email} />
            <DetailItem label="Available From" value={fmtDate(date)} />
          </div>

          <p className="mt-2 text-lg font-semibold text-primary">
            {fmtPrice(price)}
          </p>

          {description && (
            <div className="mt-3">
              <h2 className="font-semibold mb-1">Description</h2>
              <p className="text-sm leading-relaxed opacity-90">
                {description}
              </p>
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              className="btn btn-primary"
              onClick={handleAdoptClick}
              title={
                user
                  ? "Proceed to adopt / order this listing"
                  : "Login to place an order"
              }
            >
              Adopt / Order Now
            </button>

            {!user && (
              <p className="text-xs opacity-70">
                You must be logged in to place an order.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Order Modal */}
      <Modal
        open={orderOpen}
        onClose={() => !submitting && setOrderOpen(false)}
        title="Confirm Adoption / Order"
        subtitle={`Fill in your details to place order for "${name}".`}
        size="md"
        footer={
          <p className="text-xs opacity-70">
            Total will be calculated as price × quantity.
          </p>
        }
      >
        <form onSubmit={handleSubmitOrder} className="space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-xs">Buyer Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered input-sm"
                value={orderForm.buyerName}
                onChange={(e) =>
                  setOrderForm({ ...orderForm, buyerName: e.target.value })
                }
                placeholder="Your name"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-xs">Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered input-sm"
                value={orderForm.email}
                onChange={(e) =>
                  setOrderForm({ ...orderForm, email: e.target.value })
                }
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-xs">Quantity</span>
              </label>
              <input
                type="number"
                min="1"
                className="input input-bordered input-sm"
                value={orderForm.quantity}
                onChange={(e) =>
                  setOrderForm({ ...orderForm, quantity: e.target.value })
                }
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-xs">Preferred Date</span>
              </label>
              <input
                type="date"
                className="input input-bordered input-sm"
                value={orderForm.date}
                onChange={(e) =>
                  setOrderForm({ ...orderForm, date: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-xs">Address *</span>
              </label>
              <input
                type="text"
                className="input input-bordered input-sm"
                value={orderForm.address}
                onChange={(e) =>
                  setOrderForm({ ...orderForm, address: e.target.value })
                }
                placeholder="Full address"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-xs">Phone *</span>
              </label>
              <input
                type="text"
                className="input input-bordered input-sm"
                value={orderForm.phone}
                onChange={(e) =>
                  setOrderForm({ ...orderForm, phone: e.target.value })
                }
                placeholder="01XXXXXXXXX"
                required
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-xs">Additional Notes</span>
            </label>
            <textarea
              className="textarea textarea-bordered textarea-sm"
              rows={3}
              value={orderForm.notes}
              onChange={(e) =>
                setOrderForm({ ...orderForm, notes: e.target.value })
              }
              placeholder="Any extra info (e.g. time preference, special handling)..."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={submitting}
            >
              {submitting ? "Placing order..." : "Confirm Order"}
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}

function DetailItem({ label, value }) {
  return (
    <p className="text-sm">
      <span className="font-semibold">{label}:</span>{" "}
      <span className="opacity-80">{value}</span>
    </p>
  );
}
