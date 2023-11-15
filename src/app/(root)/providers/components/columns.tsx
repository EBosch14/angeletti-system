"use client";

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
    accessorKey: "tel",
    header: "Telefono",
  },
  {
    accessorKey: "tot_prods",
    header: "Productos comprados",
  },
  {
    accessorKey: "updated_at",
    header: "Fecha de creación",
  },
];
