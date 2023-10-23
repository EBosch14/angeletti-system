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
      href: `/${params.store_id}`,
      label: "general",
      active: pathname === `/${params.store_id}`,
    },
    {
      href: `/${params.store_id}/products`,
      label: "productos",
      active: pathname === `/${params.store_id}/products`,
    },
    {
      href: `/${params.store_id}/services`,
      label: "servicios",
      active: pathname === `/${params.store_id}/services`,
    },
    {
      href: `/${params.store_id}/clients`,
      label: "clientes",
      active: pathname === `/${params.store_id}/clients`,
    },
    {
      href: `/${params.store_id}/providers`,
      label: "proveedores",
      active: pathname === `/${params.store_id}/providers`,
    },
    {
      href: `/${params.store_id}/orders`,
      label: "ventas",
      active: pathname === `/${params.store_id}/orders`,
    },
    {
      href: `/${params.store_id}/settings`,
      label: "ajustes",
      active: pathname === `/${params.store_id}/settings`,
    },
    {
      href: `/${params.store_id}/categories`,
      label: "categorías",
      active: pathname === `/${params.store_id}/categories`,
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
            )}
          >
            {route.label}
          </Link>
        );
      })}
    </nav>
  );
}
