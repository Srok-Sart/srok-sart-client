import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import UploadRequest from "./upload-request";
import Navigation from "../components/navigation";

export default async function Page() {
  const cookieStore = cookies();
  const token = (await cookieStore).get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    redirect('/login');
  }

  return (
    <div>
      <Navigation />
      <UploadRequest token={token} />
    </div>
  );
}