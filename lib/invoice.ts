// SAVE PATH: lib/invoice.ts
// Client-side PDF invoice (jsPDF). Customer order করার পর auto-download হয়, admin-ও order page থেকে নামাতে পারে।
// Note: PDF-এর default font-এ ৳ চিহ্ন নেই, তাই "BDT" লেখা হয়েছে।

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { SHOP } from "@/lib/shopConfig";

export interface InvoiceItem {
  name: string;
  variant?: string | null;
  quantity: number;
  price: number;
}

export interface InvoiceData {
  orderId: string;
  createdAt: string; // ISO
  customer: { name: string; phone: string; address: string; city: string };
  items: InvoiceItem[];
  subtotal: number;
  deliveryCharge: number;
  deliveryArea?: "dhaka" | "outside" | null;
  total: number;
  advanceAmount: number;
  paymentMethod: "cod" | "bkash" | "nagad";
  advanceMethod?: "bkash" | "nagad" | null;
  trxId?: string | null;
  note?: string | null;
  paymentStatus?: "pending_review" | "verified" | "rejected" | null;
}

const ORANGE: [number, number, number] = [251, 87, 36];
const DARK: [number, number, number] = [17, 24, 39];
const GRAY: [number, number, number] = [107, 114, 128];

const bdt = (n: number) => `BDT ${Math.round(n).toLocaleString("en-US")}`;
export const invoiceNo = (id: string) => `INV-${id.slice(0, 8).toUpperCase()}`;

