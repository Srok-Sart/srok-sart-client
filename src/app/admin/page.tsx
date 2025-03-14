import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminContent from "./admin-content";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

export default async function AdminPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    redirect('/login');
  }

  return <AdminContent token={token} />;
}