"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchActivityLogs, type ActivityLog } from "@/lib/adminApi";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ACTION_COLORS: Record<string, string> = {
  CREATE: "bg-green-100 text-green-700",
  UPDATE: "bg-blue-100 text-blue-700",
  DELETE: "bg-red-100 text-red-700",
  BULK_UPLOAD: "bg-purple-100 text-purple-700",
  EXPORT: "bg-teal-100 text-teal-700",
  LOGIN: "bg-amber-100 text-amber-700",
  LOGOUT: "bg-stone-100 text-stone-700",
};

export default function ActivityPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState("");
  const [page, setPage] = useState(1);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchActivityLogs({ page, limit: 20, action: actionFilter || undefined });
      setLogs(data.logs);
      setPagination(data.pagination);
    } catch {
      // handled silently
    } finally {
      setLoading(false);
    }
  }, [page, actionFilter]);

  useEffect(() => { loadLogs(); }, [loadLogs]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-800">Activity Logs</h1>
          <p className="text-sm text-stone-500">Track all admin actions</p>
        </div>
        <select value={actionFilter} onChange={(e) => { setActionFilter(e.target.value); setPage(1); }} className="rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-[#8B4513] focus:outline-none">
          <option value="">All Actions</option>
          <option value="CREATE">Create</option>
          <option value="UPDATE">Update</option>
          <option value="DELETE">Delete</option>
          <option value="BULK_UPLOAD">Bulk Upload</option>
          <option value="EXPORT">Export</option>
          <option value="LOGIN">Login</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Action</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Details</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">User</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {loading ? (
              <tr><td colSpan={4} className="py-10 text-center text-sm text-stone-400">Loading...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={4} className="py-10 text-center text-sm text-stone-400">No activity logs found</td></tr>
            ) : (
              logs.map((log) => (
                <tr key={log._id} className="hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${ACTION_COLORS[log.action] || "bg-stone-100 text-stone-700"}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-stone-700">{log.details}</td>
                  <td className="px-4 py-3 text-stone-600">{log.userName || log.user?.name || "System"}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-stone-500">{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-stone-500">Page {pagination.page} of {pagination.pages} ({pagination.total} total)</p>
          <div className="flex gap-1">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-stone-300 p-2 text-stone-600 hover:bg-stone-50 disabled:opacity-40">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button disabled={page >= pagination.pages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-stone-300 p-2 text-stone-600 hover:bg-stone-50 disabled:opacity-40">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
