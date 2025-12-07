// src/components/pages/MyListings.jsx
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import useAuth from "../../hooks/useAuth";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function MyListings() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // === Load only this user's listings ===
  const load = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const token = await user.getIdToken();

      const res = await fetch(`${API}/api/listings/mine`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to load listings");
      }

      const data = await res.json();
      setItems(data || []);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // === Update (simple prompt, document er “Update button” fulfill) ===
  const handleUpdate = async (item) => {
    const newName = prompt("Update name:", item.name);
    if (newName == null) return;

    const newPriceStr = prompt("Update price:", item.price);
    if (newPriceStr == null) return;

    const newPrice = Number(newPriceStr);
    if (Number.isNaN(newPrice) || newPrice < 0) {
      toast.error("Invalid price");
      return;
    }

    const newCategory = prompt("Update category:", item.category);
    if (newCategory == null || !newCategory.trim()) {
      toast.error("Category is required");
      return;
    }

    try {
      const token = await user.getIdToken();
      const res = await fetch(`${API}/api/listings/${item._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newName,
          price: newPrice,
          category: newCategory,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to update listing");
      }

      toast.success("Listing updated");
      load();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Could not update listing");
    }
  };

  // === Delete ===
  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this listing?");
    if (!ok) return;

    try {
      const token = await user.getIdToken();
      const res = await fetch(`${API}/api/listings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to delete listing");
      }

      toast.success("Listing deleted");
      load();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Could not delete listing");
    }
  };

  return (
    <section className="container mx-auto px-3 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-1">My Listings</h1>
        <p className="opacity-70 text-sm md:text-base">
          Only your own listings are shown here. You can update or delete them.
        </p>
      </header>

      {loading ? (
        <div className="py-10 text-center">Loading your listings...</div>
      ) : items.length === 0 ? (
        <div className="alert">
          <span>
            You have no listings yet. Please add one from the Add Listing page.
          </span>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-base-300/70 bg-base-200/60">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Category</th>
                <th className="text-right">Price</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={it._id}>
                  <td>{i + 1}</td>
                  <td>{it.name}</td>
                  <td>{it.category}</td>
                  <td className="text-right">
                    {Number(it.price) === 0 ? "Free" : `$${it.price}`}
                  </td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleUpdate(it)}
                        className="btn btn-xs btn-outline"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(it._id)}
                        className="btn btn-xs btn-error"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