// Logo-কে dataURL বানায় (fail করলে null — invoice logo ছাড়াই হবে)
async function loadLogo(): Promise<string | null> {
  try {
    const res = await fetch("/logo/pure-apple-logo.png");
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

const label = (s?: string | null) => (s === "bkash" ? "bKash" : s === "nagad" ? "Nagad" : "Cash on Delivery");

export function buildInvoicePdf(d: InvoiceData, logo?: string | null): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const M = 40;

  // ── Top band ──
  doc.setFillColor(...ORANGE);
  doc.rect(0, 0, W, 6, "F");

  let textX = M;
  if (logo) {
    try { doc.addImage(logo, "PNG", M, 28, 46, 46); textX = M + 58; } catch { /* ignore */ }
  }
  doc.setFont("helvetica", "bold").setFontSize(20).setTextColor(...DARK);
  doc.text(SHOP.name, textX, 50);
  doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...GRAY);
  doc.text("Mobile & Gadget Shop", textX, 64);
  doc.text(`WhatsApp: +${SHOP.whatsappNumber}`, textX, 76);

  doc.setFont("helvetica", "bold").setFontSize(24).setTextColor(...ORANGE);
  doc.text("INVOICE", W - M, 50, { align: "right" });
  doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...GRAY);
  doc.text(invoiceNo(d.orderId), W - M, 64, { align: "right" });
  doc.text(new Date(d.createdAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }), W - M, 76, { align: "right" });

  doc.setDrawColor(229, 231, 235).line(M, 96, W - M, 96);

  // ── Bill to / Payment ──
  const colY = 116;
  doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(...GRAY);
  doc.text("BILL TO", M, colY);
  doc.text("PAYMENT", W / 2 + 10, colY);

  doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(...DARK);
  doc.text(d.customer.name, M, colY + 16);
  doc.setFont("helvetica", "normal").setFontSize(9.5).setTextColor(55, 65, 81);
  doc.text(d.customer.phone, M, colY + 30);
  const addr = doc.splitTextToSize(`${d.customer.address}, ${d.customer.city}`, W / 2 - M - 20);
  doc.text(addr, M, colY + 43);

  const payLines = [
    `Method: ${label(d.paymentMethod)}`,
    d.advanceAmount > 0 ? `Advance sent via: ${label(d.advanceMethod ?? (d.paymentMethod !== "cod" ? d.paymentMethod : null))}` : "",
    d.trxId ? `TrxID: ${d.trxId}` : "",
    d.deliveryArea ? `Delivery: ${d.deliveryArea === "dhaka" ? "Inside Dhaka" : "Outside Dhaka"}` : "",
  ].filter(Boolean);
  doc.text(payLines, W / 2 + 10, colY + 16);

  // Status chip
  const status =
    d.paymentStatus === "verified" ? { t: "PAYMENT VERIFIED", c: [22, 163, 74] as [number, number, number] }
    : d.paymentStatus === "rejected" ? { t: "PAYMENT REJECTED", c: [220, 38, 38] as [number, number, number] }
    : { t: "PAYMENT UNDER REVIEW", c: [217, 119, 6] as [number, number, number] };
  doc.setFont("helvetica", "bold").setFontSize(8.5).setTextColor(...status.c);
  doc.text(status.t, W / 2 + 10, colY + 16 + payLines.length * 12 + 4);

  // ── Items table ──
  const tableY = colY + 43 + Math.max(addr.length, 1) * 12 + 24;
  autoTable(doc, {
    startY: Math.max(tableY, colY + 100),
    margin: { left: M, right: M },
    head: [["#", "Item", "Qty", "Unit price", "Amount"]],
    body: d.items.map((it, i) => [
      String(i + 1),
      it.variant ? `${it.name}\n${it.variant}` : it.name,
      String(it.quantity),
      bdt(it.price),
      bdt(it.price * it.quantity),
    ]),
    styles: { font: "helvetica", fontSize: 9.5, cellPadding: 7, textColor: [31, 41, 55], lineColor: [229, 231, 235] },
    headStyles: { fillColor: DARK, textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    columnStyles: {
      0: { cellWidth: 28, halign: "center" },
      2: { cellWidth: 36, halign: "center" },
      3: { halign: "right", cellWidth: 90 },
      4: { halign: "right", cellWidth: 90, fontStyle: "bold" },
    },
  });

  // ── Totals ──
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let y = ((doc as any).lastAutoTable?.finalY ?? 300) + 22;
  const labelX = W - M - 200;
  const row = (l: string, v: string, opts?: { bold?: boolean; color?: [number, number, number]; size?: number }) => {
    doc.setFont("helvetica", opts?.bold ? "bold" : "normal").setFontSize(opts?.size ?? 10).setTextColor(...(opts?.color ?? [55, 65, 81]));
    doc.text(l, labelX, y);
    doc.text(v, W - M, y, { align: "right" });
    y += 18;
  };
  row("Subtotal", bdt(d.subtotal));
  row("Delivery charge", bdt(d.deliveryCharge));
  doc.setDrawColor(209, 213, 219).line(labelX, y - 8, W - M, y - 8);
  y += 4;
  row("Total", bdt(d.total), { bold: true, size: 12, color: DARK });
  row("Advance paid", `- ${bdt(d.advanceAmount)}`, { color: [22, 163, 74] });
  y += 2;
  doc.setFillColor(255, 244, 238).roundedRect(labelX - 10, y - 14, 210 + 10, 30, 6, 6, "F");
  doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(...ORANGE);
  doc.text("Due on delivery", labelX, y + 5);
  doc.text(bdt(Math.max(0, d.total - d.advanceAmount)), W - M - 8, y + 5, { align: "right" });
  y += 40;

  if (d.note) {
    doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(...GRAY).text("ORDER NOTE", M, y);
    doc.setFont("helvetica", "normal").setFontSize(9.5).setTextColor(55, 65, 81);
    doc.text(doc.splitTextToSize(d.note, W - M * 2), M, y + 14);
  }

  // ── Footer ──
  const H = doc.internal.pageSize.getHeight();
  doc.setDrawColor(229, 231, 235).line(M, H - 70, W - M, H - 70);
  doc.setFont("helvetica", "normal").setFontSize(8.5).setTextColor(...GRAY);
  doc.text("Thank you for shopping with Pure Apple!", W / 2, H - 52, { align: "center" });
  doc.text("Your order is confirmed once the advance payment is verified by our team. This is a computer-generated invoice.", W / 2, H - 40, { align: "center" });

  return doc;
}

/** Invoice PDF বানিয়ে browser-এ download করায় */
export async function downloadInvoice(d: InvoiceData): Promise<void> {
  const logo = await loadLogo();
  buildInvoicePdf(d, logo).save(`${invoiceNo(d.orderId)}.pdf`);
}

// ── sessionStorage helper: success page-এ আবার download button দেখানোর জন্য ──
const KEY = (id: string) => `pa-invoice:${id}`;
export function stashInvoice(d: InvoiceData) {
  try { sessionStorage.setItem(KEY(d.orderId), JSON.stringify(d)); } catch { /* ignore */ }
}
export function readInvoice(id: string): InvoiceData | null {
  try { const s = sessionStorage.getItem(KEY(id)); return s ? (JSON.parse(s) as InvoiceData) : null; } catch { return null; }
}
