"use client";

import Navbar from "@/components/navbar";
import { useSession } from "next-auth/react";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  console.log(session);

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
