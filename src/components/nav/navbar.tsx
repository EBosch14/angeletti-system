"use client";
import { MainNav } from "@/components/nav/main_nav";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const { status } = useSession();

  return (
    <div className="border-b-2">
      <div className="flex items-center px-4 h-16">
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          {status === "authenticated" ? (
            <Button onClick={() => signOut()} variant="outline">
              Sign Out
            </Button>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
