import { useEffect, useState } from "react";
import LoadingSpinner from "../layout/LoadingSpinner";
import { OrdersBarChart, CategoryPieChart } from "./Charts";
import DataTable from "./DataTable";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Stat({ label, value, icon }) {
  return (
    <div className="card bg-base-200 border border-base-300 rounded-2xl">
      <div className="card-body">
        <p className="text-xs uppercase opacity-70 flex items-center gap-2">
          <span>{icon}</span> {label}
        </p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

export default function DashboardHome() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("idToken");
        const res = await fetch(`${API}/api/dashboard/summary`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(
            data?.error || data?.message || "Failed to load summary"
          );
        if (!ignore) setSummary(data);
      } catch (e) {
        if (!ignore) setError(e.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => (ignore = true);
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    );

  const orderCols = [
    { key: "productName", label: "Item" },
    {
      key: "total",
      label: "Total",
      render: (r) => (r.total ? `$${r.total}` : "Free"),
    },
    { key: "status", label: "Status" },
    {
      key: "createdAt",
      label: "Date",
      render: (r) => new Date(r.createdAt).toLocaleDateString(),
    },
  ];

  const listingCols = [
    { key: "name", label: "Listing" },
    { key: "category", label: "Category" },
    { key: "status", label: "Status" },
    {
      key: "createdAt",
      label: "Date",
      render: (r) => new Date(r.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        <p className="opacity-70">
          Cards, charts, and tables are loaded from backend data.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Stat icon="📌" label="Total Listings" value={summary.totalListings} />
        <Stat icon="🧾" label="My Listings" value={summary.myListings} />
        <Stat icon="🛒" label="My Orders" value={summary.totalOrders} />
        <Stat icon="⏳" label="Pending" value={summary.pendingOrders} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <OrdersBarChart data={summary.ordersPerMonth || []} />
        <CategoryPieChart data={summary.categoryBreakdown || []} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DataTable
          title="Latest Orders"
          rows={summary.latestOrders || []}
          columns={orderCols}
        />
        <DataTable
          title="Latest Listings"
          rows={summary.latestListings || []}
          columns={listingCols}
        />
      </div>
    </div>
  );
}
