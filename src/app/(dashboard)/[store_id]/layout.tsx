import { options } from "@/app/api/auth/[...nextauth]/options";
import Navbar from "@/components/navbar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function Dashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  // const session = await getServerSession(options);

  // if (session) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
  // }

  // if (!session) {
  //   redirect("/sign_in");
  // }
}
