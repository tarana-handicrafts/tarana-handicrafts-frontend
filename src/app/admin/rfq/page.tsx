"use client";

import { useState, useEffect, useCallback } from "react";
import {
  fetchRFQs,
  fetchRFQById,
  updateRFQ,
  deleteRFQ,
  RFQ,
  RFQItem,
  RFQStatus,
} from "@/lib/adminApi";

const STATUSES: RFQStatus[] = [
  "new",
  "quoted",
  "negotiating",
  "sample",
  "won",
  "lost",
  "closed",
];

const STATUS_STYLES: Record<RFQStatus, string> = {
  new: "bg-blue-100 text-blue-700 ring-blue-200",
  quoted: "bg-indigo-100 text-indigo-700 ring-indigo-200",
  negotiating: "bg-amber-100 text-amber-700 ring-amber-200",
  sample: "bg-purple-100 text-purple-700 ring-purple-200",
  won: "bg-green-100 text-green-700 ring-green-200",
  lost: "bg-red-100 text-red-700 ring-red-200",
  closed: "bg-stone-200 text-stone-600 ring-stone-300",
};

const CUSTOMER_TYPES = [
  "retailer",
  "wholesaler",
  "importer",
  "distributor",
  "interior_designer",
  "hotel",
  "corporate_gifting",
  "other",
] as const;

const CUSTOMER_TYPE_LABELS: Record<string, string> = {
  retailer: "Retailer",
  wholesaler: "Wholesaler",
  importer: "Importer",
  distributor: "Distributor",
  interior_designer: "Interior Designer",
  hotel: "Hotel / Hospitality",
  corporate_gifting: "Corporate Gifting",
  other: "Other",
};

function customerTypeLabel(type?: string): string {
  if (!type) return "—";
  return CUSTOMER_TYPE_LABELS[type] || type;
}

