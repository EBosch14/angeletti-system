import Navbar from "@/components/nav/navbar";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { JWT } from "next-auth/jwt";
import prismadb from "@/lib/prismadb";
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
