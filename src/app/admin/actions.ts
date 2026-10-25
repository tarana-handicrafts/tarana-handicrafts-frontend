"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";
import { checkPassword, createSession, destroySession, requireAdmin } from "@/lib/adminAuth";
import { getDb, ENQUIRY_STATUSES, REVIEW_STATUSES, type EnquiryDoc, type EnquiryStatus, type ReviewDoc, type ReviewStatus } from "@/lib/mongodb";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export async function login(_prev: { error?: string } | undefined, formData: FormData) {
  const ip = clientIp(await headers());
  if (!rateLimit(`admin-login:${ip}`, 5, 15 * 60 * 1000)) {
    return { error: "Too many attempts. Try again in 15 minutes." };
  }
  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET) {
    return { error: "Admin is not configured. Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET." };
  }
  if (!checkPassword(String(formData.get("password") ?? ""))) {
    return { error: "Incorrect password." };
  }
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

function objectId(id: FormDataEntryValue | null): ObjectId {
  const s = String(id ?? "");
  if (!ObjectId.isValid(s)) throw new Error("Invalid id");
  return new ObjectId(s);
}

// ─── Enquiries ───

export async function setEnquiryStatus(formData: FormData) {
  await requireAdmin();
  const status = String(formData.get("status")) as EnquiryStatus;
  if (!ENQUIRY_STATUSES.includes(status)) throw new Error("Invalid status");
  const db = await getDb();
  await db.collection<EnquiryDoc>("enquiries").updateOne({ _id: objectId(formData.get("id")) }, { $set: { status, updatedAt: new Date() } });
  revalidatePath("/admin", "layout");
}

export async function addEnquiryNote(formData: FormData) {
  await requireAdmin();
  const text = String(formData.get("note") ?? "").trim().slice(0, 2000);
  if (!text) return;
  const db = await getDb();
  await db
    .collection<EnquiryDoc>("enquiries")
    .updateOne({ _id: objectId(formData.get("id")) }, { $push: { notes: { text, at: new Date() } }, $set: { updatedAt: new Date() } });
  revalidatePath("/admin", "layout");
}

export async function deleteEnquiry(formData: FormData) {
  await requireAdmin();
  const db = await getDb();
  await db.collection<EnquiryDoc>("enquiries").deleteOne({ _id: objectId(formData.get("id")) });
  revalidatePath("/admin", "layout");
}

// ─── Reviews ───

export async function setReviewStatus(formData: FormData) {
  await requireAdmin();
  const status = String(formData.get("status")) as ReviewStatus;
  if (!REVIEW_STATUSES.includes(status)) throw new Error("Invalid status");
  const db = await getDb();
  await db.collection<ReviewDoc>("reviews").updateOne({ _id: objectId(formData.get("id")) }, { $set: { status, updatedAt: new Date() } });
  revalidatePath("/admin", "layout");
}

export async function replyToReview(formData: FormData) {
  await requireAdmin();
  const reply = String(formData.get("reply") ?? "").trim().slice(0, 2000);
  const db = await getDb();
  await db
    .collection<ReviewDoc>("reviews")
    .updateOne(
      { _id: objectId(formData.get("id")) },
      reply ? { $set: { adminReply: reply, updatedAt: new Date() } } : { $unset: { adminReply: "" }, $set: { updatedAt: new Date() } }
    );
  revalidatePath("/admin", "layout");
}

export async function deleteReview(formData: FormData) {
  await requireAdmin();
  const db = await getDb();
  await db.collection<ReviewDoc>("reviews").deleteOne({ _id: objectId(formData.get("id")) });
  revalidatePath("/admin", "layout");
}
