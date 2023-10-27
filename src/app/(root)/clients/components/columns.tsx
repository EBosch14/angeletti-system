"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type ClientColumn = {
  id: number;
  name: string;
  phone: string;
  city?: string;
  orders: number;
  services: number;
  created_at: string;
};

export const columns: ColumnDef<ClientColumn>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "phone",
    header: "Telefono",
  },
  {
    accessorKey: "city",
    header: "Ciudad",
  },
  {
    accessorKey: "orders",
    header: "Compras",
  },
  {
    accessorKey: "services",
    header: "Servicios",
  },
  {
    accessorKey: "created_at",
    header: "Fecha de creación",
  },
  {
    id: "action",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
