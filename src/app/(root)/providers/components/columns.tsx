"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
// import { CellAction } from "./cell-action";

export type ProviderColumn = {
  id: number;
  name: string;
  tel: string;
  tot_prods: number;
  updated_at: string;
};

export const columns: ColumnDef<ProviderColumn>[] = [
  {
    accessorKey: "id",
    header: "id",
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "price",
    header: "Precio",
  },
  {
    accessorKey: "provider",
    header: "Proveedor",
  },
  {
    accessorKey: "created_at",
    header: "Fecha de creación",
  },
];
