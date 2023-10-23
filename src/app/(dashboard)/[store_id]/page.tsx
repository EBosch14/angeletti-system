import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function Dashboard() {
  const session = await getServerSession(options);

  if (session) {
    <div>Dashboard</div>;
  }

  if (!session) {
    redirect("/sign_in");
  }
}
