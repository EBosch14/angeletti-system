"use client";

import { ColumnDef } from "@tanstack/react-table";
// import { CellAction } from "./cell-action";

export type ServicesColumn = {
  id: number;
  Client: string;
  description: string;
  state: string;
  price: string | number;
  created_at: string;
  is_paid: string;
};

export const columns: ColumnDef<ServicesColumn>[] = [
  {
    accessorKey: "id",
    header: "id",
  },
  {
    accessorKey: "Client",
    header: "Cliente",
  },
  {
    accessorKey: "description",
    header: "Descripcion",
  },
  {
    accessorKey: "state",
    header: "Estado",
  },
  {
    accessorKey: "created_at",
    header: "Fecha de entrada",
  },
  {
    accessorKey: "price",
    header: "Precio",
  },
  {
    accessorKey: "is_paid",
    header: "Pagado",
  },
];
