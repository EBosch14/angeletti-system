"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: ``,
      label: "general",
      active: pathname === ``,
    },
    {
      href: `/products`,
      label: "productos",
      active: pathname === `/products`,
    },
    {
      href: `/services`,
      label: "servicios",
      active: pathname === `/services`,
    },
    {
      href: `/clients`,
      label: "clientes",
      active: pathname === `/clients`,
    },
    {
      href: `/providers`,
      label: "proveedores",
      active: pathname === `/providers`,
    },
    {
      href: `/orders`,
      label: "ventas",
      active: pathname === `/orders`,
    },
    {
      href: `/settings`,
      label: "ajustes",
      active: pathname === `/settings`,
    },
    {
      href: `/categories`,
      label: "categorías",
      active: pathname === `/categories`,
    },
  ];

  return (
    <nav className={cn("flex items-center space-x-8 lg:space-x-10", className)}>
      {routes.map((route) => {
        return (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "font-medium transition-colors hover:text-primary capitalize",
              route.active
                ? "text-primary font-bold dark:text-primary"
                : "text-muted-foreground"
            )}>
            {route.label}
          </Link>
        );
      })}
    </nav>
  );
}
