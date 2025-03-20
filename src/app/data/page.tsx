import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PlantGrow } from "./components/plant-grow";
import NavigationWrapper from "../components/navigation-wrapper";

const Page = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    redirect("/login");
  }

  return (
    <>
      <NavigationWrapper />
      <div className='container mx-auto px-10 lg:px-24 py-10'>
        <PlantGrow />
      </div>
    </>
  );
};

export default Page;
