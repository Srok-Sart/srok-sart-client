import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Navigation from "../components/navigation";
import { PlantGrow } from "./components/plant-grow";

const Page = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    redirect("/login");
  }

  return (
    <>
      <Navigation />
      <div className='container mx-auto px-10 lg:px-24 py-10'>
        <PlantGrow />
      </div>
    </>
  );
};

export default Page;
