"use client";

import { ColumnDef } from "@tanstack/react-table";

export type SizesColumn = {
  id: string;
  name: string;
  products: number;
};

export const columns: ColumnDef<SizesColumn>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected()}
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "id",
    header: "id",
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "products",
    header: "Productos",
  },
  // {
  //   id: "action",
  //   cell: ({ row }) => <CellAction data={row.original} />,
  // },
];
