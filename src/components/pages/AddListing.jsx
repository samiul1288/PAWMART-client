// src/components/pages/AddListing.jsx
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AddListing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [f, setF] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
    location: "",
    description: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);

  // user na thakle extra safety (route already private, but just in case)
  useEffect(() => {
    if (!user) {
      toast.error("Please login to add a listing");
      navigate("/login");
    }
  }, [user, navigate]);

  const isPetCategory = f.category === "Pets";

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setF((prev) => ({
      ...prev,
      [field]: value,
      // Pets select করলে price auto 0
      ...(field === "category" && value === "Pets" ? { price: "0" } : {}),
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to add a listing");
      return;
    }

    if (!f.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!f.category) {
      toast.error("Please select a category");
      return;
    }
    if (!f.image.trim()) {
      toast.error("Image URL is required");
      return;
    }
    if (!f.location.trim()) {
      toast.error("Location is required");
      return;
    }
    if (!f.description.trim()) {
      toast.error("Description is required");
      return;
    }

    const numericPrice = isPetCategory ? 0 : Number(f.price || 0);
    if (!isPetCategory && (isNaN(numericPrice) || numericPrice < 0)) {
      toast.error("Please enter a valid price");
      return;
    }

    try {
      setLoading(true);
      const token = await user.getIdToken();

      const res = await fetch(`${API}/api/listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ protected route
        },
        body: JSON.stringify({
          name: f.name.trim(),
          price: numericPrice,
          category: f.category,
          image: f.image.trim(),
          description: f.description.trim(),
          location: f.location.trim(),
          date: f.date || null, // backend e Listing model er date field
        }),
      });

      const text = await res.text();

      if (!res.ok) {
        let msg = "Failed to create listing";
        try {
          const json = JSON.parse(text);
          if (json.error) msg = json.error;
        } catch {
          // ignore
        }
        throw new Error(msg);
      }

      toast.success("Listing created successfully");
      setF({
        name: "",
        price: "",
        category: "",
        image: "",
        location: "",
        description: "",
        date: "",
      });

      // Ichchha korle direct My Listings e pathate paro
      // navigate("/my-listings");
    } catch (err) {
      console.error("❌ Add listing error:", err);
      toast.error(err.message || "Could not create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-base-300/60 via-base-200/40 to-base-100/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto card bg-base-200/80 shadow-lg border border-base-300/70">
          <div className="card-body space-y-4">
            <header className="space-y-1">
              <h2 className="text-2xl font-semibold">Add New Listing</h2>
              <p className="text-sm opacity-70">
                Fill in the details of your pet or pet product. For pets, price
                can be kept as free (0).
              </p>
            </header>

            {/* Read-only email display */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-xs">Your Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered input-sm"
                value={user?.email || ""}
                readOnly
              />
            </div>

            <form onSubmit={submit} className="space-y-3">
              {/* Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-xs">Name *</span>
                </label>
                <input
                  className="input input-bordered input-sm"
                  placeholder="e.g. Golden Retriever Puppy / Cat Scratching Post"
                  value={f.name}
                  onChange={handleChange("name")}
                  required
                />
              </div>

              {/* Category + Price */}
              <div className="grid md:grid-cols-2 gap-3">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-xs">Category *</span>
                  </label>
                  <select
                    className="select select-bordered select-sm"
                    value={f.category}
                    onChange={handleChange("category")}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Pets">Pets</option>
                    <option value="Food">Food</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Care Products">Care Products</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-xs">
                      Price {isPetCategory ? "(auto 0 for pets)" : "*"}
                    </span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="input input-bordered input-sm"
                    placeholder={isPetCategory ? "0" : "e.g. 15"}
                    value={isPetCategory ? "0" : f.price}
                    onChange={handleChange("price")}
                    disabled={isPetCategory}
                    required={!isPetCategory}
                  />
                </div>
              </div>

              {/* Location + Date */}
              <div className="grid md:grid-cols-2 gap-3">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-xs">Location *</span>
                  </label>
                  <input
                    className="input input-bordered input-sm"
                    placeholder="e.g. Dhaka, Chattogram"
                    value={f.location}
                    onChange={handleChange("location")}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-xs">
                      Available From / Pick Up Date
                    </span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered input-sm"
                    value={f.date}
                    onChange={handleChange("date")}
                  />
                </div>
              </div>

              {/* Image URL */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-xs">Image URL *</span>
                </label>
                <input
                  className="input input-bordered input-sm"
                  placeholder="https://example.com/image.jpg"
                  value={f.image}
                  onChange={handleChange("image")}
                  required
                />
              </div>

              {/* Description */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-xs">Description *</span>
                </label>
                <textarea
                  className="textarea textarea-bordered textarea-sm"
                  rows={3}
                  placeholder={
                    isPetCategory
                      ? "Write about pet age, nature, health, vaccination, etc."
                      : "Write details about this product..."
                  }
                  value={f.description}
                  onChange={handleChange("description")}
                  required
                />
              </div>

              {/* Optional image preview */}
              {f.image && (
                <div className="mt-2 flex items-center gap-3">
                  <p className="text-xs opacity-70 min-w-[90px]">
                    Image preview:
                  </p>
                  <div className="border border-base-300 rounded-lg bg-base-100/60 p-2">
                    <img
                      src={f.image}
                      alt="Preview"
                      className="h-20 w-32 object-contain"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/200x150?text=Invalid+URL";
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button className="btn btn-primary btn-sm" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Listing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
