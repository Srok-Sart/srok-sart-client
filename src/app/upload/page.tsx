import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import UploadRequest from "./upload-request";
import NavigationWrapper from "../components/navigation-wrapper";

export default async function Page() {
  const cookieStore = cookies();
  const token = (await cookieStore).get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    redirect('/login');
  }

  return (
    <div>
      <NavigationWrapper />
      <UploadRequest token={token} />
    </div>
  );
}