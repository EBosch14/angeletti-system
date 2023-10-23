import { getServerSession } from "next-auth";
import React from "react";
import { options } from "./api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";

const Home = async () => {
  const session = await getServerSession(options);

  if (session) {
    const store = await prismadb.store.findFirst({
      where: {
        username: session.user.username,
      },
    });

    redirect(`/${store?.id}`);
  }

  if (!session) {
    redirect("/sign_in");
  }
};

export default Home;
