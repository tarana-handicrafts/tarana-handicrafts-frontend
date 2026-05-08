import { NextResponse } from "next/server";

// Hardcoded admin credentials (update these values as needed).
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

// Hardcoded session token value.
const ADMIN_SESSION_VALUE = "authenticated";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { username?: string; password?: string };
    const username = String(body.username ?? "");
    const password = String(body.password ?? "");

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set("admin_session", ADMIN_SESSION_VALUE, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      // Keep short for security; adjust if you want longer sessions.
      maxAge: 60 * 60,
    });
    return res;
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}

