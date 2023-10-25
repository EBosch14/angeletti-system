"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface AsideProps {
  routes: { label: string; route: string }[];
}

export const Aside: React.FC<AsideProps> = ({ routes }) => {
  const pathname = usePathname();
  const RoutesFormatted = routes.map((e) => {
    return { ...e, active: pathname === e.route };
  });

  return (
    <aside className="flex flex-col items-center bg-white gap-4 max-w-[100px]">
      {RoutesFormatted.map((e) => {
        return (
          <Link
            key={e.label}
            className={`flex w-full hover:text-blue-800 ${
              e.active ? "text-blue-800 font-bold" : ""
            }`}
            href={e.route}
          >
            {e.label}
          </Link>
        );
      })}
    </aside>
  );
};
