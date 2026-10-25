import Link from "next/link";
import { Download, Mail, Phone } from "lucide-react";
import { requireAdmin } from "@/lib/adminAuth";
import { getDb, buildEnquiryFilter, ENQUIRY_STATUSES, ENQUIRY_TYPES, type EnquiryDoc } from "@/lib/mongodb";
import { formatPrice } from "@/lib/utils";
import { addEnquiryNote, deleteEnquiry, setEnquiryStatus } from "../../actions";
import { AutoSubmitSelect } from "../AutoSubmitSelect";
import { ConfirmButton } from "../ConfirmButton";
import { STATUS_STYLES, TYPE_LABELS, formatDate } from "../labels";

type SearchParams = Promise<{ type?: string; status?: string; q?: string }>;

export default async function EnquiriesPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const params = await searchParams;
  const db = await getDb();
  const enquiries = await db
    .collection<EnquiryDoc>("enquiries")
    .find(buildEnquiryFilter(params), { projection: { ip: 0, userAgent: 0 } })
    .sort({ createdAt: -1 })
    .limit(200)
    .toArray();

  const exportQuery = new URLSearchParams(Object.entries(params).filter(([, v]) => v) as [string, string][]).toString();
  const control = "rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm";

  return (
    <div className="max-w-6xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-3xl">Enquiries</h1>
        <a href={`/admin/export?${exportQuery}`} className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm hover:border-[#8B4513]">
          <Download className="h-4 w-4" /> Export CSV
        </a>
      </div>

      <form className="mb-6 flex flex-wrap gap-3" role="search">
        <select name="type" defaultValue={params.type ?? ""} className={control} aria-label="Type">
          <option value="">All types</option>
          {ENQUIRY_TYPES.map((t) => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
        </select>
        <select name="status" defaultValue={params.status ?? ""} className={control} aria-label="Status">
          <option value="">All statuses</option>
          {ENQUIRY_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input name="q" defaultValue={params.q ?? ""} placeholder="Ref, name, email, phone, product…" className={`${control} min-w-60 flex-1`} aria-label="Search" />
        <button type="submit" className="rounded-lg bg-[#8B4513] px-4 py-2 text-sm text-white">Filter</button>
        {(params.type || params.status || params.q) && <Link href="/admin/enquiries" className="self-center text-sm text-stone-500 hover:underline">Clear</Link>}
      </form>

      <p className="mb-4 text-sm text-stone-500">{enquiries.length}{enquiries.length === 200 ? "+" : ""} result{enquiries.length === 1 ? "" : "s"}</p>

      <div className="space-y-4">
        {enquiries.map((e) => {
          const id = e._id.toString();
          const waNumber = e.phone?.replace(/\D/g, "");
          return (
            <article key={id} className="rounded-xl border border-stone-200 bg-white p-5">
              <header className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-mono text-xs text-stone-500">{e.ref}</span>
                    <span className="rounded bg-stone-100 px-2 py-0.5 text-xs">{TYPE_LABELS[e.type]}</span>
                    <span className="text-stone-400">{formatDate(e.createdAt)}</span>
                  </p>
                  <h2 className="mt-1 font-semibold">{e.name || (e.type === "whatsapp_order" ? "WhatsApp customer (see chat)" : "—")}{e.company && <span className="font-normal text-stone-500"> · {e.company}</span>}</h2>
                  <p className="mt-1 flex flex-wrap gap-4 text-sm text-stone-600">
                    {e.email && <a href={`mailto:${e.email}`} className="flex items-center gap-1 hover:underline"><Mail className="h-3.5 w-3.5" />{e.email}</a>}
                    {e.phone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{e.phone}</span>}
                    {waNumber && waNumber.length >= 10 && <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="text-[#1a9e4b] hover:underline">WhatsApp</a>}
                    {e.country && <span>{e.country}</span>}
                  </p>
                </div>
                <form action={setEnquiryStatus} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={id} />
                  <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_STYLES[e.status]}`}>{e.status}</span>
                  <AutoSubmitSelect name="status" defaultValue={e.status} options={ENQUIRY_STATUSES} className="rounded border border-stone-200 px-2 py-1 text-sm" />
                </form>
              </header>

              {e.subject && <p className="mb-1 text-sm font-medium">{e.subject}</p>}
              {e.message && <p className="mb-3 whitespace-pre-line text-sm text-stone-700">{e.message}</p>}

              {e.details && (
                <dl className="mb-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                  {Object.entries(e.details).map(([k, v]) => (
                    <div key={k} className="flex gap-2"><dt className="text-stone-500">{k}:</dt><dd>{v}</dd></div>
                  ))}
                </dl>
              )}

              {e.items.length > 0 && (
                <table className="mb-3 w-full text-sm">
                  <tbody>
                    {e.items.map((i, idx) => (
                      <tr key={idx} className="border-t border-stone-100">
                        <td className="py-1.5">{i.slug ? <Link href={`/products/${i.slug}`} target="_blank" className="hover:underline">{i.name}</Link> : <span>{i.name} <span className="text-xs text-stone-400">(custom)</span></span>}{i.size && <span className="text-stone-500"> · {i.size}</span>}</td>
                        <td className="py-1.5 text-right">× {i.quantity}</td>
                        <td className="w-28 py-1.5 text-right text-stone-500">{i.unitPrice != null ? formatPrice(i.unitPrice) : ""}</td>
                      </tr>
                    ))}
                    {e.total != null && (
                      <tr className="border-t border-stone-200 font-semibold">
                        <td className="py-1.5" colSpan={2}>Total</td>
                        <td className="py-1.5 text-right">{formatPrice(e.total)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {e.notes.length > 0 && (
                <ul className="mb-3 space-y-1 rounded-lg bg-amber-50 p-3 text-sm">
                  {e.notes.map((n, idx) => (
                    <li key={idx}><span className="text-xs text-stone-400">{formatDate(n.at)}</span> — {n.text}</li>
                  ))}
                </ul>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <form action={addEnquiryNote} className="flex flex-1 gap-2">
                  <input type="hidden" name="id" value={id} />
                  <input name="note" placeholder="Add a note (price quoted, follow-up date…)" maxLength={2000} className="min-w-0 flex-1 rounded-lg border border-stone-200 px-3 py-1.5 text-sm" />
                  <button type="submit" className="rounded-lg border border-stone-200 px-3 py-1.5 text-sm hover:border-[#8B4513]">Add note</button>
                </form>
                <form action={deleteEnquiry}>
                  <input type="hidden" name="id" value={id} />
                  <ConfirmButton message={`Delete ${e.ref}? This cannot be undone.`} className="text-sm text-red-600 hover:underline">Delete</ConfirmButton>
                </form>
              </div>
            </article>
          );
        })}
      </div>
      {enquiries.length === 0 && <p className="text-stone-500">No enquiries match these filters.</p>}
      <p className="mt-8 text-xs text-stone-400">
        Tip: WhatsApp orders are logged when a customer taps checkout, before they actually send the message. Match the ref (e.g. WA-ABC123) with the chat; mark orders that never arrived as &ldquo;lost&rdquo;.
      </p>
    </div>
  );
}
