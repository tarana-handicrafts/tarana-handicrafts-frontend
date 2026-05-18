"use client";

import { useState } from "react";
import { bulkUploadProducts, getTemplateDownloadUrl } from "@/lib/adminApi";
import { Upload, Download, FileSpreadsheet, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export default function BulkUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{
    success: number; failed: number; skipped: number; errors: { row: number; error: string }[];
  } | null>(null);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");
    setResult(null);
    try {
      const data = await bulkUploadProducts(file);
      setResult(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleTemplateDownload = () => {
    const token = localStorage.getItem("admin_token");
    fetch(getTemplateDownloadUrl(), { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "product-upload-template.xlsx";
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(() => setError("Failed to download template"));
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-stone-800">Bulk Upload</h1>
        <p className="text-sm text-stone-500">Upload products via Excel or CSV file</p>
      </div>

      {/* Template Download */}
      <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
            <FileSpreadsheet className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-stone-800">Download Template</h3>
            <p className="mt-1 text-xs text-stone-500">
              Download the Excel template with all required columns. Fill it with your product data and upload below.
            </p>
            <button onClick={handleTemplateDownload} className="mt-3 flex items-center gap-1.5 rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50">
              <Download className="h-3.5 w-3.5" /> Download Template
            </button>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-stone-800">Upload File</h3>
        <label className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 transition-colors ${file ? "border-[#8B4513] bg-[#8B4513]/5" : "border-stone-300 hover:border-[#8B4513]"}`}>
          <Upload className={`mb-3 h-10 w-10 ${file ? "text-[#8B4513]" : "text-stone-400"}`} />
          {file ? (
            <div className="text-center">
              <p className="text-sm font-medium text-stone-800">{file.name}</p>
              <p className="text-xs text-stone-500">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm font-medium text-stone-600">Click to select file</p>
              <p className="text-xs text-stone-400">Supports .xlsx, .xls, .csv (max 10MB)</p>
            </div>
          )}
          <input type="file" accept=".xlsx,.xls,.csv" onChange={(e) => { setFile(e.target.files?.[0] || null); setResult(null); setError(""); }} className="hidden" />
        </label>

        <button onClick={handleUpload} disabled={!file || uploading} className="mt-4 w-full rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#8B4513] disabled:opacity-50">
          {uploading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Uploading & Processing...
            </span>
          ) : "Upload Products"}
        </button>
      </div>

      {/* Error */}
      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {/* Results */}
      {result && (
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-stone-800">Upload Results</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-green-50 p-3 text-center">
              <CheckCircle className="mx-auto mb-1 h-5 w-5 text-green-600" />
              <p className="text-lg font-bold text-green-700">{result.success}</p>
              <p className="text-xs text-green-600">Uploaded</p>
            </div>
            <div className="rounded-lg bg-red-50 p-3 text-center">
              <XCircle className="mx-auto mb-1 h-5 w-5 text-red-600" />
              <p className="text-lg font-bold text-red-700">{result.failed}</p>
              <p className="text-xs text-red-600">Failed</p>
            </div>
            <div className="rounded-lg bg-amber-50 p-3 text-center">
              <AlertTriangle className="mx-auto mb-1 h-5 w-5 text-amber-600" />
              <p className="text-lg font-bold text-amber-700">{result.skipped}</p>
              <p className="text-xs text-amber-600">Skipped</p>
            </div>
          </div>
          {result.errors.length > 0 && (
            <div className="mt-4">
              <h4 className="mb-2 text-xs font-semibold text-stone-700">Errors:</h4>
              <div className="max-h-48 overflow-y-auto rounded-lg border border-stone-200 bg-stone-50 p-3">
                {result.errors.map((err, i) => (
                  <p key={i} className="text-xs text-stone-600">
                    <span className="font-medium text-red-600">Row {err.row}:</span> {err.error}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
