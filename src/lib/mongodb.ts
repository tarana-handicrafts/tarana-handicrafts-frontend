import { MongoClient, type Db, type Filter } from "mongodb";

/**
 * One MongoClient per server instance. In dev, the client is kept on globalThis
 * so hot reloads don't open a new connection pool each time.
 */
const globalForMongo = globalThis as unknown as { _mongoClient?: Promise<MongoClient> };

function clientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  globalForMongo._mongoClient ??= new MongoClient(uri, { maxPoolSize: 10, serverSelectionTimeoutMS: 5000 })
    .connect()
    .catch((err) => {
      // Let the next request retry instead of caching a failed connection.
      globalForMongo._mongoClient = undefined;
      throw err;
    });
  return globalForMongo._mongoClient;
}

let indexesReady: Promise<void> | undefined;

export async function getDb(): Promise<Db> {
  const db = (await clientPromise()).db(process.env.MONGODB_DB || "tarana");
  indexesReady ??= Promise.all([
    db.collection("enquiries").createIndex({ createdAt: -1 }),
    db.collection("enquiries").createIndex({ ref: 1 }, { unique: true }),
    db.collection("enquiries").createIndex({ type: 1, status: 1 }),
    db.collection("reviews").createIndex({ product: 1, status: 1, createdAt: -1 }),
  ])
    .then(() => undefined)
    .catch((err) => {
      indexesReady = undefined;
      console.error("[mongodb] index creation failed", err);
    });
  await indexesReady;
  return db;
}

export const ENQUIRY_TYPES = ["quote", "contact", "whatsapp_order"] as const;
export type EnquiryType = (typeof ENQUIRY_TYPES)[number];

export const ENQUIRY_STATUSES = ["new", "quoted", "negotiating", "won", "lost", "closed"] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export const REVIEW_STATUSES = ["pending", "approved", "rejected"] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

export interface EnquiryItem {
  /** Catalog slug; absent for custom items typed by the customer. */
  slug?: string;
  name: string;
  size?: string;
  quantity: number;
  unitPrice?: number;
}

export interface EnquiryDoc {
  ref: string;
  type: EnquiryType;
  status: EnquiryStatus;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  country?: string;
  subject?: string;
  message?: string;
  items: EnquiryItem[];
  total?: number;
  /** Extra form answers, e.g. customer type or incoterm, shown as label/value pairs. */
  details?: Record<string, string>;
  notes: { text: string; at: Date }[];
  ip?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Admin list/export filter from query params; unknown values are ignored. */
export function buildEnquiryFilter(params: { type?: string; status?: string; q?: string }): Filter<EnquiryDoc> {
  const filter: Filter<EnquiryDoc> = {};
  if (params.type && (ENQUIRY_TYPES as readonly string[]).includes(params.type)) filter.type = params.type as EnquiryType;
  if (params.status && (ENQUIRY_STATUSES as readonly string[]).includes(params.status)) filter.status = params.status as EnquiryStatus;
  const q = params.q?.trim().slice(0, 100);
  if (q) {
    const rx = { $regex: escapeRegex(q), $options: "i" };
    filter.$or = [{ ref: rx }, { name: rx }, { email: rx }, { phone: rx }, { company: rx }, { "items.name": rx }];
  }
  return filter;
}

export interface ReviewDoc {
  product: string;
  name: string;
  email?: string;
  rating: number;
  title?: string;
  content: string;
  status: ReviewStatus;
  adminReply?: string;
  ip?: string;
  createdAt: Date;
  updatedAt: Date;
}
