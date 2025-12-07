// src/utils/generatePDF.js
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/** ছোট utility */
const shortId = (id = "") => (id.length > 8 ? id.slice(-8) : id);
const formatDate = (d) =>
  d ? new Date(d).toLocaleString() : new Date().toLocaleString();

/**
 * Orders -> PDF
 * @param {Array} orders  [{_id, total, status, createdAt, items:[{name,qty,price}]}]
 * @param {string} filename
 */
export function generateOrdersPDF(
  orders = [],
  filename = "pawmart-orders.pdf"
) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  // Title
  doc.setFontSize(16);
  doc.text("PawMart — My Orders", 40, 40);
  doc.setFontSize(10);
  doc.text(`Generated at: ${formatDate()}`, 40, 58);

  if (!orders.length) {
    doc.setFontSize(12);
    doc.text("No orders found.", 40, 90);
    return doc.save(filename);
  }

  // Main table (flat)
  const head = [["#", "Order ID", "Total ($)", "Status", "Created"]];
  const body = orders.map((o, i) => [
    i + 1,
    shortId(o._id),
    (o.total ?? 0).toFixed(2),
    o.status || "pending",
    formatDate(o.createdAt),
  ]);

  autoTable(doc, {
    startY: 90,
    head,
    body,
    styles: { fontSize: 9, cellPadding: 6 },
    headStyles: { fillColor: [24, 119, 242] },
    theme: "striped",
  });

  // Optional: show items per order in subsequent pages/sections
  orders.forEach((o, idx) => {
    const items = Array.isArray(o.items) ? o.items : [];
    if (!items.length) return;

    let y = doc.lastAutoTable.finalY + 20;
    if (y > doc.internal.pageSize.getHeight() - 120) {
      doc.addPage();
      y = 60;
    }

    doc.setFontSize(12);
    doc.text(`Order ${idx + 1} items (ID: ${shortId(o._id)})`, 40, y);

    const itemRows = items.map((it, i) => [
      i + 1,
      it.name || it.title || "Item",
      it.qty ?? it.quantity ?? 1,
      Number(it.price ?? 0).toFixed(2),
      (Number(it.qty ?? it.quantity ?? 1) * Number(it.price ?? 0)).toFixed(2),
    ]);

    autoTable(doc, {
      startY: y + 12,
      head: [["#", "Name", "Qty", "Price", "Subtotal"]],
      body: itemRows,
      styles: { fontSize: 9, cellPadding: 5 },
      theme: "grid",
    });
  });

  doc.save(filename);
}

/**
 * Listings -> PDF (ইচ্ছা করলে MyListings পেজে ব্যবহার করতে পারো)
 * @param {Array} listings  [{_id,name,price,category,createdAt}]
 * @param {string} filename
 */
export function generateListingsPDF(
  listings = [],
  filename = "pawmart-listings.pdf"
) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  doc.setFontSize(16);
  doc.text("PawMart — My Listings", 40, 40);
  doc.setFontSize(10);
  doc.text(`Generated at: ${formatDate()}`, 40, 58);

  if (!listings.length) {
    doc.setFontSize(12);
    doc.text("No listings found.", 40, 90);
    return doc.save(filename);
  }

  const head = [["#", "ID", "Name", "Category", "Price ($)", "Created"]];
  const body = listings.map((l, i) => [
    i + 1,
    shortId(l._id),
    l.name || l.title || "—",
    l.category || "—",
    Number(l.price ?? 0).toFixed(2),
    formatDate(l.createdAt),
  ]);

  autoTable(doc, {
    startY: 90,
    head,
    body,
    styles: { fontSize: 9, cellPadding: 6 },
    headStyles: { fillColor: [24, 119, 242] },
    theme: "striped",
  });

  doc.save(filename);
}

// Optional default export for convenience
export default { generateOrdersPDF, generateListingsPDF };