function statusLabel(status: RFQStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function itemProductName(item: RFQItem): string {
  if (item.productId && typeof item.productId === "object" && item.productId.name) {
    return item.productId.name;
  }
  return item.productName || "Custom / unlisted item";
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: RFQStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[status]}`}
    >
      {statusLabel(status)}
    </span>
  );
}

export default function RFQPage() {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Filters & pagination
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });

  // Detail drawer
  const [selected, setSelected] = useState<RFQ | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [draftStatus, setDraftStatus] = useState<RFQStatus>("new");
  const [draftNotes, setDraftNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchRFQs({
        page,
        status: statusFilter,
        customerType: typeFilter,
      });
      setRfqs(data.rfqs);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load quote requests");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, typeFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openDetail = async (rfq: RFQ) => {
    setSelected(rfq);
    setDraftStatus(rfq.status);
    setDraftNotes(rfq.adminNotes || "");
    // Fetch full record (list populates fewer product fields)
    try {
      setDetailLoading(true);
      const { rfq: full } = await fetchRFQById(rfq._id);
      setSelected(full);
      setDraftStatus(full.status);
      setDraftNotes(full.adminNotes || "");
    } catch {
      // Keep the list version if detail fetch fails
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setSelected(null);
    setDetailLoading(false);
    setSaving(false);
  };

  const handleSave = async () => {
    if (!selected) return;
    setError("");
    setSuccess("");
    try {
      setSaving(true);
      const { rfq: updated } = await updateRFQ(selected._id, {
        status: draftStatus,
        adminNotes: draftNotes,
      });
      setSuccess(`Quote ${updated.quoteRef} updated`);
      // Reflect changes in the list without a full reload
      setRfqs((prev) =>
        prev.map((r) =>
          r._id === updated._id
            ? { ...r, status: updated.status, adminNotes: updated.adminNotes }
            : r
        )
      );
      setSelected((prev) =>
        prev ? { ...prev, status: updated.status, adminNotes: updated.adminNotes } : prev
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update quote");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (rfq: RFQ) => {
    if (!confirm(`Delete quote request ${rfq.quoteRef} from ${rfq.name}? This cannot be undone.`)) {
      return;
    }
    setError("");
    setSuccess("");
    try {
      await deleteRFQ(rfq._id);
      setSuccess(`Quote ${rfq.quoteRef} deleted`);
      if (selected?._id === rfq._id) closeDetail();
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete quote");
    }
  };

  const changeStatusFilter = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const changeTypeFilter = (value: string) => {
    setTypeFilter(value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quote Requests</h1>
          <p className="text-gray-500">
            Track and manage incoming RFQs through your sales pipeline
          </p>
        </div>
        <button
          onClick={loadData}
          className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          {error}
          <button onClick={() => setError("")} className="ml-2 font-bold">
            &times;
          </button>
        </div>
      )}
      {success && (
        <div className="rounded-lg bg-green-50 p-4 text-green-700">
          {success}
          <button onClick={() => setSuccess("")} className="ml-2 font-bold">
            &times;
          </button>
        </div>
      )}

      {/* Status filter tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => changeStatusFilter("")}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            statusFilter === ""
              ? "bg-stone-900 text-white"
              : "bg-white text-gray-600 ring-1 ring-inset ring-gray-200 hover:bg-gray-50"
          }`}
        >
          All
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => changeStatusFilter(s)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === s
                ? "bg-stone-900 text-white"
                : "bg-white text-gray-600 ring-1 ring-inset ring-gray-200 hover:bg-gray-50"
            }`}
          >
            {statusLabel(s)}
          </button>
        ))}
      </div>

      {/* Customer type filter */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">Customer type</label>
        <select
          value={typeFilter}
          onChange={(e) => changeTypeFilter(e.target.value)}
          className="rounded-lg border px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="">All types</option>
          {CUSTOMER_TYPES.map((t) => (
            <option key={t} value={t}>
              {CUSTOMER_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
        <span className="ml-auto text-sm text-gray-500">
          {pagination.total} request{pagination.total === 1 ? "" : "s"}
        </span>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
        </div>
      ) : rfqs.length === 0 ? (
        <div className="rounded-lg border bg-white py-12 text-center text-gray-500">
          No quote requests found{statusFilter || typeFilter ? " for this filter." : " yet."}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Received</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rfqs.map((rfq) => (
                  <tr
                    key={rfq._id}
                    className="cursor-pointer hover:bg-stone-50"
                    onClick={() => openDetail(rfq)}
                  >
                    <td className="px-4 py-3 font-mono text-xs font-medium text-gray-900">
                      {rfq.quoteRef}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{rfq.name}</div>
                      <div className="text-xs text-gray-500">
                        {rfq.company ? `${rfq.company} · ` : ""}
                        {rfq.country || rfq.email}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {customerTypeLabel(rfq.customerType)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {rfq.items.length > 0
                        ? `${rfq.items.length} item${rfq.items.length === 1 ? "" : "s"}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={rfq.status} />
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {formatDate(rfq.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetail(rfq);
                        }}
                        className="rounded-lg border px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.pages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={page >= pagination.pages}
              onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
              className="rounded-lg border px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Detail slide-over */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeDetail}
          />
          <div className="relative flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-xl">
            {/* Drawer header */}
            <div className="sticky top-0 z-10 flex items-start justify-between border-b bg-white px-5 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-gray-900">
                    {selected.quoteRef}
                  </span>
                  <StatusBadge status={selected.status} />
                </div>
                <p className="mt-0.5 text-xs text-gray-500">
                  Received {formatDate(selected.createdAt)}
                </p>
              </div>
              <button
                onClick={closeDetail}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 space-y-6 px-5 py-5">
              {/* Contact */}
              <section>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Contact
                </h3>
                <dl className="space-y-1.5 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-gray-500">Name</dt>
                    <dd className="text-right font-medium text-gray-900">{selected.name}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-gray-500">Email</dt>
                    <dd className="text-right">
                      <a href={`mailto:${selected.email}`} className="text-blue-600 hover:underline">
                        {selected.email}
                      </a>
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-gray-500">Phone</dt>
                    <dd className="text-right">
                      <a href={`tel:${selected.phone}`} className="text-blue-600 hover:underline">
                        {selected.phone}
                      </a>
                    </dd>
                  </div>
                  {selected.company && (
                    <div className="flex justify-between gap-3">
                      <dt className="text-gray-500">Company</dt>
                      <dd className="text-right font-medium text-gray-900">{selected.company}</dd>
                    </div>
                  )}
                  {selected.country && (
                    <div className="flex justify-between gap-3">
                      <dt className="text-gray-500">Country</dt>
                      <dd className="text-right text-gray-900">{selected.country}</dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-3">
                    <dt className="text-gray-500">Customer type</dt>
                    <dd className="text-right text-gray-900">
                      {customerTypeLabel(selected.customerType)}
                    </dd>
                  </div>
                </dl>
              </section>

              {/* Requested items */}
              <section>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Requested items
                </h3>
                {selected.items.length === 0 ? (
                  <p className="text-sm text-gray-500">No line items provided.</p>
                ) : (
                  <ul className="divide-y divide-gray-100 rounded-lg border">
                    {selected.items.map((item, idx) => (
                      <li key={idx} className="flex items-center justify-between px-3 py-2 text-sm">
                        <span className="text-gray-900">{itemProductName(item)}</span>
                        <span className="font-medium text-gray-600">Qty: {item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {/* Export / sourcing details */}
              {(selected.targetPrice ||
                selected.incoterm ||
                selected.destinationPort ||
                selected.requiredBy) && (
                <section>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Sourcing details
                  </h3>
                  <dl className="space-y-1.5 text-sm">
                    {selected.targetPrice && (
                      <div className="flex justify-between gap-3">
                        <dt className="text-gray-500">Target price</dt>
                        <dd className="text-right text-gray-900">{selected.targetPrice}</dd>
                      </div>
                    )}
                    {selected.incoterm && (
                      <div className="flex justify-between gap-3">
                        <dt className="text-gray-500">Incoterm</dt>
                        <dd className="text-right text-gray-900">{selected.incoterm}</dd>
                      </div>
                    )}
                    {selected.destinationPort && (
                      <div className="flex justify-between gap-3">
                        <dt className="text-gray-500">Destination port</dt>
                        <dd className="text-right text-gray-900">{selected.destinationPort}</dd>
                      </div>
                    )}
                    {selected.requiredBy && (
                      <div className="flex justify-between gap-3">
                        <dt className="text-gray-500">Required by</dt>
                        <dd className="text-right text-gray-900">{selected.requiredBy}</dd>
                      </div>
                    )}
                  </dl>
                </section>
              )}

              {/* Message */}
              {selected.message && (
                <section>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Message
                  </h3>
                  <p className="whitespace-pre-wrap rounded-lg bg-stone-50 p-3 text-sm text-gray-700">
                    {selected.message}
                  </p>
                </section>
              )}

              {/* Pipeline controls */}
              <section className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Pipeline
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={draftStatus}
                      onChange={(e) => setDraftStatus(e.target.value as RFQStatus)}
                      className="w-full rounded-lg border bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {statusLabel(s)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Internal notes
                    </label>
                    <textarea
                      value={draftNotes}
                      onChange={(e) => setDraftNotes(e.target.value)}
                      rows={4}
                      maxLength={2000}
                      placeholder="Add quote details, follow-up actions, negotiation notes…"
                      className="w-full rounded-lg border bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={saving || detailLoading}
                    className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Saving…" : "Save changes"}
                  </button>
                </div>
              </section>
            </div>

            {/* Drawer footer */}
            <div className="sticky bottom-0 border-t bg-white px-5 py-3">
              <button
                onClick={() => handleDelete(selected)}
                className="text-sm font-medium text-red-600 hover:text-red-700"
              >
                Delete this request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
