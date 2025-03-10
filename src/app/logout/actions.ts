"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  // Await the cookie store so we can use its methods
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");

  // Redirect to /login after deleting the cookie
  redirect("/login");
}
