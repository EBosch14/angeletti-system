"use client";

import Navbar from "@/components/navbar";
import { useSession } from "next-auth/react";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, status, update } = useSession();
  console.log(data?.user, status, update);

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
