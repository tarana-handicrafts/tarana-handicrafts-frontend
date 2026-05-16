import { cookies } from "next/headers";
import AdminLoginForm from "./AdminLoginForm";
import AdminProductForm from "./AdminProductForm";

const ADMIN_SESSION_VALUE = "authenticated";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  const isAuthed = session === ADMIN_SESSION_VALUE;

  if (!isAuthed) {
    return <AdminLoginForm />;
  }

  return <AdminProductForm />;
}

