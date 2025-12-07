// src/components/pages/MyOrders.jsx
import { useLoaderData } from "react-router-dom";
import { generateOrdersPDF } from "../../utils/generatePDF";
import useAuth from "../../hooks/useAuth";

const shortId = (id = "") => (id.length > 8 ? id.slice(-8) : id);
const fmtDateTime = (d) => (d ? new Date(d).toLocaleString() : "");
const fmtDateOnly = (d) => (d ? new Date(d).toLocaleDateString("en-GB") : "—");

export default function MyOrders() {
  const { user } = useAuth();

  // loader থেকে আসা ডাটা (array বা {orders: []} – দুটোই সাপোর্ট)
  const loaded = useLoaderData();
  const orders = Array.isArray(loaded)
    ? loaded
    : Array.isArray(loaded?.orders)
    ? loaded.orders
    : [];

  const hasOrders = orders.length > 0;

  const totalAmount = orders.reduce((sum, o) => sum + Number(o.total ?? 0), 0);
  const pendingCount = orders.filter(
    (o) => (o.status || "pending") === "pending"
  ).length;

  return (
    <section className="container mx-auto px-3 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">My Orders</h1>
          <p className="opacity-70 text-sm md:text-base">
            {user?.displayName || user?.email} — {orders.length} order
            {orders.length !== 1 ? "s" : ""}
          </p>
        </div>

        <button
          onClick={() => generateOrdersPDF(orders)}
          disabled={!hasOrders}
          className="btn btn-outline btn-sm md:btn-md"
          title={hasOrders ? "Export orders to PDF" : "No orders found"}
        >
          Export PDF
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryCard
          label="Total Orders"
          value={orders.length}
          hint="All orders placed from this account"
        />
        <SummaryCard
          label="Total Spent"
          value={`$${totalAmount.toFixed(2)}`}
          hint="Sum of all order totals"
        />
        <SummaryCard
          label="Pending Orders"
          value={pendingCount}
          hint="Orders that are still pending"
        />
      </div>

      {/* Table / Empty state */}
      {!hasOrders ? (
        <div className="alert">
          <span>No orders found.</span>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-base-200/60">
          <table className="table table-sm md:table-md">
            <thead>
              <tr>
                <th>#</th>
                <th>Order</th>
                <th>Product</th>
                <th>Buyer info</th>
                <th>Qty</th>
                <th>Total ($)</th>
                <th>Status</th>
                <th>Preferred Date</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => {
                const items = Array.isArray(o.items) ? o.items : [];
                const count =
                  o.itemsCount ??
                  items.reduce(
                    (acc, it) => acc + (it.qty ?? it.quantity ?? 1),
                    0
                  );

                const status = o.status || "pending";
                const statusClass =
                  status === "completed"
                    ? "badge-success"
                    : status === "cancelled"
                    ? "badge-error"
                    : "badge-ghost";

                return (
                  <tr key={o._id || i} className="align-top">
                    <td>{i + 1}</td>
                    <td className="font-mono text-xs md:text-sm">
                      {shortId(o._id)}
                    </td>

                    {/* Product / Notes */}
                    <td className="text-xs md:text-sm">
                      <div className="font-semibold">
                        {o.productName || items[0]?.name || "Item"}
                      </div>
                      {o.additionalNotes && (
                        <div className="text-[0.7rem] md:text-xs opacity-70 line-clamp-2">
                          {o.additionalNotes}
                        </div>
                      )}
                    </td>

                    {/* Buyer info */}
                    <td className="text-xs md:text-sm">
                      <div className="font-medium">
                        {o.buyerName || user?.displayName || "—"}
                      </div>
                      <div className="opacity-70">
                        {o.email || user?.email || "—"}
                      </div>
                      {o.phone && (
                        <div className="opacity-70 text-[0.7rem] md:text-xs">
                          📞 {o.phone}
                        </div>
                      )}
                      {o.address && (
                        <div className="opacity-70 text-[0.7rem] md:text-xs line-clamp-2">
                          📍 {o.address}
                        </div>
                      )}
                    </td>

                    {/* Qty */}
                    <td>{count}</td>

                    {/* Total */}
                    <td className="font-semibold">
                      {Number(o.total ?? 0).toFixed(2)}
                    </td>

                    {/* Status */}
                    <td>
                      <span className={`badge ${statusClass} badge-sm`}>
                        {status}
                      </span>
                    </td>

                    {/* Preferred date */}
                    <td className="text-xs md:text-sm">
                      {fmtDateOnly(o.date || o.createdAt)}
                    </td>

                    {/* Created at */}
                    <td className="text-xs md:text-sm">
                      {fmtDateTime(o.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function SummaryCard({ label, value, hint }) {
  return (
    <div className="rounded-xl border border-base-300/60 bg-base-100/70 px-4 py-3 flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wide opacity-70">
        {label}
      </span>
      <span className="text-lg md:text-xl font-semibold">{value}</span>
      {hint && (
        <span className="text-[0.7rem] md:text-xs opacity-60">{hint}</span>
      )}
    </div>
  );
}
