// File: src/app/publish/page.tsx
import { getCurrentUser } from "@/lib/getCurrentUser";
import { redirect } from "next/navigation";
import AddTenderPage from "./AddTenderPage"; // Adjust path as needed

export default async function PublishPage() {
  const user = await getCurrentUser();

  // Redirect to login if user is not authenticated
  if (!user) {
    redirect("/login");
  }

  const userInfo = {
    firstName: typeof user?.firstName === "string" ? user.firstName : undefined,
    lastName: typeof user?.lastName === "string" ? user.lastName : undefined,
  };

  return <AddTenderPage userInfo={userInfo} />;
}