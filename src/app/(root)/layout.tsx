import Navbar from "@/components/nav/navbar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { options } from "../api/auth/[...nextauth]/options";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(options);

  if (!session) {
    redirect("/sign_in");
  }

  if (session) {
    return (
      <>
        <Navbar />
        {children}
      </>
    );
  }
}
